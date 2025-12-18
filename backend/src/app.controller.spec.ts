import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private config: ConfigService,
    private jwtService: JwtService
  ) {
    const supabaseUrl = this.config.get<string>('SUPABASE_URL')!;
    const supabaseServiceKey =
      this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!;

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  // ----------------------------------------------------
  // SIGNUP
  // ----------------------------------------------------
  async signup(
    { name, email, password }: { name: string; email: string; password: string },
    ip: string,
    userAgent: string
  ) {
    const { data: existing } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      return { statusCode: 400, message: 'Email already registered' };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verifyToken = randomUUID();

    const { data: user, error } = await this.supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash: passwordHash,
        verified: false,
        email_verify_token: verifyToken,
      })
      .select()
      .single();

    if (error) throw error;

    // 🔔 Mock email
    const verifyLink = `http://localhost:3000/auth/verify?token=${verifyToken}`;
    console.log('📧 VERIFY EMAIL LINK:', verifyLink);

    return {
      message: 'Signup successful. Please verify your email.',
    };
  }

  // ----------------------------------------------------
  // VERIFY EMAIL (STEP 4)
  // ----------------------------------------------------
  async verifyEmail(token: string) {
    if (!token) {
      return { statusCode: 400, message: 'Invalid token' };
    }

    const { data: user } = await this.supabase
      .from('users')
      .select('id, verified')
      .eq('email_verify_token', token)
      .maybeSingle();

    if (!user) {
      return { statusCode: 400, message: 'Invalid or expired token' };
    }

    if (user.verified) {
      return { message: 'Email already verified' };
    }

    await this.supabase
      .from('users')
      .update({
        verified: true,
        email_verify_token: null,
      })
      .eq('id', user.id);

    return { message: '✅ Email verified successfully' };
  }

  // ----------------------------------------------------
  // SIGNIN
  // ----------------------------------------------------
  async signin(
    { email, password }: { email: string; password: string },
    ip: string,
    userAgent: string
  ) {
    const { data: user } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      return { statusCode: 400, message: 'Invalid credentials' };
    }

    if (!user.verified) {
      return {
        statusCode: 401,
        message: 'Please verify your email first',
      };
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return { statusCode: 400, message: 'Invalid credentials' };
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return {
      message: 'Signin successful',
      token,
      user,
    };
  }
}

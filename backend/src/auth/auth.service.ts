import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(private jwtService: JwtService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase environment variables');
    }

    this.supabase = createClient(supabaseUrl, serviceRoleKey);
  }

  // ---------------- SIGNUP (SUPABASE AUTH) ----------------
  async signup({ name, email, password }) {
    // 1️⃣ Create auth user (Supabase sends verification email automatically)
    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // IMPORTANT
      user_metadata: { name },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // 2️⃣ Optional: store profile data
    await this.supabase.from('users').insert({
      id: data.user.id,
      name,
      email,
      two_factor_enabled: false,
    });

    return {
      message: 'Signup successful. Check your email to verify your account.',
    };
  }

  // ---------------- SIGNIN ----------------
  async signin({ email, password }) {
    // 1️⃣ Verify credentials
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException('Invalid credentials');
    }

    // 2️⃣ Check email verification
    if (!data.user.email_confirmed_at) {
      throw new BadRequestException('Verify your email first');
    }

    // 3️⃣ Issue your own JWT (optional but fine)
    const token = await this.jwtService.signAsync({
      sub: data.user.id,
      email: data.user.email,
    });

    return { token };
  }

  // ---------------- 2FA SETUP ----------------
  async setup2FA(userId: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(userId, 'AuthApp', secret);
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    await this.supabase
      .from('users')
      .update({
        two_factor_secret: secret,
        two_factor_enabled: false,
      })
      .eq('id', userId);

    return { qrCode, manualKey: secret };
  }

  // ---------------- CONFIRM 2FA ----------------
  async verify2FASetup(userId: string, otp: string) {
    const { data: user } = await this.supabase
      .from('users')
      .select('two_factor_secret')
      .eq('id', userId)
      .maybeSingle();

    if (!user?.two_factor_secret) {
      throw new BadRequestException('2FA not initialized');
    }

    const valid = authenticator.verify({
      token: otp,
      secret: user.two_factor_secret,
    });

    if (!valid) {
      throw new BadRequestException('Invalid OTP');
    }

    await this.supabase
      .from('users')
      .update({ two_factor_enabled: true })
      .eq('id', userId);

    return { message: '2FA enabled successfully' };
  }
}

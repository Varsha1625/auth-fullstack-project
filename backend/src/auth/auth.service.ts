import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

  // ---------------- SIGNUP ----------------
  async signup({ name, email, password }) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // 👈 AUTO CONFIRM
      user_metadata: { name },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Optional profile table
    await this.supabase.from('users').insert({
      id: data.user.id,
      name,
      email,
    });

    return { message: 'Signup successful. You can now sign in.' };
  }

  // ---------------- SIGNIN ----------------
  async signin({ email, password }) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = await this.jwtService.signAsync({
      sub: data.user.id,
      email: data.user.email,
    });

    return { token };
  }
}

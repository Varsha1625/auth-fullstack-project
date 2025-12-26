import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  private backendUrl: string;

  constructor(
    private config: ConfigService,
    private jwtService: JwtService
  ) {

    console.log('🔎 SUPABASE_URL:', process.env.SUPABASE_URL);
    console.log('🔎 SERVICE_ROLE_KEY EXISTS:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

    this.supabase = createClient(
      this.config.get<string>('SUPABASE_URL')!,
      this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!
    );

    this.backendUrl =
      this.config.get<string>('BACKEND_URL') || 'http://localhost:3000';
  }

  // ---------------- LOG ATTEMPTS ----------------
  private async logAttempt(
    userId: string | null,
    status: string,
    ip: string,
    userAgent: string
  ) {
    try {
      await this.supabase.from('login_attempts').insert({
        user_id: userId,
        status,
        ip_address: ip,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('⚠️ Failed to log attempt:', err);
    }
  }

  // ---------------- SIGNUP ----------------
  async signup(
    { name, email, password },
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

    const password_hash = await bcrypt.hash(password, 10);

    const { data: user, error } = await this.supabase
      .from('users')
      .insert({
        name,
        email,
        password_hash,
        verified: false,
        two_factor_enabled: false,
      })
      .select()
      .single();

    if (error || !user) {
      throw new BadRequestException('Failed to create user');
    }

    // 🔑 Create email verification token
    const token = randomBytes(32).toString('hex');

    await this.supabase.from('email_verification_tokens').insert({
      user_id: user.id,
      token,
      created_at: new Date().toISOString(),
    });

    // ✅ Production-safe verification link
    const verifyLink = `${this.backendUrl}/auth/verify-email?token=${token}`;
    console.log('📧 VERIFY EMAIL LINK:', verifyLink);

    await this.logAttempt(user.id, 'signup_success', ip, userAgent);

    return {
      message: 'Signup successful. Please verify your email.',
    };
  }

  // ---------------- VERIFY EMAIL ----------------
  async verifyEmail(token: string) {
    const { data: record } = await this.supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (!record) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.supabase
      .from('users')
      .update({ verified: true })
      .eq('id', record.user_id);

    await this.supabase
      .from('email_verification_tokens')
      .delete()
      .eq('id', record.id);

    return { message: 'Email verified successfully 🎉' };
  }

  // ---------------- SIGNIN ----------------
  async signin(
    { email, password },
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
      return { statusCode: 400, message: 'Verify your email first' };
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      await this.logAttempt(user.id, 'wrong_password', ip, userAgent);
      return { statusCode: 400, message: 'Invalid credentials' };
    }

    // 🔐 2FA required
    if (user.two_factor_enabled) {
      return {
        twoFactorRequired: true,
        userId: user.id,
        message: 'OTP required',
      };
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    await this.logAttempt(user.id, 'signin_success', ip, userAgent);
    return { token, user };
  }

  // ---------------- 2FA SETUP ----------------
  async setup2FA(userId: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      userId,
      'AuthApp',
      secret
    );

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

    if (!user || !user.two_factor_secret) {
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

  // ---------------- VERIFY 2FA LOGIN ----------------
  async verify2FALogin(userId: string, otp: string) {
    const { data: user } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!user || !user.two_factor_secret) {
      throw new BadRequestException('Invalid 2FA state');
    }

    const valid = authenticator.verify({
      token: otp,
      secret: user.two_factor_secret,
    });

    if (!valid) {
      throw new BadRequestException('Invalid OTP');
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { token, user };
  }
}

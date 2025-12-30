import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly svc: AuthService) {}

  // ---------- SIGNUP ----------
  @Post('signup')
  signup(@Body() body: { name: string; email: string; password: string }) {
    return this.svc.signup(body);
  }

  // ---------- SIGNIN ----------
  @Post('signin')
  signin(@Body() body: { email: string; password: string }) {
    return this.svc.signin(body);
  }

  // ---------- 2FA SETUP ----------
  @Post('2fa/setup')
  setup2FA(@Body('userId') userId: string) {
    return this.svc.setup2FA(userId);
  }

  // ---------- 2FA VERIFY ----------
  @Post('2fa/verify')
  verify2FA(@Body() body: { userId: string; otp: string }) {
    return this.svc.verify2FASetup(body.userId, body.otp);
  }
}

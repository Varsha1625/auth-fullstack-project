import { Controller, Post, Body, Req, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  @Post('signup')
  signup(@Body() body, @Req() req) {
    return this.svc.signup(body, req.ip, req.headers['user-agent']);
  }

  @Post('signin')
  signin(@Body() body, @Req() req) {
    return this.svc.signin(body, req.ip, req.headers['user-agent']);
  }

  @Post('2fa/setup')
  setup2FA(@Body('userId') userId: string) {
    return this.svc.setup2FA(userId);
  }

  @Post('2fa/verify')
  verify2FA(@Body() body) {
    return this.svc.verify2FASetup(body.userId, body.otp);
  }

  @Post('2fa/login')
  verify2FALogin(@Body() body) {
    return this.svc.verify2FALogin(body.userId, body.otp);
  }

// ✅ EMAIL VERIFICATION ROUTE
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      return { statusCode: 400, message: 'Token missing' };
    }

    return this.svc.verifyEmail(token);
  }
}

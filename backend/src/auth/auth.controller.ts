import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  private getIp(req: Request) {
    const xff = req.headers['x-forwarded-for'];
    if (xff && typeof xff === 'string') return xff.split(',')[0].trim();
    return req.socket.remoteAddress || '';
  }

  @Post('signup')
  async signup(@Body() body: any, @Req() req: Request) {
    const ip = this.getIp(req);
    const ua = req.headers['user-agent'] || '';
    return this.svc.signup(body, ip, ua);
  }

  @Post('signin')
  async signin(@Body() body: any, @Req() req: Request) {
    const ip = this.getIp(req);
    const ua = req.headers['user-agent'] || '';
    return this.svc.signin(body, ip, ua);
  }
}

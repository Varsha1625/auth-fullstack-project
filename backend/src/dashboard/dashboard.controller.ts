import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';
import type { Request } from 'express';

@Controller('dashboard')
export class DashboardController {
  constructor(private svc: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('attempts')
  async getAttempts(@Req() req: Request) {
    const user = req['user'];
    return this.svc.getAttempts(user.sub);
  }
}

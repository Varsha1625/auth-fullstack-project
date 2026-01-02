import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private svc: AuthService) {}

  @Post('signup')
  signup(@Body() body) {
    return this.svc.signup(body);
  }

  @Post('signin')
  signin(@Body() body) {
    return this.svc.signin(body);
  }
}

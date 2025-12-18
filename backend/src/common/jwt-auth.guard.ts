import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private jwt = new JwtService({ secret: process.env.JWT_SECRET });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string;
    if (!auth) return false;

    const token = auth.replace('Bearer ', '');
    try {
      const payload = this.jwt.verify(token);
      req.user = payload;
      return true;
    } catch {
      return false;
    }
  }
}

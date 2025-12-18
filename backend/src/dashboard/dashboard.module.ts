import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
     signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 3600 },
    }),
  ],
  controllers: [DashboardController],
  providers: [AuthService],
})
export class DashboardModule {}

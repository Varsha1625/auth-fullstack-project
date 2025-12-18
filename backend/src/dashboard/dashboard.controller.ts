import { Controller, Get, Req } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Controller('dashboard')
export class DashboardController {
  private supabase;

  constructor(private config: ConfigService) {
    this.supabase = createClient(
      this.config.get('SUPABASE_URL')!,
      this.config.get('SUPABASE_SERVICE_ROLE_KEY')!
    );
  }

  // -----------------------------
  // RAW LOGIN ATTEMPTS (existing)
  // -----------------------------
  @Get('attempts')
  async getAttempts() {
    const { data, error } = await this.supabase
      .from('sign_in_attempts')
      .select('attempted_at, user_id')
      .order('attempted_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  }

  // -----------------------------
  // SIGN-INS PER HOUR (NEW)
  // -----------------------------
  @Get('signins-hourly')
  async getSigninsPerHour() {
    const { data, error } = await this.supabase.rpc('signins_per_hour');

    if (error) throw error;
    return data;
  }
}

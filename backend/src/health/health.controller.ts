import { Controller, Get } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

@Controller('health')
export class HealthController {

  @Get()
  health() {
    return {
      status: 'ok',
      server: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('supabase')
  async supabaseHealth() {
    try {
      // 🔥 Create Supabase client INSIDE the method
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error } = await supabase.from('users').select('id').limit(1);

      if (error) throw error;

      return { status: 'ok', supabase: 'connected' };
    } catch (err) {
      return {
        status: 'error',
        supabase: 'connection_failed',
        message: err.message,
      };
    }
  }

  @Get('ip')
  async ipHealth() {
    try {
      const url = `${process.env.IP_API}/8.8.8.8/json/`;
      await axios.get(url);

      return { status: 'ok', ip_api: 'reachable' };
    } catch {
      return { status: 'error', ip_api: 'unreachable' };
    }
  }
}

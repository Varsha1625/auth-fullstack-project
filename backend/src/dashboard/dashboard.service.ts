import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private supabase: SupabaseService) {}

  async getAttempts(userId: string) {
    if (!userId) {
      throw new UnauthorizedException('Invalid user ID');
    }

    console.log('📌 DashboardService.getAttempts() using userId:', userId);

    // JOIN login_attempts + users to get email
    const { data, error } = await this.supabase.client
      .from('login_attempts')
      .select(`
        id,
        status,
        ip_address,
        user_agent,
        created_at,
        users:user_id (
          email
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ SUPABASE ERROR IN DASHBOARD SERVICE:', error);
    }

    // flatten email from nested users object
    return data?.map((row: any) => ({
      email: row.users?.email ?? null,
      created_at: row.created_at,
      status: row.status,
      ip_address: row.ip_address,
      user_agent: row.user_agent
    })) ?? [];
  }
  async getSigninStats(userId: string) {
  const { data, error } = await this.supabase.client
    .from('sign_in_attempts')
    .select('attempted_at')
    .eq('user_id', userId);

  if (error) throw error;

  const byHour: Record<number, number> = {};

  data.forEach(row => {
    const hour = new Date(row.attempted_at).getHours();
    byHour[hour] = (byHour[hour] || 0) + 1;
  });

  // 🔹 CONVERT object → chart-friendly array
  return Object.entries(byHour)
    .sort(([a], [b]) => Number(a) - Number(b)) // optional but nice
    .map(([hour, count]) => ({
      label: `${hour}:00`,
      count,
    }));
}
}

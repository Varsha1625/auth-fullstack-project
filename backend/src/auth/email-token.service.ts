import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class EmailTokenService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  async create(data: { userId: string; token: string }) {
    const { data: tokenData, error } = await this.supabase
      .from('email_verification_tokens')
      .insert([{ user_id: data.userId, token: data.token }])
      .select()
      .single();

    if (error) throw error;
    return tokenData;
  }

  async findByToken(token: string) {
    const { data, error } = await this.supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (error) return null;
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from('email_verification_tokens')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

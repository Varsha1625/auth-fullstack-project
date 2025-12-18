import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  public client: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL')!;
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY')!;
    this.client = createClient(url, key);
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async getIPInfo(ip: string) {
    try {
      const url = `${process.env.IP_API}/${ip}/json/`;
      const { data } = await axios.get(url);
      return data;
    } catch {
      return null;
    }
  }

  async createIPInfoRecord(ipInfo: any, ip: string) {
    const { city, region, country_name, org, latitude, longitude } = ipInfo || {};
    const { data, error } = await supabase
      .from('ip_info')
      .insert([
        {
          ip,
          city: city || null,
          region: region || null,
          country: country_name || null,
          org: org || null,
          latitude: latitude || null,
          longitude: longitude || null,
          raw: ipInfo || {},
        },
      ])
      .select()
      .single();

    if (error) console.error('ip_info insert error', error);
    return data;
  }

  async signup({ name, email, password }, ip: string, userAgent: string) {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existing) throw new BadRequestException('Email already registered');

    const hash = await bcrypt.hash(password, 12);
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ name, email, password_hash: hash }])
      .select()
      .single();
    if (error) throw error;

    const ipinfo = await this.getIPInfo(ip);
    const ipRec = await this.createIPInfoRecord(ipinfo, ip);

    await supabase.from('sign_in_attempts').insert([
      {
        user_id: user.id,
        email_attempted: email,
        success: true,
        ip_info_id: ipRec?.id || null,
        user_agent: userAgent,
      },
    ]);

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async signin({ email, password }, ip: string, userAgent: string) {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    const ipinfo = await this.getIPInfo(ip);
    const ipRec = await this.createIPInfoRecord(ipinfo, ip);

    if (!user) {
      await supabase.from('sign_in_attempts').insert([
        {
          user_id: null,
          email_attempted: email,
          success: false,
          ip_info_id: ipRec?.id || null,
          user_agent: userAgent,
        },
      ]);
      throw new BadRequestException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    await supabase.from('sign_in_attempts').insert([
      {
        user_id: user.id,
        email_attempted: email,
        success: valid,
        ip_info_id: ipRec?.id || null,
        user_agent: userAgent,
      },
    ]);

    if (!valid) throw new BadRequestException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async getAttempts(userId: string) {
    const { data, error } = await supabase
      .from('sign_in_attempts')
      .select(`*, ip_info(*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
}

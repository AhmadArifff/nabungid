import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from './env.config';
import { logger } from '../utils/logger.util';

// Fallback placeholder JWT jika belum diisi di dashboard Vercel
const DEFAULT_SUPABASE_URL = 'https://ztaasxrrmfrzzplmupjh.supabase.co';
const FALLBACK_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_service_role_key_nabungid_1447h';

const resolvedUrl = env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const resolvedKey =
  env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || FALLBACK_KEY;

if (!env.SUPABASE_SERVICE_ROLE_KEY && !env.SUPABASE_ANON_KEY) {
  logger.warn(
    '⚠️ SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY belum terpasang di environment variables. Menggunakan fallback initialization key.'
  );
}

export const supabaseAdmin: SupabaseClient = createClient(
  resolvedUrl,
  resolvedKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'cross-fetch';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const anonKey = process.env.SUPABASE_ANON_KEY || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !anonKey || !serviceRoleKey) {
  console.warn('Missing Supabase URL, anon key, or service-role key. Database operations will fail.');
}

// Only authentication operations use this client. All user-owned data must use
// a request-scoped client so Supabase can enforce the RLS policies.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  global: { fetch: fetch }
});

export const createUserScopedClient = (accessToken: string) => createClient(supabaseUrl, anonKey, {
  global: {
    fetch: fetch,
    headers: { Authorization: `Bearer ${accessToken}` }
  }
});

// MARIX Supabase client
// Uses the publishable browser key only. Never place a service_role/secret key here.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://zyhpihpenzmrmdtmneeo.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_HAdmRPY_zTPI_uE6eHpjSQ_9M7VBGYL';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

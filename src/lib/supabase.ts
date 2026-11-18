import { createClient } from '@supabase/supabase-js';
import { createGccApi, validatePublicConfig } from './gcc-api';

function createServices() {
  const config = validatePublicConfig(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
  return { client: createClient(config.url, config.key, { auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }), api: createGccApi(config) };
}
export type Services = ReturnType<typeof createServices>;
let singleton: Services | undefined;
export function getServices(): Services { return singleton ??= createServices(); }

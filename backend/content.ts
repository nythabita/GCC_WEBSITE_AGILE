import { validateHomepage } from "../shared/homepage-validation.ts";
export { validateHomepage } from "../shared/homepage-validation.ts";
export type { HomepageContent } from "../shared/homepage.ts";
export function projectUrl(input: string): string {
  let url: URL;
  try { url = new URL(input); } catch { throw new Error('SUPABASE_URL must be an HTTPS Supabase project origin.'); }
  if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.supabase\.co$/.test(url.hostname) || url.port || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SUPABASE_URL must be an HTTPS Supabase project origin, without credentials, path, query, or fragment.');
  }
  return url.origin;
}

export async function publishHomepage(content: unknown, env: Record<string, string | undefined>, send: typeof fetch = fetch): Promise<void> {
  const validated = validateHomepage(content);
  const base = projectUrl(env.SUPABASE_URL ?? '');
  const key = env.SUPABASE_SECRET_KEY ?? '';
  if (!/^sb_secret_[A-Za-z0-9_-]{8,}$/.test(key)) throw new Error('A Supabase secret key is required in SUPABASE_SECRET_KEY; never use a publishable key for updates.');
  let response: Response;
  try {
    response = await send(`${base}/rest/v1/homepage_content?on_conflict=id`, {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000),
      headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({ id: 'home', content: validated }),
    });
  } catch { throw new Error('Homepage update could not be confirmed. Check connection/project availability, then read the current record before retrying.'); }
  if (!response.ok) throw new Error(`Homepage update failed (HTTP ${response.status}). Check schema, project key, and permissions; response details are hidden.`);
  let rows: unknown;
  try { rows = await response.json(); } catch { throw new Error('Homepage update returned an unexpected response; verify the current record before retrying.'); }
  if (!Array.isArray(rows) || rows.length !== 1 || rows[0]?.id !== 'home') throw new Error('Homepage update returned an unexpected record; verify the project before retrying.');
}

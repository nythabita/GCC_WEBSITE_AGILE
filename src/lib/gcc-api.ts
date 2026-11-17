import { isProgramSlug, normalizeAnswers, validateAnswers, type Answers, type ProgramSlug } from '../../shared/forms.ts';
import type { AccessSession } from '../../shared/auth.ts';

export type PublicConfig = { url: string; key: string };
export type ApplicationReceipt = { id: string; user_id: string; program_slug: ProgramSlug; form_version: 1; submitted_at: string };
export class ApiError extends Error {
  code: string;
  constructor(message: string, code = 'request_failed') { super(message); this.name = 'ApiError'; this.code = code; }
}
export function validatePublicConfig(url: string | undefined, key: string | undefined): PublicConfig {
  if (!url || !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/u.test(url) || !key || !/^sb_publishable_[a-zA-Z0-9_-]+$/u.test(key)) {
    throw new ApiError('Konfigurasi layanan GCC belum tersedia. Hubungi pengelola.', 'configuration');
  }
  return { url: url.replace(/\/$/u, ''), key };
}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;
function receipt(value: unknown, slug: ProgramSlug, session: AccessSession): ApplicationReceipt {
  const row = value as ApplicationReceipt;
  if (!row || !uuid.test(row.id) || row.user_id !== session.userId || row.program_slug !== slug || row.form_version !== 1 || typeof row.submitted_at !== 'string' || !Number.isFinite(Date.parse(row.submitted_at))) throw new ApiError('Konfirmasi pengajuan tidak valid. Periksa pengajuan sebelum mencoba lagi.');
  return row;
}
const receiptFields = 'id,user_id,program_slug,form_version,submitted_at';
export function createGccApi(config: PublicConfig, transport: typeof fetch = fetch) {
  const checked = validatePublicConfig(config.url, config.key);
  async function request(path: string, session?: AccessSession, method = 'GET', body?: unknown): Promise<unknown> {
    if (session && (!uuid.test(session.userId) || !session.accessToken || /[\r\n]/u.test(session.accessToken))) throw new ApiError('Silakan login kembali.', 'auth');
    let response: Response;
    try {
      response = await transport(`${checked.url}/rest/v1/${path}`, {
        method, headers: { apikey: checked.key, ...(session ? { Authorization: `Bearer ${session.accessToken}` } : {}),
          ...(body === undefined ? {} : { 'Content-Type': 'application/json', Prefer: 'return=representation' }) },
        body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(15000),
      });
    } catch { throw new ApiError('Layanan belum dapat dihubungi. Jawaban belum dikonfirmasi tersimpan; coba lagi.'); }
    if (!response.ok) {
      if (response.status === 401) throw new ApiError('Sesi login berakhir. Silakan login kembali.', 'auth');
      if (response.status === 409) throw new ApiError('Pengajuan untuk program ini sudah tersimpan.', 'duplicate');
      if (response.status === 400 || response.status === 422) throw new ApiError('Data tidak dapat diterima. Periksa jawaban dan muat ulang formulir bila versinya berubah.', 'validation');
      throw new ApiError('Permintaan belum berhasil. Silakan coba kembali atau hubungi pengelola.');
    }
    try { return await response.json(); } catch { throw new ApiError('Respons layanan tidak valid. Silakan coba kembali.'); }
  }
  async function getApplication(slug: ProgramSlug, session: AccessSession): Promise<ApplicationReceipt | null> {
    if (!isProgramSlug(slug)) throw new ApiError('Program tidak dikenal.');
    const rows = await request(`program_applications?program_slug=eq.${slug}&select=${receiptFields}`, session);
    if (!Array.isArray(rows) || rows.length > 1) throw new ApiError('Konfirmasi pengajuan tidak valid.');
    return rows.length ? receipt(rows[0], slug, session) : null;
  }
  return {
    request,
    getApplication,
    async submitApplication(slug: ProgramSlug, input: Answers, session: AccessSession): Promise<ApplicationReceipt> {
      if (Object.keys(validateAnswers(slug, input)).length) throw new ApiError('Periksa kelengkapan dan format jawaban.', 'validation');
      const answers = normalizeAnswers(slug, input);
      if (Object.keys(validateAnswers(slug, answers)).length) throw new ApiError('Jawaban belum lengkap.', 'validation');
      try {
        const rows = await request(`program_applications?select=${receiptFields}`, session, 'POST', { program_slug: slug, answers });
        if (!Array.isArray(rows) || rows.length !== 1) throw new ApiError('Belum ada konfirmasi pengajuan tersimpan.');
        return receipt(rows[0], slug, session);
      } catch (error) {
        if (error instanceof ApiError && error.code === 'duplicate') {
          const saved = await getApplication(slug, session); if (saved) return saved;
        }
        throw error;
      }
    },
    async getProfile(session: AccessSession): Promise<{ id: string; full_name: string }> {
      const rows = await request('profiles?select=id,full_name', session);
      if (!Array.isArray(rows) || rows.length !== 1 || rows[0].id !== session.userId || typeof rows[0].full_name !== 'string') throw new ApiError('Profil akun belum dapat dimuat.');
      return rows[0];
    },
    async saveProfile(fullName: string, session: AccessSession): Promise<void> {
      if (!fullName.trim() || fullName.trim().length > 160) throw new ApiError('Nama harus diisi, maksimal 160 karakter.');
      const rows = await request(`profiles?id=eq.${session.userId}&select=id`, session, 'PATCH', { full_name: fullName.trim() });
      if (!Array.isArray(rows) || rows.length !== 1 || rows[0].id !== session.userId) throw new ApiError('Profil belum berhasil disimpan.');
    },
  };
}

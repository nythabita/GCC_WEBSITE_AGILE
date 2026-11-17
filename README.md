# Growth Consulting Club — GCC Website Agile

React/TypeScript/Vite frontend dengan backend Supabase untuk akun, profil, konten homepage, serta pengajuan dan jawaban asesmen GrowthCamp, GrowthX, dan GrowthConnect.

## Status dan lingkup

- Route publik tersedia untuk Home, Discover, Assessment (pemilih program), Learn, Apply, Grow, katalog, dan detail ketiga program.
- Homepage mengambil konten Hero/About/judul program dan CTA dari Data API; loading/error/retry ditampilkan jika API belum tersedia. Foto, kartu program, FAQ, mentor dan kolaborasi tetap dari data statis.
- Login minimum menggunakan Google melalui Supabase Auth, tidak lagi kode demo. Google membutuhkan OAuth Client dan redirect yang benar. Tombol Google hanya diaktifkan setelah konfigurasi siap; SMTP/email OTP ditunda sesuai keputusan tim.
- Ketiga form memerlukan session login. Jawaban dikirim ke database; konfirmasi membutuhkan receipt dari server. Satu user hanya dapat mengajukan sekali per program dan tidak dapat mengedit pengajuan terkirim.
- Jawaban form merupakan data asesmen kesiapan/pengajuan, tanpa skor otomatis atau keputusan penerimaan yang belum disepakati tim.
- RLS membatasi profil dan pengajuan ke pemiliknya; browser tidak dapat menentukan user pemilik lain, timestamp, versi, atau ID pengajuan.
- Kesiapan publik juga memerlukan migration hosted, Google OAuth, URL produksi, dan pengujian akun nyata. Lulus pengujian lokal tidak otomatis berarti layanan sudah siap dipakai publik.

## Menjalankan

Node.js **24.12+**, npm:

```sh
npm ci
npm --prefix backend ci
```

Salin `.env.example` menjadi `.env.local`; hanya URL dan publishable key boleh ada di environment frontend.

```sh
npm run dev
npm test
npm run check:backend
npm run lint
npm run build
npx playwright install chromium
npm run test:browser
```

`npm test` menjalankan suite backend, validasi kontrak dan PostgreSQL melalui PGlite. `test:browser` menguji alur UI dengan session/provider/HTTP fixture; pengiriman email dan OAuth nyata tetap harus diuji terpisah. Pada Windows pengujian memakai Chrome terpasang, sistem lain memakai Chromium Playwright.

## Struktur utama

| Lokasi | Tanggung jawab |
| --- | --- |
| `src/pages/`, `src/components/` | Halaman dan tampilan |
| `src/data/` | Konten statis serta konfigurasi form |
| `src/auth/` | Session dan pembatasan route form |
| `src/lib/` | Client Supabase dan transport Data API |
| `shared/forms.ts`, `shared/form-types.ts` | Kontrak dan validasi form yang dipakai lintas frontend/backend |
| `shared/homepage.ts`, `shared/homepage-validation.ts` | Kontrak konten homepage v1/v2 |
| `backend/` | Schema, generator aturan, maintenance konten dan pengujian PostgreSQL |
| `tests/` | Pengujian browser |
| `docs/` | Referensi desain dan panduan handoff |

Pertahankan kapitalisasi path, termasuk `components/UI/`, agar import bekerja di Linux. Entry CSS aktif adalah `src/styles/global.css`. Hosting harus menerapkan fallback SPA (`vercel.json` sudah tersedia).

## Dokumentasi

- [Setup backend, SMTP, OAuth dan release checks](docs/BACKEND_SETUP.md)
- [Status deployment dan batas verifikasi](backend/DEPLOYMENT.md)
- [Maintenance database/konten](backend/README.md)
- [Desain dan brand](docs/design.md)
- [Brief homepage awal](docs/dev-a-brief.md)

Catatan historis `docs/HANDOFF.md`, `docs/PROGRESS.md` dan QA simulasi lama menggambarkan keadaan sebelum integrasi backend; gunakan panduan setup dan deployment di atas untuk status backend saat ini. Jangan menambahkan pembayaran, scoring, unggah file, atau panel admin tanpa scope yang disepakati.

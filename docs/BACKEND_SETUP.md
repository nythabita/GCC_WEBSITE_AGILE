# GCC backend: setup dan bukti kesiapan

## Lingkup

Supabase Auth menyediakan akun/session; `profiles` menyimpan nama; `program_applications` menyimpan pengajuan dan jawaban asesmen GrowthCamp/GrowthX/GrowthConnect. Semua pengiriman memerlukan login. Satu user hanya dapat mengirim sekali untuk masing-masing program; pengajuan tidak bisa diedit/dihapus melalui browser.

Jawaban tersimpan bukan skor atau keputusan penerimaan. Halaman `/assessment` tetap pemilih program. Katalog/FAQ/foto/mentor/kolaborasi tetap statis seperti desain; tidak ada CMS/admin/pembayaran/unggah dokumen baru.

## Instalasi dan pemeriksaan lokal

Gunakan Node 24.12+ dan npm. Dari root repository:

```sh
npm ci
npm --prefix backend ci
```

Salin `.env.example` menjadi `.env.local`. Isinya hanya URL dan publishable key; keduanya aman digunakan browser. Jangan mengisi secret/service-role key di variabel `VITE_*`.

```sh
npm test
npm run check:backend
npm run build
npm run lint
npx playwright install chromium
npm run test:browser
npm run dev
```

Pengujian browser memakai Chrome terpasang di Windows dan Chromium Playwright di sistem lain. Test auth menggunakan respons provider/session fixture; pengujian ini tidak membuktikan email sungguhan terkirim atau Google OAuth sudah aktif. PostgreSQL/RLS diuji menggunakan PGlite sungguhan.

## Menerapkan database

Project yang digunakan: `gcc-homepage` (`svyulvjezdzgooywntyl`), Singapore, Free. Pastikan status `ACTIVE_HEALTHY` sebelum migration, bukan `RESTORING` atau `INACTIVE`.

Terapkan sebagai pengelola, dengan urutan:

1. `backend/schema.sql`: homepage v1/v2, mempertahankan record lama.
2. `backend/forms.generated.sql`: metadata validasi tiga form.
3. `backend/accounts.sql`: profil, pengajuan, trigger dan RLS.
4. Publikasikan `backend/homepage.v2.json` lewat perintah konten tepercaya atau SQL Editor. Konten ditandai `example`, menunggu persetujuan PO.

Simpan setiap penerapan dalam migration history Supabase. Pada deployment melalui MCP, nama migration dicatat dalam `backend/DEPLOYMENT.md`. File schema dapat dijalankan ulang dan tidak menghapus/mengganti pengajuan.

`npm run schema:generate` membangun metadata dari konfigurasi form. Versi 1 merupakan kontrak yang sudah digunakan oleh pengajuan tersimpan: ketika pertanyaan/aturan berubah setelah peluncuran, buat versi dan migration baru; jangan mengubah arti jawaban versi lama.

## Kontrak Data API

Semua URL berada di `https://svyulvjezdzgooywntyl.supabase.co/rest/v1`.

| Operasi | Request | Izin |
| --- | --- | --- |
| Konten homepage | `GET /homepage_content?id=eq.home&select=id,content,updated_at` | Publik |
| Profil sendiri | `GET /profiles?select=id,full_name` | Login, RLS sendiri |
| Ubah nama sendiri | `PATCH /profiles?id=eq.<own-id>` dengan `{ "full_name": "..." }` | Login, kolom nama saja |
| Pengajuan sendiri | `GET /program_applications?program_slug=eq.growthcamp&select=id,user_id,program_slug,form_version,submitted_at` | Login, RLS sendiri |
| Kirim pengajuan | `POST /program_applications` dengan `{ "program_slug": "growthcamp", "answers": { ... } }` | Login, insert kolom tersebut saja |

Gunakan header `apikey: <publishable-key>`; operasi login juga membutuhkan `Authorization: Bearer <access-token-user>`. Pengiriman memakai `Prefer: return=representation`. Jangan mengirim `user_id`, ID pengajuan, `form_version`, atau timestamp dari browser: database menetapkan semuanya.

Jawaban memakai ID field konfigurasi form, termasuk `comfort.0`–`comfort.3` untuk matrix dan `abilities.0`/`abilities.1` untuk bidang kontribusi. Client menormalkan jawaban yang tidak lagi relevan. Database menguji struktur, field wajib/kondisional, pilihan, format dan batas data. Maksimal 10.000 karakter per teks serta 64 KiB dokumen; batas kata/pilihan mengikuti setiap pertanyaan.

HTTP 401 berarti login perlu diperbarui; 400/422 berarti data tidak dapat diterima; 409 berarti pengajuan sudah ada. Client memulihkan receipt milik user pada 409 tanpa membuat pengajuan kedua. Error jaringan tidak dianggap sukses; jawaban dipertahankan selama form tetap terbuka. Refresh/menutup form sebelum dikirim belum menyimpan draft.

Pengelola meninjau data melalui Supabase Dashboard dengan akun pengelola, bukan dengan menaikkan hak user dari browser. `gcc_private` tidak boleh dimasukkan ke daftar exposed schemas Data API.

## Login minimum: Google saja

Sesuai keputusan terbaru pengguna, email/OTP dan SMTP ditunda. Akun dibuat otomatis pada login Google pertama. Jangan menawarkan login email sebelum layanan pengirim dan pengujiannya benar-benar tersedia.

## Google OAuth dan URL aplikasi

1. Di Google Cloud, siapkan project/consent screen untuk GCC dan OAuth Client jenis Web Application. Gunakan scope dasar login; jangan meminta akses Gmail.
2. Authorized redirect URI Google: `https://svyulvjezdzgooywntyl.supabase.co/auth/v1/callback`.
3. Masukkan Client ID dan Client Secret langsung ke Supabase Auth → Providers → Google. Secret tidak masuk repository.
4. Supabase Site URL harus merupakan URL frontend final. Allowlist redirect harus mencakup callback aplikasi `/login` di origin produksi yang tepat. Untuk development, tambahkan `http://127.0.0.1:5173/login` dan/atau `http://localhost:5173/login` sesuai yang digunakan. Jangan memakai wildcard untuk seluruh domain produksi.
5. Ubah `VITE_GOOGLE_AUTH_ENABLED=true` hanya setelah provider terkonfigurasi. Build/deploy ulang agar flag Vite berlaku.
6. Uji akun Google di luar tim. Pastikan status consent/audience Google mengizinkan pengguna yang dituju; aplikasi dalam mode testing tidak otomatis tersedia untuk semua akun.

Untuk frontend Vercel, deploy branch integrasi ini dan isi environment dari `.env.example` pada project Vercel. Gunakan hasil build `dist/`, bukan dev server Vite publik. URL produksi belum tersedia pada saat rancangan disetujui; jangan menandai setup redirect selesai sebelum URL final benar-benar ada.

## Kriteria peluncuran

- Migration telah diterapkan pada project sehat, dan advisor serta hosted access checks ditinjau.
- Login Google pertama membuat akun/profil; login berikutnya, logout dan refresh session berhasil.
- Google OAuth aktif dan callback berhasil untuk akun di luar tim.
- Ketiga form menyimpan jawaban; user lain dan akses anonim tidak dapat membaca pengajuan tersebut.
- Retry/duplikasi tidak membuat data ganda, dan konfirmasi menampilkan ID serta waktu server.
- Halaman sukses tidak muncul saat provider/database gagal.
- Frontend online menggunakan environment dan redirect URL yang benar.

Kode lokal yang lulus tes belum otomatis membuktikan kesiapan publik. Catat status setiap pemeriksaan di `backend/DEPLOYMENT.md`.

## Temuan dependency

Audit 18 November 2026 menemukan advisory [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) pada `picomatch@4.0.7` melalui toolchain Vite yang sudah digunakan repo. Saat diperiksa, advisory belum memiliki versi patch. Pola glob berasal dari konfigurasi build, bukan input aplikasi. Deploy hanya aset statis `dist/`; jangan mengekspos dev server Vite atau menerima pola glob dari pengguna. Jangan menjalankan `npm audit fix --force` yang menawarkan downgrade major Vite tanpa menilai kompatibilitas tim. Ini tetap temuan audit yang terbuka.

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

## Email OTP untuk pengguna umum

SMTP default Supabase hanya melayani alamat anggota organisasi dan bukan layanan produksi publik. Gunakan SMTP khusus sebelum meluncurkan signup/login email:

1. Siapkan akun pengirim yang dikelola tim. Opsi tanpa membeli domain untuk pemakaian awal: SMTP Gmail khusus GCC. Ini memiliki batas pengiriman, bukan layanan email tanpa batas.
2. Aktifkan 2-Step Verification di akun Google pengirim. Buat App Password jika akun mendukungnya. Pemilik memasukkannya **langsung ke dashboard Supabase**, tidak ke chat, Git, environment frontend, atau screenshot.
3. Buka Auth → Email/SMTP di [dashboard project](https://supabase.com/dashboard/project/svyulvjezdzgooywntyl). Untuk Gmail: host `smtp.gmail.com`, port `465` dengan SSL/TLS atau `587` STARTTLS; username dan sender adalah email pengirim yang sama; password adalah App Password.
4. Pada template **Confirm signup** dan **Magic Link**, tampilkan `{{ .Token }}`. Contoh isi: `Kode verifikasi GCC Anda: {{ .Token }}. Abaikan jika Anda tidak meminta kode ini.` Atur panjang OTP menjadi 6 digit agar sesuai input aplikasi. Pertahankan expiry dan rate limit yang wajar; jangan menonaktifkan verifikasi email.
5. Uji signup baru dan login akun lama menggunakan inbox yang bukan anggota organisasi Supabase. Uji kode salah, kedaluwarsa, resend, serta email gagal dikirim.

Jika Gmail/App Password tidak tersedia untuk akun tersebut, ganti dengan SMTP transactional Free yang telah diverifikasi pengirimnya. Jangan mengaktifkan opsi berbayar otomatis atau membeli domain tanpa persetujuan.

Referensi: [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Email OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless), [Google App Passwords](https://support.google.com/mail/answer/185833), [Gmail SMTP](https://developers.google.com/workspace/gmail/imap/imap-smtp), [batas Gmail](https://support.google.com/mail/answer/22839).

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
- Email OTP benar-benar sampai ke pengguna umum; signup/login/logout/refresh session berhasil.
- Google OAuth aktif dan callback berhasil untuk akun di luar tim, jika tombol Google ditawarkan.
- Ketiga form menyimpan jawaban; user lain dan akses anonim tidak dapat membaca pengajuan tersebut.
- Retry/duplikasi tidak membuat data ganda, dan konfirmasi menampilkan ID serta waktu server.
- Halaman sukses tidak muncul saat provider/database gagal.
- Frontend online menggunakan environment dan redirect URL yang benar.

Kode lokal yang lulus tes belum otomatis membuktikan kesiapan publik. Catat status setiap pemeriksaan di `backend/DEPLOYMENT.md`.

## Temuan dependency

Audit 18 November 2026 menemukan advisory [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) pada `picomatch@4.0.7` melalui toolchain Vite yang sudah digunakan repo. Saat diperiksa, advisory belum memiliki versi patch. Pola glob berasal dari konfigurasi build, bukan input aplikasi. Deploy hanya aset statis `dist/`; jangan mengekspos dev server Vite atau menerima pola glob dari pengguna. Jangan menjalankan `npm audit fix --force` yang menawarkan downgrade major Vite tanpa menilai kompatibilitas tim. Ini tetap temuan audit yang terbuka.

# GCC backend — Supabase

Backend minimum untuk Google login/session, profil, pengajuan dan jawaban asesmen tiga program, serta konten homepage. Supabase menyediakan Auth, PostgreSQL dan Data API; tidak ada server Node HTTP terpisah.

Panduan utama: [setup dan konfigurasi](../docs/BACKEND_SETUP.md). Bukti penerapan online: [DEPLOYMENT.md](DEPLOYMENT.md). Acuan frontend adalah commit `93d4c4296eb06d467acad75b9b80811dddd84aa9`, bukan placeholder awal repo.

## Schema

| File | Fungsi |
| --- | --- |
| `schema.sql` | Dokumen homepage tunggal dengan kontrak v1/v2 dan akses baca publik |
| `forms.generated.sql` | Metadata validasi dari tiga konfigurasi form |
| `accounts.sql` | Profil, pengajuan immutable, validasi, column grants, RLS dan trigger |

Terapkan dalam urutan di atas sebagai pengelola, ketika project sehat, melalui migration yang tercatat. Rerun tidak mengganti konten atau pengajuan. `gcc_private` berisi helper internal dan tidak boleh diekspos melalui Data API.

`program_applications` menerima hanya `program_slug` dan `answers` dari browser. Database menetapkan pemilik berdasarkan session, ID, versi, dan waktu penerimaan. User hanya dapat membaca pengajuan sendiri; satu pengajuan per program, tanpa edit/delete. Pengelola meninjau lewat dashboard. Tidak ada skor/kelulusan otomatis.

## Maintenance konten

`homepage.example.json` adalah contoh legacy v1; `homepage.v2.json` memakai dua CTA desain terbaru ke `/programs` dan `/assessment`. Kontrak v2 tetap mempunyai Hero, About dan journey, tetapi hero menggunakan `actions`, bukan CTA legacy. Keduanya diperiksa oleh validator bersama dan SQL.

Status `example` harus memiliki notice yang ditampilkan frontend. Gunakan `approved` hanya setelah PO menyetujui teks; validasi struktur tidak membuktikan persetujuan. Semua teks konten plain text, maksimal 2.000 karakter, dokumen maksimal 64 KiB. File v2 yang disertakan masih example.

Node 24.12+:

```sh
node update.ts homepage.v2.json
node --env-file=.env update.ts homepage.v2.json --apply
node --env-file=.env smoke.ts
```

Perintah pertama hanya validasi. `--apply` memerlukan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` di environment tepercaya. Smoke memakai `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY`; probe menargetkan ID tidak valid dan tidak menyentuh record home.

Jangan memasukkan secret/service-role, password, token, atau jawaban pribadi ke environment frontend, source, screenshot, log, atau chat. `.env` dan file konten lokal diabaikan Git.

## Pengujian

```sh
npm ci
npm test
npm run check
```

Suite memeriksa validasi, HTTP transport, PostgreSQL/PGlite, grants/RLS, duplikasi dan rerun. Frontend terintegrasi diuji dari root melalui `npm run test:browser`. Pengujian lokal bukan bukti email/OAuth atau hosted database telah siap; bukti tersebut dicatat terpisah.

Jika konfigurasi pertanyaan berubah setelah peluncuran, buat versi kontrak dan migration baru. Jangan mengubah makna jawaban yang sudah disimpan sebagai versi 1.

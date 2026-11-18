# GCC user-ready backend design

## Revisi scope yang disetujui di chat

Pengguna kemudian memilih **Google saja dulu** dan **bare minimum**. Revisi ini menggantikan kebutuhan email/OTP/SMTP di bagian historis rancangan di bawah: hanya Google OAuth ditawarkan, akun dibuat pada login Google pertama, dan tidak ada konfigurasi SMTP yang diperlukan. Akun/profil, pengajuan tiga program, validasi/RLS, serta integrasi yang sudah dibangun tetap berlaku. Tidak menambah fitur baru.

## Tujuan dan acuan

Mengubah alur yang sudah tersedia di GitHub menjadi alur nyata: akun, session, pengajuan dan jawaban asesmen tiga program, serta konten homepage melalui Supabase. Acuan frontend adalah `feature/navigation` pada commit `93d4c4296eb06d467acad75b9b80811dddd84aa9`. Desain visual dan pertanyaan bisnis mengikuti kode tersebut.

## Keputusan yang sudah disetujui pengguna

- Supabase Free: PostgreSQL, Auth, dan Data API; tanpa server HTTP Node terpisah.
- Ketiga form wajib login sebelum dapat dikirim.
- Satu pengajuan per user per program; belum bisa mengedit pengajuan terkirim.
- Integrasi frontend diperbolehkan dengan perubahan seperlunya dan desain dipertahankan.
- Hasil asesmen mengikuti jawaban form yang tersedia, tanpa skor, keputusan seleksi, atau rekomendasi otomatis yang dikarang.
- Konten dikelola lewat file/perintah dan dashboard Supabase; tidak menambah halaman admin.
- User-ready berarti akun nyata dan data benar-benar tersimpan. Simulasi tidak boleh ditampilkan sebagai keberhasilan nyata.

## Pendekatan

Pendekatan terpilih mengikuti keputusan sebelumnya: Supabase Auth + Data API + constraint/validasi PostgreSQL + RLS. Alternatif server Node/Edge terpisah menambah deployment dan duplikasi otorisasi yang tidak diperlukan oleh alur saat ini. Frontend menggunakan SDK Supabase dengan publishable key; secret/service-role tidak pernah masuk browser.

## Model data yang diusulkan

### Akun dan profil

- `auth.users` tetap dikelola Supabase Auth; tidak membuat tabel password sendiri.
- `public.profiles`: `id` UUID terkait `auth.users.id`, `full_name`, `created_at`, `updated_at`.
- Profil dibuat saat akun dibuat, dan user hanya dapat membaca/memperbarui profilnya sendiri. Nama dari OAuth diperlakukan sebagai data tampilan, bukan penentu hak akses.
- Penghapusan akun melalui pengelola menghapus profil dan pengajuannya melalui foreign key cascade.

### Pengajuan dan jawaban asesmen

- `public.program_applications`: ID UUID, pemilik (`user_id`), `program_slug` (`growthcamp`, `growthx`, `growthconnect`), `form_version`, `answers` JSONB, `submitted_at`.
- Unique constraint `(user_id, program_slug)` menjadi pengaman pengiriman ganda dan balapan request.
- Identitas pemilik berasal dari session/database. Browser tidak boleh menentukan pemilik lain, versi formulir, atau timestamp penerimaan.
- JSONB mempertahankan ID field yang sudah ada, termasuk checkbox, matrix, jawaban kondisional, dan jawaban per bidang pilihan. Versi formulir dicatat agar jawaban tetap dapat ditafsirkan ketika pertanyaan berubah.
- Tidak ada kolom nilai/kelulusan otomatis: tidak ada rubric di GitHub. Baris tersimpan merupakan pengajuan diterima sistem, bukan penerimaan peserta.
- Tidak ada draft di database atau edit/delete dari browser untuk sprint ini. Form yang belum dikirim tetap berada di state selama halaman terbuka.

### Validasi dan hak akses

- Definisi field bersumber dari konfigurasi tiga form yang ada; kontrak validasi bersama menghasilkan validasi frontend dan aturan database yang selaras.
- Database memeriksa program/versi, field wajib dan kondisional, tipe data, pilihan yang sah, batas pilihan dan kata, format email/telepon/URL, batas ukuran payload, serta field yang tidak dikenal.
- Field tersembunyi/tidak relevan dibersihkan sebelum dikirim agar jawaban lama setelah mengganti pilihan tidak ikut tersimpan.
- `anon` tidak dapat membaca/menulis profil dan pengajuan. User terautentikasi hanya membaca data sendiri; pengajuan hanya dapat dibuat sekali dan tidak dapat diubah/dihapus melalui browser.
- Pengelola menggunakan akses tepercaya di dashboard. Tidak menambahkan role admin berbasis metadata yang dapat diubah user.

## Integrasi frontend

### Auth

- Ganti login demo dengan email OTP dan Google OAuth nyata; hapus akun/kode demo serta sukses berbasis timer.
- Signup nama + email menggunakan verifikasi sebelum session dianggap aktif.
- Session dipulihkan ketika halaman dimuat ulang, perubahan session diikuti, dan tersedia logout.
- Route form memeriksa session dan mengarahkan ke login dengan tujuan kembali yang dibatasi hanya ke route internal GCC yang diizinkan.
- Tangani OTP salah/kedaluwarsa, resend/cooldown, kegagalan jaringan/provider, dan callback OAuth. Tampilkan keberhasilan hanya setelah session sah.
- Tidak mencatat token, OTP, secret, atau jawaban pribadi ke log.

### Form

- Pertahankan langkah, pertanyaan, dan tampilan form saat ini.
- Ganti tombol simulasi menjadi pengiriman nyata; tunggu respons database, cegah klik berulang, dan pertahankan jawaban saat request gagal.
- Konfirmasi berisi referensi pengajuan/waktu server; kegagalan dan duplikasi memiliki pesan yang berbeda.
- Jika pengajuan sudah ada ketika user kembali, tampilkan konfirmasi pengajuan tersimpan dan hentikan pembuatan pengajuan kedua.
- Konfirmasi tidak mengklaim diterima menjadi peserta atau proyek disetujui.

### Homepage

- Pertahankan kompatibilitas dokumen konten lama v1. Tambahkan kontrak v2 untuk CTA utama `/programs` dan CTA kedua `/assessment` yang sudah ada di desain.
- Ambil Hero/About/judul section program dari API; gunakan CTA dari dokumen API, bukan nilai terpisah yang bertentangan.
- Seed v2 memakai teks dari GitHub, dengan status draft/example kecuali PO mengonfirmasi final. Tidak mengarang klaim baru.
- Tampilkan loading/error/retry yang jelas; jangan menyamarkan kegagalan API dengan konten lokal yang terlihat sukses.
- Kartu program, FAQ, mentor, kolaborasi, foto dan halaman informasi lain dapat tetap statis seperti kode saat ini: tidak membutuhkan database untuk berfungsi. Tidak membangun CMS baru.
- `/assessment` tetap pemilih program; tidak menambahkan quiz/scoring baru.

## Operasional dan integrasi eksternal

- Project yang dipakai tetap `gcc-homepage`, region Singapore, Free. Restore project lama sudah dimulai tanpa membuat project berbayar baru.
- Diperlukan layanan SMTP pengirim terverifikasi untuk email pengguna umum; SMTP bawaan Supabase terbatas untuk anggota organisasi dan tidak cukup untuk readiness publik.
- Google OAuth memerlukan Google Cloud OAuth Client, consent configuration, callback Supabase, dan redirect aplikasi yang benar.
- Belum ada URL produksi tetap. Siapkan localhost untuk verifikasi pengembangan dan dokumentasikan URL produksi yang harus ditambahkan setelah deployment frontend tersedia. Jangan mengarang URL produksi.
- Pemilik menyelesaikan verifikasi akun pengirim/OAuth dan memasukkan secret langsung di dashboard. Jangan meminta secret lewat chat atau menyimpannya di Git.
- Semua kode dan pengujian yang tidak bergantung pada kredensial tetap diselesaikan; status publik tidak boleh disebut selesai sebelum dependensi ini aktif dan lolos uji nyata.

## Scope yang tidak ditambahkan

Pembayaran, opportunity marketplace, unggah dokumen, pemberitahuan marketing, penilaian otomatis, panel admin khusus, manajemen batch/cohort, dan workflow seleksi tidak tersedia sebagai alur fungsional pada acuan; tidak ditambahkan.

## Bukti readiness

1. Baseline dan suite backend lulus; schema/migration dapat diterapkan dan pengujian memakai PostgreSQL sungguhan melalui PGlite.
2. Uji validasi setiap form mencakup jawaban sah, kosong, pilihan palsu, batas kata/pilihan, kondisi, matrix, field tidak dikenal, dan payload terlalu besar.
3. Uji RLS membuktikan anon ditolak, user A tidak membaca/mengubah data B, identitas tidak bisa dipalsukan, serta duplikasi ditolak oleh database.
4. Uji client/auth mencakup sesi belum ada/expired, kegagalan API, duplikasi, dan tidak ada layar sukses sebelum penyimpanan berhasil.
5. TypeScript frontend/backend, lint, dan build produksi lulus. Uji browser pada mobile/desktop memastikan route publik, login, return-to, form, konfirmasi, logout, dan error tetap berfungsi.
6. Setelah SMTP/OAuth/URL siap, uji akun nyata sampai pengajuan tersimpan di hosted Supabase. Pisahkan bukti lokal, hosted data, dan pengiriman email/OAuth; jangan mengklaim bagian yang belum diuji.
7. Perubahan dibuat pada branch baru dari frontend terbaru; hindari menimpa hasil teman dan sertakan handoff konfigurasi serta langkah migration. Tidak merge ke main tanpa instruksi.

## Persetujuan

Dokumen ini merupakan rancangan yang dapat direview. Keputusan akses login, jumlah pengajuan, dan izin integrasi sudah dikonfirmasi. Persetujuan rancangan diperlukan sebelum implementasi fitur baru sesuai workflow Superpowers.

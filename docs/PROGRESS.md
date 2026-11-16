# PROGRESS — sesi tanpa pengawasan (16 Nov 2026)

Berhenti karena batas kuota: halaman pertama memakai ±53% limit 5 jam (sudah termasuk setup), jadi sisa kuota diperkirakan kurang dari 2x biaya satu halaman. Working tree bersih, tidak ada yang di-push.

## Selesai

| Commit | Isi |
|---|---|
| `c3852e0` | GrowthX landing `/apply/growthx` + komponen bersama `src/components/program/sections.tsx`, skrip QA `audit.mjs` dan `compare.py` |
| `75be961` | GrowthConnect landing `/apply/growthconnect` |
| `8e0de54` | GrowthCamp landing `/learn/growthcamp` (sumber: frame landing di `2. PAGE LEARN.pdf`) |

Tombol CTA tiap program menuju `/apply/growthx/form`, `/apply/growthconnect/form`, `/learn/growthcamp/form` (Coming Soon sampai form dibangun).
Cek lolos tiap halaman: `npx tsc -b`, `npx oxlint`, `npx vite build`, `docs/qa/routes.mjs`. Audit posisi vertikal vs PDF: selisih rata-rata GrowthX -0,5px, GrowthConnect +21px, GrowthCamp +43px (terburuk ±100-140px dari 7-9k px).

## Form (mesin berbasis konfigurasi)

- Mesin: `src/components/form/ProgramForm.tsx` + tipe `src/components/form/types.ts`. Field: text (opsi "alternative", varian dinamis), radio, textarea + hitung kata, checkboxes (batas, opsi eksklusif), perSelection, consent, matrix, note, group; `showIf` dan `requiredWhen`; validasi per langkah, review otomatis, layar "Simulasi Selesai". Jawaban hanya di state, tidak dikirim/disimpan.
- Konfigurasi: `src/data/forms/growthx-form.ts` (`/apply/growthx/form`), `growthconnect-form.ts` (`/apply/growthconnect/form`), `growthcamp-form.ts` (`/learn/growthcamp/form`); tiap form 5 langkah + selesai.
- Uji: `node docs/qa/form-flow.mjs <baseUrl>` (alur GrowthX, 15 cek) dan `node docs/qa/form-fill.mjs <baseUrl>` (isi otomatis ketiga form sampai selesai, 18 cek).
- Keputusan default: varian WhatsApp pada kolom kontak (label "Nomor WhatsApp aktif" + placeholder contoh) dan kata "terisi" pada daftar review ditulis sendiri (Figma hanya menunjukkan keadaan kosong). Tombol "Selesaikan Simulasi" nonaktif selama ada jawaban wajib kosong. Di GrowthConnect, kolom "Kisaran anggaran" baru tampil setelah memilih "Memiliki kisaran" (di Figma terlihat di keadaan kosong dengan catatan "ditampilkan jika memilih..."). Teks pesan error ("Wajib diisi.", dst.) ditulis sendiri.
- Frame Figma GrowthCamp pertama (`l_c`) menampilkan tombol "Kembali ke program" dan tanpa tautan "Kembali ke GrowthCamp" di atas; semua langkah memakai tautan atas yang sama.

## Learn

`/learn` dibangun ulang dari frame terbaru (`docs/design/learn/`): hero + foto, Skills to Start With, blok GrowthCamp (foto workshop, gambaran pembelajaran), From Learning to Practice, Good to Know, dan penutup Find Your Starting Point. Memakai komponen bersama `src/components/program/sections.tsx`; foto di `src/assets/learn/`. Audit vs PDF: selisih rata-rata ±41px dari ±4.4k px. Jawaban FAQ ke-2 dan ke-3 ditulis sendiri (`TODO(review)` di `src/data/learn-content.ts`).
Komponen bersama berubah sedikit: `Polaroid` kini hanya membungkus foto (keterangan di luar bingkai, sesuai desain), `Timeline` punya tinggi langkah minimum dan varian `bright`, `FaqSection` punya `eyebrow` opsional.

## Belum

1. Login/Loading dan dialog: sengaja dilewati atas permintaan pemilik; `/login` tetap Coming Soon.
2. Tinjau kembali tinggi halaman vs desain bila perlu (selisih ±1-5%); halaman lama Discover/Grow/Apply masih 3-6% beda.

Alur end to end (Home, Discover, Learn, Apply, program, form, selesai) sudah lengkap dan mengikuti Figma.

## Cara lanjut (koordinat frame di PDF, y0=267, zoom 1)

Perintah ekstraksi yang dipakai (jalankan dari `docs/qa`, output ke folder sementara di luar repo):

```
python -I pdf_extract.py "<pdf>" <outdir> --y0=267 --zoom=1 <name>:<x>:392:<tinggi> ...
```

- (landing GrowthX/GrowthConnect/GrowthCamp sudah selesai) GrowthX: `x_landing:602:392:9270 x_f1:1162 x_f2:1606 x_f3:2052 x_f4:2496 x_f5:2942 x_f6:3386` (form tinggi ±3600; tinggi sebenarnya perlu dicek per frame).
- GrowthConnect: `c_landing:76:392:10223 c_f1:619 c_f2:1066 c_f3:1509 c_f4:1956 c_f5:2399 c_f6:2846`.
- Learn: `l_a:296 (tinggi ±4500) l_b:796:392:8270 l_c:1249 l_d:1749 l_e:2209 l_f:2669 l_g:3129 l_h:3589`.
- Alur kerja per halaman: ekstrak, bangun, `node docs/qa/audit.mjs <url> <frame>.txt` (selisih y per baris teks), `python -I docs/qa/compare.py` (berdampingan), lalu tsc/oxlint/build/routes.
- Folder ekstraksi sementara (`D:\agile_web\scratch`) bisa hilang; ulangi perintah di atas bila perlu. Catatan: `npm i playwright-core` di `docs/qa` ternyata menulis ke `package.json` root; jangan di-commit (sudah dikembalikan).

## Keputusan default yang diambil

- Teks Inter di desain terlihat ±3,6% lebih lebar dari Inter Variable kita; di halaman program dipakai `tracking-[0.02em]` pada `<main>` (heading serif/brand `tracking-normal`). Paragraf diberi `-mr-2.5` di mobile agar baris pecah sama dengan desain (kotak teks Figma lebih lebar dari kartu).
- Judul serif dinaikkan ±10% (31/37px) mengikuti aturan HANDOFF; nama program (`font-brand`) 34px.
- Badge langkah timeline memakai `teal-deep` (di desain hijau tua), langkah ke-3 `rose`.
- Chevron `BackLink` di `blocks.tsx` diberi warna biru (`brand-blue`) seperti di desain; komponen itu dipakai bersama.
- CTA "Ajukan Minat GrowthX" menuju `/apply/growthx/form` (Coming Soon sampai form dibangun). "Lihat contoh kasus" ke `/apply` (belum ada halaman kasus).
- Foto hero & kolaborasi GrowthX diekstrak dari PDF (webp ±900px). Ikon toko memakai aset yang sudah ada. Ikon "Analysis" di kartu kontribusi memakai `Goal` (di desain ikon target-panah serupa).

## Perlu ditinjau manusia

- **Jawaban FAQ GrowthX**: Figma hanya menampilkan jawaban pertama ("Belum. GCC meninjau..."). Tiga jawaban lain dirangkai dari kalimat di halaman yang sama; ada penanda `TODO(review)` di `src/data/growthx-content.ts`. Hal yang sama berlaku untuk FAQ di `growthconnect-content.ts` dan `growthcamp-content.ts` (hanya jawaban pertama yang ada di Figma).
- Warna hijau memakai `#00C090` (keputusan pemilik), bukan `#00B58C` dari PDF.
- Lisensi Budget 2012 dan penggantian EB Garamond masih perlu dikonfirmasi (lihat HANDOFF).

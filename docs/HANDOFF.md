# GCC website — handoff untuk sesi baru

Ditulis 16 Nov 2026. Baca file ini dulu sebelum mengerjakan apa pun. Pemilik proyek berbicara Indonesia santai (gw/lo); balas dengan gaya yang sama, singkat dan jujur.

## 1. Proyek

- Folder: `D:\agile_web\GCC_WEBSITE_AGILE` (React 19, Vite 8, TypeScript, Tailwind v4, react-router 8, lucide-react).
- Git: branch `feature/navigation`, remote `origin` = `thabitaaya29/GCC_WEBSITE_AGILE`.
  - Sudah di-push: sampai `9b056a9`.
  - Commit lokal belum di-push: `83159b1` (restructure + Discover/Assessment/Grow/Apply). **Jangan push tanpa izin eksplisit.**
- Dev server: `npx vite --port 5173 --strictPort` (atau `preview_start` dengan nama `gcc-web` dari `D:\agile_web\.claude\launch.json`).
- Cek wajib sebelum bilang selesai: `npx tsc -b`, `npx oxlint`, `npx vite build`.
- Dokumen lama yang masih berlaku: `docs/design.md` (token & aturan), `docs/dev-a-brief.md` (aturan konten).
  - Jangan mengarang mentor, mitra, statistik, atau jadwal.
  - Jangan pakai `href="#"`. Route internal pakai `Link`. Satu `h1` per halaman, heading berurutan, alt text sesuai konteks.

## 2. Struktur kode

```
src/
  App.tsx                    routes + ScrollToHash + Navbar/Footer
  components/layout/         navbar.tsx (drawer mobile), footer.tsx, PreviewPage.tsx (Coming Soon)
  components/UI/             button.tsx, button-styles.ts (buttonStyles + varian)
  components/home/           section homepage (Hero, About, Programs, ProgramCard, StartingPoint,
                             TrackRecord, Winners, Mentors, Collaborations, Community, collage.ts)
  components/content/blocks.tsx   blok bersama halaman dalam (FaqList, StepBadge, StepTimeline, PhotoFrame, ...)
  data/                      konten statis: navigation.ts, homepage-content.ts, homepage-draft.ts,
                             learn-/discover-/grow-/apply-content.ts
  pages/                     HomePage, DiscoverPage, AssessmentPage, LearnPage, ApplyPage, ProgramsPage, GrowPage
  assets/{brand,home,discover,fonts}/   aset + index.ts (import lewat Vite, jangan pakai URL /docs)
  styles/global.css          @theme token, @font-face, utilitas (.text-glow)
shared/homepage.ts           tipe kontrak backend (hero/about/journey); backend belum tersambung ke frontend
```

Route saat ini:

| Route | Halaman |
|---|---|
| `/` | Home |
| `/discover` | Discover (= Tentang GCC; label navbar "Discover"). `/about` redirect ke sini |
| `/assessment` | Assessment (Find Your Starting Point). `/pilih-program` redirect ke sini |
| `/learn` | Learn |
| `/apply` | Apply landing |
| `/programs` | Explore Page (3 kartu program; label navbar "Apply") |
| `/grow` | Grow |
| `/learn/growthcamp`, `/apply/growthx`, `/apply/growthconnect` | **Coming Soon (belum dibangun)** |
| `/login` | Coming Soon |
| `*` | menampilkan Home |

Navbar: Home, Discover, Learn, Apply, Grow (+ Assessment, Login sekunder). Footer mengikuti Figma; "Discover" dan "Tentang GCC" sama-sama ke `/discover`.

## 3. Sistem desain (sudah diputuskan, jangan diubah tanpa diminta)

Warna (token di `global.css`, jangan hardcode hex di `.tsx`):
- `brand-green` **#00C090** (pilihan pemilik; PDF Figma memakai #00B58C, bedanya disengaja), `forest` #193E34 (teks tua), `paper` #F8F5EF, `berry` #A74650 (tombol/blok Discover-Apply-Grow), `rose` #B35258 (blok homepage), `sun` #FFC400, `mint-*`, `neon` #00FFA6, `mist` #E4EBE8, token navy untuk sisa halaman lama. Token brand lama (`brand-red`, dst.) tetap ada.

Font:
- `font-display` = **EB Garamond** bold/bold-italic (pengganti Apple Garamond, lisensi OFL, file Latin-subset woff2). `size-adjust: 80%` di `@font-face` **disengaja** (permintaan pemilik; EB ±11% lebih lebar dari Apple Garamond di ukuran px yang sama). Ukuran di desain dipakai apa adanya; untuk halaman dalam, judul serif dinaikkan ±10% agar lebarnya setara desain.
- `font-brand` = **Budget 2012** (file dari FontSpace berlabel "Freeware"; **lisensi web komersial belum dipastikan**, ingatkan pemilik).
- `font-ui` = Inter Variable, `font-sub` = Montserrat Variable, `font-plain` = Arial.

Tombol: `buttonStyles({ variant, size, fullWidth, className })`. Varian: primary, secondary, ghost, rose, paper, white, outline, berry, berry-soft, sun. Ukuran sm/md/lg/xl. Link pakai `buttonStyles` pada `Link`/`a`, bukan tombol di dalam link.

Layout: **mobile first** (kelas tanpa prefix = mobile 390px; `md:` ke atas untuk desktop). Container `max-w-7xl px-6 md:px-8`. Desktop diturunkan dari gaya mobile karena Figma hanya punya mobile. Tidak ada animasi kecuali transisi warna singkat.

## 4. Pola kerja yang sudah terbukti

**Sumber desain.** MCP Figma plan Starter sering "Out of calls" dan browser pane terlalu sempit untuk membaca Figma. Cara yang berhasil: **pemilik mengekspor frame sebagai file PDF vektor** (di `C:\Users\ASUS\Downloads\`; kadang dibungkus zip, ekstrak dulu ke folder sementara). Satu PDF bisa berisi beberapa frame berdampingan.
1. Ekstrak dengan `docs/qa/pdf_extract.py`: teks per baris (posisi y, x, ukuran font, isi), gambar (termasuk alpha/smask), dan render PNG per frame. Nama font dan warna teks sudah di-outline di PDF, jadi cocokkan secara visual.
2. Ambil warna & gradasi dengan sampling piksel dari render 1x (mis. kolom x=3 untuk latar halaman).
3. Foto/ilustrasi yang bisa diekstrak: kompres ke webp, simpan di `src/assets/<area>/`, daftarkan di `index.ts`. Yang gagal diekstrak ("bad xref"): pakai foto yang sudah ada + tint, dan catat sebagai placeholder.
4. Konten statis ke `src/data/<halaman>-content.ts`, komponen di `pages/` atau `components/`. Backend nanti.

**Verifikasi (wajib, bukan opsional).** Bangun, lalu bandingkan berdampingan dengan render PDF (kiri hasil kita, kanan desain, potongan ±1000px), perbaiki, ulangi.
- `docs/qa/shot.mjs`: screenshot full-page lewat Playwright (Edge headless via CLI tidak andal).
- `docs/qa/routes.mjs`: semua route di 320/390/1280px, cek overflow horizontal, tepat satu `h1`, error console, redirect.
- Untuk homepage ada audit posisi vertikal elemen kunci vs PDF (target selisih kecil); terapkan ide yang sama untuk halaman lain bila relevan.
- Setup sekali: `cd docs/qa && npm i playwright-core && npx playwright-core install chromium`; Python: `pip install pymupdf pillow`.

**Gaya kerja dengan pemilik.**
- Lingkup ketat: kalau bilang "homepage ONLY", jangan sentuh halaman lain.
- Tanya hanya jika benar-benar buntu; selain itu pilih default masuk akal dan sebutkan di ringkasan.
- Laporan jujur: sebut apa yang belum align, yang ditebak, dan yang tidak bisa diverifikasi. Jangan klaim selesai tanpa tsc/lint/build dan perbandingan visual.
- **Commit hanya saat diminta; push hanya saat diminta eksplisit.** (Untuk sesi tanpa pengawasan lihat prompt: commit lokal per halaman diizinkan, push tidak.)
- Perbaiki typo di desain (mis. "Assesment" → "Assessment", "Growtcamp" → "Growthcamp"), kecuali pemilik minta persis.
- Tool: file besar tulis lewat tool Write, bukan heredoc panjang di Bash (pernah gagal di-parse). Heredoc Python pendek aman (`<<'PYEOF'`). Peringatan git "LF will be replaced by CRLF" tidak berbahaya.

## 5. Status & yang belum

Selesai (dibandingkan dengan PDF): Home (jarak ±12px, tinggi 6764 vs 6763), Explore Page `/programs`, Discover, Assessment, Grow, Apply landing. Tinggi halaman Discover/Grow/Apply masih 3-6% beda dari desain.

Belum / perlu perhatian:
1. **Halaman per program**: GrowthCamp (`/learn/growthcamp`), GrowthX (`/apply/growthx`), GrowthConnect (`/apply/growthconnect`). Dari Figma juga ada form multi-langkah (GrowthCamp/GrowthX/GrowthConnect, ±18 layar, status terisi, validasi, keyboard), Login/Loading, dan dialog; belum ada yang dibangun.
2. **Learn** dibangun dari capture MCP lama (sebelum desain hijau); kemungkinan usang. Minta PDF terbaru.
3. Jawaban FAQ di Grow/Apply/Learn **ditulis berdasarkan konteks** karena PDF hanya menampilkan pertanyaan (kecuali yang expanded); minta pemilik meninjau.
4. Foto latar hero Discover & Assessment: placeholder (foto homepage + tint).
5. Logo kolaborasi (Learnit Tab, Tutorlogy, Hinge Meal, Hi.Pud): resolusi sedang; "Hinge Meal" nama yang dikonfirmasi.
6. Foto mentor masih siluet placeholder.
7. Backend Supabase belum tersambung; konten statis dulu (keputusan pemilik).
8. Lisensi Budget 2012 dan EB Garamond-sebagai-pengganti perlu dikonfirmasi pemilik/desainer.

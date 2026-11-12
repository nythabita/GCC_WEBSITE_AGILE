# GCC Website Agile

Website Growth Consulting Club (GCC) untuk memperkenalkan komunitas dan perjalanan mahasiswa melalui **Discover → Learn → Apply → Grow**.

README ini menjelaskan struktur dan implementasi yang tersedia di repository saat ini.

## Teknologi

- **Frontend:** React 19, TypeScript, Vite 8.
- **Styling:** Tailwind CSS 4 melalui plugin Vite, dengan token dan class bersama di `src/styles/global.css`.
- **Routing:** React Router 8 menggunakan `BrowserRouter`.
- **Ikon:** Lucide React.
- **Backend konten:** schema PostgreSQL/Supabase, script Node.js, dan kontrak TypeScript bersama. Tidak ada custom HTTP server di repository ini.
- **Pemeriksaan kode:** TypeScript dan Oxlint; pengujian backend menggunakan Node Test Runner dan PGlite.

## Status implementasi

- Homepage sudah terhubung ke route `/` dan menampilkan Hero, About, serta journey Learn/Apply/Grow.
- Konten homepage berasal dari draft lokal `src/data/homepage-draft.ts`. Statusnya `example`, sehingga halaman menampilkan pemberitahuan draft.
- Halaman Learn, Apply, dan Grow masih berupa preview/Coming Soon.
- Navbar tersedia untuk desktop dan mobile. File `footer.tsx` masih kosong dan belum dirender.
- Fondasi backend konten tersedia di `backend/`, tetapi frontend belum melakukan fetch Supabase.
- Login, registrasi, assessment, dan detail program penuh belum diimplementasikan.
- CommunityGallery, StartingPoint, dan TrackRecord masih berupa rencana yang dicatat dalam komentar homepage, belum berupa komponen aktif.

## Struktur repository

```text
GCC_WEBSITE_AGILE/
├── public/                         # Aset statis yang disajikan langsung
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── brand/                  # Aset brand dan index ekspornya
│   ├── components/
│   │   ├── home/                   # Section dan kartu homepage
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ProgramsSection.tsx # Journey Learn/Apply/Grow
│   │   │   ├── ProgramCard.tsx
│   │   │   └── README.md           # Catatan implementasi homepage
│   │   ├── layout/
│   │   │   ├── navbar.tsx          # Navigasi bersama desktop/mobile
│   │   │   ├── PreviewPage.tsx     # Layout halaman preview
│   │   │   └── footer.tsx          # File kosong, belum dipakai
│   │   └── UI/
│   │       ├── button.tsx          # Komponen Button reusable
│   │       └── button-styles.ts    # Helper style button dan link
│   ├── data/
│   │   ├── navigation.ts          # Label dan path navigasi
│   │   └── homepage-draft.ts      # Konten lokal yang dipakai homepage
│   ├── pages/
│   │   ├── HomePage.tsx           # Merangkai section homepage
│   │   ├── LearnPage.tsx
│   │   ├── ApplyPage.tsx
│   │   └── GrowPage.tsx
│   ├── styles/
│   │   └── global.css            # Tailwind, token brand, dan style aktif
│   ├── App.tsx                   # Navbar dan definisi route
│   ├── main.tsx                  # Entry React, router, dan import CSS aktif
│   ├── App.css                   # Sisa starter, tidak diimpor entry aktif
│   └── index.css                 # Sisa starter, tidak diimpor entry aktif
├── shared/
│   └── homepage.ts               # Tipe HomepageContent untuk frontend/backend
├── backend/
│   ├── schema.sql                # Schema, validasi database, dan akses publik
│   ├── content.ts                # Validasi kontrak konten
│   ├── update.ts                 # Validasi/publikasi dokumen homepage
│   ├── smoke.ts                  # Pemeriksaan akses API hosted
│   ├── homepage.example.json     # Contoh lengkap konten homepage
│   ├── *.test.ts                 # Pengujian konten, SQL, update, dan smoke
│   ├── .env.example              # Template environment script backend
│   ├── frontend.env.example      # Template untuk integrasi frontend mendatang
│   ├── package.json              # Dependency dan script backend terpisah
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── README.md                 # Setup dan kontrak backend terperinci
│   └── DEPLOYMENT.md             # Catatan deployment backend
├── docs/
│   ├── design.md                 # Panduan brand dan desain
│   ├── dev-a-brief.md            # Brief/handoff pekerjaan homepage
│   ├── fonts/                    # Referensi font dan status penggunaannya
│   └── *.png                     # Referensi visual GCC
├── index.html                    # Dokumen HTML dan mount point React
├── package.json                  # Dependency dan script frontend
├── package-lock.json
├── vite.config.ts                # Plugin React dan Tailwind
├── tsconfig.json                 # Referensi konfigurasi TypeScript
├── tsconfig.app.json             # Konfigurasi TypeScript aplikasi
├── tsconfig.node.json            # Konfigurasi TypeScript tooling
└── README.md
```

Gunakan kapitalisasi path sesuai file aslinya, khususnya `components/UI/`, `navbar.tsx`, dan `footer.tsx`, agar import tetap bekerja pada filesystem yang case-sensitive.

## Alur aplikasi dan data

```text
index.html
  → src/main.tsx (StrictMode + BrowserRouter + global.css)
    → src/App.tsx
      ├── Navbar ← data/navigation.ts
      └── Routes
        ├── /       → HomePage ← data/homepage-draft.ts
        │             ├── HeroSection
        │             ├── AboutSection
        │             └── ProgramsSection → ProgramCard
        ├── /learn  → LearnPage → PreviewPage
        ├── /apply  → ApplyPage → PreviewPage
        └── /grow   → GrowPage  → PreviewPage
```

`HomePage` menerima props `content` bertipe `HomepageContent` dari `shared/homepage.ts`. Konten dibagi menjadi `hero`, `about`, dan `journey`, lalu diteruskan ke section masing-masing. CTA **Explore GCC** menuju anchor `#journey` pada `ProgramsSection`.

Tipe bersama juga digunakan backend. Frontend tidak perlu mengimpor script Node.js dari `backend/`. Saat ini belum ada API loader, loading state API, atau error/retry API di frontend.

## Routing

| Label | Path | Implementasi saat ini |
| --- | --- | --- |
| Discover | `/` | Homepage dengan konten draft lokal |
| Learn | `/learn` | Halaman preview |
| Apply | `/apply` | Halaman preview |
| Grow | `/grow` | Halaman preview |
| Fallback | `*` | Merender homepage; belum ada halaman 404 khusus |

Hosting harus mendukung fallback route aplikasi ke `index.html` agar direct URL dan refresh `/learn`, `/apply`, dan `/grow` bekerja dengan `BrowserRouter`.

## Menjalankan frontend

Gunakan **Node.js 24.12+** agar dapat menjalankan frontend dan script backend dalam satu environment, serta npm.

Dari root repository:

```bash
npm ci
npm run dev
```

Buka URL yang ditampilkan Vite di terminal. Frontend saat ini dapat berjalan tanpa environment variable karena menggunakan draft lokal.

| Command | Fungsi |
| --- | --- |
| `npm ci` | Menginstal dependency berdasarkan lockfile |
| `npm run dev` | Menjalankan development server dengan HMR |
| `npm run build` | Memeriksa TypeScript dan menghasilkan build di `dist/` |
| `npm run lint` | Menjalankan Oxlint |
| `npm run preview` | Menyajikan hasil build lokal; jalankan build dahulu |

Root belum menyediakan script `npm test` atau suite pengujian browser otomatis.

## Backend konten homepage

Folder `backend/` memiliki dependency dan lockfile sendiri. Untuk pemeriksaan lokal:

```bash
cd backend
npm ci
npm test
npm run check
npm run content:validate
```

`content:validate` memvalidasi `homepage.example.json` tanpa memublikasikannya. Pengujian lokal tidak membuktikan API hosted sudah berjalan.

Kontrak v1 mencakup `schemaVersion`, `contentStatus`, `notice`, `hero`, `about`, dan tiga item `journey` berurutan: Learn, Apply, Grow. Konten dengan status `example` harus menampilkan `notice`.

Endpoint baca yang disiapkan backend:

```http
GET /rest/v1/homepage_content?id=eq.home&select=id,content,updated_at
apikey: <publishable-key>
```

Template `backend/frontend.env.example` menyediakan nama `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` untuk integrasi mendatang; aplikasi saat ini belum membacanya. Secret key hanya untuk script backend tepercaya dan tidak boleh dimasukkan ke variabel `VITE_*`.

Untuk setup database, environment, publikasi konten, dan smoke check hosted, ikuti [panduan backend](backend/README.md). Lihat juga [catatan deployment](backend/DEPLOYMENT.md). Saat integrasi API dilakukan, tangani loading, respons kosong/tidak valid, serta error/retry secara eksplisit.

## Panduan perubahan

| Kebutuhan | Lokasi utama |
| --- | --- |
| Mengubah teks draft homepage | `src/data/homepage-draft.ts` |
| Mengubah susunan homepage | `src/pages/HomePage.tsx` |
| Mengubah tampilan section homepage | `src/components/home/` |
| Menambah route | `src/App.tsx` dan halaman di `src/pages/` |
| Mengubah menu navigasi | `src/data/navigation.ts` dan `src/components/layout/navbar.tsx` |
| Mengubah warna, tipografi, atau spacing bersama | `src/styles/global.css` |
| Mengubah Button bersama | `src/components/UI/` |
| Mengubah kontrak data homepage | `shared/homepage.ts`, validator/schema backend, dan konsumen terkait |
| Mengubah konten yang akan dipublikasikan ke backend | File JSON sesuai panduan `backend/README.md` |

Gunakan aset aplikasi dari `src/assets/brand/`; file dalam `docs/` merupakan referensi dan tidak otomatis tersedia sebagai URL produksi. Status sumber dan penggunaan font dijelaskan di [docs/fonts/README.md](docs/fonts/README.md).

Sebelum menggabungkan perubahan frontend, jalankan `npm run build` dan `npm run lint`. Untuk perubahan backend, jalankan pemeriksaan backend di atas. Lengkapi dengan pengecekan manual layout mobile/desktop, menu mobile, navigasi, anchor journey, keyboard focus, dan refresh route pada hosting.

## Dokumentasi terkait

- [Panduan desain](docs/design.md)
- [Brief pengembangan homepage](docs/dev-a-brief.md)
- [Catatan struktur homepage](src/components/home/README.md)
- [Sumber dan status font](docs/fonts/README.md)
- [Setup dan kontrak backend](backend/README.md)
- [Catatan deployment backend](backend/DEPLOYMENT.md)

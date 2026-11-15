import type { FaqItem } from "../components/content/blocks";

// Copy from the Figma frame "GCC_Apply_Mobile" (1. DISCOVER).

export const applyHero = {
  title: ["Turn Learning", "into Real Impact"],
  description: "Jelajahi jalur kontribusi proyek untuk mahasiswa dan pengajuan tantangan bisnis untuk UMKM.",
  cta: { label: "Pilih jalur kontribusi", to: "/apply#jalur" },
  photoCaption: "GrowthCamp 2025",
};

export const choosePath = {
  title: "Choose Your Path",
  description: "Mulai dari peran dan kebutuhanmu saat ini.",
};

export type PathCard = {
  slug: "growthx" | "growthconnect";
  audience: string;
  name: string;
  tagline: string[];
  description: string;
  details: { title: string; text: string }[];
  cta: { label: string; to: string };
};

export const pathCards: PathCard[] = [
  {
    slug: "growthx",
    audience: "Untuk mahasiswa",
    name: "GrowthX",
    tagline: ["Put Your Skills", "into Practice"],
    description: "Sampaikan minat dan kesiapan untuk berkontribusi dalam proyek bersama GCC.",
    details: [
      { title: "Tujuan", text: "Menerapkan keterampilan consulting melalui kontribusi proyek." },
      { title: "Yang ditinjau", text: "Keahlian, pengalaman, dan ketersediaan waktu." },
      { title: "Langkah berikutnya", text: "Tinjauan kesiapan dan pembentukan tim oleh GCC." },
    ],
    cta: { label: "Lihat GrowthX", to: "/apply/growthx" },
  },
  {
    slug: "growthconnect",
    audience: "Untuk pemilik UMKM",
    name: "GrowthConnect",
    tagline: ["Bring Your", "Business Challenge"],
    description: "Ceritakan konteks usaha dan tantangan bisnis agar GCC memahami kebutuhan Anda.",
    details: [
      { title: "Tujuan", text: "Mengajukan permasalahan bisnis untuk ditinjau bersama GCC." },
      { title: "Yang dibutuhkan", text: "Profil usaha, tantangan, dan hasil yang diharapkan." },
      { title: "Langkah berikutnya", text: "Diskusi kebutuhan dan kesepakatan lingkup proyek." },
    ],
    cta: { label: "Lihat GrowthConnect", to: "/apply/growthconnect" },
  },
];

export const collaborate = {
  title: "How We Collaborate",
  description: "Gambaran proses kolaborasi setelah pengajuan ditinjau.",
  steps: [
    { number: "01", title: "Pahami kebutuhan", description: "GCC meninjau tantangan UMKM dan konteks bisnis yang disampaikan.", tone: "rose" },
    { number: "02", title: "Sepakati lingkup", description: "Tujuan, batas pekerjaan, akses data, dan waktu dibahas bersama.", tone: "teal" },
    { number: "03", title: "Bentuk tim dan analisis", description: "GCC membentuk tim sesuai kesiapan dan kebutuhan proyek. Tim melakukan riset dan analisis.", tone: "rose" },
    { number: "04", title: "Sampaikan rekomendasi", description: "Tim memaparkan temuan dan rekomendasi sesuai lingkup yang disepakati.", tone: "teal" },
  ] as const,
  photoCaption: "GrowthCamp 2025",
};

export const businessCase = {
  title: "Explore a Business Case",
  description: "Kenali bentuk pertanyaan yang dapat dibahas dalam sebuah studi kasus.",
  badge: "Kasus simulasi",
  name: "Kedai Jatinangor",
  intro: "Ilustrasi usaha kedai lokal untuk memahami pendekatan analisis bisnis. Bukan profil mitra GCC.",
  details: [
    { title: "Konteks", text: "Kedai ingin memahami pelanggan dan mengevaluasi pendekatan pemasarannya." },
    { title: "Pertanyaan utama", text: "Bagaimana menentukan strategi pemasaran yang sesuai dengan pelanggan dan kapasitas usaha?" },
    { title: "Contoh keluaran", text: "Analisis pelanggan, pilihan strategi pemasaran, dan rekomendasi langkah awal." },
  ],
  cta: { label: "Lihat contoh kasus", to: "/apply/growthconnect" },
};

export const contribute = {
  title: "Contribute with Purpose",
  description: "Kontribusi disesuaikan dengan kemampuan dan kebutuhan proyek.",
  items: [
    { title: "Research", text: "Mengumpulkan informasi relevan dan memahami konteks permasalahan.", icon: "book" },
    { title: "Analysis", text: "Mengolah informasi untuk menemukan pola dan alternatif solusi.", icon: "goal" },
    { title: "Communication", text: "Menyusun dan menyampaikan rekomendasi dengan jelas.", icon: "chat" },
  ] as const,
  note: "Belum siap untuk proyek? Bangun fondasi terlebih dahulu melalui GrowthCamp.",
  cta: { label: "Kembali ke Learn", to: "/learn" },
};

export const expectations = {
  title: "Set Clear Expectations",
  description: "Kebutuhan dan batas dukungan dibahas sebelum proyek berjalan.",
  items: [
    { title: "Kebutuhan yang jelas", text: "Ceritakan masalah, upaya sebelumnya, dan hasil yang Anda harapkan." },
    { title: "Data sesuai persetujuan", text: "Ketersediaan dan penggunaan data dibahas sesuai kebutuhan dan persetujuan pemilik usaha." },
    { title: "Lingkup yang realistis", text: "Waktu, bentuk keluaran, dan ketentuan kerja sama disepakati bersama. Hasil bisnis tidak dijamin." },
  ],
};

export const applyFaq = {
  title: "Good to Know",
  items: [
    { question: "Apakah pengajuan otomatis diterima?", answer: "Setiap pengajuan ditinjau oleh GCC berdasarkan kesesuaian kebutuhan, kesiapan, dan kapasitas tim." },
    { question: "Apakah tim dibentuk langsung di website?", answer: "Tidak. Tim dibentuk oleh GCC setelah pengajuan ditinjau dan lingkup disepakati." },
    { question: "Bagaimana biaya dan durasi ditentukan?", answer: "Biaya dan durasi dibahas bersama setelah kebutuhan dan lingkup proyek disepakati." },
  ] satisfies FaqItem[],
};

export const applyClosing = {
  title: ["Find Your", "Starting Point"],
  description: "Pilih jalur sesuai kebutuhan dan kesiapanmu saat ini.",
  cta: { label: "Temukan Jalurmu", to: "/assessment" },
};

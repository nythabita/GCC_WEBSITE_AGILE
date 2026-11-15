import type { Step } from "../components/content/blocks";
import type { CardItem, CaseData, TitleLines } from "../components/program/sections";

// GrowthX program page, from the "3. PAGE APPLY (GROWTH X)" Figma export. Static until the backend is connected.
const formTo = "/apply/growthx/form";

export const growthxHero = {
  name: "GrowthX",
  title: ["Put Your Skills", "into Practice"] as TitleLines,
  description: "Sampaikan minat dan kesiapanmu sebagai mentee GCC untuk menerapkan keterampilan consulting melalui kontribusi proyek.",
  cta: { label: "Ajukan Minat GrowthX", to: formTo },
  photoCaption: "GrowthX Matching",
};

export const growthxAbout = {
  eyebrow: "Tentang GrowthX",
  title: ["Connect Learning", "with Contribution"] as TitleLines,
  description: "GrowthX menjadi jalur untuk mengenali kesiapan mentee dan membentuk tim sesuai kebutuhan proyek yang telah ditinjau GCC.",
  cards: [
    { title: "Untuk siapa?", text: "Mentee GCC yang ingin mengeksplorasi kontribusi pada proyek dan memiliki keterampilan yang relevan." },
    { title: "Fokus kontribusi", text: "Riset, analisis bisnis, dan komunikasi rekomendasi sesuai lingkup proyek." },
    { title: "Cara bergabung", text: "Ajukan minat dan gambaran kemampuanmu. GCC meninjau kesiapan sebelum membentuk tim." },
  ] as CardItem[],
  note: "Pengajuan belum menjamin penempatan proyek. Pembentukan tim mempertimbangkan kesiapan, kebutuhan, dan kapasitas GCC.",
};

export const growthxContribute = {
  eyebrow: "Contoh area kontribusi",
  title: ["Where You Can", "Contribute"] as TitleLines,
  description: "Peran dan bentuk pekerjaan mengikuti kebutuhan proyek yang disepakati.",
  items: [
    { title: "Research", text: "Mengumpulkan informasi relevan, memahami konteks usaha, dan menyusun temuan awal." },
    { title: "Analysis", text: "Mengolah informasi, memetakan masalah, dan membandingkan alternatif solusi." },
    { title: "Presentation", text: "Menyusun alur rekomendasi dan memaparkan alasan yang mendukungnya." },
  ] as CardItem[],
};

export const growthxReadiness = {
  eyebrow: "Tinjauan kesiapan",
  title: "Show Your Readiness",
  description: "Ceritakan kemampuan dan pengalamanmu agar GCC dapat memahami kesiapan kontribusimu.",
  aspects: [
    { title: "Keahlian yang relevan", text: "Jelaskan bidang yang kamu kuasai, misalnya riset, analisis data, pemecahan masalah, atau presentasi." },
    { title: "Bukti pengalaman", text: "Ceritakan proyek, tugas kuliah, atau pengalaman organisasi yang menunjukkan kontribusimu. Tautan portofolio bersifat opsional." },
    { title: "Pendekatan mini-case", text: "Tunjukkan bagaimana kamu memahami konteks, menyusun pertanyaan, dan mempertimbangkan solusi pada contoh kasus." },
    { title: "Ketersediaan dan komitmen", text: "Sampaikan waktu yang dapat kamu alokasikan serta batasan yang perlu dipertimbangkan." },
  ] as CardItem[],
  note: "Tinjauan dilakukan oleh GCC. Prototype ini belum melakukan penilaian, seleksi, atau pencocokan tim secara otomatis.",
};

export const growthxFlow = {
  eyebrow: "Alur partisipasi",
  title: ["From Interest", "to Project Team"] as TitleLines,
  description: "Kenali tahap yang dilalui sebelum berkontribusi dalam sebuah proyek.",
  steps: [
    { number: "01", title: "Ajukan minat", description: "Lengkapi profil, kompetensi, pengalaman, dan ketersediaan waktu.", tone: "teal" },
    { number: "02", title: "Tinjauan kesiapan", description: "GCC meninjau kesesuaian kemampuan dan kebutuhan proyek.", tone: "teal" },
    { number: "03", title: "Pembentukan tim", description: "GCC membentuk tim sesuai hasil tinjauan, kebutuhan peran, dan kapasitas.", tone: "rose" },
    { number: "04", title: "Kontribusi proyek", description: "Tim melakukan riset, analisis, dan penyusunan rekomendasi sesuai lingkup yang disepakati.", tone: "teal" },
  ] as Step[],
  note: "Pembentukan tim dikelola oleh GCC di luar website. Detail proyek dan peran dibahas setelah ada kesesuaian.",
  photoCaption: "Kolaborasi dan pembahasan proyek",
};

export const growthxCase = {
  eyebrow: "Gambaran penerapan",
  title: "Explore a Business Case",
  description: "Lihat contoh pertanyaan analisis sebelum mengajukan minat proyek.",
  data: {
    badge: "Kasus simulasi",
    name: "Kedai Jatinangor",
    question: "Bagaimana menyusun pendekatan pemasaran yang sesuai dengan pelanggan dan kapasitas sebuah kedai lokal?",
    focus: "Contoh fokus: memahami pelanggan, mengidentifikasi masalah, dan menyusun alternatif rekomendasi.",
    disclaimer: "Ilustrasi pembelajaran, bukan proyek yang sedang membuka pendaftaran atau profil mitra GCC.",
    cta: { label: "Lihat contoh kasus", to: "/apply" },
  } as CaseData,
};

export const growthxFit = {
  eyebrow: "Peserta dan komitmen",
  title: "Is GrowthX for You?",
  description: "Pertimbangkan jalur ini jika kamu siap menjelaskan kemampuan dan menjalankan tanggung jawab dalam tim.",
  points: [
    "Kamu mentee GCC yang tertarik menerapkan keterampilan pada permasalahan bisnis.",
    "Kamu dapat menjelaskan kemampuan dan pengalaman yang relevan secara jujur.",
    "Kamu bersedia berkolaborasi, memenuhi komitmen waktu, dan menjaga kerahasiaan informasi sesuai ketentuan proyek.",
  ],
  note: "Masih ingin memperkuat fondasi? Jelajahi GrowthCamp melalui halaman Learn.",
  cta: { label: "Jelajahi Learn", to: "/learn" },
};

export const growthxPlan = {
  eyebrow: "Informasi partisipasi",
  title: "Plan Your Contribution",
  description: "Detail berikut mengikuti proyek yang telah ditinjau dan disepakati.",
  items: [
    { title: "Ketersediaan proyek", text: "Dikonfirmasi oleh GCC; belum ada daftar proyek aktif pada prototype ini." },
    { title: "Durasi dan komitmen waktu", text: "Dibahas sesuai kebutuhan dan lingkup proyek." },
    { title: "Peran dan pembagian tim", text: "Ditentukan oleh GCC berdasarkan kesiapan dan kebutuhan proyek." },
    { title: "Ketentuan partisipasi", text: "Termasuk etika, kerahasiaan, dan biaya jika berlaku; belum diumumkan." },
  ] as CardItem[],
};

export const growthxPrepare = {
  eyebrow: "Sebelum mengisi formulir",
  title: ["Prepare Your", "Application"] as TitleLines,
  description: "Siapkan informasi berikut untuk menceritakan kesiapanmu.",
  items: [
    { title: "Profil dan kontak", text: "Informasi diri serta latar pendidikan yang diminta." },
    { title: "Kompetensi dan pengalaman", text: "Keahlian utama, pengalaman relevan, portofolio opsional, dan pendekatan mini-case." },
    { title: "Ketersediaan waktu", text: "Komitmen waktu dan batasan yang perlu diketahui GCC." },
  ] as CardItem[],
  note: "Kamu dapat meninjau dan mengubah isian sebelum menyelesaikan simulasi. Data belum dikirim dan belum ada keputusan penerimaan.",
};

// TODO(review): Figma shows only the first answer in full; the other three answers are drafted from the page's own wording.
export const growthxFaq = [
  { question: "Apakah pengajuan menjamin penempatan proyek?", answer: "Belum. GCC meninjau kesiapan dan kesesuaian kebutuhan proyek serta kapasitas sebelum membentuk tim." },
  { question: "Bagaimana tim proyek dibentuk?", answer: "GCC membentuk tim sesuai hasil tinjauan, kebutuhan peran, dan kapasitas. Proses ini dikelola di luar website." },
  { question: "Apakah harus mengikuti GrowthCamp terlebih dahulu?", answer: "Belum ada ketentuan yang diumumkan. GrowthCamp tersedia di halaman Learn untuk memperkuat fondasi." },
  { question: "Bagaimana durasi dan ketentuan proyek ditentukan?", answer: "Dibahas sesuai kebutuhan dan lingkup proyek yang disepakati. Detail belum ditetapkan pada prototype." },
];

export const growthxClosing = {
  title: ["Ready to Put Your", "Skills into Practice?"] as TitleLines,
  description: "Ceritakan minat, kemampuan, dan kesiapan kontribusimu.",
  cta: { label: "Ajukan Minat GrowthX", to: formTo },
};

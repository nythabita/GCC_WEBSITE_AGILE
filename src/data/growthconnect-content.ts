import type { Step } from "../components/content/blocks";
import type { CardItem, CaseData, TitleLines } from "../components/program/sections";

// GrowthConnect program page, from the "4. PAGE APPLY - GROWTHCONNECT" Figma export. Static until the backend is connected.
const formTo = "/apply/growthconnect/form";

export const connectHero = {
  eyebrow: "Pengajuan tantangan bisnis • UMKM",
  name: "GrowthConnect",
  title: ["Bring Your", "Business Challenge"] as TitleLines,
  description: "Ceritakan tantangan bisnis Anda agar GCC dapat memahami kebutuhan usaha dan meninjau kemungkinan kolaborasi.",
  cta: { label: "Ajukan Kasus Bisnis", to: formTo },
};

export const connectAbout = {
  eyebrow: "Tentang GrowthConnect",
  title: ["Start with Your", "Business Needs"] as TitleLines,
  description: "GrowthConnect adalah jalur bagi UMKM untuk mengajukan permasalahan bisnis. Pengajuan membantu GCC memahami konteks usaha sebelum membahas kebutuhan dan lingkup kolaborasi.",
  cards: [
    { title: "Untuk siapa?", text: "Pemilik UMKM atau perwakilan usaha yang memahami kondisi bisnis dan kebutuhan pengembangan usahanya." },
    { title: "Apa yang diajukan?", text: "Konteks usaha, tantangan utama, upaya yang sudah dilakukan, dan hasil yang diharapkan." },
    { title: "Langkah berikutnya", text: "GCC meninjau pengajuan sesuai kebutuhan dan kapasitas sebelum melanjutkan diskusi." },
  ] as CardItem[],
  note: "Pengajuan belum berarti proyek diterima. Pelaksanaan dibahas setelah ada kesesuaian dan kesepakatan lingkup.",
};

export const connectAreas = {
  eyebrow: "Contoh area tantangan",
  title: ["What Would You", "Like to Improve?"] as TitleLines,
  description: "Gunakan contoh berikut untuk membantu menjelaskan kebutuhan usaha Anda.",
  items: [
    { title: "Pemasaran dan pelanggan", text: "Misalnya memahami pelanggan, mengevaluasi saluran promosi, atau menentukan prioritas pemasaran." },
    { title: "Operasional usaha", text: "Misalnya memahami alur kerja, kendala proses, atau kebutuhan pengelolaan kegiatan usaha." },
    { title: "Informasi keuangan usaha", text: "Misalnya memahami pencatatan dasar, struktur biaya, atau informasi usaha yang perlu dianalisis." },
  ] as CardItem[],
  note: "Contoh ini merupakan area pembahasan. Bentuk dukungan akhir mengikuti hasil tinjauan dan kemampuan tim GCC.",
};

export const connectProblem = {
  eyebrow: "Pahami masalah utama",
  title: "Tell Us the Real Problem",
  description: "Anda tidak perlu sudah memiliki rumusan masalah yang sempurna. Mulai dengan menceritakan situasi yang sedang dihadapi.",
  questions: [
    { title: "Apa yang sedang terjadi?", text: "Ceritakan situasi yang menjadi perhatian dan sejak kapan hal tersebut dirasakan." },
    { title: "Di bagian mana dampaknya terasa?", text: "Jelaskan proses, pelanggan, atau kegiatan usaha yang terpengaruh. Sertakan contoh jika ada." },
    { title: "Apa yang sudah dicoba?", text: "Sampaikan langkah yang pernah dilakukan dan apa yang berubah atau belum teratasi." },
    { title: "Hasil apa yang diharapkan?", text: "Jelaskan perubahan yang ingin dicapai dan bagaimana Anda mengenali adanya perbaikan." },
    { title: "Apa batasan yang perlu dipahami?", text: "Ceritakan kendala waktu, sumber daya, dan ketersediaan informasi yang relevan." },
  ] as CardItem[],
};

export const connectFlow = {
  eyebrow: "Alur pengajuan dan kolaborasi",
  title: ["From Challenge", "to Recommendations"] as TitleLines,
  description: "Gambaran proses yang dibahas setelah pengajuan ditinjau.",
  steps: [
    { number: "01", title: "Ceritakan tantangan", description: "Isi profil usaha, konteks permasalahan, dan hasil yang diharapkan.", tone: "teal" },
    { number: "02", title: "Diskusikan kebutuhan", description: "GCC meninjau kesesuaian kebutuhan dan kapasitas, lalu membahas konteks usaha lebih lanjut.", tone: "teal" },
    { number: "03", title: "Sepakati lingkup", description: "Bahas tujuan, bentuk keluaran, akses data, durasi, dan ketentuan kerja sama.", tone: "rose" },
    { number: "04", title: "Tinjau rekomendasi", description: "Jika proyek disepakati, tim melakukan analisis dan memaparkan rekomendasi untuk ditinjau bersama.", tone: "teal" },
  ] as Step[],
  note: "Pada prototype, proses ini ditampilkan sebagai gambaran. Belum ada pengiriman data, peninjauan otomatis, atau persetujuan proyek melalui website.",
};

export const connectExpect = {
  title: "What to Expect",
  description: "Keluaran dibahas berdasarkan kebutuhan dan lingkup proyek yang disepakati.",
  items: [
    { title: "Pemahaman masalah", text: "Ringkasan konteks dan temuan analisis yang membantu memahami tantangan usaha." },
    { title: "Alternatif rekomendasi", text: "Pilihan pendekatan beserta alasan dan pertimbangan yang relevan." },
    { title: "Langkah awal yang realistis", text: "Prioritas tindak lanjut yang mempertimbangkan kondisi dan kapasitas usaha." },
  ] as CardItem[],
  note: "Dukungan berfokus pada analisis dan rekomendasi. Implementasi, pendampingan lanjutan, serta hasil bisnis mengikuti kesepakatan dan tidak dijamin.",
};

export const connectPrepare = {
  title: ["Prepare Your", "Business Information"] as TitleLines,
  description: "Siapkan informasi ringkas berikut untuk membantu GCC memahami pengajuan Anda.",
  items: [
    { title: "Profil usaha dan kontak", text: "Nama usaha, industri, lokasi, gambaran kegiatan, serta peran dan kontak pengisi formulir." },
    { title: "Tantangan dan konteks", text: "Permasalahan utama, dampak yang dirasakan, dan upaya yang telah dilakukan." },
    { title: "Tujuan dan batasan", text: "Hasil yang diharapkan, kebutuhan waktu, serta keterbatasan sumber daya." },
    { title: "Ketersediaan informasi", text: "Gambaran data yang tersedia untuk mendukung analisis. Penggunaan data dibahas sesuai kebutuhan dan persetujuan." },
  ] as CardItem[],
  note: "Mulai dengan ringkasan usaha. Detail kebutuhan data dan kerahasiaan dibahas sebelum pelaksanaan proyek.",
};

export const connectCase = {
  eyebrow: "Contoh perumusan kasus",
  title: "See a Business Case",
  description: "Contoh berikut membantu menggambarkan bentuk pertanyaan bisnis yang dapat diajukan.",
  data: {
    badge: "Kasus simulasi",
    name: "Kedai Jatinangor",
    question: "Bagaimana menyusun pendekatan pemasaran yang sesuai dengan pelanggan dan kapasitas sebuah kedai lokal?",
    focus: "Contoh fokus: memahami pelanggan, mengevaluasi saluran promosi, dan menentukan prioritas langkah awal.",
    disclaimer: "Ilustrasi pembelajaran, bukan profil mitra atau bukti hasil proyek GCC.",
    cta: { label: "Lihat contoh kasus", to: "/apply" },
  } as CaseData,
};

export const connectPlan = {
  eyebrow: "Informasi kolaborasi",
  title: "Plan the Collaboration",
  description: "Detail pelaksanaan dikonfirmasi sesuai kebutuhan dan kapasitas GCC.",
  items: [
    { title: "Area pengajuan", text: "Fokus awal Jatinangor dan Bandung; cakupan pelaksanaan mengikuti konfirmasi GCC." },
    { title: "Kesesuaian pengajuan", text: "Ditinjau berdasarkan kebutuhan, ketersediaan informasi, dan kapasitas tim." },
    { title: "Durasi dan jadwal", text: "Dibahas setelah konteks dan lingkup proyek dipahami." },
    { title: "Biaya dan ketentuan", text: "Belum ditetapkan pada prototype. Dibahas sesuai lingkup dan kesepakatan proyek." },
  ] as CardItem[],
};

// TODO(review): Figma shows only the first answer in full; the other three answers are drafted from the page's own wording.
export const connectFaq = [
  { question: "Apakah semua pengajuan akan diterima?", answer: "Setiap pengajuan ditinjau berdasarkan kesesuaian kebutuhan dan kapasitas GCC. Pengajuan belum menjamin dimulainya proyek." },
  { question: "Bagaimana biaya dan durasi ditentukan?", answer: "Dibahas setelah konteks dan lingkup proyek dipahami. Biaya dan ketentuan belum ditetapkan pada prototype." },
  { question: "Data apa yang perlu disiapkan?", answer: "Mulai dengan ringkasan usaha. Detail kebutuhan data dan kerahasiaan dibahas sebelum pelaksanaan proyek." },
  { question: "Apakah masalah harus sudah dirumuskan dengan jelas?", answer: "Tidak perlu. Mulai dengan menceritakan situasi yang sedang dihadapi; GCC membantu memahami kebutuhannya." },
];

export const connectClosing = {
  title: ["Start with Your", "Business Challenge"] as TitleLines,
  description: "Ceritakan kebutuhan usaha Anda sebagai langkah awal untuk ditinjau oleh GCC.",
  cta: { label: "Ajukan Kasus Bisnis", to: formTo },
};

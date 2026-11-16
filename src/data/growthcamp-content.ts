import type { Step } from "../components/content/blocks";
import type { CardItem, LabeledItem, TitleLines } from "../components/program/sections";

// GrowthCamp program page, from the "2. PAGE LEARN" Figma export (landing frame). Static until the backend is connected.
const formTo = "/learn/growthcamp/form";

export const campHero = {
  eyebrow: "Program pembelajaran • Mahasiswa",
  name: "GrowthCamp",
  title: ["Build Your", "Consulting Foundation"] as TitleLines,
  description: "Bootcamp intensif untuk membangun fondasi consulting dan problem solving sebelum mengeksplorasi pengalaman proyek.",
  cta: { label: "Daftar GrowthCamp", to: formTo },
  photoCaption: "Sesi belajar bersama GCC",
};

export const campAbout = {
  eyebrow: "Tentang program",
  title: ["Start with the", "Right Foundation"] as TitleLines,
  description: "GrowthCamp membantu mahasiswa mengenali cara berpikir terstruktur, memahami konteks masalah, dan melatih penyampaian rekomendasi.",
  cards: [
    { title: "Untuk siapa?", text: "Mahasiswa yang ingin membangun fondasi consulting dan problem solving." },
    { title: "Fokus pembelajaran", text: "Critical thinking, analisis masalah, dan komunikasi rekomendasi." },
    { title: "Arah pengembangan", text: "Bekal untuk mengeksplorasi penerapan keterampilan pada tahap berikutnya." },
  ] as CardItem[],
};

export const campPractice = {
  eyebrow: "Tujuan pembelajaran",
  title: "What You Will Practice",
  description: "Kemampuan berikut menjadi fokus latihan selama proses belajar.",
  items: [
    { title: "Think Structurally", text: "Memahami konteks, menyusun pertanyaan, dan memecah masalah menjadi bagian yang lebih jelas." },
    { title: "Develop Solutions", text: "Menghubungkan informasi dengan temuan dan mempertimbangkan alternatif solusi." },
    { title: "Communicate Clearly", text: "Menyusun alur penyampaian analisis dan rekomendasi yang mudah dipahami." },
  ] as CardItem[],
};

export const campInside = {
  eyebrow: "Gambaran materi",
  title: "Inside GrowthCamp",
  description: "Empat bagian pembelajaran, dari memahami masalah hingga memaparkan rekomendasi.",
  parts: [
    { title: "Think Like a Consultant", text: "Kenali cara berpikir consulting, konteks bisnis, dan pertanyaan yang perlu dijawab.", extra: { label: "Fokus latihan", text: "Memecah masalah dan menyusun pertanyaan analisis." } },
    { title: "Turn Insights into Solutions", text: "Hubungkan informasi dan temuan untuk menyusun pilihan solusi yang relevan.", extra: { label: "Fokus latihan", text: "Mengembangkan alternatif solusi beserta alasannya." } },
    { title: "Take on a Real Business Case", text: "Gunakan studi kasus untuk melatih penerapan konsep dan analisis bisnis.", extra: { label: "Fokus latihan", text: "Menganalisis kasus pembelajaran dan merumuskan rekomendasi." } },
    { title: "Present and Defend Your Recommendations", text: "Latih alur presentasi serta alasan yang mendukung rekomendasimu.", extra: { label: "Fokus latihan", text: "Memaparkan rekomendasi dan menjawab pertanyaan." } },
  ] as LabeledItem[],
};

export const campProcess = {
  eyebrow: "Proses belajar",
  title: "Learn. Discuss. Practice.",
  description: "Gabungkan pemahaman konsep dengan latihan penerapan dan komunikasi.",
  items: [
    { title: "Pembahasan konsep", text: "Bangun pemahaman dasar sebelum masuk ke studi kasus." },
    { title: "Diskusi kasus", text: "Bandingkan cara memahami masalah dan alasan di balik alternatif solusi." },
    { title: "Latihan rekomendasi", text: "Susun dan presentasikan gagasan secara terstruktur." },
  ] as CardItem[],
  photoCaption: "Sesi #3 GrowthCamp 2025",
};

export const campFit = {
  eyebrow: "Peserta dan komitmen",
  title: "Is GrowthCamp for You?",
  description: "Jalur ini dapat kamu pertimbangkan jika ingin mulai membangun fondasi consulting.",
  points: [
    "Kamu mahasiswa yang tertarik pada analisis dan pemecahan masalah bisnis.",
    "Kamu bersedia belajar, berdiskusi, dan mengikuti latihan yang diberikan.",
    "Kamu siap menyampaikan minat belajar dan komitmen waktu secara jujur.",
  ],
  note: "Periksa ketentuan peserta dan komitmen akhir saat informasi program diumumkan.",
};

export const campPlan = {
  eyebrow: "Informasi pelaksanaan",
  title: "Plan Your Participation",
  description: "Detail berikut akan diperbarui setelah dikonfirmasi oleh GCC.",
  items: [
    { title: "Jadwal dan durasi", text: "Belum diumumkan." },
    { title: "Format dan lokasi", text: "Belum diumumkan." },
    { title: "Komitmen waktu", text: "Akan dijelaskan bersama jadwal program." },
    { title: "Biaya program", text: "Belum diumumkan." },
  ] as CardItem[],
};

export const campJourney = {
  eyebrow: "Sebelum mendaftar",
  title: ["Your Registration", "Journey"] as TitleLines,
  description: "Formulir membantu GCC memahami kebutuhan dan kesiapan belajarmu.",
  steps: [
    { number: "01", title: "Isi profil dasar", description: "Lengkapi nama, kontak, dan informasi pendidikan yang diminta.", tone: "teal" },
    { number: "02", title: "Ceritakan tujuan belajar", description: "Sampaikan minat, motivasi, gambaran kemampuan awal, dan komitmen waktu.", tone: "teal" },
    { number: "03", title: "Tinjau kembali isian", description: "Periksa jawaban dan ubah informasi yang perlu diperbaiki sebelum menyelesaikan simulasi.", tone: "rose" },
  ] as Step[],
  note: "Pengisian berfokus pada minat dan kesiapan belajar. Pada prototype, formulir hanya simulasi; belum ada pengiriman atau keputusan penerimaan.",
};

// TODO(review): Figma shows only the first answer in full; the other three answers are drafted from the page's own wording.
export const campFaq = [
  { question: "Apakah harus punya pengalaman consulting?", answer: "GrowthCamp berfokus pada fondasi. Sampaikan gambaran kemampuan awalmu dan periksa persyaratan peserta saat ketentuan program diumumkan." },
  { question: "Apakah langsung mendapat proyek setelah GrowthCamp?", answer: "Belum ada ketentuan yang diumumkan. GrowthCamp berfokus pada pembelajaran; pengalaman proyek tersedia melalui jalur lain di halaman Apply." },
  { question: "Kapan jadwal dan biaya diumumkan?", answer: "Jadwal, durasi, dan biaya belum diumumkan. Detail akan diperbarui setelah dikonfirmasi oleh GCC." },
  { question: "Apa yang perlu disiapkan untuk mendaftar?", answer: "Nama, kontak, informasi pendidikan, tujuan belajar, dan gambaran komitmen waktumu." },
];

export const campClosing = {
  title: ["Ready to Build", "Your Foundation?"] as TitleLines,
  description: "Mulai dengan menceritakan minat dan tujuan belajarmu.",
  cta: { label: "Daftar GrowthCamp", to: formTo },
};

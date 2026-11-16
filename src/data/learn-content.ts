import type { FaqItem, Step } from "../components/content/blocks";
import type { CardItem, TitleLines } from "../components/program/sections";
import { learnHeroPhoto, learnWorkshopPhoto } from "../assets/learn";

// Learn page copy from the "2. PAGE LEARN" Figma export (frame 1); design extract lives in docs/design/learn.

export const learnHero = {
  eyebrow: "Learn with GCC",
  title: ["Build Your", "Consulting Foundation"] as TitleLines,
  description: "Bangun cara berpikir terstruktur, pelajari problem solving, dan latih komunikasi melalui proses belajar bersama GCC.",
  cta: { label: "Lihat GrowthCamp", to: "/learn/growthcamp" },
  secondary: { label: "Belum yakin? Temukan jalurmu", to: "/assessment" },
  photo: { src: learnHeroPhoto, alt: "Peserta onboarding GrowthCamp 2025 dalam pertemuan daring", caption: "Onboarding GrowthCamp 2025" },
};

export const competencies = {
  eyebrow: "Fondasi yang dikembangkan",
  title: "Skills to Start With",
  description: "Kenali kemampuan yang dilatih dalam proses belajar.",
  items: [
    { title: "Critical Thinking", text: "Memahami konteks dan menyusun pertanyaan yang tepat." },
    { title: "Problem Solving", text: "Memecah masalah dan menyusun alternatif solusi." },
    { title: "Communication", text: "Menyampaikan analisis dan rekomendasi secara jelas." },
  ] as CardItem[],
};

export const featuredGrowthCamp = {
  name: "GrowthCamp",
  tagline: ["Learn the Fundamentals.", "Practice with Purpose."],
  description: "Bootcamp untuk mahasiswa yang ingin membangun fondasi consulting dan problem solving sebelum mengeksplorasi pengalaman proyek.",
  photo: { src: learnWorkshopPhoto, alt: "Peserta workshop GrowthCamp berfoto bersama di ruang kelas", caption: "Workshop GrowthCamp" },
  facts: [
    { label: "Untuk mahasiswa", value: "Yang ingin membangun fondasi consulting." },
    { label: "Fokus awal", value: "Motivasi, minat belajar, dan komitmen waktu." },
  ],
  overviewTitle: "Gambaran pembelajaran",
  overview: ["Think Like a Consultant", "Turn Insights into Solutions", "Take on a Business Case", "Present Your Recommendations"],
  cta: { label: "Lihat detail GrowthCamp", to: "/learn/growthcamp" },
  note: "Jadwal dan ketentuan ditampilkan setelah terkonfirmasi.",
};

export const learningToPractice = {
  title: ["From Learning", "to Practice"] as TitleLines,
  description: "Kenali langkah pengembangan yang dapat kamu jelajahi.",
  steps: [
    { number: "01", title: "Bangun fondasi", description: "Pelajari konsep melalui GrowthCamp.", tone: "teal" },
    { number: "02", title: "Latih penerapan", description: "Gunakan studi kasus dan diskusi untuk melatih analisis.", tone: "rose" },
    { number: "03", title: "Jelajahi pengalaman proyek", description: "Pelajari GrowthX dan proses tinjauan kesiapan untuk berkontribusi.", tone: "teal" },
  ] satisfies Step[],
  note: "Partisipasi proyek mengikuti proses tinjauan GCC.",
  cta: { label: "Kenali GrowthX", to: "/apply/growthx" },
};

// TODO(review): Figma shows only the first answer in full; the other two answers are drafted from the page's own wording.
export const learnFaq = {
  title: "Good to Know",
  items: [
    { question: "Apakah harus punya pengalaman consulting?", answer: "GrowthCamp ditujukan untuk membangun fondasi. Periksa persyaratan pada halaman detail program." },
    { question: "Apakah setelah belajar langsung mendapat proyek?", answer: "Tidak otomatis. Partisipasi proyek mengikuti proses tinjauan kesiapan oleh GCC setelah tahap belajar." },
    { question: "Di mana saya melihat jadwal dan ketentuan?", answer: "Jadwal dan ketentuan ditampilkan pada halaman detail program setelah terkonfirmasi." },
  ] satisfies FaqItem[],
};

export const learnClosing = {
  title: ["Find Your", "Starting Point"] as TitleLines,
  description: "Pilih jalur sesuai kebutuhan dan kesiapanmu saat ini.",
  cta: { label: "Temukan Jalurmu", to: "/assessment" },
};

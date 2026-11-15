import type { FaqItem, Step } from "../components/content/blocks";
import { heroFirstMeet, heroPitchingDay } from "../assets/home";

// Learn page copy from the Figma frame "Learn — Mobile" (WORKING FILE → 2. PAGE LEARN).

export const learnHero = {
  eyebrow: "Learn with GCC",
  title: ["Build Your", "Consulting Foundation"],
  description: "Bangun cara berpikir terstruktur, pelajari problem solving, dan latih komunikasi melalui proses belajar bersama GCC.",
  cta: { label: "Lihat GrowthCamp", to: "/learn/growthcamp" },
  secondary: { label: "Belum yakin? Temukan jalurmu", to: "/assessment" },
  // Placeholder from the homepage set until the dedicated documentation photo is supplied.
  photo: { src: heroFirstMeet, alt: "Sesi belajar bersama GCC", caption: "Sesi belajar bersama GCC" },
};

export const competencies = {
  eyebrow: "Fondasi yang dikembangkan",
  title: "Skills to Start With",
  description: "Kenali kemampuan yang dilatih dalam proses belajar.",
  items: [
    { number: "01", name: "Critical Thinking", description: "Memahami konteks dan menyusun pertanyaan yang tepat.", icon: "book" as const, tone: "paper" as const },
    { number: "02", name: "Problem Solving", description: "Memecah masalah dan menyusun alternatif solusi.", icon: "target" as const, tone: "mint" as const },
    { number: "03", name: "Communication", description: "Menyampaikan analisis dan rekomendasi secara jelas.", icon: "chat" as const, tone: "mint" as const },
  ],
};

export const featuredGrowthCamp = {
  eyebrow: "Program pembelajaran",
  name: "GrowthCamp",
  tagline: ["Learn the Fundamentals.", "Practice with Purpose."],
  description: "Bootcamp untuk mahasiswa yang ingin membangun fondasi consulting dan problem solving sebelum mengeksplorasi pengalaman proyek.",
  photo: { src: heroPitchingDay, alt: "Workshop GrowthCamp", caption: "Workshop GrowthCamp" },
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
  title: ["From Learning", "to Practice"],
  description: "Kenali langkah pengembangan yang dapat kamu jelajahi.",
  steps: [
    { number: "01", title: "Bangun fondasi", description: "Pelajari konsep melalui GrowthCamp.", tone: "blue" },
    { number: "02", title: "Latih penerapan", description: "Gunakan studi kasus dan diskusi untuk melatih analisis.", tone: "teal" },
    { number: "03", title: "Jelajahi pengalaman proyek", description: "Pelajari GrowthX dan proses tinjauan kesiapan untuk berkontribusi.", tone: "rose" },
  ] satisfies Step[],
  note: "Partisipasi proyek mengikuti proses tinjauan GCC.",
  cta: { label: "Kenali GrowthX", to: "/apply/growthx" },
};

export const learnFaq = {
  eyebrow: "Sebelum memulai",
  title: "Good to Know",
  items: [
    { question: "Apakah harus punya pengalaman consulting?", answer: "GrowthCamp ditujukan untuk membangun fondasi. Periksa persyaratan pada halaman detail program." },
    { question: "Apakah setelah belajar langsung mendapat proyek?", answer: "Tidak otomatis. Partisipasi proyek mengikuti proses tinjauan kesiapan oleh GCC setelah tahap belajar." },
    { question: "Di mana saya melihat jadwal dan ketentuan?", answer: "Jadwal dan ketentuan ditampilkan pada halaman detail program setelah terkonfirmasi." },
  ] satisfies FaqItem[],
};

export const learnClosing = {
  title: ["Find Your", "Starting Point"],
  description: "Pilih jalur sesuai kebutuhan dan kesiapanmu saat ini.",
  cta: { label: "Temukan Jalurmu", to: "/assessment" },
};

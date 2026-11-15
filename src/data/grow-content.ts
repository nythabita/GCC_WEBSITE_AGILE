import type { FaqItem } from "../components/content/blocks";

// Copy from the Figma frame "Grow — Mobile" (1. DISCOVER).

export const growHero = {
  title: ["Your Next Step", "Starts Here"],
  description: "Terus kembangkan diri setelah belajar dan praktik. Kenali arah pengembanganmu dan jelajahi kesempatan berikutnya bersama GCC.",
  cta: { label: "Lihat kesempatan", to: "/grow#kesempatan" },
  photoCaption: "GrowthX Internal Training",
};

export const whatComesNext = {
  title: "What Comes Next?",
  description: "Informasi kesempatan akan ditampilkan setelah terkonfirmasi oleh GCC.",
  card: { title: ["Kesempatan baru", "akan diumumkan"], cta: { label: "Jelajahi program GCC", to: "/programs" } },
};

export const keepMoving = {
  title: "Keep Moving Forward",
  description: "Gunakan proses belajar dan praktik sebagai bekal untuk menentukan langkah berikutnya.",
  steps: [
    { number: "01", title: "Bangun fondasi", description: "Kenali konsep dan cara berpikir consulting melalui GrowthCamp.", tone: "blue" },
    { number: "02", title: "Terapkan keterampilan", description: "Jelajahi GrowthX dan proses tinjauan kesiapan untuk kontribusi proyek.", tone: "teal" },
    { number: "03", title: "Tentukan langkah berikutnya", description: "Refleksikan pengalamanmu, kenali hal yang perlu dikembangkan, dan periksa kesempatan yang tersedia.", tone: "red" },
  ] as const,
};

export const reflection = {
  title: ["Make Your", "Experience Count"],
  description: "Tiga pertanyaan sederhana untuk membantu refleksi setelah belajar atau terlibat dalam proyek.",
  items: [
    { label: "Refleksi 01", title: "Apa yang sudah dipelajari?", description: "Catat konsep, pendekatan, atau keterampilan yang berhasil kamu pahami.", icon: "book", tone: "white" },
    { label: "Refleksi 02", title: "Apa yang perlu ditingkatkan?", description: "Kenali tantangan yang masih kamu hadapi dan umpan balik yang relevan.", icon: "chat", tone: "rose" },
    { label: "Refleksi 03", title: "Apa langkah berikutnya?", description: "Tentukan fokus belajar atau pengalaman yang ingin kamu eksplorasi selanjutnya.", icon: "goal", tone: "white" },
  ] as const,
};

export const nextStep = {
  title: "Choose Your Next Step",
  description: "Kamu dapat kembali belajar atau mengenali jalur kontribusi proyek.",
  cards: [
    { title: "Perkuat fondasi", description: "Pelajari GrowthCamp untuk membangun dasar consulting dan problem solving.", cta: { label: "Jelajahi Learn", to: "/learn" }, tone: "sun" },
    { title: "Kenali penerapan", description: "Pelajari jalur GrowthX untuk mahasiswa dan GrowthConnect untuk pengajuan tantangan UMKM.", cta: { label: "Jelajahi Apply", to: "/apply" }, tone: "mint" },
  ] as const,
};

export const growFaq = {
  title: "Good to Know",
  items: [
    { question: "Kapan kesempatan baru diumumkan?", answer: "Informasi akan ditampilkan setelah detail kesempatan dan ketentuannya terkonfirmasi oleh GCC." },
    { question: "Apakah program menjamin proyek atau pekerjaan?", answer: "Tidak. Program GCC adalah ruang belajar dan praktik; kesempatan lanjutan mengikuti proses tinjauan GCC." },
    { question: "Bagaimana memilih langkah yang sesuai?", answer: "Mulai dari refleksi tiga pertanyaan di atas, lalu pilih Learn untuk memperkuat fondasi atau Apply untuk menjajaki proyek." },
  ] satisfies FaqItem[],
};

export const growClosing = {
  title: "Find Your Starting Point",
  cta: { label: "Temukan Jalurmu", to: "/assessment" },
};

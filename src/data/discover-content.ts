// Copy from the Figma frames "Tentang GCC — Mobile" and "Assessment — Mobile" (1. DISCOVER).

export const discoverHero = {
  badge: "Tentang GCC",
  title: ["Where Young", "Minds Grow"],
  description: "GCC menghubungkan pembelajaran, pengalaman praktis, dan kolaborasi agar mahasiswa berkembang menjadi problem solver.",
};

export const growthJourney = {
  title: "Your Growth Journey",
  description: "Tiga langkah untuk berkembang bersama GCC.",
  steps: [
    { number: "01", title: "Learn · Bangun fondasi", description: "Latih cara berpikir terstruktur melalui GrowthCamp.", tone: "white" },
    { number: "02", title: "Apply · Terapkan keterampilan", description: "Pelajari tantangan bisnis dan jelajahi kontribusi lewat GrowthX.", tone: "berry" },
    { number: "03", title: "Grow · Kembangkan diri", description: "Refleksikan pengalaman dan kenali arah pengembangan berikutnya.", tone: "green" },
  ] as const,
  actions: [
    { label: "Jelajahi program GCC", to: "/programs", variant: "berry" },
    { label: "Temukan jalurmu", to: "/assessment", variant: "berry-soft" },
  ] as const,
};

export const assessmentHero = {
  badge: "Find Your Path",
  title: ["Find Your", "Starting Point"],
  description: "Pilih pernyataan yang paling sesuai dengan tujuanmu saat ini.",
};

export const assessmentOptions = [
  { number: "01", question: ["Want to learn?"], link: { label: "Jelajahi GrowthCamp", to: "/learn/growthcamp" }, tone: "berry" },
  { number: "02", question: ["Want to participate in", "real Projects?"], link: { label: "Jelajahi GrowthX", to: "/apply/growthx" }, tone: "white" },
  { number: "03", question: ["Want to solve business", "challenges?"], link: { label: "Jelajahi GrowthConnect", to: "/apply/growthconnect" }, tone: "green" },
] as const;

export const assessmentAllPrograms = { label: "Lihat semua program GCC", to: "/programs" };

import {
  collabHiPud,
  collabHingeMeal,
  collabLearnitTab,
  collabTutorlogy,
  heroFirstMeet,
  heroInternalTraining,
  heroPitchingDay,
  logoGrowthCampMini,
  logoGrowthXMini,
  winnerGoogleCalendarFc,
  winnerKanarazukatsu,
  winnerValexa,
} from "../assets/home";
import { logoGrowthConnect } from "../assets/brand";

// Static homepage content from the Figma design. Sections outside the v1 backend
// contract (hero/about/journey) live here until the backend grows to cover them.

// Figma links these to the Explore Page and the program chooser.
export const heroActions = {
  primary: { label: "Explore Our Programs", href: "/programs" },
  secondary: { label: "Find Your Starting Point", href: "/pilih-program" },
};

export const heroPhotos = [
  { src: heroPitchingDay, alt: "Peserta Growthcamp Pitching Day berfoto bersama" },
  { src: heroFirstMeet, alt: "Peserta Growthcamp 2025 First Meet di dalam ruangan" },
  { src: heroInternalTraining, alt: "Tim GrowthX dalam Internal Training" },
];

export const heroCaptions = ["Growthcamp Pitching Day", "Growthcamp 2025 First Meet", "GrowthX Internal Training"];

export type Program = {
  slug: string;
  name: string;
  href: string;
  cta: string;
  // Badge text on the Explore Page variant of the card.
  exploreBadge: string;
  logo: { src: string; alt: string; width: number };
  benefits: string[];
};

export const programs: Program[] = [
  {
    slug: "growthcamp",
    name: "Growthcamp",
    href: "/learn/growthcamp",
    cta: "Explore GrowthCamp",
    exploreBadge: "Yang akan dipelajari",
    logo: { src: logoGrowthCampMini, alt: "Logo GrowthCamp", width: 74 },
    benefits: [
      "Memahami permasalahan bisnis dan mengidentifikasi akar penyebabnya.",
      "Menyusun analisis menggunakan framework consulting.",
      "Mengolah hasil analisis menjadi rekomendasi strategis yang tepat.",
      "Mengembangkan solusi melalui studi kasus dan sesi mentoring.",
      "Mempresentasikan rekomendasi dalam sesi pitching akhir.",
    ],
  },
  {
    slug: "growthx",
    name: "GrowthX",
    href: "/apply/growthx",
    cta: "Explore GrowthX",
    exploreBadge: "Pengalaman proyek",
    logo: { src: logoGrowthXMini, alt: "Logo GrowthX Mentoring", width: 87 },
    benefits: [
      "Kesempatan menerapkan keterampilan consulting pada persoalan bisnis nyata.",
      "Penilaian kesiapan sebagai dasar pertimbangan keterlibatan proyek.",
      "Pengalaman memahami kebutuhan dan konteks bisnis.",
      "Pengalaman berkolaborasi dalam analisis serta penyusunan rekomendasi.",
      "Latihan mengomunikasikan temuan dan mempertanggungjawabkan hasil analisis.",
    ],
  },
  {
    slug: "growthconnect",
    name: "GrowthConnect",
    href: "/apply/growthconnect",
    cta: "Explore GrowthConnect",
    exploreBadge: "Manfaat bagi UMKM",
    // Low-resolution placeholder (78×42); a sharper logo is still to be supplied.
    logo: { src: logoGrowthConnect, alt: "Logo GrowthConnect", width: 78 },
    benefits: [
      "Ruang untuk menyampaikan kebutuhan dan tantangan bisnis UMKM.",
      "Pembahasan untuk memperjelas persoalan yang perlu dianalisis.",
      "Kesepakatan ruang lingkup dan hasil kerja sebelum proyek dimulai.",
      "Rekomendasi yang sesuai dengan kebutuhan dan kondisi usaha.",
      "Prioritas perbaikan sebagai bahan pertimbangan pengambilan keputusan.",
    ],
  },
];

export const startingPoint = {
  title: "Find Your Starting Point in Consulting",
  description:
    "Want to learn the fundamentals of consulting, understand team development, or explore business challenges? Choose your area of interest to find the information most relevant to you.",
  cta: { label: "Explore Your Learning Needs", href: "/assessment" },
};

export const trackRecord = {
  title: "Track Record GCC",
  stats: [
    { value: "50+", label: "Community Members" },
    { value: "23", label: "Management Team" },
    { value: "8", label: "Z Marketing Champion Delegates" },
    { value: "3", label: "SxC Grand Summit Teams" },
  ],
};

export const winners = {
  title: "Meet Our Winners",
  items: [
    {
      name: "Valexa",
      photo: winnerValexa,
      alt: "Valexa memegang piagam penghargaan",
      caption: "Special Mention: Most Promising Storytelling Z Marketing Champion",
    },
    {
      name: "Tim Kanarazukatsu",
      photo: winnerKanarazukatsu,
      alt: "Tim Kanarazukatsu dengan penghargaan Best Solution Award",
      caption: "Best Solution Award & 3rd Runner Up SxC 15th Grand Summit BCC",
    },
    {
      name: "Tim Google Calendar FC",
      photo: winnerGoogleCalendarFc,
      alt: "Tim Google Calendar FC dengan piala juara pertama",
      caption: "1st Place Bizionary BCC",
    },
  ],
};

export type Mentor = { name: string; highlights: string[] };

export const mentors = {
  title: "Meet the Mentors Behind Our Learning",
  seeMore: { label: "Click here to see more", href: "/about" },
  items: [
    {
      name: "Arvian Andhika",
      highlights: ["Strategy Consultant at PwC Indonesia", "Winner of 5+ National Business Case Competitions", "Ex-Strategic Planning at Pelindo"],
    },
    {
      name: "Nadira Prameswari",
      highlights: ["Marketing Consultant at Grab Indonesia", "Ex-Corporate Strategy at Trimegah Sekuritas"],
    },
    {
      name: "Raka Mahendra",
      highlights: ["Ex-Management Consultant at Kearney", "Ex-Corporate Strategy at Astra International", "Winner of 7+ Case Competitions"],
    },
    {
      name: "Citra Adeline",
      highlights: ["Product Strategy at Shopee Indonesia", "5+ Years in Digital Product & Growth", "Mentor for 10+ Student Case Competitions"],
    },
  ] satisfies Mentor[],
};

export const collaborations = {
  title: "Learning Through Case Collaborations",
  logos: [
    { src: collabLearnitTab, alt: "Learnit Tab", width: 71 },
    { src: collabTutorlogy, alt: "Tutorlogy", width: 184 },
    { src: collabHingeMeal, alt: "Hinge Meal", width: 113 },
    { src: collabHiPud, alt: "Hi.Pud", width: 194 },
  ],
};

export const community = {
  eyebrow: "Hear From Our",
  title: "Community",
  testimonials: [
    { emoji: "😎", text: "Dari mentoring ini, aku dapet insight yang nggak pernah aku temuin di kelas.", tilt: -1.6 },
    { emoji: "🧑🏻‍🦱", text: "Mentor gue ngebantu banget pas lagi bingung ambil arah. Nggak cuma ngasih saran, tapi juga bikin gue mikir.", tilt: 4.3 },
    { emoji: "👩‍💻", text: "Tiap sesi mentoring tuh berasa kayak ngobrol sama kakak sendiri. Nyaman, tapi tetap ngasih insight.", tilt: -1.65 },
  ],
};

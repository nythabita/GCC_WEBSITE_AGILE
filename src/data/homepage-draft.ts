import type { HomepageContent } from "../../shared/homepage";

// Local draft for layout work, deliberately separate from the future API loader.
// Marked approved (content reviewed). This is still not a fallback for a failed Supabase request.
export const homepageDraft: HomepageContent = {
  schemaVersion: 1,
  contentStatus: "approved",
  notice: "Preview struktur homepage — konten draft, belum final. Data Supabase belum terhubung.",
  hero: {
    title: "Think Structurally. Solve Strategically. Grow Together.",
    description: "Kembangkan pola pikir konsultant Anda dengan GCC. Belajar memahami masalah bisnis, analisis struktur, dan menyampaikan rekomendasi melalui pembelajaran, pendampingan, dan kolaborasi.",
    ctaLabel: "Explore GCC",
    ctaHref: "#journey",
  },
  about: {
    title: "This is Our Consulting Journey",
    description: "Growth Consulting Club adalah komunitas pengembangan profesional bagi mahasiswa yang ingin mengenal dan mendalami industri konsultasi.",
  },
  journey: {
    title: "Explore How We Learn and Grow",
    description: "Pilih tahap perjalananmu. Halaman Learn, Apply, dan Grow masih berupa preview.",
    items: [
      { slug: "learn", label: "Learn", description: "Kenali dasar consulting dan cara memahami permasalahan bisnis.", href: "/learn" },
      { slug: "apply", label: "Apply", description: "Eksplorasi penerapan analisis dan rekomendasi pada tantangan bisnis.", href: "/apply" },
      { slug: "grow", label: "Grow", description: "Temukan kesempatan untuk belajar, berkolaborasi, dan berkembang bersama.", href: "/grow" },
    ],
  },
};

import { ArrowRight, BookOpen, ChevronLeft, MessageSquare, Target } from "lucide-react";
import { Link } from "react-router";

// "GCC_Pilih_Program_Mobile" (WORKING FILE → 0. LOGIN TO HOMEPAGE). This frame uses its own
// palette (navy on white, Arial) rather than the forest/paper system of the other pages.
const navy = "text-navy";
const muted = "text-slate";

const choices = [
  {
    audience: "Untuk mahasiswa",
    audienceColor: "text-crimson",
    icon: <BookOpen size={24} aria-hidden="true" className="text-crimson" />,
    surface: "bg-cream-soft",
    statement: "Saya ingin belajar",
    program: "GrowthCamp",
    tagline: "Build Your Consulting Foundation",
    description: "Bangun fondasi consulting dan problem solving melalui proses belajar dan latihan kasus.",
    explored: "Minat, motivasi, tujuan belajar, dan komitmen waktu.",
    cta: { label: "Lihat GrowthCamp", to: "/learn/growthcamp" },
    note: "Mulai dari fondasi dan kenali materi program.",
  },
  {
    audience: "Untuk mentee GCC",
    audienceColor: "text-azure",
    icon: <Target size={24} aria-hidden="true" className="text-azure" />,
    surface: "bg-sky-soft",
    statement: "Saya siap berkontribusi dalam proyek",
    program: "GrowthX",
    tagline: "Put Your Skills into Practice",
    description: "Sampaikan minat dan kesiapanmu untuk menerapkan keterampilan consulting dalam kontribusi proyek.",
    explored: "Keahlian, pengalaman, pendekatan kasus, dan ketersediaan waktu.",
    cta: { label: "Lihat GrowthX", to: "/apply/growthx" },
    note: "Kesiapan ditinjau sebelum pembentukan tim oleh GCC.",
  },
  {
    audience: "Untuk pemilik UMKM",
    audienceColor: "text-leaf",
    icon: <MessageSquare size={24} aria-hidden="true" className="text-leaf" />,
    surface: "bg-leaf-soft",
    statement: "Saya memiliki tantangan bisnis",
    program: "GrowthConnect",
    tagline: "Bring Your Business Challenge",
    description: "Ceritakan konteks usaha dan tantangan bisnis agar GCC dapat memahami kebutuhan dan meninjau pengajuan Anda.",
    explored: "Profil usaha, masalah utama, upaya sebelumnya, dan hasil yang diharapkan.",
    cta: { label: "Lihat GrowthConnect", to: "/apply/growthconnect" },
    note: "Pengajuan ditinjau sesuai kebutuhan dan kapasitas GCC.",
  },
];

const guidance = [
  { surface: "bg-cream-soft", title: "Kenali proses belajar", description: "Jelajahi fondasi keterampilan dan gambaran GrowthCamp.", cta: { label: "Jelajahi Learn", to: "/learn" } },
  { surface: "bg-leaf-soft", title: "Kenali penerapan", description: "Pahami jalur mahasiswa dan pengajuan tantangan bisnis UMKM.", cta: { label: "Jelajahi Apply", to: "/apply" } },
];

const primaryButton = "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-crimson text-[15px] font-bold text-white transition-colors duration-150 hover:bg-crimson-hover";
const outlineButton = "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-azure bg-white text-[15px] font-bold text-navy transition-colors duration-150 hover:bg-sky-soft";

export default function PilihProgramPage() {
  return (
    <main className="bg-white font-plain">
      <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-4 md:px-8 md:pb-24 md:pt-8">
        <Link to="/" className="inline-flex min-h-11 items-center gap-1 text-base font-bold text-azure">
          <ChevronLeft size={18} aria-hidden="true" />
          Kembali ke Discover
        </Link>

        <section aria-labelledby="pilih-title" className="mt-3 md:max-w-2xl">
          <p className={`text-[11px] font-bold uppercase tracking-wide ${navy}`}>Temukan jalurmu</p>
          <h1 id="pilih-title" className={`mt-4 text-[32px] font-bold leading-[1.15] md:text-5xl ${navy}`}>Find Your<br />Starting Point</h1>
          <p className={`mt-5 text-base leading-snug md:text-lg ${muted}`}>Pilih jalur yang paling sesuai dengan kebutuhan dan tujuanmu saat ini.</p>
          <p className={`mt-4 text-sm leading-snug ${muted}`}>Pelajari detail program sebelum melanjutkan ke formulir.</p>
        </section>

        <ol className="mt-8 flex flex-col gap-6 md:grid md:grid-cols-3 md:items-start">
          {choices.map((choice) => (
            <li key={choice.program} className={`rounded-2xl p-6 ${choice.surface}`}>
              <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-xl bg-white">{choice.icon}</span>
                <p className={`text-[11px] font-bold uppercase tracking-wide ${choice.audienceColor}`}>{choice.audience}</p>
              </div>
              <h2 className={`mt-7 text-[23px] font-bold leading-[1.2] ${navy}`}>{choice.statement}</h2>
              <p className="mt-5 text-[25px] font-bold leading-none text-crimson">{choice.program}</p>
              <p className={`mt-3 text-base font-bold ${navy}`}>{choice.tagline}</p>
              <p className={`mt-4 text-base leading-snug ${muted}`}>{choice.description}</p>
              <hr className="my-6 border-rule" />
              <h3 className={`text-sm font-bold ${navy}`}>Yang akan digali</h3>
              <p className={`mt-2 text-[15px] leading-snug ${muted}`}>{choice.explored}</p>
              <Link to={choice.cta.to} className={`${primaryButton} mt-6`}>
                {choice.cta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <p className={`mt-4 text-[13px] leading-snug ${muted}`}>{choice.note}</p>
            </li>
          ))}
        </ol>

        <section aria-labelledby="guidance-title" className="mt-12 md:mt-20">
          <p className={`text-[11px] font-bold uppercase tracking-wide ${navy}`}>Belum yakin dengan pilihanmu?</p>
          <h2 id="guidance-title" className={`mt-4 text-[32px] font-bold leading-[1.15] md:text-4xl ${navy}`}>Explore Before<br />You Decide</h2>
          <p className={`mt-5 max-w-xl text-base leading-snug md:text-lg ${muted}`}>Kenali perbedaan proses belajar dan penerapan keterampilan sebelum memilih program.</p>
          <div className="mt-6 flex flex-col gap-4 md:grid md:grid-cols-2">
            {guidance.map((item) => (
              <div key={item.title} className={`rounded-2xl p-6 ${item.surface}`}>
                <h3 className={`text-xl font-bold ${navy}`}>{item.title}</h3>
                <p className={`mt-3 text-base leading-snug ${muted}`}>{item.description}</p>
                <Link to={item.cta.to} className={`${outlineButton} mt-6`}>
                  {item.cta.label}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

import { heroPitchingDay } from "../assets/home";
import { ActionRow, BackLink, DisplayTitle, PageContainer, PhotoFrame, StepBadge, type Step } from "../components/content/blocks";

// "Tentang GCC — Mobile" (WORKING FILE → 1. DISCOVER).
const journey: (Step & { tone: "paper" | "sun" })[] = [
  { number: "01", title: "Learn · Bangun fondasi", description: "Latih cara berpikir terstruktur melalui GrowthCamp.", tone: "paper" },
  { number: "02", title: "Apply · Terapkan keterampilan", description: "Pelajari tantangan bisnis dan jelajahi kontribusi lewat GrowthX.", tone: "sun" },
  { number: "03", title: "Grow · Kembangkan diri", description: "Refleksikan pengalaman dan kenali arah pengembangan berikutnya.", tone: "paper" },
];

export default function AboutPage() {
  return (
    <main className="bg-paper text-forest">
      <PageContainer className="pb-10 pt-2 md:pb-24 md:pt-6">
        <BackLink to="/">Kembali ke Beranda</BackLink>

        <div className="md:grid md:grid-cols-2 md:gap-8">
          <section aria-labelledby="about-title" className="relative mt-3 overflow-hidden rounded-2xl bg-forest p-5 text-paper md:p-8">
            <span aria-hidden="true" className="absolute -right-10 -top-12 size-[150px] rounded-full bg-white/10" />
            <span className="inline-block rounded-full bg-mint px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-forest">Tentang GCC</span>
            <DisplayTitle as="h1" className="mt-6 text-paper md:text-5xl">
              <span id="about-title" className="block">Where Young<br />Minds Grow</span>
            </DisplayTitle>
            <p className="mt-4 text-base leading-snug md:text-lg">GCC menghubungkan pembelajaran, pengalaman praktis, dan kolaborasi agar mahasiswa berkembang menjadi problem solver.</p>
          </section>
          {/* Placeholder photo until the documentation set is supplied. */}
          <PhotoFrame src={heroPitchingDay} alt="Dokumentasi kegiatan GCC" caption="Dokumentasi kegiatan Gcc" className="mt-6 md:mt-3" />
        </div>

        <section aria-labelledby="journey-title" className="mt-12 md:mt-20">
          <DisplayTitle><span id="journey-title">Your Growth Journey</span></DisplayTitle>
          <p className="mt-4 text-base leading-snug md:text-lg">Tiga langkah untuk berkembang bersama GCC.</p>
          <ol className="mt-6 flex flex-col gap-4 md:grid md:grid-cols-3">
            {journey.map((step, index) => (
              <li key={step.title} className={`flex items-start gap-4 rounded-2xl p-4 ${index === 1 ? "border border-line/60 bg-paper-soft" : "bg-mint"}`}>
                <StepBadge number={step.number} tone={index === 1 ? "sun" : "paper"} />
                <div>
                  <h3 className="font-sub text-[17px] font-semibold leading-snug">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-snug text-forest/80">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 flex flex-col gap-3 md:max-w-xl">
          <ActionRow to="/programs">Jelajahi program GCC</ActionRow>
          <ActionRow to="/assessment" tone="mint">Temukan jalurmu</ActionRow>
        </div>
      </PageContainer>
    </main>
  );
}

import { ArrowRight, Puzzle } from "lucide-react";
import { Link } from "react-router";
import { ActionRow, BackLink, DisplayTitle, PageContainer, StepBadge } from "../components/content/blocks";

// "Assessment — Mobile" (WORKING FILE → 1. DISCOVER): pick the statement that fits, then jump to a program.
const options = [
  { number: "01", statement: "Saya ingin belajar", link: { label: "Jelajahi GrowthCamp", to: "/learn/growthcamp" }, tone: "paper" as const },
  { number: "02", statement: "Saya siap berkontribusi dalam proyek", link: { label: "Jelajahi GrowthX", to: "/apply/growthx" }, tone: "sun" as const },
  { number: "03", statement: "Saya memiliki tantangan bisnis", link: { label: "Jelajahi GrowthConnect", to: "/apply/growthconnect" }, tone: "paper" as const },
];

export default function AssessmentPage() {
  return (
    <main className="bg-paper text-forest">
      <PageContainer className="pb-10 pt-2 md:pb-24 md:pt-6">
        <BackLink to="/">Kembali ke Beranda</BackLink>

        <section aria-labelledby="assessment-title" className="relative mt-3 overflow-hidden rounded-2xl bg-mint p-5 md:p-8">
          <span aria-hidden="true" className="absolute -right-8 -top-10 size-[120px] rounded-full bg-white/60" />
          <Puzzle aria-hidden="true" size={56} className="absolute -right-1 top-1 rotate-12 text-brand-red" fill="currentColor" />
          <span className="inline-block rounded-full bg-paper-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-forest">Find Your Path</span>
          <DisplayTitle as="h1" className="mt-6 md:text-5xl">
            <span id="assessment-title" className="block">Find Your<br />Starting Point</span>
          </DisplayTitle>
          <p className="mt-4 text-base leading-snug text-forest/80 md:text-lg">Pilih pernyataan yang paling sesuai dengan tujuanmu saat ini.</p>
        </section>

        <ol className="mt-6 flex flex-col gap-4 md:grid md:grid-cols-3">
          {options.map((option) => (
            <li key={option.number} className="flex flex-col rounded-2xl border border-line/60 bg-white p-4 shadow-[0_1px_3px_rgba(25,62,52,0.06)]">
              <div className="flex items-start gap-4">
                <StepBadge number={option.number} tone={option.tone} />
                <h2 className="pt-2 font-sub text-[17px] font-semibold leading-snug">{option.statement}</h2>
              </div>
              <Link to={option.link.to} className="mt-auto flex min-h-11 items-center justify-between gap-4 pl-14 text-sm font-semibold text-teal-deep">
                {option.link.label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>

        <div className="mt-8 md:max-w-xl">
          <ActionRow to="/programs" tone="mint">Lihat semua program GCC</ActionRow>
        </div>
      </PageContainer>
    </main>
  );
}

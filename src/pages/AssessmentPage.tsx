import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { puzzleRed } from "../assets/discover";
import { heroPitchingDay } from "../assets/home";
import { assessmentAllPrograms, assessmentHero, assessmentOptions } from "../data/discover-content";

const optionTones = {
  berry: { card: "bg-berry border-berry", badge: "bg-white text-black", title: "text-white", link: "text-white" },
  white: { card: "bg-white border-black/10", badge: "bg-black text-white", title: "text-forest", link: "text-black" },
  green: { card: "bg-brand-green border-brand-green", badge: "bg-white text-black", title: "text-white", link: "text-white" },
};

// "Assessment — Mobile" (1. DISCOVER): pick the statement that fits, then jump to a program.
export default function AssessmentPage() {
  return (
    <main className="bg-paper bg-[linear-gradient(to_bottom,var(--color-paper)_55%,#a7e3d0)]">
      <div className="mx-auto w-full max-w-7xl px-6 pb-12 pt-[70px] md:px-8 md:pb-24 md:pt-16">
        <section aria-labelledby="assessment-title" className="relative overflow-hidden rounded-2xl bg-white/60 p-5 md:p-10">
          <img src={heroPitchingDay} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.16]" />
          <span aria-hidden="true" className="absolute -right-8 -top-10 size-[120px] rounded-full bg-white/80" />
          <img src={puzzleRed} alt="" aria-hidden="true" className="absolute right-1 top-1 w-[44px]" />
          <div className="relative">
            <span className="inline-block rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-forest">{assessmentHero.badge}</span>
            <h1 id="assessment-title" className="mt-5 font-display text-[42px] font-bold italic leading-[1.1] text-black md:text-6xl">
              {assessmentHero.title.map((line) => <span key={line} className="block">{line}</span>)}
            </h1>
            <p className="mt-4 max-w-xs text-[15px] font-semibold leading-snug text-black md:max-w-md md:text-lg">{assessmentHero.description}</p>
          </div>
        </section>

        <ol className="mt-6 flex flex-col gap-4 md:grid md:grid-cols-3 md:items-stretch">
          {assessmentOptions.map((option) => {
            const tone = optionTones[option.tone];
            return (
              <li key={option.number} className={`flex flex-col rounded-2xl border p-3 ${tone.card}`}>
                <div className="flex items-start gap-4">
                  <span className={`flex h-[27px] w-11 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${tone.badge}`}>{option.number}</span>
                  <h2 className={`font-display text-[26px] font-bold italic leading-[0.95] ${tone.title}`}>
                    {option.question.map((line) => <span key={line} className="block">{line}</span>)}
                  </h2>
                </div>
                <Link to={option.link.to} className={`mt-auto flex min-h-11 items-center justify-between gap-4 pl-[60px] pt-3 text-base font-bold ${tone.link}`}>
                  {option.link.label}
                  <ArrowRight size={18} aria-hidden="true" className="mr-1" />
                </Link>
              </li>
            );
          })}
        </ol>

        <Link to={assessmentAllPrograms.to} className="mt-6 flex min-h-[50px] items-center justify-between rounded-xl bg-white px-4 text-[15px] font-bold text-forest md:max-w-xl">
          {assessmentAllPrograms.label}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}

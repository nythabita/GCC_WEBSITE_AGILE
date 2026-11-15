import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { puzzleWhite } from "../assets/discover";
import { divider, heroFirstMeet } from "../assets/home";
import { buttonStyles } from "../components/UI/button-styles";
import { discoverHero, growthJourney } from "../data/discover-content";

const stepTones = {
  white: { card: "bg-white", badge: "bg-black text-white", title: "text-forest" },
  berry: { card: "bg-berry", badge: "bg-white text-black", title: "text-white" },
  green: { card: "bg-brand-green", badge: "bg-white text-black", title: "text-white" },
};

// "Tentang GCC — Mobile" (1. DISCOVER). The navbar labels this page "Discover".
export default function DiscoverPage() {
  return (
    <main className="bg-paper bg-[linear-gradient(to_bottom,var(--color-brand-green),var(--color-paper)_900px)] bg-no-repeat">
      <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-[70px] md:px-8 md:pb-24 md:pt-16">
        <section aria-labelledby="discover-title" className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/10 p-5 text-white md:grid md:grid-cols-2 md:gap-10 md:p-10">
          <img src={heroFirstMeet} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-[0.14]" />
          <span aria-hidden="true" className="absolute -right-10 -top-12 size-[150px] rounded-full bg-forest/25" />
          <img src={puzzleWhite} alt="" aria-hidden="true" className="absolute right-3 top-4 w-[54px]" />
          <div className="relative">
            <span className="inline-block rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-forest">{discoverHero.badge}</span>
            <h1 id="discover-title" className="mt-5 font-display text-[43px] font-bold italic leading-[1.08] md:text-6xl">
              {discoverHero.title.map((line) => <span key={line} className="block">{line}</span>)}
            </h1>
            <p className="mt-4 text-justify text-sm font-semibold leading-snug md:text-lg">{discoverHero.description}</p>
          </div>
        </section>

        <section aria-labelledby="journey-title" className="mt-9 md:mt-20">
          <img src={divider} alt="" aria-hidden="true" className="mx-auto block h-[3px] w-full max-w-[316px] md:max-w-xl" />
          <h2 id="journey-title" className="mt-8 text-center font-brand text-[34px] leading-none text-black md:text-5xl">{growthJourney.title}</h2>
          <p className="mt-3 text-center text-sm font-bold text-black md:text-lg">{growthJourney.description}</p>
          <ol className="mt-8 flex flex-col gap-5 md:mx-auto md:max-w-3xl">
            {growthJourney.steps.map((step) => {
              const tone = stepTones[step.tone];
              return (
                <li key={step.title} className={`relative rounded-2xl border border-black/10 p-3 ${tone.card}`}>
                  <span className={`absolute left-3 top-3 flex h-[27px] w-11 items-center justify-center rounded-full text-[11px] font-bold ${tone.badge}`}>{step.number}</span>
                  <div className="pl-[54px]">
                    <h3 className={`font-display text-[22px] font-bold italic leading-tight ${tone.title}`}>{step.title}</h3>
                    <p className="mt-2 text-[13px] font-bold leading-snug text-black">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="mt-10 flex flex-col gap-4 md:mx-auto md:max-w-3xl">
            {growthJourney.actions.map((action) => (
              <Link key={action.label} to={action.to} className={buttonStyles({ variant: action.variant, size: "lg", fullWidth: true, className: "justify-between text-[15px]" })}>
                {action.label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

import { ArrowRight, BookOpen, Goal, MessageSquareText } from "lucide-react";
import { Link } from "react-router";
import { applyAwardPhoto, applyCampPhoto, iconStore } from "../assets/discover";
import { logoGrowthConnect } from "../assets/brand";
import { logoGrowthXMini } from "../assets/home";
import { FaqList, StepBadge } from "../components/content/blocks";
import { buttonStyles } from "../components/UI/button-styles";
import { applyClosing, applyFaq, applyHero, businessCase, choosePath, collaborate, contribute, expectations, pathCards } from "../data/apply-content";

const contributeIcons = {
  book: <BookOpen size={22} aria-hidden="true" />,
  goal: <Goal size={22} aria-hidden="true" />,
  chat: <MessageSquareText size={22} aria-hidden="true" />,
};

const container = "mx-auto w-full max-w-7xl px-6 md:px-8";

function Polaroid({ src, alt, caption, tilt }: { src: string; alt: string; caption: string; tilt: number }) {
  return (
    <figure className="mx-auto max-w-[381px]">
      <div className="bg-white p-2 pb-6 shadow-lg" style={{ transform: `rotate(${tilt}deg)` }}>
        <img src={src} alt={alt} className="block aspect-[16/9] w-full object-cover" />
      </div>
      <figcaption className="mt-3 text-center font-display text-[22px] font-bold text-black">{caption}</figcaption>
    </figure>
  );
}

// "GCC_Apply_Mobile" (1. DISCOVER). The three-card Explore Page lives at /programs.
export default function ApplyPage() {
  return (
    <main>
      <div className="bg-[linear-gradient(to_bottom,#fbfefd,#cff3ea_40%,#96e5d1)] pb-14 pt-[56px] md:pb-24">
        <div className={container}>
          <section aria-labelledby="apply-title" className="md:grid md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <h1 id="apply-title" className="font-display text-[43px] font-bold italic leading-[1.05] text-forest md:text-6xl">
                {applyHero.title.map((line) => <span key={line} className="block">{line}</span>)}
              </h1>
              <p className="mt-5 text-base font-bold leading-snug text-forest md:text-lg">{applyHero.description}</p>
              <Link to={applyHero.cta.to} className={buttonStyles({ variant: "berry", size: "lg", fullWidth: true, className: "mt-7 text-[15px] md:w-auto" })}>
                {applyHero.cta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-12 md:mt-0">
              <Polaroid src={applyCampPhoto} alt="Peserta GrowthCamp 2025 berfoto bersama" caption={applyHero.photoCaption} tilt={-2} />
            </div>
          </section>

          <section id="jalur" aria-labelledby="path-title" className="mt-16 scroll-mt-24 md:mt-24">
            <h2 id="path-title" className="font-display text-[38px] font-bold italic leading-tight text-forest">{choosePath.title}</h2>
            <p className="mt-3 text-base text-forest/80 md:text-lg">{choosePath.description}</p>
            <div className="mt-8 flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start">
              {pathCards.map((card) => {
                const dark = card.slug === "growthx";
                return (
                  <article key={card.slug} aria-labelledby={`path-${card.slug}`} className={`rounded-3xl p-5 ${dark ? "bg-brand-green text-white" : "bg-white text-black"}`}>
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${dark ? "text-white" : "text-teal-deep"}`}>{card.audience}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
                      <h3 id={`path-${card.slug}`} className="font-brand text-[29px] leading-none">{card.name}</h3>
                      {dark ? (
                        <img src={logoGrowthXMini} alt="Logo GrowthX Mentoring" className="w-[110px] shrink-0" />
                      ) : (
                        <img src={logoGrowthConnect} alt="Logo GrowthConnect" className="w-[96px] shrink-0" />
                      )}
                    </div>
                    <p className="mt-5 font-display text-[26px] font-bold italic leading-tight">
                      {card.tagline.map((line) => <span key={line} className="block">{line}</span>)}
                    </p>
                    <p className="mt-5 text-base leading-snug">{card.description}</p>
                    <dl className="mt-6">
                      {card.details.map((detail) => (
                        <div key={detail.title} className={`border-t py-4 ${dark ? "border-white/30" : "border-black/15"}`}>
                          <dt className="font-display text-[22px] font-bold">{detail.title}</dt>
                          <dd className="mt-2 text-[15px] leading-snug">{detail.text}</dd>
                        </div>
                      ))}
                    </dl>
                    <Link to={card.cta.to} className={buttonStyles({ variant: dark ? "white" : "berry", size: "lg", fullWidth: true, className: "mt-3 text-[15px]" })}>
                      {card.cta.label}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <section aria-labelledby="collab-title" className="bg-white py-12 md:py-20">
        <div className={container}>
          <h2 id="collab-title" className="font-display text-[38px] font-bold italic leading-tight text-black md:text-5xl">{collaborate.title}</h2>
          <p className="mt-4 text-base leading-snug text-black md:text-lg">{collaborate.description}</p>
          <ol className="relative mt-8 flex max-w-xl flex-col gap-8">
            <span aria-hidden="true" className="absolute bottom-6 left-5 top-6 w-0.5 bg-sage" />
            {collaborate.steps.map((step) => (
              <li key={step.title} className="relative flex items-start gap-4">
                <StepBadge number={step.number} tone={step.tone} />
                <div className="pt-0.5">
                  <h3 className="font-brand text-base leading-tight text-black">{step.title}</h3>
                  <p className="mt-3 text-[15px] leading-snug text-black">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <Polaroid src={applyAwardPhoto} alt="Tim GrowthCamp 2025 menerima penghargaan" caption={collaborate.photoCaption} tilt={1.5} />
          </div>
        </div>
      </section>

      <div className="bg-[linear-gradient(to_bottom,#62d8ba,#40d0ac)] py-12 md:py-20">
        <section aria-labelledby="case-title" className={container}>
          <h2 id="case-title" className="font-display text-[38px] font-bold italic leading-tight text-white md:text-5xl">{businessCase.title}</h2>
          <p className="mt-4 text-base font-bold leading-snug text-white md:text-lg">{businessCase.description}</p>
          <div className="mt-8 rounded-3xl bg-white p-5 md:max-w-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block rounded-md bg-sun px-2.5 py-1 text-[11px] font-bold uppercase text-black">{businessCase.badge}</span>
                <h3 className="mt-4 font-display text-[26px] font-bold italic text-forest">{businessCase.name}</h3>
              </div>
              <img src={iconStore} alt="" aria-hidden="true" className="w-[69px] shrink-0" />
            </div>
            <p className="mt-4 text-[15px] leading-snug text-black">{businessCase.intro}</p>
            <dl className="mt-6 flex flex-col gap-5">
              {businessCase.details.map((detail) => (
                <div key={detail.title}>
                  <dt className="font-display text-[22px] font-bold text-black">{detail.title}</dt>
                  <dd className="mt-1 text-[15px] leading-snug text-black">{detail.text}</dd>
                </div>
              ))}
            </dl>
            <Link to={businessCase.cta.to} className={buttonStyles({ variant: "outline", size: "lg", fullWidth: true, className: "mt-7 text-[15px]" })}>
              {businessCase.cta.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

      <section aria-labelledby="contribute-title" className="bg-berry py-12 md:py-20">
        <div className={container}>
          <h2 id="contribute-title" className="font-display text-[38px] font-bold italic leading-tight text-white md:text-5xl">{contribute.title}</h2>
          <p className="mt-4 text-base font-bold leading-snug text-white md:text-lg">{contribute.description}</p>
          <ul className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-3">
            {contribute.items.map((item) => (
              <li key={item.title} className="rounded-2xl bg-white p-4 text-black">
                <div className="flex items-center gap-4">
                  {contributeIcons[item.icon]}
                  <h3 className="font-display text-[22px] font-bold">{item.title}</h3>
                </div>
                <p className="mt-4 text-base leading-snug">{item.text}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-snug text-white">{contribute.note}</p>
          <Link to={contribute.cta.to} className={buttonStyles({ variant: "white", size: "lg", fullWidth: true, className: "mt-4 border-teal-deep text-[15px] md:w-auto" })}>
            {contribute.cta.label}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <div className="bg-[linear-gradient(to_bottom,#15c599,#23c89f_20%,#a7e9d8_62%,#f3fcfa)]">
        <section aria-labelledby="expect-title" className="py-12 md:py-20">
          <div className={container}>
            <h2 id="expect-title" className="font-display text-[38px] font-bold italic leading-tight text-white md:text-5xl">{expectations.title}</h2>
            <p className="mt-4 text-base leading-snug text-white md:text-lg">{expectations.description}</p>
            <ul className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-3">
              {expectations.items.map((item) => (
                <li key={item.title} className="rounded-2xl bg-white p-5">
                  <h3 className="font-display text-[26px] font-bold leading-tight text-forest">{item.title}</h3>
                  <p className="mt-3 text-base leading-snug text-forest/80">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="apply-faq-title" className="pb-12 md:pb-20">
          <div className={container}>
            <h2 id="apply-faq-title" className="font-display text-[40px] font-bold italic leading-none text-white">{applyFaq.title}</h2>
            <div className="mt-6 md:max-w-2xl"><FaqList label="Pertanyaan umum Apply" items={applyFaq.items} tone="glass" /></div>
          </div>
        </section>

        <section aria-labelledby="apply-closing-title" className="px-6 pb-14 md:px-8 md:pb-24">
          <div className="mx-auto max-w-7xl rounded-3xl bg-berry p-5 md:max-w-2xl md:p-10">
            <h2 id="apply-closing-title" className="font-display text-[35px] font-bold italic leading-tight text-white">
              {applyClosing.title.map((line) => <span key={line} className="block">{line}</span>)}
            </h2>
            <p className="mt-4 text-base leading-snug text-white">{applyClosing.description}</p>
            <Link to={applyClosing.cta.to} className={buttonStyles({ variant: "white", size: "lg", fullWidth: true, className: "mt-6 text-[15px]" })}>
              {applyClosing.cta.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

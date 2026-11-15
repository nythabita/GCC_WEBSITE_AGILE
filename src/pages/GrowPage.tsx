import { ArrowRight, BookOpen, Goal, Info, MessageSquareText } from "lucide-react";
import { Link } from "react-router";
import { growEnvelope } from "../assets/discover";
import { FaqList, StepBadge } from "../components/content/blocks";
import { buttonStyles } from "../components/UI/button-styles";
import { growClosing, growFaq, growHero, keepMoving, nextStep, reflection, whatComesNext } from "../data/grow-content";

const icons = {
  book: <BookOpen size={22} aria-hidden="true" className="text-brand-blue" />,
  chat: <MessageSquareText size={22} aria-hidden="true" className="text-white" />,
  goal: <Goal size={22} aria-hidden="true" className="text-black" />,
};

const container = "mx-auto w-full max-w-7xl px-6 md:px-8";

// "Grow — Mobile" (1. DISCOVER).
export default function GrowPage() {
  return (
    <main>
      <div className="bg-[linear-gradient(to_bottom,#fbfefd,#aaeada_75%,#fff)] pb-20 pt-[68px]">
        <div className={container}>
          <section aria-labelledby="grow-title" className="md:grid md:grid-cols-2 md:items-center md:gap-12">
            <div>
              <h1 id="grow-title" className="font-display text-[35px] font-bold italic leading-[1.05] text-black md:text-6xl">
                {growHero.title.map((line) => <span key={line} className="block">{line}</span>)}
              </h1>
              <p className="mt-5 text-base leading-snug text-black md:text-lg">{growHero.description}</p>
              <Link to={growHero.cta.to} className={buttonStyles({ variant: "berry", size: "lg", fullWidth: true, className: "mt-7 text-[15px] md:w-auto" })}>
                {growHero.cta.label}
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <figure className="mx-auto mt-9 max-w-[218px] md:mt-0">
              <img src={growEnvelope} alt="Foto tim GrowthX dalam amplop" className="block h-auto w-full" />
              <figcaption className="-mt-2 -rotate-3 text-center font-display text-[22px] font-bold text-black">{growHero.photoCaption}</figcaption>
            </figure>
          </section>

          <section id="kesempatan" aria-labelledby="next-title" className="mt-16 scroll-mt-24 md:mt-24 md:max-w-xl">
            <h2 id="next-title" className="font-display text-[40px] font-bold italic leading-none text-black">{whatComesNext.title}</h2>
            <p className="mt-4 text-base font-bold leading-snug text-black">{whatComesNext.description}</p>
            <div className="mt-8 rounded-2xl bg-brand-green p-5 text-white">
              <span className="flex size-11 items-center justify-center rounded-lg bg-white"><Info size={22} aria-hidden="true" className="text-brand-blue" /></span>
              <p className="mt-9 font-brand text-2xl leading-tight">
                {whatComesNext.card.title.map((line) => <span key={line} className="block">{line}</span>)}
              </p>
              <Link to={whatComesNext.card.cta.to} className="mt-10 flex min-h-11 items-center justify-center gap-2 rounded-xl border border-brand-blue bg-white px-4 font-brand text-base text-forest">
                {whatComesNext.card.cta.label}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <section aria-labelledby="moving-title" className="bg-white py-12 md:py-20">
        <div className={container}>
          <h2 id="moving-title" className="font-display text-[31px] font-bold italic leading-tight text-black md:text-5xl">{keepMoving.title}</h2>
          <p className="mt-4 text-base leading-snug text-black md:text-lg">{keepMoving.description}</p>
          <ol className="relative mt-8 flex max-w-xl flex-col gap-8">
            <span aria-hidden="true" className="absolute bottom-6 left-5 top-6 w-0.5 bg-black" />
            {keepMoving.steps.map((step) => (
              <li key={step.title} className="relative flex items-start gap-4">
                <StepBadge number={step.number} tone={step.tone === "blue" ? "blue" : step.tone === "teal" ? "teal" : "rose"} />
                <div className="pt-1">
                  <h3 className="font-brand text-[17px] leading-tight text-black">{step.title}</h3>
                  <p className="mt-2 text-[15px] leading-snug text-black">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="bg-[linear-gradient(to_bottom,#4dd2b2,var(--color-brand-green)_30%,var(--color-brand-green)_55%,#57d5b5_60%,#c1efe4)]">
        <section aria-labelledby="reflect-title" className="py-12 md:py-20">
          <div className={container}>
            <h2 id="reflect-title" className="font-display text-[35px] font-bold italic leading-[1.05] text-white md:text-5xl">
              {reflection.title.map((line) => <span key={line} className="block">{line}</span>)}
            </h2>
            <p className="mt-5 text-base leading-snug text-white/90 md:text-lg">{reflection.description}</p>
            <ul className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-3">
              {reflection.items.map((item) => (
                <li key={item.label} className={`rounded-2xl p-5 ${item.tone === "rose" ? "bg-rose text-white" : "bg-white text-black"}`}>
                  <div className="flex items-center gap-3">
                    {icons[item.icon]}
                    <p className={`text-[11px] font-bold uppercase tracking-wide ${item.tone === "rose" ? "text-white" : "text-slate"}`}>{item.label}</p>
                  </div>
                  <h3 className="mt-4 font-display text-[26px] font-bold leading-tight">{item.title}</h3>
                  <p className="mt-2 text-base leading-snug">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="choose-title" className="pb-14 md:pb-24">
          <div className={container}>
            <h2 id="choose-title" className="font-display text-[31px] font-bold italic leading-tight text-white md:text-5xl">{nextStep.title}</h2>
            <p className="mt-4 text-base leading-snug text-white/90 md:text-lg">{nextStep.description}</p>
            <div className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-2">
              {nextStep.cards.map((card) => (
                <div key={card.title} className={`rounded-2xl p-5 ${card.tone === "sun" ? "bg-sun" : "bg-mint-wash"}`}>
                  <h3 className={`font-brand text-[32px] leading-tight ${card.tone === "sun" ? "text-black" : "text-navy"}`}>{card.title}</h3>
                  <p className="mt-3 text-base leading-snug text-black">{card.description}</p>
                  <Link to={card.cta.to} className={buttonStyles({ variant: card.tone === "sun" ? "white" : "sun", size: "md", fullWidth: true, className: "mt-5 text-[15px]" })}>
                    {card.cta.label}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="pb-16 md:pb-24">
          <div className={container}>
            <h2 id="faq-title" className="font-display text-[40px] font-bold italic leading-none text-white md:text-5xl">{growFaq.title}</h2>
            <div className="mt-6 md:max-w-2xl"><FaqList label="Pertanyaan umum Grow" items={growFaq.items} tone="glass" /></div>
          </div>
        </section>
      </div>

      <section aria-label="Temukan jalurmu" className="bg-rose px-6 py-12 text-center md:py-20">
        <h2 className="font-brand text-[27px] leading-tight text-white md:text-4xl">{growClosing.title}</h2>
        <Link to={growClosing.cta.to} className={buttonStyles({ variant: "white", size: "lg", fullWidth: true, className: "mx-auto mt-10 max-w-[302px] text-[15px] md:w-auto" })}>
          {growClosing.cta.label}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

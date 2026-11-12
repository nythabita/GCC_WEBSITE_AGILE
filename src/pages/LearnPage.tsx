import { Check, BookOpen, MessageSquareText, Target } from "lucide-react";
import { Link } from "react-router";
import { growthCamp } from "../assets/brand";
import { ArrowLink, ClosingCta, DisplayTitle, Eyebrow, FaqList, PageContainer, PhotoFrame, StepTimeline } from "../components/content/blocks";
import { competencies, featuredGrowthCamp, learnClosing, learnFaq, learnHero, learningToPractice } from "../data/learn-content";

const competencyIcons = {
  book: <BookOpen size={22} aria-hidden="true" className="text-brand-red" />,
  target: <Target size={22} aria-hidden="true" className="text-teal-deep" />,
  chat: <MessageSquareText size={22} aria-hidden="true" className="text-brand-blue" />,
};

export default function LearnPage() {
  return (
    <main className="bg-paper text-forest">
      <PageContainer className="pt-10 md:pt-16">
        <section aria-labelledby="learn-title" className="md:grid md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <Eyebrow>{learnHero.eyebrow}</Eyebrow>
            <DisplayTitle as="h1" className="mt-5">
              {learnHero.title.map((line) => <span key={line} className="block">{line}</span>)}
            </DisplayTitle>
            <p className="mt-6 text-base leading-snug md:text-lg">{learnHero.description}</p>
            <ArrowLink to={learnHero.cta.to} className="mt-8 md:w-auto" fullWidth>{learnHero.cta.label}</ArrowLink>
            <Link to={learnHero.secondary.to} className="mt-4 inline-block text-sm font-semibold text-brand-blue underline underline-offset-4">{learnHero.secondary.label}</Link>
          </div>
          <PhotoFrame {...learnHero.photo} className="mt-9 md:mt-0" />
        </section>

        <section aria-labelledby="competencies-title" className="mt-12 md:mt-24">
          <Eyebrow>{competencies.eyebrow}</Eyebrow>
          <DisplayTitle className="mt-4"><span id="competencies-title">{competencies.title}</span></DisplayTitle>
          <p className="mt-5 text-base leading-snug md:text-lg">{competencies.description}</p>
          <ul className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-3">
            {competencies.items.map((item) => (
              <li key={item.name} className={`rounded-2xl p-4 ${item.tone === "mint" ? "bg-mint" : "border border-line/60 bg-paper-soft"}`}>
                <div className="flex items-center gap-4">
                  {competencyIcons[item.icon]}
                  <h3 className="font-sub text-[17px] font-semibold">{item.number} {item.name}</h3>
                </div>
                <p className="mt-4 text-base leading-snug">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </PageContainer>

      <section aria-labelledby="featured-title" className="mt-12 bg-[#f3eee4] py-6 md:mt-24 md:py-16">
        <PageContainer>
          <Eyebrow>{featuredGrowthCamp.eyebrow}</Eyebrow>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <h2 id="featured-title" className="font-brand text-[32px] leading-none">{featuredGrowthCamp.name}</h2>
              <p className="mt-4 font-sub text-xl font-semibold leading-tight md:text-2xl">
                {featuredGrowthCamp.tagline.map((line) => <span key={line} className="block">{line}</span>)}
              </p>
            </div>
            {/* The source PNG has wide empty margins; crop them with an overflow box instead of scaling the layout. */}
            <div className="mt-2 h-[90px] w-[110px] shrink-0 overflow-hidden opacity-80" aria-hidden="true">
              <img src={growthCamp} alt="" className="block w-[210px] max-w-none -translate-x-[50px] -translate-y-[90px]" />
            </div>
          </div>
          <p className="mt-7 text-base leading-snug md:max-w-2xl md:text-lg">{featuredGrowthCamp.description}</p>
          <PhotoFrame {...featuredGrowthCamp.photo} className="mt-6 md:max-w-xl" />
          <dl className="mt-6 flex flex-col gap-4">
            {featuredGrowthCamp.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-sub text-base font-semibold">{fact.label}</dt>
                <dd className="mt-1 text-base leading-snug text-forest/80">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-8 font-sub text-xl font-semibold">{featuredGrowthCamp.overviewTitle}</h3>
          <ul className="mt-4 flex flex-col gap-2.5 md:grid md:grid-cols-2">
            {featuredGrowthCamp.overview.map((item) => (
              <li key={item} className="flex min-h-[60px] items-center gap-4 rounded-2xl bg-white px-5 text-sm font-semibold">
                <Check size={16} aria-hidden="true" className="text-teal-active" />
                {item}
              </li>
            ))}
          </ul>
          <ArrowLink to={featuredGrowthCamp.cta.to} className="mt-5 md:w-auto">{featuredGrowthCamp.cta.label}</ArrowLink>
          <p className="mt-4 text-xs text-forest/80">{featuredGrowthCamp.note}</p>
        </PageContainer>
      </section>

      <PageContainer>
        <section aria-labelledby="practice-title" className="mt-12 md:mt-24">
          <DisplayTitle>
            <span id="practice-title">{learningToPractice.title.map((line) => <span key={line} className="block">{line}</span>)}</span>
          </DisplayTitle>
          <p className="mt-5 text-base leading-snug md:text-lg">{learningToPractice.description}</p>
          <div className="mt-8 md:max-w-xl"><StepTimeline steps={learningToPractice.steps} /></div>
          <p className="mt-10 text-sm text-forest/80">{learningToPractice.note}</p>
          <ArrowLink to={learningToPractice.cta.to} variant="outline" className="mt-4 border-brand-blue text-brand-blue md:w-auto">{learningToPractice.cta.label}</ArrowLink>
        </section>

        <section aria-labelledby="faq-title" className="mt-14 md:mt-24">
          <Eyebrow>{learnFaq.eyebrow}</Eyebrow>
          <DisplayTitle className="mt-4"><span id="faq-title">{learnFaq.title}</span></DisplayTitle>
          <div className="mt-8 md:max-w-2xl"><FaqList label="Pertanyaan umum" items={learnFaq.items} /></div>
        </section>

        <div className="mt-12 pb-10 md:mt-24 md:pb-24">
          <ClosingCta title={learnClosing.title.map((line) => <span key={line} className="block">{line}</span>)} description={learnClosing.description} cta={learnClosing.cta} />
        </div>
      </PageContainer>
    </main>
  );
}

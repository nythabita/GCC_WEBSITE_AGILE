import { BookOpen, MessageSquareText, Target } from "lucide-react";
import { Link } from "react-router";
import { logoGrowthCampMini } from "../assets/home";
import { ArrowLink, Eyebrow, PageContainer } from "../components/content/blocks";
import { BerryClosing, CardStack, CheckList, FaqSection, Note, Polaroid, SectionHead, Timeline } from "../components/program/sections";
import { competencies, featuredGrowthCamp as camp, learnClosing, learnFaq, learnHero as hero, learningToPractice as practice } from "../data/learn-content";

const competencyIcons = [
  <BookOpen key="book" size={22} aria-hidden="true" className="text-brand-blue" />,
  <Target key="target" size={22} aria-hidden="true" className="text-teal-deep" />,
  <MessageSquareText key="chat" size={22} aria-hidden="true" className="text-brand-blue" />,
];

// "2. PAGE LEARN" (frame 1) — /learn.
export default function LearnPage() {
  return (
    <main className="tracking-[0.02em]">
      <div className="bg-[linear-gradient(to_bottom,#fbfefd,#cff3ea_40%,#b9eddf)]">
        <section aria-labelledby="learn-title" className="pb-0 pt-10 md:pt-16">
          <PageContainer>
            <div className="md:grid md:grid-cols-2 md:items-center md:gap-12">
              <div>
                <Eyebrow>{hero.eyebrow}</Eyebrow>
                <h1 id="learn-title" className="mt-4 font-display font-bold italic tracking-normal text-forest">
                  <span className="block text-[31px] leading-[1.25] md:text-4xl">{hero.title[0]}</span>
                  <span className="block text-[43px] leading-[1.1] md:text-[56px]">{hero.title[1]}</span>
                </h1>
                <p className="-mr-5 mt-2 text-base font-semibold leading-6 text-forest md:mr-0 md:text-lg">{hero.description}</p>
                <ArrowLink to={hero.cta.to} variant="berry" className="mt-7 md:w-auto">{hero.cta.label}</ArrowLink>
                <Link to={hero.secondary.to} className="mt-4 inline-block text-sm font-semibold text-teal-deep underline underline-offset-4">{hero.secondary.label}</Link>
              </div>
              <Polaroid wide src={hero.photo.src} alt={hero.photo.alt} caption={hero.photo.caption} />
            </div>
          </PageContainer>
        </section>

        <section aria-labelledby="learn-skills" className="pb-12 pt-4 md:pb-20">
          <PageContainer>
            <SectionHead id="learn-skills" eyebrow={competencies.eyebrow} title={competencies.title} description={competencies.description} />
            <CardStack small items={competencies.items} icons={competencyIcons} className="mt-8" />
          </PageContainer>
        </section>
      </div>

      <section aria-labelledby="learn-camp" className="bg-white pb-2 pt-[76px] md:py-20">
        <PageContainer>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 id="learn-camp" className="font-brand text-[30px] leading-none tracking-normal text-berry">{camp.name}</h2>
              <p className="mt-5 font-display text-[22px] font-bold leading-[1.3] tracking-normal text-forest">
                {camp.tagline.map((line) => <span key={line} className="block">{line}</span>)}
              </p>
            </div>
            <img src={logoGrowthCampMini} alt="" aria-hidden="true" className="w-[89px] shrink-0" />
          </div>
          <p className="-mr-2.5 mt-6 text-base font-bold leading-6 text-forest md:mr-0 md:max-w-2xl md:text-lg">{camp.description}</p>
          <Polaroid wide frame="bg-[#fbf6ee]" src={camp.photo.src} alt={camp.photo.alt} caption={camp.photo.caption} />
          <dl className="mt-6 flex flex-col gap-3">
            {camp.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-base font-semibold text-forest">{fact.label}</dt>
                <dd className="-mr-3 mt-1 text-base font-semibold leading-6 text-forest/80">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-6 text-[18px] font-semibold leading-6 text-forest">{camp.overviewTitle}</h3>
          <CheckList items={camp.overview} className="mt-6 !gap-[46px] md:max-w-xl" />
          <ArrowLink to={camp.cta.to} variant="berry" className="mt-8 md:w-auto">{camp.cta.label}</ArrowLink>
          <Note className="mt-5">{camp.note}</Note>
        </PageContainer>
      </section>

      <div aria-hidden="true" className="h-9 bg-[#5fd6b8]" />
      <section aria-labelledby="learn-practice" className="bg-white pb-8 pt-4 md:py-20">
        <PageContainer>
          <SectionHead id="learn-practice" title={practice.title} description={practice.description} />
          <div className="mt-8"><Timeline bright steps={practice.steps} /></div>
          <Note className="mt-8">{practice.note}</Note>
          <ArrowLink to={practice.cta.to} variant="outline" className="mt-5 md:w-auto">{practice.cta.label}</ArrowLink>
        </PageContainer>
      </section>

      <FaqSection id="learn-faq" eyebrow="" title={learnFaq.title} items={learnFaq.items} label="Pertanyaan umum Learn">
        <BerryClosing id="learn-closing" title={learnClosing.title} description={learnClosing.description} cta={learnClosing.cta} />
      </FaqSection>
    </main>
  );
}

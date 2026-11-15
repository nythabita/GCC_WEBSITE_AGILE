import { BookOpen, Goal, MessageSquareText } from "lucide-react";
import { iconStore } from "../assets/discover";
import { logoGrowthXMini } from "../assets/home";
import { growthxCollab, growthxMatching } from "../assets/program";
import { ArrowLink, PageContainer } from "../components/content/blocks";
import { BerryClosing, CardStack, CaseCard, CheckList, FaqSection, LabeledList, Note, Polaroid, ProgramHero, SectionHead, Timeline } from "../components/program/sections";
import { growthxAbout, growthxCase, growthxClosing, growthxContribute, growthxFaq, growthxFit, growthxFlow, growthxHero, growthxPlan, growthxPrepare, growthxReadiness } from "../data/growthx-content";

const contributeIcons = [
  <BookOpen key="book" size={22} aria-hidden="true" className="text-brand-blue" />,
  <Goal key="goal" size={22} aria-hidden="true" className="text-brand-blue" />,
  <MessageSquareText key="chat" size={22} aria-hidden="true" className="text-brand-blue" />,
];

// "3. PAGE APPLY (GROWTH X)" — program landing at /apply/growthx.
export default function GrowthXPage() {
  const h = growthxHero;
  return (
    <main className="tracking-[0.02em]">
      <div className="bg-[linear-gradient(to_bottom,#fbfefd,#cff3ea_45%,#b9eddf)]">
        <ProgramHero
          name={h.name}
          logo={logoGrowthXMini}
          logoAlt="Logo GrowthX Mentoring"
          title={h.title}
          description={h.description}
          cta={h.cta}
          backTo="/programs"
          photo={{ src: growthxMatching, alt: "Peserta GrowthX Matching berdiskusi di ruang kelas", caption: h.photoCaption }}
        />
        <section aria-labelledby="gx-about" className="pb-0 pt-6 md:pb-20">
          <PageContainer>
            <SectionHead id="gx-about" eyebrow={growthxAbout.eyebrow} title={growthxAbout.title} description={growthxAbout.description} />
            <CardStack items={growthxAbout.cards} className="mt-6" />
            <Note className="mt-6">{growthxAbout.note}</Note>
          </PageContainer>
        </section>
      </div>

      <section aria-labelledby="gx-contribute" className="bg-berry pb-12 pt-10 md:py-20">
        <PageContainer>
          <SectionHead id="gx-contribute" tone="light" eyebrow={growthxContribute.eyebrow} title={growthxContribute.title} description={growthxContribute.description} />
          <CardStack items={growthxContribute.items} icons={contributeIcons} className="mt-6" />
        </PageContainer>
      </section>

      <section aria-labelledby="gx-ready" className="bg-white pb-16 pt-12 md:py-20">
        <PageContainer>
          <h2 id="gx-ready" className="tracking-normal font-display text-[37px] font-bold italic leading-[1.15] text-black md:text-[42px]">{growthxReadiness.title}</h2>
          <p className="mt-4 text-base font-bold leading-6 text-black md:max-w-2xl md:text-lg">{growthxReadiness.description}</p>
          <div className="mt-12"><LabeledList label="Aspek" items={growthxReadiness.aspects} /></div>
          <Note className="mt-10">{growthxReadiness.note}</Note>
        </PageContainer>
      </section>

      <div aria-hidden="true" className="h-9 bg-[#7ddfc6]" />
      <section aria-labelledby="gx-flow" className="bg-white pb-0 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gx-flow" eyebrow={growthxFlow.eyebrow} title={growthxFlow.title} description={growthxFlow.description} />
          <div className="mt-6"><Timeline steps={growthxFlow.steps} /></div>
          <Note className="mt-10">{growthxFlow.note}</Note>
          <Polaroid src={growthxCollab} alt="Peserta berdiskusi dalam kelompok" caption={growthxFlow.photoCaption} />
        </PageContainer>
      </section>

      <section aria-labelledby="gx-case" className="bg-brand-green pb-6 pt-10 md:py-20">
        <PageContainer>
          <SectionHead id="gx-case" tone="light" eyebrow={growthxCase.eyebrow} title={growthxCase.title} description={growthxCase.description} />
          <CaseCard data={growthxCase.data} icon={iconStore} />
        </PageContainer>
      </section>

      <section aria-labelledby="gx-fit" className="bg-white pb-0 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gx-fit" eyebrow={growthxFit.eyebrow} title={growthxFit.title} description={growthxFit.description} />
          <CheckList items={growthxFit.points} className="mt-8 md:max-w-2xl" />
          <p className="mt-8 text-[15px] font-bold leading-6 text-forest md:max-w-2xl">{growthxFit.note}</p>
          <ArrowLink to={growthxFit.cta.to} variant="outline" className="mt-6 md:w-auto">{growthxFit.cta.label}</ArrowLink>
        </PageContainer>
      </section>

      <section aria-labelledby="gx-plan" className="bg-brand-green pb-6 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gx-plan" tone="light" eyebrow={growthxPlan.eyebrow} title={growthxPlan.title} description={growthxPlan.description} />
          <CardStack items={growthxPlan.items} compact className="mt-8 md:!grid-cols-2" />
        </PageContainer>
      </section>

      <section aria-labelledby="gx-prepare" className="bg-white pb-2 pt-6 md:py-20">
        <PageContainer>
          <SectionHead id="gx-prepare" eyebrow={growthxPrepare.eyebrow} title={growthxPrepare.title} description={growthxPrepare.description} />
          <CheckList items={growthxPrepare.items} className="mt-8 md:max-w-2xl" />
          <Note className="mt-6">{growthxPrepare.note}</Note>
        </PageContainer>
      </section>

      <FaqSection id="gx-faq" title="Good to Know" items={growthxFaq} label="Pertanyaan umum GrowthX">
        <BerryClosing id="gx-closing" title={growthxClosing.title} description={growthxClosing.description} cta={growthxClosing.cta} />
      </FaqSection>
    </main>
  );
}

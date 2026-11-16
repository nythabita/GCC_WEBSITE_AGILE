import { logoGrowthConnect } from "../assets/brand";
import { PageContainer } from "../components/content/blocks";
import { BerryClosing, CardStack, CaseCard, FaqSection, LabeledList, Note, ProgramHero, SectionHead, Timeline } from "../components/program/sections";
import { connectAbout, connectAreas, connectCase, connectClosing, connectExpect, connectFaq, connectFlow, connectHero, connectPlan, connectPrepare, connectProblem } from "../data/growthconnect-content";

// "4. PAGE APPLY - GROWTHCONNECT" — program landing at /apply/growthconnect.
export default function GrowthConnectPage() {
  const h = connectHero;
  return (
    <main className="tracking-[0.02em]">
      <div className="bg-[linear-gradient(to_bottom,#fbfefd,#cff3ea_45%,#b9eddf)]">
        <ProgramHero eyebrow={h.eyebrow} name={h.name} logo={logoGrowthConnect} logoAlt="Logo GrowthConnect" logoWidth={120} title={h.title} description={h.description} cta={h.cta} backTo="/programs" />
        <section aria-labelledby="gc-about" className="pb-0 pt-6 md:pb-20">
          <PageContainer>
            <SectionHead id="gc-about" eyebrow={connectAbout.eyebrow} title={connectAbout.title} description={connectAbout.description} />
            <CardStack serif items={connectAbout.cards} className="mt-6" />
            <Note className="mt-6 pb-2">{connectAbout.note}</Note>
          </PageContainer>
        </section>
      </div>

      <section aria-labelledby="gc-areas" className="bg-brand-green pb-6 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gc-areas" tone="light" eyebrow={connectAreas.eyebrow} title={connectAreas.title} description={connectAreas.description} />
          <CardStack serif items={connectAreas.items} className="mt-8" />
          <Note tone="light" className="mt-6">{connectAreas.note}</Note>
        </PageContainer>
      </section>

      <section aria-labelledby="gc-problem" className="bg-white pb-4 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gc-problem" eyebrow={connectProblem.eyebrow} title={connectProblem.title} description={connectProblem.description} />
          <div className="mt-10"><LabeledList label="Pertanyaan" items={connectProblem.questions} gap="gap-[72px]" /></div>
        </PageContainer>
      </section>

      <div aria-hidden="true" className="h-9 bg-[#7ddfc6]" />
      <section aria-labelledby="gc-flow" className="bg-white pb-2 pt-6 md:py-20">
        <PageContainer>
          <SectionHead id="gc-flow" eyebrow={connectFlow.eyebrow} title={connectFlow.title} description={connectFlow.description} />
          <div className="mt-8"><Timeline steps={connectFlow.steps} /></div>
          <Note className="mt-10">{connectFlow.note}</Note>
        </PageContainer>
      </section>

      <div className="bg-[linear-gradient(to_bottom,#5fd6b8,#40d0ac)]">
        <section aria-labelledby="gc-expect" className="pb-4 pt-8 md:pt-20">
          <PageContainer>
            <SectionHead id="gc-expect" tone="light" title={connectExpect.title} description={connectExpect.description} />
            <CardStack serif items={connectExpect.items} className="mt-8" />
            <Note tone="light" className="mt-6">{connectExpect.note}</Note>
          </PageContainer>
        </section>
        <section aria-labelledby="gc-prepare" className="pb-6 pt-2 md:pb-20">
          <PageContainer>
            <SectionHead id="gc-prepare" tone="light" title={connectPrepare.title} description={connectPrepare.description} />
            <CardStack serif items={connectPrepare.items} className="mt-8 md:!grid-cols-2" />
            <Note tone="light" className="mt-6">{connectPrepare.note}</Note>
          </PageContainer>
        </section>
      </div>

      <section aria-labelledby="gc-case" className="bg-brand-green pb-6 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gc-case" tone="light" eyebrow={connectCase.eyebrow} title={connectCase.title} description={connectCase.description} />
          <CaseCard data={connectCase.data} soft />
        </PageContainer>
      </section>

      <section aria-labelledby="gc-plan" className="bg-brand-green pb-8 md:py-20">
        <PageContainer>
          <SectionHead id="gc-plan" tone="light" eyebrow={connectPlan.eyebrow} title={connectPlan.title} description={connectPlan.description} />
          <CardStack compact items={connectPlan.items} className="mt-8 md:!grid-cols-2" />
        </PageContainer>
      </section>

      <FaqSection id="gc-faq" title="Good to Know" items={connectFaq} label="Pertanyaan umum GrowthConnect">
        <BerryClosing id="gc-closing" title={connectClosing.title} description={connectClosing.description} cta={connectClosing.cta} />
      </FaqSection>
    </main>
  );
}

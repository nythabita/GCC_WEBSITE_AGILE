import { BookOpen, Goal, MessageSquareText } from "lucide-react";
import { logoGrowthCampMini } from "../assets/home";
import { growthcampSession, growthcampSession3 } from "../assets/program";
import { PageContainer } from "../components/content/blocks";
import { BerryClosing, CardStack, CheckList, FaqSection, LabeledList, Note, Polaroid, ProgramHero, SectionHead, Timeline } from "../components/program/sections";
import { campAbout, campClosing, campFaq, campFit, campHero, campInside, campJourney, campPlan, campPractice, campProcess } from "../data/growthcamp-content";

const practiceIcons = [
  <BookOpen key="book" size={22} aria-hidden="true" className="text-brand-blue" />,
  <Goal key="goal" size={22} aria-hidden="true" className="text-brand-blue" />,
  <MessageSquareText key="chat" size={22} aria-hidden="true" className="text-brand-blue" />,
];

// "2. PAGE LEARN" (landing frame) — program landing at /learn/growthcamp.
export default function GrowthCampPage() {
  const h = campHero;
  return (
    <main className="tracking-[0.02em]">
      <div className="bg-[linear-gradient(to_bottom,#fbfefd,#cff3ea_45%,#b9eddf)]">
        <ProgramHero
          eyebrow={h.eyebrow}
          name={h.name}
          logo={logoGrowthCampMini}
          logoAlt="Logo GrowthCamp"
          logoWidth={89}
          title={h.title}
          description={h.description}
          cta={h.cta}
          backTo="/learn"
          backLabel="Kembali ke Learn"
          photo={{ src: growthcampSession, alt: "Peserta GrowthCamp belajar bersama lewat sesi daring", caption: h.photoCaption, wide: true }}
        />
        <section aria-labelledby="gcamp-about" className="pb-6 pt-8 md:pb-20">
          <PageContainer>
            <SectionHead id="gcamp-about" eyebrow={campAbout.eyebrow} title={campAbout.title} description={campAbout.description} />
            <CardStack small items={campAbout.cards} className="mt-6" />
          </PageContainer>
        </section>
      </div>

      <section aria-labelledby="gcamp-practice" className="bg-berry pb-6 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gcamp-practice" tone="light" eyebrow={campPractice.eyebrow} title={campPractice.title} description={campPractice.description} />
          <CardStack items={campPractice.items} icons={practiceIcons} className="mt-8" />
        </PageContainer>
      </section>

      <div aria-hidden="true" className="h-9 bg-[#a0e8d4]" />
      <section aria-labelledby="gcamp-inside" className="bg-white pb-8 pt-6 md:py-20">
        <PageContainer>
          <SectionHead id="gcamp-inside" eyebrow={campInside.eyebrow} title={campInside.title} description={campInside.description} />
          <div className="mt-10"><LabeledList label="Bagian" items={campInside.parts} gap="gap-[72px]" /></div>
        </PageContainer>
      </section>

      <div aria-hidden="true" className="h-9 bg-[#5fd6b8]" />
      <section aria-labelledby="gcamp-process" className="bg-white pb-2 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gcamp-process" eyebrow={campProcess.eyebrow} title={campProcess.title} description={campProcess.description} />
          <CheckList items={campProcess.items} className="mt-8 md:max-w-2xl" />
          <Polaroid wide src={growthcampSession3} alt="Peserta GrowthCamp sesi ke-3 berfoto bersama di ruang kelas" caption={campProcess.photoCaption} />
        </PageContainer>
      </section>

      <div className="bg-[linear-gradient(to_bottom,#5fd6b8,#2ecaa2)]">
        <section aria-labelledby="gcamp-fit" className="pb-4 pt-6 md:py-20">
          <PageContainer>
            <SectionHead id="gcamp-fit" tone="light" eyebrow={campFit.eyebrow} title={campFit.title} description={campFit.description} />
            <CheckList tone="light" items={campFit.points} className="mt-8 md:max-w-2xl" />
            <Note tone="light" className="mt-6">{campFit.note}</Note>
          </PageContainer>
        </section>
      </div>

      <section aria-labelledby="gcamp-plan" className="bg-brand-green pb-4 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gcamp-plan" tone="light" eyebrow={campPlan.eyebrow} title={campPlan.title} description={campPlan.description} />
          <CardStack compact items={campPlan.items} className="mt-8 md:!grid-cols-2" />
        </PageContainer>
      </section>

      <section aria-labelledby="gcamp-journey" className="bg-white pb-2 pt-8 md:py-20">
        <PageContainer>
          <SectionHead id="gcamp-journey" eyebrow={campJourney.eyebrow} title={campJourney.title} description={campJourney.description} />
          <div className="mt-8"><Timeline steps={campJourney.steps} /></div>
          <Note className="mt-8">{campJourney.note}</Note>
        </PageContainer>
      </section>

      <FaqSection id="gcamp-faq" title="Good to Know" items={campFaq} label="Pertanyaan umum GrowthCamp">
        <BerryClosing id="gcamp-closing" title={campClosing.title} description={campClosing.description} cta={campClosing.cta} />
      </FaqSection>
    </main>
  );
}

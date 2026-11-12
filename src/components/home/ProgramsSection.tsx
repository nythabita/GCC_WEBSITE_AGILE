import type { HomepageContent } from "../../../shared/homepage";
import { divider } from "../../assets/home";
import { programs } from "../../data/homepage-content";
import ProgramCard from "./ProgramCard";

export default function ProgramsSection({ content }: { content: HomepageContent["journey"] }) {
  return (
    <section id="programs" aria-labelledby="programs-title" className="scroll-mt-24 bg-paper pt-[58px] md:pt-20">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <img src={divider} alt="" aria-hidden="true" className="mx-auto block h-[3px] w-full max-w-[316px] md:max-w-xl" />
        <h2 id="programs-title" className="mx-auto mt-10 max-w-[244px] text-center font-display text-[28px] font-bold italic leading-[1.15] text-black md:max-w-none md:text-5xl">
          {content.title}
        </h2>
        <div className="mt-[72px] flex flex-col gap-[75px] md:mt-14 md:grid md:grid-cols-3 md:items-start md:gap-8">
          {programs.map((program) => <ProgramCard key={program.slug} program={program} />)}
        </div>
      </div>
    </section>
  );
}

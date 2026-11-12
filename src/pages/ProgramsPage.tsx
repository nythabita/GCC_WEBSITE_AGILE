import ProgramCard from "../components/home/ProgramCard";
import { programs } from "../data/homepage-content";

// "Explore Page" (WORKING FILE → 0. LOGIN TO HOMEPAGE): the three program cards on their own page.
export default function ProgramsPage() {
  return (
    <main className="bg-paper">
      <div className="mx-auto w-full max-w-7xl px-6 pb-14 pt-10 md:px-8 md:pb-24 md:pt-16">
        <h1 className="mx-auto max-w-[244px] text-center font-display text-[28px] font-bold italic leading-[1.15] text-black md:max-w-none md:text-5xl">
          Explore How We Learn and Grow
        </h1>
        <div className="mt-12 flex flex-col gap-[75px] md:mt-14 md:grid md:grid-cols-3 md:items-start md:gap-8">
          {programs.map((program) => <ProgramCard key={program.slug} program={program} variant="explore" />)}
        </div>
      </div>
    </main>
  );
}

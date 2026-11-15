import ProgramCard from "../components/home/ProgramCard";
import { programs } from "../data/homepage-content";

// "Explore Page" (latest Figma export, Group 72): the three program cards on their own page.
// White fades to the brand green behind the middle card and back to white.
export default function ProgramsPage() {
  return (
    <main className="bg-[linear-gradient(to_bottom,#fff_26%,var(--color-brand-green)_52%,#fff_96%)]">
      <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-5 md:px-8 md:pb-24 md:pt-16">
        <h1 className="mx-auto max-w-[244px] text-center font-display text-[28px] font-bold italic leading-[1.15] text-black md:max-w-none md:text-5xl">
          Explore How We Learn and Grow
        </h1>
        <div className="mt-[37px] flex flex-col gap-[75px] md:mt-14 md:grid md:grid-cols-3 md:items-start md:gap-8">
          {programs.map((program) => <ProgramCard key={program.slug} program={program} variant="explore" />)}
        </div>
      </div>
    </main>
  );
}

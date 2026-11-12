import { Link } from "react-router";
import { divider, mentorSilhouette } from "../../assets/home";
import { mentors } from "../../data/homepage-content";

export default function MentorsSection() {
  return (
    <section aria-labelledby="mentors-title" className="bg-paper pt-[75px] md:pt-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <img src={divider} alt="" aria-hidden="true" className="mx-auto block h-[3px] w-full max-w-[316px] md:max-w-xl" />
        <h2 id="mentors-title" className="mx-auto mt-[77px] max-w-[327px] text-center font-display text-xl font-bold italic leading-tight text-black md:mt-16 md:max-w-none md:text-4xl">
          {mentors.title}
        </h2>
        <ul className="mt-[38px] flex flex-col gap-[43px] md:mt-14 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-14">
          {mentors.items.map((mentor) => (
            <li key={mentor.name} className="grid grid-cols-[131px_1fr] grid-rows-[auto_auto] items-start gap-x-4 gap-y-2 md:grid-cols-[160px_1fr] md:gap-x-6">
              {/* Placeholder silhouette until mentor portraits are supplied. */}
              <div className="col-start-1 row-start-1 h-[134px] w-[131px] overflow-hidden md:row-span-2 md:h-[164px] md:w-[160px]">
                <img src={mentorSilhouette} alt="" aria-hidden="true" className="block w-full object-cover object-top" style={{ height: "220%" }} />
              </div>
              <h3 className="col-span-2 col-start-1 row-start-2 font-brand text-2xl leading-none text-black md:col-span-1 md:col-start-2 md:row-start-1 md:pt-2 md:text-3xl">{mentor.name}</h3>
              <ul className="col-start-2 row-start-1 list-disc pl-5 pt-6 font-display text-sm font-bold leading-snug text-black md:row-start-2 md:pt-0 md:text-base">
                {mentor.highlights.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </li>
          ))}
        </ul>
        <Link to={mentors.seeMore.href} className="mx-auto mt-[46px] block w-fit font-display text-base font-bold italic text-black underline underline-offset-4 md:mt-16">
          {mentors.seeMore.label}
        </Link>
      </div>
    </section>
  );
}

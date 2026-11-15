import { Link } from "react-router";
import { divider, mentorSilhouette, mentorSilhouetteFemale } from "../../assets/home";
import { mentors } from "../../data/homepage-content";

const portraits = {
  // The silhouettes are tall; the design crops each to its head and shoulders.
  male: { src: mentorSilhouette, height: "220%" },
  female: { src: mentorSilhouetteFemale, height: "128%" },
};

export default function MentorsSection() {
  return (
    <section aria-labelledby="mentors-title" className="pt-[45px] md:pt-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <img src={divider} alt="" aria-hidden="true" className="mx-auto block h-[3px] w-full max-w-[316px] md:max-w-xl" />
        <h2 id="mentors-title" className="mx-auto mt-[77px] max-w-[327px] text-center font-display text-[32px] font-bold italic leading-tight text-mist md:mt-16 md:max-w-none md:text-5xl">
          {mentors.title}
        </h2>
        <ul className="mt-[23px] flex flex-col gap-[17px] md:mt-14 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-14">
          {mentors.items.map((mentor) => {
            const portrait = portraits[mentor.portrait];
            return (
              <li key={mentor.name}>
                <h3 className="font-brand text-2xl leading-none text-mist md:text-3xl">{mentor.name}</h3>
                <div className="mt-1 grid grid-cols-[131px_1fr] items-start gap-x-4 md:grid-cols-[160px_1fr] md:gap-x-6">
                  {/* Placeholder silhouette until mentor portraits are supplied. */}
                  <div className="h-[134px] w-[131px] overflow-hidden md:h-[164px] md:w-[160px]">
                    <img src={portrait.src} alt="" aria-hidden="true" className="block w-full object-cover object-top" style={{ height: portrait.height }} />
                  </div>
                  <ul className="list-disc pl-5 pt-8 font-display text-sm font-bold italic leading-snug text-mist md:pt-10 md:text-base">
                    {mentor.highlights.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
        <Link to={mentors.seeMore.href} className="mx-auto mt-[46px] block w-fit font-display text-base font-bold italic text-mist underline underline-offset-4 md:mt-16">
          {mentors.seeMore.label}
        </Link>
      </div>
    </section>
  );
}

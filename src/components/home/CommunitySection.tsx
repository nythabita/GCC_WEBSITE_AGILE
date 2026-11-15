import { community } from "../../data/homepage-content";

export default function CommunitySection() {
  return (
    <section aria-labelledby="community-title" className="bg-mint-mid pb-8">
      <div className="bg-citron px-6 pb-[37px] pt-[35px] md:py-16">
        <p className="text-center font-display text-xl font-bold italic text-black md:text-3xl">{community.eyebrow}</p>
        <h2 id="community-title" className="text-center font-brand text-[40px] leading-none text-iris md:text-6xl">{community.title}</h2>
        <ul className="mx-auto mt-[23px] flex max-w-[331px] flex-col gap-8 rounded-[10px] bg-white px-4 py-[45px] md:mt-12 md:max-w-3xl md:gap-10 md:px-10 md:py-12">
          {community.testimonials.map((item) => (
            <li key={item.text} className="flex items-center gap-2 rounded-full bg-bubble py-1.5 pl-1.5 pr-5 shadow-[5px_9px_1.8px_rgba(0,0,0,0.25)]" style={{ transform: `rotate(${item.tilt}deg)` }}>
              <span aria-hidden="true" className="flex size-[31px] shrink-0 items-center justify-center rounded-full bg-bubble-dot text-base leading-none">{item.emoji}</span>
              <p className="font-sub text-[11px] font-medium leading-snug text-black md:text-sm">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

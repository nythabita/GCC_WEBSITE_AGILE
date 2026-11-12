import { collaborations } from "../../data/homepage-content";

export default function CollaborationsSection() {
  return (
    <section aria-labelledby="collaborations-title" className="bg-paper pt-[164px] md:pt-28">
      <div className="bg-rose px-6 py-5 md:py-12">
        <h2 id="collaborations-title" className="text-center font-display text-xl font-bold italic text-white md:text-4xl">{collaborations.title}</h2>
        <ul className="mx-auto mt-5 grid max-w-[340px] grid-cols-2 items-center justify-items-center gap-x-6 gap-y-2 md:mt-10 md:max-w-4xl md:grid-cols-4 md:gap-10">
          {collaborations.logos.map((logo) => (
            <li key={logo.alt} className="flex items-center justify-center">
              <img src={logo.src} alt={logo.alt} width={logo.width} style={{ width: logo.width }} className="h-auto max-w-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

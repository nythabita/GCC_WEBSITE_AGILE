import type { HomepageContent } from "../../../shared/homepage";

export default function AboutSection({ content }: { content: HomepageContent["about"] }) {
  return (
    <section aria-labelledby="about-title" className="bg-forest">
      <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-2 md:px-8 md:pb-14 md:pt-0">
        <h2 id="about-title" className="text-center font-display text-2xl font-bold text-paper md:text-4xl">{content.title}</h2>
      </div>
      <div className="bg-mint">
        <p className="mx-auto max-w-3xl px-6 py-6 text-center text-base leading-[1.25] text-forest md:py-10 md:text-xl">{content.description}</p>
      </div>
    </section>
  );
}

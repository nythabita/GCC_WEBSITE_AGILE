import type { HomepageContent } from "../../../shared/homepage";
import { heroCircles } from "../../assets/home";
import { heroActions, heroCaptions, heroPhotos } from "../../data/homepage-content";
import { buttonStyles } from "../UI/button-styles";
import { cqw, pinStyle, type Box, type Pin } from "./collage";

// Design-pixel geometry from the Figma mobile frame (390 wide), measured from the top of the collage.
const BOX: Box = { w: 390, h: 256 };

const polaroids: { pin: Pin; ratio: number; padding: [top: number, side: number, bottom: number] }[] = [
  { pin: { cx: 130.06, cy: 84.85, w: 151.35, rotate: -11.29, skewX: 1.49 }, ratio: 151.35 / 96.82, padding: [4.1, 5.8, 14.2] },
  { pin: { cx: 268.43, cy: 109.79, w: 153.22, rotate: 13.94, skewX: -1.81 }, ratio: 153.22 / 101.86, padding: [5.2, 6, 17.2] },
  { pin: { cx: 193.76, cy: 174.93, w: 160.06 }, ratio: 160.06 / 106.08, padding: [4.2, 6.6, 20.3] },
];

const captionPins: Pin[] = [
  { cx: 113.6, cy: 29.4, w: 191.1, rotate: -11.64 },
  { cx: 287.8, cy: 52.64, w: 191.1, rotate: 13.66 },
  { cx: 191.5, cy: 237.1, w: 191.1, rotate: 0.26 },
];

function HeroCollage() {
  return (
    <div className="@container relative mx-auto w-full max-w-[390px] md:max-w-[480px]" style={{ aspectRatio: `${BOX.w} / ${BOX.h}` }}>
      {polaroids.map(({ pin, ratio, padding: [top, side, bottom] }, index) => (
        <div key={heroPhotos[index].src} className="bg-white shadow-md" style={{ ...pinStyle(pin, BOX), aspectRatio: ratio }}>
          <div className="absolute" style={{ top: cqw(top, BOX.w), bottom: cqw(bottom, BOX.w), left: cqw(side, BOX.w), right: cqw(side, BOX.w) }}>
            <img src={heroPhotos[index].src} alt={heroPhotos[index].alt} className="block h-full w-full object-cover" />
          </div>
        </div>
      ))}
      {captionPins.map((pin, index) => (
        <p
          key={heroCaptions[index]}
          className="whitespace-nowrap text-glow text-center font-display font-bold leading-none"
          style={{ ...pinStyle(pin, BOX), fontSize: cqw(14, BOX.w) }}
        >
          {heroCaptions[index]}
        </p>
      ))}
    </div>
  );
}

export default function HeroSection({ content }: { content: HomepageContent["hero"] }) {
  // The design stacks the three sentences and tints the last one.
  const lines = content.title.split(/(?<=[.!?])\s+/);

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-brand-green text-paper">
      <img src={heroCircles} alt="" aria-hidden="true" className="pointer-events-none absolute right-0 top-0 w-[390px] max-w-none select-none md:w-[560px]" />
      <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 pb-4 pt-4 md:grid-cols-2 md:items-center md:gap-12 md:px-8 md:py-20">
        <div>
          <h1 id="hero-title" className="font-display text-[32px] font-bold leading-[1.06] md:text-[56px]">
            {lines.map((line, index) => (
              <span key={line} className={`block ${index === lines.length - 1 ? "text-neon" : ""}`}>{line}</span>
            ))}
          </h1>
          <p className="mt-4 max-w-[345px] text-sm leading-[1.35] md:max-w-xl md:text-lg">{content.description}</p>
          <div className="mt-[22px] flex flex-col gap-2.5 md:flex-row md:gap-4">
            <a href={heroActions.primary.href} className={buttonStyles({ variant: "rose", size: "lg", fullWidth: true, className: "md:w-auto" })}>
              {heroActions.primary.label}
            </a>
            <a href={heroActions.secondary.href} className={buttonStyles({ variant: "paper", size: "lg", fullWidth: true, className: "md:w-auto" })}>
              {heroActions.secondary.label}
            </a>
          </div>
        </div>
        <HeroCollage />
      </div>
    </section>
  );
}

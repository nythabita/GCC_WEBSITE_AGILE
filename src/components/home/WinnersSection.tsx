import { starA, starB, trophy } from "../../assets/home";
import { winners } from "../../data/homepage-content";
import { cqw, pinStyle, type Box, type Pin } from "./collage";

// Geometry from the Figma mobile frame (390 wide); y measured from the section's top (design y 3455).
const BOX: Box = { w: 390, h: 705 };

const stars: Pin[] = [
  { cx: 56, cy: 96, w: 39, rotate: -30.42 },
  { cx: 343, cy: 132, w: 39, rotate: -22.93 },
];

const photos: { pin: Pin; ratio: number; shift: number }[] = [
  { pin: { cx: 132, cy: 216, w: 164.4, rotate: -17.58 }, ratio: 164.4 / 111.37, shift: 0 },
  { pin: { cx: 272, cy: 388, w: 165, rotate: 18.76 }, ratio: 165 / 114, shift: 0 },
  { pin: { cx: 107, cy: 527, w: 204, rotate: -13.75 }, ratio: 204 / 102, shift: 0 },
];

const labels: Pin[] = [
  { cx: 150, cy: 295, w: 148, rotate: -17.35 },
  { cx: 244, cy: 465, w: 181, rotate: 18.88 },
  { cx: 135, cy: 598, w: 181, rotate: -13.63 },
];

const captionSizes = [6, 7, 9];
const tilts = ["-rotate-2", "rotate-1", "-rotate-1"];

// Desktop (md+): the pinned phone collage does not scale to a wide page, so winners become a row of cards.
function WinnersDesktop() {
  return (
    <div className="mx-auto hidden w-full max-w-7xl px-8 md:block">
      <h2 className="text-center font-display text-6xl font-bold italic leading-none text-white lg:text-7xl">
        {winners.title}
      </h2>
      <ul className="mt-14 grid grid-cols-3 gap-8 lg:gap-12">
        {winners.items.map((winner, index) => (
          <li key={winner.name} className={`${tilts[index]} transition-transform duration-200 hover:rotate-0`}>
            <div className="overflow-hidden bg-white p-3 pb-14 shadow-xl">
              <img src={winner.photo} alt={winner.alt} className="block aspect-[4/3] w-full object-cover object-top" />
            </div>
            <div className="-mt-10 mx-4 rounded-[10px] bg-black/50 px-3 py-2 text-center text-white backdrop-blur-sm">
              <p className="text-glow font-display text-2xl font-bold leading-tight">{winner.name}</p>
              <p className="mt-1 font-sub text-sm font-extrabold leading-snug">{winner.caption}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function WinnersSection() {
  return (
    <section aria-label={winners.title} className="overflow-hidden pt-1 md:pt-16">
      <WinnersDesktop />
      <div className="@container relative mx-auto w-full max-w-[390px] md:hidden" style={{ aspectRatio: `${BOX.w} / ${BOX.h}` }}>
        <img src={trophy} alt="" aria-hidden="true" className="pointer-events-none select-none" style={{ ...pinStyle({ cx: 172, cy: 409, w: 541.7, rotate: 27.33 }, BOX), aspectRatio: "1" }} />
        {stars.map((pin, index) => (
          <img key={index} src={index === 0 ? starB : starA} alt="" aria-hidden="true" style={{ ...pinStyle(pin, BOX), aspectRatio: "38.25 / 36.61" }} />
        ))}
        <h2 id="winners-title" className="whitespace-nowrap text-center font-display font-bold italic leading-none text-white" style={{ ...pinStyle({ cx: 197, cy: 136, w: 310 }, BOX), fontSize: cqw(40, BOX.w) }}>
          {winners.title}
        </h2>
        <ul>
          {winners.items.map((winner, index) => (
            <li key={winner.name} className="contents">
              <div className="overflow-hidden" style={{ ...pinStyle(photos[index].pin, BOX), aspectRatio: photos[index].ratio }}>
                <img src={winner.photo} alt={winner.alt} className="block h-full w-full object-cover object-top" />
              </div>
              <div className="rounded-[10px] bg-black/40 px-1 py-0.5 text-center text-white" style={pinStyle(labels[index], BOX)}>
                <p className="text-glow font-display font-bold leading-tight" style={{ fontSize: cqw(14, BOX.w) }}>{winner.name}</p>
                <p className="font-sub font-extrabold leading-tight" style={{ fontSize: cqw(captionSizes[index], BOX.w) }}>{winner.caption}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

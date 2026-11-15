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

export default function WinnersSection() {
  return (
    <section aria-labelledby="winners-title" className="overflow-hidden pt-1 md:pt-16">
      <div className="@container relative mx-auto w-full max-w-[390px] md:max-w-[560px]" style={{ aspectRatio: `${BOX.w} / ${BOX.h}` }}>
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

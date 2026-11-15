import { trackRecord } from "../../data/homepage-content";

export default function TrackRecordSection() {
  return (
    <section aria-labelledby="track-record-title" className="pt-[101px] md:pt-28">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <h2 id="track-record-title" className="text-center font-display text-[40px] font-bold italic leading-[1.1] text-white md:text-6xl">
          {trackRecord.title}
        </h2>
        <ul className="mx-auto mt-[42px] grid max-w-[374px] grid-cols-2 gap-x-[23px] gap-y-[19px] md:mt-14 md:max-w-5xl md:grid-cols-4 md:gap-6">
          {trackRecord.stats.map((stat) => (
            <li key={stat.label} className="flex min-h-[106px] flex-col items-center justify-center rounded-[10px] bg-rose px-3 py-3 text-center text-white md:min-h-[150px]">
              <p className="font-display text-5xl font-bold italic leading-none md:text-6xl">{stat.value}</p>
              <p className="mt-2 font-display text-base font-bold leading-tight md:text-xl">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

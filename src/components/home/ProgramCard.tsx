import { Link } from "react-router";
import { iconCheck, programCardBackground } from "../../assets/home";
import type { Program } from "../../data/homepage-content";
import { buttonStyles } from "../UI/button-styles";

type Props = {
  program: Program;
  // "home" shows "What will you learn?"; "explore" (Explore Page) shows the per-program badge text.
  variant?: "home" | "explore";
};

export default function ProgramCard({ program, variant = "home" }: Props) {
  const titleId = `program-${variant}-${program.slug}`;
  const badge = variant === "explore" ? program.exploreBadge : "What will you learn?";

  return (
    <article aria-labelledby={titleId} className="mx-auto w-full max-w-[326px] md:max-w-none">
      <div className="relative mx-auto min-h-[419px] w-full max-w-[296px] overflow-hidden rounded-[15px] bg-brand-green px-4 pb-8 pt-4 text-white md:max-w-none">
        <img src={programCardBackground} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-5" />
        <div className="relative">
          <div className="flex items-start justify-between gap-2">
            <h3 id={titleId} className="font-brand text-[26px] leading-[1.15]">{program.name}</h3>
            <img src={program.logo.src} alt={program.logo.alt} width={program.logo.width} style={{ width: program.logo.width }} className="-mt-1 h-auto max-w-[45%] shrink-0" />
          </div>
          <p className="mt-4 inline-flex h-[30px] min-w-[200px] items-center justify-center rounded-[10px] bg-sun px-4 font-display text-xl font-bold italic leading-none text-black">
            {badge}
          </p>
          <ul className="mt-3 flex flex-col gap-[14px]">
            {program.benefits.map((benefit) => (
              <li key={benefit} className="grid grid-cols-[25px_1fr] items-start gap-x-3">
                <img src={iconCheck} alt="" aria-hidden="true" className="size-[25px]" />
                <span className="font-sub text-xs font-extrabold leading-[15px]">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Link to={program.href} className={buttonStyles({ variant: "rose", size: "xl", fullWidth: true, className: "mt-3" })}>
        {program.cta}
      </Link>
    </article>
  );
}

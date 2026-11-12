import { Link } from "react-router";
import { divider } from "../../assets/home";
import { startingPoint } from "../../data/homepage-content";
import { buttonStyles } from "../UI/button-styles";

export default function StartingPointSection() {
  return (
    <section id="starting-point" aria-labelledby="starting-point-title" className="scroll-mt-24 bg-paper pt-[118px] md:pt-28">
      <img src={divider} alt="" aria-hidden="true" className="mx-auto block h-[3px] w-full max-w-[316px] px-0 md:max-w-xl" />
      <h2 id="starting-point-title" className="mx-auto mt-[70px] max-w-[362px] px-3 text-center font-display text-[22px] font-bold leading-[1.15] text-black md:max-w-none md:text-4xl">
        {startingPoint.title}
      </h2>
      <div className="mt-[7px] bg-rose px-6 py-[18px] text-center md:py-12">
        <p className="mx-auto max-w-[344px] font-brand text-base leading-[1.3] text-white md:max-w-2xl md:text-xl">{startingPoint.description}</p>
        <Link to={startingPoint.cta.href} className={buttonStyles({ variant: "white", size: "lg", fullWidth: true, className: "mx-auto mt-[26px] max-w-[339px] font-brand font-normal md:w-auto md:max-w-none" })}>
          {startingPoint.cta.label}
        </Link>
      </div>
    </section>
  );
}

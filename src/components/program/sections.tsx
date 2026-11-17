import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { ArrowLink, BackLink, Eyebrow, FaqList, PageContainer, StepBadge, type FaqItem, type Step } from "../content/blocks";

// Section building blocks shared by the program pages (GrowthX, GrowthConnect, GrowthCamp).
// Geometry follows the Figma mobile frames; desktop only widens the column and lays cards in a grid.

export type TitleLines = [string, string];
export type CardItem = { title: string; text: string };
export type Cta = { label: string; to: string };

export function TwoLineTitle({ lines, tone = "dark", as: Tag = "h2", id }: { lines: TitleLines; tone?: "dark" | "light"; as?: "h1" | "h2"; id?: string }) {
  const color = tone === "light" ? "text-white" : "text-forest";
  return (
    <Tag id={id} className={`tracking-normal font-display font-bold italic ${color}`}>
      <span className="block text-[31px] leading-[1.25] md:text-[34px] lg:text-[42px]">{lines[0]}</span>
      <span className="block text-[37px] leading-[1.15] md:text-[42px] lg:text-[54px]">{lines[1]}</span>
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, description, tone = "dark", id, descriptionClass = "" }: { eyebrow?: string; title: TitleLines | string; description?: string; tone?: "dark" | "light"; id: string; descriptionClass?: string }) {
  const light = tone === "light";
  return (
    <header className="md:max-w-2xl lg:max-w-3xl">
      {eyebrow && <Eyebrow className={light ? "!text-white" : ""}>{eyebrow}</Eyebrow>}
      <div className={eyebrow ? "mt-4" : ""}>
        {typeof title === "string" ? (
          <h2 id={id} className={`tracking-normal font-display text-[37px] font-bold italic leading-[1.15] md:text-[42px] lg:text-[54px] ${light ? "text-white" : "text-forest"}`}>{title}</h2>
        ) : (
          <TwoLineTitle lines={title} tone={tone} id={id} />
        )}
      </div>
      {description && <p className={`-mr-2.5 mt-4 text-base font-semibold leading-6 md:mr-0 md:text-lg lg:text-xl lg:leading-8 ${light ? "text-white" : "text-forest/80"} ${descriptionClass}`}>{description}</p>}
    </header>
  );
}

export function ProgramHero({ eyebrow, name, logo, logoAlt, logoWidth = 91, title, description, cta, backTo, backLabel = "Kembali ke Program", photo }: {
  eyebrow?: string;
  name: string;
  logo?: string;
  logoAlt?: string;
  logoWidth?: number;
  title: TitleLines;
  description: string;
  cta: Cta;
  backTo: string;
  backLabel?: string;
  photo?: { src: string; alt: string; caption: string; wide?: boolean };
}) {
  return (
    <section aria-labelledby="program-title" className="pb-3 pt-[29px] md:pb-16">
      <PageContainer>
        <BackLink to={backTo}>{backLabel}</BackLink>
        <div className={`${eyebrow ? "mt-6" : "mt-10"} md:grid md:grid-cols-2 md:items-center md:gap-12 lg:gap-20`}>
          <div>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <div className={`${eyebrow ? "mt-4" : ""} flex flex-wrap items-start justify-between gap-x-3 gap-y-2`}>
              <p className="tracking-normal font-brand text-[30px] leading-none text-forest">{name}</p>
              {logo && <span className="block h-9 shrink-0"><img src={logo} alt={logoAlt ?? ""} style={{ width: logoWidth }} className="block max-w-none" /></span>}
            </div>
            <h1 id="program-title" className="mt-4 tracking-normal font-display font-bold italic text-forest">
              <span className="block text-[31px] leading-[1.25] md:text-4xl lg:text-5xl">{title[0]}</span>
              <span className="block text-[43px] leading-[1.1] md:text-[56px] lg:text-[72px]">{title[1]}</span>
            </h1>
            <p className="-mr-5 mt-3 text-base font-semibold leading-6 text-forest md:mr-0 md:text-lg lg:max-w-xl lg:text-xl lg:leading-8">{description}</p>
            <ArrowLink to={cta.to} variant="berry" className="mt-6 md:w-auto">{cta.label}</ArrowLink>
          </div>
          {photo && (
            <figure className={`mx-auto mt-8 md:mt-0 ${photo.wide ? "max-w-[342px] lg:max-w-[520px]" : "max-w-[273px] lg:max-w-[400px]"}`}>
              <div className={`bg-white shadow-lg ${photo.wide ? "p-4" : "p-2"}`}>
                <img src={photo.src} alt={photo.alt} className={`block w-full object-cover ${photo.wide ? "aspect-video" : "aspect-[4/3]"}`} />
              </div>
              <figcaption className="mt-2 text-center font-display text-xl font-bold text-black">{photo.caption}</figcaption>
            </figure>
          )}
        </div>
      </PageContainer>
    </section>
  );
}

export type CardTone = "white" | "glass";

// White rounded cards: used on gradient, green and berry backgrounds alike.
export function CardStack({ items, compact = false, serif = false, small = false, className = "", icons }: { items: CardItem[]; compact?: boolean; serif?: boolean; small?: boolean; className?: string; icons?: ReactNode[] }) {
  return (
    <ul className={`flex flex-col gap-4 md:grid md:grid-cols-3 lg:gap-6 ${className}`}>
      {items.map((item, index) => (
        <li key={item.title} className={`rounded-2xl bg-white px-5 text-forest ${compact ? "py-[18px]" : "py-[18px]"}`}>
          <div className="flex items-center gap-4">
            {icons?.[index]}
            <h3 className={serif ? "tracking-normal font-display text-[22px] font-bold leading-tight lg:text-[26px]" : `font-ui font-semibold leading-tight ${compact ? "text-[15px] font-bold lg:text-[17px]" : "text-[17px] lg:text-xl"}`}>{item.title}</h3>
          </div>
          <p className={`-mr-3.5 font-semibold md:mr-0 ${compact ? "mt-2.5 text-[15px] leading-[23px] lg:text-base lg:leading-7" : small ? "mt-3 text-[15px] leading-6 lg:text-base lg:leading-7" : "mt-3 text-base leading-6 lg:text-lg lg:leading-7"}`}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function Note({ children, tone = "dark", className = "" }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return <p className={`-mr-2.5 text-sm font-semibold leading-[22px] md:mr-0 md:max-w-2xl ${tone === "light" ? "text-white" : "text-forest"} ${className}`}>{children}</p>;
}

// "ASPEK 01" style numbered text blocks on a white background.
export type LabeledItem = CardItem & { extra?: { label: string; text: string } };

export function LabeledList({ label, items, serifTitle = true, gap = "gap-14" }: { label: string; items: LabeledItem[]; serifTitle?: boolean; gap?: string }) {
  return (
    <ol className={`flex flex-col ${gap} px-5 md:grid md:grid-cols-2 md:px-0`}>
      {items.map((item, index) => (
        <li key={item.title}>
          <p className="font-ui text-[11px] font-bold uppercase text-forest">{label} {String(index + 1).padStart(2, "0")}</p>
          <h3 className={`mt-3 tracking-normal text-[22px] leading-tight text-forest lg:text-[26px] ${serifTitle ? "font-display font-bold" : "font-sub font-semibold"}`}>{item.title}</h3>
          <p className="-mr-5 mt-6 text-base font-semibold leading-6 text-forest md:mr-0 lg:text-lg lg:leading-7">{item.text}</p>
          {item.extra && (
            <>
              <p className="mt-6 text-sm font-semibold text-forest">{item.extra.label}</p>
              <p className="mt-2 text-[15px] font-semibold leading-6 text-forest">{item.extra.text}</p>
            </>
          )}
        </li>
      ))}
    </ol>
  );
}

export function CheckList({ items, className = "", tone = "dark" }: { items: (string | CardItem)[]; className?: string; tone?: "dark" | "light" }) {
  return (
    <ul className={`flex flex-col gap-6 ${className}`}>
      {items.map((item) => {
        const entry = typeof item === "string" ? { title: item, text: "" } : item;
        return (
          <li key={entry.title} className="flex items-start gap-3">
            <Check size={16} aria-hidden="true" className={`mt-1 shrink-0 ${tone === "light" ? "text-white" : "text-teal-deep"}`} />
            <div>
              {entry.text ? (
                <>
                  <h3 className={`text-base font-bold leading-6 ${tone === "light" ? "text-white" : "text-forest"}`}>{entry.title}</h3>
                  <p className={`mt-2 text-[15px] font-semibold leading-6 ${tone === "light" ? "text-white" : "text-forest/80"}`}>{entry.text}</p>
                </>
              ) : (
                <p className={`text-base font-bold leading-6 ${tone === "light" ? "text-white" : "text-forest"}`}>{entry.title}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Timeline({ steps, bright = false }: { steps: Step[]; bright?: boolean }) {
  return (
    <ol className="relative flex max-w-xl flex-col gap-7">
      <span aria-hidden="true" className="absolute bottom-6 left-5 top-6 w-px bg-sage" />
      {steps.map((step) => (
        <li key={step.title} className="relative flex min-h-[85px] items-start gap-4">
          <StepBadge number={step.number} tone={step.tone === "rose" ? "rose" : "teal"} className={step.tone === "rose" ? "" : bright ? "" : "!bg-teal-deep"} />
          <div className="pt-0.5">
            <h3 className="font-ui text-[17px] font-bold leading-tight text-forest">{step.title}</h3>
            <p className="mt-2 text-[15px] font-semibold leading-6 text-forest/80">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Polaroid({ src, alt, caption, wide = false, frame = "bg-white" }: { src: string; alt: string; caption: string; wide?: boolean; frame?: string }) {
  return (
    <figure className={`mx-auto mt-6 md:max-w-[320px] ${wide ? "max-w-[342px]" : "max-w-[246px]"}`}>
      <div className={wide ? `px-6 pb-3 pt-3 ${frame}` : ""}>
        <img src={src} alt={alt} className={`block w-full object-cover ${wide ? "aspect-video" : "aspect-[4/3]"}`} />
      </div>
      <figcaption className="mt-3 text-center font-display text-xl font-bold tracking-normal text-black">{caption}</figcaption>
    </figure>
  );
}

export type CaseData = { badge: string; name: string; question: string; focus: string; disclaimer: string; cta: Cta };

export function CaseCard({ data, icon, soft = false }: { data: CaseData; icon?: string; soft?: boolean }) {
  return (
    <div className="mt-6 rounded-3xl bg-white p-5 md:max-w-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-bold uppercase ${soft ? "bg-[#fdebd0] text-berry" : "bg-sun text-black"}`}>{data.badge}</span>
          <h3 className="mt-4 tracking-normal font-display text-[22px] font-bold text-forest">{data.name}</h3>
        </div>
        {icon && <img src={icon} alt="" aria-hidden="true" className="w-[69px] shrink-0" />}
      </div>
      <p className="mt-4 text-base font-bold leading-6 text-forest">{data.question}</p>
      <p className="mt-4 text-[15px] font-bold leading-6 text-forest">{data.focus}</p>
      <p className="mt-4 text-[13px] font-semibold leading-5 text-forest">{data.disclaimer}</p>
      <ArrowLink to={data.cta.to} variant="outline" className="mt-6">{data.cta.label}</ArrowLink>
    </div>
  );
}

// FAQ on the mint gradient; the closing card (children) sits on the lighter end of the same gradient.
export function FaqSection({ id, title, items, label, children, eyebrow = "Pertanyaan umum" }: { id: string; title: string; items: FaqItem[]; label: string; children?: ReactNode; eyebrow?: string }) {
  return (
    <div className="bg-[linear-gradient(to_bottom,#62d8ba,#a7e9d8_55%,#f3fcfa_80%)]">
      <section aria-labelledby={id} className="pb-14 pt-10 md:pb-20">
        <PageContainer>
          {eyebrow && <Eyebrow className="!text-white">{eyebrow}</Eyebrow>}
          <h2 id={id} className={`${eyebrow ? "mt-5" : ""} tracking-normal font-display text-[37px] font-bold italic leading-[1.15] text-white md:text-[42px] lg:text-[54px]`}>{title}</h2>
          <div className="mt-6 md:max-w-2xl lg:max-w-3xl"><FaqList label={label} items={items} tone="glass" /></div>
        </PageContainer>
      </section>
      {children}
    </div>
  );
}

export function BerryClosing({ id, title, description, cta }: { id: string; title: TitleLines; description: string; cta: Cta }) {
  return (
    <section aria-labelledby={id} className="px-6 pb-14 md:px-8 md:pb-24">
      <div className="mx-auto max-w-7xl rounded-3xl bg-berry p-5 md:max-w-2xl md:p-10 lg:max-w-4xl lg:p-14">
        <h2 id={id} className="tracking-normal font-display font-bold italic text-white">
          <span className="block text-[27px] leading-[1.3] lg:text-4xl">{title[0]}</span>
          <span className="block text-[34px] leading-[1.15] lg:text-5xl">{title[1]}</span>
        </h2>
        <p className="mt-4 text-base font-semibold leading-6 text-white lg:text-lg lg:leading-8">{description}</p>
        <ArrowLink to={cta.to} variant="white" className="mt-6">{cta.label}</ArrowLink>
      </div>
    </section>
  );
}

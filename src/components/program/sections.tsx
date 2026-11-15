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
      <span className="block text-[31px] leading-[1.25] md:text-[34px]">{lines[0]}</span>
      <span className="block text-[37px] leading-[1.15] md:text-[42px]">{lines[1]}</span>
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, description, tone = "dark", id, descriptionClass = "" }: { eyebrow?: string; title: TitleLines | string; description?: string; tone?: "dark" | "light"; id: string; descriptionClass?: string }) {
  const light = tone === "light";
  return (
    <header className="md:max-w-2xl">
      {eyebrow && <Eyebrow className={light ? "!text-white" : ""}>{eyebrow}</Eyebrow>}
      <div className={eyebrow ? "mt-4" : ""}>
        {typeof title === "string" ? (
          <h2 id={id} className={`tracking-normal font-display text-[37px] font-bold italic leading-[1.15] md:text-[42px] ${light ? "text-white" : "text-forest"}`}>{title}</h2>
        ) : (
          <TwoLineTitle lines={title} tone={tone} id={id} />
        )}
      </div>
      {description && <p className={`-mr-2.5 mt-4 text-base font-semibold leading-6 md:mr-0 md:text-lg ${light ? "text-white" : "text-forest/80"} ${descriptionClass}`}>{description}</p>}
    </header>
  );
}

export function ProgramHero({ eyebrow, name, logo, logoAlt, logoWidth = 91, title, description, cta, backTo, photo }: {
  eyebrow?: string;
  name: string;
  logo?: string;
  logoAlt?: string;
  logoWidth?: number;
  title: TitleLines;
  description: string;
  cta: Cta;
  backTo: string;
  photo?: { src: string; alt: string; caption: string };
}) {
  return (
    <section aria-labelledby="program-title" className="pb-3 pt-[29px] md:pb-16">
      <PageContainer>
        <BackLink to={backTo}>Kembali ke Program</BackLink>
        <div className="mt-10 md:grid md:grid-cols-2 md:items-center md:gap-12">
          <div>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <div className={`${eyebrow ? "mt-4" : ""} flex items-center justify-between gap-3`}>
              <p className="tracking-normal font-brand text-[34px] leading-none text-forest">{name}</p>
              {logo && <img src={logo} alt={logoAlt ?? ""} style={{ width: logoWidth }} className="shrink-0" />}
            </div>
            <h1 id="program-title" className="mt-4 tracking-normal font-display font-bold italic text-forest">
              <span className="block text-[31px] leading-[1.25] md:text-4xl">{title[0]}</span>
              <span className="block text-[43px] leading-[1.1] md:text-[56px]">{title[1]}</span>
            </h1>
            <p className="-mr-2.5 mt-3 text-base font-bold leading-6 text-forest md:mr-0 md:text-lg">{description}</p>
            <ArrowLink to={cta.to} variant="berry" className="mt-6 md:w-auto">{cta.label}</ArrowLink>
          </div>
          {photo && (
            <figure className="mx-auto mt-8 max-w-[273px] md:mt-0">
              <div className="bg-white p-2 pb-2 shadow-lg">
                <img src={photo.src} alt={photo.alt} className="block aspect-[4/3] w-full object-cover" />
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
export function CardStack({ items, compact = false, className = "", icons }: { items: CardItem[]; compact?: boolean; className?: string; icons?: ReactNode[] }) {
  return (
    <ul className={`flex flex-col gap-4 md:grid md:grid-cols-3 ${className}`}>
      {items.map((item, index) => (
        <li key={item.title} className={`rounded-2xl bg-white px-5 text-forest ${compact ? "py-[18px]" : "py-[18px]"}`}>
          <div className="flex items-center gap-4">
            {icons?.[index]}
            <h3 className={`font-ui font-semibold leading-tight ${compact ? "text-[15px] font-bold" : "text-[17px]"}`}>{item.title}</h3>
          </div>
          <p className={`font-semibold ${compact ? "mt-2.5 text-[15px] leading-[23px]" : "mt-3 text-base leading-6"}`}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

export function Note({ children, tone = "dark", className = "" }: { children: ReactNode; tone?: "dark" | "light"; className?: string }) {
  return <p className={`-mr-2.5 text-sm font-semibold leading-[22px] md:mr-0 md:max-w-2xl ${tone === "light" ? "text-white" : "text-forest"} ${className}`}>{children}</p>;
}

// "ASPEK 01" style numbered text blocks on a white background.
export function LabeledList({ label, items, serifTitle = true }: { label: string; items: CardItem[]; serifTitle?: boolean }) {
  return (
    <ol className="flex flex-col gap-14 px-5 md:grid md:grid-cols-2 md:px-0">
      {items.map((item, index) => (
        <li key={item.title}>
          <p className="font-ui text-[11px] font-bold uppercase text-forest">{label} {String(index + 1).padStart(2, "0")}</p>
          <h3 className={`mt-3 tracking-normal text-[24px] leading-tight text-forest ${serifTitle ? "font-display font-bold" : "font-sub font-semibold"}`}>{item.title}</h3>
          <p className="mt-6 text-base font-semibold leading-6 text-forest">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function CheckList({ items, className = "" }: { items: (string | CardItem)[]; className?: string }) {
  return (
    <ul className={`flex flex-col gap-6 ${className}`}>
      {items.map((item) => {
        const entry = typeof item === "string" ? { title: item, text: "" } : item;
        return (
          <li key={entry.title} className="flex items-start gap-3">
            <Check size={16} aria-hidden="true" className="mt-1 shrink-0 text-teal-deep" />
            <div>
              {entry.text ? (
                <>
                  <h3 className="text-base font-bold leading-6 text-forest">{entry.title}</h3>
                  <p className="mt-2 text-[15px] font-semibold leading-6 text-forest/80">{entry.text}</p>
                </>
              ) : (
                <p className="text-base font-bold leading-6 text-forest">{entry.title}</p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function Timeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative flex max-w-xl flex-col gap-8">
      <span aria-hidden="true" className="absolute bottom-6 left-5 top-6 w-px bg-sage" />
      {steps.map((step) => (
        <li key={step.title} className="relative flex items-start gap-4">
          <StepBadge number={step.number} tone={step.tone === "rose" ? "rose" : "teal"} className={step.tone === "rose" ? "" : "!bg-teal-deep"} />
          <div className="pt-0.5">
            <h3 className="font-ui text-[17px] font-bold leading-tight text-forest">{step.title}</h3>
            <p className="mt-2 text-[15px] font-semibold leading-6 text-forest/80">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Polaroid({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="mx-auto mt-6 max-w-[246px] md:max-w-[320px]">
      <img src={src} alt={alt} className="block aspect-[4/3] w-full object-cover" />
      <figcaption className="mt-3 text-center font-display text-xl font-bold text-black">{caption}</figcaption>
    </figure>
  );
}

export type CaseData = { badge: string; name: string; question: string; focus: string; disclaimer: string; cta: Cta };

export function CaseCard({ data, icon }: { data: CaseData; icon: string }) {
  return (
    <div className="mt-6 rounded-3xl bg-white p-5 md:max-w-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-block rounded-md bg-sun px-2.5 py-1 text-[11px] font-bold uppercase text-black">{data.badge}</span>
          <h3 className="mt-4 tracking-normal font-display text-[22px] font-bold text-forest">{data.name}</h3>
        </div>
        <img src={icon} alt="" aria-hidden="true" className="w-[69px] shrink-0" />
      </div>
      <p className="mt-4 text-base font-bold leading-6 text-forest">{data.question}</p>
      <p className="mt-4 text-[15px] font-bold leading-6 text-forest">{data.focus}</p>
      <p className="mt-4 text-[13px] font-semibold leading-5 text-forest">{data.disclaimer}</p>
      <ArrowLink to={data.cta.to} variant="outline" className="mt-6">{data.cta.label}</ArrowLink>
    </div>
  );
}

// FAQ on the mint gradient; the closing card (children) sits on the lighter end of the same gradient.
export function FaqSection({ id, title, items, label, children }: { id: string; title: string; items: FaqItem[]; label: string; children?: ReactNode }) {
  return (
    <div className="bg-[linear-gradient(to_bottom,#62d8ba,#a7e9d8_55%,#f3fcfa_80%)]">
      <section aria-labelledby={id} className="pb-14 pt-10 md:pb-20">
        <PageContainer>
          <Eyebrow className="!text-white">Pertanyaan umum</Eyebrow>
          <h2 id={id} className="mt-5 tracking-normal font-display text-[37px] font-bold italic leading-[1.15] text-white md:text-[42px]">{title}</h2>
          <div className="mt-6 md:max-w-2xl"><FaqList label={label} items={items} tone="glass" /></div>
        </PageContainer>
      </section>
      {children}
    </div>
  );
}

export function BerryClosing({ id, title, description, cta }: { id: string; title: TitleLines; description: string; cta: Cta }) {
  return (
    <section aria-labelledby={id} className="px-6 pb-14 md:px-8 md:pb-24">
      <div className="mx-auto max-w-7xl rounded-3xl bg-berry p-5 md:max-w-2xl md:p-10">
        <h2 id={id} className="tracking-normal font-display font-bold italic text-white">
          <span className="block text-[27px] leading-[1.3]">{title[0]}</span>
          <span className="block text-[34px] leading-[1.15]">{title[1]}</span>
        </h2>
        <p className="mt-4 text-base font-semibold leading-6 text-white">{description}</p>
        <ArrowLink to={cta.to} variant="white" className="mt-6">{cta.label}</ArrowLink>
      </div>
    </section>
  );
}

import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Camera, ChevronLeft, Minus, Plus } from "lucide-react";
import { buttonStyles, type ButtonStyleOptions } from "../UI/button-styles";

// Shared building blocks for the inner pages (Learn, Apply, Grow, Tentang, Assessment, program detail).
// Geometry follows the Figma mobile frames: 342px content column, 24px gutters, 16px card radius.

export function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-6 md:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`font-ui text-[11px] font-semibold uppercase tracking-wide text-forest ${className}`}>{children}</p>;
}

export function DisplayTitle({ children, as: Tag = "h2", className = "" }: { children: ReactNode; as?: "h1" | "h2" | "h3"; className?: string }) {
  return <Tag className={`font-display text-[28px] font-bold leading-[1.1] text-forest md:text-[40px] ${className}`}>{children}</Tag>;
}

export function BackLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-teal-deep">
      <ChevronLeft size={16} aria-hidden="true" />
      {children}
    </Link>
  );
}

export function ArrowLink({ to, children, variant = "rose", size = "lg", className = "", fullWidth = true }: { to: string; children: ReactNode; className?: string } & Pick<ButtonStyleOptions, "variant" | "size" | "fullWidth">) {
  return (
    <Link to={to} className={buttonStyles({ variant, size, fullWidth, className: `text-[15px] ${className}` })}>
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

// Full-width action row with the arrow pinned to the right edge (Tentang / Assessment / Explore pages).
export function ActionRow({ to, children, tone = "rose" }: { to: string; children: ReactNode; tone?: "rose" | "mint" }) {
  const tones = { rose: "bg-rose text-white hover:bg-rose-hover", mint: "bg-mint text-forest hover:bg-sage" };
  return (
    <Link to={to} className={`flex min-h-[52px] items-center justify-between rounded-xl px-4 text-[15px] font-semibold transition-colors duration-150 ${tones[tone]}`}>
      <span>{children}</span>
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  );
}

export function PhotoFrame({ src, alt, caption, className = "" }: { src?: string; alt: string; caption: string; className?: string }) {
  return (
    <figure className={`overflow-hidden rounded-2xl bg-brand-green ${className}`}>
      <div className="aspect-[342/178] w-full bg-sage">
        {src ? (
          <img src={src} alt={alt} className="block h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-forest/70">
            <Camera size={18} aria-hidden="true" />
            <span className="text-xs">Frame foto dokumentasi • 16:10</span>
          </div>
        )}
      </div>
      <figcaption className="px-4 py-2.5 text-xs font-semibold text-white">{caption}</figcaption>
    </figure>
  );
}

export type FaqItem = { question: string; answer: string };

export function FaqList({ items, label, tone = "mint" }: { items: FaqItem[]; label: string; tone?: "mint" | "glass" }) {
  const [open, setOpen] = useState(0);
  return (
    <ul aria-label={label} className="flex flex-col gap-4">
      {items.map((item, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${index}`;
        return (
          <li key={item.question} className={`rounded-2xl border ${tone === "glass" ? (expanded ? "border-transparent bg-white" : "border-white/40 bg-white/70") : expanded ? "border-transparent bg-mint" : "border-line/60 bg-white"}`}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? -1 : index)}
                className="flex w-full items-start justify-between gap-4 px-4 py-5 text-left text-base font-semibold leading-snug text-forest"
              >
                {item.question}
                {expanded ? <Minus size={16} aria-hidden="true" className="mt-1 shrink-0" /> : <Plus size={16} aria-hidden="true" className="mt-1 shrink-0" />}
              </button>
            </h3>
            {expanded && <p id={panelId} className="px-4 pb-5 text-[15px] leading-snug text-forest/80">{item.answer}</p>}
          </li>
        );
      })}
    </ul>
  );
}

export function ClosingCta({ title, description, cta }: { title: ReactNode; description: string; cta: { label: string; to: string } }) {
  return (
    <section aria-label="Ajakan bertindak" className="rounded-2xl bg-mint p-5 md:p-10">
      <h2 className="font-display text-[28px] font-bold leading-[1.1] text-forest md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-snug text-forest/80">{description}</p>
      <ArrowLink to={cta.to} className="mt-7">{cta.label}</ArrowLink>
    </section>
  );
}

export type Step = { number: string; title: string; description: string; tone: "blue" | "teal" | "rose" | "paper" | "sun" };

const stepTones: Record<Step["tone"], string> = {
  blue: "bg-brand-blue text-white",
  teal: "bg-brand-green text-white",
  rose: "bg-rose text-white",
  paper: "bg-paper text-forest",
  sun: "bg-sun/60 text-forest",
};

export function StepBadge({ number, tone }: Pick<Step, "number" | "tone">) {
  return <span className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${stepTones[tone]}`}>{number}</span>;
}

export function StepTimeline({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative flex flex-col gap-10">
      <span aria-hidden="true" className="absolute bottom-5 left-5 top-5 w-px bg-sage" />
      {steps.map((step) => (
        <li key={step.title} className="relative flex items-start gap-4">
          <StepBadge number={step.number} tone={step.tone} />
          <div className="pt-1">
            <h3 className="font-sub text-lg font-semibold text-forest">{step.title}</h3>
            <p className="mt-1 text-[15px] leading-snug text-forest/80">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

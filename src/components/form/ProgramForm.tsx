import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Info } from "lucide-react";
import { buttonStyles } from "../UI/button-styles";
import { BackLink, Eyebrow, PageContainer } from "../content/blocks";
import type { Answers, Field, FormConfig, FormStep, TextareaField, TextField } from "./types";

// Config-driven multi-step form (see ./types.ts). Mobile-first, one column; desktop keeps a centred 2xl column.

const inputBase = "block w-full rounded-xl border border-line/70 bg-white px-4 text-sm font-semibold text-forest placeholder:text-forest focus:border-brand-blue";

const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);
const asText = (value: Answers[string] | undefined) => (typeof value === "string" ? value : "");
const asList = (value: Answers[string] | undefined) => (Array.isArray(value) ? value : []);

function flatten(fields: Field[]): Exclude<Field, { type: "group" }>[] {
  return fields.flatMap((field) => (field.type === "group" ? field.fields : [field]));
}

function resolveText(field: TextField, answers: Answers) {
  const variant = field.dynamic ? field.dynamic.map[asText(answers[field.dynamic.by])] : undefined;
  return { label: variant?.label ?? field.label, placeholder: variant?.placeholder ?? field.placeholder, inputMode: variant?.inputMode ?? field.inputMode };
}

function isAnswered(field: Field, answers: Answers): boolean {
  const value = answers[field.id];
  if (field.type === "checkboxes") return asList(value).length > 0;
  if (field.type === "consent") return value === "yes";
  if (field.type === "perSelection") return asText(answers[`${field.id}.0`]).trim() !== "";
  return asText(value).trim() !== "";
}

function isRequired(field: Field) {
  return Boolean(field.required);
}

// Returns an error message per field id (perSelection uses `${id}.0` / `${id}.1`).
function validate(fields: Field[], answers: Answers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of flatten(fields)) {
    if (field.type === "perSelection") {
      const selected = asList(answers[field.from]).length;
      if (isRequired(field) && !asText(answers[`${field.id}.0`]).trim()) errors[`${field.id}.0`] = "Wajib diisi.";
      if (selected >= 2 && !asText(answers[`${field.id}.1`]).trim()) errors[`${field.id}.1`] = "Wajib diisi.";
      continue;
    }
    if (field.type === "consent") {
      if (isRequired(field) && !isAnswered(field, answers)) errors[field.id] = "Centang untuk melanjutkan.";
      continue;
    }
    if (isRequired(field) && !isAnswered(field, answers)) {
      errors[field.id] = field.type === "checkboxes" ? "Pilih minimal satu." : "Wajib diisi.";
      continue;
    }
    const text = asText(answers[field.id]).trim();
    if (field.type === "textarea" && field.maxWords && countWords(text) > field.maxWords) errors[field.id] = `Maksimal ${field.maxWords} kata.`;
    if (field.type === "text" && text) {
      const mode = resolveText(field, answers).inputMode;
      if (mode === "email" && !/^\S+@\S+\.\S+$/.test(text)) errors[field.id] = "Tulis alamat email yang valid.";
      if (mode === "tel" && !/^[+0-9][0-9\s-]{7,}$/.test(text)) errors[field.id] = "Tulis nomor WhatsApp yang valid.";
      if (mode === "url" && !/^https?:\/\/\S+$/.test(text)) errors[field.id] = "Tulis tautan lengkap, diawali https://.";
    }
  }
  return errors;
}

function FieldBlock({ id, label, required, hint, error, children, as = "label" }: { id: string; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode; as?: "label" | "legend" }) {
  const text = (
    <>
      {label}
      {required ? " *" : ""}
    </>
  );
  const labelClass = "block text-base font-semibold leading-6 text-forest";
  return (
    <div className="mt-[26px]">
      {as === "legend" ? <legend className={`${labelClass} float-left w-full`}>{text}</legend> : <label htmlFor={id} className={labelClass}>{text}</label>}
      {hint && <p id={`${id}-hint`} className="mt-2 clear-both text-[13px] font-semibold leading-5 text-forest/80">{hint}</p>}
      <div className="clear-both mt-4">{children}</div>
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] font-semibold text-berry">{error}</p>}
    </div>
  );
}

function TextInput({ field, answers, set, error }: { field: TextField; answers: Answers; set: (id: string, value: string) => void; error?: string }) {
  const uid = useId();
  const { label, placeholder, inputMode } = resolveText(field, answers);
  const id = `${uid}-${field.id}`;
  return (
    <FieldBlock id={id} label={label} required={isRequired(field)} hint={field.hint} error={error}>
      <input
        id={id}
        name={field.id}
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        placeholder={placeholder}
        value={asText(answers[field.id])}
        onChange={(event) => set(field.id, event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={[field.hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        data-field={field.id}
        className={`${inputBase} h-[52px] ${error ? "!border-berry" : ""}`}
      />
    </FieldBlock>
  );
}

function Textarea({ field, answers, set, error, sub = false, valueKey, label }: { field: TextareaField; answers: Answers; set: (id: string, value: string) => void; error?: string; sub?: boolean; valueKey?: string; label?: string }) {
  const uid = useId();
  const key = valueKey ?? field.id;
  const id = `${uid}-${key}`;
  const value = asText(answers[key]);
  const words = countWords(value);
  const textarea = (
    <>
      <textarea
        id={id}
        name={key}
        rows={4}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => set(key, event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={[field.hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        data-field={key}
        className={`${inputBase} min-h-[124px] resize-y py-4 leading-5 ${error ? "!border-berry" : ""}`}
      />
      {field.maxWords && <p className={`mt-2 text-right text-xs font-semibold ${words > field.maxWords ? "text-berry" : "text-forest"}`}>{words} / {field.maxWords} kata</p>}
    </>
  );
  if (sub) {
    return (
      <div className="mt-6">
        <label htmlFor={id} className="block text-sm font-semibold text-forest">{label ?? field.label}{field.required ? " *" : ""}</label>
        <div className="mt-3">{textarea}</div>
        {error && <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] font-semibold text-berry">{error}</p>}
      </div>
    );
  }
  return (
    <FieldBlock id={id} label={label ?? field.label} required={isRequired(field)} hint={field.hint} error={error}>{textarea}</FieldBlock>
  );
}

const optionClass = "flex min-h-[54px] cursor-pointer items-center gap-3 rounded-xl border border-line/70 bg-white px-4 py-3 text-[15px] font-semibold text-forest has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60";

function FieldView({ field, answers, set, errors }: { field: Field; answers: Answers; set: (id: string, value: string | string[]) => void; errors: Record<string, string> }) {
  const uid = useId();
  const setText = (id: string, value: string) => set(id, value);
  switch (field.type) {
    case "text":
      return <TextInput field={field} answers={answers} set={setText} error={errors[field.id]} />;
    case "textarea":
      return <Textarea field={field} answers={answers} set={setText} error={errors[field.id]} />;
    case "radio": {
      const current = asText(answers[field.id]) || field.defaultValue || "";
      return (
        <fieldset data-field={field.id}>
          <FieldBlock id={`${uid}-${field.id}`} as="legend" label={field.label} required={isRequired(field)} hint={field.hint} error={errors[field.id]}>
            <div className="flex flex-col gap-3">
              {field.options.map((option) => (
                <label key={option.value} className={optionClass}>
                  <input type="radio" name={field.id} value={option.value} checked={current === option.value} onChange={() => set(field.id, option.value)} className="size-5 accent-brand-green" />
                  {option.label}
                </label>
              ))}
            </div>
          </FieldBlock>
        </fieldset>
      );
    }
    case "checkboxes": {
      const selected = asList(answers[field.id]);
      const hint = field.max ? `Pilih maksimal ${field.max === 2 ? "dua" : field.max}. ${selected.length} dari ${field.max} pilihan dipilih.` : field.hint;
      return (
        <fieldset data-field={field.id}>
          <FieldBlock id={`${uid}-${field.id}`} as="legend" label={field.label} required={isRequired(field)} hint={hint} error={errors[field.id]}>
            <div className="flex flex-col gap-3">
              {field.options.map((option) => {
                const checked = selected.includes(option);
                const locked = !checked && field.max !== undefined && selected.length >= field.max;
                return (
                  <label key={option} className={optionClass}>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={locked}
                      onChange={() => set(field.id, checked ? selected.filter((item) => item !== option) : [...selected, option])}
                      className="size-5 accent-brand-green"
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </FieldBlock>
        </fieldset>
      );
    }
    case "perSelection": {
      const selected = asList(answers[field.from]);
      const base: TextareaField = { id: field.id, type: "textarea", label: "", placeholder: field.placeholder };
      return (
        <fieldset data-field={`${field.id}.0`}>
          <FieldBlock id={`${uid}-${field.id}`} as="legend" label={field.label} required={isRequired(field)} hint={field.hint}>
            <Textarea sub field={{ ...base, required: true }} valueKey={`${field.id}.0`} label={selected[0] ? `${field.labels[0]}: ${selected[0]}` : field.labels[0]} answers={answers} set={setText} error={errors[`${field.id}.0`]} />
            <Textarea sub field={{ ...base, required: selected.length >= 2 }} valueKey={`${field.id}.1`} label={selected[1] ? `${field.labels[1].replace(" (jika dipilih)", "")}: ${selected[1]}` : field.labels[1]} answers={answers} set={setText} error={errors[`${field.id}.1`]} />
          </FieldBlock>
        </fieldset>
      );
    }
    case "consent": {
      const id = `${uid}-${field.id}`;
      return (
        <div className="mt-8" data-field={field.id}>
          <p className="text-base font-semibold leading-6 text-forest">{field.label}{isRequired(field) ? " *" : ""}</p>
          <label htmlFor={id} className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-line/70 bg-white p-4 text-[15px] font-semibold leading-[23px] text-forest has-[:checked]:border-brand-green">
            <input id={id} type="checkbox" checked={answers[field.id] === "yes"} onChange={(event) => set(field.id, event.target.checked ? "yes" : "")} aria-invalid={errors[field.id] ? true : undefined} className="mt-1 size-5 shrink-0 accent-brand-green" />
            {field.text}
          </label>
          {errors[field.id] && <p role="alert" className="mt-2 text-[13px] font-semibold text-berry">{errors[field.id]}</p>}
        </div>
      );
    }
    case "group": {
      return (
        <fieldset className="mt-8" data-field={field.id}>
          <legend className="text-base font-semibold leading-6 text-forest">{field.label}{isRequired(field) ? " *" : ""}</legend>
          {field.hint && <p className="mt-2 text-[13px] font-semibold text-forest/80">{field.hint}</p>}
          {field.fields.map((sub) =>
            sub.type === "text" ? (
              <SubText key={sub.id} field={sub} answers={answers} set={setText} error={errors[sub.id]} />
            ) : (
              <Textarea key={sub.id} sub field={sub} answers={answers} set={setText} error={errors[sub.id]} />
            ),
          )}
        </fieldset>
      );
    }
  }
}

function SubText({ field, answers, set, error }: { field: TextField; answers: Answers; set: (id: string, value: string) => void; error?: string }) {
  const id = useId();
  return (
    <div className="mt-6">
      <label htmlFor={id} className="block text-sm font-semibold text-forest">{field.label}{field.required ? " *" : ""}</label>
      <input id={id} name={field.id} data-field={field.id} type="text" placeholder={field.placeholder} value={asText(answers[field.id])} onChange={(event) => set(field.id, event.target.value)} aria-invalid={error ? true : undefined} className={`${inputBase} mt-3 h-[52px] ${error ? "!border-berry" : ""}`} />
      {error && <p role="alert" className="mt-2 text-[13px] font-semibold text-berry">{error}</p>}
    </div>
  );
}

function Progress({ labels, current }: { labels: string[]; current: number }) {
  return (
    <div className="mt-6">
      <p className="font-ui text-[11px] font-bold uppercase text-forest">Langkah {current + 1} dari {labels.length}</p>
      <ol className="mt-5 grid grid-cols-5 gap-2">
        {labels.map((label, index) => (
          <li key={label} aria-current={index === current ? "step" : undefined}>
            <span aria-hidden="true" className={`block h-1 rounded-full ${index <= current ? "bg-brand-green" : "bg-sage"}`} />
            <span className={`mt-3 block text-[10px] leading-none text-forest ${index === current ? "font-bold" : "font-semibold"}`}>{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function ProgramForm({ config }: { config: FormConfig }) {
  const [stage, setStage] = useState(0); // 0..steps-1 fields, steps = review, steps+1 = done
  const [answers, setAnswers] = useState<Answers>(() => {
    const initial: Answers = {};
    for (const step of config.steps) for (const field of flatten(step.fields)) if (field.type === "radio" && field.defaultValue) initial[field.id] = field.defaultValue;
    return initial;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const reviewIndex = config.steps.length;
  const doneIndex = reviewIndex + 1;
  const labels = useMemo(() => [...config.steps.map((step) => step.label), "Tinjau"], [config.steps]);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    heading.current?.focus();
  }, [stage]);

  const set = (id: string, value: string | string[]) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      // Keep per-selection answers aligned with the chosen options.
      if (Array.isArray(value)) for (const step of config.steps) for (const field of flatten(step.fields)) if (field.type === "perSelection" && field.from === id && value.length < 2) next[`${field.id}.1`] = "";
      return next;
    });
    setErrors((prev) => {
      if (!(id in prev) && !Object.keys(prev).some((key) => key.startsWith(`${id}.`))) return prev;
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const stepAt = (index: number): FormStep | undefined => config.steps[index];
  const allErrors = useMemo(() => config.steps.map((step) => validate(step.fields, answers)), [config.steps, answers]);
  const missing = allErrors.some((stepErrors) => Object.keys(stepErrors).length > 0);

  const goNext = () => {
    const step = stepAt(stage);
    if (!step) return;
    const found = validate(step.fields, answers);
    setErrors(found);
    const key = Object.keys(found)[0];
    if (key) {
      const target = document.querySelector<HTMLElement>(`[data-field="${key}"] input, [data-field="${key}"] textarea, [data-field="${key}"]`);
      target?.scrollIntoView({ block: "center" });
      (target?.matches("input,textarea") ? target : target?.querySelector<HTMLElement>("input,textarea"))?.focus({ preventScroll: true });
      return;
    }
    setStage(stage + 1);
  };

  const filled = (fieldIds: string[], optional?: boolean) => {
    const fields = config.steps.flatMap((step) => flatten(step.fields)).filter((field) => fieldIds.includes(field.id));
    const required = fields.filter(isRequired);
    if (optional || required.length === 0) return fields.some((field) => isAnswered(field, answers) && !(field.type === "radio"));
    return required.every((field) => isAnswered(field, answers)) && !fields.some((field) => field.type === "perSelection" && asList(answers[field.from]).length >= 2 && !asText(answers[`${field.id}.1`]).trim());
  };

  const head = stage === reviewIndex ? { title: config.review.title as string | [string, string], description: config.review.description } : stage === doneIndex ? { title: config.done.title as string | [string, string], description: config.done.description } : stepAt(stage)!;
  const title = Array.isArray(head.title) ? head.title : [head.title];
  const prevLabel = stage === 0 ? config.backLabel : `Kembali ke ${labels[stage - 1]}`;
  const onFooterNote = "Periksa jawaban sebelum melanjutkan. Tombol Kembali mempertahankan isian selama formulir terbuka.";

  return (
    <main className={`${stage === doneIndex ? "bg-white" : "bg-[#f3faf8]"} pb-12 pt-[33px] tracking-[0.02em] md:pb-20`}>
      <PageContainer className="md:max-w-2xl">
        <BackLink to={config.backTo}>{config.backLabel}</BackLink>
        <Eyebrow className="mt-5">{config.eyebrow}</Eyebrow>
        <p className="mt-5 font-brand text-[30px] leading-none tracking-normal text-forest">{config.programName}</p>
        <h1 ref={heading} tabIndex={-1} className="mt-5 font-display font-bold italic leading-[1.1] tracking-normal text-forest focus:outline-none">
          {title.length === 2 ? (
            <>
              <span className="block text-[31px]">{title[0]}</span>
              <span className="block text-[43px]">{title[1]}</span>
            </>
          ) : (
            <span className="block text-[43px]">{title[0]}</span>
          )}
        </h1>
        <p className="mt-3 text-base font-semibold leading-6 text-forest">{head.description}</p>

        {stage < doneIndex && <Progress labels={labels} current={stage} />}
        {stage < doneIndex && <p className="mt-8 text-[13px] font-semibold text-forest">Tanda * menunjukkan pertanyaan wajib.</p>}

        {stage < reviewIndex && (
          <form noValidate onSubmit={(event) => { event.preventDefault(); goNext(); }}>
            {stepAt(stage)!.fields.map((field) => <FieldView key={field.id} field={field} answers={answers} set={set} errors={errors} />)}
            <div className="mt-10 flex flex-col gap-3">
              <button type="submit" className={buttonStyles({ variant: "berry", size: "lg", fullWidth: true, className: "text-[15px]" })}>
                {stepAt(stage)!.nextLabel ?? "Lanjut"}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
              {stage === 0 ? (
                <Link to={config.backTo} className={buttonStyles({ variant: "outline", size: "lg", fullWidth: true, className: "text-[15px]" })}>
                  {prevLabel}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              ) : (
                <button type="button" onClick={() => setStage(stage - 1)} className={buttonStyles({ variant: "outline", size: "lg", fullWidth: true, className: "text-[15px]" })}>
                  {prevLabel}
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
            </div>
            <p className="mt-4 text-[13px] font-semibold leading-5 text-forest">{onFooterNote}</p>
          </form>
        )}

        {stage === reviewIndex && (
          <div>
            {missing && (
              <div role="status" className="mt-6 flex gap-3 rounded-2xl bg-white p-5 text-forest">
                <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-blue" />
                <div>
                  <p className="text-[13px] font-bold">Jawaban belum lengkap</p>
                  <p className="mt-2 text-[13px] font-semibold leading-5">Masih ada jawaban wajib yang belum diisi. Pilih Ubah jawaban untuk melengkapi sebelum menyelesaikan.</p>
                </div>
              </div>
            )}
            <div className="mt-6 flex flex-col gap-4">
              {config.review.sections.map((section) => (
                <section key={section.title} aria-label={section.title} className="rounded-2xl bg-white p-5 text-forest">
                  <h2 className="font-ui text-[19px] font-semibold leading-tight">{section.title}</h2>
                  <ul className="mt-4 flex flex-col gap-3 text-[15px] font-semibold leading-6">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        {item.code ? `${item.code} ` : ""}{item.label}: {filled(item.fields, item.optional) ? "terisi" : "belum diisi"}{item.optional ? " (opsional)" : ""}.
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => setStage(section.step)} className="mt-5 text-sm font-bold text-teal-deep underline-offset-2 hover:underline">
                    Ubah jawaban<span className="sr-only"> {section.title}</span>
                  </button>
                </section>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                aria-disabled={missing}
                onClick={() => { if (!missing) setStage(doneIndex); }}
                className={buttonStyles({ variant: missing ? "outline" : "berry", size: "lg", fullWidth: true, className: `text-[15px] ${missing ? "!cursor-not-allowed !border-transparent !bg-mist !text-forest/70" : ""}` })}
              >
                {config.review.finishLabel}
              </button>
              <button type="button" onClick={() => setStage(stage - 1)} className={buttonStyles({ variant: "outline", size: "lg", fullWidth: true, className: "text-[15px]" })}>
                {prevLabel}
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            </div>
            <p className="mt-4 text-[13px] font-semibold leading-5 text-forest">{onFooterNote}</p>
          </div>
        )}

        {stage === doneIndex && (
          <div className="mt-8 flex flex-col gap-3 md:max-w-md">
            <Link to={config.backTo} className={buttonStyles({ variant: "berry", size: "lg", fullWidth: true, className: "text-[15px]" })}>
              {config.done.backLabel}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to={config.done.exploreTo} className={buttonStyles({ variant: "outline", size: "lg", fullWidth: true, className: "text-[15px]" })}>
              {config.done.exploreLabel}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </PageContainer>
    </main>
  );
}

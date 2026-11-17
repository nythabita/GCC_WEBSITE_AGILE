import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight, Info } from "lucide-react";
import { buttonStyles } from "../UI/button-styles";
import { BackLink, Eyebrow, PageContainer } from "../content/blocks";
import type { Answers, CheckboxesField, Field, FormConfig, FormStep, MatrixField, TextareaField, TextField } from "./types";
import { useAuth } from "../../auth/AuthContext";
import { isProgramSlug, validateAnswers, normalizeAnswers } from "../../../shared/forms";
import type { ApplicationReceipt } from "../../lib/gcc-api";

// Config-driven multi-step form (see ./types.ts). Mobile-first, one column; desktop keeps a centred 2xl column.

const inputBase = "block w-full rounded-xl border border-line/70 bg-white px-4 text-sm font-semibold text-forest placeholder:text-forest focus:border-brand-blue disabled:opacity-60";
const optionClass = "flex min-h-[54px] cursor-pointer items-center gap-3 rounded-xl border border-line/70 bg-white px-4 py-3 text-[15px] font-semibold leading-[23px] text-forest has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60";
const numberWords: Record<number, string> = { 1: "satu", 2: "dua", 3: "tiga", 4: "empat" };

type Flat = Exclude<Field, { type: "group" }>;
type SetValue = (id: string, value: string | string[]) => void;

const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);
const asText = (value: Answers[string] | undefined) => (typeof value === "string" ? value : "");
const asList = (value: Answers[string] | undefined) => (Array.isArray(value) ? value : []);

function flatten(fields: Field[]): Flat[] {
  return fields.flatMap((field): Flat[] => (field.type === "group" ? field.fields : [field]));
}

function isVisible(field: Field, answers: Answers) {
  if (!field.showIf) return true;
  const value = answers[field.showIf.field];
  return Array.isArray(value) ? value.includes(field.showIf.equals) : value === field.showIf.equals;
}

function isRequired(field: Field, answers: Answers) {
  if (field.requiredWhen) return asList(answers[field.requiredWhen.field]).some((item) => item !== field.requiredWhen!.anyBut);
  return Boolean(field.required);
}

const marksRequired = (field: Field) => Boolean(field.required || field.requiredWhen);

function resolveText(field: TextField, answers: Answers) {
  const variant = field.dynamic ? field.dynamic.map[asText(answers[field.dynamic.by])] : undefined;
  return { label: variant?.label ?? field.label, placeholder: variant?.placeholder ?? field.placeholder, inputMode: variant?.inputMode ?? field.inputMode };
}

function isAnswered(field: Flat, answers: Answers): boolean {
  switch (field.type) {
    case "checkboxes": return asList(answers[field.id]).length > 0;
    case "consent": return answers[field.id] === "yes";
    case "perSelection": return asText(answers[`${field.id}.0`]).trim() !== "";
    case "matrix": return field.rows.every((_, index) => asText(answers[`${field.id}.${index}`]) !== "");
    case "note": return false;
    case "text": return asText(answers[field.id]).trim() !== "" || answers[`${field.id}.alt`] === "yes";
    default: return asText(answers[field.id]).trim() !== "";
  }
}

// Returns an error message per field id (perSelection uses `${id}.0` / `${id}.1`).
function validate(fields: Field[], answers: Answers): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const field of flatten(fields)) {
    if (field.type === "note" || !isVisible(field, answers)) continue;
    const required = isRequired(field, answers);
    if (field.type === "perSelection") {
      if (required && !asText(answers[`${field.id}.0`]).trim()) errors[`${field.id}.0`] = "Wajib diisi.";
      if (asList(answers[field.from]).length >= 2 && !asText(answers[`${field.id}.1`]).trim()) errors[`${field.id}.1`] = "Wajib diisi.";
      continue;
    }
    if (required && !isAnswered(field, answers)) {
      errors[field.id] = field.type === "consent" ? "Centang untuk melanjutkan." : field.type === "checkboxes" ? "Pilih minimal satu." : field.type === "matrix" || field.type === "radio" ? "Pilih satu jawaban." : "Wajib diisi.";
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

function FieldBlock({ id, label, required, hint, error, children, as = "label", sub = false }: { id: string; label: string; required?: boolean; hint?: string; error?: string; children: ReactNode; as?: "label" | "legend"; sub?: boolean }) {
  const text = <>{label}{required ? " *" : ""}</>;
  const labelClass = sub ? "block text-sm font-semibold leading-5 text-forest" : "block text-base font-semibold leading-6 text-forest";
  return (
    <div className={sub ? "mt-6" : "mt-[26px]"}>
      {as === "legend" ? <legend className={`${labelClass} float-left w-full`}>{text}</legend> : <label htmlFor={id} className={labelClass}>{text}</label>}
      {hint && <p id={`${id}-hint`} className="mt-3 clear-both text-[13px] font-semibold leading-5 text-forest/80">{hint}</p>}
      <div className={`clear-both ${sub ? "mt-3" : "mt-5"}`}>{children}</div>
      {error && <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] font-semibold text-berry">{error}</p>}
    </div>
  );
}

const describedBy = (id: string, hint?: string, error?: string) => [hint ? `${id}-hint` : "", error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined;

function TextInput({ field, answers, set, error, sub }: { field: TextField; answers: Answers; set: SetValue; error?: string; sub: boolean }) {
  const uid = useId();
  const { label, placeholder, inputMode } = resolveText(field, answers);
  const id = `${uid}-${field.id}`;
  const alt = answers[`${field.id}.alt`] === "yes";
  return (
    <FieldBlock id={id} label={label} required={marksRequired(field)} hint={field.hint} error={error} sub={sub}>
      <input
        id={id}
        name={field.id}
        type="text"
        inputMode={inputMode}
        autoComplete="off"
        placeholder={placeholder}
        value={asText(answers[field.id])}
        disabled={alt}
        onChange={(event) => set(field.id, event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, field.hint, error)}
        data-field={field.id}
        className={`${inputBase} h-[52px] ${error ? "!border-berry" : ""}`}
      />
      {field.alternative && (
        <label className={`${optionClass} mt-3`}>
          <input type="checkbox" checked={alt} onChange={(event) => { set(`${field.id}.alt`, event.target.checked ? "yes" : ""); if (event.target.checked) set(field.id, ""); }} className="size-5 shrink-0 accent-brand-green" />
          {field.alternative}
        </label>
      )}
    </FieldBlock>
  );
}

function Textarea({ field, answers, set, error, sub = false, valueKey, label }: { field: TextareaField; answers: Answers; set: SetValue; error?: string; sub?: boolean; valueKey?: string; label?: string }) {
  const uid = useId();
  const key = valueKey ?? field.id;
  const id = `${uid}-${key}`;
  const value = asText(answers[key]);
  const words = countWords(value);
  return (
    <FieldBlock id={id} label={label ?? field.label} required={marksRequired(field)} hint={field.hint} error={error} sub={sub}>
      <textarea
        id={id}
        name={key}
        rows={4}
        placeholder={field.placeholder}
        value={value}
        onChange={(event) => set(key, event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, field.hint, error)}
        data-field={key}
        className={`${inputBase} min-h-[124px] resize-y py-4 leading-5 ${error ? "!border-berry" : ""}`}
      />
      {field.maxWords && <p className={`mt-2 text-right text-xs font-semibold ${words > field.maxWords ? "text-berry" : "text-forest"}`}>{words} / {field.maxWords} kata</p>}
    </FieldBlock>
  );
}

function Checkboxes({ field, answers, set, error, sub }: { field: CheckboxesField; answers: Answers; set: SetValue; error?: string; sub: boolean }) {
  const uid = useId();
  const selected = asList(answers[field.id]);
  const counted = selected.filter((item) => item !== field.exclusive).length;
  const hint = field.hint ?? (field.max ? `Pilih maksimal ${numberWords[field.max] ?? field.max}. ${counted} dari ${field.max} pilihan dipilih.` : undefined);
  const toggle = (option: string, checked: boolean) => {
    if (option === field.exclusive) return set(field.id, checked ? [] : [option]);
    const rest = selected.filter((item) => item !== field.exclusive);
    set(field.id, checked ? rest.filter((item) => item !== option) : [...rest, option]);
  };
  return (
    <fieldset data-field={field.id}>
      <FieldBlock id={`${uid}-${field.id}`} as="legend" label={field.label} required={marksRequired(field)} hint={hint} error={error} sub={sub}>
        <div className="flex flex-col gap-3">
          {field.options.map((option) => {
            const checked = selected.includes(option);
            const locked = !checked && option !== field.exclusive && field.max !== undefined && counted >= field.max;
            return (
              <label key={option} className={optionClass}>
                <input type="checkbox" checked={checked} disabled={locked} onChange={() => toggle(option, checked)} className="size-5 shrink-0 accent-brand-green" />
                {option}
              </label>
            );
          })}
        </div>
      </FieldBlock>
    </fieldset>
  );
}

function Matrix({ field, answers, set, error }: { field: MatrixField; answers: Answers; set: SetValue; error?: string }) {
  const uid = useId();
  return (
    <fieldset data-field={field.id}>
      <FieldBlock id={`${uid}-${field.id}`} as="legend" label={field.label} required={marksRequired(field)} hint={field.hint} error={error}>
        <div className="flex flex-col gap-8">
          {field.rows.map((row, index) => (
            <fieldset key={row}>
              <legend className="text-[18px] font-semibold leading-6 text-forest">{row}</legend>
              <div className="mt-4 flex flex-col gap-3">
                {field.options.map((option) => (
                  <label key={option} className={optionClass}>
                    <input type="radio" name={`${field.id}.${index}`} checked={asText(answers[`${field.id}.${index}`]) === option} onChange={() => set(`${field.id}.${index}`, option)} className="size-5 shrink-0 accent-brand-green" />
                    {option}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </FieldBlock>
    </fieldset>
  );
}

function InfoCard({ title, text }: { title?: string; text: string }) {
  return (
    <div role="note" className="mt-8 flex gap-3 rounded-2xl bg-white p-5 text-forest">
      <Info size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-brand-blue" />
      <div>
        {title && <p className="text-[13px] font-bold">{title}</p>}
        <p className={`${title ? "mt-2" : ""} text-[13px] font-semibold leading-5`}>{text}</p>
      </div>
    </div>
  );
}

function FieldView({ field, answers, set, errors, sub = false }: { field: Field; answers: Answers; set: SetValue; errors: Record<string, string>; sub?: boolean }) {
  const uid = useId();
  if (!isVisible(field, answers)) return null;
  switch (field.type) {
    case "text":
      return <TextInput field={field} answers={answers} set={set} error={errors[field.id]} sub={sub} />;
    case "textarea":
      return <Textarea field={field} answers={answers} set={set} error={errors[field.id]} sub={sub} />;
    case "checkboxes":
      return <Checkboxes field={field} answers={answers} set={set} error={errors[field.id]} sub={sub} />;
    case "matrix":
      return <Matrix field={field} answers={answers} set={set} error={errors[field.id]} />;
    case "note":
      return <InfoCard title={field.title} text={field.text} />;
    case "radio": {
      const current = asText(answers[field.id]) || field.defaultValue || "";
      return (
        <fieldset data-field={field.id}>
          <FieldBlock id={`${uid}-${field.id}`} as="legend" label={field.label} required={marksRequired(field)} hint={field.hint} error={errors[field.id]}>
            <div className="flex flex-col gap-3">
              {field.options.map((option) => (
                <label key={option.value} className={optionClass}>
                  <input type="radio" name={field.id} value={option.value} checked={current === option.value} onChange={() => set(field.id, option.value)} className="size-5 shrink-0 accent-brand-green" />
                  {option.label}
                </label>
              ))}
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
          <FieldBlock id={`${uid}-${field.id}`} as="legend" label={field.label} required={marksRequired(field)} hint={field.hint}>
            <Textarea sub field={{ ...base, required: true }} valueKey={`${field.id}.0`} label={selected[0] ? `${field.labels[0]}: ${selected[0]}` : field.labels[0]} answers={answers} set={set} error={errors[`${field.id}.0`]} />
            <Textarea sub field={{ ...base, required: selected.length >= 2 }} valueKey={`${field.id}.1`} label={selected[1] ? `${field.labels[1].replace(" (jika dipilih)", "")}: ${selected[1]}` : field.labels[1]} answers={answers} set={set} error={errors[`${field.id}.1`]} />
          </FieldBlock>
        </fieldset>
      );
    }
    case "consent": {
      const id = `${uid}-${field.id}`;
      return (
        <div className="mt-8" data-field={field.id}>
          <p className="text-base font-semibold leading-6 text-forest">{field.label}{marksRequired(field) ? " *" : ""}</p>
          <label htmlFor={id} className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-line/70 bg-white p-4 text-[15px] font-semibold leading-[23px] text-forest">
            <input id={id} type="checkbox" checked={answers[field.id] === "yes"} onChange={(event) => set(field.id, event.target.checked ? "yes" : "")} aria-invalid={errors[field.id] ? true : undefined} className="mt-1 size-5 shrink-0 accent-brand-green" />
            {field.text}
          </label>
          {errors[field.id] && <p role="alert" className="mt-2 text-[13px] font-semibold text-berry">{errors[field.id]}</p>}
        </div>
      );
    }
    case "group":
      return (
        <fieldset className="mt-8" data-field={field.id}>
          <legend className="text-base font-semibold leading-6 text-forest">{field.label}{marksRequired(field) ? " *" : ""}</legend>
          {field.hint && <p className="mt-2 text-[13px] font-semibold text-forest/80">{field.hint}</p>}
          {field.fields.map((item) => <FieldView key={item.id} sub field={item} answers={answers} set={set} errors={errors} />)}
        </fieldset>
      );
  }
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

const outlineButton = buttonStyles({ variant: "outline", size: "lg", fullWidth: true, className: "text-[15px]" });

export default function ProgramForm({ config }: { config: FormConfig }) {
  const { session, services } = useAuth();
  const [saved, setSaved] = useState<ApplicationReceipt | null>(null);
  const [checking, setChecking] = useState(true);
  const [requestError, setRequestError] = useState("");
  const [retry, setRetry] = useState(0);
  const [sending, setSending] = useState(false);
  const submitting = useRef(false);
  const currentOwner = useRef(session?.user.id);
  useEffect(() => { currentOwner.current = session?.user.id; return () => {currentOwner.current = undefined;}; }, [session?.user.id]);
  useEffect(() => {
    let alive = true;
    if (!session || !services || !isProgramSlug(config.slug)) return;
    void services.api.getApplication(config.slug, { userId: session.user.id, accessToken: session.access_token }).then(receipt => {
      if (alive) {setSaved(receipt);setRequestError("");}
    }).catch(() => { if (alive) setRequestError("Pengajuan sebelumnya belum dapat diperiksa. Coba lagi sebelum melanjutkan."); })
      .finally(() => { if (alive) setChecking(false); });
    return () => { alive = false; };
  }, [session, services, config.slug, retry]);
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

  const set: SetValue = (id, value) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      // Keep per-selection answers aligned with the chosen options.
      if (Array.isArray(value)) for (const step of config.steps) for (const field of flatten(step.fields)) if (field.type === "perSelection" && field.from === id) {
        const before = asList(prev[id]);
        for (const index of [0, 1]) {
          const oldIndex = before.indexOf(value[index]);
          next[`${field.id}.${index}`] = oldIndex >= 0 ? asText(prev[`${field.id}.${oldIndex}`]) : "";
        }
      }
      return next;
    });
    setErrors((prev) => {
      const keys = Object.keys(prev).filter((key) => key === id || key.startsWith(`${id}.`) || id.startsWith(`${key}.`));
      if (keys.length === 0) return prev;
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
  };

  const stepAt = (index: number): FormStep | undefined => config.steps[index];
  const merged = useMemo(() => validateAnswers(config.slug, answers), [config.slug, answers]);
  const missing = Object.keys(merged).length > 0;

  const goNext = () => {
    const step = stepAt(stage);
    if (!step) return;
    const found = validate(step.fields, answers);
    setErrors(found);
    const key = Object.keys(found)[0];
    if (key) {
      const target = document.querySelector<HTMLElement>(`[data-field="${key}"]`);
      target?.scrollIntoView({ block: "center" });
      (target?.matches("input,textarea") ? target : target?.querySelector<HTMLElement>("input,textarea"))?.focus({ preventScroll: true });
      return;
    }
    setStage(stage + 1);
  };

  const allFields = useMemo(() => config.steps.flatMap((step) => flatten(step.fields)), [config.steps]);
  const itemState = (item: { fields: string[]; optional?: boolean; static?: string }): string => {
    if (item.static) return item.static;
    const fields = allFields.filter((field) => item.fields.includes(field.id) && isVisible(field, answers));
    const hasError = item.fields.some((id) => Object.keys(merged).some((key) => key === id || key.startsWith(`${id}.`)));
    const done = item.optional ? fields.some((field) => isAnswered(field, answers)) : !hasError;
    return done ? "terisi" : "belum diisi";
  };

  const head = stage === reviewIndex ? { title: config.review.title as string | [string, string], description: config.review.description } : stage === doneIndex ? { title: config.done.title as string | [string, string], description: config.done.description } : stepAt(stage)!;
  const title = Array.isArray(head.title) ? head.title : [head.title];
  const prevLabel = stage === 0 ? config.startBackLabel ?? config.backLabel : (stage < reviewIndex ? stepAt(stage)!.backLabel : undefined) ?? `Kembali ke ${labels[stage - 1]}`;
  const footNote = "Periksa jawaban sebelum melanjutkan. Tombol Kembali mempertahankan isian selama formulir terbuka.";
  const arrow = <ArrowRight size={16} aria-hidden="true" />;
  const submit = async () => {
    if (submitting.current || missing || !session || !services || !isProgramSlug(config.slug)) return;
    const owner = session.user.id;
    submitting.current = true; setSending(true); setRequestError("");
    try {
      const receipt = await services.api.submitApplication(config.slug, normalizeAnswers(config.slug, answers), { userId: owner, accessToken: session.access_token });
      if (currentOwner.current === owner) setSaved(receipt);
    } catch (error) { if (currentOwner.current === owner) setRequestError(error instanceof Error ? error.message : "Pengajuan belum berhasil disimpan. Jawaban tetap ada; coba lagi."); }
    finally { submitting.current = false; setSending(false); }
  };
  if (!session || !services || !isProgramSlug(config.slug)) return <main className="page-container py-16"><p role="alert">Layanan pengajuan belum tersedia.</p></main>;
  if (checking) return <main className="page-container py-16"><p role="status">Memeriksa pengajuan…</p></main>;
  if (saved) return <main className="page-container py-16 text-forest"><h1 className="font-display text-4xl">Pengajuan {config.programName} tersimpan</h1><p className="mt-5">Jawaban Anda sudah tersimpan. Konfirmasi ini merupakan bukti pengajuan, bukan keputusan penerimaan peserta atau persetujuan proyek.</p><dl className="mt-6 break-words"><dt>Nomor pengajuan</dt><dd>{saved.id}</dd><dt className="mt-3">Diterima sistem</dt><dd>{new Date(saved.submitted_at).toLocaleString('id-ID')}</dd></dl><Link to={config.backTo} className={`${outlineButton} mt-8`}>{config.backLabel}</Link></main>;
  if (requestError && stage === 0) return <main className="page-container py-16"><h1 className="font-display text-3xl">Pengajuan {config.programName}</h1><p role="alert" className="mt-4">{requestError}</p><button type="button" onClick={() => {setChecking(true);setRequestError('');setRetry(x => x + 1);}} className={`${outlineButton} mt-5`}>Coba lagi</button></main>;

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
        <p className="-mr-2.5 mt-3 text-base font-semibold leading-6 text-forest md:mr-0">{head.description}</p>

        {stage < doneIndex && <Progress labels={labels} current={stage} />}
        {stage < doneIndex && <p className="mt-8 text-[13px] font-semibold text-forest">Tanda * menunjukkan pertanyaan wajib.</p>}

        {stage < reviewIndex && (
          <form noValidate onSubmit={(event) => { event.preventDefault(); goNext(); }}>
            {stepAt(stage)!.fields.map((field) => <FieldView key={field.id} field={field} answers={answers} set={set} errors={errors} />)}
            <div className="mt-10 flex flex-col gap-3">
              <button type="submit" className={buttonStyles({ variant: "berry", size: "lg", fullWidth: true, className: "text-[15px]" })}>
                {stepAt(stage)!.nextLabel ?? "Lanjut"}
                {arrow}
              </button>
              {stage === 0 ? (
                <Link to={config.backTo} className={outlineButton}>{prevLabel}{arrow}</Link>
              ) : (
                <button type="button" onClick={() => setStage(stage - 1)} className={outlineButton}>{prevLabel}{arrow}</button>
              )}
            </div>
            <p className="mt-4 text-[13px] font-semibold leading-5 text-forest">{footNote}</p>
          </form>
        )}

        {stage === reviewIndex && (
          <div>
            {missing && (
              <div role="status">
                <InfoCard title="Jawaban belum lengkap" text="Masih ada jawaban wajib yang belum diisi. Pilih Ubah jawaban untuk melengkapi sebelum menyelesaikan." />
              </div>
            )}
            <div className="mt-6 flex flex-col gap-4">
              {config.review.sections.map((section) => (
                <section key={section.title} aria-label={section.title} className="rounded-2xl bg-white p-5 text-forest">
                  <h2 className="font-ui text-[19px] font-semibold leading-tight">{section.title}</h2>
                  <ul className="mt-4 flex flex-col gap-3 text-[15px] font-semibold leading-6">
                    {section.items.map((item) => (
                      <li key={item.label}>
                        {item.code ? `${item.code} ` : ""}{item.label}: {itemState(item)}{item.optional && !item.static ? " (opsional)" : ""}.
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
              {requestError && <p role="alert" className="text-sm text-berry">{requestError}</p>}
              <button
                type="button"
                disabled={missing || sending}
                aria-disabled={missing || sending}
                onClick={() => { void submit(); }}
                className={buttonStyles({ variant: missing ? "outline" : "berry", size: "lg", fullWidth: true, className: `text-[15px] ${missing ? "!cursor-not-allowed !border-transparent !bg-mist !text-forest/70" : ""}` })}
              >
                {sending ? "Mengirim pengajuan…" : "Kirim Pengajuan"}
              </button>
              <button type="button" disabled={sending} onClick={() => setStage(stage - 1)} className={outlineButton}>{prevLabel}{arrow}</button>
            </div>
            <p className="mt-4 text-[13px] font-semibold leading-5 text-forest">{footNote}</p>
          </div>
        )}

        {stage === doneIndex && (
          <div className="mt-8 md:max-w-md">
            {config.done.card && (
              <div className="mb-8 rounded-2xl bg-[#f3faf8] p-5 text-forest">
                <p className="font-display text-[26px] font-bold leading-[1.15] tracking-normal">{config.done.card.title}</p>
                <p className="mt-4 text-base font-semibold leading-6">{config.done.card.text}</p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <Link to={config.backTo} className={buttonStyles({ variant: "berry", size: "lg", fullWidth: true, className: "text-[15px]" })}>{config.done.backLabel}{arrow}</Link>
              <Link to={config.done.exploreTo} className={outlineButton}>{config.done.exploreLabel}{arrow}</Link>
            </div>
          </div>
        )}
      </PageContainer>
    </main>
  );
}

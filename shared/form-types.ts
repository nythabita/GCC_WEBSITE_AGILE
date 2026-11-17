// Config-driven multi-step form used by the program application flows (GrowthX, GrowthConnect, GrowthCamp).
// A form is a list of steps (fields), an automatic review step, and a "simulation finished" screen.
// Answers live in component state only; nothing is sent anywhere (the design says "Jawaban tidak dikirim atau disimpan").

export type Answers = Record<string, string | string[]>;

// Show a field only while another field has this value (radio value, or option included in a checkbox list).
export type ShowIf = { field: string; equals: string };
// Required only when a checkbox field has at least one selection other than `anyBut` (e.g. "Belum pernah").
export type RequiredWhen = { field: string; anyBut: string };

type Base = { id: string; label: string; hint?: string; required?: boolean; showIf?: ShowIf; requiredWhen?: RequiredWhen };

export type TextField = Base & {
  type: "text";
  placeholder: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  // Checkbox that stands in for an answer (e.g. "Belum bisa memastikan"); stored in `${id}.alt`.
  alternative?: string;
  // Swap label/placeholder depending on another field's value (e.g. email vs WhatsApp).
  dynamic?: { by: string; map: Record<string, { label: string; placeholder: string; inputMode?: TextField["inputMode"] }> };
};
export type RadioField = Base & { type: "radio"; options: { value: string; label: string }[]; defaultValue?: string };
export type TextareaField = Base & { type: "textarea"; placeholder: string; maxWords?: number };
// `exclusive` is an option that clears (and is cleared by) every other option.
export type CheckboxesField = Base & { type: "checkboxes"; options: string[]; max?: number; exclusive?: string };
// One textarea per selected option of another checkboxes field ("Bidang pertama" / "Bidang kedua").
export type PerSelectionField = Base & { type: "perSelection"; from: string; placeholder: string; labels: [string, string] };
export type ConsentField = Base & { type: "consent"; text: string };
// One single-choice question per row, same options each (stored in `${id}.${rowIndex}`).
export type MatrixField = Base & { type: "matrix"; rows: string[]; options: string[] };
// Static info card (no answer).
export type NoteField = Base & { type: "note"; title?: string; text: string };
export type SubField = TextField | TextareaField | CheckboxesField;
export type GroupField = Base & { type: "group"; fields: SubField[] };

export type Field = TextField | RadioField | TextareaField | CheckboxesField | PerSelectionField | ConsentField | MatrixField | NoteField | GroupField;

export type FormStep = {
  id: string;
  label: string; // progress label (Profil, Kontribusi, ...)
  title: string | [string, string];
  description: string;
  fields: Field[];
  nextLabel?: string;
  backLabel?: string; // defaults to "Kembali ke <previous step label>"
};

// `static` replaces the answer status (for items that depend on something not yet available).
export type ReviewItem = { code?: string; label: string; fields: string[]; optional?: boolean; static?: string };
export type ReviewSection = { title: string; step: number; items: ReviewItem[] };

export type FormConfig = {
  slug: string;
  programName: string;
  eyebrow: string;
  backTo: string; // program landing
  backLabel: string; // top link, e.g. "Kembali ke GrowthX"
  startBackLabel?: string; // secondary button on step 1 (defaults to backLabel)
  steps: FormStep[];
  review: { title: string; description: string; sections: ReviewSection[]; finishLabel: string };
  done: { title: string; description: string; card?: { title: string; text: string }; backLabel: string; exploreLabel: string; exploreTo: string };
};

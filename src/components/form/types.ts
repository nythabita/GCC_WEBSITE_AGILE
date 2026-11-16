// Config-driven multi-step form used by the program application flows (GrowthX, GrowthConnect, GrowthCamp).
// A form is a list of steps (fields), an automatic review step, and a "simulation finished" screen.
// Answers live in component state only; nothing is sent anywhere (the design says "Jawaban tidak dikirim atau disimpan").

export type Answers = Record<string, string | string[]>;

type Base = { id: string; label: string; hint?: string; required?: boolean };

export type TextField = Base & {
  type: "text";
  placeholder: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  // Swap label/placeholder/hint depending on another field's value (e.g. email vs WhatsApp).
  dynamic?: { by: string; map: Record<string, { label: string; placeholder: string; inputMode?: TextField["inputMode"] }> };
};
export type RadioField = Base & { type: "radio"; options: { value: string; label: string }[]; defaultValue?: string };
export type TextareaField = Base & { type: "textarea"; placeholder: string; maxWords?: number };
export type CheckboxesField = Base & { type: "checkboxes"; options: string[]; max?: number };
// One textarea per selected option of another checkboxes field ("Bidang pertama" / "Bidang kedua").
export type PerSelectionField = Base & { type: "perSelection"; from: string; placeholder: string; labels: [string, string] };
export type ConsentField = Base & { type: "consent"; text: string };
export type GroupField = Base & { type: "group"; fields: (TextField | TextareaField)[] };

export type Field = TextField | RadioField | TextareaField | CheckboxesField | PerSelectionField | ConsentField | GroupField;

export type FormStep = {
  id: string;
  label: string; // progress label (Profil, Kontribusi, ...)
  title: string | [string, string];
  description: string;
  fields: Field[];
  nextLabel?: string;
};

export type ReviewItem = { code?: string; label: string; fields: string[]; optional?: boolean };
export type ReviewSection = { title: string; step: number; items: ReviewItem[] };

export type FormConfig = {
  slug: string;
  programName: string;
  eyebrow: string;
  backTo: string; // program landing
  backLabel: string; // "Kembali ke GrowthX"
  steps: FormStep[];
  review: { title: string; description: string; sections: ReviewSection[]; finishLabel: string };
  done: { title: string; description: string; backLabel: string; exploreLabel: string; exploreTo: string };
};

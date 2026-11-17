import { growthcampForm } from '../src/data/forms/growthcamp-form.ts';
import { growthxForm } from '../src/data/forms/growthx-form.ts';
import { growthconnectForm } from '../src/data/forms/growthconnect-form.ts';
import type { Answers, Field } from './form-types.ts';

export const formConfigs = { growthcamp: growthcampForm, growthx: growthxForm, growthconnect: growthconnectForm };
export type ProgramSlug = keyof typeof formConfigs;
export type { Answers } from './form-types.ts';
export function isProgramSlug(value: string): value is ProgramSlug { return Object.hasOwn(formConfigs, value); }

export type Rule = {
  id: string; kind: 'text' | 'list'; required: boolean; options?: string[]; max?: number; maxWords?: number;
  exclusive?: string; mode?: string; alternative?: string;
  showIf?: { field: string; equals: string }; requiredWhen?: { field: string; anyBut: string };
  selectedFrom?: string; selectionIndex?: number; dynamic?: { by: string; modes: Record<string, string> };
};

function rulesFor(field: Field): Rule[] {
  if (field.type === 'note') return [];
  if (field.type === 'group') return field.fields.flatMap(rulesFor);
  const base = { id: field.id, kind: 'text' as const, required: Boolean(field.required), showIf: field.showIf, requiredWhen: field.requiredWhen };
  switch (field.type) {
    case 'checkboxes': return [{ ...base, kind: 'list', options: field.options, max: field.max, exclusive: field.exclusive }];
    case 'radio': return [{ ...base, options: field.options.map(x => x.value) }];
    case 'consent': return [{ ...base, options: ['yes'] }];
    case 'matrix': return field.rows.map((_, i) => ({ ...base, id: `${field.id}.${i}`, options: field.options }));
    case 'perSelection': return [0, 1].map(i => ({ ...base, id: `${field.id}.${i}`, selectedFrom: field.from, selectionIndex: i }));
    case 'textarea': return [{ ...base, maxWords: field.maxWords }];
    case 'text': {
      const rule: Rule = { ...base, mode: field.inputMode, alternative: field.alternative ? `${field.id}.alt` : undefined,
        dynamic: field.dynamic ? { by: field.dynamic.by, modes: Object.fromEntries(Object.entries(field.dynamic.map).map(([key, value]) => [key, value.inputMode ?? 'text'])) } : undefined };
      return field.alternative ? [rule, { id: `${field.id}.alt`, kind: 'text', required: false, options: ['yes'] }] : [rule];
    }
  }
}

export function databaseFormDefinitions(): Record<ProgramSlug, Rule[]> {
  return Object.fromEntries(Object.entries(formConfigs).map(([slug, config]) => [slug, config.steps.flatMap(step => step.fields.flatMap(rulesFor))])) as Record<ProgramSlug, Rule[]>;
}
const rules = databaseFormDefinitions();
const list = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
const nonempty = (v: unknown) => typeof v === 'string' && v.trim().length > 0;
function active(rule: Rule, answers: Answers): boolean {
  if (rule.showIf) { const v = answers[rule.showIf.field]; if (!(Array.isArray(v) ? v.includes(rule.showIf.equals) : v === rule.showIf.equals)) return false; }
  if (rule.requiredWhen && !list(answers[rule.requiredWhen.field]).some(x => x !== rule.requiredWhen!.anyBut)) return false;
  if (rule.selectedFrom && list(answers[rule.selectedFrom]).length <= rule.selectionIndex!) return false;
  if (rule.alternative && answers[rule.alternative] === 'yes') return false;
  return true;
}
export function normalizeAnswers(slug: ProgramSlug, answers: Answers): Answers {
  const result: Answers = {};
  for (const rule of rules[slug]) {
    if (!active(rule, answers)) continue;
    const v = answers[rule.id];
    if (typeof v === 'string' && v.trim()) result[rule.id] = v.trim();
    else if (Array.isArray(v) && v.length) result[rule.id] = [...v];
  }
  return result;
}
export function validateAnswers(slug: string, input: unknown): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!isProgramSlug(slug) || !input || typeof input !== 'object' || Array.isArray(input)) return { _form: 'Formulir tidak valid.' };
  const answers = input as Answers;
  if (new TextEncoder().encode(JSON.stringify(input)).length > 65536) return { _form: 'Jawaban terlalu besar.' };
  const allowed = new Set(rules[slug].map(r => r.id));
  if (Object.keys(answers).some(key => !allowed.has(key))) errors._form = 'Ada kolom yang tidak dikenali.';
  for (const rule of rules[slug]) {
    if (!active(rule, answers)) continue;
    const v = answers[rule.id];
    const required = rule.required || Boolean(rule.requiredWhen) || Boolean(rule.selectedFrom);
    if (required && !(rule.kind === 'list' ? Array.isArray(v) && v.length : nonempty(v))) { errors[rule.id] = 'Wajib diisi.'; continue; }
    if (v === undefined || v === '') continue;
    if (rule.kind === 'list') {
      if (!Array.isArray(v) || v.some(x => typeof x !== 'string' || !rule.options!.includes(x)) || new Set(v).size !== v.length || (rule.max && v.length > rule.max) || (rule.exclusive && v.includes(rule.exclusive) && v.length > 1)) errors[rule.id] = 'Pilihan tidak valid.';
    } else {
      if (typeof v !== 'string') { errors[rule.id] = 'Jawaban harus berupa teks.'; continue; }
      const text = v.trim();
      // oxlint-disable-next-line no-control-regex -- Reject non-printing input, allowing tab/LF/CR for prose answers.
      if (text.length > 10000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(text)) errors[rule.id] = 'Teks tidak valid atau terlalu panjang.';
      if (rule.options && !rule.options.includes(text)) errors[rule.id] = 'Pilihan tidak valid.';
      if (rule.maxWords && text.split(/\s+/u).filter(Boolean).length > rule.maxWords) errors[rule.id] = `Maksimal ${rule.maxWords} kata.`;
      const mode = rule.dynamic ? rule.dynamic.modes[String(answers[rule.dynamic.by])] : rule.mode;
      if (mode === 'email' && !/^\S+@\S+\.\S+$/u.test(text)) errors[rule.id] = 'Tulis alamat email yang valid.';
      if (mode === 'tel' && !/^[+0-9][0-9\s-]{7,}$/u.test(text)) errors[rule.id] = 'Tulis nomor WhatsApp yang valid.';
      if (mode === 'url') { try { const url = new URL(text); if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) errors[rule.id] = 'Tulis tautan http/https yang valid.'; } catch { errors[rule.id] = 'Tulis tautan http/https yang valid.'; } }
    }
  }
  return errors;
}

import type { HomepageContent } from "./homepage.ts";
export type { HomepageContent } from "./homepage.ts";

function object(input: unknown, keys: string[], path: string): Record<string, unknown> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error(`Invalid content: ${path} must be an object.`);
  const value = input as Record<string, unknown>;
  if (Object.keys(value).length !== keys.length || keys.some(key => !Object.hasOwn(value, key))) {
    throw new Error(`Invalid content: ${path} has missing or unexpected fields.`);
  }
  return value;
}

function text(input: unknown, path: string, allowEmpty = false): string {
  // oxlint-disable-next-line no-control-regex -- Intentionally reject non-printing input; tab, LF and CR remain valid.
  if (typeof input !== 'string' || (!allowEmpty && !input.trim()) || input.length > 2000 || /[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(input)) {
    throw new Error(`Invalid content: ${path} must be plain text of at most 2000 characters.`);
  }
  return input;
}

export function validateHomepage(input: unknown): HomepageContent {
  const root = object(input, ['schemaVersion', 'contentStatus', 'notice', 'hero', 'about', 'journey'], 'root');
  if ((root.schemaVersion !== 1 && root.schemaVersion !== 2) || (root.contentStatus !== 'example' && root.contentStatus !== 'approved')) throw new Error('Invalid content: schemaVersion or contentStatus.');
  text(root.notice, 'notice', root.contentStatus === 'approved');
  const hero = object(root.hero, root.schemaVersion === 1 ? ['title', 'description', 'ctaLabel', 'ctaHref'] : ['title', 'description', 'actions'], 'hero');
  text(hero.title, 'hero.title'); text(hero.description, 'hero.description');
  if (root.schemaVersion === 1) {
    if (hero.ctaLabel !== 'Explore GCC' || hero.ctaHref !== '#journey') throw new Error('Invalid content: legacy hero CTA.');
  } else {
    if (!Array.isArray(hero.actions) || hero.actions.length !== 2) throw new Error('Invalid content: two homepage actions required.');
    hero.actions.forEach((action, i) => {
      const a = object(action, ['label', 'href'], `hero.actions[${i}]`); text(a.label, 'action label');
      if (a.href !== ['/programs', '/assessment'][i]) throw new Error('Invalid content: homepage action route.');
    });
  }
  const about = object(root.about, ['title', 'description'], 'about');
  text(about.title, 'about.title'); text(about.description, 'about.description');
  const journey = object(root.journey, ['title', 'description', 'items'], 'journey');
  text(journey.title, 'journey.title'); text(journey.description, 'journey.description');
  if (!Array.isArray(journey.items) || journey.items.length !== 3) throw new Error('Invalid content: journey needs exactly Learn, Apply, Grow.');
  const routes = [['learn', 'Learn', '/learn'], ['apply', 'Apply', '/apply'], ['grow', 'Grow', '/grow']];
  journey.items.forEach((item, index) => {
    const stage = object(item, ['slug', 'label', 'description', 'href'], `journey.items[${index}]`);
    const [slug, label, href] = routes[index];
    if (stage.slug !== slug || stage.label !== label || stage.href !== href) throw new Error(`Invalid content: journey.items[${index}] has the wrong route, label, or order.`);
    text(stage.description, `journey.items[${index}].description`);
  });
  const serialized = JSON.stringify(root);
  if (new TextEncoder().encode(serialized).length > 65536) throw new Error('Invalid content: document exceeds 64 KiB.');
  let placeholder = false;
  JSON.stringify(root, (_key, value) => {
    if (typeof value === 'string' && /\[[^\]]+\]/.test(value)) placeholder = true;
    return value;
  });
  if (root.contentStatus === 'approved' && placeholder) throw new Error('Invalid content: approved copy still contains placeholders.');
  return structuredClone(root) as unknown as HomepageContent;
}



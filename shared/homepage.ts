export interface HomepageContentV1 {
  schemaVersion: 1;
  contentStatus: 'example' | 'approved';
  notice: string;
  hero: { title: string; description: string; ctaLabel: 'Explore GCC'; ctaHref: '#journey' };
  about: { title: string; description: string };
  journey: {
    title: string; description: string;
    items: { slug: 'learn' | 'apply' | 'grow'; label: 'Learn' | 'Apply' | 'Grow'; description: string; href: '/learn' | '/apply' | '/grow' }[];
  };
}
export interface HomepageContentV2 extends Omit<HomepageContentV1, 'schemaVersion' | 'hero'> {
  schemaVersion: 2;
  hero: { title: string; description: string; actions: [{ label: string; href: '/programs' }, { label: string; href: '/assessment' }] };
}
export type HomepageContent = HomepageContentV1 | HomepageContentV2;

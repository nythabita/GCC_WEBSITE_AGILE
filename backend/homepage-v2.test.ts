import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { validateHomepage as validateHomepageContent } from './content.ts';

test('homepage v2 accepts current two-action design and rejects arbitrary routes', async () => {
  const v1 = JSON.parse(await readFile(new URL('./homepage.example.json', import.meta.url), 'utf8'));
  const v2 = { ...v1, schemaVersion: 2, hero: { title: 'Think Structurally. Solve Strategically. Grow Together.', description: 'Belajar consulting bersama GCC.', actions: [{label:'Explore Our Programs',href:'/programs'},{label:'Find Your Starting Point',href:'/assessment'}] } };
  assert.equal(validateHomepageContent(v2).schemaVersion, 2);
  const bad=structuredClone(v2); bad.hero.actions[0].href='https://evil.test'; assert.throws(()=>validateHomepageContent(bad));
  const db = new PGlite();
  try {
    await db.exec('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;');
    await db.exec(await readFile(new URL('./schema.sql',import.meta.url),'utf8'));
    await db.query("INSERT INTO public.homepage_content(id,content) VALUES('home',$1)",[v1]);
    await db.query("UPDATE public.homepage_content SET content=$1 WHERE id='home'",[v2]);
    await assert.rejects(db.query("UPDATE public.homepage_content SET content=$1 WHERE id='home'",[bad]));
  } finally {await db.close();}
});

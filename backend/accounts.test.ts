import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { fixtures } from './test-fixtures.ts';
import { buildFormSchema } from './build-form-schema.ts';
const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';

test('Postgres enforces private immutable submissions, validation, owner defaults and duplicate protection', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN; CREATE ROLE service_role NOLOGIN BYPASSRLS;
      CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY, raw_user_meta_data jsonb DEFAULT '{}');
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
      GRANT USAGE ON SCHEMA auth TO authenticated; GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated;`);
    const accounts = await readFile(new URL('./accounts.sql', import.meta.url), 'utf8');
    await db.exec(await readFile(new URL('./forms.generated.sql', import.meta.url), 'utf8')); await db.exec(accounts);
    await db.query('INSERT INTO auth.users(id,raw_user_meta_data) VALUES ($1,$2),($3,$4)', [owner, {full_name:'Student A'}, other, {full_name:'Student B'}]);
    await db.exec(`SET ROLE anon`);
    for (const table of ['profiles', 'program_applications']) await assert.rejects(db.exec(`SELECT * FROM public.${table}`), /permission denied/);
    await db.exec(`RESET ROLE; SET ROLE authenticated; SET request.jwt.claim.sub = '${owner}'`);
    const profiles = await db.query<{id:string}>('SELECT id FROM public.profiles'); assert.deepEqual(profiles.rows.map(x=>x.id), [owner]);
    await db.query('UPDATE public.profiles SET full_name=$1 WHERE id=$2', ['Updated', owner]);
    await assert.rejects(db.query('UPDATE public.profiles SET id=$1 WHERE id=$2', [other, owner]), /permission denied/);
    for (const slug of ['growthcamp','growthx','growthconnect'] as const) {
      const saved = await db.query<{user_id:string;form_version:number}>('INSERT INTO public.program_applications(program_slug,answers) VALUES($1,$2) RETURNING *', [slug, fixtures[slug]]);
      assert.equal(saved.rows[0].user_id, owner); assert.equal(saved.rows[0].form_version, 1);
      await assert.rejects(db.query('INSERT INTO public.program_applications(program_slug,answers) VALUES($1,$2)', [slug, fixtures[slug]]), /unique/);
    }
    await assert.rejects(db.query('INSERT INTO public.program_applications(user_id,program_slug,answers) VALUES($1,$2,$3)', [other,'growthcamp',fixtures.growthcamp]), /permission denied/);
    await assert.rejects(db.exec("UPDATE public.program_applications SET answers='{}'"), /permission denied/);
    await assert.rejects(db.exec('DELETE FROM public.program_applications'), /permission denied/);
    await db.exec(`SET request.jwt.claim.sub = '${other}'`);
    assert.equal((await db.query('SELECT * FROM public.program_applications')).rows.length, 0);
    const bad = [ {}, { ...fixtures.growthcamp, name: ['forged'] }, { ...fixtures.growthcamp, goals: ['forged'] },
      { ...fixtures.growthcamp, goals: ['Memahami consulting','Memahami consulting'] }, { ...fixtures.growthcamp, 'comfort.0': '' },
      { ...fixtures.growthcamp, why: 'word '.repeat(101) }, { ...fixtures.growthcamp, experience: ['Kuliah'] },
      { ...fixtures.growthcamp, contact: 'not-email' }, { ...fixtures.growthcamp, name: 'x'.repeat(10001) },
      { ...fixtures.growthcamp, owner: owner }, { ...fixtures.growthcamp, name: '\t\n' } ];
    for (const answers of bad) await assert.rejects(db.query('INSERT INTO public.program_applications(program_slug,answers) VALUES($1,$2)', ['growthcamp',answers]), /check constraint/);
    for (const [slug, answers] of [
      ['growthconnect', {...fixtures.growthconnect, budget:'Belum tersedia',budgetRange:{forged:'x'}}],
      ['growthcamp', {...fixtures.growthcamp,experienceDetail:'x'.repeat(20000)}],
      ['growthx', {...fixtures.growthx,portfolio:'https://example.com:bad'}],
    ] as const) await assert.rejects(db.query('INSERT INTO public.program_applications(program_slug,answers) VALUES($1,$2)',[slug,answers]),/check constraint/);
    await db.exec('RESET ROLE'); await db.exec(buildFormSchema()); await db.exec(accounts);
    assert.equal((await db.query('SELECT * FROM public.program_applications')).rows.length, 3, 'rerun preserves submissions');
    await db.query('DELETE FROM auth.users WHERE id=$1', [owner]);
    assert.equal((await db.query('SELECT * FROM public.program_applications')).rows.length, 0);
  } finally { await db.close(); }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateAnswers, normalizeAnswers } from '../shared/forms.ts';
import { fixtures } from './test-fixtures.ts';

for (const slug of ['growthcamp', 'growthx', 'growthconnect'] as const) {
  test(`${slug}: accepts hand-checked complete answers and rejects missing/unknown/type-forged answers`, () => {
    assert.deepEqual(validateAnswers(slug, fixtures[slug]), {});
    assert.ok(validateAnswers(slug, {}).name);
    assert.ok(validateAnswers(slug, { ...fixtures[slug], name: ['not a name'] }).name);
    assert.ok(validateAnswers(slug, { ...fixtures[slug], user_id: 'another user' })._form);
    assert.ok(validateAnswers(slug, { ...fixtures[slug], name: 'x'.repeat(10001) }).name);
    assert.ok(validateAnswers(slug, { ...fixtures[slug], contact: 'bad-email' }).contact);
    assert.ok(validateAnswers(slug, { ...fixtures[slug], name: '\t\n' }).name);
  });
}
test('rejects forged/excess/duplicate choices and missing matrix rows', () => {
  assert.ok(validateAnswers('growthcamp', { ...fixtures.growthcamp, goals: ['forged'] }).goals);
  assert.ok(validateAnswers('growthcamp', { ...fixtures.growthcamp, goals: ['Memahami consulting', 'Memahami consulting'] }).goals);
  assert.ok(validateAnswers('growthcamp', { ...fixtures.growthcamp, experience: ['Belum pernah', 'Kuliah'] }).experience);
  assert.ok(validateAnswers('growthcamp', { ...fixtures.growthcamp, 'comfort.2': '' })['comfort.2']);
  assert.ok(validateAnswers('growthx', { ...fixtures.growthx, areas: ['Riset pasar / pelanggan', 'Analisis data', 'Pemasaran'] }).areas);
});
test('enforces conditional explanations, per-selection abilities, consent and word limits', () => {
  assert.ok(validateAnswers('growthcamp', { ...fixtures.growthcamp, experience: ['Kuliah'] }).experienceDetail);
  assert.ok(validateAnswers('growthcamp', { ...fixtures.growthcamp, why: 'word '.repeat(101) }).why);
  assert.ok(validateAnswers('growthx', { ...fixtures.growthx, areas: ['Analisis data', 'Pemasaran'] })['abilities.1']);
  assert.ok(validateAnswers('growthx', { ...fixtures.growthx, consent: 'no' }).consent);
  assert.deepEqual(validateAnswers('growthcamp', { ...fixtures.growthcamp, hours: '', 'hours.alt': 'yes' }), {});
  assert.ok(validateAnswers('growthcamp', { ...fixtures.growthcamp, hours: '', 'hours.alt': 'forged' })['hours.alt']);
});
test('normalization removes irrelevant answers and trims text without dropping active answers', () => {
  const a = normalizeAnswers('growthconnect', { ...fixtures.growthconnect, name: ' Test Contact ', budget: 'Belum ditentukan', budgetRange: '100000' });
  assert.equal(a.name, 'Test Contact'); assert.equal('budgetRange' in a, false);
  const b = normalizeAnswers('growthcamp', { ...fixtures.growthcamp, experienceDetail: 'Old answer', hours: 'old', 'hours.alt': 'yes' });
  assert.equal('experienceDetail' in b, false); assert.equal('hours' in b, false); assert.equal(b['hours.alt'], 'yes');
  const c = normalizeAnswers('growthx', { ...fixtures.growthx, 'abilities.1': 'No longer selected' });
  assert.equal('abilities.1' in c, false);
});
test('rejects oversized payloads, invalid roots, unknown programs and active invalid URLs', () => {
  assert.ok(validateAnswers('growthcamp', null)._form);
  assert.ok(validateAnswers('growthcamp', [])._form);
  assert.ok(validateAnswers('unknown', fixtures.growthcamp)._form);
  assert.ok(validateAnswers('growthx', { ...fixtures.growthx, portfolio: 'javascript:alert(1)' }).portfolio);
  assert.ok(validateAnswers('growthx', { ...fixtures.growthx, contactType: 'whatsapp', contact: 'bad' }).contact);
});

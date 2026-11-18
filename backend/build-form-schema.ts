import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { databaseFormDefinitions } from '../shared/forms.ts';

export function buildFormSchema(): string {
  const definition = JSON.stringify(databaseFormDefinitions()).replaceAll("'", "''");
  return `-- Generated from the existing three form configurations. Run node build-form-schema.ts to regenerate.
CREATE SCHEMA IF NOT EXISTS gcc_private;
REVOKE ALL ON SCHEMA gcc_private FROM PUBLIC;
GRANT USAGE ON SCHEMA gcc_private TO authenticated, service_role;
CREATE OR REPLACE FUNCTION gcc_private.form_rules(slug text) RETURNS jsonb
LANGUAGE sql IMMUTABLE SET search_path = '' AS $$ SELECT '${definition}'::jsonb -> slug $$;
REVOKE ALL ON FUNCTION gcc_private.form_rules(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION gcc_private.form_rules(text) TO authenticated, service_role;
`;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await writeFile(new URL('./forms.generated.sql', import.meta.url), buildFormSchema());
  console.log('Generated database form validation definitions.');
}

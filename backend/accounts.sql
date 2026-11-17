-- Apply forms.generated.sql first. Additive, repeatable schema for authenticated GCC users.
BEGIN;
CREATE OR REPLACE FUNCTION gcc_private.application_valid(slug text, version integer, answers jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path = '' AS $$
DECLARE rules jsonb := gcc_private.form_rules(slug); rule jsonb; val jsonb; controlling jsonb;
  key text; clean text; mode text; required boolean; count_selected integer;
BEGIN
  IF rules IS NULL OR version <> 1 OR answers IS NULL OR jsonb_typeof(answers) <> 'object' OR octet_length(answers::text) > 65536 THEN RETURN false; END IF;
  FOR key IN SELECT jsonb_object_keys(answers) LOOP
    IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(rules) r WHERE r->>'id' = key) THEN RETURN false; END IF;
  END LOOP;
  FOR rule IN SELECT jsonb_array_elements(rules) LOOP
    key := rule->>'id'; val := answers->key;
    IF rule ? 'showIf' THEN
      controlling := answers->(rule#>>'{showIf,field}');
      IF NOT coalesce(controlling = rule#>'{showIf,equals}' OR (jsonb_typeof(controlling)='array' AND controlling @> jsonb_build_array(rule#>'{showIf,equals}')), false) THEN CONTINUE; END IF;
    END IF;
    IF rule ? 'requiredWhen' THEN
      controlling := answers->(rule#>>'{requiredWhen,field}');
      IF jsonb_typeof(controlling) IS DISTINCT FROM 'array' THEN CONTINUE; END IF;
      IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements_text(controlling) x WHERE x <> rule#>>'{requiredWhen,anyBut}') THEN CONTINUE; END IF;
    END IF;
    IF rule ? 'selectedFrom' THEN
      controlling := answers->(rule->>'selectedFrom');
      IF jsonb_typeof(controlling) IS DISTINCT FROM 'array' THEN RETURN false; END IF;
      count_selected := jsonb_array_length(controlling);
      IF count_selected <= (rule->>'selectionIndex')::integer THEN CONTINUE; END IF;
    END IF;
    IF rule ? 'alternative' AND answers->>(rule->>'alternative') = 'yes' THEN CONTINUE; END IF;
    required := (rule->>'required')::boolean OR rule ? 'requiredWhen' OR rule ? 'selectedFrom';
    IF val IS NULL OR val = '""'::jsonb THEN
      IF required THEN RETURN false; ELSE CONTINUE; END IF;
    END IF;
    IF rule->>'kind' = 'list' THEN
      IF jsonb_typeof(val) <> 'array' THEN RETURN false; END IF;
      IF required AND jsonb_array_length(val)=0 THEN RETURN false; END IF;
      IF rule ? 'max' AND jsonb_array_length(val) > (rule->>'max')::integer THEN RETURN false; END IF;
      IF (SELECT count(DISTINCT x) FROM jsonb_array_elements(val) x) <> jsonb_array_length(val) THEN RETURN false; END IF;
      IF EXISTS (SELECT 1 FROM jsonb_array_elements(val) x WHERE jsonb_typeof(x)<>'string' OR NOT (rule->'options' @> jsonb_build_array(x))) THEN RETURN false; END IF;
      IF rule ? 'exclusive' AND val @> jsonb_build_array(rule->'exclusive') AND jsonb_array_length(val)>1 THEN RETURN false; END IF;
    ELSE
      IF jsonb_typeof(val)<>'string' THEN RETURN false; END IF;
      clean := regexp_replace(val#>>'{}', '^[[:space:]]+|[[:space:]]+$', '', 'g');
      IF required AND length(regexp_replace(clean,'[[:space:]]','','g'))=0 THEN RETURN false; END IF;
      IF length(clean)>10000 OR regexp_replace(clean,E'[\\n\\r\\t]','','g') ~ '[[:cntrl:]]' THEN RETURN false; END IF;
      IF rule ? 'options' AND NOT (rule->'options' @> jsonb_build_array(clean)) THEN RETURN false; END IF;
      IF rule ? 'maxWords' AND cardinality(regexp_split_to_array(clean,'[[:space:]]+')) > (rule->>'maxWords')::integer THEN RETURN false; END IF;
      mode := CASE WHEN rule ? 'dynamic' THEN rule#>'{dynamic,modes}' ->> (answers->>(rule#>>'{dynamic,by}')) ELSE rule->>'mode' END;
      IF mode='email' AND clean !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN RETURN false; END IF;
      IF mode='tel' AND clean !~ '^[+0-9][0-9[:space:]-]{7,}$' THEN RETURN false; END IF;
      IF mode='url' AND clean !~ '^https?://[^[:space:]/?#@]+([/?#][^[:space:]]*)?$' THEN RETURN false; END IF;
    END IF;
  END LOOP;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION gcc_private.application_valid(text,integer,jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION gcc_private.application_valid(text,integer,jsonb) TO authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '' CHECK (length(full_name)<=160),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.program_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  program_slug text NOT NULL CHECK (program_slug IN ('growthcamp','growthx','growthconnect')),
  form_version integer NOT NULL DEFAULT 1,
  answers jsonb NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT application_answers_valid CHECK (gcc_private.application_valid(program_slug,form_version,answers)),
  CONSTRAINT one_application_per_program UNIQUE(user_id,program_slug)
);
COMMENT ON TABLE public.program_applications IS 'Private application/assessment answers; stored submission is not an acceptance decision.';

CREATE OR REPLACE FUNCTION gcc_private.new_user_profile() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  INSERT INTO public.profiles(id,full_name) VALUES(NEW.id,left(coalesce(NEW.raw_user_meta_data->>'full_name',''),160)) ON CONFLICT(id) DO NOTHING;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION gcc_private.new_user_profile() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS gcc_new_user_profile ON auth.users;
CREATE TRIGGER gcc_new_user_profile AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION gcc_private.new_user_profile();
INSERT INTO public.profiles(id,full_name) SELECT id,left(coalesce(raw_user_meta_data->>'full_name',''),160) FROM auth.users ON CONFLICT(id) DO NOTHING;

CREATE OR REPLACE FUNCTION gcc_private.profile_timestamp() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at := clock_timestamp(); RETURN NEW; END;
$$;
REVOKE ALL ON FUNCTION gcc_private.profile_timestamp() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS gcc_profile_timestamp ON public.profiles;
CREATE TRIGGER gcc_profile_timestamp BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION gcc_private.profile_timestamp();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_applications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.profiles,public.program_applications FROM PUBLIC,anon,authenticated;
GRANT USAGE ON SCHEMA public TO authenticated, service_role;
GRANT SELECT ON public.profiles,public.program_applications TO authenticated;
GRANT UPDATE(full_name) ON public.profiles TO authenticated;
GRANT INSERT(program_slug,answers) ON public.program_applications TO authenticated;
GRANT ALL ON public.profiles,public.program_applications TO service_role;
DROP POLICY IF EXISTS profiles_read_own ON public.profiles;
CREATE POLICY profiles_read_own ON public.profiles FOR SELECT TO authenticated USING (id=(SELECT auth.uid()));
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (id=(SELECT auth.uid())) WITH CHECK(id=(SELECT auth.uid()));
DROP POLICY IF EXISTS applications_read_own ON public.program_applications;
CREATE POLICY applications_read_own ON public.program_applications FOR SELECT TO authenticated USING (user_id=(SELECT auth.uid()));
DROP POLICY IF EXISTS applications_insert_own ON public.program_applications;
CREATE POLICY applications_insert_own ON public.program_applications FOR INSERT TO authenticated WITH CHECK (user_id=(SELECT auth.uid()));
NOTIFY pgrst, 'reload schema';
COMMIT;

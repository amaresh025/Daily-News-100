-- Add extra_category_ids to posts for multi-category support (main = category_id, others = extras)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS extra_category_ids uuid[] NOT NULL DEFAULT '{}';
CREATE INDEX IF NOT EXISTS posts_extra_category_ids_idx ON public.posts USING GIN (extra_category_ids);

-- Restrict has_role EXECUTE to service_role only; authenticated checks happen via RLS using has_role()
-- which still works because RLS policies are evaluated by the database (not the calling role).
-- Actually the function must be executable by 'authenticated' for RLS policies that reference it
-- to evaluate correctly inside policy checks (security definer runs with definer's privs but the
-- caller still needs EXECUTE). We instead lock down by ensuring the function only reads user_roles
-- and has a stable search_path -- already true. Re-affirm grants for clarity:
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
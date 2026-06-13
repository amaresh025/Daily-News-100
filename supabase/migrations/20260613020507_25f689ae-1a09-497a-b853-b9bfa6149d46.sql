
-- 1) post_likes: remove the always-true public SELECT policy
DROP POLICY IF EXISTS "Public reads like post_id only" ON public.post_likes;
-- (Admins-only SELECT policy is retained)

-- 2) has_role: tighten EXECUTE privileges
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 3) comments: explicit column-level lockdown of `email`
REVOKE SELECT ON public.comments FROM anon, authenticated;
GRANT SELECT (id, post_id, name, content, approved, created_at) ON public.comments TO authenticated;
-- email column intentionally omitted; admins can still read all columns via service_role / definer paths
GRANT ALL ON public.comments TO service_role;

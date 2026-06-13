
-- Drop the view that triggered the definer-view warning
DROP VIEW IF EXISTS public.post_like_counts;

-- Allow public to read ONLY post_id (column-level grant) and re-add SELECT policy
GRANT SELECT (post_id) ON public.post_likes TO anon, authenticated;
CREATE POLICY "Public reads like post_id only" ON public.post_likes
  FOR SELECT TO anon, authenticated USING (true);

-- Tighten like INSERT (require post exists)
DROP POLICY IF EXISTS "Anyone can like" ON public.post_likes;
CREATE POLICY "Anyone can like existing post" ON public.post_likes
  FOR INSERT TO anon, authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.status='published'));

-- Revoke direct API access to has_role; RLS policies (run as definer) can still use it.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;

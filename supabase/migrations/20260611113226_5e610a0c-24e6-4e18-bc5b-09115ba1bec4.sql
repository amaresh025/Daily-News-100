
-- 1. post_likes: hide visitor_id from public
DROP POLICY IF EXISTS "Anyone reads like counts" ON public.post_likes;
REVOKE SELECT ON public.post_likes FROM anon, authenticated;
GRANT SELECT ON public.post_likes TO service_role;
-- admin can still read
CREATE POLICY "Admins read post_likes" ON public.post_likes
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- public counts view (no visitor_id exposed)
CREATE OR REPLACE VIEW public.post_like_counts
WITH (security_invoker = true) AS
SELECT post_id, count(*)::int AS like_count
FROM public.post_likes
GROUP BY post_id;
GRANT SELECT ON public.post_like_counts TO anon, authenticated;

-- allow public counting via aggregate without exposing rows: allow SELECT for anon BUT only if we re-grant?
-- The view uses security_invoker so it needs SELECT on base table for the invoker. Switch to definer:
DROP VIEW public.post_like_counts;
CREATE OR REPLACE VIEW public.post_like_counts AS
SELECT post_id, count(*)::int AS like_count
FROM public.post_likes
GROUP BY post_id;
ALTER VIEW public.post_like_counts OWNER TO postgres;
GRANT SELECT ON public.post_like_counts TO anon, authenticated;

-- 2. comments: remove duplicate insert policy
DROP POLICY IF EXISTS "Anyone can submit comments" ON public.comments;

-- 3. categories: drop public role policy, add explicit anon+auth
DROP POLICY IF EXISTS "Categories public read" ON public.categories;
CREATE POLICY "Categories anon+auth read" ON public.categories
  FOR SELECT TO anon, authenticated USING (true);

-- 4. swap India for Accidents
UPDATE public.posts
   SET category_id = (SELECT id FROM public.categories WHERE slug='accidents' LIMIT 1)
 WHERE category_id = (SELECT id FROM public.categories WHERE slug='india');
-- insert accidents if missing
INSERT INTO public.categories (name, slug, description, display_order)
SELECT 'Accidents','accidents','Accident reports and major incidents', 3
WHERE NOT EXISTS (SELECT 1 FROM public.categories WHERE slug='accidents');
-- re-run the update (in case accidents was just created)
UPDATE public.posts
   SET category_id = (SELECT id FROM public.categories WHERE slug='accidents' LIMIT 1)
 WHERE category_id = (SELECT id FROM public.categories WHERE slug='india');
DELETE FROM public.categories WHERE slug='india';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { PostRow } from '@/hooks/usePosts';
import { MostReadSkeleton } from './NewsCardSkeleton';

const MostRead = () => {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('id,title,slug,excerpt,featured_image,author_name,is_breaking,is_trending,views,published_at,category_id, categories(id,name,slug)')
        .eq('status', 'published')
        .order('views', { ascending: false })
        .limit(5);
      if (alive) { setPosts((data as PostRow[]) ?? []); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);
  if (loading) return <MostReadSkeleton />;
  if (!posts.length) return null;
  return (
    <section className="container-blog py-10" aria-labelledby="most-read-heading">
      <h2 id="most-read-heading" className="section-title">Most Read</h2>
      <ol className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
        {posts.map((p, i) => (
          <li key={p.id} className="relative bg-card border border-border rounded-lg p-4 pl-12 hover:border-primary/40 transition-colors">
            <span className="absolute left-3 top-3 text-4xl font-extrabold text-primary/80 leading-none">
              {i + 1}
            </span>
            <Link to={`/blog/${p.slug}`} className="block">
              {p.categories && <span className="blog-meta">{p.categories.name}</span>}
              <h3 className="text-sm font-bold leading-snug mt-1 line-clamp-3 hover:text-primary">{p.title}</h3>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default MostRead;

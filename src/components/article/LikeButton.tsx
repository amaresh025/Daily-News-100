import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getVisitorId } from '@/lib/visitorId';
import { useToast } from '@/hooks/use-toast';

const LIKED_KEY = 'n100_liked_posts';
const getLiked = (): string[] => { try { return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]'); } catch { return []; } };
const addLiked = (id: string) => { const s = new Set(getLiked()); s.add(id); localStorage.setItem(LIKED_KEY, JSON.stringify([...s])); };

export default function LikeButton({ postId }: { postId: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setLiked(getLiked().includes(postId));
    (async () => {
      // Only post_id is publicly readable; this still returns count.
      const { count: c } = await supabase
        .from('post_likes')
        .select('post_id', { count: 'exact', head: true })
        .eq('post_id', postId);
      setCount(c ?? 0);
    })();
  }, [postId]);

  const like = async () => {
    if (liked) return;
    const { error } = await supabase.from('post_likes').insert({ post_id: postId, visitor_id: getVisitorId() });
    if (error) { toast({ title: "Couldn't register like", description: error.message, variant: 'destructive' }); return; }
    addLiked(postId);
    setLiked(true);
    setCount(c => c + 1);
  };

  return (
    <button onClick={like} disabled={liked}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
        liked ? 'bg-destructive/10 border-destructive text-destructive' : 'border-border hover:border-destructive'
      }`}>
      <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      <span className="text-sm font-semibold">{count} {count === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
}

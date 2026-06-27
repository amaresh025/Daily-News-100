import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { BreakingTickerSkeleton } from './NewsCardSkeleton';

const BreakingTicker = () => {
  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('title')
        .eq('status', 'published')
        .eq('is_breaking', true)
        .order('published_at', { ascending: false })
        .limit(10);
      if (alive) { setItems((data ?? []).map((p: { title: string }) => p.title)); setLoading(false); }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <BreakingTickerSkeleton />;
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div className="bg-[hsl(var(--news-red))] text-[hsl(var(--news-red-foreground))] border-y border-[hsl(var(--news-red))]">
      <div className="container-blog flex items-stretch h-10 overflow-hidden">
        <div className="flex items-center gap-2 pr-4 mr-4 border-r border-white/30 shrink-0 font-bold uppercase tracking-wider text-xs">
          <Radio className="h-4 w-4 animate-pulse" />
          Breaking
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap animate-ticker">
            {loop.map((t, i) => (
              <span key={i} className="px-6 text-sm">
                • {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakingTicker;

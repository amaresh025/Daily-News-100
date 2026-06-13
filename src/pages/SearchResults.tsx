import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

interface Suggestion {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  categories: { name: string; slug: string } | null;
}

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<Suggestion[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const currentQuery = searchParams.get('q') || '';

  // Live suggestions as user types (title-only matches)
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from('posts')
        .select('id,title,slug,excerpt,featured_image,published_at, categories(name,slug)')
        .eq('status', 'published')
        .ilike('title', `%${q}%`)
        .order('published_at', { ascending: false })
        .limit(6);
      setSuggestions((data as Suggestion[]) ?? []);
    }, 180);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Run a full search when ?q= changes
  useEffect(() => {
    const q = currentQuery.trim();
    if (!q) { setResults([]); return; }
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from('posts')
        .select('id,title,slug,excerpt,featured_image,published_at, categories(name,slug)')
        .eq('status', 'published')
        .ilike('title', `%${q}%`)
        .order('published_at', { ascending: false })
        .limit(50);
      setResults((data as Suggestion[]) ?? []);
      setLoading(false);
    })();
  }, [currentQuery]);

  useEffect(() => { setSearchQuery(searchParams.get('q') || ''); }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) setSearchParams({ q: searchQuery.trim() });
  };

  const clearSearch = () => { setSearchQuery(''); setSearchParams({}); };

  const showSuggestions = useMemo(
    () => searchQuery.trim().length >= 2 && suggestions.length > 0 && searchQuery !== currentQuery,
    [searchQuery, currentQuery, suggestions]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main id="main-content" className="container-blog py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6">Search Articles</h1>

          <form onSubmit={handleSearch} className="mb-2">
            <div className="relative">
              <label htmlFor="search-input" className="sr-only">Search articles</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="search-input"
                type="text"
                placeholder="Search by article title…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12 py-3"
                autoComplete="off"
              />
              {searchQuery && (
                <Button type="button" variant="ghost" size="sm" onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0" aria-label="Clear search">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>

          {/* Live title suggestions */}
          {showSuggestions && (
            <div className="bg-card border border-border rounded-lg shadow-sm divide-y divide-border mb-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4 py-2">Suggestions</p>
              {suggestions.map(s => (
                <Link key={s.id} to={`/blog/${s.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors">
                  {s.featured_image && <img src={s.featured_image} alt="" className="w-14 h-10 rounded object-cover shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold line-clamp-1">{s.title}</p>
                    {s.categories && <p className="text-xs text-muted-foreground">{s.categories.name}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {currentQuery ? (
            <section>
              <p className="text-sm text-muted-foreground mb-4">
                {loading
                  ? 'Searching…'
                  : results.length > 0
                    ? `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${currentQuery}"`
                    : `No articles found for "${currentQuery}"`}
              </p>
              <div className="space-y-4">
                {results.map(r => (
                  <Link key={r.id} to={`/blog/${r.slug}`} className="flex gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary transition-colors">
                    {r.featured_image && <img src={r.featured_image} alt="" className="w-32 h-24 rounded object-cover shrink-0" />}
                    <div className="min-w-0">
                      {r.categories && <span className="badge-category text-[10px]">{r.categories.name}</span>}
                      <h2 className="text-lg font-bold mt-1 line-clamp-2">{r.title}</h2>
                      {r.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Enter a search term to find articles by title.</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={() => navigate('/latest')}>Latest</Button>
                <Button variant="outline" onClick={() => navigate('/category/politics')}>Politics</Button>
                <Button variant="outline" onClick={() => navigate('/category/business')}>Business</Button>
                <Button variant="outline" onClick={() => navigate('/category/technology')}>Technology</Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;

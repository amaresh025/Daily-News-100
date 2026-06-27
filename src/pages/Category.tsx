import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/news/NewsCard';
import { useCategoryPosts } from '@/hooks/usePosts';

interface CatMeta {
  label: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  keywords: string[];
  related: { slug: string; label: string }[];
}

const META: Record<string, CatMeta> = {
  politics: {
    label: 'Politics',
    metaTitle: 'Politics News — Latest Political Updates | DailyNews100',
    metaDescription: 'Latest politics news, elections, policy debates and government decisions from around the world. Fast, fact-checked political coverage on DailyNews100.',
    h1: 'Politics News — Latest Political Updates',
    keywords: ['politics news', 'election news', 'government policy', 'political analysis', 'world politics'],
    related: [{ slug: 'business', label: 'Business news' }, { slug: 'technology', label: 'Tech policy' }],
  },
  accidents: {
    label: 'Accidents',
    metaTitle: 'Accident News — Road, Air & Major Incidents | DailyNews100',
    metaDescription: 'Latest accident news: road crashes, air incidents, industrial mishaps and major emergencies — verified reports updated 24/7 on DailyNews100.',
    h1: 'Accident News — Road, Air &amp; Major Incidents',
    keywords: ['accident news', 'road accident', 'plane crash', 'breaking incidents', 'emergency news'],
    related: [{ slug: 'health', label: 'Health emergencies' }, { slug: 'politics', label: 'Public-safety policy' }],
  },
  business: {
    label: 'Business',
    metaTitle: 'Business News — Markets, Economy & Companies | DailyNews100',
    metaDescription: 'Business news, market updates, company earnings, startups and the global economy — clear, timely reporting on DailyNews100.',
    h1: 'Business News — Markets, Economy &amp; Companies',
    keywords: ['business news', 'stock market', 'economy news', 'company earnings', 'startup news'],
    related: [{ slug: 'technology', label: 'Tech business' }, { slug: 'politics', label: 'Economic policy' }],
  },
  sports: {
    label: 'Sports',
    metaTitle: 'Sports News — Scores, Highlights & Match Reports | DailyNews100',
    metaDescription: 'Latest sports news, live scores, transfers, match reports and player interviews across cricket, football, tennis and more on DailyNews100.',
    h1: 'Sports News — Scores, Highlights &amp; Match Reports',
    keywords: ['sports news', 'live scores', 'football news', 'cricket news', 'match highlights'],
    related: [{ slug: 'entertainment', label: 'Celebrity sports stories' }, { slug: 'health', label: 'Athlete health' }],
  },
  entertainment: {
    label: 'Entertainment',
    metaTitle: 'Entertainment News — Movies, Music & Celebrities | DailyNews100',
    metaDescription: 'Latest entertainment news on movies, music, streaming, TV shows and celebrity stories from around the world on DailyNews100.',
    h1: 'Entertainment News — Movies, Music &amp; Celebrities',
    keywords: ['entertainment news', 'celebrity news', 'movie reviews', 'music news', 'streaming releases'],
    related: [{ slug: 'sports', label: 'Sports entertainment' }, { slug: 'technology', label: 'Streaming tech' }],
  },
  technology: {
    label: 'Technology',
    metaTitle: 'Technology News — AI, Gadgets & Startups | DailyNews100',
    metaDescription: 'Technology news on AI, smartphones, gadgets, cybersecurity, startups and product launches — daily tech coverage on DailyNews100.',
    h1: 'Technology News — AI, Gadgets &amp; Startups',
    keywords: ['technology news', 'AI news', 'gadget reviews', 'smartphone launches', 'cybersecurity news'],
    related: [{ slug: 'business', label: 'Tech business' }, { slug: 'politics', label: 'Tech regulation' }],
  },
  health: {
    label: 'Health',
    metaTitle: 'Health News — Medical Research, Fitness & Wellness | DailyNews100',
    metaDescription: 'Health news covering medical research, public health alerts, fitness, mental wellness and nutrition — trusted updates on DailyNews100.',
    h1: 'Health News — Medical Research, Fitness &amp; Wellness',
    keywords: ['health news', 'medical research', 'wellness tips', 'mental health', 'public health'],
    related: [{ slug: 'accidents', label: 'Emergency &amp; safety' }, { slug: 'technology', label: 'Health tech' }],
  },
};

const Category = () => {
  const { slug = '' } = useParams();
  const { posts } = useCategoryPosts(slug, 50);
  const meta = META[slug];
  const label = meta?.label ?? slug;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {meta && (
        <Helmet>
          <title>{meta.metaTitle}</title>
          <meta name="description" content={meta.metaDescription} />
          <meta name="keywords" content={meta.keywords.join(', ')} />
          <link rel="canonical" href={`/category/${slug}`} />
          <meta property="og:title" content={meta.metaTitle} />
          <meta property="og:description" content={meta.metaDescription} />
          <meta property="og:url" content={`/category/${slug}`} />
        </Helmet>
      )}
      <Header />
      <main id="main-content" className="flex-1">
        <div className="container-blog py-10">
          <h1 className="section-title" dangerouslySetInnerHTML={{ __html: meta?.h1 ?? label }} />
          {meta && (
            <p className="text-muted-foreground max-w-3xl mb-6">{meta.metaDescription}</p>
          )}

          {posts.length === 0 ? (
            <p className="text-muted-foreground">No stories published yet in this section.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((p) => <NewsCard key={p.id} post={p} size="lg" />)}
            </div>
          )}

          {meta && meta.related.length > 0 && (
            <aside className="mt-12 border-t border-border pt-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-3">Explore related sections</h2>
              <div className="flex flex-wrap gap-3">
                {meta.related.map(r => (
                  <Link key={r.slug} to={`/category/${r.slug}`} className="px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-sm transition-colors" dangerouslySetInnerHTML={{ __html: r.label }} />
                ))}
              </div>
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Category;

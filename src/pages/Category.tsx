import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/news/NewsCard';
import { useCategoryPosts } from '@/hooks/usePosts';
import { CategoryPageSkeleton } from '@/components/news/NewsCardSkeleton';

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
    metaDescription: 'Get the latest accident news. We cover road crashes, aviation incidents, industrial mishaps, and major emergencies with verified, 24/7 reports on DailyNews100.',
    h1: 'Accident News — Road, Air &amp; Major Incidents',
    keywords: ['accident news', 'road accident', 'plane crash', 'breaking incidents', 'emergency news'],
    related: [{ slug: 'health', label: 'Health emergencies' }, { slug: 'politics', label: 'Public-safety policy' }],
  },
  business: {
    label: 'Business',
    metaTitle: 'Business News — Markets, Economy & Companies | DailyNews100',
    metaDescription: 'Get the latest business news, stock market updates, company earnings, startup profiles, and global economy insights with clear, timely reporting on DailyNews100.',
    h1: 'Business News — Markets, Economy &amp; Companies',
    keywords: ['business news', 'stock market', 'economy news', 'company earnings', 'startup news'],
    related: [{ slug: 'technology', label: 'Tech business' }, { slug: 'politics', label: 'Economic policy' }],
  },
  sports: {
    label: 'Sports',
    metaTitle: 'Sports News — Live Scores & Match Highlights | DailyNews100',
    metaDescription: 'Get the latest sports news, live scores, transfer updates, match reports, and player interviews across cricket, football, tennis, and more on DailyNews100.',
    h1: 'Sports News — Scores, Highlights &amp; Match Reports',
    keywords: ['sports news', 'live scores', 'football news', 'cricket news', 'match highlights'],
    related: [{ slug: 'entertainment', label: 'Celebrity sports stories' }, { slug: 'health', label: 'Athlete health' }],
  },
  entertainment: {
    label: 'Entertainment',
    metaTitle: 'Entertainment News — Movies, Music & Celebs | DailyNews100',
    metaDescription: 'Get the latest entertainment news. We cover movies, music, streaming releases, television shows, and celebrity stories from around the world on DailyNews100.',
    h1: 'Entertainment News — Movies, Music &amp; Celebrities',
    keywords: ['entertainment news', 'celebrity news', 'movie reviews', 'music news', 'streaming releases'],
    related: [{ slug: 'sports', label: 'Sports entertainment' }, { slug: 'technology', label: 'Streaming tech' }],
  },
  technology: {
    label: 'Technology',
    metaTitle: 'Technology News — AI, Gadgets & Startups | DailyNews100',
    metaDescription: 'Get technology news on artificial intelligence, smartphones, gadgets, cybersecurity, startups, and new product launches with daily tech updates on DailyNews100.',
    h1: 'Technology News — AI, Gadgets &amp; Startups',
    keywords: ['technology news', 'AI news', 'gadget reviews', 'smartphone launches', 'cybersecurity news'],
    related: [{ slug: 'business', label: 'Tech business' }, { slug: 'politics', label: 'Tech regulation' }],
  },
  health: {
    label: 'Health',
    metaTitle: 'Health News — Medical Research & Wellness | DailyNews100',
    metaDescription: 'Get trusted health news. We cover the latest medical research, public health alerts, fitness tips, mental wellness guidance, and nutrition on DailyNews100.',
    h1: 'Health News — Medical Research, Fitness &amp; Wellness',
    keywords: ['health news', 'medical research', 'wellness tips', 'mental health', 'public health'],
    related: [{ slug: 'accidents', label: 'Emergency &amp; safety' }, { slug: 'technology', label: 'Health tech' }],
  },
};

const Category = () => {
  const { slug = '' } = useParams();
  const { posts, loading } = useCategoryPosts(slug, 50);
  const meta = META[slug];
  const label = meta?.label ?? slug;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://dailynews100.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": label,
        "item": `https://dailynews100.com/category/${slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {meta && (
        <Helmet>
          <title>{meta.metaTitle}</title>
          <meta name="description" content={meta.metaDescription} />
          <meta name="keywords" content={meta.keywords.join(', ')} />
          <link rel="canonical" href={`https://dailynews100.com/category/${slug}`} />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content={meta.metaTitle} />
          <meta property="og:description" content={meta.metaDescription} />
          <meta property="og:image" content="https://dailynews100.com/placeholder.svg" />
          <meta property="og:url" content={`https://dailynews100.com/category/${slug}`} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={meta.metaTitle} />
          <meta name="twitter:description" content={meta.metaDescription} />
          <meta name="twitter:image" content="https://dailynews100.com/placeholder.svg" />
          <script type="application/ld+json">{JSON.stringify(breadcrumbs)}</script>
        </Helmet>
      )}
      <Header />
      <main id="main-content" className="flex-1">
        {loading ? (
          <div className="container-blog py-10">
            <h1 className="section-title" dangerouslySetInnerHTML={{ __html: meta?.h1 ?? label }} />
            {meta && <p className="text-muted-foreground max-w-3xl mb-6">{meta.metaDescription}</p>}
            <CategoryPageSkeleton />
          </div>
        ) : (
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
        )}
      </main>
      <Footer />
    </div>
  );
};

export const metadata = {
  robots: {
    index: true,
    follow: true
  }
};

export default Category;

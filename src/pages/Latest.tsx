import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/news/NewsCard';
import { usePosts } from '@/hooks/usePosts';
import { LatestPageSkeleton } from '@/components/news/NewsCardSkeleton';
import { Helmet } from 'react-helmet-async';

const Latest = () => {
  const { posts, loading } = usePosts({ limit: 50 });
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Latest News — Real-time Updates | DailyNews100</title>
        <meta name="description" content="Read the latest breaking news updates as they happen. We bring you real-time news coverage of global politics, sports, entertainment, technology, and business." />
        <link rel="canonical" href="https://dailynews100.com/latest" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Latest News — Real-time Updates | DailyNews100" />
        <meta property="og:description" content="Read the latest breaking news updates as they happen. We bring you real-time news coverage of global politics, sports, entertainment, technology, and business." />
        <meta property="og:image" content="https://dailynews100.com/placeholder.svg" />
        <meta property="og:url" content="https://dailynews100.com/latest" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Latest News — Real-time Updates | DailyNews100" />
        <meta name="twitter:description" content="Read the latest breaking news updates as they happen. We bring you real-time news coverage of global politics, sports, entertainment, technology, and business." />
        <meta name="twitter:image" content="https://dailynews100.com/placeholder.svg" />
      </Helmet>
      <Header />
      <main id="main-content" className="flex-1">
        {loading ? (
          <LatestPageSkeleton count={50} />
        ) : (
          <div className="container-blog py-10">
            <h1 className="section-title">Latest News</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((p) => <NewsCard key={p.id} post={p} size="lg" />)}
            </div>
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

export default Latest;

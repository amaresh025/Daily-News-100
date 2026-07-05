import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/news/NewsCard';
import { usePosts } from '@/hooks/usePosts';
import { LatestPageSkeleton } from '@/components/news/NewsCardSkeleton';

const Latest = () => {
  const { posts, loading } = usePosts({ limit: 50 });
  return (
    <div className="min-h-screen bg-background flex flex-col">
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

export default Latest;

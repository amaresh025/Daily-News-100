import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BreakingTicker from '@/components/news/BreakingTicker';
import TopHeadline from '@/components/news/TopHeadline';
import LatestNews from '@/components/news/LatestNews';
import TrendingNews from '@/components/news/TrendingNews';
import CategorySection from '@/components/news/CategorySection';
import MostRead from '@/components/news/MostRead';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>DailyNews100 — Latest Breaking News, Politics, Business & Tech</title>
        <meta name="description" content="Stay updated with the latest news, breaking updates, politics, sports, business, technology, and health reports from around the world on DailyNews100." />
        <link rel="canonical" href="https://dailynews100.com" />
        <meta property="og:title" content="DailyNews100 — Latest Breaking News, Politics, Business & Tech" />
        <meta property="og:description" content="Stay updated with the latest news, breaking updates, politics, sports, business, technology, and health reports from around the world on DailyNews100." />
        <meta property="og:url" content="https://dailynews100.com" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <BreakingTicker />
      <main id="main-content" className="flex-1">
        <TopHeadline />
        <LatestNews />
        <TrendingNews />
        <CategorySection title="Politics" slug="politics" />
        <CategorySection title="Accidents" slug="accidents" />
        <CategorySection title="Business" slug="business" />
        <CategorySection title="Sports" slug="sports" />
        <CategorySection title="Entertainment" slug="entertainment" />
        <CategorySection title="Technology" slug="technology" />
        <MostRead />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

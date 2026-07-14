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
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://dailynews100.com/#website",
        "url": "https://dailynews100.com/",
        "name": "DailyNews100",
        "description": "DailyNews100 brings you the latest world news on politics, business, sports, entertainment, technology, health and more.",
        "publisher": {
          "@id": "https://dailynews100.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://dailynews100.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://dailynews100.com/#organization",
        "name": "DailyNews100",
        "url": "https://dailynews100.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://dailynews100.com/logo.png"
        },
        "sameAs": [
          "https://www.facebook.com/dailynews100",
          "https://twitter.com/dailynews100",
          "https://www.instagram.com/dailynews100"
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>DailyNews100 — Latest Breaking News, Politics, Business & Tech</title>
        <meta name="description" content="Stay updated with the latest news, breaking updates, politics, sports, business, technology, and health reports from around the world on DailyNews100." />
        <link rel="canonical" href="https://dailynews100.com" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="DailyNews100 — Latest Breaking News, Politics, Business & Tech" />
        <meta property="og:description" content="Stay updated with the latest news, breaking updates, politics, sports, business, technology, and health reports from around the world on DailyNews100." />
        <meta property="og:image" content="https://dailynews100.com/placeholder.svg" />
        <meta property="og:url" content="https://dailynews100.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DailyNews100 — Latest Breaking News, Politics, Business & Tech" />
        <meta name="twitter:description" content="Stay updated with the latest news, breaking updates, politics, sports, business, technology, and health reports from around the world on DailyNews100." />
        <meta name="twitter:image" content="https://dailynews100.com/placeholder.svg" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <Header />
      <BreakingTicker />
      <main id="main-content" className="flex-1">
        <h1 className="sr-only">DailyNews100 – Latest Breaking News, Technology, Business, Sports & World News</h1>
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

export const metadata = {
  robots: {
    index: true,
    follow: true
  }
};

export default Index;

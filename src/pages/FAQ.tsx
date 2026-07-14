import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What is DailyNews100?',
    a: 'DailyNews100 is a global digital news portal that publishes the latest stories on politics, accidents, business, sports, entertainment, technology and health. Our newsroom curates fast, fact-checked reports from trusted sources around the world so you always stay informed.',
  },
  {
    q: 'Is DailyNews100 free?',
    a: 'Yes. DailyNews100 is completely free to read. There is no subscription, no paywall and no signup required to access articles, videos or live updates.',
  },
  {
    q: 'How do you ensure news accuracy?',
    a: 'Every story is reviewed by our editorial desk before publishing. We cross-check facts against multiple credible sources, attribute quotes and data clearly, and issue prompt corrections whenever an error is identified.',
  },
  {
    q: 'How do I comment on an article?',
    a: 'Scroll to the bottom of any article and you will find the comments section. Enter your name, email (kept private) and your message, then submit. Your comment will appear once it is approved by a moderator.',
  },
  {
    q: 'Why is my comment not showing immediately?',
    a: 'All comments pass through a moderation queue to keep discussions safe and on-topic. Approved comments usually go live within a few hours.',
  },
  {
    q: 'Do you sell my personal information?',
    a: 'No. DailyNews100 does not sell personal information. We collect only what is necessary to run the site and improve your experience, as described in our Privacy Policy.',
  },
  {
    q: 'Why do I see ads on DailyNews100?',
    a: 'Advertising helps us keep DailyNews100 free for every reader. Ads support our journalism, hosting and the salaries of our editorial team. We do our best to keep ads non-intrusive.',
  },
  {
    q: 'Can I republish your articles on my site?',
    a: 'DailyNews100 content is protected by copyright. You may share short excerpts (up to 100 words) with a clear link back to the original article. For full republication, please contact us through our Contact page for written permission.',
  },
  {
    q: 'How can I contact DailyNews100?',
    a: 'You can reach the newsroom through our Contact page. We respond to news tips, advertising enquiries, feedback and partnership requests as quickly as possible.',
  },
  {
    q: 'How often is the site updated?',
    a: 'DailyNews100 is updated around the clock, 24/7. Breaking stories appear within minutes, while in-depth reports and analyses are published throughout the day.',
  },
];

export default function FAQ() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>FAQ — Frequently Asked Questions | DailyNews100</title>
        <meta name="description" content="Find answers to frequently asked questions about DailyNews100, including details on our reporting, comment moderation, privacy, ads, and republishing rules." />
        <link rel="canonical" href="https://dailynews100.com/faq" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="FAQ — Frequently Asked Questions | DailyNews100" />
        <meta property="og:description" content="Find answers to frequently asked questions about DailyNews100, including details on our reporting, comment moderation, privacy, ads, and republishing rules." />
        <meta property="og:image" content="https://dailynews100.com/placeholder.svg" />
        <meta property="og:url" content="https://dailynews100.com/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ — Frequently Asked Questions | DailyNews100" />
        <meta name="twitter:description" content="Find answers to frequently asked questions about DailyNews100, including details on our reporting, comment moderation, privacy, ads, and republishing rules." />
        <meta name="twitter:image" content="https://dailynews100.com/placeholder.svg" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />
      <main id="main-content" className="flex-1 container-blog py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Frequently Asked Questions</h1>
          <p className="text-muted-foreground mb-8">
            Quick answers about DailyNews100 — our newsroom, comments, privacy and republishing rules.
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-lg px-4 bg-card">
                <AccordionTrigger className="text-left font-semibold text-base hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export const metadata = {
  robots: {
    index: true,
    follow: true
  }
};

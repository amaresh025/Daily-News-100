import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  const updated = 'June 12, 2026';
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms of Use | DailyNews100</title>
        <meta name="description" content="Read the Terms of Use for DailyNews100. Understand the terms that govern your use of our site, including content rights, user conduct, comments, and liability." />
        <link rel="canonical" href="https://dailynews100.com/terms" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Terms of Use | DailyNews100" />
        <meta property="og:description" content="Read the Terms of Use for DailyNews100. Understand the terms that govern your use of our site, including content rights, user conduct, comments, and liability." />
        <meta property="og:image" content="https://dailynews100.com/placeholder.svg" />
        <meta property="og:url" content="https://dailynews100.com/terms" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Use | DailyNews100" />
        <meta name="twitter:description" content="Read the Terms of Use for DailyNews100. Understand the terms that govern your use of our site, including content rights, user conduct, comments, and liability." />
        <meta name="twitter:image" content="https://dailynews100.com/placeholder.svg" />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Terms of Use</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {updated}</p>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8 dark:prose-invert">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Acceptance of terms</h2>
              <p>By accessing DailyNews100 you agree to these Terms of Use. If you do not agree, please discontinue use of the site.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Editorial content</h2>
              <p>All articles, images, videos, graphics and other content on DailyNews100 are owned by us or our licensors and are protected by international copyright laws. You may share short excerpts (up to 100 words) with a clear link back to the original article. For longer republication, written permission is required — please use the Contact page.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. User comments &amp; submissions</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are responsible for anything you post.</li>
                <li>Comments must not contain hate speech, harassment, illegal content, spam or personal attacks.</li>
                <li>We moderate every comment and reserve the right to remove any submission at our discretion.</li>
                <li>By submitting a comment, you grant DailyNews100 a non-exclusive, royalty-free licence to display it.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. Accuracy &amp; corrections</h2>
              <p>We strive for accuracy in every article. If you find an error, please let us know through the Contact page and we will review and correct it promptly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Third-party links</h2>
              <p>Articles may link to external websites. DailyNews100 is not responsible for the content, accuracy or practices of any third-party site.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Disclaimer</h2>
              <p>Content on DailyNews100 is provided for general information only and does not constitute legal, medical, financial or professional advice. Use of the site is at your own risk.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Limitation of liability</h2>
              <p>To the maximum extent permitted by law, DailyNews100 and its team are not liable for any indirect, incidental or consequential damages arising from your use of the site.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Changes to these terms</h2>
              <p>We may update these terms at any time. Continued use of the site after changes means you accept the revised terms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. Contact</h2>
              <p>Questions about these terms? Use the Contact page and our team will respond.</p>
            </section>
          </div>
        </div>
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

export default Terms;

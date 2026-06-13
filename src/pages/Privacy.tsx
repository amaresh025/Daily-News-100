import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  const updated = 'June 12, 2026';
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | DailyNews100</title>
        <meta name="description" content="How DailyNews100 collects, uses and protects your personal information when you read the site, comment or contact us." />
        <link rel="canonical" href="/privacy" />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {updated}</p>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8 dark:prose-invert">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. Who we are</h2>
              <p>DailyNews100 (“we”, “us”, “our”) operates this website to publish news and editorial content for a global audience. This Privacy Policy explains what information we collect, how we use it and what choices you have.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Information we collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Information you provide:</strong> name, email and message when you contact us or post a comment.</li>
                <li><strong>Automatic data:</strong> device type, browser, IP address, pages viewed and referring URL — used only to keep the site secure and to measure traffic.</li>
                <li><strong>Cookies &amp; local storage:</strong> small files that remember your theme, “liked” articles and basic analytics. You can clear them at any time in your browser.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. How we use information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>To publish and moderate user comments.</li>
                <li>To respond to messages sent through the contact form.</li>
                <li>To keep the site secure, fast and free from abuse.</li>
                <li>To measure aggregate readership (no personal profiles).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. We do not sell your data</h2>
              <p>DailyNews100 never sells, rents or trades personal information. Commenter email addresses are never displayed publicly and are only visible to our moderators.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Advertising</h2>
              <p>Non-intrusive advertising helps keep the site free. Ad partners may use cookies to serve relevant ads. You can opt out at any time through your browser settings or your regional ad-choices programme.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Your rights</h2>
              <p>Depending on where you live, you may have the right to access, correct or delete the personal data we hold about you. Contact us through the Contact page and we will respond promptly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. Children</h2>
              <p>DailyNews100 is not directed at children under 13. We do not knowingly collect data from children. If you believe a child has provided us information, contact us and we will delete it.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Changes to this policy</h2>
              <p>We may update this policy from time to time. Material changes will be highlighted on this page with a new “Last updated” date.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-3">9. Contact</h2>
              <p>Questions about this policy? Reach out through our Contact page and our team will reply as soon as possible.</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;

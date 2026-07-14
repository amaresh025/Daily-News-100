import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Disclaimer = () => {
  const updated = 'July 7, 2026';
  const siteName = 'DailyNews100';

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Disclaimer | {siteName}</title>
        <meta name="description" content={`Disclaimer and terms of content for ${siteName}. Learn about our strict reporting guidelines, accuracy commitments, editorial policies, and AI utilization.`} />
        <link rel="canonical" href={`https://dailynews100.com/disclaimer`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`Disclaimer | ${siteName}`} />
        <meta property="og:description" content={`Disclaimer and terms of content for ${siteName}. Learn about our strict reporting guidelines, accuracy commitments, editorial policies, and AI utilization.`} />
        <meta property="og:image" content="https://dailynews100.com/placeholder.svg" />
        <meta property="og:url" content={`https://dailynews100.com/disclaimer`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Disclaimer | ${siteName}`} />
        <meta name="twitter:description" content={`Disclaimer and terms of content for ${siteName}. Learn about our strict reporting guidelines, accuracy commitments, editorial policies, and AI utilization.`} />
        <meta name="twitter:image" content="https://dailynews100.com/placeholder.svg" />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Disclaimer</h1>
          <p className="text-sm text-muted-foreground mb-8">Last updated: {updated}</p>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-8 dark:prose-invert">
            <section className="border-b border-border/50 pb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">1. General Information</h2>
              <p>
                All content published on {siteName} (including articles, blog posts, newsletters, analyses, reports, graphics, and video content) is created and shared for general informational and news purposes only. Under no circumstances should the materials on this website be construed as legal, medical, financial, or other forms of professional advice.
              </p>
            </section>

            <section className="border-b border-border/50 pb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">2. Accuracy &amp; Completeness</h2>
              <p>
                While we strive to research, verify, and present information that is accurate, reliable, and up to date, {siteName} makes no representations, warranties, or guarantees of any kind, express or implied, regarding the completeness, accuracy, reliability, suitability, or availability of the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.
              </p>
            </section>

            <section className="border-b border-border/50 pb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">3. Editorial Responsibility &amp; Opinions</h2>
              <p>
                The opinions, findings, views, and columns expressed in individual articles or comments on {siteName} belong solely to their respective authors and contributors and do not necessarily reflect the official policy, position, or view of {siteName}, its editorial desk, publishers, or corporate entities.
              </p>
            </section>

            <section className="border-b border-border/50 pb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">4. External Links &amp; Third-Party Websites</h2>
              <p>
                Through this website, you are able to link to other websites that are not under the control of {siteName}. We have no control over the nature, content, availability, security, or privacy practices of those external sites. The inclusion of any link does not imply a recommendation or endorsement of the views expressed within them.
              </p>
            </section>

            <section className="border-b border-border/50 pb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">5. Copyright &amp; Trademarks</h2>
              <p>
                All original content, designs, code, and graphics on this website belong to {siteName} unless explicitly stated otherwise. All third-party logos, trademarks, product names, registered brands, and company names referenced or displayed on {siteName} remain the property of their respective owners. Their mention does not imply any affiliation, sponsorship, or endorsement by {siteName}.
              </p>
            </section>

            <section className="border-b border-border/50 pb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">6. Fair Use</h2>
              <p>
                This website may contain copyrighted material, the use of which has not always been specifically authorized by the copyright owner. In accordance with applicable fair use principles under copyright law, we distribute such materials for reporting, commentary, criticism, news reporting, and educational purposes. If you wish to use copyrighted material from this site for purposes of your own that go beyond fair use, you must obtain permission from the copyright owner.
              </p>
            </section>

            <section className="border-b border-border/50 pb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">7. AI &amp; Editorial Process</h2>
              <p>
                In alignment with modern news publishing workflows, some content on {siteName} may be generated, structured, or assisted using artificial intelligence (AI) tools. Regardless of AI assistance, all articles go through our editorial review and verification process to ensure quality, accuracy, style compliance, and adherence to our ethical reporting guidelines before publication.
              </p>
            </section>

            <section className="pb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">8. Changes and Updates</h2>
              <p>
                {siteName} reserves the right to modify, amend, or update this Disclaimer at any time and without prior notice. We encourage readers to review this page periodically to stay informed of any changes. Your continued use of the website following any modifications will constitute your acknowledgment and acceptance of the revised Disclaimer.
              </p>
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

export default Disclaimer;

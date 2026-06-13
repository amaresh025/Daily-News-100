import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Clock, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>About DailyNews100 — Who We Are</title>
        <meta name="description" content="DailyNews100 is a global digital news portal delivering fast, fact-checked stories across politics, business, sports, entertainment, technology and health." />
        <link rel="canonical" href="/about" />
      </Helmet>
      <Header />
      <main id="main-content" className="container-blog py-12">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">About DailyNews100</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Latest News, Fast &amp; Reliable — a global newsroom delivering stories that matter, 24/7.
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                DailyNews100 was built on a simple idea: every reader, in every country, deserves access
                to clear, accurate and timely news without a paywall. We cover politics, accidents,
                business, sports, entertainment, technology and health with the same editorial care we
                would want as readers ourselves.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our editors verify every story against multiple credible sources before publishing.
                When mistakes happen, we correct them transparently and quickly. Independence,
                accuracy and speed are the values that guide every byline.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We are reader-supported through non-intrusive advertising — we never sell personal
                information, and our editorial coverage is never influenced by advertisers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-card border border-border p-5 rounded-lg flex gap-4">
                <Globe className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div><h3 className="font-semibold mb-1">Global Coverage</h3><p className="text-sm text-muted-foreground">Stories from every continent, updated around the clock.</p></div>
              </div>
              <div className="bg-card border border-border p-5 rounded-lg flex gap-4">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div><h3 className="font-semibold mb-1">Fact-Checked</h3><p className="text-sm text-muted-foreground">Multi-source verification before every publish.</p></div>
              </div>
              <div className="bg-card border border-border p-5 rounded-lg flex gap-4">
                <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div><h3 className="font-semibold mb-1">24/7 Newsroom</h3><p className="text-sm text-muted-foreground">Breaking updates within minutes of events.</p></div>
              </div>
              <div className="bg-card border border-border p-5 rounded-lg flex gap-4">
                <Users className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div><h3 className="font-semibold mb-1">Free for Everyone</h3><p className="text-sm text-muted-foreground">No paywall. No subscription. No signup required.</p></div>
              </div>
            </div>
          </div>

          <div className="text-center bg-muted p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-3">Got a story tip or feedback?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our editors read every message. Reach out through the contact form and we will get back to you as soon as we can.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg"><Link to="/contact">Contact Us</Link></Button>
              <Button variant="outline" size="lg" asChild><Link to="/latest">Read Latest News</Link></Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;

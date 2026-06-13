import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-foreground text-background mt-12" role="contentinfo">
      <div className="container-blog py-12">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-baseline">
              <span className="text-2xl font-extrabold">DailyNews</span>
              <span className="text-2xl font-extrabold text-primary">100</span>
            </div>

            <p className="text-sm opacity-80">
              Latest News, Fast &amp; Reliable. Politics, business, sports,
              entertainment, technology and more — delivered around the clock.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wide text-sm">Categories</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link to="/category/politics" className="hover:text-primary">Politics</Link></li>
              <li><Link to="/category/accidents" className="hover:text-primary">Accidents</Link></li>
              <li><Link to="/category/business" className="hover:text-primary">Business</Link></li>
              <li><Link to="/category/sports" className="hover:text-primary">Sports</Link></li>
              <li><Link to="/category/entertainment" className="hover:text-primary">Entertainment</Link></li>
              <li><Link to="/category/technology" className="hover:text-primary">Technology</Link></li>
              <li><Link to="/category/health" className="hover:text-primary">Health</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wide text-sm">Company</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary">Terms of Use</Link></li>
              <li><Link to="/sitemap" className="hover:text-primary">Sitemap</Link></li>
            </ul>

          </div>

          <div className="space-y-3">
            <h3 className="font-bold uppercase tracking-wide text-sm">Follow Us</h3>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="p-2 bg-background/10 rounded hover:bg-primary transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" aria-label="Twitter" className="p-2 bg-background/10 rounded hover:bg-primary transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" aria-label="Instagram" className="p-2 bg-background/10 rounded hover:bg-primary transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="#" aria-label="YouTube" className="p-2 bg-background/10 rounded hover:bg-primary transition-colors"><Youtube className="h-4 w-4" /></a>
            </div>
            <p className="text-xs opacity-70 pt-4">
              For news tips, advertising or feedback, please use the Contact page.
            </p>
          </div>
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs opacity-70">© {year} DailyNews100. All rights reserved.</p>
          <p className="text-xs opacity-70">Latest News, Fast &amp; Reliable.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

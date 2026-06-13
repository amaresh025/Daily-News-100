import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Facebook, Twitter, Instagram, Menu, X, Youtube, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Latest News', href: '/latest' },
  { name: 'Politics', href: '/category/politics' },
  { name: 'Accidents', href: '/category/accidents' },
  { name: 'Business', href: '/category/business' },
  { name: 'Sports', href: '/category/sports' },
  { name: 'Entertainment', href: '/category/entertainment' },
  { name: 'Technology', href: '/category/technology' },
  { name: 'Health', href: '/category/health' },
  { name: 'Contact', href: '/contact' },
];

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter / X' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  const showBack = location.pathname !== '/';

  const goBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      // Force a fresh load after navigating back, as requested.
      setTimeout(() => window.location.reload(), 50);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="hidden md:block bg-foreground text-background text-xs">
        <div className="container-blog flex items-center justify-between h-8">
          <span className="opacity-80">{today}</span>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} aria-label={label} className="opacity-80 hover:opacity-100 transition-opacity">
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-blog">
        <div className="flex items-center justify-between h-20 gap-2">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
            {showBack && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={goBack} aria-label="Go back" className="shrink-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
            )}
            <Link to="/" className="flex items-center gap-2 min-w-0" aria-label="DailyNews100 home">
              <span className="inline-flex items-baseline">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">DailyNews</span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">100</span>
              </span>
              <span className="hidden lg:inline text-[10px] uppercase tracking-widest text-muted-foreground border-l border-border pl-2 ml-1">
                Latest News
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" aria-label="Search articles" onClick={() => navigate('/search')}>
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <nav className="hidden lg:block border-t border-border" role="navigation" aria-label="Main navigation">
          <ul className="flex items-center gap-1 -mx-2 overflow-x-auto">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `text-sm font-semibold uppercase tracking-wide px-3 py-3 block transition-colors duration-150
                     hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded
                     ${isActive ? 'text-primary border-b-2 border-primary' : 'text-foreground border-b-2 border-transparent'}`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {isMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="flex flex-col" role="navigation" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    `py-2 px-2 text-sm font-semibold uppercase tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded ${isActive ? 'text-primary' : 'text-foreground'}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

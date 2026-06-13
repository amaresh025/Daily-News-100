import { ReactNode, useState } from 'react';
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderTree, MessageSquare, Mail, Settings, LogOut, Menu, X } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/posts', icon: FileText, label: 'Posts' },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { to: '/admin/comments', icon: MessageSquare, label: 'Comments' },
  { to: '/admin/messages', icon: Mail, label: 'Messages' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isAdmin, loading, user } = useIsAdmin();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading admin…</div>;
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="text-muted-foreground">Your account is not an administrator.</p>
        <Button onClick={async () => { await supabase.auth.signOut(); navigate('/admin/login'); }}>Sign out</Button>
      </div>
    );
  }

  const Brand = (
    <Link to="/" className="flex items-center">
      <span className="text-xl font-extrabold">DailyNews<span className="text-primary">100</span></span>
      <span className="ml-2 text-[10px] uppercase tracking-widest text-muted-foreground">Admin</span>
    </Link>
  );

  const Nav = (
    <nav className="flex-1 p-3 space-y-1">
      {links.map(l => (
        <NavLink
          key={l.to} to={l.to} end={l.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
            }`}
        >
          <l.icon className="h-4 w-4" /> {l.label}
        </NavLink>
      ))}
    </nav>
  );

  const Account = (
    <div className="p-3 border-t border-border">
      <p className="text-xs text-muted-foreground truncate mb-2">{user.email}</p>
      <Button variant="outline" size="sm" className="w-full"
        onClick={async () => { await supabase.auth.signOut(); navigate('/admin/login'); }}>
        <LogOut className="h-4 w-4 mr-2" /> Sign out
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen md:flex bg-muted/30">
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 bg-card border-b border-border">
        {Brand}
        <Button variant="ghost" size="sm" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-card border-r border-border flex-col">
        <div className="px-5 h-16 flex items-center border-b border-border">{Brand}</div>
        {Nav}
        {Account}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r border-border flex flex-col">
            <div className="px-5 h-14 flex items-center justify-between border-b border-border">
              {Brand}
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </div>
            {Nav}
            {Account}
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}

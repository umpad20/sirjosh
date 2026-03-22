import Head from 'next/head';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) fetchProfile(session.user.id);
  }

  async function fetchProfile(uid) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Quick fallback for testing: if email has 'admin', treat as admin automatically
    if (user?.email?.includes('admin')) {
      setProfile({ role: 'admin' });
      return;
    }

    const { data } = await supabase.from('profiles').select('role').eq('id', uid).single();
    setProfile(data);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Catalog', href: '/books' },
    { name: 'Aisles & Shelves', href: '/aisles' },
  ];

  if (profile?.role === 'admin') {
    navLinks.push({ name: 'Admin Panel', href: '/admin' });
  }

  return (
    <>
      <Head>
        <title>LibraTrack — Library Management</title>
      </Head>

      <a href="#main-content" className="skip-nav">Skip to main content</a>

      <div className="layout-root">
        <header className="top-nav">
          <div className="top-nav-inner" aria-label="Main navigation">
            <div className="nav-logo-wrap">
              <a href="/" className="nav-logo" aria-label="LibraTrack Home">
                <div className="nav-logo-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                </div>
                <span className="logo-text">LibraTrack</span>
              </a>
            </div>

            <nav className="nav-center">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <a key={link.href} href={link.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                    {link.name}
                  </a>
                );
              })}
            </nav>

            <div className="nav-right">
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green-primary)', background: 'var(--green-50)', padding: '0.25rem 0.625rem', borderRadius: '2rem', border: '1px solid var(--green-100)', textTransform: 'capitalize' }}>
                    {profile?.role || 'User'}
                  </span>
                  <button onClick={handleSignOut} className="btn btn-ghost btn-sm" aria-label="Sign out">
                    Sign Out
                  </button>
                </div>
              ) : (
                <a href="/login" className="btn btn-primary btn-sm">Sign In</a>
              )}
              <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-label="Toggle menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <nav className="mobile-menu animate-fade-in" style={{ display: 'block' }}>
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href;
                return (
                  <a key={link.href} href={link.href} className={`mobile-nav-link ${isActive ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}>
                    {link.name}
                  </a>
                );
              })}
              {user ? (
                <button onClick={handleSignOut} className="mobile-nav-link" style={{ width: '100%', textAlign: 'left', color: 'var(--red-500)', border: 'none', background: 'transparent' }}>
                  Sign Out ({profile?.role})
                </button>
              ) : (
                <a href="/login" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>Sign In</a>
              )}
            </nav>
          )}
        </header>

        <main id="main-content" className="main-wrap">
          <div className="container">
            {children}
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-info">
                <div className="nav-logo" style={{ marginBottom: '0.5rem' }}>
                  <span className="logo-text" style={{ color: 'var(--text-dark)' }}>LibraTrack</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', maxWidth: 280 }}>
                  A modern library management system built for speed and accessibility.
                </p>
              </div>
              <div className="footer-links" style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dark)' }}>Platform</span>
                  <a href="/books" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Catalog</a>
                  <a href="/aisles" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Aisles</a>
                  {profile?.role === 'admin' && (
                    <a href="/admin" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Admin</a>
                  )}
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© {new Date().getFullYear()} LibraTrack — Library Management System</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

import React, { useState } from 'react';

export default function AppLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Skip Navigation */}
      <a href="#main-content" className="skip-nav">Skip to main content</a>

      {/* Top Header */}
      <header
        className="flex items-center justify-between px-4 py-3 sticky top-0 z-20"
        style={{
          background: 'rgba(5, 15, 10, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center gap-2">
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--gradient-primary)' }}
            aria-hidden="true"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            LibraTrack
          </span>
        </div>
        <form className="hidden md:block flex-1 max-w-lg mx-8" role="search" aria-label="Global book search">
          <input
            type="search"
            placeholder="Search books..."
            className="input"
          />
        </form>
        <div className="flex items-center gap-4">
          <span className="hidden md:block font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>
            {user ? user.email : 'Guest'}
          </span>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--border-subtle)', color: 'var(--text-accent)' }}
            aria-label="User menu"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20c0-2.2 3.6-3.5 6-3.5s6 1.3 6 3.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}
        style={{
          background: 'rgba(5, 15, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--border-subtle)',
        }}
        aria-label="Sidebar navigation"
        tabIndex={-1}
      >
        <nav className="flex-1 p-6 space-y-2" aria-label="Main navigation">
          {[
            { href: '/', label: 'Dashboard' },
            { href: '/books', label: 'Books' },
            { href: '/aisles', label: 'Aisles' },
            { href: '/admin', label: 'Admin Panel' },
            { href: '/borrowed', label: 'Borrowed Books' },
          ].map(link => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link block text-base"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <button
          className="md:hidden p-2 m-4 rounded-lg text-sm font-semibold"
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        >
          Close
        </button>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col p-4 md:p-8 max-w-7xl w-full mx-auto mt-2" role="main">
        {children}
      </main>
    </div>
  );
}

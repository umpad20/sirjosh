import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

// Generate a consistent gradient from a string (category/title)
export function getCoverGradient(str) {
  const gradients = [
    'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
    'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
    'linear-gradient(135deg, #be185d 0%, #f472b6 100%)',
    'linear-gradient(135deg, #c2410c 0%, #fb923c 100%)',
    'linear-gradient(135deg, #15803d 0%, #4ade80 100%)',
    'linear-gradient(135deg, #0e7490 0%, #22d3ee 100%)',
    'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)',
  ];
  let hash = 0;
  for (let i = 0; i < (str || '').length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
}

// variant: "vertical" (dashboard) or "horizontal" (catalog)
export default function BookCard({ book, variant = 'horizontal' }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from('profiles').select('role').eq('id', session.user.id).single()
          .then(({ data }) => setProfile(data));
      }
    });
  }, []);

  const status = book.quantity > 2 ? 'available' : book.quantity > 0 ? 'low' : 'unavailable';
  const statusLabel = { available: 'Available', low: 'Low Stock', unavailable: 'Unavailable' }[status];
  const badgeClass = { available: 'badge-available', low: 'badge-low', unavailable: 'badge-unavailable' }[status];
  const dotClass = { available: 'badge-dot-green', low: 'badge-dot-orange', unavailable: 'badge-dot-red' }[status];

  async function handleRequestBorrow(e) {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!user) return alert('Please sign in to borrow books.');
    setRequesting(true);
    try {
      const { error } = await supabase.from('borrows').insert([
        { user_id: user.id, book_id: book.id, status: 'pending' }
      ]);
      if (error) throw error;
      setRequestSent(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setRequesting(false);
    }
  }

  const canBorrow = profile?.role === 'student' && book.quantity > 0;
  const coverGradient = getCoverGradient(book.category || book.title);
  const isHorizontal = variant === 'horizontal';

  // ──────────── HORIZONTAL CARD (Catalog) ────────────
  if (isHorizontal) {
    return (
      <Link href={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <article className="catalog-card animate-fade-in" tabIndex={0} aria-label={`Book: ${book.title}`}
          style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}
        >
          {/* Mini Cover */}
          <div style={{
            width: 90, minWidth: 90, minHeight: 120, flexShrink: 0,
            borderRadius: '0.75rem', margin: '0.75rem', position: 'relative', overflow: 'hidden',
            background: book.image_url ? `url(${book.image_url}) center/cover no-repeat` : coverGradient
          }}>
            {!book.image_url && (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)', borderRadius: 'inherit' }} />
                <div style={{ position: 'relative', zIndex: 2, color: '#fff', fontSize: '0.625rem', fontWeight: 800, lineHeight: 1.2, padding: '0.625rem 0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                  <span style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', borderLeft: '2px solid rgba(255,255,255,0.4)', paddingLeft: '0.375rem' }}>
                    {book.title}
                  </span>
                  <span style={{ fontSize: '0.5rem', opacity: 0.8, fontWeight: 500 }}>{book.author}</span>
                </div>
              </>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, padding: '0.875rem 1rem 0.875rem 0.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.125rem', minWidth: 0 }}>
            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-dark)', lineHeight: 1.3, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.title}</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0 0 0.125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{book.author}</p>
            {book.category && (
              <span className="category-badge" style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem', marginTop: '0.25rem', alignSelf: 'flex-start' }}>{book.category}</span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.375rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 16 20 12.3 20 10a8 8 0 10-16 0c0 2.3 2.7 6 8 11.7z" /></svg>
                Aisle {book.aisle}, Shelf {book.shelf}
              </span>
              <span className={`badge ${badgeClass}`} style={{ fontSize: '0.6875rem', padding: '0.125rem 0.5rem' }}>
                <span className={`badge-dot ${dotClass}`} />
                {book.quantity} available
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  // ──────────── VERTICAL CARD (Dashboard) ────────────
  return (
    <Link href={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <article className="card animate-fade-in" tabIndex={0} aria-label={`Book: ${book.title}`}
        style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
      >
        <div className="book-card-cover" style={{
          background: book.image_url ? `url(${book.image_url}) center/cover no-repeat` : coverGradient,
          minHeight: 160
        }}>
          {!book.image_url && (
            <>
              <div className="book-card-cover-pattern" />
              <svg className="book-card-cover-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </>
          )}
        </div>
        <div className="book-card-body" style={{ flex: 1 }}>
          <h3 className="book-card-title">{book.title}</h3>
          <div className="book-card-author">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            <span>{book.author}</span>
          </div>
          <div className="book-card-badges">
            {book.category && <span className="category-badge">{book.category}</span>}
            <span className={`badge ${badgeClass}`}><span className={`badge-dot ${dotClass}`} />{statusLabel}</span>
          </div>
          <div className="book-card-meta">
            <span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 16 20 12.3 20 10a8 8 0 10-16 0c0 2.3 2.7 6 8 11.7z" /></svg>
              Aisle {book.aisle}, Shelf {book.shelf}
            </span>
            <span>Qty: <strong style={{ color: 'var(--text-dark)' }}>{book.quantity}</strong></span>
          </div>
        </div>
        {canBorrow && (
          <div className="book-card-action">
            {requestSent ? (
              <div className="alert-success" style={{ fontSize: '0.75rem', padding: '0.5rem', textAlign: 'center' }}>✓ Request Sent!</div>
            ) : (
              <button onClick={(e) => handleRequestBorrow(e)} disabled={requesting}
                className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: '0.75rem' }}>
                {requesting ? 'Requesting...' : 'Request Borrow'}
              </button>
            )}
          </div>
        )}
      </article>
    </Link>
  );
}

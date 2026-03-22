import React from 'react';

export default function BookCard({ book }) {
  const status = book.quantity > 2 ? 'available' : book.quantity > 0 ? 'low' : 'unavailable';
  const statusLabel = { available: 'Available', low: 'Low Stock', unavailable: 'Unavailable' }[status];
  const badgeClass = { available: 'badge-available', low: 'badge-low', unavailable: 'badge-unavailable' }[status];
  const dotClass = { available: 'badge-dot-green', low: 'badge-dot-orange', unavailable: 'badge-dot-red' }[status];

  return (
    <article className="card" tabIndex={0} aria-label={`Book: ${book.title}`}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0, lineHeight: 1.3 }}>
          {book.title}
        </h3>
        <span className={`badge ${badgeClass}`} role="status" aria-live="polite">
          <span className={`badge-dot ${dotClass}`} aria-hidden="true" />
          {statusLabel}
        </span>
      </header>

      <div style={{ display: 'grid', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-body)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          <span>{book.author}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" /></svg>
          <span>{book.category}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 16 20 12.3 20 10a8 8 0 10-16 0c0 2.3 2.7 6 8 11.7z" /></svg>
          Aisle {book.aisle}, Shelf {book.shelf}
        </span>
        <span>Qty: <strong style={{ color: 'var(--text-dark)' }}>{book.quantity}</strong></span>
      </div>
    </article>
  );
}

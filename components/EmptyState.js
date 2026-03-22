import React from 'react';

export default function EmptyState({ message = 'No results found.' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, padding: '2rem' }} role="status" aria-live="polite">
      <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'var(--green-50)', border: '1px solid var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-light)' }} aria-hidden="true">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-muted)' }}>{message}</span>
    </div>
  );
}

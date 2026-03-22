import React from 'react';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200 }} role="status" aria-live="polite">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite', color: 'var(--green-primary)', marginBottom: '0.75rem' }} aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.15" />
        <path d="M12 2a10 10 0 019.2 6.1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-muted)' }}>{message}</span>
    </div>
  );
}

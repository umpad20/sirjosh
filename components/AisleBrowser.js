import React, { useMemo } from 'react';

export default function AisleBrowser({ books = [], onSelectAisle, selectedAisle, onSelectShelf, selectedShelf }) {
  const { aisles, aisleStats } = useMemo(() => {
    const stats = {};
    books.forEach(book => {
      const a = book.aisle || 'Uncategorized';
      if (!stats[a]) {
        stats[a] = { books: 0, shelves: new Set() };
      }
      stats[a].books += 1;
      if (book.shelf) stats[a].shelves.add(book.shelf);
    });

    const uniqueAisles = Object.keys(stats).sort();
    return { aisles: uniqueAisles, aisleStats: stats };
  }, [books]);

  if (aisles.length === 0) {
    return (
      <div>
        <div className="section-header">
          <h2 className="section-title">Library Map</h2>
        </div>
        <div className="card-static" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-light)', marginBottom: '0.75rem' }} aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <p style={{ margin: '0 auto' }}>No sections available yet. Add books to generate the library map.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Library Map</h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {aisles.length} {aisles.length === 1 ? 'aisle' : 'aisles'}
        </span>
      </div>
      <div className="aisle-grid" role="tablist" aria-label="Library aisles">
        {aisles.map(aisle => {
          const info = aisleStats[aisle];
          const shelfCount = info.shelves.size > 0 ? info.shelves.size : 1;

          return (
            <button
              key={aisle}
              className={`aisle-card${selectedAisle === aisle ? ' active' : ''}`}
              onClick={() => onSelectAisle(aisle)}
              role="tab"
              aria-selected={selectedAisle === aisle}
              aria-label={`Aisle ${aisle}`}
            >
              {/* Icon */}
              <div className="aisle-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <div className="aisle-letter">{aisle.charAt(0)}</div>
              <div className="aisle-label">{aisle === 'Uncategorized' ? 'Uncategorized' : `Section ${aisle}`}</div>
              <div className="aisle-count">
                {info.books} {info.books === 1 ? 'book' : 'books'} · {shelfCount} {shelfCount === 1 ? 'shelf' : 'shelves'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Shelf selection */}
      {selectedAisle && aisleStats[selectedAisle]?.shelves.size > 0 && (
        <div className="shelf-selection animate-fade-in" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
          <div className="section-header">
            <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
              Shelves in {selectedAisle === 'Uncategorized' ? 'Uncategorized' : `Aisle ${selectedAisle}`}
            </h3>
          </div>
          <div className="shelf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
            {Array.from(aisleStats[selectedAisle].shelves).map((shelf) => (
              <button
                key={shelf}
                onClick={(e) => { e.preventDefault(); onSelectShelf(shelf); }}
                style={{
                  cursor: 'pointer',
                  border: selectedShelf === shelf ? '2px solid var(--green-primary)' : '1px solid var(--border-light)',
                  borderRadius: '0.5rem',
                  padding: '1rem 0.75rem',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: selectedShelf === shelf ? 600 : 500,
                  backgroundColor: selectedShelf === shelf ? 'var(--green-primary)' : 'transparent',
                  color: selectedShelf === shelf ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.2s ease',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ marginBottom: '0.5rem', display: 'block', margin: '0 auto 0.5rem' }}>
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
                {shelf}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

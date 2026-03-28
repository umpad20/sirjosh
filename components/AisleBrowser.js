import React, { useMemo } from 'react';

export default function AisleBrowser({ books = [], onSelectAisle, selectedAisle }) {
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

              {/* Shelf grid preview */}
              {selectedAisle === aisle && (
                <div className="shelf-grid animate-fade-in" role="tabpanel">
                  {Array.from({ length: shelfCount }, (_, i) => (
                    <div key={i} className="shelf-item" title={`Shelf ${i + 1}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" style={{ marginBottom: 2 }}>
                        <path d="M3 6h18M3 12h18M3 18h18" />
                      </svg>
                      <div>Shelf {i + 1}</div>
                    </div>
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

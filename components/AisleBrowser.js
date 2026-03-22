import React, { useMemo } from 'react';

export default function AisleBrowser({ books = [], onSelectAisle, selectedAisle }) {
  // Dynamically calculate aisles, shelf counts, and book counts
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
          <p>No sections available yet. Add books to generate the library map.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h2 className="section-title">Library Map</h2>
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
              <div className="aisle-letter">{aisle.charAt(0)}</div>
              <div className="aisle-label">{aisle === 'Uncategorized' ? 'Uncategorized' : `Section ${aisle}`}</div>
              <div className="aisle-count">{info.books} {info.books === 1 ? 'book' : 'books'} · {shelfCount} {shelfCount === 1 ? 'shelf' : 'shelves'}</div>

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

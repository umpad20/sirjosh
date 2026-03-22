import React from 'react';

export default function BookSearch({ filters, setFilters, onSearch }) {
  return (
    <form
      className="card-static"
      role="search"
      aria-label="Book search form"
      onSubmit={e => { e.preventDefault(); onSearch(); }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="search-title" className="form-label">Title</label>
          <input
            id="search-title" name="title" type="text" className="input"
            placeholder="Search by title..."
            value={filters.title}
            onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
            aria-label="Search by title"
          />
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <label htmlFor="search-author" className="form-label">Author</label>
          <input
            id="search-author" name="author" type="text" className="input"
            placeholder="Search by author..."
            value={filters.author}
            onChange={e => setFilters(f => ({ ...f, author: e.target.value }))}
            aria-label="Search by author"
          />
        </div>
        <div style={{ flex: '1 1 120px' }}>
          <label htmlFor="search-aisle" className="form-label">Aisle</label>
          <input
            id="search-aisle" name="aisle" type="text" className="input"
            placeholder="e.g. A"
            value={filters.aisle}
            onChange={e => setFilters(f => ({ ...f, aisle: e.target.value }))}
            aria-label="Filter by aisle"
          />
        </div>
        <button type="submit" className="btn btn-primary" aria-label="Search books">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Search
        </button>
      </div>
    </form>
  );
}

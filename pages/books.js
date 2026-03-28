import Layout from '../components/Layout';
import BookSearch from '../components/BookSearch';
import BookList from '../components/BookList';
import LoadingState from '../components/LoadingState';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Science', 'History', 'Technology',
  'Philosophy', 'Art', 'Mathematics', 'Literature', 'Reference',
  'Computer Science', 'Business & Economy', 'General Fiction', 'Science Fiction',
  'Physics & Engineering', 'Literature & Arts'
];
const AISLES = ['A', 'B', 'C', 'D', 'E'];

export default function Books() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeAisle, setActiveAisle] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setLoading(true);
    try {
      const { data } = await supabase.from('books').select('*').order('title');
      if (data) setBooks(data);
    } catch (err) {}
    finally { setLoading(false); }
  }

  // Client-side filtering for instant response
  const filteredBooks = books.filter(book => {
    const matchesSearch = !searchQuery || 
      book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || book.category === activeCategory;
    const matchesAisle = !activeAisle || book.aisle === activeAisle;
    
    return matchesSearch && matchesCategory && matchesAisle;
  });

  // Get unique categories from actual data
  const usedCategories = [...new Set(books.map(b => b.category).filter(Boolean))];

  return (
    <Layout>
      <div className="animate-fade-in-up">
        {/* Header */}
        <div style={{ marginBottom: '0.25rem' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Book Catalog</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            Search and browse {books.length} books across the library.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
          <div style={{ position: 'relative', maxWidth: '480px' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            <input
              type="text"
              placeholder="Search by title, author, or ISBN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.75rem', fontSize: '0.9375rem', height: '48px', borderRadius: '0.75rem' }}
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={{ flexShrink: 0 }}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
          
          {/* Category chips */}
          {usedCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? '' : cat)}
              style={{
                padding: '0.3125rem 0.75rem',
                fontSize: '0.8125rem',
                fontWeight: 500,
                borderRadius: '9999px',
                border: activeCategory === cat ? '1.5px solid var(--green-primary)' : '1px solid #e2e8f0',
                background: activeCategory === cat ? 'var(--green-50)' : '#fff',
                color: activeCategory === cat ? 'var(--green-dark)' : 'var(--text-body)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          ))}

          {/* Divider */}
          {usedCategories.length > 0 && (
            <div style={{ width: '1px', height: '24px', background: '#e2e8f0', margin: '0 0.25rem', flexShrink: 0 }} />
          )}

          {/* Aisle chips */}
          {AISLES.map(aisle => (
            <button
              key={aisle}
              onClick={() => setActiveAisle(activeAisle === aisle ? '' : aisle)}
              style={{
                width: 32, height: 32,
                fontSize: '0.8125rem',
                fontWeight: 700,
                borderRadius: '0.5rem',
                border: activeAisle === aisle ? '1.5px solid var(--green-primary)' : '1px solid #e2e8f0',
                background: activeAisle === aisle ? 'var(--green-50)' : '#fff',
                color: activeAisle === aisle ? 'var(--green-dark)' : 'var(--text-body)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {aisle}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.25rem', fontWeight: 500 }}>
          {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} found
        </p>

        {/* Book List */}
        {loading ? (
          <LoadingState message="Loading catalog..." />
        ) : (
          <BookList books={filteredBooks} />
        )}
      </div>
    </Layout>
  );
}

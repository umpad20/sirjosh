import Layout from '../components/Layout';
import AisleBrowser from '../components/AisleBrowser';
import BookList from '../components/BookList';
import LoadingState from '../components/LoadingState';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Aisles() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [selectedAisle, setSelectedAisle] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data } = await supabase.from('books').select('*').order('title');
      if (data) {
        setBooks(data);
        const uniqueAisles = [...new Set(data.filter(b => b.aisle).map(b => b.aisle))].sort();
        if (uniqueAisles.length > 0) {
          setSelectedAisle(uniqueAisles[0]);
        }
      }
    } catch (err) {}
    finally { setLoading(false); }
  }

  const filteredBooks = books.filter(b => (b.aisle || 'Uncategorized') === selectedAisle);

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Aisles & Shelves</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Browse the library map and find books by location.</p>
        </div>
        
        {loading ? (
          <LoadingState message="Loading library map..." />
        ) : (
          <>
            <AisleBrowser books={books} onSelectAisle={setSelectedAisle} selectedAisle={selectedAisle} />
            
            {selectedAisle && (
              <div style={{ marginTop: '2rem' }}>
                <div className="section-header">
                  <h2 className="section-title">
                    Books in {selectedAisle === 'Uncategorized' ? 'Uncategorized' : `Aisle ${selectedAisle}`}
                  </h2>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
                  </span>
                </div>
                <BookList books={filteredBooks} />
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

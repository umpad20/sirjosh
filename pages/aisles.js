import Layout from '../components/Layout';
import AisleBrowser from '../components/AisleBrowser';
import BookList from '../components/BookList';
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
        // Automatically select the first available aisle if none is selected
        const uniqueAisles = [...new Set(data.filter(b => b.aisle).map(b => b.aisle))].sort();
        if (uniqueAisles.length > 0) {
          setSelectedAisle(uniqueAisles[0]);
        }
      }
    } catch (err) {}
    finally { setLoading(false); }
  }

  // Filter books by the currently selected aisle on the page level
  const filteredBooks = books.filter(b => (b.aisle || 'Uncategorized') === selectedAisle);

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Aisles & Shelves</h1>
        
        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <span className="spinner" style={{ borderColor: 'var(--green-primary)' }}></span>
          </div>
        ) : (
          <>
            <AisleBrowser books={books} onSelectAisle={setSelectedAisle} selectedAisle={selectedAisle} />
            
            {selectedAisle && (
              <div style={{ marginTop: '1.5rem' }}>
                <div className="section-header">
                  <h2 className="section-title">
                    Books in {selectedAisle === 'Uncategorized' ? 'Uncategorized' : `Aisle ${selectedAisle}`}
                  </h2>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
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

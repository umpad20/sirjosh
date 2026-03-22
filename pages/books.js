import Layout from '../components/Layout';
import BookSearch from '../components/BookSearch';
import BookList from '../components/BookList';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Books() {
  const [filters, setFilters] = useState({ title: '', author: '', aisle: '' });
  const [searching, setSearching] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    setSearching(true);
    try {
      const { data } = await supabase.from('books').select('*').order('title');
      if (data) setBooks(data);
    } catch (err) {} 
    finally { setSearching(false); }
  }

  async function handleSearch() {
    setSearching(true);
    try {
      let query = supabase.from('books').select('*');
      if (filters.title) query = query.ilike('title', `%${filters.title}%`);
      if (filters.author) query = query.ilike('author', `%${filters.author}%`);
      if (filters.aisle) query = query.eq('aisle', filters.aisle.toUpperCase());
      const { data } = await query.order('title');
      if (data) setBooks(data);
    } catch (err) {} 
    finally { setSearching(false); }
  }

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '1.5rem', fontWeight: 700 }}>Book Catalog</h1>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{books.length} books found</span>
          </div>
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <BookSearch filters={filters} setFilters={setFilters} onSearch={handleSearch} />
        </div>

        {searching ? (
          <div style={{ padding: '2rem 0', textAlign: 'center' }}>
            <span className="spinner" style={{ borderColor: 'var(--green-primary)' }}></span>
          </div>
        ) : (
          <BookList books={books} />
        )}
      </div>
    </Layout>
  );
}

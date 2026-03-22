import Layout from '../components/Layout';
import BookList from '../components/BookList';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ total: 1248, available: 982, borrowed: 266, lowStock: 42 });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        setBooks(data);
        const total = data.length;
        const available = data.filter(b => b.quantity > 2).length;
        const borrowed = data.filter(b => b.quantity === 0).length;
        const lowStock = data.filter(b => b.quantity > 0 && b.quantity <= 2).length;
        setStats({ total, available, borrowed, lowStock });
      }
    } catch (err) { }
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="hero animate-fade-in-up" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Welcome to <em>LibraTrack</em></h1>
        <p style={{ marginBottom: '1.25rem', fontSize: '0.9375rem' }}>
          Find any book instantly — search by title, browse by aisle, or check availability in real time.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <a href="/books" className="btn btn-hero-primary btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            Search Catalog
          </a>
          <a href="/aisles" className="btn btn-hero-outline btn-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 16 20 12.3 20 10a8 8 0 10-16 0c0 2.3 2.7 6 8 11.7z" /></svg>
            Browse Aisles
          </a>
        </div>
      </section>

      {/* Stats */}
      <section style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Total Books</div>
              <div className="stat-value">{stats.total}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Available</div>
              <div className="stat-value">{stats.available}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-orange">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Borrowed</div>
              <div className="stat-value">{stats.borrowed}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon stat-icon-red">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            </div>
            <div className="stat-content">
              <div className="stat-label">Low Stock</div>
              <div className="stat-value">{stats.lowStock}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Books */}
      <section>
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <h2 className="section-title">Recently Added</h2>
          <a href="/books" className="btn btn-outline btn-sm">View All →</a>
        </div>
        <BookList books={books.slice(0, 4)} />
      </section>
    </Layout>
  );
}

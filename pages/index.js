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
      // Fetch books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });
      if (booksError) throw booksError;

      // Fetch active borrows
      const { data: borrowsData, error: borrowsError } = await supabase
        .from('borrows')
        .select('*')
        .eq('status', 'active');
      if (borrowsError) throw borrowsError;

      if (booksData) {
        setBooks(booksData);
        
        const availableCount = booksData.reduce((acc, b) => acc + (b.quantity || 0), 0);
        const borrowedCount = borrowsData ? borrowsData.length : 0;
        const totalAssets = availableCount + borrowedCount;
        
        const now = new Date();
        const overdueCount = borrowsData ? borrowsData.filter(b => b.due_date && new Date(b.due_date) < now).length : 0;

        setStats({ 
          total: totalAssets, 
          available: availableCount, 
          borrowed: borrowedCount, 
          lowStock: overdueCount
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  }

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="hero-premium animate-fade-in-up">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to LibraTrack</h1>
          <p className="hero-subtitle">
            Find any book instantly — search by title, browse by aisle, or check availability in real time.
          </p>
          <div className="hero-actions">
            <a href="/books" className="btn btn-hero-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              Search Catalog
            </a>
            <a href="/aisles" className="hero-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="10" r="3" /><path d="M12 21.7C17.3 16 20 12.3 20 10a8 8 0 10-16 0c0 2.3 2.7 6 8 11.7z" /></svg>
              Browse Aisles →
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card-premium">
            <div className="stat-header">
              <svg className="stat-icon-v2 text-green" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
              <span className="stat-label-v2">Total Books</span>
            </div>
            <div className="stat-value-v2">{stats.total}</div>
          </div>

          <div className="stat-card-premium">
            <div className="stat-header">
              <svg className="stat-icon-v2 text-green" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span className="stat-label-v2">Available</span>
            </div>
            <div className="stat-value-v2">{stats.available}</div>
          </div>

          <div className="stat-card-premium">
            <div className="stat-header">
              <svg className="stat-icon-v2 text-orange" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span className="stat-label-v2">Borrowed</span>
            </div>
            <div className="stat-value-v2">{stats.borrowed}</div>
          </div>

          <div className="stat-card-premium">
            <div className="stat-header">
              <svg className="stat-icon-v2 text-red" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              <span className="stat-label-v2">Overdue</span>
            </div>
            <div className="stat-value-v2">{stats.lowStock}</div>
          </div>
        </div>
      </section>

      {/* Recent Books */}
      <section>
        <div className="section-header">
          <h2 className="section-title">Recently Added</h2>
          <a href="/books" className="btn btn-outline btn-sm">View All →</a>
        </div>
        <BookList books={books.slice(0, 8)} />
      </section>
    </Layout>
  );
}

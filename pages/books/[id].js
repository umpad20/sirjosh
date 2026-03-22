import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import { useState, useEffect } from 'react';

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);

  useEffect(() => {
    if (id) fetchBook();
  }, [id]);

  async function fetchBook() {
    try {
      const { data } = await supabase.from('books').select('*').eq('id', id).single();
      if (data) setBook(data);
    } catch (err) { }
  }

  if (!book) return <Layout><div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div></Layout>;

  const status = book.quantity > 2 ? 'available' : book.quantity > 0 ? 'low' : 'unavailable';
  const statusLabel = { available: 'Available', low: 'Low Stock', unavailable: 'Unavailable' }[status];
  const badgeClass = { available: 'badge-available', low: 'badge-low', unavailable: 'badge-unavailable' }[status];
  const dotClass = { available: 'badge-dot-green', low: 'badge-dot-orange', unavailable: 'badge-dot-red' }[status];

  return (
    <Layout>
      <div className="animate-fade-in-up" style={{ maxWidth: 680, margin: '0 auto' }}>
        <a href="/books" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', color: 'var(--green-primary)', fontWeight: 500, marginBottom: '1rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          Back to Catalog
        </a>

        <article className="card-static">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '1.5rem', fontWeight: 700 }}>{book.title}</h1>
            <span className={`badge ${badgeClass}`}>
              <span className={`badge-dot ${dotClass}`} />
              {statusLabel}
            </span>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Author', value: book.author },
              { label: 'Category', value: book.category },
              { label: 'ISBN', value: book.isbn },
              { label: 'Aisle', value: book.aisle },
              { label: 'Shelf', value: book.shelf },
              { label: 'Quantity', value: book.quantity },
            ].map(item => (
              <div key={item.label} style={{ background: 'var(--bg-page)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.1875rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-dark)' }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <button className="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
              Borrow This Book
            </button>
            <a href="/books" className="btn btn-outline">← Catalog</a>
          </div>
        </article>
      </div>
    </Layout>
  );
}

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Layout from '../../components/Layout';
import LoadingState from '../../components/LoadingState';

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [requesting, setRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBook();
      checkAuth();
    }
  }, [id]);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      setProfile(data);
    }
  }

  async function fetchBook() {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setBook(data);
    } catch (err) {
      console.error('Error fetching book:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestBorrow() {
    if (!user) return alert('Please sign in to borrow books.');
    setRequesting(true);
    try {
      const { error } = await supabase.from('borrows').insert([
        { user_id: user.id, book_id: book.id, status: 'pending' }
      ]);
      if (error) throw error;
      setRequestSent(true);
    } catch (err) {
      alert(err.message);
    } finally {
      setRequesting(false);
    }
  }

  if (loading) return <Layout><LoadingState message="Fetching book details..." /></Layout>;
  if (!book) return <Layout><div className="card-static" style={{ textAlign: 'center', padding: '4rem 0' }}><h2>Book not found.</h2><a href="/books" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Catalog</a></div></Layout>;

  const status = book.quantity > 2 ? 'available' : book.quantity > 0 ? 'low' : 'unavailable';
  const canBorrow = profile?.role === 'student' && book.quantity > 0;

  return (
    <Layout>
      <div className="animate-fade-in-up" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2.5rem', paddingBottom: '3rem' }}>
        
        {/* Back link */}
        <button onClick={() => router.push('/books')} style={{ 
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          color: '#64748b', fontSize: '0.9375rem', fontWeight: 400,
          marginBottom: '2rem', padding: 0, fontFamily: 'var(--font-body)'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to catalog
        </button>

        <div style={{ display: 'flex', gap: '3rem', flexDirection: 'row', alignItems: 'flex-start' }} className="detail-layout">
          
          {/* LEFT: Cover (Fixed to mimic the screenshot) */}
          <div style={{ flexShrink: 0, width: '260px' }}>
            <div style={{ 
              width: '100%',
              aspectRatio: '0.66', 
              borderRadius: '0.5rem', 
              background: book.image_url ? `url(${book.image_url}) center/cover no-repeat` : '#2d6a4f',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.75rem 1.5rem',
              color: '#fff',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {!book.image_url && (
                <>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <h2 style={{ fontSize: '1.375rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: '#fff', lineHeight: 1.2 }}>
                      {book.title}
                    </h2>
                  </div>
                  <div style={{ position: 'relative', zIndex: 2, fontSize: '0.875rem', opacity: 0.9, fontFamily: 'var(--font-body)' }}>
                    {book.author}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '0.25rem' }}>
            
            {/* Category Pill */}
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ 
                background: '#f3f4f6', color: '#4b5563', 
                fontSize: '0.8125rem', fontWeight: 600, 
                padding: '0.375rem 0.875rem', borderRadius: '9999px',
                fontFamily: 'var(--font-body)'
              }}>
                {book.category || 'General'}
              </span>
            </div>

            {/* Title & Author */}
            <h1 style={{ 
              fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', 
              color: '#111827', lineHeight: 1.15, marginBottom: '0.75rem', letterSpacing: '-0.02em' 
            }}>
              {book.title}
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#6b7280', fontWeight: 400, fontFamily: 'var(--font-body)', marginBottom: '2rem' }}>
              {book.author}
            </p>

            {/* Description */}
            {book.description && (
              <div style={{ maxWidth: '65ch', marginBottom: '2rem' }}>
                <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#4b5563', fontFamily: 'var(--font-body)' }}>
                  {book.description}
                </p>
              </div>
            )}

            {/* LOCATION BOX */}
            <div style={{ 
              background: '#fdfbfa', 
              border: '1px solid #e5e7eb', 
              borderRadius: '0.75rem', 
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, fontFamily: 'var(--font-display)', color: '#1f2937', margin: 0 }}>
                  Physical Location
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {/* Aisle Block */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '0.5rem', background: '#e0ece4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, color: '#2d6a4f' }}>
                    {book.aisle}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1f2937' }}>Aisle {book.aisle}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Section</div>
                  </div>
                </div>
                {/* Shelf Block */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: '0.5rem', background: '#ffe8d6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, color: '#cb7a3b' }}>
                    {book.shelf}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1f2937' }}>Shelf {book.shelf}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Position</div>
                  </div>
                </div>
              </div>
            </div>

            {/* METADATA GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, auto) minmax(200px, auto)', gap: '1.25rem 2rem', marginBottom: '2rem' }}>
              
              {/* ISBN */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="9" x2="20" y2="9"></line><line x1="4" y1="15" x2="20" y2="15"></line><line x1="10" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="14" y2="21"></line>
                </svg>
                <span>ISBN: {book.isbn || 'N/A'}</span>
              </div>

              {/* Qty Total */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                <span>Qty: {book.quantity} total</span>
              </div>

              {/* Category Footer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                <span>{book.category || 'General'}</span>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: status === 'available' ? '#15803d' : status === 'low' ? '#d97706' : '#dc2626', fontWeight: 600 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><polyline points="10 8 13 11 18 5"></polyline>
                </svg>
                <span>{book.quantity} available</span>
              </div>

            </div>

            {/* ACTION BUTTON */}
            <div>
              {canBorrow ? (
                requestSent ? (
                  <div className="alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '300px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <span>Borrow request sent!</span>
                  </div>
                ) : (
                  <button onClick={handleRequestBorrow} disabled={requesting} style={{ 
                    background: '#2d6a4f', color: '#fff', border: 'none', borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem', fontSize: '0.9375rem', fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    cursor: 'pointer', transition: 'background 0.2s'
                  }} className="hover:bg-[#1b4332]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><polyline points="10 8 13 11 18 5"></polyline>
                    </svg>
                    {requesting ? 'Processing...' : 'Borrow this book'}
                  </button>
                )
              ) : profile?.role === 'student' && book.quantity === 0 ? (
                <div className="alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '300px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>Currently out of stock.</span>
                </div>
              ) : null}
            </div>
            
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .detail-layout {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center;
          }
          .detail-layout > div:first-child {
            width: 80% !important;
            max-width: 260px;
          }
          .detail-layout > div:last-child {
            align-items: center;
          }
          .detail-layout p {
            text-align: left;
          }
        }
      `}</style>
    </Layout>
  );
}


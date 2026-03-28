import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function MyBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserAndBorrows();
  }, []);

  async function fetchUserAndBorrows() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      const { data, error } = await supabase
        .from('borrows')
        .select('*, books(*)')
        .eq('user_id', session.user.id)
        .order('borrow_date', { ascending: false });
      
      if (data) setBorrows(data);
    }
    setLoading(false);
  }

  if (loading) return <Layout><LoadingState /></Layout>;
  if (!user) return <Layout><EmptyState message="Please sign in to view your borrows." /></Layout>;

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.02em' }}>My Borrows</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Track your book requests and active loans.</p>
        </header>

        {borrows.length === 0 ? (
          <EmptyState message="You haven't requested any books yet." />
        ) : (
          <div className="grid gap-4">
            {borrows.map((borrow) => (
              <div key={borrow.id} className="card-static" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '0.75rem', background: 'var(--green-50)', border: '1px solid var(--green-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-primary)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-body)' }}>{borrow.books?.title}</h3>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>Requested on {new Date(borrow.borrow_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${
                    borrow.status === 'active' && borrow.due_date && new Date(borrow.due_date) < new Date() ? 'badge-unavailable' :
                    borrow.status === 'active' ? 'badge-available' : 
                    borrow.status === 'pending' ? 'badge-low' : 
                    borrow.status === 'returned' ? 'badge-available' : 'badge-unavailable'
                  }`}>
                    {borrow.status === 'active' && borrow.due_date && new Date(borrow.due_date) < new Date() ? 'OVERDUE' : borrow.status.toUpperCase()}
                  </span>
                  {borrow.due_date && borrow.status === 'active' && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--red-500)', fontWeight: 600, marginTop: '0.25rem' }}>
                      Due: {new Date(borrow.due_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

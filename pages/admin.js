import Layout from '../components/Layout';
import AdminBookForm from '../components/AdminBookForm';
import { supabase } from '../lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recentBooks, setRecentBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('books');
  const [borrows, setBorrows] = useState([]);
  const [borrowSearch, setBorrowSearch] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const filteredBorrows = (borrows || []).filter(b => {
    const matchesSearch = 
      b.profiles?.email?.toLowerCase().includes(borrowSearch.toLowerCase()) ||
      b.books?.title?.toLowerCase().includes(borrowSearch.toLowerCase());
    
    if (!showHistory) {
      return matchesSearch && (b.status === 'pending' || b.status === 'active');
    }
    return matchesSearch;
  });

  useEffect(() => {
    checkUser();
    fetchRecentBooks();
    fetchBorrows();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') router.push('/books');
  }

  async function fetchRecentBooks() {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) setRecentBooks(data);
  }

  async function fetchBorrows() {
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('borrows')
        .select('*, books(*), profiles(*)')
        .order('borrow_date', { ascending: false });
      
      if (error) {
        setFetchError(error.message);
        console.error('Error fetching borrows:', error);
        return;
      }
      
      if (data) setBorrows(data);
    } catch (err) {
      setFetchError(err.message);
      console.error('Unexpected error in fetchBorrows:', err);
    }
  }

  async function handleSubmit(formData) {
    setLoading(true);
    try {
      const { error } = await supabase.from('books').insert([formData]);
      if (error) throw error;
      
      fetchRecentBooks();
      alert('Book added successfully!');
    } catch (err) { 
      console.error('Submit error:', err);
      alert(`Failed to add book: ${err.message}. \n\nIMPORTANT: Did you run the SQL migration to add the new columns (description, publisher, etc.) in Supabase?`); 
    }
    finally { setLoading(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    await supabase.from('books').delete().eq('id', id);
    fetchRecentBooks();
  }

  async function handleApproveBorrow(borrowId, bookId, currentQty) {
    if (currentQty <= 0) return alert('Cannot approve: Book out of stock.');
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    try {
      const { error: borrowError } = await supabase
        .from('borrows')
        .update({ status: 'active', due_date: dueDate.toISOString() })
        .eq('id', borrowId);
      
      if (borrowError) throw borrowError;

      const { error: bookError } = await supabase
        .from('books')
        .update({ quantity: currentQty - 1 })
        .eq('id', bookId);
      
      if (bookError) throw bookError;

      fetchBorrows();
      fetchRecentBooks();
      alert('Borrow request approved!');
    } catch (err) { alert(err.message); }
  }

  async function handleRejectBorrow(borrowId) {
    await supabase.from('borrows').update({ status: 'rejected' }).eq('id', borrowId);
    fetchBorrows();
  }

  async function handleReturnBook(borrowId, bookId, currentQty) {
    try {
      const { error: borrowError } = await supabase
        .from('borrows')
        .update({ status: 'returned', return_date: new Date().toISOString() })
        .eq('id', borrowId);
      
      if (borrowError) throw borrowError;

      const { error: bookError } = await supabase
        .from('books')
        .update({ quantity: currentQty + 1 })
        .eq('id', bookId);
      
      if (bookError) throw bookError;

      fetchBorrows();
      fetchRecentBooks();
      alert('Book return confirmed!');
    } catch (err) { alert(err.message); }
  }

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>Admin Panel</h1>
        
        {/* Tab bar */}
        <div className="admin-tabs">
          <button 
            onClick={() => setActiveTab('books')} 
            className={`admin-tab ${activeTab === 'books' ? 'active' : ''}`}
          >
            Inventory Management
          </button>
          <button 
            onClick={() => setActiveTab('borrows')} 
            className={`admin-tab ${activeTab === 'borrows' ? 'active' : ''}`}
          >
            Borrow Management
          </button>
        </div>

        {activeTab === 'books' ? (
          <>
            <AdminBookForm onSubmit={handleSubmit} loading={loading} />
            <div className="card-static" style={{ marginTop: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-dark)' }}>Collection Inventory</h3>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title & Author</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBooks.map(book => (
                      <tr key={book.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{book.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {book.author}</div>
                        </td>
                        <td>
                          <span className="category-badge">{book.category || 'N/A'}</span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: book.quantity > 0 ? 'inherit' : 'var(--red-500)' }}>
                            {book.quantity}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a href={`/book/${book.id}`} className="btn btn-ghost btn-sm" style={{ color: 'var(--green-primary)' }}>View</a>
                            <button className="btn btn-ghost btn-sm" aria-label={`Delete ${book.title}`} onClick={() => handleDelete(book.id)} style={{ color: 'var(--red-500)' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="card-static">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                <input 
                  type="text" 
                  placeholder="Search by student email or book..." 
                  value={borrowSearch}
                  onChange={(e) => setBorrowSearch(e.target.value)}
                  className="input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label className="switch-label" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                  <input type="checkbox" checked={showHistory} onChange={() => setShowHistory(!showHistory)} style={{ accentColor: 'var(--green-primary)' }} />
                  Show History
                </label>
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-dark)' }}>Borrow Requests & Active Loans</h3>
            
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Book</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {!filteredBorrows || filteredBorrows.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                        {fetchError ? `Error: ${fetchError}` : 'No matching borrow records found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredBorrows.map(borrow => {
                      const isOverdue = borrow.status === 'active' && borrow.due_date && new Date(borrow.due_date) < new Date();
                      return (
                        <tr key={borrow.id} style={isOverdue ? { backgroundColor: 'rgba(239, 68, 68, 0.04)' } : {}}>
                          <td>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>{borrow.profiles?.email || 'Unknown User'}</div>
                            <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>UID: {borrow.user_id.substring(0, 8)}</div>
                          </td>
                          <td style={{ fontWeight: 500 }}>{borrow.books?.title}</td>
                          <td style={{ fontSize: '0.8125rem' }}>{new Date(borrow.borrow_date).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${
                              isOverdue ? 'badge-unavailable' :
                              borrow.status === 'active' ? 'badge-available' : 
                              borrow.status === 'pending' ? 'badge-low' : 
                              borrow.status === 'returned' ? 'badge-available' : 'badge-unavailable'
                            }`}>
                              {isOverdue ? 'LATE / OVERDUE' : borrow.status.toUpperCase()}
                            </span>
                          </td>
                        <td>
                          {borrow.status === 'pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button className="btn btn-primary btn-sm" onClick={() => handleApproveBorrow(borrow.id, borrow.book_id, borrow.books?.quantity)}>
                                Approve
                              </button>
                              <button className="btn btn-ghost btn-sm" onClick={() => handleRejectBorrow(borrow.id)} style={{ color: 'var(--red-500)' }}>
                                Reject
                              </button>
                            </div>
                          )}
                          {borrow.status === 'active' && (
                            <button className="btn btn-outline btn-sm" onClick={() => handleReturnBook(borrow.id, borrow.book_id, borrow.books?.quantity)}>
                              Confirm Return
                            </button>
                          )}
                          {borrow.status === 'returned' && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Returned on {new Date(borrow.return_date).toLocaleDateString()}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

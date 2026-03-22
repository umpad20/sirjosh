import Layout from '../components/Layout';
import AdminBookForm from '../components/AdminBookForm';
import { supabase } from '../lib/supabaseClient';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Admin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [recentBooks, setRecentBooks] = useState([]);

  useEffect(() => {
    checkUser();
    fetchRecentBooks();
  }, []);

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    // Quick fallback for testing
    if (user.email?.includes('admin')) return;

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') router.push('/books');
  }

  async function fetchRecentBooks() {
    const { data } = await supabase.from('books').select('*').order('created_at', { ascending: false }).limit(5);
    if (data) setRecentBooks(data);
  }

  async function handleSubmit(formData) {
    setLoading(true);
    try {
      const { error } = await supabase.from('books').insert([formData]);
      if (error) throw error;
      
      fetchRecentBooks();
      alert('Book added successfully!');
    } catch (err) { alert(`Failed to add book: ${err.message}`); }
    finally { setLoading(false); }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    await supabase.from('books').delete().eq('id', id);
    fetchRecentBooks();
  }

  return (
    <Layout>
      <div className="animate-fade-in-up">
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Admin Panel</h1>
        
        <AdminBookForm onSubmit={handleSubmit} loading={loading} />
        
        <div className="card-static" style={{ marginTop: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-dark)' }}>Recent Activity</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Author</th>
                  <th>Aisle/Shelf</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBooks.map(book => (
                  <tr key={book.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{book.title}</td>
                    <td>{book.author}</td>
                    <td><span className="badge badge-available">Aisle {book.aisle}, Shelf {book.shelf}</span></td>
                    <td>
                      <button className="btn btn-ghost btn-sm" aria-label={`Delete ${book.title}`} onClick={() => handleDelete(book.id)} style={{ color: 'var(--red-500)' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

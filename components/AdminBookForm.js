import React, { useState } from 'react';

export default function AdminBookForm({ onSubmit, initialData = {}, loading }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    category: initialData.category || '',
    isbn: initialData.isbn || '',
    aisle: initialData.aisle || '',
    shelf: initialData.shelf || '',
    quantity: initialData.quantity || 1,
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.author || !form.aisle || !form.shelf) {
      setError('Title, Author, Aisle, and Shelf are required.');
      return;
    }
    setError('');
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="card-static" style={{ maxWidth: 640, margin: '0 auto' }} aria-label="Add or edit book form">
      <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
        {initialData.id ? '✏️ Edit Book' : '📚 Add New Book'}
      </h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label htmlFor="admin-title" className="form-label">Title <span className="form-required">*</span></label>
          <input id="admin-title" name="title" type="text" className="input" value={form.title} onChange={handleChange} aria-required="true" placeholder="Enter book title" />
        </div>
        <div>
          <label htmlFor="admin-author" className="form-label">Author <span className="form-required">*</span></label>
          <input id="admin-author" name="author" type="text" className="input" value={form.author} onChange={handleChange} aria-required="true" placeholder="Enter author name" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label htmlFor="admin-category" className="form-label">Category</label>
            <select id="admin-category" name="category" className="input" value={form.category} onChange={handleChange}>
              <option value="" disabled>Select a category</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics & Engineering">Physics & Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Literature & Arts">Literature & Arts</option>
              <option value="History">History</option>
              <option value="Business & Economy">Business & Economy</option>
              <option value="General Fiction">General Fiction</option>
            </select>
          </div>
          <div>
            <label htmlFor="admin-isbn" className="form-label">ISBN</label>
            <input id="admin-isbn" name="isbn" type="text" className="input" value={form.isbn} onChange={handleChange} placeholder="978-0-123456-47-2" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label htmlFor="admin-aisle" className="form-label">Aisle <span className="form-required">*</span></label>
            <select id="admin-aisle" name="aisle" className="input" value={form.aisle} onChange={handleChange} required aria-required="true">
              <option value="" disabled>Select aisle</option>
              <option value="A">Aisle A</option>
              <option value="B">Aisle B</option>
              <option value="C">Aisle C</option>
              <option value="D">Aisle D</option>
              <option value="E">Aisle E</option>
              <option value="T">Aisle T (Test)</option>
            </select>
          </div>
          <div>
            <label htmlFor="admin-shelf" className="form-label">Shelf <span className="form-required">*</span></label>
            <select id="admin-shelf" name="shelf" className="input" value={form.shelf} onChange={handleChange} required aria-required="true">
              <option value="" disabled>Select shelf</option>
              <option value="1">Shelf 1</option>
              <option value="2">Shelf 2</option>
              <option value="3">Shelf 3</option>
              <option value="4">Shelf 4</option>
              <option value="5">Shelf 5</option>
            </select>
          </div>
          <div>
            <label htmlFor="admin-quantity" className="form-label">Quantity</label>
            <input id="admin-quantity" name="quantity" type="number" min="0" className="input" value={form.quantity} onChange={handleChange} />
          </div>
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginTop: '1rem' }} role="alert">{error}</div>}

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-ghost" onClick={() => setForm({ title: '', author: '', category: '', isbn: '', aisle: '', shelf: '', quantity: 1 })}>
          Cancel
        </button>
        {initialData.id && (
          <button type="button" className="btn btn-danger btn-sm" aria-label="Delete book">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
            Delete
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading} aria-busy={loading} aria-label={initialData.id ? 'Update book' : 'Save book'}>
          {loading ? 'Saving...' : (initialData.id ? 'Update' : 'Save Book')}
        </button>
      </div>
    </form>
  );
}

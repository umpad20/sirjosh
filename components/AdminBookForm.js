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
    description: initialData.description || '',
    publisher: initialData.publisher || '',
    published_year: initialData.published_year || '',
    pages: initialData.pages || '',
    language: initialData.language || 'English',
    image_url: initialData.image_url || '',
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

  const inputGroupStyle = { display: 'grid', gap: '1rem', marginBottom: '1.5rem' };
  const sectionTitleStyle = { fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '1rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.5rem' };

  return (
    <form onSubmit={handleSubmit} className="card-static animate-fade-in" style={{ maxWidth: 720, margin: '0 auto' }} aria-label="Add or edit book form">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'var(--green-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-primary)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-body)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
          {initialData.id ? 'Edit Book Details' : 'Add New Book to Library'}
        </h2>
      </div>

      {/* SECTION 1: BASIC INFO */}
      <h3 style={sectionTitleStyle}>Basic Information</h3>
      <div style={inputGroupStyle}>
        <div>
          <label htmlFor="admin-title" className="form-label">Title <span className="form-required">*</span></label>
          <input id="admin-title" name="title" type="text" className="input" value={form.title} onChange={handleChange} required placeholder="e.g. The Great Gatsby" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label htmlFor="admin-author" className="form-label">Author <span className="form-required">*</span></label>
            <input id="admin-author" name="author" type="text" className="input" value={form.author} onChange={handleChange} required placeholder="F. Scott Fitzgerald" />
          </div>
          <div>
            <label htmlFor="admin-category" className="form-label">Category</label>
            <select id="admin-category" name="category" className="input" value={form.category} onChange={handleChange}>
              <option value="">Select a category</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics & Engineering">Physics & Engineering</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Literature & Arts">Literature & Arts</option>
              <option value="History">History</option>
              <option value="Business & Economy">Business & Economy</option>
              <option value="General Fiction">General Fiction</option>
              <option value="Science Fiction">Science Fiction</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="admin-description" className="form-label">Description / Summary</label>
          <textarea 
            id="admin-description" name="description" className="input" 
            style={{ minHeight: 100, resize: 'vertical' }}
            value={form.description} onChange={handleChange}
            placeholder="Provide a brief summary of the book's content..."
          />
        </div>
      </div>

      {/* SECTION 2: PUBLICATION & PHYSICAL */}
      <h3 style={sectionTitleStyle}>Publication & Physical Details</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <label htmlFor="admin-publisher" className="form-label">Publisher</label>
          <input id="admin-publisher" name="publisher" type="text" className="input" value={form.publisher} onChange={handleChange} placeholder="Scribner" />
        </div>
        <div>
          <label htmlFor="admin-isbn" className="form-label">ISBN</label>
          <input id="admin-isbn" name="isbn" type="text" className="input" value={form.isbn} onChange={handleChange} placeholder="978-0-7432-7356-5" />
        </div>
        <div>
          <label htmlFor="admin-published_year" className="form-label">Published Year</label>
          <input id="admin-published_year" name="published_year" type="number" className="input" value={form.published_year} onChange={handleChange} placeholder="1925" />
        </div>
        <div>
          <label htmlFor="admin-pages" className="form-label">Total Pages</label>
          <input id="admin-pages" name="pages" type="number" className="input" value={form.pages} onChange={handleChange} placeholder="180" />
        </div>
        <div>
          <label htmlFor="admin-language" className="form-label">Language</label>
          <input id="admin-language" name="language" type="text" className="input" value={form.language} onChange={handleChange} placeholder="English" />
        </div>
        <div>
          <label htmlFor="admin-image_url" className="form-label">Cover Image URL</label>
          <input id="admin-image_url" name="image_url" type="text" className="input" value={form.image_url} onChange={handleChange} placeholder="https://example.com/cover.jpg" />
        </div>
      </div>

      {/* SECTION 3: INVENTORY & LOCATION */}
      <h3 style={sectionTitleStyle}>Inventory & Location</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="admin-aisle" className="form-label">Aisle <span className="form-required">*</span></label>
          <select id="admin-aisle" name="aisle" className="input" value={form.aisle} onChange={handleChange} required>
            <option value="" disabled>Select</option>
            <option value="A">Aisle A</option>
            <option value="B">Aisle B</option>
            <option value="C">Aisle C</option>
            <option value="D">Aisle D</option>
            <option value="E">Aisle E</option>
            <option value="T">Test (T)</option>
          </select>
        </div>
        <div>
          <label htmlFor="admin-shelf" className="form-label">Shelf <span className="form-required">*</span></label>
          <select id="admin-shelf" name="shelf" className="input" value={form.shelf} onChange={handleChange} required>
            <option value="" disabled>Select</option>
            <option value="1">Shelf 1</option>
            <option value="2">Shelf 2</option>
            <option value="3">Shelf 3</option>
            <option value="4">Shelf 4</option>
            <option value="5">Shelf 5</option>
          </select>
        </div>
        <div>
          <label htmlFor="admin-quantity" className="form-label">Stock Quantity</label>
          <input id="admin-quantity" name="quantity" type="number" min="0" className="input" value={form.quantity} onChange={handleChange} />
        </div>
      </div>

      {error && <div className="alert-error" style={{ marginTop: '1rem', marginBottom: '1.5rem' }} role="alert">{error}</div>}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', justifyContent: 'flex-end' }}>
        <button 
          type="button" className="btn btn-ghost" 
          onClick={() => setForm({ title: '', author: '', category: '', isbn: '', aisle: '', shelf: '', quantity: 1, description: '', publisher: '', published_year: '', pages: '', language: 'English', image_url: '' })}
        >
          Reset Form
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: 140 }}>
          {loading ? 'Processing...' : (initialData.id ? 'Save Changes' : 'Add to Collection')}
        </button>
      </div>
    </form>
  );
}

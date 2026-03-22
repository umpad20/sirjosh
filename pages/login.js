import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      if (data.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single();
        if (profile?.role === 'admin') router.push('/admin');
        else router.push('/books');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <form onSubmit={handleSubmit} className="card-static animate-fade-in-up" style={{ width: '100%', maxWidth: 420 }} aria-label="Login form">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: 'var(--green-50)', border: '1px solid var(--green-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--green-primary)' }} aria-hidden="true">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.375rem', marginBottom: '0.25rem' }}>Welcome Back</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Sign in to your LibraTrack account</p>
          </div>

          <div style={{ display: 'grid', gap: '0.875rem' }}>
            <div>
              <label htmlFor="login-email" className="form-label">Email / Username</label>
              <input id="login-email" name="email" type="text" autoComplete="username" required className="input" placeholder="student@university.edu" value={form.email} onChange={handleChange} aria-required="true" />
            </div>
            <div>
              <label htmlFor="login-password" className="form-label">Password</label>
              <input id="login-password" name="password" type="password" autoComplete="current-password" required className="input" placeholder="••••••••" value={form.password} onChange={handleChange} aria-required="true" />
            </div>
          </div>

          {error && <div className="alert-error" style={{ marginTop: '0.75rem' }} role="alert">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.25rem' }} disabled={loading} aria-busy={loading} aria-label="Sign in">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8125rem' }}>
            <a href="/register" style={{ color: 'var(--green-primary)', fontWeight: 500 }}>Don&apos;t have an account? <span style={{ textDecoration: 'underline' }}>Create one</span></a>
          </div>
        </form>
      </div>
    </Layout>
  );
}

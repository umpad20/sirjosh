import Layout from '../components/Layout';
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) { setForm(f => ({ ...f, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ id: data.user.id, email: form.email, role: form.role }]);
        if (profileError) throw profileError;
        router.push('/login?registered=true');
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
        <form onSubmit={handleSubmit} className="card-static animate-fade-in-up" style={{ width: '100%', maxWidth: 420 }} aria-label="Registration form">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: 48, height: 48, borderRadius: '0.75rem', background: 'var(--green-50)', border: '1px solid var(--green-100)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--green-primary)' }} aria-hidden="true">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
              </svg>
            </div>
            <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1.375rem', marginBottom: '0.25rem' }}>Create Account</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Join LibraTrack to manage your reading</p>
          </div>

          <div style={{ display: 'grid', gap: '0.875rem' }}>
            <div>
              <label htmlFor="reg-name" className="form-label">Full Name</label>
              <input id="reg-name" name="name" type="text" autoComplete="name" required className="input" placeholder="Jane Doe" value={form.name} onChange={handleChange} aria-required="true" />
            </div>
            <div>
              <label htmlFor="reg-email" className="form-label">Email</label>
              <input id="reg-email" name="email" type="email" autoComplete="username" required className="input" placeholder="jane@university.edu" value={form.email} onChange={handleChange} aria-required="true" />
            </div>
            <div>
              <label htmlFor="reg-password" className="form-label">Password</label>
              <input id="reg-password" name="password" type="password" autoComplete="new-password" required className="input" placeholder="••••••••" value={form.password} onChange={handleChange} aria-required="true" />
            </div>
            <div>
              <label htmlFor="reg-role" className="form-label">Sign up as:</label>
              <select id="reg-role" name="role" className="input" value={form.role} onChange={handleChange} aria-required="true">
                <option value="student">Student / User</option>
                <option value="admin">Administrator Staff</option>
              </select>
            </div>
          </div>

          {error && <div className="alert-error" style={{ marginTop: '0.75rem' }} role="alert">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '1.25rem' }} disabled={loading} aria-busy={loading} aria-label="Create account">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
          
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8125rem' }}>
            <a href="/login" style={{ color: 'var(--green-primary)', fontWeight: 500 }}>Already have an account? <span style={{ textDecoration: 'underline' }}>Sign in</span></a>
          </div>
        </form>
      </div>
    </Layout>
  );
}

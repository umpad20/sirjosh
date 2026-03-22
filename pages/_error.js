import Layout from '../components/Layout';

export default function Error({ statusCode }) {
  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }} className="animate-fade-in-up">
        <div style={{ width: 64, height: 64, borderRadius: '1rem', background: 'var(--red-50)', border: '1px solid #FFCDD2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--red-500)' }} aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 style={{ fontFamily: 'var(--font-body)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          {statusCode ? `Error ${statusCode}` : 'Something went wrong'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Sorry, an unexpected error occurred.</p>
        <a href="/" className="btn btn-primary">← Back to Dashboard</a>
      </div>
    </Layout>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

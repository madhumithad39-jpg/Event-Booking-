import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="section" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div className="card" style={{ padding: '48px 32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#818cf8',
            }}
          >
            <Compass size={32} />
          </div>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '4px', fontWeight: 900 }}>404</h1>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Page Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', fontSize: '0.95rem' }}>
            The page you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            <ArrowLeft size={16} />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

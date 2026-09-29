import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { authClient } from '../services/authClient';

export const AdminRoute = ({ children }) => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  if (session.user.role !== 'admin') {
    return (
      <div className="container section" style={{ textAlign: 'center', maxWidth: '500px' }}>
        <div className="card" style={{ padding: '48px 32px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              color: '#fb7185',
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Admin Access Required</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            This section is restricted to EVENTLY administrators. Your current account ({session.user.email}) does not have administrative permissions.
          </p>
          <Link to="/" className="btn btn-outline" style={{ display: 'inline-flex' }}>
            <ArrowLeft size={16} />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;

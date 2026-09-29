import React, { useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CalendarDays, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authClient } from '../services/authClient';
import { useToast } from '../context/ToastContext';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const isJustVerified = searchParams.get('verified') === 'true';

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        // If Better Auth indicates unverified email
        if (
          error.message?.toLowerCase().includes('verify') ||
          error.message?.toLowerCase().includes('not verified') ||
          error.code === 'EMAIL_NOT_VERIFIED'
        ) {
          setFormError('Your email address is not verified yet.');
          return;
        }
        throw new Error(error.message || 'Invalid email or password.');
      }

      showToast('Welcome back to EVENTLY!', 'success');

      // Redirect to intended route or admin dashboard or homepage
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Authentication failed.');
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '460px' }}>
        <div className="card" style={{ padding: '36px 32px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
              }}
            >
              <CalendarDays size={26} />
            </div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Sign in to manage your bookings and secure tickets.
            </p>
          </div>

          {/* Just Verified Banner */}
          {isJustVerified && (
            <div
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                color: '#34d399',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Email verified successfully! Please enter your password to sign in.</span>
            </div>
          )}

          {/* Form Error Banner */}
          {formError && (
            <div
              style={{
                backgroundColor: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                color: '#fb7185',
                fontSize: '0.88rem',
                marginBottom: '20px',
              }}
            >
              <div>{formError}</div>
              {formError.includes('verified') && (
                <Link
                  to={`/verify-otp?email=${encodeURIComponent(email)}`}
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    color: '#818cf8',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Click here to enter your verification OTP →
                </Link>
              )}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Password
                </label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  style={{ paddingLeft: '42px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '10px' }}
            >
              {loading ? (
                'Signing In...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
            }}
          >
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

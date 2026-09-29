import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { MailCheck, KeyRound, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { authClient } from '../services/authClient';
import { useToast } from '../context/ToastContext';

export const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [formError, setFormError] = useState('');

  // Resend countdown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please provide your registered email address.');
      return;
    }

    if (!otp.trim() || otp.trim().length < 6) {
      setFormError('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (error) {
        throw new Error(error.message || 'Invalid or expired OTP. Please try again.');
      }

      showToast('Email verified successfully! You can now log in.', 'success');

      // Navigate to login with prefilled email
      navigate(`/login?email=${encodeURIComponent(email.trim().toLowerCase())}&verified=true`);
    } catch (err) {
      setFormError(err.message || 'Verification failed.');
      showToast(err.message || 'Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email.trim()) {
      setFormError('Please provide your email to resend OTP.');
      return;
    }

    try {
      setResending(true);
      setFormError('');

      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email: email.trim().toLowerCase(),
        type: 'email-verification',
      });

      if (error) {
        throw new Error(error.message || 'Failed to resend code.');
      }

      showToast(`New verification code sent to ${email}`, 'info');
      setResendCooldown(60);
    } catch (err) {
      setFormError(err.message || 'Failed to resend code.');
      showToast(err.message || 'Resend failed', 'error');
    } finally {
      setResending(false);
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
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
                margin: '0 auto 16px',
              }}
            >
              <MailCheck size={28} />
            </div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Verify Your Email</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Enter the 6-digit verification code sent to your email.
            </p>
          </div>

          {/* Form Error */}
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
              {formError}
            </div>
          )}

          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">6-Digit Verification Code (OTP)</label>
              <div style={{ position: 'relative' }}>
                <KeyRound
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
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="input"
                  style={{
                    paddingLeft: '42px',
                    fontSize: '1.3rem',
                    letterSpacing: '6px',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                  required
                />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                ⏱️ Code expires in <strong>10 minutes</strong>.
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', marginTop: '8px' }}
            >
              {loading ? (
                'Verifying Code...'
              ) : (
                <>
                  <span>Verify & Activate Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Resend Action */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.88rem',
            }}
          >
            <span style={{ color: 'var(--text-secondary)' }}>Didn't receive code?</span>
            <button
              onClick={handleResendOtp}
              disabled={resending || resendCooldown > 0}
              className="btn btn-outline btn-sm"
              style={{ padding: '6px 12px' }}
            >
              <RotateCw size={13} className={resending ? 'loading-spinner' : ''} />
              <span>
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </span>
            </button>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/login" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;

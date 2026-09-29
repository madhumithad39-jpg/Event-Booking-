import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '56px 0 32px',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Brand Col */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: 'var(--font-display)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '1px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--primary-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <CalendarDays size={18} />
              </div>
              <span>
                EVENT<span style={{ color: '#818cf8' }}>LY</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '16px' }}>
              “Discover. Book. Experience.”
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Connecting curious explorers with unforgettable live concerts, developer summits, masterclasses, and sports championships.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#f8fafc' }}>Explore</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/events?category=Music" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Music & Concerts
                </Link>
              </li>
              <li>
                <Link to="/events?category=Technology" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Tech & Hackathons
                </Link>
              </li>
            </ul>
          </div>

          {/* User Account */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#f8fafc' }}>Account</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link to="/my-bookings" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  My Bookings
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/admin" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantees */}
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: '#f8fafc' }}>Platform Guarantees</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              <li>✓ Instant digital voucher issuance</li>
              <li>✓ Automated reminder 24h prior to event</li>
              <li>✓ Verified organizers & genuine tickets</li>
              <li>✓ Protected session security</li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {new Date().getFullYear()} EVENTLY Platform. Discover. Book. Experience.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with React & Express
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

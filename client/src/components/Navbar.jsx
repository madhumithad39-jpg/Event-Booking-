import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  User,
  LogOut,
  ShieldCheck,
  Ticket,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { authClient } from '../services/authClient';
import { useToast } from '../context/ToastContext';

export const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      showToast('Logged out successfully', 'info');
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate('/');
    } catch (err) {
      showToast('Error during logout: ' + err.message, 'error');
    }
  };

  const isAdmin = session?.user?.role === 'admin';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(10, 13, 24, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '1px',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            <CalendarDays size={22} />
          </div>
          <span style={{ color: '#ffffff' }}>
            EVENT<span style={{ color: '#818cf8' }}>LY</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '28px',
          }}
          className="desktop-nav"
        >
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? '#818cf8' : 'var(--text-secondary)',
              transition: 'color 0.2s',
            })}
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            style={({ isActive }) => ({
              fontWeight: 600,
              fontSize: '0.95rem',
              color: isActive ? '#818cf8' : 'var(--text-secondary)',
              transition: 'color 0.2s',
            })}
          >
            Events
          </NavLink>
          {session?.user && (
            <NavLink
              to="/my-bookings"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.95rem',
                color: isActive ? '#818cf8' : 'var(--text-secondary)',
                transition: 'color 0.2s',
              })}
            >
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: isActive ? '#c084fc' : '#a855f7',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
              })}
            >
              <ShieldCheck size={16} />
              <span>Admin Dashboard</span>
            </NavLink>
          )}
        </nav>

        {/* Desktop Auth / Profile Action */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '14px',
            position: 'relative',
          }}
          className="desktop-auth"
        >
          {isPending ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>...</div>
          ) : session?.user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 14px',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {session.user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {session.user.name?.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '210px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-hover)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 200,
                    animation: 'fadeIn 0.15s ease-out',
                  }}
                >
                  <div
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid var(--border)',
                      marginBottom: '6px',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{session.user.name}</div>
                    <div
                      style={{
                        color: 'var(--text-muted)',
                        fontSize: '0.78rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {session.user.email}
                    </div>
                  </div>

                  <Link
                    to="/my-bookings"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      color: 'var(--text-secondary)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    <Ticket size={15} />
                    <span>My Bookings</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        color: '#c084fc',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <ShieldCheck size={15} />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.88rem',
                      color: '#fb7185',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      marginTop: '4px',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-toggle"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            padding: '8px',
          }}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Responsive Styles Injection */}
      <style>{`
        @media (min-width: 769px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderBottom: '1px solid var(--border)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '8px 0' }}
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, padding: '8px 0' }}
          >
            Events
          </NavLink>
          {session?.user && (
            <NavLink
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, padding: '8px 0' }}
            >
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontWeight: 600,
                padding: '8px 12px',
                color: '#c084fc',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
                borderRadius: '8px',
              }}
            >
              Admin Dashboard
            </NavLink>
          )}

          <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            {session?.user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{session.user.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{session.user.email}</div>
                </div>
                <button onClick={handleLogout} className="btn btn-danger btn-sm">
                  Log Out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

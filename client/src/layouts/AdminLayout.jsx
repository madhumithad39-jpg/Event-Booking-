import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Users,
  ArrowLeft,
  CalendarDays,
} from 'lucide-react';
import Navbar from '../components/Navbar';

export const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="container" style={{ padding: '32px 20px', flex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          {/* Admin Sidebar */}
          <aside
            style={{
              width: '260px',
              flexShrink: 0,
            }}
          >
            <div className="card" style={{ padding: '20px', position: 'sticky', top: '96px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '20px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c084fc',
                  }}
                >
                  <LayoutDashboard size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', color: '#f8fafc' }}>Admin Portal</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evently Management</span>
                </div>
              </div>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <NavLink
                  to="/admin"
                  end
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    transition: 'all 0.15s',
                  })}
                >
                  <LayoutDashboard size={16} />
                  <span>Overview & Stats</span>
                </NavLink>

                <NavLink
                  to="/admin/events"
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    transition: 'all 0.15s',
                  })}
                >
                  <Calendar size={16} />
                  <span>Manage Events</span>
                </NavLink>

                <NavLink
                  to="/admin/bookings"
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    transition: 'all 0.15s',
                  })}
                >
                  <Ticket size={16} />
                  <span>All Bookings</span>
                </NavLink>

                <NavLink
                  to="/admin/users"
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    transition: 'all 0.15s',
                  })}
                >
                  <Users size={16} />
                  <span>Registered Users</span>
                </NavLink>
              </nav>

              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <Link
                  to="/"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <ArrowLeft size={14} />
                  <span>Exit to Public Site</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Admin Content */}
          <main style={{ flex: 1, minWidth: 0 }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

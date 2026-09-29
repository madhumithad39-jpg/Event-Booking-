import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Ticket,
  DollarSign,
  TrendingUp,
  BellRing,
  PlusCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggeringJob, setTriggeringJob] = useState(false);
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/bookings'),
      ]);

      setStats(statsRes.data.stats);
      setRecentBookings(bookingsRes.data.bookings?.slice(0, 5) || []);
    } catch (err) {
      showToast(err.message || 'Failed to load dashboard metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleTriggerReminders = async () => {
    try {
      setTriggeringJob(true);
      const res = await api.post('/admin/trigger-reminders');
      showToast(res.data.message || 'Tomorrow reminder job triggered successfully!', 'success');
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Failed to trigger reminder job', 'error');
    } finally {
      setTriggeringJob(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner" />;
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats?.totalEvents || 0,
      icon: Calendar,
      color: '#818cf8',
      bg: 'rgba(99, 102, 241, 0.15)',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: Ticket,
      color: '#34d399',
      bg: 'rgba(16, 185, 129, 0.15)',
    },
    {
      title: 'Registered Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: '#38bdf8',
      bg: 'rgba(14, 165, 233, 0.15)',
    },
    {
      title: 'Upcoming Events',
      value: stats?.upcomingEvents || 0,
      icon: TrendingUp,
      color: '#fbbf24',
      bg: 'rgba(245, 158, 11, 0.15)',
    },
    {
      title: 'Gross Revenue',
      value: `$${(stats?.totalRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: '#c084fc',
      bg: 'rgba(168, 85, 247, 0.15)',
    },
  ];

  return (
    <div>
      {/* Top Header & Actions */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time analytics and operations for the EVENTLY booking platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleTriggerReminders}
            disabled={triggeringJob}
            className="btn btn-secondary"
            title="Execute tomorrow reminder job immediately"
          >
            <BellRing size={16} />
            <span>{triggeringJob ? 'Executing Job...' : 'Run Tomorrow Reminder Job'}</span>
          </button>

          <Link to="/admin/events?new=true" className="btn btn-primary">
            <PlusCircle size={16} />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}
      >
        {statCards.map((sc, i) => {
          const IconComp = sc.icon;
          return (
            <div key={i} className="card" style={{ padding: '22px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                  {sc.title}
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: sc.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: sc.color,
                  }}
                >
                  <IconComp size={18} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#f8fafc' }}>
                {sc.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table Preview */}
      <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Recent Platform Bookings</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Latest transactions across all published events.
            </p>
          </div>
          <Link to="/admin/bookings" className="btn btn-outline btn-sm">
            <span>View All Bookings</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Attendee</th>
                  <th>Event</th>
                  <th>Tickets</th>
                  <th>Total Amount</th>
                  <th>Date Booked</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#818cf8' }}>
                      {b.bookingId}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{b.userName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                    </td>
                    <td style={{ maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.eventName}
                    </td>
                    <td>{b.ticketCount}</td>
                    <td style={{ fontWeight: 700, color: '#34d399' }}>
                      ${parseFloat(b.totalAmount).toFixed(2)}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {b.formattedBookingDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            No bookings recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;

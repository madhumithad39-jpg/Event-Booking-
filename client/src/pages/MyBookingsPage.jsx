import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  DollarSign,
  ArrowRight,
  Sparkles,
  Frown,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import CategoryBadge from '../components/CategoryBadge';

export const MyBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/bookings/my');
        setUpcomingBookings(res.data.upcoming || []);
        setPastBookings(res.data.past || []);
      } catch (err) {
        showToast(err.message || 'Failed to load bookings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [showToast]);

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Page Title */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
            My <span className="text-gradient">Bookings</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Manage and view all your confirmed tickets, dates, and event venues.
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            borderBottom: '1px solid var(--border)',
            marginBottom: '32px',
          }}
        >
          <button
            onClick={() => setActiveTab('upcoming')}
            style={{
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: '1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'upcoming' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'upcoming' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Upcoming Events</span>
            <span
              className="badge"
              style={{
                backgroundColor: activeTab === 'upcoming' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontSize: '0.75rem',
              }}
            >
              {upcomingBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            style={{
              padding: '12px 24px',
              fontWeight: 600,
              fontSize: '1rem',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'past' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'past' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Past Events</span>
            <span
              className="badge"
              style={{
                backgroundColor: activeTab === 'past' ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
                color: '#fff',
                fontSize: '0.75rem',
              }}
            >
              {pastBookings.length}
            </span>
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="loading-spinner" />
        ) : displayedBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {displayedBookings.map((booking) => (
              <div
                key={booking.id}
                className="card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '24px',
                  alignItems: 'center',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                }}
              >
                {/* Event Thumbnail */}
                <div
                  style={{
                    width: '120px',
                    height: '100px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    backgroundColor: 'var(--bg-card)',
                  }}
                >
                  <img
                    src={booking.image}
                    alt={booking.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>

                {/* Event Info */}
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <CategoryBadge category={booking.category} />
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-card)',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      {booking.bookingId}
                    </span>
                  </div>

                  <Link to={`/events/${booking.eventId}`}>
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        marginBottom: '8px',
                        color: '#f8fafc',
                        transition: 'color 0.15s',
                      }}
                    >
                      {booking.title}
                    </h3>
                  </Link>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.88rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#818cf8" />
                      <span>{booking.formattedDate}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#818cf8" />
                      <span>{booking.time}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="#818cf8" />
                      <span>{booking.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Count & Total Paid */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '8px',
                    marginLeft: 'auto',
                  }}
                >
                  <span className="badge badge-success">
                    {booking.bookingStatus}
                  </span>

                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {booking.ticketCount} {booking.ticketCount > 1 ? 'tickets' : 'ticket'}
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#34d399' }}>
                    ${parseFloat(booking.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card empty-state" style={{ padding: '60px 20px' }}>
            <Frown className="empty-state-icon" />
            <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>
              {activeTab === 'upcoming' ? 'No Upcoming Bookings' : 'No Past Bookings'}
            </h3>
            <p style={{ maxWidth: '380px', margin: '0 auto 20px', color: 'var(--text-secondary)' }}>
              {activeTab === 'upcoming'
                ? "You haven't booked any upcoming experiences yet. Discover new concerts, conferences, or workshops now!"
                : 'You do not have any past events on your account.'}
            </p>
            {activeTab === 'upcoming' && (
              <Link to="/events" className="btn btn-primary">
                Explore Events
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;

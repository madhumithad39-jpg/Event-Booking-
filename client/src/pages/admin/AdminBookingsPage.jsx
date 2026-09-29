import React, { useState, useEffect } from 'react';
import { Search, Ticket, Calendar, DollarSign, Filter } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/bookings');
        setBookings(res.data.bookings || []);
      } catch (err) {
        showToast(err.message || 'Failed to load bookings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [showToast]);

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      b.bookingId.toLowerCase().includes(term) ||
      b.userName?.toLowerCase().includes(term) ||
      b.userEmail?.toLowerCase().includes(term) ||
      b.eventName?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>All Platform Bookings</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Complete ledger of ticket reservations and revenue transactions.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search
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
            placeholder="Search ID, email, attendee, event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ paddingLeft: '42px' }}
          />
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="loading-spinner" />
      ) : filteredBookings.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Attendee</th>
                <th>Event</th>
                <th>Event Schedule</th>
                <th>Tickets</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#818cf8' }}>
                    {b.bookingId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{b.userName}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.userEmail}</div>
                  </td>
                  <td style={{ maxWidth: '200px', fontWeight: 500 }}>
                    {b.eventName}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {b.formattedEventDate} • {b.eventTime}
                  </td>
                  <td style={{ fontWeight: 600 }}>{b.ticketCount}</td>
                  <td style={{ fontWeight: 700, color: '#34d399' }}>
                    ${parseFloat(b.totalAmount).toFixed(2)}
                  </td>
                  <td>
                    <span className="badge badge-success">{b.bookingStatus}</span>
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
        <div className="card empty-state">
          <h3>No Bookings Found</h3>
          <p style={{ margin: '8px 0' }}>
            {searchTerm ? 'No bookings match your current search.' : 'No reservations have been placed yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminBookingsPage;

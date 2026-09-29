import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  DollarSign,
  ArrowRight,
  Printer,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';

export const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    // If accessed directly without state, try to fetch from query param or fallback
    if (!booking) {
      const params = new URLSearchParams(location.search);
      const bookingId = params.get('id');
      if (bookingId) {
        api
          .get(`/bookings/${bookingId}`)
          .then((res) => {
            setBooking(res.data.booking);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, [booking, location.search]);

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div className="card" style={{ padding: '48px 24px' }}>
            <h2>Booking Confirmation</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>
              No active booking details were found. You can view all your confirmed reservations under My Bookings.
            </p>
            <Link to="/my-bookings" className="btn btn-primary">
              Go to My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '640px' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#34d399',
            }}
          >
            <CheckCircle size={38} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Booking Confirmed!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            We've sent a booking confirmation receipt to your registered email address.
          </p>
        </div>

        {/* Digital Ticket Voucher Card */}
        <div
          className="card"
          style={{
            padding: '32px',
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-hover)',
            boxShadow: 'var(--shadow-lg)',
            borderRadius: 'var(--radius-xl)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '20px',
              borderBottom: '1px dashed var(--border-hover)',
              marginBottom: '24px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Booking Reference ID
              </span>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: '#818cf8',
                  marginTop: '4px',
                  letterSpacing: '1px',
                }}
              >
                {booking.bookingId}
              </div>
            </div>

            <span className="badge badge-success">
              ✓ {booking.bookingStatus || 'CONFIRMED'}
            </span>
          </div>

          {/* Event Details */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.45rem', marginBottom: '16px', color: '#f8fafc' }}>
              {booking.eventName}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <Calendar size={17} color="#818cf8" />
                <span>{booking.date}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <Clock size={17} color="#818cf8" />
                <span>{booking.time}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                <MapPin size={17} color="#818cf8" />
                <span>{booking.venue}</span>
              </div>
            </div>
          </div>

          {/* Summary Row */}
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid var(--border)',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc' }}>
                {booking.ticketCount} {booking.ticketCount > 1 ? 'Tickets' : 'Ticket'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Amount Paid</div>
              <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#34d399' }}>
                ${parseFloat(booking.totalAmount).toFixed(2)}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <Sparkles size={13} color="#818cf8" />
            <span>You will receive an automated event reminder 24 hours before showtime.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            justifyContent: 'center',
            marginTop: '32px',
          }}
        >
          <Link to="/my-bookings" className="btn btn-primary" style={{ minWidth: '180px' }}>
            <span>View My Bookings</span>
            <ArrowRight size={16} />
          </Link>

          <Link to="/events" className="btn btn-outline" style={{ minWidth: '180px' }}>
            <span>Browse More Events</span>
          </Link>

          <button onClick={handlePrint} className="btn btn-secondary" style={{ display: 'inline-flex' }}>
            <Printer size={16} />
            <span>Print Voucher</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;

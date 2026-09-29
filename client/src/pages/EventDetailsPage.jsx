import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  DollarSign,
  Share2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { authClient } from '../services/authClient';
import { useToast } from '../context/ToastContext';
import CategoryBadge from '../components/CategoryBadge';

export const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { data: session } = authClient.useSession();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.event);
      } catch (err) {
        showToast(err.message || 'Failed to load event details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, showToast]);

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div className="card" style={{ padding: '48px 24px' }}>
            <h2>Event Not Found</h2>
            <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>
              The event you are looking for might have been removed or does not exist.
            </p>
            <Link to="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const priceNum = parseFloat(event.price);
  const totalAmount = (priceNum * ticketCount).toFixed(2);
  const isSoldOut = event.availableTickets <= 0;
  const maxAvailable = Math.min(10, event.availableTickets);

  const handleIncrement = () => {
    if (ticketCount < maxAvailable) {
      setTicketCount((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (ticketCount > 1) {
      setTicketCount((prev) => prev - 1);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Event link copied to clipboard!', 'info');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleBookTicket = async () => {
    // If not logged in, redirect to login page with return state
    if (!session?.user) {
      showToast('Please sign in to book your tickets', 'info');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (isSoldOut) {
      showToast('Sorry, this event is completely sold out.', 'error');
      return;
    }

    try {
      setBookingLoading(true);
      const res = await api.post('/bookings', {
        eventId: event.id,
        ticketCount,
      });

      showToast('Tickets booked successfully! Confirmation email dispatched.', 'success');

      // Navigate to booking success confirmation page with booking details in state
      navigate(`/booking-success`, {
        state: { booking: res.data.booking },
        replace: true,
      });
    } catch (err) {
      showToast(err.message || 'Failed to book tickets', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="section" style={{ paddingTop: '32px' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to="/events"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Events</span>
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 380px',
            gap: '40px',
            alignItems: 'start',
          }}
          className="event-details-layout"
        >
          {/* Left Column: Event Visual & Information */}
          <div>
            {/* Banner Image */}
            <div
              style={{
                width: '100%',
                height: '420px',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '32px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <img
                src={event.image}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
                <CategoryBadge category={event.category} />
              </div>
              <button
                onClick={handleShare}
                className="btn btn-secondary btn-sm"
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  borderRadius: 'var(--radius-full)',
                  backdropFilter: 'blur(8px)',
                  backgroundColor: 'rgba(10, 14, 26, 0.75)',
                }}
              >
                {copied ? <CheckCircle2 size={15} color="#10b981" /> : <Share2 size={15} />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>

            {/* Event Title */}
            <h1
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}
            >
              {event.title}
            </h1>

            {/* Metadata Grid */}
            <div
              className="card"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                padding: '24px',
                marginBottom: '36px',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <div style={{ display: 'flex', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Date
                  </div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                    {formattedDate}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8',
                    flexShrink: 0,
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Time
                  </div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                    {event.time}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Location
                  </div>
                  <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.95rem' }}>
                    {event.venue}
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>About This Event</h2>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.05rem',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-line',
                }}
              >
                {event.description}
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Checkout Widget (Sticky) */}
          <div style={{ position: 'sticky', top: '96px' }}>
            <div
              className="card"
              style={{
                padding: '28px',
                border: '1px solid var(--border-hover)',
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: '24px',
                  paddingBottom: '20px',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Ticket Price
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-display)' }}>
                    {priceNum === 0 ? 'Free' : `$${priceNum.toFixed(2)}`}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {isSoldOut ? (
                    <span className="badge badge-danger">Sold Out</span>
                  ) : (
                    <span className="badge badge-success">
                      <Ticket size={12} style={{ marginRight: 4 }} />
                      {event.availableTickets} Available
                    </span>
                  )}
                </div>
              </div>

              {!isSoldOut && (
                <>
                  {/* Quantity Stepper Selector */}
                  <div style={{ marginBottom: '24px' }}>
                    <label className="form-label" style={{ marginBottom: '10px' }}>
                      Select Number of Tickets
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="stepper-box">
                        <button
                          onClick={handleDecrement}
                          disabled={ticketCount <= 1}
                          className="stepper-btn"
                          aria-label="Decrease tickets"
                        >
                          <Minus size={16} />
                        </button>
                        <div className="stepper-val">{ticketCount}</div>
                        <button
                          onClick={handleIncrement}
                          disabled={ticketCount >= maxAvailable}
                          className="stepper-btn"
                          aria-label="Increase tickets"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Max {maxAvailable} per booking
                      </div>
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      marginBottom: '24px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span>
                        ${priceNum.toFixed(2)} × {ticketCount} {ticketCount > 1 ? 'tickets' : 'ticket'}
                      </span>
                      <span style={{ color: 'var(--text-primary)' }}>${totalAmount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <span>Service Fee</span>
                      <span style={{ color: '#34d399' }}>$0.00 (Waived)</span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border)',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        color: '#f8fafc',
                      }}
                    >
                      <span>Total Amount</span>
                      <span style={{ color: '#34d399' }}>${totalAmount}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Book Ticket Button */}
              {isSoldOut ? (
                <button disabled className="btn btn-secondary" style={{ width: '100%', padding: '14px' }}>
                  Sold Out
                </button>
              ) : (
                <button
                  onClick={handleBookTicket}
                  disabled={bookingLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
                >
                  {bookingLoading ? (
                    'Processing Booking...'
                  ) : session?.user ? (
                    `Book Ticket • $${totalAmount}`
                  ) : (
                    'Sign In to Book Ticket'
                  )}
                </button>
              )}

              <div
                style={{
                  marginTop: '16px',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={13} color="#818cf8" />
                <span>Instant confirmation & automated reminder</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive layout CSS */}
      <style>{`
        @media (max-width: 960px) {
          .event-details-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default EventDetailsPage;

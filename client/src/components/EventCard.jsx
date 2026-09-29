import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

export const EventCard = ({ event }) => {
  if (!event) return null;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const priceNum = parseFloat(event.price);
  const isFree = priceNum === 0;
  const isSoldOut = event.availableTickets <= 0;
  const isLowStock = !isSoldOut && event.availableTickets <= 15;

  return (
    <div className="event-card">
      <div className="event-card-image-wrap">
        <img
          src={event.image}
          alt={event.title}
          className="event-card-image"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div className="event-card-badge">
          <CategoryBadge category={event.category} />
        </div>
        <div className="event-card-price">
          {isFree ? 'Free' : `$${priceNum.toFixed(2)}`}
        </div>
      </div>

      <div className="event-card-body">
        <Link to={`/events/${event.id}`}>
          <h3 className="event-card-title" title={event.title}>
            {event.title}
          </h3>
        </Link>

        <div className="event-card-meta">
          <div className="event-card-meta-item">
            <Calendar size={15} color="#818cf8" />
            <span>
              {formattedDate} {event.time && `• ${event.time}`}
            </span>
          </div>
          <div className="event-card-meta-item">
            <MapPin size={15} color="#818cf8" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.venue}
            </span>
          </div>
        </div>

        <div className="event-card-footer">
          <div className="ticket-status-box">
            {isSoldOut ? (
              <span className="ticket-status sold-out">Sold Out</span>
            ) : (
              <span className={`ticket-status ${isLowStock ? 'low' : 'available'}`}>
                <Ticket size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                {event.availableTickets} tickets left
              </span>
            )}
          </div>

          <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">
            <span>View Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

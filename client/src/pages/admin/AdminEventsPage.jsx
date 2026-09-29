import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  X,
  AlertTriangle,
  Sparkles,
  Ticket,
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import CategoryBadge from '../../components/CategoryBadge';

export const AdminEventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music',
    date: '',
    time: '',
    venue: '',
    price: 0,
    totalTickets: 100,
    image: '',
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [eventsRes, catRes] = await Promise.all([
        api.get('/events?sort=date-asc'),
        api.get('/categories'),
      ]);
      setEvents(eventsRes.data.events || []);
      setCategories(catRes.data.categories || []);
    } catch (err) {
      showToast(err.message || 'Failed to load events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Open modal if query param ?new=true
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      handleOpenCreate();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      category: categories[0]?.name || 'Music',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      time: '18:00',
      venue: '',
      price: 0,
      totalTickets: 100,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    const dateFormatted = new Date(event.date).toISOString().split('T')[0];
    setFormData({
      title: event.title,
      description: event.description,
      category: event.category,
      date: dateFormatted,
      time: event.time,
      venue: event.venue,
      price: event.price,
      totalTickets: event.totalTickets,
      image: event.image,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.venue.trim() || !formData.image.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    try {
      setSubmitting(true);

      if (editingEvent) {
        // Update Event
        const res = await api.put(`/events/${editingEvent.id}`, formData);
        showToast(
          res.data.meaningfulChangesDetected
            ? 'Event updated! Update notifications dispatched to booked users.'
            : 'Event updated successfully.',
          'success'
        );
      } else {
        // Create Event
        const res = await api.post('/events', formData);
        showToast('Event published! New event notification email dispatched to users.', 'success');
      }

      setModalOpen(false);
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to save event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmEvent) return;

    try {
      setSubmitting(true);
      await api.delete(`/events/${deleteConfirmEvent.id}`);
      showToast('Event removed successfully', 'success');
      setDeleteConfirmEvent(null);
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '6px' }}>Manage Events</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Publish new experiences, modify schedules, and manage ticket allocations.
          </p>
        </div>

        <button onClick={handleOpenCreate} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="loading-spinner" />
      ) : events.length > 0 ? (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Category</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Price</th>
                <th>Tickets (Avail/Total)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => {
                const formattedDate = new Date(ev.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                return (
                  <tr key={ev.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={ev.image}
                          alt={ev.title}
                          style={{
                            width: '48px',
                            height: '40px',
                            borderRadius: '6px',
                            objectFit: 'cover',
                          }}
                        />
                        <span style={{ fontWeight: 600, color: '#f8fafc', maxWidth: '200px' }}>
                          {ev.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <CategoryBadge category={ev.category} />
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {formattedDate} at {ev.time}
                    </td>
                    <td style={{ color: 'var(--text-secondary)', maxWidth: '160px' }}>
                      {ev.venue}
                    </td>
                    <td style={{ fontWeight: 600, color: '#34d399' }}>
                      ${parseFloat(ev.price).toFixed(2)}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: ev.availableTickets <= 5 ? '#fb7185' : '#f8fafc' }}>
                        {ev.availableTickets}
                      </span>{' '}
                      / {ev.totalTickets}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(ev)}
                          className="btn btn-outline btn-sm"
                          title="Edit Event"
                          style={{ padding: '6px 10px' }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmEvent(ev)}
                          className="btn btn-danger btn-sm"
                          title="Delete Event"
                          style={{ padding: '6px 10px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card empty-state">
          <h3>No Events Created Yet</h3>
          <p style={{ margin: '8px 0 20px' }}>Start by adding your first event to the platform.</p>
          <button onClick={handleOpenCreate} className="btn btn-primary">
            Create Event
          </button>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h2 style={{ fontSize: '1.4rem' }}>
                {editingEvent ? 'Edit Event Details' : 'Create New Event'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {editingEvent && (
              <div
                style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px 14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.85rem',
                  color: '#fde68a',
                }}
              >
                <AlertTriangle size={18} color="#fbbf24" style={{ flexShrink: 0 }} />
                <span>
                  Modifying title, category, date, time, venue, or description will automatically dispatch an update email to all booked attendees.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="e.g. World Electronic Dance Festival"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="select"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ticket Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 19:30 or 7:30 PM"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Venue Location *</label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="input"
                    placeholder="Grand Arena, Hall 4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Tickets *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalTickets}
                    onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                    className="input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL *</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="input"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="textarea"
                  rows={4}
                  placeholder="Detailed schedule, highlights, performers..."
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary">
                  {submitting ? 'Saving Event...' : editingEvent ? 'Update Event' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmEvent && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#fb7185',
              }}
            >
              <Trash2 size={26} />
            </div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Delete Event?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px' }}>
              Are you sure you want to delete <strong>"{deleteConfirmEvent.title}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirmEvent(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button onClick={handleDelete} disabled={submitting} className="btn btn-danger">
                {submitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;

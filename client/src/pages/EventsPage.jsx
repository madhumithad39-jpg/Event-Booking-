import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, ArrowUpDown, X, Frown } from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';

export const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [dateFilter, setDateFilter] = useState(searchParams.get('dateFilter') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'date-asc');

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Update query params in URL whenever filter state changes
  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category && category !== 'All') params.category = category;
    if (dateFilter && dateFilter !== 'all') params.dateFilter = dateFilter;
    if (sort && sort !== 'date-asc') params.sort = sort;

    setSearchParams(params, { replace: true });
  }, [search, category, dateFilter, sort, setSearchParams]);

  // Fetch events based on current active filters
  useEffect(() => {
    const fetchFilteredEvents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search.trim()) params.append('search', search.trim());
        if (category && category !== 'All') params.append('category', category);
        if (dateFilter && dateFilter !== 'all') params.append('dateFilter', dateFilter);
        if (sort) params.append('sort', sort);

        const res = await api.get(`/events?${params.toString()}`);
        setEvents(res.data.events || []);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEvents();
  }, [search, category, dateFilter, sort]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setDateFilter('all');
    setSort('date-asc');
  };

  const hasActiveFilters =
    search.trim() !== '' || category !== 'All' || dateFilter !== 'all' || sort !== 'date-asc';

  return (
    <div className="section">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>
            All <span className="text-gradient">Events</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
            Browse and reserve tickets for upcoming concerts, tech conferences, workshops, and sports.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div
          className="card"
          style={{
            padding: '20px',
            marginBottom: '36px',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
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
                placeholder="Search event title or venue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input"
                style={{ paddingLeft: '42px' }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="select"
              >
                <option value="all">Any Date</option>
                <option value="upcoming">Upcoming (From Today)</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="this-weekend">This Weekend</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="select"
              >
                <option value="date-asc">Date: Soonest First</option>
                <option value="date-desc">Date: Furthest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Popularity / Tickets Sold</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Active Filters:</span>
              {search && (
                <span className="badge badge-primary">
                  Search: "{search}"
                </span>
              )}
              {category !== 'All' && (
                <span className="badge badge-primary">Category: {category}</span>
              )}
              {dateFilter !== 'all' && (
                <span className="badge badge-primary">Date: {dateFilter}</span>
              )}
              {sort !== 'date-asc' && (
                <span className="badge badge-primary">Sort: {sort}</span>
              )}

              <button
                onClick={handleResetFilters}
                className="btn btn-outline btn-sm"
                style={{ padding: '3px 10px', fontSize: '0.78rem', marginLeft: 'auto' }}
              >
                <X size={12} />
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Showing <strong>{events.length}</strong> events
        </div>

        {/* Events Grid or Empty State */}
        {loading ? (
          <div className="loading-spinner" />
        ) : events.length > 0 ? (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="card empty-state" style={{ padding: '60px 20px' }}>
            <Frown className="empty-state-icon" />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Events Match Your Search</h3>
            <p style={{ maxWidth: '420px', margin: '0 auto 24px', color: 'var(--text-secondary)' }}>
              We couldn't find any events matching your current filter criteria. Try adjusting keywords or clearing category filters.
            </p>
            <button onClick={handleResetFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;

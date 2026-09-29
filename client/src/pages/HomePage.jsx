import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Music,
  Cpu,
  BookOpen,
  Wrench,
  Activity,
  Palette,
  Sparkles,
  Calendar,
  Flame,
  ArrowRight,
} from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';

const categoryIcons = {
  Music: Music,
  Technology: Cpu,
  Education: BookOpen,
  Workshop: Wrench,
  Sports: Activity,
  Cultural: Palette,
};

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [popularEvents, setPopularEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeEvents = async () => {
      try {
        setLoading(true);
        const [featuredRes, upcomingRes, popularRes] = await Promise.all([
          api.get('/events?featured=true'),
          api.get('/events?dateFilter=upcoming&limit=6&sort=date-asc'),
          api.get('/events?limit=4&sort=popular'),
        ]);

        setFeaturedEvents(featuredRes.data.events || []);
        setUpcomingEvents(upcomingRes.data.events || []);
        setPopularEvents(popularRes.data.events || []);
      } catch (err) {
        console.error('Error fetching home events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeEvents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/events');
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/events?category=${encodeURIComponent(categoryName)}`);
  };

  const categories = [
    { name: 'Music', label: 'Music', icon: Music },
    { name: 'Technology', label: 'Technology', icon: Cpu },
    { name: 'Education', label: 'Education', icon: BookOpen },
    { name: 'Workshop', label: 'Workshop', icon: Wrench },
    { name: 'Sports', label: 'Sports', icon: Activity },
    { name: 'Cultural', label: 'Cultural', icon: Palette },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '90px 0 80px',
          background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0a0d18 70%)',
          borderBottom: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div
            className="badge badge-primary"
            style={{ marginBottom: '20px', padding: '6px 16px', fontSize: '0.85rem' }}
          >
            <Sparkles size={14} style={{ marginRight: 4 }} />
            Discover. Book. Experience.
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              letterSpacing: '-1px',
              maxWidth: '850px',
              margin: '0 auto 20px',
              lineHeight: 1.15,
            }}
          >
            Discover Your Next <span className="text-gradient">Experience</span>
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              maxWidth: '620px',
              margin: '0 auto 36px',
            }}
          >
            From arena concerts and tech hackathons to hands-on masterclasses and championship sports. Seamless booking in seconds.
          </p>

          {/* Search Bar Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: '580px',
              margin: '0 auto 48px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: '18px',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search events, concerts, workshops, or venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
              style={{
                paddingLeft: '50px',
                paddingRight: '130px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(18, 24, 45, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: 'var(--shadow-lg)',
                fontSize: '1rem',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                position: 'absolute',
                right: '6px',
                height: '44px',
                borderRadius: 'var(--radius-full)',
                padding: '0 22px',
              }}
            >
              Search
            </button>
          </form>

          {/* Category Cards / Buttons */}
          <div className="category-grid" style={{ marginTop: '20px' }}>
            {categories.map((cat) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={cat.name}
                  className="category-card"
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="category-icon-box">
                    <IconComp size={24} />
                  </div>
                  <span className="category-card-name">{cat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
            }}
          >
            <div>
              <div className="badge badge-primary" style={{ marginBottom: '8px' }}>
                Handpicked
              </div>
              <h2 className="section-title">Featured Experiences</h2>
              <p className="section-subtitle">Specially curated events you won't want to miss</p>
            </div>
            <Link to="/events" className="btn btn-outline btn-sm">
              <span>View All Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <div className="events-grid">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
            }}
          >
            <div>
              <div
                className="badge"
                style={{
                  backgroundColor: 'rgba(14, 165, 233, 0.15)',
                  color: '#38bdf8',
                  borderColor: 'rgba(14, 165, 233, 0.3)',
                  marginBottom: '8px',
                }}
              >
                <Calendar size={13} style={{ marginRight: 4 }} />
                Upcoming
              </div>
              <h2 className="section-title">Happening Soon</h2>
              <p className="section-subtitle">Reserve tickets for upcoming dates before they sell out</p>
            </div>
            <Link to="/events?dateFilter=upcoming" className="btn btn-outline btn-sm">
              <span>See Calendar</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Events Section */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '32px',
            }}
          >
            <div>
              <div
                className="badge"
                style={{
                  backgroundColor: 'rgba(236, 72, 153, 0.15)',
                  color: '#f472b6',
                  borderColor: 'rgba(236, 72, 153, 0.3)',
                  marginBottom: '8px',
                }}
              >
                <Flame size={13} style={{ marginRight: 4 }} />
                Trending
              </div>
              <h2 className="section-title">Popular Events</h2>
              <p className="section-subtitle">Most booked experiences by the EVENTLY community</p>
            </div>
            <Link to="/events?sort=popular" className="btn btn-outline btn-sm">
              <span>View Popular</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="loading-spinner" />
          ) : (
            <div className="events-grid">
              {popularEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;

import { query } from '../config/db.js';

export const seedData = async () => {
  console.log('[Database] Checking seed data...');

  // 1. Seed Categories
  const categories = [
    { name: 'Music', icon: 'music', description: 'Live concerts, music festivals, acoustic sessions, and symphonies.' },
    { name: 'Technology', icon: 'cpu', description: 'Developer conferences, AI summits, hackathons, and product launches.' },
    { name: 'Education', icon: 'book-open', description: 'Academic symposiums, masterclasses, and executive training.' },
    { name: 'Workshop', icon: 'tool', description: 'Hands-on creative, coding, UI/UX, and culinary workshops.' },
    { name: 'Sports', icon: 'activity', description: 'Marathons, football championships, esports, and fitness rallies.' },
    { name: 'Cultural', icon: 'feather', description: 'Art exhibitions, theater drama, heritage walks, and food festivals.' },
  ];

  for (const cat of categories) {
    await query(
      `INSERT INTO "categories" ("name", "icon", "description")
       VALUES ($1, $2, $3)
       ON CONFLICT ("name") DO UPDATE SET "icon" = EXCLUDED."icon", "description" = EXCLUDED."description"`,
      [cat.name, cat.icon, cat.description]
    );
  }
  console.log('[Database] Categories seeded.');

  // 2. Check existing events
  const existingEvents = await query('SELECT COUNT(*) FROM "events"');
  if (parseInt(existingEvents.rows[0].count, 10) === 0) {
    console.log('[Database] Seeding sample events...');

    // Helper for relative dates
    const getFutureDate = (daysAhead) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      return d.toISOString().split('T')[0];
    };

    const sampleEvents = [
      {
        title: 'Neon Horizon: Electronic Music Festival 2026',
        description: 'Immerse yourself in world-class audio-visual stage production featuring global headlining DJs, ambient laser domes, interactive light sculptures, and artisan food trucks.',
        category: 'Music',
        date: getFutureDate(1), // Tomorrow! Perfect for verifying tomorrow reminder job
        time: '18:00',
        venue: 'Grand Harbor Waterfront Arena, Bay Area',
        price: 85.00,
        totalTickets: 250,
        availableTickets: 248,
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Global AI & Cloud Architecture Summit',
        description: 'Join 1,500+ principal engineers, researchers, and tech founders to explore generative AI, agentic systems, edge computing, and distributed database scaling.',
        category: 'Technology',
        date: getFutureDate(5),
        time: '09:30',
        venue: 'Metropolitan Tech Center, Hall A',
        price: 199.00,
        totalTickets: 300,
        availableTickets: 285,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Hands-On UI/UX & Design Systems Masterclass',
        description: 'An intensive, full-day interactive workshop on building scalable design tokens, accessible components, micro-interactions, and high-fidelity prototypes in Figma.',
        category: 'Workshop',
        date: getFutureDate(9),
        time: '10:00',
        venue: 'Creatives Studio 42, Downtown',
        price: 65.00,
        totalTickets: 40,
        availableTickets: 38,
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Midnight Symphony: Classical Strings by Candlelight',
        description: 'Experience timeless masterpieces by Vivaldi, Mozart, and contemporary composers performed live by a premier 40-piece chamber orchestra illuminated by 2,000 flickering candles.',
        category: 'Music',
        date: getFutureDate(14),
        time: '20:00',
        venue: 'Cathedral of St. Jude, Sanctuary Hall',
        price: 45.00,
        totalTickets: 180,
        availableTickets: 172,
        image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'City Marathon 2026: 10K & Half Marathon Run',
        description: 'Lace up your running shoes for the annual city run along scenic coastal boulevards, through green parks, with live bands at every mile marker and custom finisher medals.',
        category: 'Sports',
        date: getFutureDate(18),
        time: '06:00',
        venue: 'City Promenade Plaza & Coastal Route',
        price: 35.00,
        totalTickets: 500,
        availableTickets: 480,
        image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Global Horizons: Contemporary Art & Sculpture Expo',
        description: 'Discover curated installations, kinetic sculptures, and mixed-media masterpieces by 60 international artists. Includes curator walkthroughs and opening wine reception.',
        category: 'Cultural',
        date: getFutureDate(24),
        time: '14:00',
        venue: 'Palace of Modern Arts, East Wing',
        price: 25.00,
        totalTickets: 200,
        availableTickets: 195,
        image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'NextGen Founders: Venture Capital & Startup Pitch',
        description: 'Watch 12 vetted startups pitch to Tier-1 investors. Keynotes on fundraising strategies, product-market fit, and scaling during macroeconomic shifts.',
        category: 'Education',
        date: getFutureDate(28),
        time: '13:00',
        venue: 'Innovators Hub, Level 8 Auditorium',
        price: 50.00,
        totalTickets: 120,
        availableTickets: 115,
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Artisan Culinary Workshop: Handmade Pasta & Wine Pairing',
        description: 'Roll up your sleeves with Michelin-experienced chefs to handcraft fresh pasta from scratch, master authentic sauces, and discover sommelier-paired regional wines.',
        category: 'Workshop',
        date: getFutureDate(32),
        time: '17:30',
        venue: 'The Culinary Academy, Kitchen Studio B',
        price: 95.00,
        totalTickets: 25,
        availableTickets: 22,
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
      },
    ];

    for (const ev of sampleEvents) {
      await query(
        `INSERT INTO "events" 
         ("title", "description", "category", "date", "time", "venue", "price", "totalTickets", "availableTickets", "image")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          ev.title,
          ev.description,
          ev.category,
          ev.date,
          ev.time,
          ev.venue,
          ev.price,
          ev.totalTickets,
          ev.availableTickets,
          ev.image,
        ]
      );
    }
    console.log(`[Database] Seeded ${sampleEvents.length} sample events.`);
  }

  // 3. Update admin user role if user with ADMIN_EMAIL exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@evently.com';
  await query(
    `UPDATE "user" SET "role" = 'admin', "emailVerified" = true WHERE "email" = $1`,
    [adminEmail.toLowerCase()]
  );
};

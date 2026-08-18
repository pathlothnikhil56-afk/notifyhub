import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

let isNeonConnected = false;
let pool = null;

// In-memory fallback database store
let memoryStore = {
  announcements: [
    {
      id: 1,
      title: 'Spring 2026 Final Semester Registration Now Live',
      content: 'All undergraduate and postgraduate students are requested to complete elective subject enrollment before the final deadline. Ensure prerequisite verifications with your department mentor.',
      category: 'Academic',
      priority: 'High',
      author: 'Dean of Academic Affairs',
      tags: ['Academics', 'Registration', 'Important'],
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 2,
      title: 'Campus Central Server Maintenance Window',
      content: 'IT services, ERP portal, and LMS servers will undergo critical security patches and maintenance this Saturday from 12:00 AM to 06:00 AM. Internet in dormitories may experience brief interruptions.',
      category: 'Maintenance',
      priority: 'Normal',
      author: 'IT Operations Hub',
      tags: ['IT Support', 'Maintenance', 'Network'],
      created_at: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 3,
      title: 'Global Tech Leadership Summit & Hackathon 2026',
      content: 'NotifyHub is hosting the annual inter-college Hackathon with $10,000 in grand prizes. Registration is open to teams of 2-4 members until next Friday.',
      category: 'Campus',
      priority: 'Normal',
      author: 'Student Council',
      tags: ['Hackathon', 'Competition', 'Coding'],
      created_at: new Date(Date.now() - 3600000 * 36).toISOString()
    },
    {
      id: 4,
      title: 'Annual Campus Placement Drive - Top Tier Recruiters',
      content: 'Tier-1 tech and analytics firms are visiting next month. Pre-placement talks and resume review sessions begin this Monday at the Main Auditorium.',
      category: 'Placements',
      priority: 'High',
      author: 'Career Development Cell',
      tags: ['Placements', 'Careers', 'Jobs'],
      created_at: new Date(Date.now() - 3600000 * 50).toISOString()
    }
  ],
  events: [
    {
      id: 1,
      title: 'NotifyHub Hackathon 2026: Code The Future',
      description: '36-hour intense hackathon focusing on AI agents, IoT communication, and real-time notification infrastructure.',
      location: 'Innovation Lab, Tower B & Virtual',
      event_date: new Date(Date.now() + 86400000 * 5).toISOString(),
      category: 'Hackathon',
      rsvp_count: 142,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'AI & Cloud Systems Guest Keynote with Dr. S. Rao',
      description: 'Insights into scalable distributed messaging architectures and generative AI pipelines at enterprise scale.',
      location: 'Main Auditorium, Hall 1',
      event_date: new Date(Date.now() + 86400000 * 2 + 3600000 * 4).toISOString(),
      category: 'Seminar',
      rsvp_count: 89,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Spring Cultural & Music Fest 2026',
      description: 'Two days of non-stop music, cultural dance, theater, food stalls, and battle of the bands.',
      location: 'Open Air Amphitheatre',
      event_date: new Date(Date.now() + 86400000 * 12).toISOString(),
      category: 'Cultural',
      rsvp_count: 320,
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Career & Internship Expo 2026',
      description: 'Meet 50+ startup founders, recruiters, and alumni mentors looking for software, data, and design interns.',
      location: 'Sports Complex Convention Center',
      event_date: new Date(Date.now() + 86400000 * 8).toISOString(),
      category: 'Career',
      rsvp_count: 215,
      created_at: new Date().toISOString()
    }
  ],
  urgent_alerts: [
    {
      id: 1,
      title: 'CRITICAL: Severe Weather Warning & Campus Transit Advisory',
      message: 'Meteorological department has issued heavy rain & thunder alerts for the next 24 hours. Evening campus shuttle buses are rerouted via North Gate. All outdoor laboratory activities are suspended.',
      severity: 'Critical',
      affected_areas: 'All Campus Zones & Shuttles',
      is_active: true,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 2,
      title: 'URGENT: Water Supply Maintenance in Hostel Blocks C & D',
      message: 'Emergency pipe maintenance is scheduled today between 2:00 PM and 5:00 PM. Backup water tanks have been mobilized at the quadrangle.',
      severity: 'High',
      affected_areas: 'Hostel Blocks C & D',
      is_active: true,
      created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ],
  countdowns: [
    {
      id: 1,
      title: 'NotifyHub Hackathon 2026 Kickoff',
      target_date: new Date(Date.now() + 86400000 * 5 + 3600000 * 3).toISOString(),
      description: 'Opening ceremony and release of problem statements.',
      category: 'Competition',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Semester Course Registration Deadline',
      target_date: new Date(Date.now() + 86400000 * 3 + 3600000 * 10).toISOString(),
      description: 'Portal closes automatically at 11:59 PM sharp.',
      category: 'Academic',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'IT Infrastructure Maintenance Outage',
      target_date: new Date(Date.now() + 86400000 * 1 + 3600000 * 6).toISOString(),
      description: 'Scheduled window for primary router upgrade.',
      category: 'Maintenance',
      created_at: new Date().toISOString()
    }
  ],
  contact_messages: [
    {
      id: 1,
      name: 'Alex Johnson',
      email: 'alex.j@example.com',
      department: 'Academic Support',
      subject: 'Inquiry regarding elective credit transfer',
      message: 'Hello, I submitted my credit transfer form last week and would like to verify its current review status.',
      status: 'Open',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

// Initialize database
export async function initDB() {
  if (DATABASE_URL && DATABASE_URL.trim().startsWith('postgres')) {
    try {
      console.log('Connecting to Vercel Neon PostgreSQL database...');
      pool = new Pool({ connectionString: DATABASE_URL });

      // Test connection
      await pool.query('SELECT NOW()');
      isNeonConnected = true;
      console.log(' Successfully connected to Vercel Neon PostgreSQL!');

      // Create tables
      await pool.query(`
        CREATE TABLE IF NOT EXISTS announcements (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category VARCHAR(100) NOT NULL DEFAULT 'General',
          priority VARCHAR(50) NOT NULL DEFAULT 'Normal',
          author VARCHAR(100) NOT NULL DEFAULT 'Admin',
          tags TEXT[] DEFAULT ARRAY[]::TEXT[],
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS events (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          location TEXT NOT NULL,
          event_date TIMESTAMPTZ NOT NULL,
          category VARCHAR(100) NOT NULL DEFAULT 'General',
          rsvp_count INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS urgent_alerts (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          message TEXT NOT NULL,
          severity VARCHAR(50) NOT NULL DEFAULT 'High',
          affected_areas TEXT NOT NULL DEFAULT 'All',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS countdowns (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          target_date TIMESTAMPTZ NOT NULL,
          description TEXT,
          category VARCHAR(100) NOT NULL DEFAULT 'General',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          email VARCHAR(150) NOT NULL,
          department VARCHAR(100) NOT NULL DEFAULT 'General',
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'Open',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Seed data if empty
      const { rows: annCount } = await pool.query('SELECT count(*) FROM announcements');
      if (parseInt(annCount[0].count) === 0) {
        console.log('Seeding initial data into Neon PostgreSQL...');
        for (const a of memoryStore.announcements) {
          await pool.query(
            'INSERT INTO announcements (title, content, category, priority, author, tags, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [a.title, a.content, a.category, a.priority, a.author, a.tags, a.created_at]
          );
        }
        for (const e of memoryStore.events) {
          await pool.query(
            'INSERT INTO events (title, description, location, event_date, category, rsvp_count, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [e.title, e.description, e.location, e.event_date, e.category, e.rsvp_count, e.created_at]
          );
        }
        for (const u of memoryStore.urgent_alerts) {
          await pool.query(
            'INSERT INTO urgent_alerts (title, message, severity, affected_areas, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6)',
            [u.title, u.message, u.severity, u.affected_areas, u.is_active, u.created_at]
          );
        }
        for (const c of memoryStore.countdowns) {
          await pool.query(
            'INSERT INTO countdowns (title, target_date, description, category, created_at) VALUES ($1, $2, $3, $4, $5)',
            [c.title, c.target_date, c.description, c.category, c.created_at]
          );
        }
        console.log(' Database seeded successfully with initial mock records!');
      }
    } catch (err) {
      console.error(' Failed to connect or initialize Neon PostgreSQL:', err.message);
      console.log(' Running with robust in-memory database store.');
      isNeonConnected = false;
    }
  } else {
    console.log('ℹ No DATABASE_URL set. Running with built-in memory store (configure .env with Vercel Neon connection string anytime).');
  }
}

// Database helper functions
export const db = {
  isNeonConnected: () => isNeonConnected,
  
  // Announcements
  getAnnouncements: async (category) => {
    if (isNeonConnected) {
      let query = 'SELECT * FROM announcements';
      const params = [];
      if (category && category !== 'All') {
        query += ' WHERE category = $1';
        params.push(category);
      }
      query += ' ORDER BY created_at DESC';
      const res = await pool.query(query, params);
      return res.rows;
    }
    let list = [...memoryStore.announcements];
    if (category && category !== 'All') {
      list = list.filter(item => item.category.toLowerCase() === category.toLowerCase());
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createAnnouncement: async ({ title, content, category = 'General', priority = 'Normal', author = 'Admin', tags = [] }) => {
    if (isNeonConnected) {
      const res = await pool.query(
        'INSERT INTO announcements (title, content, category, priority, author, tags) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, content, category, priority, author, tags]
      );
      return res.rows[0];
    }
    const item = {
      id: Date.now(),
      title,
      content,
      category,
      priority,
      author,
      tags,
      created_at: new Date().toISOString()
    };
    memoryStore.announcements.unshift(item);
    return item;
  },

  deleteAnnouncement: async (id) => {
    if (isNeonConnected) {
      await pool.query('DELETE FROM announcements WHERE id = $1', [id]);
      return true;
    }
    memoryStore.announcements = memoryStore.announcements.filter(a => a.id !== Number(id));
    return true;
  },

  // Events
  getEvents: async () => {
    if (isNeonConnected) {
      const res = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
      return res.rows;
    }
    return [...memoryStore.events].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  },

  createEvent: async ({ title, description, location, event_date, category = 'General' }) => {
    if (isNeonConnected) {
      const res = await pool.query(
        'INSERT INTO events (title, description, location, event_date, category, rsvp_count) VALUES ($1, $2, $3, $4, $5, 0) RETURNING *',
        [title, description, location, event_date, category]
      );
      return res.rows[0];
    }
    const item = {
      id: Date.now(),
      title,
      description,
      location,
      event_date,
      category,
      rsvp_count: 0,
      created_at: new Date().toISOString()
    };
    memoryStore.events.push(item);
    return item;
  },

  rsvpEvent: async (id) => {
    if (isNeonConnected) {
      const res = await pool.query('UPDATE events SET rsvp_count = rsvp_count + 1 WHERE id = $1 RETURNING *', [id]);
      return res.rows[0];
    }
    const item = memoryStore.events.find(e => e.id === Number(id));
    if (item) {
      item.rsvp_count = (item.rsvp_count || 0) + 1;
      return item;
    }
    return null;
  },

  // Urgent Alerts
  getUrgentAlerts: async () => {
    if (isNeonConnected) {
      const res = await pool.query('SELECT * FROM urgent_alerts WHERE is_active = true ORDER BY created_at DESC');
      return res.rows;
    }
    return memoryStore.urgent_alerts.filter(u => u.is_active).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  createUrgentAlert: async ({ title, message, severity = 'High', affected_areas = 'All' }) => {
    if (isNeonConnected) {
      const res = await pool.query(
        'INSERT INTO urgent_alerts (title, message, severity, affected_areas, is_active) VALUES ($1, $2, $3, $4, true) RETURNING *',
        [title, message, severity, affected_areas]
      );
      return res.rows[0];
    }
    const item = {
      id: Date.now(),
      title,
      message,
      severity,
      affected_areas,
      is_active: true,
      created_at: new Date().toISOString()
    };
    memoryStore.urgent_alerts.unshift(item);
    return item;
  },

  dismissUrgentAlert: async (id) => {
    if (isNeonConnected) {
      await pool.query('UPDATE urgent_alerts SET is_active = false WHERE id = $1', [id]);
      return true;
    }
    const item = memoryStore.urgent_alerts.find(u => u.id === Number(id));
    if (item) {
      item.is_active = false;
    }
    return true;
  },

  // Countdowns
  getCountdowns: async () => {
    if (isNeonConnected) {
      const res = await pool.query('SELECT * FROM countdowns ORDER BY target_date ASC');
      return res.rows;
    }
    return [...memoryStore.countdowns].sort((a, b) => new Date(a.target_date) - new Date(b.target_date));
  },

  createCountdown: async ({ title, target_date, description = '', category = 'General' }) => {
    if (isNeonConnected) {
      const res = await pool.query(
        'INSERT INTO countdowns (title, target_date, description, category) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, target_date, description, category]
      );
      return res.rows[0];
    }
    const item = {
      id: Date.now(),
      title,
      target_date,
      description,
      category,
      created_at: new Date().toISOString()
    };
    memoryStore.countdowns.push(item);
    return item;
  },

  deleteCountdown: async (id) => {
    if (isNeonConnected) {
      await pool.query('DELETE FROM countdowns WHERE id = $1', [id]);
      return true;
    }
    memoryStore.countdowns = memoryStore.countdowns.filter(c => c.id !== Number(id));
    return true;
  },

  // Contact Messages
  createContactMessage: async ({ name, email, department = 'General', subject, message }) => {
    if (isNeonConnected) {
      const res = await pool.query(
        'INSERT INTO contact_messages (name, email, department, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, email, department, subject, message]
      );
      return res.rows[0];
    }
    const item = {
      id: Date.now(),
      name,
      email,
      department,
      subject,
      message,
      status: 'Open',
      created_at: new Date().toISOString()
    };
    memoryStore.contact_messages.unshift(item);
    return item;
  },

  getContactMessages: async () => {
    if (isNeonConnected) {
      const res = await pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 20');
      return res.rows;
    }
    return [...memoryStore.contact_messages];
  },

  // System Stats
  getStats: async () => {
    const announcements = await db.getAnnouncements();
    const events = await db.getEvents();
    const urgent = await db.getUrgentAlerts();
    const countdowns = await db.getCountdowns();
    const contact = await db.getContactMessages();

    return {
      totalAnnouncements: announcements.length,
      upcomingEvents: events.filter(e => new Date(e.event_date) > new Date()).length,
      activeUrgentAlerts: urgent.length,
      activeCountdowns: countdowns.length,
      totalMessages: contact.length,
      database: isNeonConnected ? 'Vercel Neon PostgreSQL (Live)' : 'In-Memory / Local Mode (Configure DATABASE_URL for Neon)',
      dbConnected: isNeonConnected
    };
  }
};

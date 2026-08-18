import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Health & diagnostics
router.get('/health', async (req, res) => {
  try {
    const isNeon = db.isNeonConnected();
    res.json({
      status: 'ok',
      service: 'NotifyHub API',
      timestamp: new Date().toISOString(),
      database: isNeon ? 'Vercel Neon PostgreSQL (Connected)' : 'Fallback Store (Set DATABASE_URL for Neon)',
      isNeonConnected: isNeon
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- ANNOUNCEMENTS ---
router.get('/announcements', async (req, res) => {
  try {
    const { category } = req.query;
    const announcements = await db.getAnnouncements(category);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/announcements', async (req, res) => {
  try {
    const { title, content, category, priority, author, tags } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const created = await db.createAnnouncement({
      title,
      content,
      category: category || 'General',
      priority: priority || 'Normal',
      author: author || 'Admin',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : [])
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/announcements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteAnnouncement(id);
    res.json({ success: true, message: 'Announcement removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- EVENTS ---
router.get('/events', async (req, res) => {
  try {
    const events = await db.getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const { title, description, location, event_date, category } = req.body;
    if (!title || !location || !event_date) {
      return res.status(400).json({ error: 'Title, location, and event date are required' });
    }
    const created = await db.createEvent({
      title,
      description: description || '',
      location,
      event_date,
      category: category || 'General'
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/events/:id/rsvp', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db.rsvpEvent(id);
    if (!updated) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- URGENT ALERTS ---
router.get('/urgent', async (req, res) => {
  try {
    const alerts = await db.getUrgentAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/urgent', async (req, res) => {
  try {
    const { title, message, severity, affected_areas } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required for urgent alert' });
    }
    const created = await db.createUrgentAlert({
      title,
      message,
      severity: severity || 'High',
      affected_areas: affected_areas || 'All Campus / Users'
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/urgent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.dismissUrgentAlert(id);
    res.json({ success: true, message: 'Alert dismissed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- COUNTDOWNS / LIVE TIMERS ---
router.get('/countdowns', async (req, res) => {
  try {
    const countdowns = await db.getCountdowns();
    res.json(countdowns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/countdowns', async (req, res) => {
  try {
    const { title, target_date, description, category } = req.body;
    if (!title || !target_date) {
      return res.status(400).json({ error: 'Title and target date are required' });
    }
    const created = await db.createCountdown({
      title,
      target_date,
      description: description || '',
      category: category || 'General'
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/countdowns/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteCountdown(id);
    res.json({ success: true, message: 'Countdown deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- CONTACT ---
router.get('/contact', async (req, res) => {
  try {
    const messages = await db.getContactMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { name, email, department, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required' });
    }
    const created = await db.createContactMessage({
      name,
      email,
      department: department || 'General Support',
      subject,
      message
    });
    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted to NotifyHub Helpdesk. Ticket reference ID generated.',
      data: created
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

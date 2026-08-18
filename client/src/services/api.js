const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  // Health & Stats
  getHealth: async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error('Failed to fetch health status');
    return res.json();
  },
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Announcements
  getAnnouncements: async (category = 'All') => {
    const url = category && category !== 'All' 
      ? `${BASE_URL}/announcements?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/announcements`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },
  createAnnouncement: async (data) => {
    const res = await fetch(`${BASE_URL}/announcements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to post announcement');
    return res.json();
  },
  deleteAnnouncement: async (id) => {
    const res = await fetch(`${BASE_URL}/announcements/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete announcement');
    return res.json();
  },

  // Events
  getEvents: async () => {
    const res = await fetch(`${BASE_URL}/events`);
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },
  createEvent: async (data) => {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create event');
    return res.json();
  },
  rsvpEvent: async (id) => {
    const res = await fetch(`${BASE_URL}/events/${id}/rsvp`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to RSVP event');
    return res.json();
  },

  // Urgent Alerts
  getUrgentAlerts: async () => {
    const res = await fetch(`${BASE_URL}/urgent`);
    if (!res.ok) throw new Error('Failed to fetch urgent alerts');
    return res.json();
  },
  createUrgentAlert: async (data) => {
    const res = await fetch(`${BASE_URL}/urgent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to broadcast urgent alert');
    return res.json();
  },
  dismissUrgentAlert: async (id) => {
    const res = await fetch(`${BASE_URL}/urgent/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to dismiss alert');
    return res.json();
  },

  // Countdowns
  getCountdowns: async () => {
    const res = await fetch(`${BASE_URL}/countdowns`);
    if (!res.ok) throw new Error('Failed to fetch countdowns');
    return res.json();
  },
  createCountdown: async (data) => {
    const res = await fetch(`${BASE_URL}/countdowns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create countdown');
    return res.json();
  },
  deleteCountdown: async (id) => {
    const res = await fetch(`${BASE_URL}/countdowns/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete countdown');
    return res.json();
  },

  // Contact
  getContactMessages: async () => {
    const res = await fetch(`${BASE_URL}/contact`);
    if (!res.ok) throw new Error('Failed to fetch inquiries');
    return res.json();
  },
  submitContact: async (data) => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit contact inquiry');
    return res.json();
  }
};

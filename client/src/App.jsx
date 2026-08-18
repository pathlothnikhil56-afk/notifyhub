import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BannerTicker from './components/BannerTicker';
import CreateModal from './components/CreateModal';

import Home from './pages/Home';
import Announcements from './pages/Announcements';
import Events from './pages/Events';
import Urgent from './pages/Urgent';
import LiveTimer from './pages/LiveTimer';
import Contact from './pages/Contact';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Core data states
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [urgentAlerts, setUrgentAlerts] = useState([]);
  const [countdowns, setCountdowns] = useState([]);
  const [stats, setStats] = useState({});
  const [dbInfo, setDbInfo] = useState({ database: 'Connecting...', dbConnected: false });

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState('announcement');

  // Fetch all initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch health & stats
      try {
        const healthData = await api.getHealth();
        setDbInfo({
          database: healthData.database,
          dbConnected: healthData.isNeonConnected
        });
      } catch (e) {
        console.warn('Backend offline or starting up:', e.message);
      }

      const [annData, evtData, urgentData, cdData, statsData] = await Promise.allSettled([
        api.getAnnouncements(),
        api.getEvents(),
        api.getUrgentAlerts(),
        api.getCountdowns(),
        api.getStats()
      ]);

      if (annData.status === 'fulfilled') setAnnouncements(annData.value);
      if (evtData.status === 'fulfilled') setEvents(evtData.value);
      if (urgentData.status === 'fulfilled') setUrgentAlerts(urgentData.value);
      if (cdData.status === 'fulfilled') setCountdowns(cdData.value);
      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
        if (statsData.value.database) {
          setDbInfo({
            database: statsData.value.database,
            dbConnected: statsData.value.dbConnected
          });
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Unable to load some data. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll data periodically for real-time live synchronization
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Open modal with specific target
  const handleOpenCreateModal = (type = 'announcement') => {
    setModalDefaultType(type);
    setIsCreateModalOpen(true);
  };

  // Handlers
  const handleCreateAnnouncement = async (formData) => {
    const created = await api.createAnnouncement(formData);
    setAnnouncements(prev => [created, ...prev]);
    fetchData();
    return created;
  };

  const handleDeleteAnnouncement = async (id) => {
    await api.deleteAnnouncement(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    fetchData();
  };

  const handleCreateEvent = async (formData) => {
    const created = await api.createEvent(formData);
    setEvents(prev => [...prev, created]);
    fetchData();
    return created;
  };

  const handleRsvpEvent = async (id) => {
    const updated = await api.rsvpEvent(id);
    setEvents(prev => prev.map(e => e.id === id ? { ...e, rsvp_count: updated.rsvp_count } : e));
    fetchData();
    return updated;
  };

  const handleCreateUrgent = async (formData) => {
    const created = await api.createUrgentAlert(formData);
    setUrgentAlerts(prev => [created, ...prev]);
    fetchData();
    return created;
  };

  const handleDismissUrgent = async (id) => {
    await api.dismissUrgentAlert(id);
    setUrgentAlerts(prev => prev.filter(u => u.id !== id));
    fetchData();
  };

  const handleCreateCountdown = async (formData) => {
    const created = await api.createCountdown(formData);
    setCountdowns(prev => [...prev, created]);
    fetchData();
    return created;
  };

  const handleDeleteCountdown = async (id) => {
    await api.deleteCountdown(id);
    setCountdowns(prev => prev.filter(c => c.id !== id));
    fetchData();
  };

  const handleSubmitContact = async (formData) => {
    const res = await api.submitContact(formData);
    fetchData();
    return res;
  };

  // Compile combined notifications for bell dropdown
  const recentNotifications = [
    ...urgentAlerts.map(u => ({ ...u, isUrgent: true, type: 'urgent' })),
    ...announcements.slice(0, 3).map(a => ({ ...a, type: 'announcement' })),
    ...events.slice(0, 2).map(e => ({ ...e, type: 'event' }))
  ].sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()));

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Banner Alert Ticker */}
      <BannerTicker 
        urgentAlerts={urgentAlerts} 
        onNavigateToUrgent={() => setActiveTab('urgent')} 
      />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        urgentCount={urgentAlerts.length}
        recentNotifications={recentNotifications}
        dbInfo={dbInfo}
        onOpenCreateModal={() => handleOpenCreateModal('announcement')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {loading && announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-400">Synchronizing NotifyHub Real-Time Channels...</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <Home
                announcements={announcements}
                events={events}
                urgentAlerts={urgentAlerts}
                countdowns={countdowns}
                stats={stats}
                setActiveTab={setActiveTab}
                onOpenCreateModal={handleOpenCreateModal}
              />
            )}

            {activeTab === 'announcements' && (
              <Announcements
                announcements={announcements}
                onDeleteAnnouncement={handleDeleteAnnouncement}
                onOpenCreateModal={handleOpenCreateModal}
              />
            )}

            {activeTab === 'events' && (
              <Events
                events={events}
                onRsvpEvent={handleRsvpEvent}
                onOpenCreateModal={handleOpenCreateModal}
              />
            )}

            {activeTab === 'urgent' && (
              <Urgent
                urgentAlerts={urgentAlerts}
                onDismissAlert={handleDismissUrgent}
                onOpenCreateModal={handleOpenCreateModal}
              />
            )}

            {activeTab === 'timer' && (
              <LiveTimer
                countdowns={countdowns}
                onDeleteCountdown={handleDeleteCountdown}
                onOpenCreateModal={handleOpenCreateModal}
              />
            )}

            {activeTab === 'contact' && (
              <Contact
                onSubmitContact={handleSubmitContact}
              />
            )}
          </>
        )}

      </main>

      {/* Shared Create Modal for Notices/Events/Urgent/Timers */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultType={modalDefaultType}
        onCreateAnnouncement={handleCreateAnnouncement}
        onCreateEvent={handleCreateEvent}
        onCreateUrgent={handleCreateUrgent}
        onCreateCountdown={handleCreateCountdown}
      />

      {/* Footer */}
      <Footer 
        dbInfo={dbInfo} 
        setActiveTab={setActiveTab} 
      />

    </div>
  );
}

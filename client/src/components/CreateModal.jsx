import React, { useState, useEffect } from 'react';
import { 
  X, 
  Megaphone, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  Send,
  Plus
} from 'lucide-react';

export default function CreateModal({ 
  isOpen, 
  onClose, 
  defaultType = 'announcement',
  onCreateAnnouncement,
  onCreateEvent,
  onCreateUrgent,
  onCreateCountdown 
}) {
  const [modalType, setModalType] = useState(defaultType);
  const [loading, setLoading] = useState(false);

  // Form states
  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
    category: 'General',
    priority: 'Normal',
    author: 'Campus Authority',
    tags: 'Notice, General'
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    location: '',
    event_date: '',
    category: 'General'
  });

  const [urgentForm, setUrgentForm] = useState({
    title: '',
    message: '',
    severity: 'Critical',
    affected_areas: 'All Campus'
  });

  const [countdownForm, setCountdownForm] = useState({
    title: '',
    target_date: '',
    description: '',
    category: 'Competition'
  });

  useEffect(() => {
    if (defaultType) setModalType(defaultType);
  }, [defaultType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalType === 'announcement') {
        await onCreateAnnouncement(annForm);
      } else if (modalType === 'event') {
        await onCreateEvent(eventForm);
      } else if (modalType === 'urgent') {
        await onCreateUrgent(urgentForm);
      } else if (modalType === 'countdown') {
        await onCreateCountdown(countdownForm);
      }
      onClose();
    } catch (err) {
      alert('Failed to create: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header with Type Selector */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Create New Broadcast</h2>
            <p className="text-xs text-slate-400">Select what type of notice or timer to publish.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setModalType('announcement')}
            className={`py-2 px-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              modalType === 'announcement' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Notice</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType('event')}
            className={`py-2 px-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              modalType === 'event' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Event</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType('urgent')}
            className={`py-2 px-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              modalType === 'urgent' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Urgent</span>
          </button>

          <button
            type="button"
            onClick={() => setModalType('countdown')}
            className={`py-2 px-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all ${
              modalType === 'countdown' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Timer</span>
          </button>
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* 1. ANNOUNCEMENT FORM */}
          {modalType === 'announcement' && (
            <div className="space-y-3.5 animate-in fade-in">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Announcement Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Mid-Term Examinations"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={annForm.category}
                    onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Campus">Campus</option>
                    <option value="Placements">Placements</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Priority</label>
                  <select
                    value={annForm.priority}
                    onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Detailed Content *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter full notice announcement text..."
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Author / Office</label>
                  <input
                    type="text"
                    placeholder="e.g. Dean of Academics"
                    value={annForm.author}
                    onChange={(e) => setAnnForm({ ...annForm, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Tags (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Exam, Notice, Schedule"
                    value={annForm.tags}
                    onChange={(e) => setAnnForm({ ...annForm, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. EVENT FORM */}
          {modalType === 'event' && (
            <div className="space-y-3.5 animate-in fade-in">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual AI Innovation Conclave"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Event Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Career">Career</option>
                    <option value="Workshop">Workshop</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Location / Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Auditorium / Lab 304"
                  value={eventForm.location}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Event highlights, speaker details, prerequisites..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* 3. URGENT FORM */}
          {modalType === 'urgent' && (
            <div className="space-y-3.5 animate-in fade-in">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Urgent Alert Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. URGENT: Campus Water Outage Warning"
                  value={urgentForm.title}
                  onChange={(e) => setUrgentForm({ ...urgentForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Severity Level</label>
                  <select
                    value={urgentForm.severity}
                    onChange={(e) => setUrgentForm({ ...urgentForm, severity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Affected Areas / Scope</label>
                  <input
                    type="text"
                    placeholder="e.g. North Quad, Hostels"
                    value={urgentForm.affected_areas}
                    onChange={(e) => setUrgentForm({ ...urgentForm, affected_areas: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Emergency Message & Actions *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Action directives, emergency contacts, safe zones..."
                  value={urgentForm.message}
                  onChange={(e) => setUrgentForm({ ...urgentForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* 4. COUNTDOWN FORM */}
          {modalType === 'countdown' && (
            <div className="space-y-3.5 animate-in fade-in">
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Countdown Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hackathon Final Pitch Deadline"
                  value={countdownForm.title}
                  onChange={(e) => setCountdownForm({ ...countdownForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Target Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={countdownForm.target_date}
                    onChange={(e) => setCountdownForm({ ...countdownForm, target_date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={countdownForm.category}
                    onChange={(e) => setCountdownForm({ ...countdownForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Competition">Competition</option>
                    <option value="Academic">Academic</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 block mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Submissions close automatically on the portal."
                  value={countdownForm.description}
                  onChange={(e) => setCountdownForm({ ...countdownForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <span>Publishing...</span> : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to NotifyHub</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

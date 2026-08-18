import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  PlusCircle, 
  Check, 
  CalendarPlus, 
  Search, 
  Sparkles,
  ChevronRight,
  Filter,
  Hourglass,
  Timer
} from 'lucide-react';

export default function Events({ 
  events = [], 
  onRsvpEvent, 
  onOpenCreateModal 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState('upcoming'); // 'all', 'upcoming', 'past'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [rsvpedIds, setRsvpedIds] = useState(new Set());

  // Live timer tick every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = ['All', 'Hackathon', 'Seminar', 'Cultural', 'Career', 'Workshop', 'General'];

  const handleRsvp = async (id) => {
    if (rsvpedIds.has(id)) return;
    setRsvpedIds(prev => new Set(prev).add(id));
    if (onRsvpEvent) {
      await onRsvpEvent(id);
    }
  };

  const handleAddToCalendar = (evt) => {
    const title = encodeURIComponent(evt.title);
    const details = encodeURIComponent(evt.description || '');
    const location = encodeURIComponent(evt.location || '');
    const dateObj = new Date(evt.event_date);
    const startTime = dateObj.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endTime = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');
    
    // Google Calendar template URL
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTime}/${endTime}`;
    window.open(gCalUrl, '_blank');
  };

  // Helper to compute live countdown timer values for an event
  const calculateEventCountdown = (eventDateStr) => {
    const diff = new Date(eventDateStr).getTime() - currentTime.getTime();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isLiveNow: diff > -86400000 };
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds, isPast: false, isLiveNow: false };
  };

  const now = currentTime;

  const filteredEvents = events.filter(evt => {
    const eventDate = new Date(evt.event_date);
    const matchesTime = activeFilter === 'all' 
      ? true 
      : activeFilter === 'upcoming' 
        ? eventDate >= now 
        : eventDate < now;
    
    const matchesCategory = selectedCategory === 'All' || evt.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (evt.description && evt.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (evt.location && evt.location.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesTime && matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Events Calendar & Live Countdown</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse hackathons, technical seminars, and fests with real-time live event countdown timers.
          </p>
        </div>

        <button
          onClick={() => onOpenCreateModal('event')}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-cyan-600/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Upcoming / Past Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('upcoming')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'upcoming' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming ({events.filter(e => new Date(e.event_date) >= now).length})
            </button>
            <button
              onClick={() => setActiveFilter('past')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'past' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Past Archive
            </button>
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === 'all' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event by name or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Topic:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Events Grid with Live Timers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full glass-panel p-12 text-center rounded-2xl space-y-3">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No matching events</h3>
            <p className="text-xs text-slate-400">There are no events matching your selected filter.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const eventDate = new Date(evt.event_date);
            const isPast = eventDate < now;
            const isRsvped = rsvpedIds.has(evt.id);
            const countdown = calculateEventCountdown(evt.event_date);

            return (
              <div
                key={evt.id}
                className="glass-panel p-5 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group space-y-4"
              >
                <div>
                  {/* Top Badge & Date Block */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {evt.category || 'General'}
                    </span>
                    
                    <div className="text-center px-3 py-1.5 rounded-xl bg-slate-950/90 border border-slate-800 shrink-0">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                        {eventDate.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-extrabold text-white leading-none">
                        {eventDate.getDate()}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {evt.description || 'Join students and faculty for this scheduled campus engagement.'}
                  </p>

                  {/* ⏱️ LIVE TIMER COUNTER BOX */}
                  <div className="mt-4 p-3 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 pb-1.5 border-b border-slate-800/80">
                      <span className="flex items-center gap-1 font-semibold text-cyan-400">
                        <Timer className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                        Live Event Countdown
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {countdown.isPast ? 'Concluded' : 'Ticking Live'}
                      </span>
                    </div>

                    {countdown.isPast ? (
                      <div className="text-center py-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Event Concluded
                        </span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                        <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                          <span className="text-base font-black text-cyan-300 block">{countdown.days}</span>
                          <span className="text-[9px] uppercase font-sans font-semibold text-slate-400">Days</span>
                        </div>
                        <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                          <span className="text-base font-black text-indigo-300 block">
                            {String(countdown.hours).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] uppercase font-sans font-semibold text-slate-400">Hours</span>
                        </div>
                        <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                          <span className="text-base font-black text-emerald-300 block">
                            {String(countdown.minutes).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] uppercase font-sans font-semibold text-slate-400">Mins</span>
                        </div>
                        <div className="bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
                          <span className="text-base font-black text-rose-400 block">
                            {String(countdown.seconds).padStart(2, '0')}
                          </span>
                          <span className="text-[9px] uppercase font-sans font-semibold text-slate-400">Secs</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-emerald-400">{evt.rsvp_count || 0}</span> confirmed attendees
                    </div>
                  </div>
                </div>

                {/* Event Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => handleRsvp(evt.id)}
                    disabled={isPast || isRsvped}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      isPast 
                        ? 'bg-slate-900 text-slate-500 cursor-not-allowed'
                        : isRsvped
                          ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20'
                    }`}
                  >
                    {isRsvped ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>RSVP Confirmed</span>
                      </>
                    ) : isPast ? (
                      <span>Concluded</span>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        <span>RSVP Spot</span>
                      </>
                    )}
                  </button>

                  {!isPast && (
                    <button
                      onClick={() => handleAddToCalendar(evt)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                      title="Add to Google Calendar"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Calendar, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Users, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  ChevronRight,
  PlusCircle,
  BellRing,
  MapPin,
  Tag,
  Timer
} from 'lucide-react';

export default function Home({ 
  announcements = [], 
  events = [], 
  urgentAlerts = [], 
  countdowns = [], 
  stats = {},
  setActiveTab,
  onOpenCreateModal 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const featuredAnnouncements = announcements.slice(0, 3);
  const featuredEvents = events.slice(0, 3);
  const primaryCountdown = countdowns[0];

  // Helper for live countdown calculation
  const calculateTimeLeft = (targetDate) => {
    const diff = new Date(targetDate) - currentTime;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      ended: false
    };
  };

  const primaryRemaining = primaryCountdown ? calculateTimeLeft(primaryCountdown.target_date) : null;

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Section with Live Clock & Quick Metric Badges */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-slate-950 p-6 sm:p-10 border border-indigo-900/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Real-Time Broadcast & Notification Hub</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Stay Informed. <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Act in Real-Time.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Centralized platform for official announcements, critical campus notices, scheduled events with live countdown counters, and emergency broadcasts.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('announcements')}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:translate-x-0.5"
              >
                <span>Browse Announcements</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className="px-5 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Events & Countdown</span>
              </button>

              <button
                onClick={() => setActiveTab('urgent')}
                className="px-5 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-rose-500/30 text-sm font-semibold flex items-center gap-2 transition-all"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Urgent ({urgentAlerts.length})</span>
              </button>
            </div>
          </div>

          {/* Hero Right Widget: Live Clock & Next Major Target */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Live Clock Card */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  System Live Clock
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="mt-3 text-center py-2">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-wider text-white bg-slate-950/80 py-2.5 rounded-xl border border-slate-800">
                  {currentTime.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Next Major Target Countdown Preview */}
            {primaryCountdown && primaryRemaining && (
              <div className="glass-panel p-5 rounded-2xl border border-indigo-500/20 bg-indigo-950/30">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-indigo-900/50">
                  <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Next Key Milestone
                  </span>
                  <button 
                    onClick={() => setActiveTab('timer')}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5"
                  >
                    View All Timers <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="mt-3">
                  <h3 className="text-sm font-bold text-white truncate">{primaryCountdown.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{primaryCountdown.description}</p>
                  
                  {/* Countdown Ticker Units */}
                  <div className="grid grid-cols-4 gap-2 mt-3 text-center font-mono">
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-lg sm:text-xl font-bold text-indigo-400">{primaryRemaining.days}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Days</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-lg sm:text-xl font-bold text-cyan-400">{primaryRemaining.hours}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Hours</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-lg sm:text-xl font-bold text-emerald-400">{primaryRemaining.minutes}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Mins</span>
                    </div>
                    <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                      <span className="text-lg sm:text-xl font-bold text-rose-400">{primaryRemaining.seconds}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-sans">Secs</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Metrics Summary Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => setActiveTab('announcements')} 
          className="glass-card p-4 sm:p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Announcements</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{stats.totalAnnouncements ?? announcements.length}</span>
            <span className="text-xs text-indigo-400 font-medium">Published</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('events')} 
          className="glass-card p-4 sm:p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Events</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{stats.upcomingEvents ?? events.length}</span>
            <span className="text-xs text-cyan-400 font-medium">Live Timers</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('urgent')} 
          className="glass-card p-4 sm:p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all group border-rose-500/20 hover:border-rose-500/40"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Urgent Alerts</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-400">{stats.activeUrgentAlerts ?? urgentAlerts.length}</span>
            <span className="text-xs text-rose-300 font-medium">Critical</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('timer')} 
          className="glass-card p-4 sm:p-5 rounded-2xl cursor-pointer hover:scale-[1.02] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Countdowns</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{stats.activeCountdowns ?? countdowns.length}</span>
            <span className="text-xs text-amber-400 font-medium">Live Targets</span>
          </div>
        </div>

      </section>

      {/* Main Grid: Latest Announcements & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Latest Announcements */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Latest Announcements</h2>
            </div>
            <button
              onClick={() => setActiveTab('announcements')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {featuredAnnouncements.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-sm">
                No announcements currently published.
              </div>
            ) : (
              featuredAnnouncements.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setActiveTab('announcements')}
                  className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-indigo-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.priority === 'High' 
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' 
                        : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {item.category || 'General'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>

                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium text-slate-300">By {item.author || 'Dean / Operations'}</span>
                    <span className="text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read more <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Right Col: Events Preview with Live Timer Counter Badges */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Upcoming Events & Timers</h2>
            </div>
            <button
              onClick={() => setActiveTab('events')}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {featuredEvents.length === 0 ? (
              <div className="glass-panel p-8 text-center rounded-2xl text-slate-400 text-sm">
                No events scheduled.
              </div>
            ) : (
              featuredEvents.map((evt) => {
                const rem = calculateTimeLeft(evt.event_date);

                return (
                  <div 
                    key={evt.id}
                    onClick={() => setActiveTab('events')}
                    className="glass-panel p-4.5 rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 transition-all cursor-pointer group space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {evt.category || 'Event'}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5 group-hover:text-cyan-300 transition-colors">
                          {evt.title}
                        </h4>
                      </div>
                      <div className="text-center p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase block">
                          {new Date(evt.event_date).toLocaleString('default', { month: 'short' })}
                        </span>
                        <span className="text-base font-extrabold text-white">
                          {new Date(evt.event_date).getDate()}
                        </span>
                      </div>
                    </div>

                    {/* Mini Live Countdown Ticker */}
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-[10px] text-slate-400 font-sans flex items-center gap-1">
                        <Timer className="w-3 h-3 text-cyan-400 animate-pulse" />
                        Live Countdown:
                      </span>
                      {rem.ended ? (
                        <span className="text-[10px] font-bold text-slate-500">Concluded</span>
                      ) : (
                        <span className="text-cyan-300 font-bold">
                          {rem.days}d {String(rem.hours).padStart(2, '0')}h {String(rem.minutes).padStart(2, '0')}m {String(rem.seconds).padStart(2, '0')}s
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </span>
                      <span className="flex items-center gap-1 shrink-0 text-cyan-300">
                        <Users className="w-3.5 h-3.5" />
                        <span>{evt.rsvp_count || 0} RSVPs</span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Help Desk Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-white">NotifyHub Dispatch Desk</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have an urgent announcement or request for a broadcast notice? Submit your request to the moderation team.
            </p>
            <button
              onClick={() => setActiveTab('contact')}
              className="w-full py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-semibold transition-all"
            >
              Contact Dispatch & Helpdesk
            </button>
          </div>

        </section>

      </div>

    </div>
  );
}

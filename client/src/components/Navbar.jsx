import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  Megaphone, 
  Clock, 
  Mail, 
  Home, 
  Database, 
  CheckCircle2, 
  Sparkles,
  Menu,
  X,
  PlusCircle
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  urgentCount = 0, 
  recentNotifications = [], 
  dbInfo = {},
  onOpenCreateModal 
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'events', label: 'Events', icon: Calendar },
    { 
      id: 'urgent', 
      label: 'Urgent', 
      icon: AlertTriangle, 
      badge: urgentCount > 0 ? urgentCount : null,
      urgentStyle: true 
    },
    { id: 'timer', label: 'Live Timer', icon: Clock },
    { id: 'contact', label: 'Contact', icon: Mail }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand / Logo */}
          <div 
            onClick={() => setActiveTab('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bell className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Notify<span className="text-indigo-400">Hub</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Campus & Org Real-Time Broadcast</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? item.urgentStyle
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 shadow-sm shadow-rose-500/10'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (item.urgentStyle ? 'text-rose-400' : 'text-indigo-400') : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-500 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${item.urgentStyle ? 'bg-rose-500' : 'bg-indigo-500'} shadow-sm`} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* DB Status Pill */}
            <div 
              title={dbInfo.database || 'Database status'}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span>{dbInfo.dbConnected ? 'Neon DB' : 'Local Store'}</span>
              <span className={`w-2 h-2 rounded-full ${dbInfo.dbConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'}`} />
            </div>

            {/* Quick Action Button */}
            <button
              onClick={onOpenCreateModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Update</span>
            </button>

            {/* Notification Bell Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {recentNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shadow">
                    {recentNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl glass-panel p-4 shadow-2xl border border-slate-700/80 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-sm text-white">Live Broadcast Feed</span>
                    </div>
                    <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {recentNotifications.length} Recent
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {recentNotifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No new notifications.</p>
                    ) : (
                      recentNotifications.map((notif, idx) => (
                        <div 
                          key={idx}
                          onClick={() => {
                            setShowNotifications(false);
                            if (notif.isUrgent) setActiveTab('urgent');
                            else if (notif.type === 'event') setActiveTab('events');
                            else setActiveTab('announcements');
                          }}
                          className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium text-xs text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                              {notif.title}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold whitespace-nowrap ${
                              notif.isUrgent ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-300'
                            }`}>
                              {notif.category || (notif.isUrgent ? 'Urgent' : 'General')}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{notif.content || notif.message || notif.description}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">
                            {notif.created_at ? new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900/90 border border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1 animate-in fade-in slide-in-from-top-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? item.urgentStyle
                        ? 'bg-rose-500/20 text-rose-300'
                        : 'bg-indigo-600/20 text-indigo-300'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-center px-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCreateModal();
                }}
                className="w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post New Announcement</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}

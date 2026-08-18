import React from 'react';
import { Bell, ShieldCheck, Heart, Sparkles, Database, ExternalLink, Globe } from 'lucide-react';

export default function Footer({ dbInfo = {}, setActiveTab }) {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bell className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">NotifyHub</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Unified real-time notification engine for notices, urgent advisories, campus events, and live target counters.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>All broadcast systems operational</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-indigo-400 transition-colors">
                  Dashboard Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('announcements')} className="hover:text-indigo-400 transition-colors">
                  Latest Announcements
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('events')} className="hover:text-indigo-400 transition-colors">
                  Calendar & Events
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('urgent')} className="text-rose-400 hover:text-rose-300 transition-colors">
                  Urgent Bulletins
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('timer')} className="hover:text-indigo-400 transition-colors">
                  Live Countdown Timers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Contact */}
          <div className="space-y-2.5">
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase">Helpline & Dispatch</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-indigo-400 transition-colors">
                  Submit Support Ticket
                </button>
              </li>
              <li className="text-slate-400">Emergency Dispatch: (555) 019-2830</li>
              <li className="text-slate-400">IT Systems Helpdesk: help@notifyhub.internal</li>
              <li className="text-slate-400">Academic Affairs Office: 9:00 AM - 5:00 PM</li>
            </ul>
          </div>

          {/* Col 4: Tech Stack & Database */}
          <div className="space-y-3">
            <h4 className="text-slate-200 font-semibold text-xs tracking-wider uppercase">Infrastructure</h4>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-cyan-400" /> Database Engine
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  dbInfo.dbConnected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {dbInfo.dbConnected ? 'Vercel Neon' : 'Local Fallback'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {dbInfo.database || 'PostgreSQL connection via Neon Serverless driver'}
              </p>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>Stack: React 19 + Node.js Express + Neon DB</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <p>© 2026 NotifyHub Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-200 cursor-pointer">Security Policy</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">Terms of Broadcast</span>
            <span>•</span>
            <span className="hover:text-slate-200 cursor-pointer">API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

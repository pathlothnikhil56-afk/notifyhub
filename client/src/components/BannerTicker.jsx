import React from 'react';
import { AlertCircle, ChevronRight, Volume2 } from 'lucide-react';

export default function BannerTicker({ urgentAlerts = [], onNavigateToUrgent }) {
  if (!urgentAlerts || urgentAlerts.length === 0) return null;

  const topAlert = urgentAlerts[0];

  return (
    <div className="bg-gradient-to-r from-rose-950/90 via-red-900/80 to-rose-950/90 border-b border-rose-800/60 px-4 py-2.5 text-xs text-rose-100 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-600 text-white font-bold uppercase tracking-wider text-[10px] shrink-0 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            Urgent Alert
          </span>
          <span className="font-semibold text-rose-200 truncate">
            {topAlert.title}
          </span>
          <span className="text-rose-300/80 hidden md:inline truncate">
            — {topAlert.message}
          </span>
        </div>

        <button
          onClick={onNavigateToUrgent}
          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-rose-200 hover:text-white bg-rose-800/60 hover:bg-rose-700/80 px-2.5 py-1 rounded-lg transition-all"
        >
          <span>View All ({urgentAlerts.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

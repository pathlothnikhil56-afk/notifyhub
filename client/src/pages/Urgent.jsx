import React, { useState } from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  PhoneCall, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PlusCircle, 
  Info,
  ChevronRight,
  Trash2
} from 'lucide-react';

export default function Urgent({ 
  urgentAlerts = [], 
  onDismissAlert, 
  onOpenCreateModal 
}) {
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());

  const emergencyContacts = [
    { title: 'Emergency Dispatch / Security', phone: '(555) 019-9911', available: '24/7 Priority Line', icon: PhoneCall },
    { title: 'Campus Medical Health Center', phone: '(555) 019-4400', available: 'Ambulance & First-Aid', icon: ShieldAlert },
    { title: 'Facility & Electrical Operations', phone: '(555) 019-3322', available: 'Water & Power Outages', icon: AlertOctagon },
    { title: 'Cyber Security & IT Incident Desk', phone: '(555) 019-7755', available: 'Phishing / Network Outages', icon: Radio }
  ];

  const handleAcknowledge = (id) => {
    setAcknowledgedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner Alert System */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/90 via-red-950/80 to-slate-950 border border-rose-600/40 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Priority Command & Emergency Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Urgent Alerts & Notices</span>
            </h1>
            <p className="text-sm text-rose-200/80 max-w-xl">
              High-priority directives, weather advisories, critical outages, and security advisories requiring immediate attention.
            </p>
          </div>

          <button
            onClick={() => onOpenCreateModal('urgent')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02] shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* Emergency Helpline Contacts Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Emergency Helplines & Response Teams
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {emergencyContacts.map((contact, idx) => {
            const Icon = contact.icon;
            return (
              <div 
                key={idx} 
                className="p-4 rounded-2xl glass-panel border border-slate-800 flex items-start gap-3.5 hover:border-rose-500/30 transition-all"
              >
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="text-xs font-bold text-white truncate">{contact.title}</h4>
                  <a 
                    href={`tel:${contact.phone}`} 
                    className="text-sm font-extrabold text-rose-400 hover:underline block"
                  >
                    {contact.phone}
                  </a>
                  <span className="text-[10px] text-slate-400 block">{contact.available}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Urgent Bulletins Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white">Active Emergency Bulletins</h2>
          </div>
          <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
            {urgentAlerts.length} Active Feeds
          </span>
        </div>

        {urgentAlerts.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Critical Alerts at this time</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              All systems, campus safety protocols, and transit channels are operating normally.
            </p>
          </div>
        ) : (
          urgentAlerts.map((alert) => {
            const isAck = acknowledgedIds.has(alert.id);

            return (
              <div
                key={alert.id}
                className="relative overflow-hidden p-6 rounded-3xl bg-slate-900/90 border-2 border-rose-500/40 shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 shrink-0 mt-0.5 border border-rose-500/30">
                      <AlertTriangle className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                          {alert.severity || 'Critical'}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'Active Now'}
                        </span>
                      </div>
                      <h3 className="text-lg font-extrabold text-white">
                        {alert.title}
                      </h3>
                    </div>
                  </div>

                  {onDismissAlert && (
                    <button
                      onClick={() => onDismissAlert(alert.id)}
                      className="self-end sm:self-start p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Dismiss alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Body Message */}
                <p className="text-sm text-slate-200 leading-relaxed pl-0 sm:pl-12">
                  {alert.message}
                </p>

                {/* Scope & Action Footer */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400 pl-0 sm:pl-12">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span><strong className="text-slate-300">Affected Scope:</strong> {alert.affected_areas || 'Campus Wide'}</span>
                  </div>

                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    disabled={isAck}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isAck
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isAck ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{isAck ? 'Acknowledged' : 'Mark as Read / Acknowledge'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

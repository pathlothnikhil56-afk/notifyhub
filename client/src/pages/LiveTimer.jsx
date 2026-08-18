import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  PlusCircle, 
  Calendar, 
  Trash2, 
  Activity, 
  Timer, 
  Flag,
  Sparkles,
  Zap
} from 'lucide-react';

export default function LiveTimer({ 
  countdowns = [], 
  onDeleteCountdown, 
  onOpenCreateModal 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // Live clock tick
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Stopwatch tick
  useEffect(() => {
    let swInterval;
    if (isStopwatchRunning) {
      swInterval = setInterval(() => {
        setStopwatchTime(prev => prev + 10);
      }, 10);
    }
    return () => clearInterval(swInterval);
  }, [isStopwatchRunning]);

  const handleStopwatchReset = () => {
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const handleStopwatchLap = () => {
    if (isStopwatchRunning) {
      setLaps(prev => [stopwatchTime, ...prev]);
    }
  };

  const formatStopwatch = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  };

  // Helper for countdown computation
  const getCountdownParts = (target) => {
    const diff = new Date(target).getTime() - currentTime.getTime();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, ended: false };
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Live Timers & Event Countdowns</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time synchronization for registration cutoffs, hackathons, maintenance windows, and live stopwatches.
          </p>
        </div>

        <button
          onClick={() => onOpenCreateModal('countdown')}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-sm font-semibold shadow-lg shadow-amber-600/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Countdown</span>
        </button>
      </div>

      {/* World Digital Clock & Live Hub Station */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Master Synchronized Time Server</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Main Digital Clock Display */}
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center space-y-2">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest block">
              Standard Local Time
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-white">
              {currentTime.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* UTC Reference Clock */}
          <div className="p-6 rounded-2xl bg-slate-950/90 border border-slate-800 text-center space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest block">
              Universal Coordinated Time (UTC)
            </span>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-slate-200">
              {currentTime.toUTCString().split(' ')[4] || '00:00:00'}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {currentTime.toUTCString().split(' ').slice(0, 4).join(' ')}
            </div>
          </div>
        </div>
      </section>

      {/* Live Target Countdowns Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Milestone & Deadline Targets</h2>
          </div>
          <span className="text-xs text-slate-400">{countdowns.length} Active Targets</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {countdowns.length === 0 ? (
            <div className="col-span-full glass-panel p-10 text-center rounded-2xl text-slate-400 text-sm">
              No countdown targets configured. Click "Create New Countdown" above to start one!
            </div>
          ) : (
            countdowns.map((item) => {
              const { days, hours, minutes, seconds, ended } = getCountdownParts(item.target_date);

              return (
                <div
                  key={item.id}
                  className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between group space-y-5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {item.category || 'Target'}
                      </span>

                      {onDeleteCountdown && (
                        <button
                          onClick={() => {
                            if (confirm('Remove this countdown?')) onDeleteCountdown(item.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete countdown"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <h3 className="text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    
                    {item.description && (
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{item.description}</p>
                    )}

                    <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>Target: {new Date(item.target_date).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Countdown Numbers Grid */}
                  {ended ? (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
                      <span className="text-sm font-bold text-rose-400 uppercase tracking-wider">
                        Countdown Expired / Event Live
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2.5 text-center font-mono">
                      
                      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-inner">
                        <span className="text-2xl sm:text-3xl font-black text-amber-400 block">{days}</span>
                        <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-slate-400">Days</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-inner">
                        <span className="text-2xl sm:text-3xl font-black text-orange-400 block">
                          {String(hours).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-slate-400">Hours</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-inner">
                        <span className="text-2xl sm:text-3xl font-black text-cyan-400 block">
                          {String(minutes).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-slate-400">Mins</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/90 shadow-inner">
                        <span className="text-2xl sm:text-3xl font-black text-rose-400 block">
                          {String(seconds).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-slate-400">Secs</span>
                      </div>

                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Interactive Stopwatch / Precision Lap Timer Card */}
      <section className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Interactive Utility Stopwatch</h2>
          </div>
          <span className="text-xs text-slate-400">High-Precision millisecond timer</span>
        </div>

        <div className="flex flex-col items-center justify-center py-4 space-y-5">
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-wider text-cyan-300 py-4 px-8 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl">
            {formatStopwatch(stopwatchTime)}
          </div>

          {/* Stopwatch Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStopwatchRunning(!isStopwatchRunning)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                isStopwatchRunning
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isStopwatchRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isStopwatchRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={handleStopwatchLap}
              disabled={!isStopwatchRunning}
              className="px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <Flag className="w-4 h-4" />
              <span>Lap</span>
            </button>

            <button
              onClick={handleStopwatchReset}
              className="px-4 py-2.5 rounded-xl font-bold text-sm bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <div className="w-full max-w-md mt-4 space-y-1.5 max-h-40 overflow-y-auto pr-1">
              <div className="text-xs font-semibold text-slate-400 pb-1">Recorded Laps:</div>
              {laps.map((lap, idx) => (
                <div key={idx} className="flex justify-between items-center px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
                  <span className="text-slate-400">Lap #{laps.length - idx}</span>
                  <span className="text-cyan-300 font-bold">{formatStopwatch(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Megaphone, 
  Search, 
  Filter, 
  PlusCircle, 
  Tag, 
  Calendar, 
  User, 
  Share2, 
  Bookmark, 
  Trash2, 
  CheckCircle,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function Announcements({ 
  announcements = [], 
  onDeleteAnnouncement, 
  onOpenCreateModal 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  const categories = ['All', 'Academic', 'Maintenance', 'Campus', 'Placements', 'General'];
  const priorities = ['All', 'High', 'Normal'];

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleShare = (item, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`${window.location.origin} - [NotifyHub Announcement]: ${item.title}`);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtering
  const filteredAnnouncements = announcements.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesPriority = selectedPriority === 'All' || item.priority?.toLowerCase() === selectedPriority.toLowerCase();
    return matchesSearch && matchesCategory && matchesPriority;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Official Announcements</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse campus notices, departmental updates, policy revisions, and circulars.
          </p>
        </div>

        <button
          onClick={() => onOpenCreateModal('announcement')}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search announcements by title, keyword, or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Priority dropdown */}
          <div className="w-full sm:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full sm:w-auto px-3 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Normal">Normal Priority</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium shrink-0">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Announcements List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAnnouncements.length === 0 ? (
          <div className="col-span-full glass-panel p-12 text-center rounded-2xl space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-white">No announcements found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search criteria or category filter.</p>
          </div>
        ) : (
          filteredAnnouncements.map((item) => {
            const isBookmarked = bookmarkedIds.has(item.id);
            const isHighPriority = item.priority?.toLowerCase() === 'high';

            return (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className={`glass-panel p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:scale-[1.01] ${
                  isHighPriority 
                    ? 'border-rose-500/30 hover:border-rose-500/60 bg-rose-950/10' 
                    : 'border-slate-800 hover:border-indigo-500/50'
                }`}
              >
                <div>
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isHighPriority
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {item.category || 'General'}
                      </span>
                      {isHighPriority && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 animate-pulse">
                          High Priority
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isBookmarked 
                            ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
                      >
                        <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={(e) => handleShare(item, e)}
                        className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                        title="Copy share link"
                      >
                        {copiedId === item.id ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>

                      {onDeleteAnnouncement && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this announcement?')) onDeleteAnnouncement(item.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Delete notice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Body preview */}
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                    {item.content}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.map((tag, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 flex items-center gap-1">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Info */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 truncate">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{item.author || 'Admin Office'}</span>
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Announcement Detail Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeModalItem.category}
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{activeModalItem.title}</h2>
              </div>
              <button
                onClick={() => setActiveModalItem(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-900 border border-slate-800 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line py-2 max-h-96 overflow-y-auto pr-2">
              {activeModalItem.content}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div>
                <span className="font-semibold text-slate-300">Published By: </span>
                <span>{activeModalItem.author || 'Official Authority'}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-300">Date: </span>
                <span>{new Date(activeModalItem.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveModalItem(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Close Notice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

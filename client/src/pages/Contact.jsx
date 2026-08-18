import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function Contact({ onSubmitContact }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'General Support',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submittedResponse, setSubmittedResponse] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const departments = [
    'General Support',
    'Academic Affairs',
    'IT & Technical Desk',
    'Events & Cultural Desk',
    'Placement & Careers',
    'Emergency & Campus Security'
  ];

  const faqs = [
    {
      q: 'How fast are urgent broadcast alerts reviewed and posted?',
      a: 'Urgent notices submitted by faculty, department heads, or security personnel are reviewed on a priority queue and typically dispatched within 5 to 15 minutes.'
    },
    {
      q: 'Can student clubs publish upcoming events directly to NotifyHub?',
      a: 'Yes, registered student council representatives and club leads can submit event details which are published immediately upon department verification.'
    },
    {
      q: 'How does NotifyHub synchronize live countdown timers?',
      a: 'Countdowns synchronize against server UTC timestamps to ensure accurate millisecond precision across all timezones and mobile devices.'
    },
    {
      q: 'Is there an SMS or Email notification subscription available?',
      a: 'Yes! Urgent alerts are automatically broadcast to enrolled student email handles and campus SMS notification lines.'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await onSubmitContact(formData);
      setSubmittedResponse(res);
      setFormData({
        name: '',
        email: '',
        department: 'General Support',
        subject: '',
        message: ''
      });
    } catch (err) {
      alert('Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Contact & Help Desk</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Submit official notice requests, report broken broadcast links, or reach out to department desks.
          </p>
        </div>
      </div>

      {/* Main Grid: Contact Form & Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Interactive Contact Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Send an Inquiry or Notice Request</h2>
            </div>

            {submittedResponse ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">Inquiry Submitted Successfully!</h3>
                <p className="text-xs text-emerald-300/90 max-w-md mx-auto">
                  {submittedResponse.message || 'Your inquiry has been registered in the database. Our team will contact you shortly.'}
                </p>
                <button
                  onClick={() => setSubmittedResponse(null)}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex@example.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Routing Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-300">Subject *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Inquiry regarding Course Timetable"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Detailed Message *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide full context or announcement text you want published..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting to Dispatch...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Helpdesk</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Col: Directory, Office Timings, FAQ */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Quick Contact Info Cards */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Campus Office Hours & Desks</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Central Administrative Complex</span>
                  <span className="text-slate-400">Ground Floor, Tower A, Room 102</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Official Help Desk Hours</span>
                  <span className="text-slate-400">Monday – Friday: 08:30 AM – 05:30 PM (IST)</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Toll-Free Helpline</span>
                  <span className="text-emerald-400 font-mono font-bold">+1 (800) 555-NOTIFY</span>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Frequently Asked Questions</h3>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div key={idx} className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-3 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3 pt-0 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 mt-1">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

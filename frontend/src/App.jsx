import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Activity, 
  Send, 
  Heart, 
  Bell, 
  Calendar, 
  ShieldAlert, 
  Moon, 
  Sun, 
  User, 
  Droplet, 
  CheckCircle,
  Plus,
  Clock
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // AI Symptom Checker States
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Reminders & Booking States
  const [reminders, setReminders] = useState([
    { id: 1, text: "Next dose due at 02:00 PM", completed: false },
    { id: 2, text: "Hydration check-in", completed: false }
  ]);
  const [newReminder, setNewReminder] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  // Backend connection URL fallback
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Handle AI Symptom Checker Submission
  const handleSymptomCheck = async (e) => {
    e.preventDefault();
    if (!symptoms) return;

    setLoading(true);
    setAiResult('');

    try {
      const response = await fetch(`${BACKEND_URL}/api/analyze-symptoms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms, age, gender }),
      });

      const data = await response.json();
      if (data.success) {
        setAiResult(data.analysis);
      } else {
        setAiResult(`⚠️ ${data.error || 'Error analyzing symptoms. Please try again.'}`);
      }
    } catch (err) {
      setAiResult('⚠️ Failed to connect to the medical AI node. Verify backend server status.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Adding New Reminder
  const addReminder = (e) => {
    e.preventDefault();
    if (!newReminder.trim()) return;
    setReminders([...reminders, { id: Date.now(), text: newReminder, completed: false }]);
    setNewReminder('');
  };

  // Toggle Reminder Status
  const toggleReminder = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r));
  };

  // Handle Mock Appointment Booking
  const handleBooking = (e) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) return;
    alert(`📅 Appointment slot requested successfully for ${bookingDate} at ${bookingTime}!`);
    setBookingDate('');
    setBookingTime('');
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside className={`w-64 border-r p-6 flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
            <span className="text-2xl font-black tracking-tight text-blue-500">MediAI</span>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: Heart },
              { id: 'symptoms', name: 'AI Symptom Checker', icon: Send },
              { id: 'reminders', name: 'Reminders & Routine', icon: Bell },
              { id: 'booking', name: 'Book Appointment', icon: Calendar },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 transition-all">
            <ShieldAlert className="h-5 w-5" /> EMERGENCY SOS
          </button>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WORKSPACE */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              {activeTab === 'dashboard' && 'Welcome Back, Patient'}
              {activeTab === 'symptoms' && 'AI Clinical Engine'}
              {activeTab === 'reminders' && 'Treatment Schedules'}
              {activeTab === 'booking' && 'Clinical Appointment Gate'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {activeTab === 'dashboard' && 'Your unified healthcare diagnostic panel.'}
              {activeTab === 'symptoms' && 'Input systemic diagnostics for deep-learning symptom triage evaluation.'}
              {activeTab === 'reminders' && 'Manage your prescription courses, clinical routines, and wellness check-ins.'}
              {activeTab === 'booking' && 'Secure priority scheduling slots with available network healthcare providers.'}
            </p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-full border bg-opacity-50">
            <User className="h-5 w-5 text-blue-500" />
            <span className="text-xs font-bold">Guest Account</span>
          </div>
        </header>

        {/* TAB 1: DASHBOARD LANDING */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border bg-opacity-20 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Heart Rate</span>
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">72</span>
                  <span className="text-sm font-bold text-slate-400">BPM</span>
                </div>
                <div className="text-xs text-green-500 font-semibold mt-4">✓ Normal Range resting state</div>
              </div>

              <div className="p-6 rounded-2xl border bg-opacity-20 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Active Reminders</span>
                  <Bell className="h-5 w-5 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">
                    {reminders.filter(r => !r.completed).length}
                  </span>
                  <span className="text-sm font-bold text-slate-400">Remaining</span>
                </div>
                <div className="text-xs text-amber-500 font-semibold mt-4">Next dose due at 02:00 PM</div>
              </div>

              <div className="p-6 rounded-2xl border bg-opacity-20 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400">Hydration Status</span>
                  <Droplet className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tight">1.8 / 2.5</span>
                  <span className="text-sm font-bold text-slate-400">Liters</span>
                </div>
                <div className="text-xs text-blue-500 font-semibold mt-4">72% of your daily intake target met</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20">
              <h3 className="font-bold text-blue-500 mb-2">⚡ AI Health Insight</h3>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Based on your logged trends, keeping up your water intake can help stabilize your resting heart rate during afternoon study or work block sessions.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: AI SYMPTOM CHECKER */}
        {activeTab === 'symptoms' && (
          <div className="grid grid-cols-2 gap-8 h-[calc(100vh-240px)]">
            <form onSubmit={handleSymptomCheck} className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Age</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 24"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full p-3 rounded-xl border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-3 rounded-xl border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Describe What You Feel</label>
                <textarea 
                  placeholder="Provide explicit somatic disclosures (e.g. throbbing migraine headache behind eyes accompanied by photophobia, onset 6 hours ago...)"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-4 rounded-xl border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none resize-none flex-1 min-h-[150px]"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Run AI Assessment
                  </>
                )}
              </button>
            </form>

            {/* LIVE DISPLAY PANEL WITH REACT-MARKDOWN AS REQUESTED */}
            <div className="p-6 rounded-2xl border flex flex-col bg-opacity-20 shadow-sm max-h-full overflow-hidden">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" /> Assessment Report
              </h3>
              
              <div className="flex-1 overflow-y-auto text-sm leading-relaxed max-h-[400px] border p-4 rounded-xl bg-gray-950 text-emerald-400 font-mono">
                {aiResult ? (
                  <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-transparent text-emerald-400">
                    <ReactMarkdown>{aiResult}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">
                    System sitting idle. Submit symptom log payload on the left interface to generate LLM assessment mapping...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REMINDERS & ROUTINE */}
        {activeTab === 'reminders' && (
          <div className="max-w-xl space-y-6">
            <form onSubmit={addReminder} className="flex gap-3">
              <input 
                type="text" 
                placeholder="Add medication scheduler event (e.g., Vitamin D3 caps - 08:00 AM)"
                value={newReminder}
                onChange={(e) => setNewReminder(e.target.value)}
                className="flex-1 p-3 rounded-xl border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl shadow-md">
                <Plus className="h-5 w-5" />
              </button>
            </form>

            <div className="border rounded-2xl overflow-hidden shadow-sm">
              {reminders.length === 0 ? (
                <p className="p-6 text-center text-slate-400 text-sm">All medical routine checkpoints cleared.</p>
              ) : (
                reminders.map((reminder) => (
                  <div 
                    key={reminder.id} 
                    onClick={() => toggleReminder(reminder.id)}
                    className={`flex items-center justify-between p-4 border-b last:border-b-0 cursor-pointer transition-all ${
                      reminder.completed ? 'bg-slate-100/50 dark:bg-slate-800/30 line-through opacity-60' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className={`h-5 w-5 ${reminder.completed ? 'text-green-500' : 'text-slate-300'}`} />
                      <span className="text-sm font-medium">{reminder.text}</span>
                    </div>
                    <Clock className="h-4 w-4 text-slate-400" />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: APPOINTMENT BOOKING */}
        {activeTab === 'booking' && (
          <div className="max-w-md p-6 rounded-2xl border bg-opacity-20 shadow-sm">
            <form onSubmit={handleBooking} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Date</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Time Slot</label>
                <input 
                  type="time" 
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-transparent focus:ring-2 focus:ring-blue-500 outline-none dark:bg-slate-900"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                Confirm Booking Slot
              </button>
            </form>
          </div>
        )}

      </main>
    </div>
  );
}
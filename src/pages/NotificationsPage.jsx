import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Calendar, Clock, AlertTriangle, CheckCircle, X, Plus,
  Mail, Smartphone, Settings, ChevronRight, Trash2, Edit,
  BellRing, BellOff, Filter, Search, RefreshCw
} from 'lucide-react';

// Mock reminders
const mockReminders = [
  {
    id: '1',
    title: "Driver's License Renewal",
    description: 'Your license expires in 30 days. Renew online or visit DMV.',
    dueDate: '2024-03-15',
    priority: 'high',
    category: 'documents',
    status: 'pending',
    notifyDaysBefore: [30, 14, 7],
  },
  {
    id: '2',
    title: 'Property Tax Payment',
    description: 'First installment due. Pay online or by mail to avoid penalties.',
    dueDate: '2024-04-10',
    priority: 'high',
    category: 'tax',
    status: 'pending',
    notifyDaysBefore: [30, 14, 7, 1],
  },
  {
    id: '3',
    title: 'Vehicle Registration',
    description: 'Annual registration renewal required.',
    dueDate: '2024-05-01',
    priority: 'medium',
    category: 'vehicle',
    status: 'pending',
    notifyDaysBefore: [30, 14],
  },
  {
    id: '4',
    title: 'Passport Renewal',
    description: 'Your passport expires in 6 months. Many countries require 6+ months validity.',
    dueDate: '2024-08-20',
    priority: 'low',
    category: 'documents',
    status: 'pending',
    notifyDaysBefore: [180, 90, 60, 30],
  },
];

const priorityColors = {
  high: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  low: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
};

const categories = [
  { id: 'all', name: 'All' },
  { id: 'documents', name: 'Documents' },
  { id: 'tax', name: 'Tax' },
  { id: 'vehicle', name: 'Vehicle' },
  { id: 'benefits', name: 'Benefits' },
  { id: 'business', name: 'Business' },
];

const REMINDERS_KEY = 'clear-reminders';
const SETTINGS_KEY = 'clear-notification-settings';

export default function NotificationsPage() {
  const [reminders, setReminders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    emailEnabled: true,
    pushEnabled: false,
    smsEnabled: false,
    email: '',
    phone: '',
  });
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: 'documents',
  });

  // Load from localStorage
  useEffect(() => {
    const savedReminders = localStorage.getItem(REMINDERS_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    } else {
      setReminders(mockReminders);
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save reminders
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    }
  }, [reminders]);

  // Calculate days until due
  const getDaysUntil = (date) => {
    const now = new Date();
    const due = new Date(date);
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Filter reminders
  const filteredReminders = reminders
    .filter(r => selectedCategory === 'all' || r.category === selectedCategory)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  // Add reminder
  const addReminder = () => {
    if (!newReminder.title || !newReminder.dueDate) return;
    
    const reminder = {
      ...newReminder,
      id: Date.now().toString(),
      status: 'pending',
      notifyDaysBefore: [30, 14, 7, 1],
    };
    
    setReminders(prev => [...prev, reminder]);
    setNewReminder({ title: '', description: '', dueDate: '', priority: 'medium', category: 'documents' });
    setShowAddModal(false);
  };

  // Delete reminder
  const deleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  // Mark complete
  const markComplete = (id) => {
    setReminders(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'completed' } : r
    ));
  };

  // Save settings
  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setShowSettings(false);
  };

  // Stats
  const stats = {
    total: reminders.length,
    overdue: reminders.filter(r => getDaysUntil(r.dueDate) < 0 && r.status !== 'completed').length,
    upcoming: reminders.filter(r => getDaysUntil(r.dueDate) >= 0 && getDaysUntil(r.dueDate) <= 7 && r.status !== 'completed').length,
    completed: reminders.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-purple-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <Bell className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Notification Center</h1>
                <p className="text-slate-400">Never miss a government deadline</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-3 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-xl"
              >
                <Plus className="w-5 h-5" />
                Add Reminder
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-sm text-slate-400">Total Reminders</div>
            </div>
            <div className={`rounded-xl p-4 border ${stats.overdue > 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
              <div className={`text-2xl font-bold ${stats.overdue > 0 ? 'text-red-400' : 'text-white'}`}>{stats.overdue}</div>
              <div className="text-sm text-slate-400">Overdue</div>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
              <div className="text-2xl font-bold text-amber-400">{stats.upcoming}</div>
              <div className="text-sm text-slate-400">Due This Week</div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
              <div className="text-sm text-slate-400">Completed</div>
            </div>
          </div>

          {/* Categories */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Reminders List */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {filteredReminders.length === 0 ? (
          <div className="text-center py-16">
            <BellOff className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No reminders</h3>
            <p className="text-slate-400 mb-6">Add a reminder to stay on top of your deadlines</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-xl"
            >
              <Plus className="w-5 h-5" />
              Add Your First Reminder
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReminders.map((reminder) => {
              const daysUntil = getDaysUntil(reminder.dueDate);
              const isOverdue = daysUntil < 0;
              const isCompleted = reminder.status === 'completed';
              const colors = priorityColors[reminder.priority];
              
              return (
                <motion.div
                  key={reminder.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-slate-800 rounded-xl border p-5 ${
                    isCompleted ? 'border-slate-700 opacity-60' : 
                    isOverdue ? 'border-red-500/50' : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Indicator */}
                    <button
                      onClick={() => markComplete(reminder.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-colors ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-slate-600 hover:border-purple-500'
                      }`}
                    >
                      {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className={`text-lg font-semibold ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                            {reminder.title}
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">{reminder.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {reminder.priority.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-4 text-sm">
                        <div className={`flex items-center gap-1 ${isOverdue && !isCompleted ? 'text-red-400' : 'text-slate-400'}`}>
                          <Calendar className="w-4 h-4" />
                          {new Date(reminder.dueDate).toLocaleDateString()}
                        </div>
                        {!isCompleted && (
                          <div className={`flex items-center gap-1 ${
                            isOverdue ? 'text-red-400' : 
                            daysUntil <= 7 ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            <Clock className="w-4 h-4" />
                            {isOverdue 
                              ? `${Math.abs(daysUntil)} days overdue` 
                              : daysUntil === 0 
                                ? 'Due today!' 
                                : `${daysUntil} days left`
                            }
                          </div>
                        )}
                        <span className="text-slate-500 capitalize">{reminder.category}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add Reminder Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">Add Reminder</h2>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Driver's License Renewal"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Description</label>
                  <textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Additional details..."
                    rows={2}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Priority</label>
                    <select
                      value={newReminder.priority}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Category</label>
                  <select
                    value={newReminder.category}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={addReminder}
                  disabled={!newReminder.title || !newReminder.dueDate}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl"
                >
                  Add Reminder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-white">Notification Settings</h2>
              </div>

              <div className="p-5 space-y-4">
                {/* Email */}
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-xs text-slate-500">Get reminders via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, emailEnabled: !prev.emailEnabled }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.emailEnabled ? 'bg-purple-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.emailEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                {settings.emailEnabled && (
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                )}

                {/* Browser Push */}
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl">
                  <div className="flex items-center gap-3">
                    <BellRing className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-xs text-slate-500">Browser notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, pushEnabled: !prev.pushEnabled }))}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.pushEnabled ? 'bg-purple-500' : 'bg-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.pushEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>

                <button
                  onClick={saveSettings}
                  className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-xl"
                >
                  Save Settings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

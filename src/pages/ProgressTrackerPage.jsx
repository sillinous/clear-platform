import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, Circle, Clock, Calendar, FileText, Plus,
  ChevronRight, Trash2, Edit2, Save, X, AlertTriangle,
  Trophy, Target, TrendingUp, BarChart3, Play, Pause
} from 'lucide-react';

// Process templates for tracking
const processTemplates = [
  {
    id: 'drivers-license',
    title: "Driver's License Renewal",
    steps: [
      { id: 1, title: 'Check eligibility requirements', duration: '5 min' },
      { id: 2, title: 'Gather required documents', duration: '10 min' },
      { id: 3, title: 'Complete application form', duration: '15 min' },
      { id: 4, title: 'Schedule appointment (if required)', duration: '10 min' },
      { id: 5, title: 'Visit DMV / Submit online', duration: '1-2 hours' },
      { id: 6, title: 'Pay renewal fee', duration: '5 min' },
      { id: 7, title: 'Receive new license', duration: '2-4 weeks' },
    ],
  },
  {
    id: 'passport',
    title: 'Passport Application',
    steps: [
      { id: 1, title: 'Complete Form DS-11', duration: '30 min' },
      { id: 2, title: 'Gather citizenship evidence', duration: '1 day' },
      { id: 3, title: 'Get passport photo', duration: '15 min' },
      { id: 4, title: 'Calculate and prepare fees', duration: '10 min' },
      { id: 5, title: 'Schedule appointment', duration: '10 min' },
      { id: 6, title: 'Apply in person', duration: '30 min' },
      { id: 7, title: 'Wait for processing', duration: '6-8 weeks' },
      { id: 8, title: 'Receive passport', duration: '1-3 days' },
    ],
  },
  {
    id: 'business-license',
    title: 'Business License',
    steps: [
      { id: 1, title: 'Choose business structure', duration: '1-2 days' },
      { id: 2, title: 'Register business name', duration: '1 day' },
      { id: 3, title: 'Get EIN from IRS', duration: 'Same day' },
      { id: 4, title: 'Register with state', duration: '1-2 weeks' },
      { id: 5, title: 'Apply for local license', duration: '1-2 weeks' },
      { id: 6, title: 'Get required permits', duration: '2-4 weeks' },
      { id: 7, title: 'Set up tax accounts', duration: '1 week' },
    ],
  },
  {
    id: 'name-change',
    title: 'Legal Name Change',
    steps: [
      { id: 1, title: 'Obtain petition forms', duration: '30 min' },
      { id: 2, title: 'Complete petition', duration: '1 hour' },
      { id: 3, title: 'File with court', duration: '1 hour' },
      { id: 4, title: 'Pay filing fee', duration: '10 min' },
      { id: 5, title: 'Publish notice (if required)', duration: '4-6 weeks' },
      { id: 6, title: 'Attend court hearing', duration: '1-2 hours' },
      { id: 7, title: 'Receive court order', duration: '1-2 weeks' },
      { id: 8, title: 'Update Social Security', duration: '2-4 weeks' },
      { id: 9, title: 'Update driver\'s license', duration: '1-2 hours' },
    ],
  },
];

const STORAGE_KEY = 'clear-tracked-processes';

export default function ProgressTrackerPage() {
  const [trackedProcesses, setTrackedProcesses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTrackedProcesses(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load tracked processes');
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackedProcesses));
  }, [trackedProcesses]);

  // Add new process to track
  const addProcess = (template) => {
    const newProcess = {
      id: `${template.id}-${Date.now()}`,
      templateId: template.id,
      title: template.title,
      steps: template.steps.map(s => ({ ...s, completed: false, completedAt: null })),
      startedAt: new Date().toISOString(),
      notes: '',
      targetDate: null,
    };
    setTrackedProcesses(prev => [...prev, newProcess]);
    setShowAddModal(false);
  };

  // Toggle step completion
  const toggleStep = (processId, stepId) => {
    setTrackedProcesses(prev => prev.map(p => {
      if (p.id !== processId) return p;
      return {
        ...p,
        steps: p.steps.map(s => {
          if (s.id !== stepId) return s;
          return {
            ...s,
            completed: !s.completed,
            completedAt: !s.completed ? new Date().toISOString() : null,
          };
        }),
      };
    }));
  };

  // Delete process
  const deleteProcess = (processId) => {
    if (confirm('Remove this process from your tracker?')) {
      setTrackedProcesses(prev => prev.filter(p => p.id !== processId));
      setSelectedProcess(null);
    }
  };

  // Save note
  const saveNote = (processId) => {
    setTrackedProcesses(prev => prev.map(p => {
      if (p.id !== processId) return p;
      return { ...p, notes: noteText };
    }));
    setEditingNote(null);
    setNoteText('');
  };

  // Calculate progress
  const getProgress = (process) => {
    const completed = process.steps.filter(s => s.completed).length;
    return Math.round((completed / process.steps.length) * 100);
  };

  // Stats
  const stats = {
    active: trackedProcesses.filter(p => getProgress(p) < 100).length,
    completed: trackedProcesses.filter(p => getProgress(p) === 100).length,
    totalSteps: trackedProcesses.reduce((sum, p) => sum + p.steps.length, 0),
    completedSteps: trackedProcesses.reduce((sum, p) => sum + p.steps.filter(s => s.completed).length, 0),
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-green-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Progress Tracker</h1>
              <p className="text-slate-400">Track your government processes step by step</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              Track New Process
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Play className="w-4 h-4" />
                <span className="text-sm">In Progress</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.active}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">Completed</span>
              </div>
              <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Target className="w-4 h-4" />
                <span className="text-sm">Total Steps</span>
              </div>
              <div className="text-2xl font-bold text-white">{stats.totalSteps}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Steps Done</span>
              </div>
              <div className="text-2xl font-bold text-blue-400">{stats.completedSteps}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Process List */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {trackedProcesses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No processes tracked yet</h2>
            <p className="text-slate-400 mb-6">Start tracking a government process to see your progress here</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5" />
              Track Your First Process
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {trackedProcesses.map((process) => {
              const progress = getProgress(process);
              const isComplete = progress === 100;
              
              return (
                <motion.div
                  key={process.id}
                  layout
                  className={`bg-slate-800 rounded-xl border ${isComplete ? 'border-green-500/50' : 'border-slate-700'} overflow-hidden`}
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          {process.title}
                          {isComplete && <Trophy className="w-5 h-5 text-yellow-400" />}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Started {new Date(process.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProcess(selectedProcess?.id === process.id ? null : process)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${selectedProcess?.id === process.id ? 'rotate-90' : ''}`} />
                        </button>
                        <button
                          onClick={() => deleteProcess(process.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">
                          {process.steps.filter(s => s.completed).length} of {process.steps.length} steps
                        </span>
                        <span className={isComplete ? 'text-green-400' : 'text-blue-400'}>
                          {progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={`h-full rounded-full ${isComplete ? 'bg-green-500' : 'bg-blue-500'}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Steps */}
                  <AnimatePresence>
                    {selectedProcess?.id === process.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 space-y-3">
                          {process.steps.map((step, index) => (
                            <button
                              key={step.id}
                              onClick={() => toggleStep(process.id, step.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                                step.completed 
                                  ? 'bg-green-500/10 border border-green-500/30' 
                                  : 'bg-slate-900 border border-slate-700 hover:border-slate-600'
                              }`}
                            >
                              {step.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                              )}
                              <div className="flex-1 text-left">
                                <span className={step.completed ? 'text-green-400' : 'text-white'}>
                                  {step.title}
                                </span>
                              </div>
                              <span className="text-sm text-slate-500">{step.duration}</span>
                            </button>
                          ))}

                          {/* Notes */}
                          <div className="pt-4 border-t border-slate-700">
                            {editingNote === process.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                  placeholder="Add notes..."
                                  rows={3}
                                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveNote(process.id)}
                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm flex items-center gap-2"
                                  >
                                    <Save className="w-4 h-4" /> Save
                                  </button>
                                  <button
                                    onClick={() => { setEditingNote(null); setNoteText(''); }}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setEditingNote(process.id); setNoteText(process.notes); }}
                                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-left hover:border-slate-600 transition-colors"
                              >
                                {process.notes ? (
                                  <p className="text-slate-300 text-sm">{process.notes}</p>
                                ) : (
                                  <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <Edit2 className="w-4 h-4" /> Add notes...
                                  </p>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Add Process Modal */}
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
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-700 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Track a Process</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-5 space-y-3">
                {processTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => addProcess(template)}
                    className="w-full flex items-center gap-4 p-4 bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors text-left"
                  >
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{template.title}</h3>
                      <p className="text-sm text-slate-500">{template.steps.length} steps</p>
                    </div>
                    <Plus className="w-5 h-5 text-slate-400" />
                  </button>
                ))}

                <Link
                  to="/tools/processmap"
                  className="block w-full text-center p-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Browse all processes →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

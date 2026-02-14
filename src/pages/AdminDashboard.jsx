import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, BarChart3, FileText, Users, Clock, CheckCircle, XCircle,
  Search, Filter, ChevronDown, Eye, Trash2, Edit, Download,
  TrendingUp, AlertTriangle, MapPin, Calendar, ArrowUpRight, RefreshCw
} from 'lucide-react';

// Mock data - in production this would come from Supabase
const mockSubmissions = [
  {
    id: '1',
    process_name: 'Business License Renewal',
    category: 'business',
    state: 'California',
    status: 'pending',
    created_at: '2024-02-14T10:30:00Z',
    submitter_name: 'John D.',
    step_count: '8-12',
    time_estimate: '1-4 weeks',
    challenges: 'Multiple trips to city hall required. Forms are confusing and outdated.',
    suggestions: 'Online submission would save everyone time.',
  },
  {
    id: '2',
    process_name: 'Food Handler Permit',
    category: 'licensing',
    state: 'Texas',
    status: 'pending',
    created_at: '2024-02-13T15:45:00Z',
    submitter_name: 'Maria S.',
    step_count: '4-7',
    time_estimate: 'Same day',
    challenges: 'Had to take an in-person test even though online options exist.',
    suggestions: 'Accept online certification from accredited providers.',
  },
  {
    id: '3',
    process_name: 'Vehicle Emissions Test',
    category: 'vehicles',
    state: 'Illinois',
    status: 'approved',
    created_at: '2024-02-12T09:00:00Z',
    submitter_name: 'Robert K.',
    step_count: '1-3',
    time_estimate: 'Same day',
    challenges: 'Limited testing locations in rural areas.',
    suggestions: 'Mobile testing units for underserved areas.',
  },
  {
    id: '4',
    process_name: 'Property Tax Exemption',
    category: 'property',
    state: 'Florida',
    status: 'rejected',
    created_at: '2024-02-11T14:20:00Z',
    submitter_name: 'Anonymous',
    step_count: '4-7',
    time_estimate: '1-4 weeks',
    challenges: 'Duplicate submission with incomplete data.',
    suggestions: '',
  },
  {
    id: '5',
    process_name: 'Concealed Carry Permit',
    category: 'licensing',
    state: 'Arizona',
    status: 'pending',
    created_at: '2024-02-10T11:15:00Z',
    submitter_name: 'James T.',
    step_count: '8-12',
    time_estimate: '1+ months',
    challenges: 'Background check takes longer than stated. Training requirements unclear.',
    suggestions: 'Provide clearer timeline expectations upfront.',
  },
];

const statsCards = [
  { label: 'Total Submissions', value: '156', change: '+12%', icon: FileText, color: 'blue' },
  { label: 'Pending Review', value: '23', change: '+3', icon: Clock, color: 'amber' },
  { label: 'Approved', value: '118', change: '+8%', icon: CheckCircle, color: 'green' },
  { label: 'States Covered', value: '42', change: '+2', icon: MapPin, color: 'purple' },
];

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'licensing', name: 'Licensing' },
  { id: 'business', name: 'Business' },
  { id: 'vehicles', name: 'Vehicles' },
  { id: 'property', name: 'Property' },
  { id: 'benefits', name: 'Benefits' },
  { id: 'documents', name: 'Documents' },
  { id: 'courts', name: 'Courts' },
];

const statuses = [
  { id: 'all', name: 'All Status', color: 'slate' },
  { id: 'pending', name: 'Pending', color: 'amber' },
  { id: 'approved', name: 'Approved', color: 'green' },
  { id: 'rejected', name: 'Rejected', color: 'red' },
];

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('clear-submissions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Merge with mock data, avoiding duplicates
        const merged = [...mockSubmissions];
        parsed.forEach(sub => {
          if (!merged.find(m => m.id === sub.id)) {
            merged.push({ ...sub, status: 'pending' });
          }
        });
        setSubmissions(merged);
      } catch (e) {
        console.error('Failed to parse stored submissions');
      }
    }
  }, []);

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch = 
        sub.process_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.submitter_name && sub.submitter_name.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || sub.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [submissions, searchQuery, categoryFilter, statusFilter]);

  // Update submission status
  const updateStatus = (id, newStatus) => {
    setSubmissions(prev => 
      prev.map(sub => sub.id === id ? { ...sub, status: newStatus } : sub)
    );
    setSelectedSubmission(null);
  };

  // Delete submission
  const deleteSubmission = (id) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      setSubmissions(prev => prev.filter(sub => sub.id !== id));
      setSelectedSubmission(null);
    }
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Process Name', 'Category', 'State', 'Status', 'Step Count', 'Time Estimate', 'Challenges', 'Suggestions', 'Submitted'];
    const rows = filteredSubmissions.map(sub => [
      sub.process_name,
      sub.category,
      sub.state,
      sub.status,
      sub.step_count,
      sub.time_estimate,
      `"${(sub.challenges || '').replace(/"/g, '""')}"`,
      `"${(sub.suggestions || '').replace(/"/g, '""')}"`,
      new Date(sub.created_at).toLocaleDateString(),
    ]);
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clear-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-slate-400">Manage process submissions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLoading(true)}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw className={`w-5 h-5 text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800 rounded-xl p-5 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-500/20`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${stat.color}-500/10 text-${stat.color}-400`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, state, or submitter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-400">
            Showing {filteredSubmissions.length} of {submissions.length} submissions
          </p>
        </div>

        {/* Submissions Table */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Process</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">State</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Submitted</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{sub.process_name}</div>
                      <div className="text-sm text-slate-500">{sub.submitter_name || 'Anonymous'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{sub.state}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300 capitalize">
                        {sub.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize border ${getStatusColor(sub.status)}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        {sub.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(sub.id, 'approved')}
                              className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </button>
                            <button
                              onClick={() => updateStatus(sub.id, 'rejected')}
                              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4 text-red-400" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteSubmission(sub.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSubmissions.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No submissions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedSubmission.process_name}</h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {selectedSubmission.state} • {selectedSubmission.category}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedSubmission.status)}`}>
                    {selectedSubmission.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Submitted By</p>
                    <p className="text-white">{selectedSubmission.submitter_name || 'Anonymous'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Date</p>
                    <p className="text-white">{new Date(selectedSubmission.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Step Count</p>
                    <p className="text-white">{selectedSubmission.step_count || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Time Estimate</p>
                    <p className="text-white">{selectedSubmission.time_estimate || 'Not specified'}</p>
                  </div>
                </div>

                {/* Challenges */}
                {selectedSubmission.challenges && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Challenges Reported</p>
                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                      <p className="text-slate-300">{selectedSubmission.challenges}</p>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {selectedSubmission.suggestions && (
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Improvement Suggestions</p>
                    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                      <p className="text-slate-300">{selectedSubmission.suggestions}</p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                {selectedSubmission.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-slate-700">
                    <button
                      onClick={() => updateStatus(selectedSubmission.id, 'approved')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-400 text-white rounded-lg transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(selectedSubmission.id, 'rejected')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-400 text-white rounded-lg transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, BarChart3, FileText, Clock, CheckCircle, AlertCircle,
  Plus, Search, Filter, Calendar, TrendingUp, Award, Heart,
  Building2, Phone, Mail, MapPin, ChevronRight, Eye, Edit,
  Download, RefreshCw, Target, Zap, ArrowUpRight, UserPlus
} from 'lucide-react';

// Mock client data
const mockClients = [
  {
    id: '1',
    name: 'Maria Garcia',
    phone: '(555) 123-4567',
    email: 'maria.g@email.com',
    status: 'active',
    processes: [
      { name: 'SNAP Application', status: 'in-progress', progress: 60 },
      { name: 'Medicaid Enrollment', status: 'pending', progress: 20 },
    ],
    lastContact: '2024-02-13',
    assignedTo: 'Case Worker A',
    notes: 'Spanish-speaking. Needs interpreter for appointments.',
  },
  {
    id: '2',
    name: 'James Wilson',
    phone: '(555) 234-5678',
    email: 'jwilson@email.com',
    status: 'active',
    processes: [
      { name: 'Housing Assistance', status: 'completed', progress: 100 },
      { name: 'Utility Assistance', status: 'in-progress', progress: 75 },
    ],
    lastContact: '2024-02-12',
    assignedTo: 'Case Worker B',
    notes: 'Recently laid off. Urgent housing situation.',
  },
  {
    id: '3',
    name: 'Anh Nguyen',
    phone: '(555) 345-6789',
    email: 'anh.n@email.com',
    status: 'active',
    processes: [
      { name: 'Citizenship Application', status: 'in-progress', progress: 40 },
    ],
    lastContact: '2024-02-10',
    assignedTo: 'Case Worker A',
    notes: 'Vietnamese-speaking. Has all required documents.',
  },
  {
    id: '4',
    name: 'Robert Brown',
    phone: '(555) 456-7890',
    email: 'rbrown@email.com',
    status: 'completed',
    processes: [
      { name: 'Social Security Benefits', status: 'completed', progress: 100 },
      { name: 'Medicare Enrollment', status: 'completed', progress: 100 },
    ],
    lastContact: '2024-02-01',
    assignedTo: 'Case Worker C',
    notes: 'All processes completed successfully. Follow-up in 6 months.',
  },
];

const impactStats = [
  { label: 'Clients Served', value: '1,247', change: '+12%', icon: Users },
  { label: 'Processes Completed', value: '3,892', change: '+23%', icon: CheckCircle },
  { label: 'Avg. Completion Time', value: '18 days', change: '-15%', icon: Clock },
  { label: 'Success Rate', value: '94%', change: '+3%', icon: Target },
];

const recentActivity = [
  { type: 'completed', client: 'James Wilson', process: 'Housing Assistance', time: '2 hours ago' },
  { type: 'started', client: 'Maria Garcia', process: 'SNAP Application', time: '4 hours ago' },
  { type: 'milestone', client: 'Anh Nguyen', process: 'Citizenship', time: 'Yesterday', detail: 'Interview scheduled' },
  { type: 'note', client: 'Robert Brown', process: 'Follow-up', time: '2 days ago', detail: 'Benefits confirmed' },
];

export default function PartnerDashboardPage() {
  const [clients, setClients] = useState(mockClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAddClient, setShowAddClient] = useState(false);

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-amber-500/20 text-amber-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-rose-900/30 via-slate-900 to-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Partner Dashboard</h1>
                <p className="text-slate-400 text-sm">Legal Aid Society of Springfield</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button
                onClick={() => setShowAddClient(true)}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-400 rounded-lg text-white text-sm flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Client
              </button>
            </div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-rose-400" />
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Client List */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-xl border border-slate-700">
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="divide-y divide-slate-700">
                {filteredClients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="p-4 hover:bg-slate-700/30 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-white font-medium">{client.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            client.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                          }`}>
                            {client.status}
                          </span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">{client.email}</p>
                        
                        {/* Active Processes */}
                        <div className="mt-3 space-y-2">
                          {client.processes.slice(0, 2).map((process, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(process.status)}`}>
                                {process.status.replace('-', ' ')}
                              </span>
                              <span className="text-sm text-slate-300">{process.name}</span>
                              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-rose-500 rounded-full"
                                  style={{ width: `${process.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">{process.progress}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'completed' ? 'bg-green-400' :
                      activity.type === 'started' ? 'bg-blue-400' :
                      activity.type === 'milestone' ? 'bg-amber-400' : 'bg-slate-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-white">{activity.client}</p>
                      <p className="text-xs text-slate-500">
                        {activity.process} {activity.detail && `• ${activity.detail}`}
                      </p>
                      <p className="text-xs text-slate-600 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-400" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Link
                  to="/finder"
                  className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-white">Find Processes for Client</span>
                </Link>
                <Link
                  to="/tools/plainspeak-ai"
                  className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-white">Translate Document</span>
                </Link>
                <Link
                  to="/states"
                  className="flex items-center gap-3 p-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-white">Check State Requirements</span>
                </Link>
              </div>
            </div>

            {/* Resources */}
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
              <h3 className="text-white font-medium mb-3">Partner Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/api" className="text-rose-400 hover:text-rose-300 flex items-center gap-1">
                    API Documentation <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="/pilot" className="text-rose-400 hover:text-rose-300 flex items-center gap-1">
                    Training Materials <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a href="/community" className="text-rose-400 hover:text-rose-300 flex items-center gap-1">
                    Partner Community <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedClient(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedClient.name}</h2>
                  <p className="text-slate-400">{selectedClient.email} • {selectedClient.phone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  selectedClient.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                }`}>
                  {selectedClient.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Processes */}
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Active Processes</h3>
                <div className="space-y-3">
                  {selectedClient.processes.map((process, i) => (
                    <div key={i} className="bg-slate-900 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{process.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(process.status)}`}>
                          {process.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-rose-500 rounded-full transition-all"
                            style={{ width: `${process.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-slate-400">{process.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Case Notes</h3>
                <div className="bg-slate-900 rounded-lg p-4">
                  <p className="text-slate-300">{selectedClient.notes}</p>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Assigned To</span>
                  <p className="text-white">{selectedClient.assignedTo}</p>
                </div>
                <div>
                  <span className="text-slate-500">Last Contact</span>
                  <p className="text-white">{selectedClient.lastContact}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-700">
                <button className="flex-1 py-3 bg-rose-500 hover:bg-rose-400 text-white rounded-lg flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Client
                </button>
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

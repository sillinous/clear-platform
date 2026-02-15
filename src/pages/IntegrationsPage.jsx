import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Puzzle, Check, ExternalLink, Search, Star, Users,
  Calendar, FileText, Mail, MessageSquare, Cloud, Database,
  CreditCard, Shield, Zap, Building2, ChevronRight, Plus
} from 'lucide-react';

// Integration definitions
const integrations = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync deadline reminders with your Google Calendar. Never miss a government deadline.',
    icon: Calendar,
    category: 'productivity',
    status: 'available',
    users: '12.4k',
    rating: 4.8,
    features: ['Auto-sync deadlines', 'Reminder notifications', 'Two-way sync'],
    setup: 'One-click OAuth',
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Store translated documents and generated forms directly to your Drive.',
    icon: Cloud,
    category: 'storage',
    status: 'available',
    users: '8.2k',
    rating: 4.7,
    features: ['Auto-save documents', 'Folder organization', 'Share with family'],
    setup: 'One-click OAuth',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Backup your documents and access them from anywhere.',
    icon: Database,
    category: 'storage',
    status: 'available',
    users: '5.1k',
    rating: 4.6,
    features: ['Auto-backup', 'Version history', 'Offline access'],
    setup: 'One-click OAuth',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get notifications about deadlines and process updates in your Slack workspace.',
    icon: MessageSquare,
    category: 'communication',
    status: 'available',
    users: '3.8k',
    rating: 4.5,
    features: ['Deadline alerts', 'Team sharing', 'Channel integration'],
    setup: 'Slack App install',
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Export process guides and checklists to your Notion workspace.',
    icon: FileText,
    category: 'productivity',
    status: 'available',
    users: '2.9k',
    rating: 4.4,
    features: ['Export guides', 'Checklist sync', 'Database integration'],
    setup: 'API token',
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Track business license fees and government payments in your accounting.',
    icon: CreditCard,
    category: 'finance',
    status: 'coming',
    users: '0',
    rating: 0,
    features: ['Fee tracking', 'Tax categorization', 'Receipt storage'],
    setup: 'OAuth',
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'E-sign generated forms and send for signatures.',
    icon: FileText,
    category: 'documents',
    status: 'coming',
    users: '0',
    rating: 0,
    features: ['E-signatures', 'Document routing', 'Audit trail'],
    setup: 'OAuth',
  },
  {
    id: 'microsoft-365',
    name: 'Microsoft 365',
    description: 'Integrate with Outlook calendar, OneDrive, and Teams.',
    icon: Building2,
    category: 'productivity',
    status: 'coming',
    users: '0',
    rating: 0,
    features: ['Outlook sync', 'OneDrive storage', 'Teams notifications'],
    setup: 'OAuth',
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect CLEAR to 5,000+ apps with no-code automation.',
    icon: Zap,
    category: 'automation',
    status: 'available',
    users: '1.5k',
    rating: 4.9,
    features: ['5,000+ apps', 'Custom workflows', 'No code required'],
    setup: 'API key',
  },
  {
    id: 'ifttt',
    name: 'IFTTT',
    description: 'Create simple automations triggered by CLEAR events.',
    icon: Puzzle,
    category: 'automation',
    status: 'coming',
    users: '0',
    rating: 0,
    features: ['Simple triggers', 'Mobile push', 'Smart home'],
    setup: 'Applet',
  },
];

const categories = [
  { id: 'all', name: 'All Integrations' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'storage', name: 'Storage' },
  { id: 'communication', name: 'Communication' },
  { id: 'finance', name: 'Finance' },
  { id: 'documents', name: 'Documents' },
  { id: 'automation', name: 'Automation' },
];

// Mock connected integrations
const connectedIntegrations = ['google-calendar', 'zapier'];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const filteredIntegrations = integrations.filter(int => {
    const matchesSearch = 
      int.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || int.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const availableCount = integrations.filter(i => i.status === 'available').length;
  const connectedCount = connectedIntegrations.length;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-pink-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center">
              <Puzzle className="w-7 h-7 text-pink-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Integrations</h1>
              <p className="text-slate-400">Connect your favorite tools with CLEAR</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="text-2xl font-bold text-white">{availableCount}</div>
              <div className="text-sm text-slate-400">Available</div>
            </div>
            <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{connectedCount}</div>
              <div className="text-sm text-slate-400">Connected</div>
            </div>
            <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
              <div className="text-2xl font-bold text-amber-400">{integrations.length - availableCount}</div>
              <div className="text-sm text-slate-400">Coming Soon</div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Categories */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-pink-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIntegrations.map((integration, index) => {
            const isConnected = connectedIntegrations.includes(integration.id);
            const Icon = integration.icon;
            
            return (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedIntegration(integration)}
                className={`bg-slate-800 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                  isConnected 
                    ? 'border-green-500/50' 
                    : integration.status === 'available' 
                      ? 'border-slate-700 hover:border-pink-500/50' 
                      : 'border-slate-700/50 opacity-75'
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-slate-300" />
                    </div>
                    {isConnected ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Connected
                      </span>
                    ) : integration.status === 'available' ? (
                      <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded text-xs font-medium">
                        Available
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs font-medium">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-1">{integration.name}</h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">{integration.description}</p>

                  {integration.status === 'available' && (
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {integration.users}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {integration.rating}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Request Integration */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
          <Plus className="w-12 h-12 text-pink-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Request an Integration</h2>
          <p className="text-slate-400 mb-6">
            Don't see the integration you need? Let us know!
          </p>
          <button className="px-6 py-3 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl">
            Submit Request
          </button>
        </div>
      </section>

      {/* Integration Detail Modal */}
      {selectedIntegration && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedIntegration(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-slate-700 rounded-xl flex items-center justify-center">
                  <selectedIntegration.icon className="w-8 h-8 text-slate-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedIntegration.name}</h2>
                  <p className="text-slate-400 text-sm mt-1">{selectedIntegration.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-400 mb-3">Features</h3>
                <ul className="space-y-2">
                  {selectedIntegration.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-white">
                      <Check className="w-4 h-4 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              {selectedIntegration.status === 'available' && (
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-lg font-bold text-white">{selectedIntegration.users}</div>
                    <div className="text-xs text-slate-500">Users</div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-lg font-bold text-white">{selectedIntegration.rating}</span>
                    </div>
                    <div className="text-xs text-slate-500">Rating</div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-3">
                    <div className="text-lg font-bold text-white">{selectedIntegration.setup}</div>
                    <div className="text-xs text-slate-500">Setup</div>
                  </div>
                </div>
              )}

              {/* Action */}
              {selectedIntegration.status === 'available' ? (
                connectedIntegrations.includes(selectedIntegration.id) ? (
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-xl flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Connected
                    </button>
                    <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl">
                      Settings
                    </button>
                    <button className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl">
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button className="w-full py-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" />
                    Connect {selectedIntegration.name}
                  </button>
                )
              ) : (
                <button disabled className="w-full py-4 bg-slate-700 text-slate-400 rounded-xl cursor-not-allowed">
                  Coming Soon
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

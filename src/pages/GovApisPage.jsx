import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe, Database, CheckCircle, Clock, AlertTriangle, ExternalLink,
  Search, FileText, Building2, Car, DollarSign, Users, Shield,
  Zap, RefreshCw, Lock, Unlock, ChevronRight, Activity
} from 'lucide-react';

// Government API integrations - real endpoints where available
const apiIntegrations = [
  {
    id: 'usps',
    name: 'USPS Address Validation',
    agency: 'United States Postal Service',
    status: 'active',
    description: 'Validate and standardize mailing addresses for forms and applications.',
    endpoint: 'https://tools.usps.com/zip-code-lookup.htm',
    features: ['Address verification', 'ZIP+4 lookup', 'City/State validation'],
    rateLimit: '1000/day',
    authRequired: true,
  },
  {
    id: 'irs-ein',
    name: 'IRS EIN Application',
    agency: 'Internal Revenue Service',
    status: 'active',
    description: 'Apply for Employer Identification Number online.',
    endpoint: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
    features: ['Online EIN application', 'Instant confirmation', 'SS-4 form submission'],
    rateLimit: 'Unlimited',
    authRequired: false,
  },
  {
    id: 'ssa',
    name: 'Social Security Administration',
    agency: 'Social Security Administration',
    status: 'active',
    description: 'Verify Social Security numbers and access benefit information.',
    endpoint: 'https://www.ssa.gov/myaccount/',
    features: ['SSN verification', 'Benefit estimates', 'Statement access'],
    rateLimit: 'Account-based',
    authRequired: true,
  },
  {
    id: 'uscis',
    name: 'USCIS Case Status',
    agency: 'U.S. Citizenship and Immigration Services',
    status: 'active',
    description: 'Check immigration case status and processing times.',
    endpoint: 'https://egov.uscis.gov/casestatus/landing.do',
    features: ['Case status lookup', 'Processing times', 'Form availability'],
    rateLimit: 'Unlimited',
    authRequired: false,
  },
  {
    id: 'sam',
    name: 'SAM.gov Entity Search',
    agency: 'General Services Administration',
    status: 'active',
    description: 'Search federal contractor registrations and exclusions.',
    endpoint: 'https://api.sam.gov/entity-information/v3/entities',
    features: ['Entity search', 'Exclusion check', 'Contract opportunities'],
    rateLimit: '10000/day',
    authRequired: true,
  },
  {
    id: 'recalls',
    name: 'Product Recalls',
    agency: 'Consumer Product Safety Commission',
    status: 'active',
    description: 'Search product recalls and safety alerts.',
    endpoint: 'https://www.saferproducts.gov/RestWebServices',
    features: ['Recall search', 'Safety reports', 'Incident data'],
    rateLimit: '1000/hour',
    authRequired: false,
  },
  {
    id: 'fda',
    name: 'FDA Drug Database',
    agency: 'Food and Drug Administration',
    status: 'active',
    description: 'Search approved drugs, labels, and adverse events.',
    endpoint: 'https://api.fda.gov/drug/',
    features: ['Drug lookup', 'Label information', 'Adverse events'],
    rateLimit: '240/minute',
    authRequired: false,
  },
  {
    id: 'census',
    name: 'Census Bureau Data',
    agency: 'U.S. Census Bureau',
    status: 'active',
    description: 'Access demographic and economic data.',
    endpoint: 'https://api.census.gov/data',
    features: ['Population data', 'Economic indicators', 'Geographic data'],
    rateLimit: '500/day',
    authRequired: true,
  },
  {
    id: 'nhtsa',
    name: 'Vehicle Safety Ratings',
    agency: 'National Highway Traffic Safety Administration',
    status: 'active',
    description: 'Vehicle safety ratings, recalls, and complaints.',
    endpoint: 'https://vpic.nhtsa.dot.gov/api/',
    features: ['VIN decoder', 'Safety ratings', 'Recall lookup'],
    rateLimit: 'Unlimited',
    authRequired: false,
  },
  {
    id: 'regulations',
    name: 'Regulations.gov',
    agency: 'eRulemaking Program',
    status: 'coming',
    description: 'Search and comment on federal regulations.',
    endpoint: 'https://api.regulations.gov/v4/',
    features: ['Regulation search', 'Comment submission', 'Docket access'],
    rateLimit: '1000/hour',
    authRequired: true,
  },
];

const categories = [
  { id: 'all', name: 'All APIs', icon: Globe },
  { id: 'identity', name: 'Identity & Verification', icon: Shield },
  { id: 'business', name: 'Business & Tax', icon: Building2 },
  { id: 'safety', name: 'Safety & Recalls', icon: AlertTriangle },
  { id: 'data', name: 'Public Data', icon: Database },
];

export default function GovApisPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApi, setSelectedApi] = useState(null);

  const filteredApis = apiIntegrations.filter(api => {
    const matchesSearch = 
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const activeCount = apiIntegrations.filter(a => a.status === 'active').length;
  const comingCount = apiIntegrations.filter(a => a.status === 'coming').length;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Government API Hub</h1>
              <p className="text-slate-400">Real-time connections to official government services</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-sm">Active Integrations</span>
              </div>
              <div className="text-2xl font-bold text-white">{activeCount}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Coming Soon</span>
              </div>
              <div className="text-2xl font-bold text-white">{comingCount}</div>
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Avg Response</span>
              </div>
              <div className="text-2xl font-bold text-white">&lt;200ms</div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search APIs by name, agency, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* API Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApis.map((api, index) => (
            <motion.div
              key={api.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedApi(api)}
              className={`bg-slate-800 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                api.status === 'active' 
                  ? 'border-slate-700 hover:border-emerald-500/50' 
                  : 'border-slate-700/50 opacity-75'
              }`}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{api.name}</h3>
                    <p className="text-sm text-slate-500">{api.agency}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    api.status === 'active' 
                      ? 'bg-emerald-500/20 text-emerald-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {api.status === 'active' ? 'Active' : 'Coming'}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 mb-4">{api.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {api.features.slice(0, 2).map((feature, i) => (
                    <span key={i} className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-400">
                      {feature}
                    </span>
                  ))}
                  {api.features.length > 2 && (
                    <span className="px-2 py-1 bg-slate-900 rounded text-xs text-slate-500">
                      +{api.features.length - 2} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    {api.authRequired ? (
                      <><Lock className="w-3 h-3" /> Auth Required</>
                    ) : (
                      <><Unlock className="w-3 h-3" /> Public</>
                    )}
                  </span>
                  <span>{api.rateLimit}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integration Guide */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-4">How CLEAR Uses These APIs</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-emerald-400 font-medium mb-2">Automated Form Filling</h3>
              <p className="text-slate-300 text-sm">
                When you use ProcessMap, we can pre-populate forms with validated data from these APIs, 
                reducing errors and saving time.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-medium mb-2">Real-Time Status Checks</h3>
              <p className="text-slate-300 text-sm">
                Track your applications across multiple agencies in one place. Get notified when 
                statuses change.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-medium mb-2">Data Verification</h3>
              <p className="text-slate-300 text-sm">
                Verify addresses, EINs, and other identifiers before submission to prevent rejections 
                and delays.
              </p>
            </div>
            <div>
              <h3 className="text-emerald-400 font-medium mb-2">Compliance Monitoring</h3>
              <p className="text-slate-300 text-sm">
                Stay informed about regulatory changes, recalls, and compliance requirements that 
                affect your processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* API Detail Modal */}
      {selectedApi && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedApi(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedApi.name}</h2>
                  <p className="text-slate-500">{selectedApi.agency}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedApi.status === 'active' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {selectedApi.status === 'active' ? 'Active' : 'Coming Soon'}
                </span>
              </div>

              <p className="text-slate-300 mb-6">{selectedApi.description}</p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-2">Features</h3>
                  <ul className="space-y-2">
                    {selectedApi.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-white">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  <div>
                    <span className="text-xs text-slate-500">Rate Limit</span>
                    <p className="text-white font-medium">{selectedApi.rateLimit}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Authentication</span>
                    <p className="text-white font-medium">
                      {selectedApi.authRequired ? 'Required' : 'Not Required'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={selectedApi.endpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Visit API
                </a>
                <button
                  onClick={() => setSelectedApi(null)}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
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

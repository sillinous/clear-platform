import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Search, FileText, Clock, DollarSign, Globe,
  CheckCircle, AlertTriangle, ExternalLink, ChevronDown,
  Building2, Car, Briefcase, Heart, Home, Scale, Filter
} from 'lucide-react';

// State data with process-specific requirements
const stateData = {
  'CA': {
    name: 'California',
    abbreviation: 'CA',
    capital: 'Sacramento',
    population: '39.5M',
    processes: {
      'drivers-license': {
        agency: 'DMV',
        website: 'https://www.dmv.ca.gov',
        renewalPeriod: '5 years',
        cost: '$41',
        onlineAvailable: true,
        requirements: [
          'Current CA driver\'s license',
          'Social Security Number',
          'Proof of identity',
          'Vision test (in-person)',
        ],
        notes: 'REAL ID requires additional documents. Online renewal available if eligible.',
        processingTime: '3-4 weeks for mail delivery',
      },
      'vehicle-registration': {
        agency: 'DMV',
        website: 'https://www.dmv.ca.gov',
        renewalPeriod: 'Annual',
        cost: '$60-300+',
        onlineAvailable: true,
        requirements: [
          'Current registration card',
          'Smog certification (most vehicles)',
          'Insurance verification',
        ],
        notes: 'Smog check required in most areas. Fees vary by vehicle value.',
        processingTime: 'Immediate with online renewal',
      },
      'business-license': {
        agency: 'Secretary of State + Local',
        website: 'https://www.sos.ca.gov',
        renewalPeriod: 'Varies by type',
        cost: '$70-800+',
        onlineAvailable: true,
        requirements: [
          'Articles of Incorporation/Organization',
          'Statement of Information',
          'Local business license',
          'Seller\'s permit if applicable',
        ],
        notes: 'Requirements vary significantly by city. LA and SF have additional requirements.',
        processingTime: '1-2 weeks online, 4-6 weeks mail',
      },
    },
  },
  'TX': {
    name: 'Texas',
    abbreviation: 'TX',
    capital: 'Austin',
    population: '29.5M',
    processes: {
      'drivers-license': {
        agency: 'DPS',
        website: 'https://www.dps.texas.gov',
        renewalPeriod: '6 years',
        cost: '$33',
        onlineAvailable: true,
        requirements: [
          'Current TX driver\'s license',
          'Social Security Number',
          'US citizenship or lawful presence',
        ],
        notes: 'Online renewal available every other cycle. No vision test required for online.',
        processingTime: '2-3 weeks',
      },
      'vehicle-registration': {
        agency: 'DMV / County Tax Office',
        website: 'https://www.txdmv.gov',
        renewalPeriod: 'Annual',
        cost: '$50-75+',
        onlineAvailable: true,
        requirements: [
          'Current registration',
          'Vehicle inspection (annual)',
          'Insurance verification',
        ],
        notes: 'Inspection required within 90 days of registration. Can renew at grocery stores.',
        processingTime: 'Immediate',
      },
      'business-license': {
        agency: 'Secretary of State + Local',
        website: 'https://www.sos.state.tx.us',
        renewalPeriod: 'Annual franchise tax',
        cost: '$300+',
        onlineAvailable: true,
        requirements: [
          'Certificate of Formation',
          'Registered agent in Texas',
          'Franchise tax filing',
        ],
        notes: 'No state income tax but franchise tax applies. Local permits vary by city.',
        processingTime: '2-3 business days online',
      },
    },
  },
  'FL': {
    name: 'Florida',
    abbreviation: 'FL',
    capital: 'Tallahassee',
    population: '22.2M',
    processes: {
      'drivers-license': {
        agency: 'FLHSMV',
        website: 'https://www.flhsmv.gov',
        renewalPeriod: '8 years',
        cost: '$48',
        onlineAvailable: true,
        requirements: [
          'Current FL driver\'s license',
          'Social Security Number',
          'Vision test every other renewal',
        ],
        notes: '8-year license is one of the longest in the nation. Online renewal saves $3.',
        processingTime: '7-10 business days',
      },
      'vehicle-registration': {
        agency: 'FLHSMV / Tax Collector',
        website: 'https://www.flhsmv.gov',
        renewalPeriod: 'Annual or Biennial',
        cost: '$27.60-225+',
        onlineAvailable: true,
        requirements: [
          'Current registration',
          'Insurance verification (electronic)',
          'No emissions test required',
        ],
        notes: 'No vehicle inspection required. Birthday renewal date.',
        processingTime: 'Immediate online',
      },
      'business-license': {
        agency: 'Division of Corporations',
        website: 'https://dos.myflorida.com/sunbiz',
        renewalPeriod: 'Annual report',
        cost: '$138.75+',
        onlineAvailable: true,
        requirements: [
          'Articles of Organization/Incorporation',
          'Annual report filing',
          'Registered agent',
        ],
        notes: 'No state income tax. Sunbiz is user-friendly online system.',
        processingTime: '1-2 business days online',
      },
    },
  },
  'NY': {
    name: 'New York',
    abbreviation: 'NY',
    capital: 'Albany',
    population: '19.8M',
    processes: {
      'drivers-license': {
        agency: 'DMV',
        website: 'https://dmv.ny.gov',
        renewalPeriod: '8 years',
        cost: '$64.50',
        onlineAvailable: true,
        requirements: [
          'Current NY driver\'s license',
          'Social Security Number',
          'Vision test',
          '6 points of ID for REAL ID',
        ],
        notes: 'NYC residents can use different offices. REAL ID strongly recommended.',
        processingTime: '2 weeks',
      },
      'vehicle-registration': {
        agency: 'DMV',
        website: 'https://dmv.ny.gov',
        renewalPeriod: '2 years',
        cost: '$26-140+',
        onlineAvailable: true,
        requirements: [
          'Insurance card (NY)',
          'Inspection within 12 months',
          'Proof of ownership',
        ],
        notes: 'Annual inspection required. NYC has additional requirements.',
        processingTime: 'Immediate with valid inspection',
      },
      'business-license': {
        agency: 'Department of State',
        website: 'https://www.dos.ny.gov',
        renewalPeriod: 'Biennial report',
        cost: '$200+',
        onlineAvailable: true,
        requirements: [
          'Articles of Organization',
          'Publication requirement (LLC)',
          'Biennial statement',
        ],
        notes: 'LLC publication requirement adds $1,000-2,000 in NYC area.',
        processingTime: '1-2 weeks',
      },
    },
  },
  'IL': {
    name: 'Illinois',
    abbreviation: 'IL',
    capital: 'Springfield',
    population: '12.6M',
    processes: {
      'drivers-license': {
        agency: 'Secretary of State',
        website: 'https://www.ilsos.gov',
        renewalPeriod: '4 years',
        cost: '$30',
        onlineAvailable: true,
        requirements: [
          'Current IL driver\'s license',
          'Social Security Number',
          'Vision test',
          'Written test may be required',
        ],
        notes: 'Safe driver renewal available online. Chicago has many locations.',
        processingTime: '10-15 business days',
      },
      'vehicle-registration': {
        agency: 'Secretary of State',
        website: 'https://www.ilsos.gov',
        renewalPeriod: 'Annual',
        cost: '$151+',
        onlineAvailable: true,
        requirements: [
          'Current registration',
          'Insurance verification',
          'No emissions test in most areas',
        ],
        notes: 'Emissions test required in Chicago area only. License plate sticker system.',
        processingTime: '5-7 business days',
      },
      'business-license': {
        agency: 'Secretary of State',
        website: 'https://www.ilsos.gov',
        renewalPeriod: 'Annual report',
        cost: '$150+',
        onlineAvailable: true,
        requirements: [
          'Articles of Organization/Incorporation',
          'Annual report',
          'Registered agent',
        ],
        notes: 'Chicago requires separate business license. Annual report required.',
        processingTime: '5-10 business days',
      },
    },
  },
};

const processTypes = [
  { id: 'drivers-license', name: "Driver's License", icon: Car },
  { id: 'vehicle-registration', name: 'Vehicle Registration', icon: Car },
  { id: 'business-license', name: 'Business License', icon: Briefcase },
];

const allStates = Object.entries(stateData).map(([abbr, data]) => ({
  abbreviation: abbr,
  ...data,
}));

export default function StateRequirementsPage() {
  const [selectedState, setSelectedState] = useState('CA');
  const [selectedProcess, setSelectedProcess] = useState('drivers-license');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComparison, setShowComparison] = useState(false);

  const currentState = stateData[selectedState];
  const currentProcess = currentState?.processes[selectedProcess];

  // Compare states
  const comparisonData = useMemo(() => {
    return allStates.map(state => ({
      state: state.abbreviation,
      name: state.name,
      process: state.processes[selectedProcess],
    })).filter(s => s.process);
  }, [selectedProcess]);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">State Requirements</h1>
              <p className="text-slate-400">Process requirements by state</p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {/* State Selector */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Select State</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  {allStates.map(state => (
                    <option key={state.abbreviation} value={state.abbreviation}>
                      {state.name} ({state.abbreviation})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Process Selector */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Process Type</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  value={selectedProcess}
                  onChange={(e) => setSelectedProcess(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 appearance-none"
                >
                  {processTypes.map(process => (
                    <option key={process.id} value={process.id}>
                      {process.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Compare Toggle */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">View Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowComparison(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    !showComparison 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Single State
                </button>
                <button
                  onClick={() => setShowComparison(true)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    showComparison 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  Compare All
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {!showComparison ? (
          /* Single State View */
          <div className="grid lg:grid-cols-3 gap-6">
            {/* State Info */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl font-bold text-blue-400">{currentState?.abbreviation}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{currentState?.name}</h2>
                  <p className="text-slate-500">Capital: {currentState?.capital}</p>
                  <p className="text-slate-500">Population: {currentState?.population}</p>
                </div>

                <div className="space-y-3">
                  <a
                    href={currentProcess?.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-slate-900 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-white flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Official Website
                    </span>
                    <ExternalLink className="w-4 h-4 text-slate-500" />
                  </a>
                  <div className="p-3 bg-slate-900 rounded-lg">
                    <span className="text-slate-400 text-sm">Agency</span>
                    <p className="text-white">{currentProcess?.agency}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Process Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Renewal Period</span>
                  </div>
                  <p className="text-white font-semibold">{currentProcess?.renewalPeriod}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-xs">Cost</span>
                  </div>
                  <p className="text-white font-semibold">{currentProcess?.cost}</p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs">Online</span>
                  </div>
                  <p className={`font-semibold ${currentProcess?.onlineAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {currentProcess?.onlineAvailable ? 'Available' : 'In-Person'}
                  </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Processing</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{currentProcess?.processingTime}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Requirements
                </h3>
                <ul className="space-y-3">
                  {currentProcess?.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              {currentProcess?.notes && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Important Notes
                  </h3>
                  <p className="text-slate-300">{currentProcess?.notes}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Comparison View */
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">State</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Cost</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Renewal</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Online</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Processing</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item) => (
                    <tr key={item.state} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold text-sm">
                            {item.state}
                          </span>
                          <span className="text-white font-medium">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-green-400 font-medium">{item.process.cost}</td>
                      <td className="px-6 py-4 text-slate-300">{item.process.renewalPeriod}</td>
                      <td className="px-6 py-4">
                        {item.process.onlineAvailable ? (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">Yes</span>
                        ) : (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">{item.process.processingTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add More States CTA */}
        <div className="mt-12 text-center">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-white mb-3">More States Coming Soon</h3>
            <p className="text-slate-400 mb-6">
              We're actively adding requirements for all 50 states. Help us by submitting your state's process information.
            </p>
            <a
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-colors"
            >
              Submit Process Data
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

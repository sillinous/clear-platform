import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Search, ArrowRight, Clock, DollarSign, FileText,
  CheckCircle, AlertCircle, Loader2, MapPin, Building2, Car,
  Home, Briefcase, Heart, Scale, ChevronRight, Lightbulb, Zap
} from 'lucide-react';
import useUserSettings from '../store/useUserSettings';

const categories = [
  { id: 'life-event', label: 'Life Event', icon: Heart, examples: ['Getting married', 'Having a baby', 'Moving'] },
  { id: 'business', label: 'Business', icon: Briefcase, examples: ['Starting a business', 'Hiring employees'] },
  { id: 'property', label: 'Property', icon: Home, examples: ['Buying a house', 'Renting out property'] },
  { id: 'vehicle', label: 'Vehicle', icon: Car, examples: ['Buying a car', 'Registration renewal'] },
  { id: 'legal', label: 'Legal', icon: Scale, examples: ['Name change', 'Court filings'] },
  { id: 'government', label: 'Government', icon: Building2, examples: ['Benefits', 'Licenses', 'Permits'] },
];

const sampleQueries = [
  "I just got married and need to change my name",
  "I want to start a food truck business in Texas",
  "I'm buying my first home",
  "I need to apply for unemployment benefits",
  "My driver's license is about to expire",
  "I want to contest my property tax assessment",
];

// Demo recommendations - in production this would come from the AI
const demoRecommendations = {
  'marriage': [
    { id: 'name-change', title: 'Legal Name Change', time: '2-3 months', cost: '$150-500', priority: 1, reason: 'If changing your name, this is typically first' },
    { id: 'social-security', title: 'Update Social Security Card', time: '2-4 weeks', cost: 'Free', priority: 2, reason: 'Required before updating other IDs' },
    { id: 'drivers-license', title: "Update Driver's License", time: '1-2 hours', cost: '$25-50', priority: 3, reason: 'Update after Social Security' },
    { id: 'passport', title: 'Update Passport', time: '6-11 weeks', cost: '$130', priority: 4, reason: 'If you have travel planned' },
  ],
  'business': [
    { id: 'business-license', title: 'Business License', time: '2-4 weeks', cost: '$50-500', priority: 1, reason: 'Required to legally operate' },
    { id: 'ein', title: 'Employer Identification Number', time: 'Same day', cost: 'Free', priority: 2, reason: 'Needed for taxes and hiring' },
    { id: 'sales-tax', title: 'Sales Tax Permit', time: '1-2 weeks', cost: 'Free-$25', priority: 3, reason: 'If selling taxable goods' },
    { id: 'food-license', title: 'Food Handler Permit', time: '1 day', cost: '$10-50', priority: 4, reason: 'Required for food service' },
  ],
  'home': [
    { id: 'homestead', title: 'Homestead Exemption', time: '2-4 weeks', cost: 'Free', priority: 1, reason: 'Can save thousands on property taxes' },
    { id: 'utilities', title: 'Utility Transfers', time: '1-3 days', cost: 'Varies', priority: 2, reason: 'Set up before moving in' },
    { id: 'voter-registration', title: 'Update Voter Registration', time: '2-4 weeks', cost: 'Free', priority: 3, reason: 'Required after address change' },
    { id: 'drivers-license', title: 'Update Address on License', time: '1-2 hours', cost: 'Free-$25', priority: 4, reason: 'Most states require within 30 days' },
  ],
  'default': [
    { id: 'research', title: 'Research Requirements', time: 'Varies', cost: 'Free', priority: 1, reason: 'Start by understanding what you need' },
    { id: 'documents', title: 'Gather Documents', time: 'Varies', cost: 'Free', priority: 2, reason: 'Collect required documentation' },
    { id: 'apply', title: 'Submit Applications', time: 'Varies', cost: 'Varies', priority: 3, reason: 'Complete required forms' },
  ],
};

export default function ProcessFinderPage() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { anthropicApiKey } = useUserSettings();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setRecommendations(null);

    try {
      // In demo mode, use keyword matching
      // In production with API key, this would call Claude
      await new Promise(r => setTimeout(r, 1500)); // Simulate API delay

      const lowerQuery = query.toLowerCase();
      let results;

      if (lowerQuery.includes('marr') || lowerQuery.includes('name')) {
        results = { category: 'Life Event - Marriage', processes: demoRecommendations.marriage };
      } else if (lowerQuery.includes('business') || lowerQuery.includes('food truck') || lowerQuery.includes('start')) {
        results = { category: 'Business - Startup', processes: demoRecommendations.business };
      } else if (lowerQuery.includes('home') || lowerQuery.includes('house') || lowerQuery.includes('buy')) {
        results = { category: 'Property - Home Purchase', processes: demoRecommendations.home };
      } else {
        results = { category: 'General Process', processes: demoRecommendations.default };
      }

      results.query = query;
      results.state = state || 'General';
      setRecommendations(results);

    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSampleQuery = (sample) => {
    setQuery(sample);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900 to-blue-900/20" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What do you need to do?
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
              Describe your situation and we'll recommend the government processes you need to complete, in the right order.
            </p>

            {/* Search Form */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Example: I just got married and need to change my name on all my documents..."
                  rows={3}
                  className="w-full bg-slate-900 rounded-xl p-4 text-white placeholder-slate-500 border border-slate-700 focus:border-purple-500 focus:outline-none resize-none"
                />
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 appearance-none"
                    >
                      <option value="">Select State (Optional)</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      <option value="NY">New York</option>
                      <option value="IL">Illinois</option>
                      {/* Add more states */}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleSearch}
                    disabled={!query.trim() || isSearching}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Find Processes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sample Queries */}
              <div className="mt-6">
                <p className="text-sm text-slate-500 mb-3">Try these examples:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {sampleQueries.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => handleSampleQuery(sample)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {sample}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <AnimatePresence>
        {recommendations && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-4 pb-16"
          >
            {/* Results Header */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    Recommended Process Sequence
                  </h2>
                  <p className="text-slate-400">
                    Based on: "{recommendations.query}"
                    {recommendations.state !== 'General' && ` in ${recommendations.state}`}
                  </p>
                  <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 rounded-full text-purple-400 text-sm">
                    {recommendations.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Process Cards */}
            <div className="space-y-4">
              {recommendations.processes.map((process, index) => (
                <motion.div
                  key={process.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-purple-500/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Priority Badge */}
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                      {process.priority}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{process.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{process.reason}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span>{process.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <DollarSign className="w-4 h-4" />
                          <span>{process.cost}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/tools/processmap/${process.id}`}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm flex items-center gap-2 transition-colors"
                    >
                      View Steps
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Tips */}
            <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-400 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pro Tip</h3>
                  <p className="text-slate-300 text-sm">
                    Complete these processes in the recommended order to avoid delays. 
                    Some steps require documentation from earlier steps (like updating your 
                    Social Security card before your driver's license).
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Categories (shown when no search) */}
      {!recommendations && !isSearching && (
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Or browse by category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/tools/processmap?category=${cat.id}`}
                className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-purple-500/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <cat.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {cat.examples.join(', ')}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

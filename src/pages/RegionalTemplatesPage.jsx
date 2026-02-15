import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Download, Package, Code, Settings, Globe, CheckCircle,
  FileText, Users, Building2, Palette, Copy, ExternalLink, Zap,
  Server, Database, Lock, Mail, ChevronRight, Star, Rocket
} from 'lucide-react';

const deploymentTemplates = [
  {
    id: 'city',
    name: 'City/Municipality',
    description: 'Perfect for local city governments serving 10,000-500,000 residents.',
    icon: Building2,
    features: [
      'Branded portal with city logo and colors',
      '15+ pre-configured local processes',
      'Integration with common city services',
      'Resident account system',
      'Multi-language support',
    ],
    processes: ['Business License', 'Building Permit', 'Parking Permit', 'Utility Setup', 'Pet Registration'],
    setupTime: '2-4 weeks',
    techStack: 'React + Netlify + Supabase',
  },
  {
    id: 'county',
    name: 'County Government',
    description: 'Designed for county-level services across multiple municipalities.',
    icon: MapPin,
    features: [
      'Multi-jurisdiction support',
      '25+ county-specific processes',
      'Property & tax integrations',
      'Court system navigation',
      'Public health services',
    ],
    processes: ['Property Assessment', 'Voter Registration', 'Court Filing', 'Health Permits', 'Marriage License'],
    setupTime: '4-6 weeks',
    techStack: 'React + AWS + PostgreSQL',
  },
  {
    id: 'state',
    name: 'State Agency',
    description: 'Enterprise solution for state-level departments and agencies.',
    icon: Globe,
    features: [
      'Statewide process database',
      '50+ state processes',
      'Agency API integrations',
      'Compliance monitoring',
      'Analytics dashboard',
    ],
    processes: ['DMV Services', 'Business Registration', 'Professional Licensing', 'Benefits Programs', 'Tax Services'],
    setupTime: '8-12 weeks',
    techStack: 'React + GovCloud + Enterprise DB',
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit/Legal Aid',
    description: 'For organizations helping underserved communities navigate bureaucracy.',
    icon: Users,
    features: [
      'Client management system',
      'Case tracking',
      'Volunteer coordination',
      'Multi-client support',
      'Outcome tracking',
    ],
    processes: ['Benefits Applications', 'Immigration Forms', 'Housing Assistance', 'Legal Aid Navigation'],
    setupTime: '1-2 weeks',
    techStack: 'React + Netlify + Supabase',
  },
];

const customizationOptions = [
  { name: 'Branding', description: 'Logo, colors, typography', icon: Palette },
  { name: 'Processes', description: 'Add/remove/modify processes', icon: FileText },
  { name: 'Languages', description: 'Add community languages', icon: Globe },
  { name: 'Integrations', description: 'Connect existing systems', icon: Zap },
  { name: 'Authentication', description: 'SSO, citizen ID systems', icon: Lock },
  { name: 'Hosting', description: 'Cloud or on-premise options', icon: Server },
];

export default function RegionalTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleRequestDemo = (e) => {
    e.preventDefault();
    // In production, this would submit to a backend
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-cyan-900/30 via-slate-900 to-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm mb-6">
              <Package className="w-4 h-4" />
              Deploy Locally
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Regional Deployment Templates
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Bring CLEAR to your community. Pre-built, customizable templates for cities, 
              counties, states, and nonprofits—ready to deploy in weeks, not months.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Choose Your Template</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {deploymentTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-800 rounded-2xl border p-6 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20'
                  : 'border-slate-700 hover:border-slate-600'
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <template.icon className="w-7 h-7 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                  <p className="text-slate-400 text-sm mt-1">{template.description}</p>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mt-6 space-y-2">
                {template.features.slice(0, 3).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                    {feature}
                  </div>
                ))}
                {template.features.length > 3 && (
                  <div className="text-sm text-slate-500">
                    +{template.features.length - 3} more features
                  </div>
                )}
              </div>

              {/* Meta */}
              <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  Setup: <span className="text-white">{template.setupTime}</span>
                </span>
                <span className="text-slate-400">
                  {template.processes.length}+ processes included
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Selected Template Detail */}
      {selectedTemplate && (
        <section className="max-w-4xl mx-auto px-4 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-2xl border border-cyan-500/30 p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              {selectedTemplate.name} Template Details
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Included Processes */}
              <div>
                <h4 className="text-lg font-medium text-white mb-4">Included Processes</h4>
                <ul className="space-y-2">
                  {selectedTemplate.processes.map((process, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      {process}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div>
                <h4 className="text-lg font-medium text-white mb-4">Technology</h4>
                <div className="bg-slate-900 rounded-xl p-4">
                  <code className="text-cyan-400 text-sm">{selectedTemplate.techStack}</code>
                </div>
                <p className="text-slate-400 text-sm mt-3">
                  All templates are open-source and can be self-hosted or deployed to managed infrastructure.
                </p>
              </div>
            </div>

            {/* All Features */}
            <div className="mt-8">
              <h4 className="text-lg font-medium text-white mb-4">All Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedTemplate.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900 rounded-lg p-3">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      )}

      {/* Customization Options */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Fully Customizable</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {customizationOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 text-center"
            >
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <option.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-white font-medium text-sm">{option.name}</h3>
              <p className="text-slate-500 text-xs mt-1">{option.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Request Demo */}
      <section className="max-w-2xl mx-auto px-4 py-12 pb-20">
        <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl border border-cyan-500/30 p-8">
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Request Received!</h3>
              <p className="text-slate-400">
                We'll be in touch within 48 hours to discuss your deployment needs.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Request a Demo</h2>
                <p className="text-slate-400">
                  See how CLEAR can work for your community
                </p>
              </div>

              <form onSubmit={handleRequestDemo} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="City of Springfield"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organization.gov"
                    required
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                >
                  <Rocket className="w-5 h-5" />
                  Request Demo
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

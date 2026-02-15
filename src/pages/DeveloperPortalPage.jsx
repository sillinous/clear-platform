import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Code, Key, Download, Zap, Shield, Globe, Terminal, Copy,
  Check, ChevronRight, ExternalLink, FileText, Github, Book,
  Webhook, Server, Database, Lock, Users, Rocket, Package
} from 'lucide-react';

const sdks = [
  { name: 'JavaScript/Node.js', version: '1.2.0', icon: '📦', downloads: '12.4k' },
  { name: 'Python', version: '1.1.0', icon: '🐍', downloads: '8.7k' },
  { name: 'Ruby', version: '0.9.0', icon: '💎', downloads: '2.1k' },
  { name: 'Go', version: '0.8.0', icon: '🔵', downloads: '1.5k' },
];

const useCases = [
  {
    title: 'Legal Aid Platforms',
    description: 'Integrate PlainSpeak translation into your legal aid website to help clients understand documents.',
    icon: Shield,
    endpoints: ['/api/translate', '/api/submissions'],
  },
  {
    title: 'Government Portals',
    description: 'Embed our ProcessMap guides directly into your agency website for better citizen experience.',
    icon: Globe,
    endpoints: ['/api/processes', '/api/states'],
  },
  {
    title: 'Chatbots & Assistants',
    description: 'Power conversational interfaces that help users navigate bureaucracy step by step.',
    icon: Terminal,
    endpoints: ['/api/translate', '/api/finder'],
  },
  {
    title: 'Mobile Apps',
    description: 'Build native mobile experiences with offline-capable process tracking.',
    icon: Zap,
    endpoints: ['/api/processes', '/api/tracker'],
  },
];

const webhookEvents = [
  { event: 'submission.created', description: 'New process submission received' },
  { event: 'submission.approved', description: 'Submission approved by admin' },
  { event: 'submission.rejected', description: 'Submission rejected' },
  { event: 'process.updated', description: 'Process guide updated' },
  { event: 'state.requirements.changed', description: 'State requirements modified' },
];

const rateLimits = [
  { tier: 'Free', requests: '100/hour', features: ['Basic endpoints', 'Rate limited'] },
  { tier: 'Developer', requests: '1,000/hour', features: ['All endpoints', 'Webhooks', 'Priority support'] },
  { tier: 'Enterprise', requests: 'Unlimited', features: ['SLA', 'Dedicated support', 'Custom integrations'] },
];

export default function DeveloperPortalPage() {
  const [copiedCode, setCopiedCode] = useState('');
  const [activeTab, setActiveTab] = useState('quickstart');

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const quickstartCode = `// Install the SDK
npm install @clear/api

// Initialize
import { ClearAPI } from '@clear/api';
const clear = new ClearAPI({ apiKey: 'your-api-key' });

// Translate legal text
const result = await clear.translate({
  text: 'Notwithstanding any provisions herein...',
  readingLevel: 'general'
});

console.log(result.translation);
// "They can collect and share your data..."

console.log(result.riskScore);
// 7`;

  const curlExample = `curl -X POST https://clear-platform.netlify.app/api/translate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "text": "The party of the first part hereby agrees...",
    "readingLevel": "simple"
  }'`;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm mb-6">
              <Code className="w-4 h-4" />
              Developer Portal
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Build with CLEAR
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
              Open APIs, SDKs, and tools to integrate plain language government 
              navigation into your applications.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/api"
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl flex items-center gap-2"
              >
                <Book className="w-5 h-5" />
                API Reference
              </Link>
              <a
                href="https://github.com/sillinous/clear-platform"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl flex items-center gap-2"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Quick Start</h2>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Code Example */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <button
                onClick={() => copyToClipboard(quickstartCode, 'quickstart')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === 'quickstart' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
              <code>{quickstartCode}</code>
            </pre>
          </div>

          {/* cURL Example */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700">
              <span className="text-sm text-slate-400">cURL</span>
              <button
                onClick={() => copyToClipboard(curlExample, 'curl')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {copiedCode === 'curl' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <pre className="p-4 text-sm text-slate-300 overflow-x-auto">
              <code>{curlExample}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* SDKs */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Official SDKs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {sdks.map((sdk, index) => (
            <motion.div
              key={sdk.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-4 hover:border-indigo-500/50 transition-colors cursor-pointer"
            >
              <span className="text-2xl">{sdk.icon}</span>
              <h3 className="text-white font-medium mt-2">{sdk.name}</h3>
              <div className="flex items-center justify-between mt-2 text-sm">
                <span className="text-indigo-400">v{sdk.version}</span>
                <span className="text-slate-500">{sdk.downloads}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <useCase.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{useCase.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{useCase.description}</p>
              <div className="flex flex-wrap gap-2">
                {useCase.endpoints.map((endpoint) => (
                  <code key={endpoint} className="px-2 py-1 bg-slate-900 rounded text-xs text-indigo-400">
                    {endpoint}
                  </code>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Webhooks */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <Webhook className="w-6 h-6 text-indigo-400" />
          Webhooks
        </h2>
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Event</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Description</th>
              </tr>
            </thead>
            <tbody>
              {webhookEvents.map((webhook, i) => (
                <tr key={i} className="border-b border-slate-700/50 last:border-0">
                  <td className="px-6 py-4">
                    <code className="text-indigo-400">{webhook.event}</code>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{webhook.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8">API Tiers</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {rateLimits.map((tier, index) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-slate-800 rounded-xl border p-6 ${
                tier.tier === 'Developer' ? 'border-indigo-500' : 'border-slate-700'
              }`}
            >
              {tier.tier === 'Developer' && (
                <span className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-400 text-xs rounded mb-3">
                  Recommended
                </span>
              )}
              <h3 className="text-xl font-semibold text-white">{tier.tier}</h3>
              <div className="text-2xl font-bold text-indigo-400 mt-2">{tier.requests}</div>
              <ul className="mt-4 space-y-2">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
                tier.tier === 'Developer'
                  ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}>
                {tier.tier === 'Free' ? 'Get Started' : tier.tier === 'Developer' ? 'Get API Key' : 'Contact Sales'}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12 pb-20">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/30 p-8 text-center">
          <Rocket className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Build?</h2>
          <p className="text-slate-400 mb-6">
            Join 500+ developers using CLEAR APIs to make government accessible.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/api"
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl"
            >
              Read the Docs
            </Link>
            <a
              href="https://github.com/sillinous/clear-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center gap-2"
            >
              <Github className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

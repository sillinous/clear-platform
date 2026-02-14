import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Chrome, Download, Settings, MousePointer2, Sparkles, Shield,
  CheckCircle, ExternalLink, Copy, Eye, AlertCircle, Zap,
  Monitor, Smartphone, Globe, ArrowRight, FileText, Star
} from 'lucide-react';

const features = [
  {
    icon: MousePointer2,
    title: 'Right-Click Translation',
    description: 'Select any text on any webpage, right-click, and instantly translate to plain language.'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Analysis',
    description: 'Uses Claude AI to understand context and provide accurate, nuanced translations.'
  },
  {
    icon: Shield,
    title: 'Risk Scoring',
    description: 'See a 1-10 risk score for legal documents with specific concerns highlighted.'
  },
  {
    icon: Zap,
    title: 'Three Reading Levels',
    description: '5th Grade, General, and Professional modes adapt to your needs.'
  },
];

const steps = [
  {
    number: '1',
    title: 'Download Extension',
    description: 'Click the download button to get the extension ZIP file.'
  },
  {
    number: '2',
    title: 'Unzip the File',
    description: 'Extract the ZIP to a folder on your computer.'
  },
  {
    number: '3',
    title: 'Open Extensions Page',
    description: 'Go to chrome://extensions in your browser.'
  },
  {
    number: '4',
    title: 'Enable Developer Mode',
    description: 'Toggle "Developer mode" in the top right corner.'
  },
  {
    number: '5',
    title: 'Load Unpacked',
    description: 'Click "Load unpacked" and select the unzipped folder.'
  },
  {
    number: '6',
    title: 'Start Using',
    description: 'Click the extension icon or right-click selected text!'
  },
];

const browsers = [
  { name: 'Chrome', icon: '🌐', supported: true },
  { name: 'Edge', icon: '🔷', supported: true },
  { name: 'Brave', icon: '🦁', supported: true },
  { name: 'Firefox', icon: '🦊', supported: true, note: 'Use about:debugging' },
];

export default function ExtensionPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-slate-900 to-purple-900/20" />
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-6">
              <Chrome className="w-4 h-4" />
              Browser Extension
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              PlainSpeak
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Everywhere</span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
              Translate legal jargon on any webpage with one click. 
              Our browser extension brings CLEAR's power directly to your browser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/downloads/clear-plainspeak-extension.zip"
                download
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
              >
                <Download className="w-5 h-5" />
                Download Extension
                <span className="text-sm opacity-75">(14 KB)</span>
              </a>
              
              <a
                href="#installation"
                className="flex items-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700"
              >
                <FileText className="w-5 h-5" />
                Installation Guide
              </a>
            </div>
          </motion.div>

          {/* Browser Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl">
              {/* Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-900 border-b border-slate-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-slate-800 rounded-lg px-4 py-1.5 text-sm text-slate-400 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    example.com/terms-of-service
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 relative">
                <div className="text-slate-400 text-sm mb-4">
                  <span className="bg-blue-500/20 text-blue-300 px-1">Selected text:</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                  "Notwithstanding any provisions herein to the contrary, the Company reserves the right to collect, process, and disseminate any information..."
                </p>
                
                {/* Translation Overlay */}
                <div className="bg-slate-900 rounded-xl border border-blue-500/30 p-4 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">CLEAR PlainSpeak</span>
                  </div>
                  <p className="text-white text-sm mb-3">
                    They can collect and share your personal information with other companies, regardless of other promises in this document.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded font-medium">
                      Risk: 7/10
                    </span>
                    <span className="text-slate-500 text-xs">High Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-slate-400">Everything you need to understand legal text, right in your browser</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section id="installation" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Installation Guide</h2>
            <p className="text-slate-400">Get up and running in under 2 minutes</p>
          </div>

          {/* Browser Support */}
          <div className="flex justify-center gap-4 mb-12">
            {browsers.map((browser, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg border border-slate-700"
              >
                <span className="text-xl">{browser.icon}</span>
                <span className="text-white text-sm">{browser.name}</span>
                {browser.supported && <CheckCircle className="w-4 h-4 text-green-400" />}
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 p-4 bg-slate-800 rounded-xl border border-slate-700"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-white font-semibold">{step.title}</h3>
                  <p className="text-slate-400 text-sm">{step.description}</p>
                  {step.number === '3' && (
                    <button
                      onClick={handleCopyUrl}
                      className="mt-2 flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      {copied ? 'Copied!' : 'Copy chrome://extensions'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Download Button */}
          <div className="mt-12 text-center">
            <a
              href="/downloads/clear-plainspeak-extension.zip"
              download
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all"
            >
              <Download className="w-5 h-5" />
              Download Extension ZIP
            </a>
          </div>
        </div>
      </section>

      {/* API Key Setup */}
      <section className="py-20 bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Optional: Add Your API Key</h3>
                <p className="text-slate-400 mb-4">
                  The extension works in demo mode out of the box. For full AI-powered translations, 
                  add your Anthropic API key in the extension settings.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://console.anthropic.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors"
                  >
                    Get API Key <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link
                    to="/settings"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 text-sm hover:bg-blue-500/20 transition-colors"
                  >
                    Manage in Web App <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Platforms */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Available Everywhere</h2>
            <p className="text-slate-400">Use CLEAR on any device</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/tools/plainspeak-ai" className="group">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors">
                <Monitor className="w-10 h-10 text-blue-400 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Web App
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Full-featured platform with document upload, history, and more.
                </p>
                <span className="text-blue-400 text-sm flex items-center gap-1">
                  Open Web App <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <Smartphone className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Mobile App</h3>
              <p className="text-slate-400 text-sm mb-4">
                iOS and Android apps for translation on the go.
              </p>
              <span className="text-slate-500 text-sm">Coming Soon</span>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 border-blue-500/30 bg-blue-500/5">
              <Chrome className="w-10 h-10 text-cyan-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Browser Extension</h3>
              <p className="text-slate-400 text-sm mb-4">
                Translate text on any website instantly.
              </p>
              <span className="text-green-400 text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> You're here!
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-800/50 to-slate-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Understand Legal Text?</h2>
          <p className="text-slate-400 mb-8">
            Download the extension and start translating legal jargon in seconds.
          </p>
          <a
            href="/downloads/clear-plainspeak-extension.zip"
            download
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
          >
            <Download className="w-5 h-5" />
            Download Free Extension
          </a>
        </div>
      </section>
    </div>
  );
}

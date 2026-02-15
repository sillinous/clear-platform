import React from 'react';
import { motion } from 'framer-motion';
import {
  Accessibility, Eye, Ear, Hand, Brain, Globe, Keyboard,
  CheckCircle, Sun, Moon, Type, Volume2, MousePointer,
  Smartphone, Monitor, MessageCircle, Mail, ExternalLink
} from 'lucide-react';

const accessibilityFeatures = [
  {
    icon: Eye,
    title: 'Visual Accessibility',
    description: 'High contrast mode, adjustable text sizes, and screen reader support.',
    features: [
      'WCAG 2.1 AA compliant color contrast',
      'Resizable text up to 200%',
      'No color-only information conveyance',
      'Alt text for all images',
    ],
  },
  {
    icon: Keyboard,
    title: 'Keyboard Navigation',
    description: 'Full keyboard accessibility for users who cannot use a mouse.',
    features: [
      'All interactive elements are keyboard accessible',
      'Visible focus indicators',
      'Logical tab order',
      'Skip navigation links',
    ],
  },
  {
    icon: Ear,
    title: 'Hearing Accessibility',
    description: 'Designed for users who are deaf or hard of hearing.',
    features: [
      'No audio-only content',
      'Visual alternatives for all alerts',
      'Text-based communication',
      'No time-sensitive audio cues',
    ],
  },
  {
    icon: Brain,
    title: 'Cognitive Accessibility',
    description: 'Clear, simple design that aids understanding.',
    features: [
      'Plain language throughout',
      'Consistent navigation patterns',
      'Clear error messages',
      'Step-by-step process guides',
    ],
  },
  {
    icon: Globe,
    title: 'Language Support',
    description: 'Multi-language support for non-English speakers.',
    features: [
      'English, Spanish, Chinese translations',
      'Vietnamese, Korean, Tagalog coming soon',
      'PlainSpeak works in multiple languages',
      'Clear language indicators',
    ],
  },
  {
    icon: Smartphone,
    title: 'Device Accessibility',
    description: 'Works on any device, any screen size.',
    features: [
      'Responsive design for all screen sizes',
      'Touch-friendly interface',
      'Works offline (PWA)',
      'Mobile and desktop optimized',
    ],
  },
];

const assistiveTechSupport = [
  { name: 'Screen Readers', support: 'VoiceOver, NVDA, JAWS, TalkBack' },
  { name: 'Magnification', support: 'ZoomText, Browser zoom, OS magnifiers' },
  { name: 'Voice Control', support: 'Dragon, Voice Control (macOS/iOS)' },
  { name: 'Switch Access', support: 'iOS Switch Control, Android Switch Access' },
];

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900/30 via-slate-900 to-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Accessibility className="w-8 h-8 text-indigo-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Accessibility Commitment
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              CLEAR is committed to making government processes accessible to everyone, 
              regardless of ability. Our platform is designed with accessibility as a core principle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Standards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">WCAG 2.1 AA Compliance</h2>
              <p className="text-slate-300">
                We strive to meet or exceed Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
                This means our platform is designed to be perceivable, operable, understandable, and robust 
                for all users, including those using assistive technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Accessibility Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accessibilityFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800 rounded-xl border border-slate-700 p-6"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Assistive Technology Support */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Assistive Technology Support</h2>
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Technology Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Supported Tools</th>
              </tr>
            </thead>
            <tbody>
              {assistiveTechSupport.map((item, index) => (
                <tr key={index} className="border-b border-slate-700/50 last:border-0">
                  <td className="px-6 py-4 text-white font-medium">{item.name}</td>
                  <td className="px-6 py-4 text-slate-300">{item.support}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Use */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Accessibility Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-indigo-400" />
              Keyboard Shortcuts
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Tab</kbd> - Navigate between elements</li>
              <li><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Enter</kbd> - Activate buttons and links</li>
              <li><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Esc</kbd> - Close modals and menus</li>
              <li><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Space</kbd> - Toggle checkboxes</li>
            </ul>
          </div>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Type className="w-5 h-5 text-indigo-400" />
              Text Adjustments
            </h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              <li><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">+</kbd> - Increase text size</li>
              <li><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">-</kbd> - Decrease text size</li>
              <li><kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Ctrl</kbd> + <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">0</kbd> - Reset to default</li>
              <li>Use browser reader mode for simplified view</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Report an Accessibility Issue</h2>
          <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
            We're committed to continuous improvement. If you encounter any accessibility barriers 
            while using CLEAR, please let us know so we can fix them.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/submit"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Submit Feedback
            </a>
            <a
              href="mailto:accessibility@clearplatform.org"
              className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Us
            </a>
          </div>
        </div>
      </section>

      {/* Updates */}
      <section className="max-w-4xl mx-auto px-4 py-12 pb-20">
        <div className="text-center">
          <p className="text-slate-500 text-sm">
            Last accessibility review: February 2024
          </p>
          <p className="text-slate-500 text-sm">
            Accessibility features are continuously improved based on user feedback and evolving standards.
          </p>
        </div>
      </section>
    </div>
  );
}

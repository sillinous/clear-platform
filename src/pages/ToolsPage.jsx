import { Link } from 'react-router-dom'
import { 
  FileText, Map, Bell, Calculator, Compass, Search,
  ArrowRight, ExternalLink, Code, Shield, Zap, Send, Upload, Chrome, Download, Sparkles,
  ListChecks, MapPin, MessageCircle, BarChart3
} from 'lucide-react'
import { Card, Badge, SectionHeader } from '../components/UI'

const tools = [
  {
    id: 'finder',
    name: 'Process Finder',
    tagline: 'AI-Powered Recommendations',
    description: 'Describe your situation and get a personalized sequence of government processes you need to complete, in the right order.',
    status: 'New',
    icon: Sparkles,
    link: '/finder',
    features: ['Natural language', 'Ordered sequence', 'Time estimates', 'State-specific'],
  },
  {
    id: 'tracker',
    name: 'Progress Tracker',
    tagline: 'Track Your Process Completion',
    description: 'Track multiple government processes, mark steps complete, add notes, and visualize your progress.',
    status: 'New',
    icon: ListChecks,
    link: '/tracker',
    features: ['Step tracking', 'Progress visualization', 'Notes', 'Multiple processes'],
  },
  {
    id: 'states',
    name: 'State Requirements',
    tagline: 'Requirements by State',
    description: 'Compare process requirements across states. See costs, timelines, and requirements for your specific location.',
    status: 'New',
    icon: MapPin,
    link: '/states',
    features: ['5 states', 'Cost comparison', 'Online availability', 'Requirements list'],
  },
  {
    id: 'community',
    name: 'Community',
    tagline: 'Share & Learn',
    description: 'Connect with others navigating government processes. Share tips, ask questions, and learn from experiences.',
    status: 'New',
    icon: MessageCircle,
    link: '/community',
    features: ['Discussion forum', 'Upvoting', 'Categories', 'State-specific'],
  },
  {
    id: 'plainspeak-ai',
    name: 'PlainSpeak AI',
    tagline: 'LLM-Powered Document Translation',
    description: 'Upload PDF/DOCX or paste text. AI translates, classifies document type, and calculates risk scores with specific concerns.',
    status: 'Live',
    icon: Zap,
    link: '/tools/plainspeak-ai',
    features: ['PDF/DOCX upload', 'Auto-classification', 'Risk scoring', 'Translation history'],
  },
  {
    id: 'processmap',
    name: 'ProcessMap',
    tagline: 'Government Process Navigator',
    description: 'Interactive step-by-step guides for 15+ common government processes with visual flowcharts, time estimates, and document checklists.',
    status: 'Live',
    icon: Map,
    link: '/tools/processmap',
    features: ['15+ processes', 'Visual flowcharts', 'Document checklists', 'Time/cost estimates'],
  },
  {
    id: 'calculator',
    name: 'Complexity Calculator',
    tagline: 'Measure Any Process',
    description: 'Calculate the CLEAR Complexity Index for any government process using our 8-dimension methodology. Compare against benchmarks.',
    status: 'Live',
    icon: Calculator,
    link: '/calculator',
    features: ['8-dimension scoring', 'Weighted index', 'Benchmark comparison', 'Export reports'],
  },
  {
    id: 'extension',
    name: 'Browser Extension',
    tagline: 'PlainSpeak Everywhere',
    description: 'Translate legal text on any webpage with one click. Right-click selected text for instant translation with risk scoring.',
    status: 'Live',
    icon: Chrome,
    link: '/extension',
    features: ['Any webpage', 'Right-click translate', 'Risk scoring', 'Chrome/Edge/Firefox'],
  },
  {
    id: 'insights',
    name: 'Platform Insights',
    tagline: 'Analytics Dashboard',
    description: 'View platform analytics including translation stats, risk distributions, popular processes, and usage trends.',
    status: 'Live',
    icon: BarChart3,
    link: '/insights',
    features: ['Usage stats', 'Risk distribution', 'Weekly trends', 'State breakdown'],
  },
  {
    id: 'api',
    name: 'API Documentation',
    tagline: 'Developer Integration',
    description: 'Integrate CLEAR tools into your own applications. Full REST API with translation, submission, and feedback endpoints.',
    status: 'Live',
    icon: Code,
    link: '/api',
    features: ['REST API', 'Code examples', 'Rate limits', 'Quick start guide'],
  },
  {
    id: 'gov-apis',
    name: 'Government APIs',
    tagline: 'Real-Time Data Connections',
    description: 'Connect to official government APIs for address validation, status checks, and data verification.',
    status: 'New',
    icon: Shield,
    link: '/gov-apis',
    features: ['10+ APIs', 'USPS, IRS, SSA', 'Real-time data', 'Auto-fill forms'],
  },
  {
    id: 'smart',
    name: 'Smart Recommendations',
    tagline: 'ML-Powered Suggestions',
    description: 'Tell us about your life situation and our ML model identifies processes you need—including ones you might not know about.',
    status: 'New',
    icon: Sparkles,
    link: '/smart',
    features: ['Life events', 'Tax savings finder', 'Deadline alerts', 'Personalized'],
  },
  {
    id: 'deploy',
    name: 'Regional Templates',
    tagline: 'Deploy Locally',
    description: 'Pre-built, customizable templates for cities, counties, states, and nonprofits—ready to deploy in weeks.',
    status: 'New',
    icon: MapPin,
    link: '/deploy',
    features: ['4 templates', 'Fully branded', 'Self-hosted', 'Open source'],
  },
  {
    id: 'developers',
    name: 'Developer Portal',
    tagline: 'Build with CLEAR',
    description: 'SDKs, webhooks, and tools to integrate plain language government navigation into your applications.',
    status: 'New',
    icon: Code,
    link: '/developers',
    features: ['4 SDKs', 'Webhooks', 'API tiers', 'Use cases'],
  },
  {
    id: 'submit',
    name: 'Submit a Process',
    tagline: 'Crowdsource Complexity Data',
    description: 'Contribute your experience navigating a government process. Help us build the most comprehensive complexity database in America.',
    status: 'Live',
    icon: Send,
    link: '/submit',
    features: ['4-step wizard', 'Pain point capture', 'Suggestions welcome', 'Community-driven'],
  },
  {
    id: 'plainspeak',
    name: 'PlainSpeak Demo',
    tagline: 'Pattern-Based Translation',
    description: 'Original PlainSpeak tool using pattern matching. No AI required—works offline.',
    status: 'Live',
    icon: FileText,
    link: '/tools/plainspeak',
    features: ['No API needed', 'Offline capable', 'Multiple reading levels', 'Action extraction'],
  },
  {
    id: 'regwatch',
    name: 'RegWatch',
    tagline: 'Regulatory Change Monitor',
    description: 'Automated monitoring of regulatory changes with plain language summaries and impact assessments.',
    status: 'Coming Soon',
    icon: Bell,
    link: '#',
    features: ['Topic alerts', 'Plain summaries', 'Impact assessment', 'Deadline tracking'],
  },
  {
    id: 'navigator',
    name: 'Transition Navigator',
    tagline: 'Post-Labor Preparation Tool',
    description: 'Assess your automation exposure and build a personalized strategy for the economic transition.',
    status: 'Coming Soon',
    icon: Compass,
    link: '#',
    features: ['Exposure assessment', 'Skill mapping', 'Strategy builder', 'Resource directory'],
  },
]

export default function ToolsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <Badge variant="blue" className="mb-4">Tools</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
              Technology for Accessibility
            </h1>
            <p className="text-xl text-slate-400">
              We build tools that prove legal accessibility is possible. Every tool 
              demonstrates that complexity can be translated into clarity—and builds 
              the case for systemic reform.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tool */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-wide">
          <Card className="p-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="green" className="mb-4">Live Now</Badge>
                <h2 className="text-3xl font-serif font-semibold text-white mb-4">
                  PlainSpeak
                </h2>
                <p className="text-lg text-slate-300 mb-6">
                  Our flagship tool translates legal jargon into plain language anyone can understand. 
                  Paste any document and get immediate clarity on what it means for you.
                </p>
                <ul className="space-y-2 mb-6">
                  {['Instant translation to 8th or 12th grade reading level', 
                    'Extracts action items and deadlines',
                    'Highlights warnings and risks',
                    'Analyzes document complexity'].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-300">
                      <Zap className="w-4 h-4 text-blue-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/tools/plainspeak" 
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Try PlainSpeak <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="text-xs text-slate-500 mb-2 font-mono">BEFORE</div>
                <p className="text-sm text-slate-400 mb-4 font-mono">
                  "WHEREAS, Lessor is the owner of certain real property... for and in consideration 
                  of the covenants and obligations contained herein..."
                </p>
                <div className="text-xs text-slate-500 mb-2 font-mono">AFTER</div>
                <p className="text-sm text-white">
                  <strong>This is a rental agreement.</strong> You pay $1,200 each month, due on the 1st. 
                  If you're late by more than 5 days, you owe an extra $50.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* All Tools */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Tool Suite"
            title="Complete Toolkit"
            description="Our growing suite of tools addresses different aspects of legal and administrative complexity."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card key={tool.id} hover className="p-6 flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <tool.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <Badge variant={
                    tool.status === 'Live' ? 'green' : 
                    tool.status === 'Beta' ? 'amber' : 'default'
                  }>
                    {tool.status}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{tool.name}</h3>
                <p className="text-sm text-blue-400 mb-3">{tool.tagline}</p>
                <p className="text-sm text-slate-400 mb-4 flex-1">{tool.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      {feature}
                    </span>
                  ))}
                </div>
                {tool.status === 'Live' ? (
                  <Link 
                    to={tool.link} 
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-2"
                  >
                    Launch Tool <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="text-slate-500 text-sm">Coming soon</span>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Source */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="Open Source"
                title="Built in the Open"
                description="All CLEAR tools are open source. Contribute code, report issues, or fork for your own projects."
              />
              <div className="space-y-4">
                {[
                  { icon: Code, text: 'MIT licensed—use freely' },
                  { icon: Shield, text: 'Privacy-first design—no data collection' },
                  { icon: Zap, text: 'Community contributions welcome' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-slate-300">
                    <item.icon className="w-5 h-5 text-blue-400" />
                    {item.text}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <a 
                  href="https://github.com/clear-coalition" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex items-center gap-2"
                >
                  View on GitHub <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            <Card className="p-6 bg-slate-800/50">
              <h3 className="font-semibold text-white mb-4">API Access</h3>
              <p className="text-sm text-slate-400 mb-4">
                Integrate CLEAR tools into your own applications with our public API.
              </p>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                <div className="text-slate-500">// Translate document</div>
                <div className="text-green-400">POST /api/v1/plainspeak</div>
                <div className="text-slate-400 mt-2">{'{'}</div>
                <div className="text-slate-400 ml-4">"text": "...",</div>
                <div className="text-slate-400 ml-4">"level": "8"</div>
                <div className="text-slate-400">{'}'}</div>
              </div>
              <a 
                href="#" 
                className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1"
              >
                API Documentation <ExternalLink className="w-3 h-3" />
              </a>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

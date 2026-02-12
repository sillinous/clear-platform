import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Map, BarChart2, FileText, Users, Target, Download, ChevronRight,
  CheckCircle, Clock, DollarSign, AlertTriangle, TrendingUp, Building,
  Mail, Phone, Calendar, ExternalLink, Copy, Check, Rocket
} from 'lucide-react';

const PilotKitPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Target className="w-4 h-4" /> },
    { id: 'methodology', label: 'Methodology', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'states', label: 'Pilot States', icon: <Map className="w-4 h-4" /> },
    { id: 'outreach', label: 'Outreach Kit', icon: <Mail className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900/50 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Rocket className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Pilot Launch Kit</h1>
              <p className="text-slate-400">3-State Complexity Index Validation</p>
            </div>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl">
            Everything needed to launch and validate the CLEAR Complexity Index 
            in three pilot states, with methodology documentation and outreach materials.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-slate-700 bg-slate-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewSection />}
        {activeTab === 'methodology' && <MethodologySection />}
        {activeTab === 'states' && <StatesSection />}
        {activeTab === 'outreach' && <OutreachSection copiedEmail={copiedEmail} setCopiedEmail={setCopiedEmail} />}
        {activeTab === 'timeline' && <TimelineSection />}
      </div>
    </div>
  );
};

const OverviewSection = () => (
  <div className="space-y-8">
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">Pilot Program Overview</h2>
      <p className="text-slate-300 mb-6">
        The CLEAR Complexity Index Pilot validates our measurement methodology across three 
        diverse states, testing the framework against real-world government processes and 
        gathering feedback from citizens, administrators, and policymakers.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          icon={<Map className="w-6 h-6" />}
          value="3"
          label="Pilot States"
          description="Diverse geography, politics, population"
          color="emerald"
        />
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          value="15"
          label="Processes Measured"
          description="5 processes per state"
          color="blue"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          value="500+"
          label="Target Respondents"
          description="Citizens who've completed processes"
          color="purple"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">Pilot Objectives</h3>
        <ul className="space-y-3">
          {[
            'Validate Complexity Index scoring methodology',
            'Test ProcessMap navigation tools with real users',
            'Gather citizen experience data for baseline metrics',
            'Identify high-impact simplification opportunities',
            'Build relationships with reform-minded officials',
            'Generate case studies for national expansion'
          ].map((obj, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-300">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              {obj}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">Success Metrics</h3>
        <ul className="space-y-3">
          {[
            { metric: 'Methodology Validation', target: '95% inter-rater reliability' },
            { metric: 'User Satisfaction', target: '4.0+ on ProcessMap tools' },
            { metric: 'Data Collection', target: '500+ completed surveys' },
            { metric: 'Partner Engagement', target: '3+ agency partnerships per state' },
            { metric: 'Media Coverage', target: '5+ local news mentions' },
            { metric: 'Policy Interest', target: '2+ legislative inquiries' }
          ].map((item, i) => (
            <li key={i} className="flex items-center justify-between text-slate-300">
              <span>{item.metric}</span>
              <span className="text-emerald-400 font-mono text-sm">{item.target}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const MethodologySection = () => (
  <div className="space-y-8">
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">Complexity Index Methodology</h2>
      <p className="text-slate-300 mb-6">
        The CLEAR Complexity Index measures procedural burden using eight validated dimensions,
        each scored 1-10 and weighted by citizen impact research.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { dimension: 'Step Count', weight: '15%', description: 'Number of discrete actions required', icon: '📝' },
          { dimension: 'Time Required', weight: '20%', description: 'Total hours from start to finish', icon: '⏱️' },
          { dimension: 'Document Burden', weight: '15%', description: 'Paperwork and evidence requirements', icon: '📄' },
          { dimension: 'Agency Touchpoints', weight: '10%', description: 'Number of departments involved', icon: '🏢' },
          { dimension: 'Cost to Complete', weight: '15%', description: 'Fees, travel, and indirect costs', icon: '💰' },
          { dimension: 'Language Complexity', weight: '10%', description: 'Reading level of instructions', icon: '📖' },
          { dimension: 'Error Risk', weight: '10%', description: 'Likelihood of rejection/restart', icon: '⚠️' },
          { dimension: 'Accessibility', weight: '5%', description: 'Digital, language, disability access', icon: '♿' }
        ].map((dim, i) => (
          <div key={i} className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-2xl mb-2">{dim.icon}</div>
            <h4 className="font-semibold text-white mb-1">{dim.dimension}</h4>
            <p className="text-xs text-slate-400 mb-2">{dim.description}</p>
            <span className="text-emerald-400 font-mono text-sm">Weight: {dim.weight}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-lg font-bold text-white mb-4">Scoring Example: Business License Application</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left py-2 text-slate-400 font-medium">Dimension</th>
              <th className="text-center py-2 text-slate-400 font-medium">State A</th>
              <th className="text-center py-2 text-slate-400 font-medium">State B</th>
              <th className="text-center py-2 text-slate-400 font-medium">Best Practice</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {[
              ['Step Count', 8, 12, 5],
              ['Time Required', 7, 9, 3],
              ['Document Burden', 6, 8, 4],
              ['Agency Touchpoints', 5, 7, 2],
              ['Cost to Complete', 6, 7, 3],
              ['Language Complexity', 7, 8, 4],
              ['Error Risk', 6, 8, 2],
              ['Accessibility', 5, 6, 8]
            ].map(([dim, a, b, best], i) => (
              <tr key={i} className="border-b border-slate-700/50">
                <td className="py-2">{dim}</td>
                <td className="text-center py-2">
                  <span className={`font-mono ${a <= 5 ? 'text-green-400' : a <= 7 ? 'text-amber-400' : 'text-red-400'}`}>{a}</span>
                </td>
                <td className="text-center py-2">
                  <span className={`font-mono ${b <= 5 ? 'text-green-400' : b <= 7 ? 'text-amber-400' : 'text-red-400'}`}>{b}</span>
                </td>
                <td className="text-center py-2">
                  <span className="font-mono text-emerald-400">{best}</span>
                </td>
              </tr>
            ))}
            <tr className="font-bold">
              <td className="py-2">Weighted Total</td>
              <td className="text-center py-2 text-amber-400">6.3</td>
              <td className="text-center py-2 text-red-400">7.8</td>
              <td className="text-center py-2 text-emerald-400">3.4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
      <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
        <Download className="w-5 h-5" />
        Download Methodology Documents
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'Full Methodology Paper', size: 'PDF, 24 pages' },
          { name: 'Scoring Rubric', size: 'Excel template' },
          { name: 'Inter-Rater Training', size: 'Slides, 45 min' },
          { name: 'Data Collection Forms', size: 'PDF forms' }
        ].map((doc, i) => (
          <button key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-left">
            <div>
              <div className="font-medium text-white">{doc.name}</div>
              <div className="text-xs text-slate-400">{doc.size}</div>
            </div>
            <Download className="w-5 h-5 text-emerald-400" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

const StatesSection = () => {
  const pilotStates = [
    {
      name: 'Colorado',
      abbr: 'CO',
      region: 'Mountain West',
      population: '5.8M',
      politicalContext: 'Purple state, tech-forward government',
      whySelected: [
        'Strong digital government initiatives',
        'Bipartisan regulatory reform interest',
        'Active civic tech community',
        'Governor\'s Office innovation focus'
      ],
      targetProcesses: [
        'LLC Formation',
        'Driver\'s License Renewal',
        'Unemployment Insurance',
        'Building Permit (Denver)',
        'Professional License'
      ],
      keyContacts: [
        { role: 'Digital Service Director', dept: 'Office of Information Technology' },
        { role: 'Regulatory Reform Lead', dept: 'DORA' },
        { role: 'Innovation Fellow', dept: 'Governor\'s Office' }
      ]
    },
    {
      name: 'Georgia',
      abbr: 'GA',
      region: 'Southeast',
      population: '10.9M',
      politicalContext: 'Conservative-leaning, business-friendly',
      whySelected: [
        'High small business formation rate',
        'Diverse urban/rural population',
        'Recent administrative modernization',
        'Strong chamber of commerce network'
      ],
      targetProcesses: [
        'Business Registration',
        'Food Service License',
        'SNAP Benefits',
        'Vehicle Registration',
        'Occupational License'
      ],
      keyContacts: [
        { role: 'Secretary of State Office', dept: 'Corporations Division' },
        { role: 'DHS Commissioner', dept: 'Human Services' },
        { role: 'Small Business Director', dept: 'GDED' }
      ]
    },
    {
      name: 'Minnesota',
      abbr: 'MN',
      region: 'Upper Midwest',
      population: '5.7M',
      politicalContext: 'Progressive, strong civic engagement',
      whySelected: [
        'High civic participation rates',
        'History of administrative innovation',
        'Strong nonprofit sector partnerships',
        'Legislative interest in efficiency'
      ],
      targetProcesses: [
        'MinnesotaCare Enrollment',
        'Business License (Minneapolis)',
        'Teaching License',
        'Childcare License',
        'Property Tax Appeal'
      ],
      keyContacts: [
        { role: 'MN.IT Services Director', dept: 'IT Services' },
        { role: 'DHS Policy Lead', dept: 'Human Services' },
        { role: 'Management & Budget', dept: 'MMB' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {pilotStates.map((state, i) => (
        <motion.div
          key={state.abbr}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl font-bold text-white">{state.name}</span>
                  <span className="px-2 py-1 bg-slate-700 rounded text-sm text-slate-300">{state.abbr}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>{state.region}</span>
                  <span>•</span>
                  <span>Pop: {state.population}</span>
                  <span>•</span>
                  <span>{state.politicalContext}</span>
                </div>
              </div>
              <div className="w-16 h-16 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <Building className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Why Selected</h4>
                <ul className="space-y-2">
                  {state.whySelected.map((reason, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Target Processes</h4>
                <ul className="space-y-2">
                  {state.targetProcesses.map((process, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                      <FileText className="w-4 h-4 text-blue-400" />
                      {process}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Key Contacts</h4>
                <ul className="space-y-2">
                  {state.keyContacts.map((contact, j) => (
                    <li key={j} className="text-sm">
                      <div className="text-slate-300">{contact.role}</div>
                      <div className="text-slate-500 text-xs">{contact.dept}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const OutreachSection = ({ copiedEmail, setCopiedEmail }) => {
  const emailTemplate = `Subject: Partnership Inquiry: CLEAR Government Process Complexity Research

Dear [Name],

I'm reaching out on behalf of the Coalition for Legal & Administrative Reform (CLEAR), a nonpartisan initiative working to measure and reduce unnecessary complexity in government processes.

We're launching a pilot program to validate our Complexity Index methodology, and [State] has been selected as one of three pilot states due to [specific reason].

What we're proposing:
• Measure complexity of 5 key citizen-facing processes
• Provide free ProcessMap navigation tools for your constituents  
• Share all findings and recommendations with your office
• No cost to your agency; all research funded by CLEAR

The pilot would involve:
• 2-3 hours of initial consultation
• Access to process documentation (publicly available is fine)
• Optional: connection to 50-100 recent process completers for surveys

We've found that states participating in similar initiatives have seen:
• 15-30% reduction in process abandonment rates
• Improved citizen satisfaction scores
• Reduced call center volume
• Recognition for government innovation

I'd welcome 15 minutes to discuss whether this might be valuable for [Agency/Department]. Would you be available [suggested times]?

Best regards,
[Your name]
CLEAR - Coalition for Legal & Administrative Reform`;

  const copyEmail = () => {
    navigator.clipboard.writeText(emailTemplate);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Outreach Strategy</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-medium text-white mb-2">Primary Targets</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Digital Service Directors</li>
              <li>• Chief Innovation Officers</li>
              <li>• Regulatory Reform Leads</li>
              <li>• Legislative Staff (govt ops)</li>
            </ul>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-2xl mb-2">🤝</div>
            <h3 className="font-medium text-white mb-2">Secondary Targets</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Chamber of Commerce</li>
              <li>• Legal Aid Organizations</li>
              <li>• University Public Policy</li>
              <li>• Local Civic Tech Groups</li>
            </ul>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="text-2xl mb-2">📢</div>
            <h3 className="font-medium text-white mb-2">Media & Amplification</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Local Government Beat</li>
              <li>• Business Journal</li>
              <li>• Public Radio</li>
              <li>• State Policy Think Tanks</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Email Template: Initial Outreach</h3>
          <button
            onClick={copyEmail}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30"
          >
            {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedEmail ? 'Copied!' : 'Copy Template'}
          </button>
        </div>
        <pre className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono">
          {emailTemplate}
        </pre>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Talking Points</h3>
          <ul className="space-y-3">
            {[
              'Nonpartisan, research-driven approach',
              'No cost to participating agencies',
              'All findings shared transparently',
              'Focus on citizen experience, not blame',
              'Actionable recommendations, not just criticism',
              'Support for implementation if desired'
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Common Objections & Responses</h3>
          <div className="space-y-4">
            {[
              { obj: '"We don\'t have bandwidth"', resp: 'Minimal time required—we do the research' },
              { obj: '"Our processes are fine"', resp: 'Great! Let\'s document what works as best practice' },
              { obj: '"This could make us look bad"', resp: 'All states have complex processes; we focus on solutions' },
              { obj: '"We\'ve tried reform before"', resp: 'Our tools provide sustained citizen support, not one-time fixes' }
            ].map((item, i) => (
              <div key={i}>
                <div className="text-amber-400 text-sm font-medium">{item.obj}</div>
                <div className="text-slate-300 text-sm mt-1">→ {item.resp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const TimelineSection = () => {
  const phases = [
    {
      phase: 'Phase 1: Preparation',
      duration: 'Weeks 1-4',
      status: 'current',
      tasks: [
        { task: 'Finalize methodology documentation', done: true },
        { task: 'Train research team on scoring rubric', done: true },
        { task: 'Develop outreach materials', done: true },
        { task: 'Identify initial contacts in each state', done: false },
        { task: 'Set up data collection infrastructure', done: false }
      ]
    },
    {
      phase: 'Phase 2: Outreach & Partnerships',
      duration: 'Weeks 5-8',
      status: 'upcoming',
      tasks: [
        { task: 'Initial contact with state agencies', done: false },
        { task: 'Partnership agreements signed', done: false },
        { task: 'Local organization partnerships', done: false },
        { task: 'Media/PR groundwork', done: false },
        { task: 'Recruit survey participants', done: false }
      ]
    },
    {
      phase: 'Phase 3: Data Collection',
      duration: 'Weeks 9-16',
      status: 'upcoming',
      tasks: [
        { task: 'Score 15 processes (5 per state)', done: false },
        { task: 'Conduct citizen experience surveys', done: false },
        { task: 'Deploy ProcessMap tools', done: false },
        { task: 'Collect user feedback', done: false },
        { task: 'Document edge cases and learnings', done: false }
      ]
    },
    {
      phase: 'Phase 4: Analysis & Reporting',
      duration: 'Weeks 17-20',
      status: 'upcoming',
      tasks: [
        { task: 'Validate inter-rater reliability', done: false },
        { task: 'Analyze survey results', done: false },
        { task: 'Identify simplification opportunities', done: false },
        { task: 'Draft state-specific reports', done: false },
        { task: 'Prepare case studies', done: false }
      ]
    },
    {
      phase: 'Phase 5: Publication & Expansion',
      duration: 'Weeks 21-24',
      status: 'upcoming',
      tasks: [
        { task: 'Publish pilot findings report', done: false },
        { task: 'Share with participating agencies', done: false },
        { task: 'Media outreach and coverage', done: false },
        { task: 'Plan national expansion', done: false },
        { task: 'Recruit Phase 2 states', done: false }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {phases.map((phase, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`bg-slate-800 rounded-xl border overflow-hidden ${
            phase.status === 'current' ? 'border-emerald-500/50' : 'border-slate-700'
          }`}
        >
          <div className="p-4 flex items-center justify-between bg-slate-700/30">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                phase.status === 'current' ? 'bg-emerald-500' : 'bg-slate-700'
              }`}>
                <span className="text-white font-bold">{i + 1}</span>
              </div>
              <div>
                <h3 className="font-bold text-white">{phase.phase}</h3>
                <span className="text-sm text-slate-400">{phase.duration}</span>
              </div>
            </div>
            {phase.status === 'current' && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                In Progress
              </span>
            )}
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {phase.tasks.map((task, j) => (
                <li key={j} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    task.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                  }`}>
                    {task.done && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className={task.done ? 'text-slate-500 line-through' : 'text-slate-300'}>
                    {task.task}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const StatCard = ({ icon, value, label, description, color }) => {
  const colors = {
    emerald: 'bg-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400'
  };

  return (
    <div className="bg-slate-700/50 rounded-lg p-4">
      <div className={`w-12 h-12 rounded-lg ${colors[color]} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="font-medium text-white">{label}</div>
      <div className="text-sm text-slate-400 mt-1">{description}</div>
    </div>
  );
};

export default PilotKitPage;

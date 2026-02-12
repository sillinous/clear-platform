import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Building2, Briefcase, GraduationCap, Heart, Scale, Target,
  Mail, ArrowRight, Check, Download, Copy, ChevronRight, Star,
  Zap, Shield, Globe, TrendingUp, Award, Calendar, MessageSquare
} from 'lucide-react';

const CoalitionLaunchPage = () => {
  const [activeSection, setActiveSection] = useState('deck');
  const [copiedContent, setCopiedContent] = useState(null);

  const sections = [
    { id: 'deck', label: 'Partner Deck', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'tiers', label: 'Membership Tiers', icon: <Star className="w-4 h-4" /> },
    { id: 'campaign', label: 'Launch Campaign', icon: <Zap className="w-4 h-4" /> },
    { id: 'emails', label: 'Email Sequences', icon: <Mail className="w-4 h-4" /> }
  ];

  const copyContent = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedContent(id);
    setTimeout(() => setCopiedContent(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900/50 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Coalition Launch</h1>
              <p className="text-slate-400">Founding partner materials & campaigns</p>
            </div>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl">
            Build the coalition that will transform how Americans interact with government.
            Partner decks, membership tiers, and launch campaign materials.
          </p>
        </div>
      </section>

      {/* Navigation */}
      <div className="border-b border-slate-700 bg-slate-800/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'deck' && <PartnerDeck />}
        {activeSection === 'tiers' && <MembershipTiers />}
        {activeSection === 'campaign' && <LaunchCampaign />}
        {activeSection === 'emails' && <EmailSequences copyContent={copyContent} copiedContent={copiedContent} />}
      </div>
    </div>
  );
};

const PartnerDeck = () => {
  const slides = [
    {
      title: 'The Problem',
      content: (
        <div className="space-y-4">
          <div className="text-6xl font-bold text-red-400">$4,600</div>
          <p className="text-xl text-slate-300">Average cost to Americans of regulatory compliance per year</p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">68%</div>
              <p className="text-sm text-slate-400">give up on government processes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">23 hrs</div>
              <p className="text-sm text-slate-400">average time on paperwork yearly</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">$1.9T</div>
              <p className="text-sm text-slate-400">total regulatory compliance cost</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'The Opportunity',
      content: (
        <div className="space-y-6">
          <p className="text-xl text-slate-300">
            Most government complexity isn't intentional—it's accumulated. 
            No one designed it; it just grew.
          </p>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6">
            <h4 className="text-lg font-bold text-emerald-400 mb-3">What CLEAR Provides</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Objective complexity measurement',
                'Clear simplification roadmaps',
                'Citizen navigation tools',
                'Nonpartisan reform framework',
                'Cross-state best practices',
                'Political cover for reform'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Our Approach',
      content: (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-700/50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Measure</h4>
            <p className="text-sm text-slate-400">
              Complexity Index quantifies procedural burden across 8 dimensions
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Navigate</h4>
            <p className="text-sm text-slate-400">
              ProcessMap and PlainSpeak help citizens succeed today
            </p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Reform</h4>
            <p className="text-sm text-slate-400">
              Model legislation and best practices drive systemic change
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Why Partner?',
      content: (
        <div className="space-y-6">
          {[
            { type: 'Business', benefits: ['Reduced compliance costs', 'Faster permits & licenses', 'Level playing field', 'Voice in reform priorities'], icon: <Building2 /> },
            { type: 'Nonprofit', benefits: ['Better client outcomes', 'Data for advocacy', 'Coalition credibility', 'Shared tools & resources'], icon: <Heart /> },
            { type: 'Government', benefits: ['Citizen satisfaction', 'Efficiency metrics', 'Cross-state learning', 'Reform roadmaps'], icon: <Scale /> },
            { type: 'Academic', benefits: ['Research access', 'Student engagement', 'Publication opportunities', 'Real-world impact'], icon: <GraduationCap /> }
          ].map((sector, i) => (
            <div key={i} className="flex items-start gap-4 bg-slate-700/50 rounded-lg p-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400">
                {sector.icon}
              </div>
              <div>
                <h4 className="font-bold text-white mb-2">{sector.type} Partners</h4>
                <div className="flex flex-wrap gap-2">
                  {sector.benefits.map((b, j) => (
                    <span key={j} className="px-2 py-1 bg-slate-600 rounded text-xs text-slate-300">{b}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'The Ask',
      content: (
        <div className="space-y-6">
          <p className="text-xl text-slate-300 text-center">
            Join as a Founding Partner and shape the future of government accessibility
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-700 rounded-lg p-6 text-center border-2 border-slate-600">
              <div className="text-2xl font-bold text-white mb-2">Supporter</div>
              <div className="text-3xl font-bold text-blue-400 mb-4">$1,000<span className="text-sm text-slate-400">/yr</span></div>
              <ul className="text-sm text-slate-300 space-y-2 text-left">
                <li>• Logo on website</li>
                <li>• Quarterly updates</li>
                <li>• Tool access</li>
              </ul>
            </div>
            <div className="bg-blue-600/20 rounded-lg p-6 text-center border-2 border-blue-500">
              <div className="text-xs text-blue-400 mb-2">RECOMMENDED</div>
              <div className="text-2xl font-bold text-white mb-2">Partner</div>
              <div className="text-3xl font-bold text-blue-400 mb-4">$5,000<span className="text-sm text-slate-400">/yr</span></div>
              <ul className="text-sm text-slate-300 space-y-2 text-left">
                <li>• Advisory council seat</li>
                <li>• Co-branded research</li>
                <li>• Priority support</li>
                <li>• Early tool access</li>
              </ul>
            </div>
            <div className="bg-slate-700 rounded-lg p-6 text-center border-2 border-slate-600">
              <div className="text-2xl font-bold text-white mb-2">Champion</div>
              <div className="text-3xl font-bold text-blue-400 mb-4">$25,000<span className="text-sm text-slate-400">/yr</span></div>
              <ul className="text-sm text-slate-300 space-y-2 text-left">
                <li>• Board observer seat</li>
                <li>• Custom research</li>
                <li>• Speaking opportunities</li>
                <li>• White-label tools</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-8 min-h-[400px]">
          <div className="text-sm text-blue-400 mb-2">Slide {currentSlide + 1} of {slides.length}</div>
          <h2 className="text-3xl font-bold text-white mb-8">{slides[currentSlide].title}</h2>
          {slides[currentSlide].content}
        </div>
        <div className="px-8 py-4 bg-slate-700/30 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-4 py-2 bg-slate-700 rounded-lg disabled:opacity-50 text-white"
          >
            Previous
          </button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentSlide ? 'bg-blue-500' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2 bg-blue-500 rounded-lg disabled:opacity-50 text-white"
          >
            Next
          </button>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download Partner Deck
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: 'Full Partner Deck', format: 'PDF, 12 slides' },
            { name: 'Executive Summary', format: 'PDF, 2 pages' },
            { name: 'One-Pager', format: 'PDF, print-ready' }
          ].map((doc, i) => (
            <button key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-left">
              <div>
                <div className="font-medium text-white">{doc.name}</div>
                <div className="text-xs text-slate-400">{doc.format}</div>
              </div>
              <Download className="w-5 h-5 text-blue-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const MembershipTiers = () => {
  const tiers = [
    {
      name: 'Individual',
      price: 'Free',
      period: '',
      description: 'Citizens supporting the mission',
      features: [
        'Access to all public tools',
        'Newsletter & updates',
        'Community forums',
        'Volunteer opportunities'
      ],
      cta: 'Join Free',
      highlight: false
    },
    {
      name: 'Supporter',
      price: '$1,000',
      period: '/year',
      description: 'Small organizations & professionals',
      features: [
        'Everything in Individual',
        'Logo on partner page',
        'Quarterly research briefings',
        'Tool API access',
        'Invitation to annual summit'
      ],
      cta: 'Become Supporter',
      highlight: false
    },
    {
      name: 'Partner',
      price: '$5,000',
      period: '/year',
      description: 'Mid-size organizations',
      features: [
        'Everything in Supporter',
        'Advisory Council seat',
        'Co-branded research reports',
        'Priority tool customization',
        'Dedicated support contact',
        'Media opportunity coordination'
      ],
      cta: 'Become Partner',
      highlight: true
    },
    {
      name: 'Champion',
      price: '$25,000',
      period: '/year',
      description: 'Major foundations & corporations',
      features: [
        'Everything in Partner',
        'Board observer seat',
        'Custom research projects',
        'White-label tool licensing',
        'Executive speaking opportunities',
        'Strategic planning input',
        'Named initiative sponsorship'
      ],
      cta: 'Become Champion',
      highlight: false
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-4 gap-6">
        {tiers.map((tier, i) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-slate-800 rounded-xl border overflow-hidden ${
              tier.highlight ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-700'
            }`}
          >
            {tier.highlight && (
              <div className="bg-blue-500 text-white text-center text-sm py-1 font-medium">
                Most Popular
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-white">{tier.price}</span>
                <span className="text-slate-400">{tier.period}</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">{tier.description}</p>
              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-2 rounded-lg font-medium transition-colors ${
                tier.highlight
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}>
                {tier.cta}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4">Special Arrangements</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Government Agencies</h4>
            <p className="text-sm text-slate-400 mb-3">
              We offer complimentary partnership status to government agencies actively 
              participating in pilot programs or implementing CLEAR recommendations.
            </p>
            <button className="text-blue-400 text-sm flex items-center gap-1">
              Contact for details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Academic Institutions</h4>
            <p className="text-sm text-slate-400 mb-3">
              Universities and research institutions receive 50% discount on partnership 
              tiers, with opportunities for student engagement and joint research.
            </p>
            <button className="text-blue-400 text-sm flex items-center gap-1">
              Academic partnership info <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const LaunchCampaign = () => {
  const campaignPhases = [
    {
      phase: 'Pre-Launch (2 weeks before)',
      activities: [
        { activity: 'Teaser social media campaign', channel: 'Twitter/LinkedIn', status: 'ready' },
        { activity: 'Founding partner soft outreach', channel: 'Email/Phone', status: 'ready' },
        { activity: 'Press embargo briefings', channel: 'Media', status: 'ready' },
        { activity: 'Website preview for partners', channel: 'Web', status: 'ready' }
      ]
    },
    {
      phase: 'Launch Day',
      activities: [
        { activity: 'Press release distribution', channel: 'PR Newswire', status: 'ready' },
        { activity: 'Website public launch', channel: 'Web', status: 'ready' },
        { activity: 'Social media blitz', channel: 'All platforms', status: 'ready' },
        { activity: 'Partner announcement emails', channel: 'Email', status: 'ready' },
        { activity: 'Live demo webinar', channel: 'Zoom', status: 'ready' }
      ]
    },
    {
      phase: 'Week 1 Follow-up',
      activities: [
        { activity: 'Media interview requests', channel: 'Press', status: 'ready' },
        { activity: 'Partner spotlight series', channel: 'Social/Blog', status: 'ready' },
        { activity: 'Community AMA', channel: 'Reddit/Discord', status: 'ready' },
        { activity: 'Newsletter to list', channel: 'Email', status: 'ready' }
      ]
    },
    {
      phase: 'Month 1 Sustained',
      activities: [
        { activity: 'Case study publications', channel: 'Blog/PR', status: 'ready' },
        { activity: 'Podcast tour', channel: 'Audio', status: 'ready' },
        { activity: 'Op-ed placements', channel: 'Media', status: 'ready' },
        { activity: 'Conference presentations', channel: 'Events', status: 'ready' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-6">Launch Campaign Timeline</h2>
        <div className="space-y-6">
          {campaignPhases.map((phase, i) => (
            <div key={i} className="border-l-2 border-blue-500 pl-6 pb-6">
              <h3 className="text-lg font-bold text-white mb-4">{phase.phase}</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {phase.activities.map((act, j) => (
                  <div key={j} className="flex items-center justify-between bg-slate-700/50 rounded-lg px-4 py-3">
                    <div>
                      <div className="text-white">{act.activity}</div>
                      <div className="text-xs text-slate-400">{act.channel}</div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Social Media Assets</h3>
          <div className="space-y-3">
            {[
              { name: 'Twitter/X Graphics Pack', count: '10 images' },
              { name: 'LinkedIn Post Templates', count: '5 posts' },
              { name: 'Instagram Stories', count: '8 slides' },
              { name: 'Video Clips', count: '3 videos' }
            ].map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <span className="text-slate-300">{asset.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{asset.count}</span>
                  <Download className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4">Press Materials</h3>
          <div className="space-y-3">
            {[
              { name: 'Press Release', desc: 'Launch announcement' },
              { name: 'Media Kit', desc: 'Logos, bios, photos' },
              { name: 'Fact Sheet', desc: 'Key statistics & talking points' },
              { name: 'B-Roll Package', desc: 'Video footage for media' }
            ].map((asset, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                <div>
                  <div className="text-slate-300">{asset.name}</div>
                  <div className="text-xs text-slate-400">{asset.desc}</div>
                </div>
                <Download className="w-4 h-4 text-blue-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailSequences = ({ copyContent, copiedContent }) => {
  const sequences = [
    {
      name: 'Founding Partner Recruitment',
      emails: [
        {
          id: 'fp1',
          subject: 'Invitation: Join CLEAR as a Founding Partner',
          timing: 'Initial outreach',
          body: `Dear [Name],

I'm reaching out because [Organization] has been a leader in [relevant area], and we believe you'd be a valuable partner in our mission to simplify government for all Americans.

CLEAR (Coalition for Legal & Administrative Reform) is launching a national initiative to measure, navigate, and ultimately reduce unnecessary complexity in government processes. We're inviting select organizations to join as Founding Partners.

As a Founding Partner, [Organization] would:
• Shape our research priorities through Advisory Council participation
• Gain early access to our ProcessMap and PlainSpeak tools
• Co-brand research relevant to your constituents
• Be recognized as a leader in government accessibility

We're asking for a modest $5,000 annual commitment, which directly funds research and tool development.

I'd welcome 20 minutes to discuss how CLEAR could advance [Organization]'s mission. Would you be available [suggested times]?

Best regards,
[Sender]`
        },
        {
          id: 'fp2',
          subject: 'Following up: CLEAR Founding Partnership',
          timing: '5 days after initial',
          body: `Hi [Name],

I wanted to follow up on my previous email about joining CLEAR as a Founding Partner.

Since I reached out, we've confirmed partnerships with [Notable Partner 1] and [Notable Partner 2], and we're preparing for our public launch in [Month].

I understand you're busy, so I'll be brief: would a quick 15-minute call work to explore whether this is a fit for [Organization]?

If the timing isn't right, no worries—I'll make sure you're on our list for future updates.

Best,
[Sender]`
        },
        {
          id: 'fp3',
          subject: 'Last chance: CLEAR Founding Partner deadline',
          timing: '2 weeks before launch',
          body: `[Name],

Quick note: We're closing Founding Partner enrollment on [Date] before our public launch.

Founding Partners receive special recognition on our website, in press materials, and at our launch event. After [Date], partnership opportunities will still be available, but without the Founding Partner designation.

If [Organization] is interested, I'd be happy to connect one more time before the deadline.

Best,
[Sender]`
        }
      ]
    },
    {
      name: 'Individual Supporter Welcome',
      emails: [
        {
          id: 'is1',
          subject: 'Welcome to CLEAR! Here\'s how to get started',
          timing: 'Immediately after signup',
          body: `Welcome to CLEAR, [Name]!

You've joined a growing movement of Americans who believe government should work for everyone—not just those who can afford lawyers and consultants.

Here's what you can do right now:

1. **Try ProcessMap** - Navigate any government process step-by-step
   [Link to ProcessMap]

2. **Use PlainSpeak** - Translate confusing legal language instantly
   [Link to PlainSpeak]

3. **Share Your Story** - Tell us about a frustrating government experience
   [Link to survey]

We're just getting started, and your support makes this possible.

Thank you for being part of the solution.

The CLEAR Team`
        },
        {
          id: 'is2',
          subject: 'Your impact: What CLEAR accomplished this month',
          timing: 'Monthly update',
          body: `Hi [Name],

Here's what your support helped accomplish this month:

📊 **By the Numbers**
• [X] processes mapped
• [X] documents translated via PlainSpeak
• [X] citizens helped navigate government

🎯 **Research Progress**
• Completed Complexity Index scoring for [State]
• Published guide to [Process]
• Launched partnership with [Organization]

🗣️ **In the News**
• [Publication]: "[Headline]"
• [Podcast]: "[Episode Title]"

**Coming Next Month**
• [Upcoming initiative]
• [New tool/feature]

Thank you for being part of CLEAR.

Best,
The CLEAR Team`
        }
      ]
    },
    {
      name: 'Media Outreach',
      emails: [
        {
          id: 'mo1',
          subject: 'Story pitch: New tool reveals hidden costs of government complexity',
          timing: 'Launch week',
          body: `Hi [Reporter Name],

Americans spend an average of 23 hours per year on government paperwork—and 68% abandon processes they started. A new nonpartisan initiative is working to change that.

CLEAR (Coalition for Legal & Administrative Reform) is launching the first-ever Complexity Index to measure how hard it is to interact with government, along with free tools that help citizens navigate bureaucracy.

Story angles:
• Local: How does [State/City] compare to others on complexity?
• Consumer: New tools translate legal jargon and map government processes
• Policy: Bipartisan coalition forms to tackle regulatory burden
• Tech: AI-powered tools help citizens understand their rights

I can provide:
• Interviews with CLEAR leadership
• Data on [State/City]-specific complexity
• Case studies of citizens helped
• Access to tools for testing

Would you be interested in covering this? I'm happy to tailor the pitch to your beat.

Best,
[Sender]
CLEAR Communications`
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {sequences.map((sequence, i) => (
        <div key={i} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 bg-slate-700/50 border-b border-slate-700">
            <h3 className="text-lg font-bold text-white">{sequence.name}</h3>
            <p className="text-sm text-slate-400">{sequence.emails.length} email{sequence.emails.length > 1 ? 's' : ''} in sequence</p>
          </div>
          <div className="divide-y divide-slate-700">
            {sequence.emails.map((email, j) => (
              <div key={j} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-white">{email.subject}</span>
                    </div>
                    <span className="text-xs text-slate-400">{email.timing}</span>
                  </div>
                  <button
                    onClick={() => copyContent(email.id, email.body)}
                    className="flex items-center gap-1 px-2 py-1 bg-slate-700 rounded text-sm text-slate-300 hover:bg-slate-600"
                  >
                    {copiedContent === email.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copiedContent === email.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="bg-slate-900 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
                  {email.body}
                </pre>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoalitionLaunchPage;

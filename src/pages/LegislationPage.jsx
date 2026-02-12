import { Link } from 'react-router-dom'
import { useState } from 'react'
import { 
  Gavel, FileText, Download, CheckCircle, Clock, 
  ArrowRight, ChevronDown, ChevronUp, Scale
} from 'lucide-react'
import { Card, Badge, SectionHeader, Tabs } from '../components/UI'

const modelActs = [
  {
    id: 'adaptive',
    name: 'Adaptive Regulation Act',
    summary: 'Automatic review triggers and 10-year sunset provisions for all regulations.',
    status: 'Draft Complete',
    keyProvisions: [
      'Mandatory review when technology changes',
      'Automatic expiration without renewal',
      'Simplification default preference',
      'Citizen petition process',
      'Office of Regulatory Review',
    ],
  },
  {
    id: 'plainlang',
    name: 'Plain Language in Government Act',
    summary: 'Requires all government documents to meet 8th grade readability standards.',
    status: 'Draft Complete',
    keyProvisions: [
      '8th grade reading level target',
      'Plain Language Coordinators',
      'User testing requirements',
      'Public feedback mechanism',
      '5-year implementation timeline',
    ],
  },
  {
    id: 'distributed',
    name: 'Distributed Organization Recognition Act',
    summary: 'Legal framework for DAOs, platform cooperatives, and AI-augmented enterprises.',
    status: 'Draft Complete',
    keyProvisions: [
      'DAO legal recognition',
      'Platform cooperative status',
      'AI enterprise accountability',
      'Limited liability protection',
      'Governance documentation requirements',
    ],
  },
  {
    id: 'portable',
    name: 'Portable Benefits & Security Act',
    summary: 'Decouples essential benefits from specific employment relationships.',
    status: 'Draft Complete',
    keyProvisions: [
      'Portable Benefits Accounts',
      'Mandatory employer contributions',
      'Worker choice of benefits',
      'Transition support for displacement',
      'Tax-advantaged treatment',
    ],
  },
  {
    id: 'algorithmic',
    name: 'Algorithmic Accountability Act',
    summary: 'Transparency and human oversight requirements for AI decision systems.',
    status: 'Draft Complete',
    keyProvisions: [
      'Notice of AI use in decisions',
      'Right to human review',
      'Algorithmic impact assessments',
      'Bias testing requirements',
      'Government enhanced requirements',
    ],
  },
]

export default function LegislationPage() {
  const [expandedAct, setExpandedAct] = useState(null)

  return (
    <div>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <Badge variant="blue" className="mb-4">Model Legislation</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
              Ready-to-Adapt Legal Frameworks
            </h1>
            <p className="text-xl text-slate-400">
              Five model acts designed to address legal complexity and prepare for the 
              post-labor transition. Each is modular, bipartisan-framed, and ready for 
              state or federal adaptation.
            </p>
          </div>
        </div>
      </section>

      {/* Acts Grid */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <div className="space-y-4">
            {modelActs.map((act) => (
              <Card key={act.id} className="overflow-hidden">
                <button
                  onClick={() => setExpandedAct(expandedAct === act.id ? null : act.id)}
                  className="w-full p-6 flex items-start justify-between text-left hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Gavel className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white">{act.name}</h3>
                        <Badge variant="green">{act.status}</Badge>
                      </div>
                      <p className="text-slate-400">{act.summary}</p>
                    </div>
                  </div>
                  {expandedAct === act.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                
                {expandedAct === act.id && (
                  <div className="px-6 pb-6 border-t border-slate-700">
                    <div className="pt-6 grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-3">Key Provisions</h4>
                        <ul className="space-y-2">
                          {act.keyProvisions.map((provision, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              {provision}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-3">Resources</h4>
                        <div className="space-y-2">
                          <a href="#" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                            <Download className="w-4 h-4" />
                            Full Model Text (PDF)
                          </a>
                          <a href="#" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                            <FileText className="w-4 h-4" />
                            Section-by-Section Analysis
                          </a>
                          <a href="#" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                            <FileText className="w-4 h-4" />
                            One-Pager Summary
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Support */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Support"
            title="Implementation Assistance"
            description="CLEAR provides technical assistance to legislators and advocates adapting model legislation."
            centered
          />
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: 'Customization', desc: 'Adapt for specific jurisdictions' },
              { title: 'Fiscal Analysis', desc: 'Budget impact estimation support' },
              { title: 'Testimony', desc: 'Expert witness and committee support' },
              { title: 'Coalition Building', desc: 'Connect with local advocates' },
            ].map((service, i) => (
              <Card key={i} className="p-6 text-center">
                <h3 className="font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-slate-400">{service.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Progress"
            title="Legislative Tracking"
            description="Monitor the status of CLEAR-inspired legislation across all 50 states."
          />
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Active Campaigns</h3>
              <Badge variant="blue">3 States</Badge>
            </div>
            <div className="space-y-4">
              {[
                { state: 'Colorado', bill: 'HB 24-1234', act: 'Plain Language', status: 'Committee', progress: 40 },
                { state: 'Oregon', bill: 'SB 567', act: 'Adaptive Regulation', status: 'Introduced', progress: 20 },
                { state: 'Vermont', bill: 'H.89', act: 'Portable Benefits', status: 'Drafting', progress: 10 },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium text-white">{item.state}</span>
                      <span className="text-slate-500 mx-2">•</span>
                      <span className="text-sm text-slate-400">{item.bill}</span>
                    </div>
                    <Badge variant="amber">{item.status}</Badge>
                  </div>
                  <div className="text-sm text-slate-400 mb-2">{item.act}</div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-serif font-semibold text-white mb-4">
            Bring Reform to Your State
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Join our policy advocacy working group to help introduce and pass legislation in your jurisdiction.
          </p>
          <Link to="/coalition" className="btn-primary inline-flex items-center gap-2">
            Join Policy Working Group <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

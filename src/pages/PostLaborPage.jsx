import { Link } from 'react-router-dom'
import { 
  TrendingUp, Clock, Users, Lightbulb, Shield, Target,
  ArrowRight, ExternalLink, AlertTriangle, CheckCircle
} from 'lucide-react'
import { Card, Badge, SectionHeader } from '../components/UI'

const agencyDimensions = [
  { name: 'Time Sovereignty', desc: 'Control over your schedule and discretionary time' },
  { name: 'Financial Authority', desc: 'Power to make meaningful economic choices without coercion' },
  { name: 'Knowledge Access', desc: 'Information needed for informed decisions' },
  { name: 'Community Power', desc: 'Collective ability to shape your local economy' },
  { name: 'Mobility Freedom', desc: 'Ability to improve position through effort' },
  { name: 'Bargaining Power', desc: 'Leverage to negotiate fair terms' },
]

const principles = [
  'Subsidiarity — decisions at lowest effective level',
  'Radical Transparency — power requires openness',
  'No Socialized Private Risk — internalize consequences',
  'Information Symmetry — hidden info is market failure',
  'Local Ownership — owned by those affected',
  'Minimize Intermediaries — direct value flows',
  'Competitive Power — no entity escapes market forces',
  'Aligned Incentives — decision-makers experience consequences',
  'Decentralize by Default — power concentrates unless prevented',
  'Prioritize Automation — obligatory labor is tech failure',
  'Build Infrastructure — foundations for distributed power',
]

export default function PostLaborPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <Badge variant="amber" className="mb-4">
              <AlertTriangle className="w-3 h-3 mr-1" /> Accelerating Transition
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
              Post-Labor Economics
            </h1>
            <p className="text-xl text-slate-400">
              AI and automation are compressing what should be a 100-year economic transition 
              into 15-20 years. Understanding this shift is essential for preparing adaptive 
              systems and distributing prosperity broadly.
            </p>
          </div>
        </div>
      </section>

      {/* The Transition */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="The Challenge"
                title="The Great Transition"
                description="For centuries, labor has been the primary source of income and social power for most people. That foundation is shifting."
              />
              <div className="space-y-4">
                {[
                  { label: 'Compute doubling', value: 'Every 6 months' },
                  { label: 'Jobs automatable by 2030', value: '40%' },
                  { label: 'Displacement rate by 2040s', value: '2M+ jobs/year' },
                  { label: 'Transition window', value: '15-20 years' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                    <span className="text-slate-400">{stat.label}</span>
                    <span className="text-white font-semibold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/30">
              <AlertTriangle className="w-10 h-10 text-amber-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Why This Matters</h3>
              <p className="text-slate-300 mb-4">
                Previous transitions (agricultural → industrial, industrial → information) 
                took 50-100 years. Societies had time to adapt institutions, build safety nets, 
                and develop new social contracts.
              </p>
              <p className="text-slate-300">
                The AI transition offers no such luxury. Every month of delay means facing 
                more disruption with less preparation. Path dependency locks in outcomes—early 
                decisions shape distribution for generations.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Economic Agency */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Framework"
            title="The Six Dimensions of Economic Agency"
            description="Economic agency is the capacity to make meaningful choices about your economic life. As labor leverage declines, these dimensions become critical."
            centered
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencyDimensions.map((dim, i) => (
              <Card key={i} className="p-6">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-lg font-semibold text-blue-400">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-white mb-2">{dim.name}</h3>
                <p className="text-sm text-slate-400">{dim.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pyramids */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Pyramids Framework"
            title="Building Distributed Prosperity & Power"
            description="David Shapiro's framework identifies two interlocking hierarchies that must be built from the bottom up."
            centered
          />
          
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Pyramid of Prosperity
              </h3>
              <div className="space-y-4">
                {[
                  { level: 'Peak', title: 'Individual Agency', desc: 'Entrepreneurship, investment, creative work' },
                  { level: 'Middle', title: 'Ownership Stakes', desc: 'Equity, co-ops, community funds' },
                  { level: 'Foundation', title: 'Universal Guarantees', desc: 'Basic income, healthcare, housing' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-800 rounded-lg">
                    <div className="text-xs text-green-400 mb-1">{item.level}</div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Pyramid of Power
              </h3>
              <div className="space-y-4">
                {[
                  { level: 'Peak', title: 'Distributed Governance', desc: 'Subsidiarity, local control, federated systems' },
                  { level: 'Middle', title: 'Participation Mechanisms', desc: 'Direct democracy, citizen assemblies, DAOs' },
                  { level: 'Foundation', title: 'Transparency & Access', desc: 'Open government, plain language, digital access' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-slate-800 rounded-lg">
                    <div className="text-xs text-blue-400 mb-1">{item.level}</div>
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="text-sm text-slate-400">{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-slate-300 text-center">
              <strong className="text-white">The key insight:</strong> Every level of both pyramids is 
              blocked by legal complexity. You can't build a post-labor economy on foundations citizens can't understand.
            </p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Principles"
            title="11 Guiding Principles"
            description="These principles from the Post-Labor Economics framework guide policy evaluation and design."
          />
          
          <div className="grid md:grid-cols-2 gap-4">
            {principles.map((principle, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLEAR's Role */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="blue" className="mb-4">CLEAR's Role</Badge>
            <h2 className="text-3xl font-serif font-semibold text-white mb-6">
              Why Legal Reform is Economic Reform
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              CLEAR works at the intersection of legal simplification and post-labor economics. 
              We use AI tools to both navigate and dismantle complexity while building the 
              infrastructure for distributed governance.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <Card className="p-6">
                <Target className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">Clear the Path</h3>
                <p className="text-sm text-slate-400">
                  Remove complexity barriers blocking new organizational forms like DAOs and co-ops.
                </p>
              </Card>
              <Card className="p-6">
                <Lightbulb className="w-8 h-8 text-amber-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">Enable Adaptation</h3>
                <p className="text-sm text-slate-400">
                  Give citizens tools and knowledge to navigate transition without experts.
                </p>
              </Card>
              <Card className="p-6">
                <Users className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">Distribute Power</h3>
                <p className="text-sm text-slate-400">
                  Build participation infrastructure so AI benefits are shared broadly.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Attribution */}
      <section className="section-padding">
        <div className="container-wide">
          <Card className="p-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-white">DS</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">David Shapiro's Post-Labor Economics</h3>
                <p className="text-slate-300 mb-4">
                  The framework presented here draws heavily from David Shapiro's comprehensive 
                  Post-Labor Economics work. His research on economic agency, the Pyramids framework, 
                  and transition principles provides the theoretical foundation for CLEAR's approach.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://daveshap.substack.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                  >
                    Substack <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="https://www.youtube.com/@DavidShapiroAutomator" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                  >
                    YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1"
                  >
                    Skool Community <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-serif font-semibold text-white mb-4">
            Prepare for the Transition
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Join the Post-Labor Economics working group to help develop transition frameworks and policy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/coalition" className="btn-primary flex items-center gap-2">
              Join Working Group <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/education" className="btn-secondary">
              Take the Curriculum
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

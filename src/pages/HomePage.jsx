import { Link } from 'react-router-dom'
import { 
  Scale, ArrowRight, FileText, Users, BookOpen, Gavel, 
  TrendingUp, AlertTriangle, Clock, Shield, Zap, Target
} from 'lucide-react'
import { Card, Badge, SectionHeader, StatCard } from '../components/UI'

const problemAreas = [
  { name: 'Tax System', score: 94, risk: 'HIGH', icon: FileText },
  { name: 'Healthcare', score: 91, risk: 'HIGH', icon: Shield },
  { name: 'Criminal Justice', score: 96, risk: 'EXTREME', icon: Gavel },
  { name: 'Immigration', score: 89, risk: 'HIGH', icon: Users },
  { name: 'Business Formation', score: 78, risk: 'HIGH', icon: TrendingUp },
  { name: 'Employment & Labor', score: 88, risk: 'EXTREME', icon: Clock },
]

const stats = [
  { value: '$2T+', label: 'Annual compliance costs' },
  { value: '40%', label: 'Jobs automatable by 2030' },
  { value: '15-20yr', label: 'Post-labor transition window' },
  { value: '0', label: 'Countries with coherent AI governance' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent" />
        <div className="container-wide section-padding relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="blue" className="mb-6">The Window is Closing</Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-semibold text-white mb-6 leading-tight">
              Making Law <span className="gradient-text">Accessible</span>.<br />
              Preparing for the <span className="gradient-text">Future</span>.
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Legal complexity costs Americans trillions annually while blocking adaptation 
              to the AI transition. CLEAR is building the tools, research, and coalition 
              to simplify systems and expand economic agency for all.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/tools/plainspeak" className="btn-primary flex items-center gap-2">
                Try PlainSpeak Tool <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="container-wide py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-semibold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Areas */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="The Complexity Crisis"
            title="Systems Failing Citizens"
            description="Legal and administrative complexity creates barriers that cost time, money, and opportunity—blocking the economic agency citizens need to thrive."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemAreas.map((area) => (
              <Card key={area.name} hover className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <area.icon className="w-6 h-6 text-slate-400" />
                  </div>
                  <Badge variant={area.risk === 'EXTREME' ? 'red' : 'amber'}>
                    {area.risk} Risk
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{area.name}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${area.score > 90 ? 'bg-red-500' : area.score > 80 ? 'bg-amber-500' : 'bg-yellow-500'}`}
                      style={{ width: `${area.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono text-slate-400">{area.score}/100</span>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/research" className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-2">
              View Full Complexity Index <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Acceleration Section */}
      <section className="section-padding bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="amber" className="mb-4">
                <AlertTriangle className="w-3 h-3 mr-1" /> Urgent
              </Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-6">
                The AI Transition is Accelerating
              </h2>
              <p className="text-lg text-slate-400 mb-6">
                Previous economic transitions took 50-100 years. The AI transition will compress 
                into 15-20 years. Every month of delay means facing more disruption with less preparation.
              </p>
              <ul className="space-y-4">
                {[
                  'Compute power doubling every 6 months',
                  '40% of jobs potentially automatable by 2030',
                  'Current systems designed for stable employment era',
                  'Complexity blocks adaptation when speed is critical',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent">
                <Clock className="w-8 h-8 text-blue-400 mb-3" />
                <div className="text-2xl font-semibold text-white mb-1">15-20 Years</div>
                <div className="text-sm text-slate-400">Estimated transition window</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-transparent">
                <TrendingUp className="w-8 h-8 text-amber-400 mb-3" />
                <div className="text-2xl font-semibold text-white mb-1">2M+ Jobs/Year</div>
                <div className="text-sm text-slate-400">Displacement by 2040s</div>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-red-500/10 to-transparent col-span-2">
                <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
                <div className="text-2xl font-semibold text-white mb-1">Winner-Take-All Risk</div>
                <div className="text-sm text-slate-400">Without intervention, AI benefits concentrate by default</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Five Pillars */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Our Approach"
            title="Five Pillars of Reform"
            description="A comprehensive strategy combining research, advocacy, technology, education, and coalition-building."
            centered
          />
          
          <div className="grid md:grid-cols-5 gap-6">
            {[
              { icon: TrendingUp, title: 'Research', desc: 'Complexity Index & Economic Agency Dashboard' },
              { icon: Gavel, title: 'Advocacy', desc: 'Model legislation for state & federal reform' },
              { icon: Zap, title: 'Tools', desc: 'PlainSpeak, ProcessMap & citizen technology' },
              { icon: BookOpen, title: 'Education', desc: '8-module curriculum for civic & economic literacy' },
              { icon: Users, title: 'Coalition', desc: '7 working groups building the movement' },
            ].map((pillar, i) => (
              <Card key={i} hover className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <pillar.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{pillar.title}</h3>
                <p className="text-sm text-slate-400">{pillar.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-6">
              Join the Movement
            </h2>
            <p className="text-lg text-slate-400 mb-8">
              Complexity harms everyone. The post-labor transition affects all workers. 
              Together, we can build systems that work for everyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/coalition" className="btn-primary flex items-center gap-2">
                Join the Coalition <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/tools" className="btn-secondary">
                Explore Tools
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

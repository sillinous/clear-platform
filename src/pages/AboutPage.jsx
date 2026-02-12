import { Link } from 'react-router-dom'
import { 
  Scale, Target, Users, Lightbulb, ArrowRight,
  CheckCircle, ExternalLink
} from 'lucide-react'
import { Card, Badge, SectionHeader } from '../components/UI'

const principles = [
  {
    title: 'Subsidiarity',
    description: 'Decisions should be made at the lowest effective level of organization.',
  },
  {
    title: 'Radical Transparency',
    description: 'Power requires openness. Information asymmetry is a market failure.',
  },
  {
    title: 'Decentralize by Default',
    description: 'Power concentrates unless actively prevented through structural design.',
  },
  {
    title: 'Prioritize Automation',
    description: 'Obligatory labor for survival is a technology failure, not a moral necessity.',
  },
  {
    title: 'Build Infrastructure',
    description: 'Create the foundations for distributed power and shared prosperity.',
  },
]

const team = [
  { role: 'Research Director', focus: 'Complexity Index methodology' },
  { role: 'Technology Lead', focus: 'PlainSpeak & civic tools' },
  { role: 'Policy Director', focus: 'Model legislation & advocacy' },
  { role: 'Education Director', focus: 'Curriculum & outreach' },
  { role: 'Coalition Coordinator', focus: 'Partnerships & working groups' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <Badge variant="blue" className="mb-4">About CLEAR</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
              Coalition for Legal & Administrative Reform
            </h1>
            <p className="text-xl text-slate-400">
              We believe that legal complexity is not inevitable. Systems can be designed 
              to be accessible, adaptive, and equitable. Our mission is to build those systems 
              before the window for action closes.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                eyebrow="The Challenge"
                title="Three Intersecting Crises"
              />
              <div className="space-y-6">
                {[
                  {
                    title: 'Acceleration Crisis',
                    desc: 'AI is compressing what should be a 100-year economic transition into 15-20 years.',
                  },
                  {
                    title: 'Complexity Crisis',
                    desc: 'Centuries of accumulated legal and administrative burden make navigation impossible without expertise.',
                  },
                  {
                    title: 'Agency Crisis',
                    desc: 'Citizens are losing the ability to understand, participate in, and shape the systems that govern them.',
                  },
                ].map((crisis, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-red-400 font-semibold">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{crisis.title}</h3>
                      <p className="text-slate-400 text-sm">{crisis.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="p-8 bg-gradient-to-br from-blue-500/5 to-transparent">
              <h3 className="text-2xl font-semibold text-white mb-4">The Convergence</h3>
              <p className="text-slate-400 mb-6">
                Legal complexity and the post-labor transition are the <strong className="text-white">same problem</strong> viewed 
                from different angles. Complexity that was merely inefficient becomes 
                <strong className="text-white"> catastrophic</strong> when adaptation speed is critical.
              </p>
              <div className="p-4 bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-300 italic">
                  "Every level of both Pyramids—Prosperity and Power—is blocked by legal complexity. 
                  You can't build a post-labor economy on foundations citizens can't understand."
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Our Approach"
            title="Working at the Intersection"
            description="CLEAR occupies the critical intersection of legal reform and post-labor economics, using AI tools to both navigate and dismantle complexity."
            centered
          />
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6">
              <Target className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Diagnose</h3>
              <p className="text-slate-400 text-sm">
                Measure complexity systematically with the Complexity Index and 
                Economic Agency Dashboard to identify where intervention has the highest impact.
              </p>
            </Card>
            <Card className="p-6">
              <Lightbulb className="w-8 h-8 text-amber-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Demonstrate</h3>
              <p className="text-slate-400 text-sm">
                Build tools that prove accessibility is possible—PlainSpeak, ProcessMap, 
                and others that translate complexity into clarity.
              </p>
            </Card>
            <Card className="p-6">
              <Users className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Mobilize</h3>
              <p className="text-slate-400 text-sm">
                Build the coalition and political will to enact systemic reform through 
                model legislation, education, and collective action.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Guiding Principles"
            title="What We Believe"
            description="Our work is guided by principles drawn from the Post-Labor Economics framework and democratic theory."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, i) => (
              <div key={i} className="flex gap-4">
                <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-1">{principle.title}</h3>
                  <p className="text-sm text-slate-400">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-slate-300">
              Our framework draws heavily from David Shapiro's Post-Labor Economics work.{' '}
              <a 
                href="https://daveshap.substack.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                Learn more <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Organization Structure */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Organization"
            title="How We're Structured"
            description="CLEAR operates as a coalition with three complementary entities."
          />
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <Badge variant="blue" className="mb-4">501(c)(3)</Badge>
              <h3 className="text-lg font-semibold text-white mb-2">CLEAR Foundation</h3>
              <p className="text-slate-400 text-sm">
                Research, education, and tool development. Tax-deductible donations support 
                our core work.
              </p>
            </Card>
            <Card className="p-6">
              <Badge variant="amber" className="mb-4">501(c)(4)</Badge>
              <h3 className="text-lg font-semibold text-white mb-2">CLEAR Action</h3>
              <p className="text-slate-400 text-sm">
                Policy advocacy and legislative campaigns. Engages in lobbying and 
                electoral education.
              </p>
            </Card>
            <Card className="p-6">
              <Badge variant="green" className="mb-4">Tech Entity</Badge>
              <h3 className="text-lg font-semibold text-white mb-2">CLEAR Labs</h3>
              <p className="text-slate-400 text-sm">
                Open source technology development. Builds and maintains the tool ecosystem 
                with community contributors.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-serif font-semibold text-white mb-4">
            Ready to Get Involved?
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Join the coalition, contribute to tools, or use our resources. Every action moves us closer to accessible, adaptive systems.
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
      </section>
    </div>
  )
}

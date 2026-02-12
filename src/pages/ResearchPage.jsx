import { Link } from 'react-router-dom'
import { 
  BarChart3, TrendingUp, Database, FileSearch, ArrowRight, 
  Download, Clock, DollarSign, Users, BookOpen
} from 'lucide-react'
import { Card, Badge, SectionHeader, ProgressBar } from '../components/UI'

const complexityScores = [
  { domain: 'Criminal Justice', score: 96, trend: +2 },
  { domain: 'Tax System', score: 94, trend: +1 },
  { domain: 'Healthcare Admin', score: 91, trend: 0 },
  { domain: 'Immigration', score: 89, trend: -1 },
  { domain: 'Employment & Labor', score: 88, trend: +3 },
  { domain: 'Business Formation', score: 78, trend: -2 },
  { domain: 'Housing', score: 72, trend: 0 },
]

const agencyDimensions = [
  { name: 'Time Sovereignty', score: 62, description: 'Control over schedule and discretionary time' },
  { name: 'Financial Authority', score: 48, description: 'Meaningful economic choices without coercion' },
  { name: 'Knowledge Access', score: 55, description: 'Information for informed decisions' },
  { name: 'Community Power', score: 41, description: 'Collective ability to shape local economy' },
  { name: 'Mobility Freedom', score: 67, description: 'Ability to improve position through effort' },
  { name: 'Bargaining Power', score: 38, description: 'Negotiate fair terms in transactions' },
]

export default function ResearchPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <Badge variant="blue" className="mb-4">Research</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
              Measuring What Matters
            </h1>
            <p className="text-xl text-slate-400">
              Rigorous measurement is the foundation of effective reform. Our research 
              quantifies legal complexity and economic agency to identify where intervention 
              has the highest impact.
            </p>
          </div>
        </div>
      </section>

      {/* Complexity Index */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                eyebrow="Complexity Index"
                title="Quantifying Legal Burden"
                description="The CLEAR Complexity Index measures legal and administrative complexity across six dimensions, producing a 0-100 score for any domain or jurisdiction."
              />
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { icon: FileSearch, label: 'Length & Volume', weight: '15%' },
                  { icon: BookOpen, label: 'Readability', weight: '20%' },
                  { icon: Database, label: 'Navigability', weight: '15%' },
                  { icon: Users, label: 'Accessibility', weight: '15%' },
                  { icon: Clock, label: 'Process Burden', weight: '20%' },
                  { icon: TrendingUp, label: 'Consistency', weight: '15%' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
                    <item.icon className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-sm font-medium text-white">{item.label}</div>
                      <div className="text-xs text-slate-500">{item.weight}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Card className="p-6">
              <h3 className="font-semibold text-white mb-4">Domain Complexity Scores</h3>
              <div className="space-y-4">
                {complexityScores.map((item) => (
                  <div key={item.domain}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{item.domain}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs ${item.trend > 0 ? 'text-red-400' : item.trend < 0 ? 'text-green-400' : 'text-slate-500'}`}>
                          {item.trend > 0 ? '+' : ''}{item.trend}
                        </span>
                        <span className="text-sm font-mono text-white">{item.score}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.score > 90 ? 'bg-red-500' : 
                          item.score > 80 ? 'bg-amber-500' : 
                          item.score > 70 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500">
                Higher scores = greater complexity. Trend shows year-over-year change.
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Economic Agency Dashboard */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Economic Agency Dashboard"
            title="The Six Dimensions"
            description="Based on David Shapiro's Post-Labor Economics framework, we track six dimensions of economic agency across jurisdictions."
            centered
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencyDimensions.map((dim) => (
              <Card key={dim.name} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{dim.name}</h3>
                  <span className={`text-lg font-mono ${
                    dim.score >= 60 ? 'text-green-400' : 
                    dim.score >= 40 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {dim.score}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-4">{dim.description}</p>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      dim.score >= 60 ? 'bg-green-500' : 
                      dim.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-4">
              <BarChart3 className="w-8 h-8 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white mb-2">Overall Economic Agency Index: 52/100</h3>
                <p className="text-sm text-slate-400">
                  The national average indicates <strong className="text-white">constrained agency</strong>—significant 
                  barriers exist that prevent meaningful economic choice for many citizens. Bargaining power and 
                  community power are at crisis levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Resources"
            title="Research Downloads"
            description="Access our full methodology documentation and data."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Complexity Index Methodology', desc: 'Full scoring rubric and data collection protocol', format: 'PDF' },
              { title: 'Economic Agency Dashboard', desc: 'Measurement methodology for six dimensions', format: 'PDF' },
              { title: 'Annual Complexity Report', desc: 'Year-over-year analysis across all domains', format: 'PDF' },
              { title: 'State Rankings Dataset', desc: 'Complete complexity scores by state', format: 'CSV' },
              { title: 'API Documentation', desc: 'Access complexity data programmatically', format: 'API' },
            ].map((resource, i) => (
              <Card key={i} hover className="p-6 flex flex-col">
                <Badge variant="default" className="self-start mb-3">{resource.format}</Badge>
                <h3 className="font-semibold text-white mb-2">{resource.title}</h3>
                <p className="text-sm text-slate-400 mb-4 flex-1">{resource.desc}</p>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-serif font-semibold text-white mb-4">
            Contribute to Research
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            Join our research working group to help expand coverage, refine methodology, and analyze data.
          </p>
          <Link to="/coalition" className="btn-primary inline-flex items-center gap-2">
            Join Research Working Group <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

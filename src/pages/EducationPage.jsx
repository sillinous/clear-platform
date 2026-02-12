import { Link } from 'react-router-dom'
import { 
  BookOpen, Play, Users, Award, Clock, ArrowRight,
  CheckCircle, FileText, Video, Headphones
} from 'lucide-react'
import { Card, Badge, SectionHeader, ProgressBar } from '../components/UI'

const modules = [
  { 
    num: 1, 
    title: 'Understanding Legal Complexity', 
    duration: '2-3 hrs', 
    level: 'Foundational',
    topics: ['Types of complexity', 'Economic agency impact', 'When to get help', 'Finding resources']
  },
  { 
    num: 2, 
    title: 'Navigating Government Systems', 
    duration: '3-4 hrs', 
    level: 'Foundational',
    topics: ['Government structure', 'Common interactions', 'Timelines & deadlines', 'Appeals process']
  },
  { 
    num: 3, 
    title: 'Your Rights and Obligations', 
    duration: '3-4 hrs', 
    level: 'Foundational',
    topics: ['Types of rights', 'Common obligations', 'Key domains', 'Asserting rights']
  },
  { 
    num: 4, 
    title: 'The Changing Economy', 
    duration: '3-4 hrs', 
    level: 'Intermediate',
    topics: ['Technology history', 'AI capabilities', 'Acceleration thesis', 'Personal exposure']
  },
  { 
    num: 5, 
    title: 'Post-Labor Economics', 
    duration: '4-5 hrs', 
    level: 'Intermediate',
    topics: ['PLE framework', 'Economic agency', 'Pyramids', 'Policy interventions']
  },
  { 
    num: 6, 
    title: 'Building Your Economic Agency', 
    duration: '3-4 hrs', 
    level: 'Intermediate',
    topics: ['Six dimension strategies', 'Personal transition plan', 'Resource identification']
  },
  { 
    num: 7, 
    title: 'Civic Participation in AI Age', 
    duration: '3-4 hrs', 
    level: 'Intermediate',
    topics: ['Democracy & technology', 'Misinformation', 'Effective advocacy', 'AI governance']
  },
  { 
    num: 8, 
    title: 'Building Alternative Institutions', 
    duration: '4-5 hrs', 
    level: 'Advanced',
    topics: ['Cooperatives', 'DAOs', 'Community wealth', 'Practical implementation']
  },
]

export default function EducationPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <Badge variant="blue" className="mb-4">Education</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
              CLEAR Core Curriculum
            </h1>
            <p className="text-xl text-slate-400">
              Build the knowledge and skills to navigate today's complex systems while 
              preparing for tomorrow's economy. 8 modules, 25-35 hours total.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="container-wide py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '8', label: 'Modules' },
              { value: '25-35', label: 'Hours Total' },
              { value: '3', label: 'Delivery Formats' },
              { value: 'Free', label: 'Open Access' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Curriculum"
            title="Eight Comprehensive Modules"
            description="Progress from foundational civic literacy through advanced post-labor economics and institution building."
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module) => (
              <Card key={module.num} hover className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-semibold text-blue-400">{module.num}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{module.title}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {module.duration}
                      </span>
                      <Badge variant={module.level === 'Advanced' ? 'amber' : module.level === 'Intermediate' ? 'blue' : 'default'}>
                        {module.level}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, i) => (
                        <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Delivery"
            title="Multiple Learning Formats"
            description="Choose the format that works best for you or your organization."
            centered
          />
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Play className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Self-Paced Online</h3>
              <p className="text-slate-400 text-sm mb-4">
                Video lessons, interactive exercises, and assessments. Complete at your own pace.
              </p>
              <ul className="space-y-2">
                {['25-35 hours total', 'Discussion forums', 'Live Q&A sessions'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Facilitated Workshops</h3>
              <p className="text-slate-400 text-sm mb-4">
                In-person or virtual sessions led by trained facilitators. Ideal for organizations.
              </p>
              <ul className="space-y-2">
                {['8 sessions × 2-3 hours', 'Max 25 participants', 'Materials provided'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Headphones className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community Cohorts</h3>
              <p className="text-slate-400 text-sm mb-4">
                Self-organized peer learning groups with provided materials and study guides.
              </p>
              <ul className="space-y-2">
                {['8-15 people per cohort', 'Peer accountability', 'Network connections'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Resources"
            title="Supporting Materials"
            description="Everything you need to learn or teach the curriculum."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Video, title: 'Video Library', desc: 'Recorded lessons and explainers' },
              { icon: FileText, title: 'Workbooks', desc: 'Activities and exercises' },
              { icon: BookOpen, title: 'Facilitator Guides', desc: 'Complete teaching materials' },
              { icon: Award, title: 'Certificates', desc: 'Completion credentials' },
            ].map((resource, i) => (
              <Card key={i} hover className="p-6 text-center">
                <resource.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-1">{resource.title}</h3>
                <p className="text-sm text-slate-400">{resource.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-wide text-center">
          <h2 className="text-3xl font-serif font-semibold text-white mb-4">
            Start Learning Today
          </h2>
          <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
            The curriculum is free and open access. Begin your journey to civic literacy and economic agency.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary flex items-center gap-2">
              Enroll Now <ArrowRight className="w-4 h-4" />
            </button>
            <button className="btn-secondary">
              Download Curriculum
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

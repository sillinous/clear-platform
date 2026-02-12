import { Link } from 'react-router-dom'
import { useState } from 'react'
import { 
  Users, Building, Briefcase, GraduationCap, Heart, 
  ArrowRight, CheckCircle, Mail, MapPin
} from 'lucide-react'
import { Card, Badge, SectionHeader } from '../components/UI'

const workingGroups = [
  { name: 'Legal Research & Analysis', members: 23, focus: 'Complexity Index & research methodology' },
  { name: 'Technology Development', members: 18, focus: 'PlainSpeak & civic tools' },
  { name: 'State Policy Advocacy', members: 31, focus: 'Model legislation adaptation' },
  { name: 'Federal Policy Advocacy', members: 15, focus: 'National-level engagement' },
  { name: 'Post-Labor Economics', members: 27, focus: 'Transition frameworks & policy' },
  { name: 'Education & Outreach', members: 22, focus: 'Curriculum & communications' },
  { name: 'Democratic Innovation', members: 14, focus: 'Participatory mechanisms' },
]

const membershipTiers = [
  { name: 'Community', price: 'Free', benefits: ['Newsletter', 'Public resources', 'Forum access'] },
  { name: 'Supporter', price: '$25-99/yr', benefits: ['Voting rights', 'Working group eligibility', 'All Community benefits'] },
  { name: 'Sustainer', price: '$100-499/yr', benefits: ['All training access', 'Priority events', 'All Supporter benefits'] },
  { name: 'Champion', price: '$500+/yr', benefits: ['Steering Council eligibility', 'Strategy sessions', 'All Sustainer benefits'] },
]

export default function CoalitionPage() {
  const [formData, setFormData] = useState({ name: '', email: '', interest: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    alert('Thank you for your interest! We\'ll be in touch soon.')
  }

  return (
    <div>
      {/* Hero */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="max-w-3xl">
            <Badge variant="blue" className="mb-4">Join Us</Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-6">
              Join the CLEAR Coalition
            </h1>
            <p className="text-xl text-slate-400">
              Complexity harms everyone. The post-labor transition affects all workers. 
              Together, we can build systems that work for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="container-wide py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Individual Members' },
              { value: '50+', label: 'Partner Organizations' },
              { value: '7', label: 'Working Groups' },
              { value: '150+', label: 'Active Contributors' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Working Groups */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Working Groups"
            title="Find Your Focus"
            description="Seven specialized groups drive CLEAR's work. Join the one that matches your expertise and passion."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {workingGroups.map((group) => (
              <Card key={group.name} hover className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{group.name}</h3>
                  <Badge variant="default">{group.members} members</Badge>
                </div>
                <p className="text-sm text-slate-400">{group.focus}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="section-padding bg-slate-900/50">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Membership"
            title="Support the Movement"
            description="Choose the membership level that works for you."
            centered
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipTiers.map((tier, i) => (
              <Card 
                key={tier.name} 
                className={`p-6 ${i === 2 ? 'border-blue-500 bg-blue-500/5' : ''}`}
              >
                {i === 2 && <Badge variant="blue" className="mb-3">Popular</Badge>}
                <h3 className="text-lg font-semibold text-white mb-1">{tier.name}</h3>
                <div className="text-2xl font-semibold text-blue-400 mb-4">{tier.price}</div>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button className={`mt-6 w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  i === 2 
                    ? 'bg-blue-500 hover:bg-blue-400 text-white' 
                    : 'border border-slate-600 hover:border-slate-500 text-slate-300'
                }`}>
                  Join as {tier.name}
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Organizations */}
      <section className="section-padding">
        <div className="container-wide">
          <SectionHeader
            eyebrow="Partners"
            title="Organizational Partners"
            description="Organizations aligning with CLEAR's mission through partnership."
          />
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { type: 'Legal Organizations', icon: Briefcase, examples: 'Legal aid, bar associations, law schools' },
              { type: 'Labor Organizations', icon: Users, examples: 'Unions, worker centers, gig worker groups' },
              { type: 'Community Groups', icon: Heart, examples: 'Community orgs, faith groups, mutual aid' },
              { type: 'Policy Organizations', icon: Building, examples: 'Think tanks, advocacy groups, reform orgs' },
              { type: 'Tech Organizations', icon: Building, examples: 'Civic tech, open source projects' },
              { type: 'Academic Institutions', icon: GraduationCap, examples: 'Universities, research centers' },
            ].map((partner, i) => (
              <Card key={i} className="p-6">
                <partner.icon className="w-8 h-8 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">{partner.type}</h3>
                <p className="text-sm text-slate-400">{partner.examples}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="section-padding bg-gradient-to-b from-blue-500/5 to-transparent">
        <div className="container-wide">
          <div className="max-w-xl mx-auto">
            <Card className="p-8">
              <h2 className="text-2xl font-semibold text-white mb-2 text-center">Get Started</h2>
              <p className="text-slate-400 text-center mb-6">
                Sign up to receive updates and join the coalition.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Primary Interest</label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select a working group...</option>
                    {workingGroups.map((group) => (
                      <option key={group.name} value={group.name}>{group.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Join the Coalition <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              
              <p className="text-xs text-slate-500 text-center mt-4">
                By signing up, you agree to receive occasional updates from CLEAR. Unsubscribe anytime.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

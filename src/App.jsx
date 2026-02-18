import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

const C = {
  bg: '#0a0f1e', surface: '#111827', card: '#1a2235', border: '#1e3a5f',
  primary: '#3b82f6', accent: '#06b6d4', success: '#10b981', warn: '#f59e0b',
  danger: '#ef4444', muted: '#6b7280', text: '#e2e8f0', heading: '#f8fafc',
}

const css = `
  * { box-sizing:border-box;margin:0;padding:0; }
  body { background:${C.bg};color:${C.text};font-family:system-ui,sans-serif;min-height:100vh; }
  a { color:inherit;text-decoration:none; }
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.surface}}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .2s}
  .btn-primary{background:${C.primary};color:#fff}.btn-primary:hover{background:#2563eb;transform:translateY(-1px)}
  .btn-outline{background:transparent;color:${C.primary};border:1px solid ${C.primary}}.btn-outline:hover{background:${C.primary}22}
  .btn-success{background:${C.success};color:#fff}
  .card{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:24px}
  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700}
  .badge-blue{background:#1e40af33;color:#60a5fa}.badge-green{background:#064e3b33;color:#34d399}
  .badge-gold{background:#78350f33;color:#fbbf24}.badge-purple{background:#4c1d9533;color:#a78bfa}
  .g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
  .g3{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
  input,textarea,select{background:${C.surface};border:1px solid ${C.border};border-radius:8px;color:${C.text};padding:10px 14px;font-size:14px;width:100%;outline:none;transition:border .2s}
  input:focus,textarea:focus,select:focus{border-color:${C.primary}}
  label{display:block;font-size:13px;color:${C.muted};margin-bottom:6px;font-weight:500}
  .page{max-width:1200px;margin:0 auto;padding:40px 24px}
  .ph{margin-bottom:36px}.ph h1{font-size:32px;font-weight:800;color:${C.heading};margin-bottom:8px}
  .ph p{color:${C.muted};font-size:16px}
  .pt{font-size:11px;font-weight:700;letter-spacing:.08em;color:${C.accent};text-transform:uppercase;margin-bottom:6px}
  .tn{background:#0891b222;color:#22d3ee;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700}
  .toggle{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}
  .tknob{position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;transition:left .2s}
  .row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid ${C.border}}
`

const NAVGROUPS = [
  { label:'Core', items:[
    { label:'Home', path:'/', icon:'🏠' },
    { label:'Process Map', path:'/processmap', icon:'🗺️' },
    { label:'Knowledge Base', path:'/knowledge', icon:'📚' },
  ]},
  { label:'Tools', items:[
    { label:'Documents', path:'/documents', icon:'📄' },
    { label:'Notifications', path:'/notifications', icon:'🔔' },
    { label:'Achievements', path:'/achievements', icon:'⭐' },
  ]},
  { label:'AI & Voice', badge:'NEW', items:[
    { label:'AI Assistant', path:'/ai-assistant', icon:'🤖', tag:'new' },
    { label:'Voice Interface', path:'/voice', icon:'🎤', tag:'new' },
    { label:'Tax Estimator', path:'/tax-estimator', icon:'🧮', tag:'new' },
    { label:'Document OCR', path:'/ocr', icon:'📷', tag:'new' },
  ]},
  { label:'Platform', badge:'NEW', items:[
    { label:'SMS Alerts', path:'/sms-alerts', icon:'💬', tag:'new' },
    { label:'Blockchain', path:'/blockchain', icon:'🔗', tag:'new' },
    { label:'Social Login', path:'/social-login', icon:'🔐', tag:'new' },
    { label:'Referral', path:'/referral', icon:'🎁', tag:'new' },
    { label:'Premium', path:'/premium', icon:'👑', tag:'new' },
    { label:'Reports', path:'/annual-reports', icon:'📊', tag:'new' },
  ]},
]

function Layout({ children }) {
  const [open, setOpen] = useState(true)
  const loc = useLocation()
  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <aside style={{ width:open?240:52, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', transition:'width .2s', overflow:'hidden', position:'sticky', top:0, height:'100vh', flexShrink:0 }}>
        <div style={{ padding:'14px 10px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
          {open && <Link to="/" style={{ fontWeight:800, fontSize:18, color:C.primary, flex:1 }}>CLEAR</Link>}
          <button onClick={()=>setOpen(v=>!v)} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:18, padding:2 }}>{open?'◀':'▶'}</button>
        </div>
        <nav style={{ flex:1, padding:'10px 6px', overflowY:'auto' }}>
          {NAVGROUPS.map(g=>(
            <div key={g.label} style={{ marginBottom:16 }}>
              {open && <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 6px', marginBottom:4 }}>
                <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', color:C.muted, textTransform:'uppercase' }}>{g.label}</span>
                {g.badge && <span className="tn">{g.badge}</span>}
              </div>}
              {g.items.map(item=>{
                const active = loc.pathname===item.path
                return (
                  <Link key={item.path} to={item.path} title={item.label}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 8px', borderRadius:8, marginBottom:2, color:active?C.primary:C.muted, background:active?`${C.primary}15`:'transparent', transition:'all .15s', fontSize:13, fontWeight:active?600:400, whiteSpace:'nowrap' }}>
                    <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
                    {open && <><span style={{ flex:1 }}>{item.label}</span>{item.tag&&<span className="tn">NEW</span>}</>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </aside>
      <main style={{ flex:1, overflowY:'auto' }}>{children}</main>
    </div>
  )
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function Home() {
  const phases = [
    { n:'1-5', t:'Core Navigation', d:'Process maps, search, plain-language guides', s:'live' },
    { n:'6-10', t:'Community & APIs', d:'Forums, government API integrations', s:'live' },
    { n:'11-15', t:'Intelligence', d:'ML recommendations, regional deployment', s:'live' },
    { n:'16-20', t:'UX Enhancements', d:'Doc generator, notifications, achievements', s:'live' },
    { n:'21-25', t:'AI & Voice', d:'CLARA chatbot, voice UI, SMS, OCR, tax tools', s:'new' },
    { n:'26-30', t:'Platform Maturity', d:'Blockchain, social auth, referrals, premium', s:'new' },
  ]
  return (
    <div className="page">
      <div className="ph">
        <div className="pt">CLEAR Platform v3.0 — All 30 Phases Complete</div>
        <h1>Making Government Simple</h1>
        <p>Your complete guide to navigating government processes, powered by AI.</p>
        <div style={{ marginTop:20, display:'flex', gap:12, flexWrap:'wrap' }}>
          <Link to="/processmap"><button className="btn btn-primary">🗺️ Explore Processes</button></Link>
          <Link to="/ai-assistant"><button className="btn btn-outline">🤖 Ask AI Assistant</button></Link>
          <Link to="/premium"><button className="btn btn-outline">👑 See Plans</button></Link>
        </div>
      </div>
      <div className="g3" style={{ marginBottom:40 }}>
        {[['500+','Government Processes','🗺️'],['33','Live Tools','⚡'],['12,400','Active Users','👥'],['$4.2M','Saved for Users','💰']].map(([v,l,i])=>(
          <div key={l} className="card" style={{ textAlign:'center' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>{i}</div>
            <div style={{ fontSize:32, fontWeight:800, color:C.heading }}>{v}</div>
            <div style={{ color:C.muted, fontSize:14 }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <h2 style={{ color:C.heading, marginBottom:20, fontSize:20 }}>Platform Phases</h2>
        <div style={{ display:'grid', gap:10 }}>
          {phases.map(p=>(
            <div key={p.n} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', background:C.surface, borderRadius:8, border:`1px solid ${C.border}` }}>
              <div style={{ width:44, height:44, borderRadius:10, background:p.s==='new'?`${C.accent}22`:`${C.success}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontSize:11, fontWeight:800, color:p.s==='new'?C.accent:C.success }}>{p.n}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, color:C.heading, fontSize:15 }}>{p.t}</div>
                <div style={{ color:C.muted, fontSize:13 }}>{p.d}</div>
              </div>
              <span className={`badge ${p.s==='new'?'badge-blue':'badge-green'}`}>
                {p.s==='new'?'⚡ New!':'✓ Live'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── PROCESS MAP ───────────────────────────────────────────────────────────────
function ProcessMap() {
  const cats = [
    { name:'Business', color:C.primary, count:48, items:['LLC Formation','Business License','EIN Application','Sales Tax Permit','DBA Registration'] },
    { name:'Benefits', color:C.success, count:62, items:['SNAP','Medicaid','Unemployment','SSI','TANF'] },
    { name:'Housing', color:C.warn, count:35, items:['Section 8','HUD Programs','USDA Rural','LIHTC','HOME Program'] },
    { name:'Immigration', color:'#8b5cf6', count:41, items:['Green Card','Citizenship','Work Visa','DACA','Asylum'] },
    { name:'Veterans', color:'#06b6d4', count:29, items:['VA Healthcare','GI Bill','Disability Comp','Home Loan','Pension'] },
    { name:'Education', color:'#f59e0b', count:38, items:['FAFSA','Pell Grant','Student Loans','Work Study','Public Service'] },
  ]
  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 1-2</div><h1>Process Map</h1><p>Navigate 500+ government processes by category.</p></div>
      <div className="g2">
        {cats.map(c=>(
          <div key={c.name} className="card">
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${c.color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:12, height:12, borderRadius:'50%', background:c.color }} />
              </div>
              <div><div style={{ fontWeight:700, color:C.heading }}>{c.name}</div><div style={{ color:C.muted, fontSize:12 }}>{c.count} processes</div></div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {c.items.map(item=><span key={item} style={{ padding:'4px 10px', background:C.surface, borderRadius:20, fontSize:12, color:C.text, border:`1px solid ${C.border}`, cursor:'pointer' }}>{item}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── KNOWLEDGE ─────────────────────────────────────────────────────────────────

// ── KNOWLEDGE BASE DATA ───────────────────────────────────────────────────────
const KB_ARTICLES = [
  // ── Benefits ─────────────────────────────────────────────────────────────
  { id:1, t:'How to Apply for SNAP Benefits', c:'Benefits', icon:'🍎', time:'6 min', v:4200, rating:4.8, reviews:312, diff:'Easy', updated:'Feb 2026',
    summary:'Step-by-step guide to applying for SNAP food assistance, including eligibility requirements, documentation needed, and what to expect after you apply.',
    steps:['Check eligibility — gross income must be at or below 130% of the federal poverty level (~$37,777/yr for a family of 4 in 2024).','Gather required documents: government-issued ID, proof of income (pay stubs, tax returns), proof of residency (utility bill or lease), and Social Security numbers for all household members.','Apply online at benefits.gov or your state DHS portal, or visit your local SNAP office in person.','Complete a phone or in-person interview with a caseworker — typically scheduled within 7-10 days of application.','Receive your EBT card by mail within 30 days if approved. Benefits are loaded monthly on a set date.'],
    tips:['You can apply even if you are employed — many working families qualify.','Benefits are backdated to your application date, not your approval date.','If you are in a crisis, ask about expedited processing — you may receive benefits within 7 days.','Renew your benefits 30 days before your certification period ends to avoid a gap.'],
    faq:[{q:'What if I am denied?',a:'You have the right to request a fair hearing within 90 days of the denial notice. Contact your state DHS for the appeals process.'},{q:'Can undocumented immigrants apply?',a:'Undocumented immigrants are not eligible for SNAP, but U.S. citizen children in mixed-status households can apply on their own behalf.'},{q:'How much will I receive?',a:'The maximum benefit for a family of 4 is $975/month (2024). Your actual amount depends on income and household size.'}],
    related:[2,3,5], tags:['food assistance','EBT','nutrition','low income'] },

  { id:2, t:'Understanding Medicaid vs. Medicare', c:'Benefits', icon:'🏥', time:'8 min', v:3600, rating:4.7, reviews:228, diff:'Medium', updated:'Jan 2026',
    summary:'A clear breakdown of the differences between Medicaid and Medicare, who qualifies for each, and how to enroll.',
    steps:['Determine which program applies to you — Medicare is age/disability based (65+), Medicaid is income based (any age).','For Medicare: you are automatically enrolled at 65 if receiving Social Security. Otherwise, sign up at ssa.gov during your Initial Enrollment Period (7 months around your 65th birthday).','For Medicaid: apply through your state health department or at healthcare.gov during open enrollment.','If you qualify for both (dual eligible), you receive coordinated coverage from both programs.','Review your coverage annually during open enrollment (Oct 15–Dec 7 for Medicare).'],
    tips:['Missing your Medicare enrollment window results in permanent late enrollment penalties.','Many states have expanded Medicaid under the ACA — check your state\'s income limits.','You can enroll in Medicaid year-round, unlike ACA marketplace plans.'],
    faq:[{q:'What is the income limit for Medicaid?',a:'In most expansion states, the limit is 138% of the federal poverty level (~$20,120/yr for a single adult in 2024).'},{q:'Does Medicare cover dental?',a:'Traditional Medicare does not cover most dental. Consider a Medicare Advantage plan that includes dental, or a standalone dental plan.'}],
    related:[1,3,18], tags:['health insurance','medical','enrollment','Medicaid','Medicare'] },

  { id:3, t:'Applying for Unemployment Insurance', c:'Benefits', icon:'💼', time:'5 min', v:2700, rating:4.6, reviews:189, diff:'Easy', updated:'Feb 2026',
    summary:'How to file for unemployment benefits, weekly certification requirements, and what to do if your claim is denied.',
    steps:['File your initial claim as soon as you become unemployed — benefits are not paid for weeks before you apply.','Apply online at your state\'s unemployment portal (Illinois: ides.illinois.gov).','Provide your employment history for the past 18 months, reason for separation, and banking information for direct deposit.','Receive a determination letter within 2-4 weeks confirming eligibility and weekly benefit amount.','Certify weekly by answering questions about your job search activities and any earnings.'],
    tips:['You must be actively seeking work each week — keep records of at least 3 job contacts per week.','Report all part-time or freelance income — working while on unemployment is allowed but reduces your benefit.','If you were laid off due to a company closure, you may qualify for additional Trade Adjustment Assistance.'],
    faq:[{q:'How long can I receive benefits?',a:'Most states provide 26 weeks. Extended benefits may be available during high unemployment periods.'},{q:'What if my employer disputes my claim?',a:'Both you and your employer can present evidence. You have the right to appeal any determination within the deadline stated in your letter.'}],
    related:[1,2,21], tags:['unemployment','job loss','weekly certification'] },

  { id:4, t:'How to Get SSI (Supplemental Security Income)', c:'Benefits', icon:'🛡️', time:'9 min', v:2100, rating:4.5, reviews:143, diff:'Hard', updated:'Dec 2025',
    summary:'Complete guide to SSI eligibility, the application process, medical documentation requirements, and common reasons for denial.',
    steps:['Confirm basic eligibility: must be 65+, blind, or have a qualifying disability; income and resources must be below SSA limits ($2,000 individual / $3,000 couple).','Gather medical evidence: doctor records, test results, treatment history, and contact information for all healthcare providers.','Apply online at ssa.gov, by phone at 1-800-772-1213, or in person at your local Social Security office.','Complete the Adult Disability Report detailing your conditions and how they affect your ability to work.','Attend any consultative exams scheduled by SSA — these are often required and free to you.','Wait for a decision — initial decisions take 3-6 months on average.'],
    tips:['Apply as early as possible — if approved, benefits are only paid from the application date.','Keep copies of everything you submit.','Consider hiring a disability advocate or attorney — they work on contingency and cost nothing upfront.','If denied, appeal immediately. Over 50% of appeals are successful at the hearing level.'],
    faq:[{q:'What is the 2024 SSI payment amount?',a:'The maximum federal SSI benefit is $943/month for an individual and $1,415 for a couple. Your state may add a supplement.'},{q:'Can I work while receiving SSI?',a:'Yes, through SSA\'s Ticket to Work program and work incentives. Earned income reduces but does not eliminate your benefit.'}],
    related:[32,33,3], tags:['disability','SSI','Social Security','income'] },

  { id:5, t:'TANF: Temporary Assistance for Needy Families', c:'Benefits', icon:'👨‍👩‍👧', time:'7 min', v:1800, rating:4.4, reviews:97, diff:'Medium', updated:'Nov 2025',
    summary:'How TANF works, eligibility requirements, what it covers, and time limits you need to know.',
    steps:['Contact your state or county TANF office to start your application.','Provide proof of identity, residency, income, and the ages of children in your household.','Complete a work activity requirement — most states require participation in job training, education, or employment.','Receive an eligibility determination within 30 days.','Benefits are provided on an EBT card and can be used for basic necessities.'],
    tips:['TANF has a 60-month federal lifetime limit — use benefits strategically.','Many states offer diversion payments as a one-time alternative to ongoing TANF enrollment.','Childcare and transportation assistance are often available alongside TANF.'],
    faq:[{q:'Who qualifies for TANF?',a:'Families with children under 18 with limited income and resources. Parents or caregivers must meet work requirements.'}],
    related:[1,29,31], tags:['cash assistance','families','children','welfare'] },

  // ── Business ──────────────────────────────────────────────────────────────
  { id:6, t:'Starting an LLC: Complete State-by-State Guide', c:'Business', icon:'🏢', time:'10 min', v:3800, rating:4.9, reviews:445, diff:'Medium', updated:'Feb 2026',
    summary:'Everything you need to form an LLC in any state — name requirements, filing fees, registered agent rules, and ongoing compliance.',
    steps:['Choose a unique business name that includes "LLC" — search your state\'s business name database for conflicts.','Select a registered agent with a physical address in your state to receive legal documents.','File Articles of Organization with your state\'s Secretary of State — fees range from $50 (Kentucky) to $500 (Massachusetts).','Get an EIN (Employer Identification Number) free at irs.gov — takes 5 minutes online.','Open a dedicated business bank account to maintain liability protection.','Create an Operating Agreement — essential for multi-member LLCs and good practice for single-member.','Register for state and local taxes as applicable.'],
    tips:['File online whenever possible — faster and cheaper than mail.','Consider electing S-Corp tax status once revenue exceeds ~$80K to reduce self-employment taxes.','Maintain a clear separation between personal and business finances at all times.','Calendar your annual report deadline — most states charge late fees of $50-$200.'],
    faq:[{q:'How much does it cost to form an LLC?',a:'State filing fees range from $50-$500. Annual report fees are typically $25-$250. Factor in ~$100-300/yr for a registered agent if you use one.'},{q:'Do I need a lawyer?',a:'No. Most people file successfully on their own. An attorney is worth consulting for complex multi-member LLCs or businesses with significant assets.'},{q:'Illinois specific?',a:'Illinois LLC filing fee is $150. Annual Report due before the first day of your anniversary month each year. Fee: $75.'}],
    related:[7,8,35], tags:['LLC','small business','formation','self-employment'] },

  { id:7, t:'Getting Your EIN: IRS Employer Identification Number', c:'Business', icon:'🔢', time:'3 min', v:2900, rating:4.9, reviews:378, diff:'Easy', updated:'Jan 2026',
    summary:'How to get your EIN from the IRS in minutes — completely free, no waiting, no middlemen.',
    steps:['Go to irs.gov/ein and click "Apply Online Now" — available Mon-Fri 7am-10pm ET.','Select your entity type (sole proprietor, LLC, corporation, partnership, etc.).','Answer questions about your business structure and ownership.','Receive your EIN immediately on screen — print or save the confirmation.','Use your EIN for bank accounts, tax filing, hiring employees, and business licenses.'],
    tips:['The IRS EIN application is always free — never pay a third-party service.','You can only apply for one EIN per responsible party per day online.','If you lost your EIN, call the IRS Business & Specialty Tax Line: 800-829-4933.'],
    faq:[{q:'Do sole proprietors need an EIN?',a:'Not always, but recommended to avoid using your SSN on business documents. Required if you have employees or file certain tax forms.'},{q:'Can I get an EIN without a Social Security number?',a:'Yes. Foreign nationals and ITIN holders can apply by mail using Form SS-4.'}],
    related:[6,8,35], tags:['EIN','IRS','tax ID','employer'] },

  { id:8, t:'Business Licenses & Permits: What You Actually Need', c:'Business', icon:'📋', time:'8 min', v:2200, rating:4.7, reviews:201, diff:'Medium', updated:'Jan 2026',
    summary:'A practical guide to figuring out exactly which licenses and permits your business needs at the federal, state, and local level.',
    steps:['Identify your industry — regulated industries (food, healthcare, childcare, construction, finance) have more requirements.','Check federal requirements at SBA.gov/business-guide/launch-your-business/apply-licenses-permits.','Register with your state — search "[your state] business license" for the Secretary of State portal.','Contact your county clerk and city hall for local business licenses (often $25-$150/yr).','Industry-specific permits: food handler\'s permit (health dept), contractor\'s license (state board), professional license (if applicable).','Zoning approval may be needed for a physical location — check with your local planning department.'],
    tips:['Most online-only businesses only need a home occupation permit and state business registration.','The SBA\'s License & Permit tool at sba.gov helps identify what you need by business type and state.','Renew licenses on time — operating without a required license can result in fines or forced closure.'],
    faq:[{q:'What\'s the difference between a business license and a permit?',a:'A business license is a general authorization to operate. A permit is specific to an activity (food prep, building, signage). You may need both.'}],
    related:[6,7,35], tags:['license','permit','compliance','regulations'] },

  { id:35, t:'Sole Proprietorship vs. LLC vs. S-Corp: Which Structure?', c:'Business', icon:'⚖️', time:'9 min', v:2800, rating:4.8, reviews:312, diff:'Medium', updated:'Feb 2026',
    summary:'A practical breakdown of the most common business structures — liability protection, tax implications, and which is best for your situation.',
    steps:['Sole Proprietorship: the default for one-person businesses. No setup required, but zero liability protection — personal assets are at risk.','LLC: separates personal and business liability. Single-member LLCs are taxed as sole proprietorships by default. Low cost to form ($50-$500).','S-Corporation: a tax election available to LLCs. Allows you to split income between salary and distributions, avoiding self-employment tax on distributions. Best when revenue exceeds ~$80K/year.','C-Corporation: better for venture-funded companies needing unlimited shareholders or employee stock options.','Decide based on: revenue level, liability exposure, growth plans, and state-specific franchise taxes.'],
    tips:['You can change your tax classification later — start as LLC, elect S-corp when revenue justifies it by filing Form 2553.','An S-corp must pay a "reasonable salary" comparable to market rates or the IRS will recharacterize distributions as wages.','Most freelancers and small service businesses are well-served by a single-member LLC.'],
    faq:[{q:'Do I need an LLC to freelance?',a:'No, but it provides liability protection. Many freelancers start as sole proprietors and form an LLC as revenue grows.'},{q:'What state should I form my LLC in?',a:'For most small businesses, form in your home state. Delaware or Wyoming only makes sense for larger companies or specific investor reasons.'}],
    related:[6,7,36], tags:['LLC','S-corp','sole proprietor','business structure','taxes'] },

  { id:36, t:'SBA Loans: Types, Requirements & How to Apply', c:'Business', icon:'💵', time:'10 min', v:2200, rating:4.7, reviews:234, diff:'Hard', updated:'Jan 2026',
    summary:'The most common SBA loan programs — 7(a), 504, and Microloans — how to qualify, what they fund, and where to apply.',
    steps:['Understand the main programs: SBA 7(a) up to $5M for general use, SBA 504 up to $5.5M for real estate/equipment, SBA Microloan up to $50K for startups.','Check basic eligibility: for-profit U.S. business, owner has invested equity, reasonable credit, demonstrated need.','Prepare your package: 2 years personal and business tax returns, P&L statements, balance sheet, cash flow projections, business plan, and collateral list.','Find an SBA-approved lender at sba.gov/funding-programs/loans. CDFIs are often more accessible for businesses with limited credit history.','Submit and respond promptly to requests for documentation. Approval typically takes 30-90 days.','SBA Microloans through nonprofit intermediaries have lighter requirements and can approve in 2-4 weeks.'],
    tips:['SBA loans are guaranteed by the SBA but issued through banks — you still apply through a lender.','Most SBA lenders require a personal credit score of 650+.','SCORE (score.org) provides free mentoring and help preparing your loan application.'],
    faq:[{q:'What can SBA loans be used for?',a:'Working capital, equipment, inventory, real estate, business acquisition, and refinancing. Cannot be used for passive investments.'},{q:'What collateral is required?',a:'Lenders must take available collateral but cannot decline solely because of insufficient collateral. Personal guarantees are almost always required.'}],
    related:[6,7,35], tags:['SBA','business loan','small business','financing','startup'] },

  // ── Immigration ───────────────────────────────────────────────────────────
  { id:9, t:'Green Card: Paths to Permanent Residency', c:'Immigration', icon:'🌎', time:'12 min', v:2900, rating:4.8, reviews:334, diff:'Hard', updated:'Feb 2026',
    summary:'An overview of the main pathways to a U.S. green card — family, employment, diversity lottery, and humanitarian — with realistic timelines.',
    steps:['Determine your pathway: family sponsorship, employer sponsorship, diversity visa lottery, refugee/asylee status, or special categories (VAWA, special immigrants).','Family-based: U.S. citizen or LPR sponsor files I-130 (Petition for Alien Relative).','Employment-based: employer files PERM labor certification, then I-140 petition.','Check visa bulletin at travel.state.gov monthly — your priority date must be current before filing for adjustment of status.','File I-485 (Application to Register Permanent Residence) when your priority date is current.','Attend biometrics appointment and USCIS interview.','Receive green card by mail — typically valid for 10 years and renewable.'],
    tips:['Consult an immigration attorney before filing — mistakes can cause years of delay.','Keep copies of every document submitted to USCIS.','Maintain lawful status throughout the process — unauthorized presence creates bars to admission.','Track your case at egov.uscis.gov using your receipt number.'],
    faq:[{q:'How long does a green card take?',a:'Immediate relatives of U.S. citizens: 12-24 months. Employment-based from India or China: decades due to backlogs.'},{q:'Can I travel while pending?',a:'With Advance Parole (I-131) approved, yes. Traveling without it may abandon your case.'}],
    related:[10,11], tags:['green card','permanent residency','USCIS','immigration'] },

  { id:10, t:'DACA: Deferred Action for Childhood Arrivals', c:'Immigration', icon:'🎓', time:'9 min', v:2400, rating:4.8, reviews:267, diff:'Medium', updated:'Feb 2026',
    summary:'Current DACA status, eligibility requirements, how to apply or renew, and what protections it provides.',
    steps:['Confirm eligibility: came to U.S. before age 16, continuously resided since June 15, 2007, were under 31 on June 15, 2012, and have no disqualifying criminal record.','Gather evidence of continuous U.S. residence (school records, medical records, utility bills, employment records).','Complete Form I-821D (DACA request) and Form I-765 (Employment Authorization).','Pay the $495 filing fee (waivers not available for DACA).','Submit to the USCIS lockbox facility for your state.','Receive work permit and 2-year deferred action if approved.'],
    tips:['DACA does not provide a path to citizenship — consult an attorney about other options.','Renew early — USCIS recommends submitting 150-120 days before expiration.','Do not travel outside the U.S. without advance parole.','Legal aid organizations offer free or reduced-cost DACA assistance.'],
    faq:[{q:'Is DACA still accepting new applications?',a:'As of 2024, federal courts have limited DACA to renewals only for existing recipients. Check uscis.gov for the latest status.'},{q:'Does DACA protect family members?',a:'No. DACA only protects the individual applicant.'}],
    related:[9,11], tags:['DACA','dreamers','work permit','immigration'] },

  { id:11, t:'Applying for U.S. Citizenship (Naturalization)', c:'Immigration', icon:'🇺🇸', time:'11 min', v:2100, rating:4.9, reviews:289, diff:'Hard', updated:'Jan 2026',
    summary:'The complete naturalization process from eligibility check through oath ceremony, including the civics test and interview.',
    steps:['Meet eligibility: be an LPR for 5 years (3 if married to U.S. citizen), be 18+, demonstrate continuous residence and physical presence.','File Form N-400 online at uscis.gov — fee is $760 ($710 online).','Attend biometrics appointment for fingerprints and photo.','Receive interview notice — typically 12-18 months after filing.','Study for and pass the civics test (100 questions, must answer 6 of 10 correctly) and English test.','Attend naturalization ceremony and take the Oath of Allegiance.','Apply for a U.S. passport — you\'re now a citizen!'],
    tips:['USCIS offers free study materials and a practice test at uscis.gov/citizenship.','If you have a disability preventing the English or civics test, request a medical exception with Form N-648.','Brief trips outside the U.S. are okay but extended stays may restart your continuous residence clock.'],
    faq:[{q:'Can I keep my current citizenship?',a:'The U.S. generally allows dual citizenship, but your original country may not. Check that country\'s laws before naturalizing.'},{q:'What is the English test?',a:'You must demonstrate the ability to read, write, and speak basic English. The interviewing officer assesses this throughout your interview.'}],
    related:[9,10], tags:['citizenship','naturalization','N-400','oath'] },

  // ── Veterans ──────────────────────────────────────────────────────────────
  { id:12, t:'VA Healthcare: How to Enroll and What\'s Covered', c:'Veterans', icon:'🏥', time:'7 min', v:2400, rating:4.8, reviews:198, diff:'Easy', updated:'Feb 2026',
    summary:'How to enroll in VA healthcare, understand your priority group, and get the most out of your benefits.',
    steps:['Confirm eligibility: served on active duty (not for training only) and received a discharge other than dishonorable.','Apply online at va.gov/health-care/apply, call 877-222-8387, or visit your nearest VA medical center.','Provide DD-214 — request it at vetrecs.archives.gov if needed.','Receive your priority group assignment (1-8 based on service-connected disability, income, and other factors).','Schedule your first appointment — primary care, mental health, and specialty care are all available.','Explore additional programs: dental, vision, caregiver support, and community care options.'],
    tips:['Veterans with service-connected disabilities rated 50%+ receive free VA healthcare.','The PACT Act (2022) expanded eligibility for veterans exposed to burn pits — re-apply if previously denied.','VA telehealth appointments available via the VA Video Connect app.','Veterans Crisis Line: call 988, press 1.'],
    faq:[{q:'Does VA cover my family members?',a:'VA healthcare covers the veteran, not dependents. Family members may qualify for CHAMPVA if the veteran is 100% permanently disabled.'},{q:'What if I need care outside the VA?',a:'The Community Care program allows private providers if VA cannot provide timely or local care. Prior authorization may be required.'}],
    related:[13,37,38], tags:['VA','veterans','healthcare','military'] },

  { id:13, t:'GI Bill: Using Your Education Benefits', c:'Veterans', icon:'📖', time:'8 min', v:1900, rating:4.7, reviews:156, diff:'Medium', updated:'Jan 2026',
    summary:'Post-9/11 GI Bill (Ch. 33) and Montgomery GI Bill (Ch. 30) explained — how to apply, transfer to dependents, and maximize your benefits.',
    steps:['Determine which GI Bill you have: Post-9/11 (most veterans since 2009) or Montgomery (requires monthly contribution during service).','Apply at va.gov/education/apply — receive a Certificate of Eligibility (COE) in the mail.','Choose an approved school — search the GI Bill Comparison Tool at va.gov/gi-bill-comparison-tool.','Submit your COE to the school\'s veterans certifying official.','Enroll in classes — VA pays tuition directly to the school, housing allowance to you, and provides a book stipend.','Certify your enrollment each semester through your school.'],
    tips:['Post-9/11 GI Bill pays 100% of in-state public tuition — private schools may have a cap.','The housing allowance is based on the BAH rate for the school\'s ZIP code — urban campuses pay more.','You have 36 months of GI Bill benefits total — plan strategically.','Transfer unused benefits to a spouse or child while still on active duty.'],
    faq:[{q:'Can I use GI Bill for online programs?',a:'Yes, but the housing allowance is reduced to half the national average BAH rate for fully online enrollment.'},{q:'What if my school closes?',a:'Veterans may be eligible for restoration of benefits. Contact VA at 888-442-4551.'}],
    related:[12,37,38], tags:['GI Bill','education','military','college'] },

  { id:37, t:'VA Disability Claims: How to File and Get the Right Rating', c:'Veterans', icon:'🎖️', time:'12 min', v:2800, rating:4.8, reviews:289, diff:'Hard', updated:'Feb 2026',
    summary:'A complete guide to filing a VA disability claim — nexus letters, C&P exams, rating criteria, and appeals.',
    steps:['Obtain your military service records (DD-214 and service treatment records) at archives.gov/veterans.','Gather medical evidence connecting your current disability to military service (nexus): current diagnosis + in-service event + link.','File your claim at va.gov/disability/file-disability-claim-form-21-526ez or at a regional office. File ASAP — your effective date is your application date.','Attend your Compensation and Pension (C&P) exam — never miss it, and document your worst symptoms.','Review your Rating Decision letter. VA rates disabilities in 10% increments using the Combined Ratings Table.','If you disagree, appeal within 1 year via Supplemental Claim, Higher-Level Review, or Board of Veterans\' Appeals.'],
    tips:['File for every service-connected condition — even minor ones can combine to increase your overall rating.','VSOs like DAV, VFW, and American Legion provide free claims assistance.','A 100% rating or TDIU qualifies you for significant additional benefits including free healthcare and property tax exemptions.','A Buddy Statement from fellow service members can help establish in-service events with no medical records.'],
    faq:[{q:'How long does the claims process take?',a:'Initial claims average 103 days. Appeals can take 1-5 years. File supplemental claims for faster resolution when you have new evidence.'},{q:'What is TDIU?',a:'Total Disability Individual Unemployability — if your combined rating is 60%+ and you can\'t maintain gainful employment, you may qualify for 100% compensation.'}],
    related:[12,13,38], tags:['VA','disability','compensation','C&P exam','rating','veterans'] },

  { id:38, t:'VA Caregiver Support Program', c:'Veterans', icon:'🤝', time:'6 min', v:1400, rating:4.7, reviews:112, diff:'Medium', updated:'Dec 2025',
    summary:'Financial and health benefits for family members caring for seriously injured post-9/11 veterans.',
    steps:['Determine program: PCAFC for post-9/11 veterans with serious injuries; PGCSS for all era veterans.','For PCAFC: veteran must have a serious injury incurred on or after 9/11/2001 and need personal care services.','Apply at va.gov/family-member-benefits/caregiver-programs or call 1-855-260-3274.','If approved, primary caregiver receives: monthly stipend, CHAMPVA health insurance (if not otherwise covered), mental health services, and respite care.','Access peer support mentoring, skills training, and local Caregiver Support Coordinators at VA medical centers.'],
    tips:['Both veteran and caregiver must be enrolled in VA healthcare to participate in PCAFC.','Respite care (temporary relief) is available up to 30 days per year.','Caregiver stipends average $1,200-$2,000/month for full-time caregivers.'],
    faq:[{q:'Can I work while receiving the PCAFC stipend?',a:'Yes. There is no employment restriction on caregivers receiving the stipend.'},{q:'What if the veteran doesn\'t want to apply?',a:'The veteran must participate — both parties sign the application.'}],
    related:[12,13,37], tags:['caregiver','veterans','VA','family','PCAFC','stipend'] },

  // ── Housing ───────────────────────────────────────────────────────────────
  { id:14, t:'Section 8 Housing Choice Voucher Program', c:'Housing', icon:'🏠', time:'9 min', v:2600, rating:4.6, reviews:221, diff:'Hard', updated:'Jan 2026',
    summary:'How the Section 8 voucher program works, how to get on a waiting list, tenant rights, and landlord requirements.',
    steps:['Find your local Public Housing Authority (PHA) at hud.gov/program_offices/public_indian_housing/programs/hcv/phasearch.','Apply when the waiting list is open — many PHAs only open lists periodically.','Wait on the list — average wait times range from 1 to 10+ years depending on location.','When your name is called, attend a briefing and receive your voucher.','Find a private landlord willing to accept Section 8 — the unit must pass a HUD inspection.','Sign a lease and a Housing Assistance Payment (HAP) contract — HUD pays a portion directly to your landlord.','Recertify your income and family composition annually.'],
    tips:['Apply to multiple PHAs simultaneously — each maintains its own list.','Some areas have Project-Based vouchers attached to specific units, with shorter wait times.','Voucher holders have the same rights as any tenant under state landlord-tenant law.'],
    faq:[{q:'How much do I pay vs. the voucher?',a:'Typically 30% of your adjusted monthly income. If rent is higher than HUD\'s payment standard, you pay the difference.'},{q:'Can I move with my voucher?',a:'Yes — "portability" allows you to use your voucher in any area with a participating PHA.'}],
    related:[15,39,40], tags:['Section 8','housing','HUD','voucher','rental assistance'] },

  { id:15, t:'HUD Programs: Low-Income Housing Options', c:'Housing', icon:'🏘️', time:'6 min', v:1700, rating:4.5, reviews:134, diff:'Medium', updated:'Dec 2025',
    summary:'Overview of all major HUD housing assistance programs beyond Section 8.',
    steps:['Public Housing: apply directly at your local PHA — rent is typically 30% of income.','LIHTC properties: privately owned apartments with income-restricted rents — search at affordablehousingonline.com.','HOME Program: state-administered grants for homebuyer assistance — contact your state housing agency.','Emergency Housing Vouchers: contact your local Continuum of Care for homelessness-related assistance.','HUD-approved housing counselors available free at 800-569-4287.'],
    tips:['Income limits for most programs are 50% or 80% of Area Median Income (AMI).','Document everything with your PHA — get all communications in writing.','VAWA protections apply to HUD programs for domestic violence survivors.','Check 211.org for local affordable housing resources.'],
    faq:[{q:'Difference between Section 8 and Public Housing?',a:'Public Housing is owned and managed by the PHA. Section 8 uses vouchers in privately owned units. Both are income-based.'}],
    related:[14,39,40], tags:['HUD','public housing','affordable housing','low income'] },

  { id:39, t:'Avoiding Foreclosure: Options When You Can\'t Pay Your Mortgage', c:'Housing', icon:'🏚️', time:'9 min', v:2300, rating:4.7, reviews:198, diff:'Hard', updated:'Jan 2026',
    summary:'What to do if you\'ve missed mortgage payments — forbearance, loan modification, refinancing, short sale, and deed-in-lieu options.',
    steps:['Contact your servicer immediately — explain your hardship and ask specifically about loss mitigation options.','Request mortgage forbearance: a temporary pause or reduction in payments (typically 3-12 months).','Apply for a loan modification: a permanent change to loan terms to make payments affordable long-term.','If you can\'t keep the home, explore a short sale or deed-in-lieu — both avoid foreclosure on your credit record.','Contact a HUD-approved housing counselor (free): 1-800-569-4287. They negotiate with servicers on your behalf.','If you have an FHA, VA, or USDA loan, contact the specific agency for additional loss mitigation programs.'],
    tips:['Foreclosure cannot begin until you are 120 days past due under federal law — use this time to explore options.','Never pay a foreclosure rescue company upfront — scams are rampant. HUD counselors are free.','Illinois foreclosure takes 7-12 months in court — you have time if you act immediately.'],
    faq:[{q:'Will forbearance hurt my credit?',a:'Depends. Ask your servicer specifically how forbearance will be reported before agreeing.'},{q:'What happens to deferred payments?',a:'Options vary: some servicers add it to the end of the loan, others require a lump sum. Clarify before agreeing.'}],
    related:[14,15,40], tags:['foreclosure','mortgage','forbearance','loan modification','housing'] },

  { id:40, t:'LIHEAP: Home Energy Assistance Program', c:'Housing', icon:'🔥', time:'5 min', v:1900, rating:4.6, reviews:143, diff:'Easy', updated:'Feb 2026',
    summary:'How to apply for LIHEAP heating and cooling bill assistance, income limits, and what costs it covers.',
    steps:['Check eligibility: income at or below 150% of FPL (~$45,991/yr for family of 4 in 2024). Priority given to households with elderly, disabled, or young children.','Find your local LIHEAP office at acf.hhs.gov/ocs/liheap or call the Illinois line: 1-877-411-9276.','Apply in the fall before heating season — funds are limited and often run out.','Bring: utility bills, proof of income, proof of residency, and Social Security numbers.','LIHEAP pays your utility company directly or provides a fuel voucher.','Also ask about Weatherization Assistance (WAP) — free home insulation and efficiency upgrades.'],
    tips:['Illinois LIHEAP typically opens in October/November — apply early.','Many utilities offer their own low-income discount programs independent of LIHEAP.','If you are a renter with heat included in rent, ask your state office about eligibility.'],
    faq:[{q:'Can I get LIHEAP if I rent?',a:'Yes. Documentation from your landlord about heating costs may be required if utilities are not in your name.'},{q:'How much will I receive?',a:'In Illinois, LIHEAP benefits range from $200-$1,000+ depending on income, household size, and fuel type.'}],
    related:[14,15], tags:['LIHEAP','energy assistance','heating','utility bills','low income'] },

  // ── Education ─────────────────────────────────────────────────────────────
  { id:16, t:'FAFSA: Free Application for Federal Student Aid', c:'Education', icon:'🎓', time:'8 min', v:3300, rating:4.8, reviews:412, diff:'Medium', updated:'Feb 2026',
    summary:'How to complete the FAFSA, what information you need, and how it determines your financial aid package.',
    steps:['Create an FSA ID at studentaid.gov — both student and parent (if dependent) need separate IDs.','Gather documents: Social Security number, driver\'s license, prior year tax returns, W-2s, bank statements, and investment records.','File at studentaid.gov — the 2025-26 FAFSA opens December 1, 2024.','Link your IRS account using the IRS Data Retrieval Tool for automatic tax import.','List up to 20 schools on your FAFSA — each will receive your information.','Review your Student Aid Report (SAR) for accuracy.','Compare financial aid award letters from each school.'],
    tips:['File as early as possible — some aid is first-come, first-served, especially state grants.','Even if you think you earn too much, file anyway — eligibility formulas are complex.','Community college is often fully covered by Pell Grant plus state grants for low-income students.'],
    faq:[{q:'What is the Pell Grant?',a:'A federal grant of up to $7,395/yr (2024-25) for undergraduates with financial need. Grants do not need to be repaid.'},{q:'What is the Student Aid Index (SAI)?',a:'Previously called EFC, this is the number schools use to calculate your aid package. A lower SAI means more aid.'}],
    related:[17], tags:['FAFSA','financial aid','student aid','college','Pell Grant'] },

  { id:17, t:'Student Loan Repayment: IDR Plans Explained', c:'Education', icon:'💳', time:'10 min', v:2800, rating:4.7, reviews:334, diff:'Medium', updated:'Feb 2026',
    summary:'Income-Driven Repayment plans, Public Service Loan Forgiveness, and strategies to minimize what you pay.',
    steps:['Log in to studentaid.gov to see your loan types, balances, and servicer.','Understand your IDR options: SAVE, PAYE, IBR, and ICR plans all cap payments at a percentage of discretionary income.','Apply for an IDR plan through your loan servicer — recertify income annually.','If working in public service (government, nonprofit), apply for PSLF after 120 qualifying payments.','Explore Teacher Loan Forgiveness, Perkins Loan cancellation, or state-specific forgiveness programs.','Avoid refinancing federal loans to private — you lose IDR and forgiveness access.'],
    tips:['The SAVE plan offers the lowest monthly payments — as low as $0 for low incomes.','Under PSLF, payments don\'t need to be consecutive — just 120 total qualifying payments.','File employment certification forms annually for PSLF, not just when you have 120 payments.','Avoid default at all costs — rehabilitation is possible but damages credit significantly.'],
    faq:[{q:'What counts as a qualifying PSLF employer?',a:'Government agencies at any level, and 501(c)(3) nonprofits. Private companies generally do not qualify.'},{q:'What if I can\'t pay at all?',a:'Apply for deferment or forbearance to pause payments. IDR plans with $0 payments are often better than forbearance.'}],
    related:[16], tags:['student loans','IDR','PSLF','forgiveness','repayment'] },

  // ── Healthcare ────────────────────────────────────────────────────────────
  { id:18, t:'ACA Marketplace: Open Enrollment & Plan Selection', c:'Healthcare', icon:'💊', time:'9 min', v:3100, rating:4.8, reviews:287, diff:'Medium', updated:'Feb 2026',
    summary:'How to use healthcare.gov to compare and enroll in ACA health plans, understand subsidies, and avoid common enrollment mistakes.',
    steps:['Check enrollment dates — Open Enrollment runs Nov 1–Jan 15 each year. Special Enrollment Periods apply for qualifying life events (job loss, marriage, new baby, moving).','Go to healthcare.gov and create an account. Provide household size and estimated income for the year.','Review your subsidy eligibility — the Premium Tax Credit reduces monthly premiums for households earning 100%-400% of FPL.','Compare plans on four metal tiers: Bronze (lowest premium, highest deductible), Silver, Gold, Platinum. Cost-Sharing Reductions only available on Silver plans.','Check if your doctors and medications are covered in each plan\'s network and formulary before enrolling.','Complete enrollment before the deadline. Coverage begins Jan 1 if enrolled by Dec 15.'],
    tips:['Silver plans with CSR subsidies often have better value than Bronze at lower incomes.','Losing job-based coverage qualifies you for a 60-day Special Enrollment Period.','Report income changes mid-year to avoid repaying excess subsidies at tax time.','If you miss Open Enrollment, check Medicaid — there is no enrollment deadline for Medicaid if you qualify.'],
    faq:[{q:'What if I miss open enrollment?',a:'You can only enroll outside of OEP if you have a qualifying life event. Otherwise wait until Nov 1.'},{q:'Is there a penalty for not having insurance?',a:'The federal penalty was eliminated in 2019, but California, Massachusetts, and New Jersey still have state penalties.'}],
    related:[2,19,20], tags:['ACA','health insurance','marketplace','subsidy','open enrollment'] },

  { id:19, t:'CHIP: Children\'s Health Insurance Program', c:'Healthcare', icon:'👶', time:'5 min', v:1900, rating:4.7, reviews:164, diff:'Easy', updated:'Jan 2026',
    summary:'How to enroll your children in CHIP, income limits by state, and how it works alongside Medicaid.',
    steps:['Check eligibility — CHIP covers children up to age 19 in families earning too much for Medicaid but unable to afford private insurance. Income limits vary by state (typically 200-300% of FPL).','Apply through your state\'s CHIP/Medicaid agency or at healthcare.gov.','Provide proof of income, citizenship or immigration status, and children\'s birth certificates.','Pay the low or no premium — most families pay $0-$50/month depending on income.','Use CHIP coverage for checkups, immunizations, dental, vision, prescriptions, emergency care, and mental health.'],
    tips:['CHIP enrollment is year-round — no open enrollment window.','Pregnant women in many states can enroll in CHIP for prenatal care.','Dental and vision are included in CHIP — often not covered by adult Medicaid.'],
    faq:[{q:'What is the income limit for CHIP?',a:'Varies by state. In Illinois, All Kids covers children in families earning up to 313% of FPL (~$95,000 for a family of 4).'},{q:'Can my child have CHIP and private insurance?',a:'Yes, CHIP acts as secondary coverage and can cover copays from your primary plan.'}],
    related:[2,18], tags:['CHIP','children','health insurance','pediatric'] },

  { id:20, t:'Appealing a Health Insurance Denial', c:'Healthcare', icon:'⚖️', time:'8 min', v:2200, rating:4.6, reviews:198, diff:'Medium', updated:'Feb 2026',
    summary:'What to do when your insurance company denies a claim or prior authorization — internal appeals, external review, and escalation paths.',
    steps:['Read the Explanation of Benefits (EOB) or denial letter carefully — identify the specific reason code.','Call the insurance company to request clarification and ask if additional documentation could change the decision.','File an internal appeal within the insurer\'s deadline (typically 180 days from denial). Submit a letter of medical necessity and supporting clinical evidence.','If denied again, request an Independent Medical Review (IMR) — a free external review. For ACA plans, this is a federal right.','File a complaint with your state insurance commissioner if the external review is denied.','For Medicare denials, request a redetermination through your plan, then escalate to a Qualified Independent Contractor.'],
    tips:['Get your doctor involved early — a letter of medical necessity is the most powerful piece of evidence.','Keep a phone log of every call: date, time, rep name, and what was said.','Urgent care appeals must be decided within 72 hours — invoke this if your situation is time-sensitive.','Patient advocates and hospital social workers can help manage appeals at no cost.'],
    faq:[{q:'How long do I have to appeal?',a:'For ACA plans, 180 days from the denial date for internal appeals. For Medicare, 120 days for a redetermination.'},{q:'What if my treatment can\'t wait?',a:'Request an expedited appeal. Insurers must respond within 72 hours for urgent situations.'}],
    related:[18,2], tags:['insurance denial','appeal','prior authorization','health insurance','rights'] },

  // ── Taxes ─────────────────────────────────────────────────────────────────
  { id:21, t:'Filing Your Federal Taxes: Free Options & Key Deadlines', c:'Taxes', icon:'📊', time:'7 min', v:4100, rating:4.8, reviews:389, diff:'Medium', updated:'Feb 2026',
    summary:'How to file your federal taxes for free, what documents to gather, key deadlines, and what to do if you need more time.',
    steps:['Gather your documents: W-2s from employers, 1099s for freelance/investment income, SSA-1099, mortgage interest (1098), student loan interest (1098-E).','Choose your filing method. Free File (irs.gov/freefile) is available for incomes under $79,000. VITA sites offer free in-person help for incomes under ~$67,000.','Determine your filing status: Single, Married Filing Jointly, Married Filing Separately, Head of Household, or Qualifying Surviving Spouse.','Decide: standard deduction or itemize? The 2024 standard deduction is $14,600 (single) or $29,200 (married filing jointly).','File by April 15. If you need more time, file Form 4868 for an automatic 6-month extension to October 15.','If you owe, pay as much as possible by April 15 to minimize penalties and interest.'],
    tips:['Even if you had no income, file if you had tax withheld — you may get a refund.','Direct deposit gets your refund in 8-21 days vs. 6-8 weeks for a paper check.','The IRS Free File Guided Software is as accurate as paid software for simple returns.','State taxes are separate — most states have similar deadlines.'],
    faq:[{q:'What happens if I miss the deadline?',a:'Failure-to-file penalty is 5% of unpaid taxes per month (max 25%). File even if you can\'t pay to avoid the larger penalty.'},{q:'Do I have to file if I earn very little?',a:'If income is below $14,600 (single, 2024), you technically don\'t have to file — but you should if you had taxes withheld or qualify for EITC.'}],
    related:[22,23,7], tags:['taxes','IRS','tax filing','free file','VITA','deadline'] },

  { id:22, t:'IRS Payment Plans: What to Do If You Can\'t Pay', c:'Taxes', icon:'💳', time:'6 min', v:2800, rating:4.7, reviews:231, diff:'Medium', updated:'Jan 2026',
    summary:'Options for taxpayers who owe more than they can pay — installment agreements, Offer in Compromise, and penalty abatement.',
    steps:['File your return on time even if you can\'t pay — the failure-to-file penalty (5%/month) is 10x worse than failure-to-pay (0.5%/month).','Pay as much as you can with your return to reduce accruing interest (~8% annually).','Apply for a payment plan at irs.gov/paymentplan. Short-term plans (up to 180 days) are free. Long-term agreements have a setup fee of $31-$130.','For significant hardship, apply for an Offer in Compromise (OIC) — the IRS may accept less than the full amount owed. Use the IRS OIC Pre-Qualifier tool first.','If you cannot pay anything, request Currently Not Collectible (CNC) status. Collections are suspended while interest continues to accrue.','Request first-time penalty abatement if this is your first penalty in 3 years.'],
    tips:['Set up automatic payments on your installment agreement to avoid default.','The IRS Taxpayer Advocate Service (1-877-777-4778) is free and helps with hardship cases.','Be wary of tax relief companies charging large fees for services you can do yourself free at irs.gov.'],
    faq:[{q:'Will the IRS garnish my wages?',a:'Only after significant attempts to contact you. The IRS must send a Final Notice of Intent to Levy and allow 30 days before taking action.'},{q:'How long does the IRS have to collect?',a:'Generally 10 years from the date of assessment. After that, the debt is legally uncollectable.'}],
    related:[21,23], tags:['IRS','tax debt','payment plan','installment agreement','OIC'] },

  { id:23, t:'Earned Income Tax Credit (EITC): Who Qualifies & How to Claim', c:'Taxes', icon:'💰', time:'6 min', v:3400, rating:4.9, reviews:312, diff:'Easy', updated:'Feb 2026',
    summary:'The EITC is worth up to $7,830 for families with children. Here\'s exactly how to claim it.',
    steps:['Check earned income eligibility — must have wages, self-employment, or farming income. Investment income must be below $11,600.','Check 2024 income limits: no children ($18,591 single / $25,511 married), 1 child ($49,084 / $56,004), 2 children ($55,768 / $62,688), 3+ children ($59,899 / $66,819).','Confirm qualifying child requirements: under 19 (or 24 if student), must live with you more than half the year.','File a tax return and complete Schedule EIC. The IRS calculates your credit amount.','Use a VITA site or Free File software to avoid errors — EITC is frequently misclaimed.','If your EITC claim was denied in a prior year, file Form 8862 to reclaim eligibility.'],
    tips:['Workers without children ages 25-64 also qualify for a smaller EITC — many miss this.','Self-employed workers can claim EITC based on net earnings minus the self-employment tax deduction.','The IRS holds EITC refunds until mid-February to allow for fraud verification.','You can claim EITC for up to 3 prior years if you missed it — file amended returns.'],
    faq:[{q:'What is the maximum EITC for 2024?',a:'$7,830 for families with 3 or more qualifying children. $5,006 for 2 children, $3,995 for 1 child, and $632 for workers with no children.'},{q:'Can I claim EITC if self-employed?',a:'Yes. Use Schedule SE to calculate net self-employment income, then use that for EITC purposes.'}],
    related:[21,22], tags:['EITC','tax credit','earned income','refund','low income'] },

  // ── Justice ───────────────────────────────────────────────────────────────
  { id:24, t:'Record Expungement: Clearing Your Criminal Record', c:'Justice', icon:'🗂️', time:'10 min', v:2600, rating:4.8, reviews:243, diff:'Hard', updated:'Jan 2026',
    summary:'How to get arrests, charges, and convictions expunged or sealed — eligibility rules, the petition process, and what expungement actually does for you.',
    steps:['Obtain your criminal record — request your RAP sheet from your state\'s Bureau of Identification. In Illinois: ISP.isp.state.il.us.','Determine eligibility: most states allow expungement of arrests without conviction, dismissed charges, minor misdemeanors, and some felonies. Violent crimes and sex offenses are generally ineligible.','Check your waiting period — Illinois requires 3 years after sentence completion for most misdemeanors.','File a Petition for Expungement in the circuit court where the case was heard. Fee: $0-$150, with waivers available.','Notify the State\'s Attorney and arresting agency — they have 60 days to object.','After approval, records are physically destroyed (expungement) or hidden from public view (sealing).'],
    tips:['Illinois also has "Sealing" for offenses that don\'t qualify for expungement — sealed records are hidden from employers but accessible to law enforcement.','Many counties have free legal aid clinics specifically for expungements.','Automated expungement is expanding in Illinois under the SAFE-T Act — check if your record was automatically expunged.'],
    faq:[{q:'Does expungement remove my record from Google?',a:'No. Expungement removes official government records. Background check companies may still have the information — contact them separately.'},{q:'Can employers see an expunged record?',a:'In most cases, no. You can legally answer "no" on job applications. Law enforcement and professional licensing boards may still have access.'}],
    related:[25], tags:['expungement','criminal record','sealing','reentry','justice'] },

  { id:25, t:'Your Rights During a Police Encounter', c:'Justice', icon:'🛑', time:'7 min', v:3800, rating:4.7, reviews:334, diff:'Easy', updated:'Feb 2026',
    summary:'Know your constitutional rights during traffic stops, street stops, and home searches — what police can and cannot do.',
    steps:['Stay calm and keep your hands visible. In a car, keep hands on the steering wheel.','You have the right to remain silent under the 5th Amendment. State clearly: "I am exercising my right to remain silent."','Ask if you are being detained or are free to go. If free to go, calmly leave. If detained, comply with lawful orders while asserting your rights.','You have the right to refuse consent to a search. Say: "I do not consent to this search." An officer may still search with probable cause — do not physically resist.','Police generally need a warrant to enter your home unless there is an emergency, consent, or you are being arrested. Ask to see the warrant.','Document everything after the encounter: badge numbers, names, witness contact info, and any injuries.','If your rights were violated, file a complaint with internal affairs and consult a civil rights attorney.'],
    tips:['Never lie to police — it can be charged as a crime. Silence is always safer.','Filming police in public is a First Amendment right in all 50 states.','If arrested, do not discuss your case with anyone except your attorney — jail phone calls are recorded.','A public defender is free if you cannot afford an attorney — invoke this right immediately upon arrest.'],
    faq:[{q:'Do I have to show ID to police?',a:'In "stop and identify" states (including Illinois), you must provide your name if police have reasonable suspicion of a crime.'},{q:'What if I\'m undocumented?',a:'You have the same 4th and 5th Amendment rights as citizens. You are not required to discuss your immigration status with local police.'}],
    related:[24], tags:['police','rights','4th amendment','5th amendment','criminal justice'] },

  // ── Seniors ───────────────────────────────────────────────────────────────
  { id:26, t:'Medicare Advantage vs. Original Medicare', c:'Seniors', icon:'👴', time:'9 min', v:2900, rating:4.7, reviews:276, diff:'Medium', updated:'Feb 2026',
    summary:'A side-by-side comparison to help you choose between traditional Medicare and Medicare Advantage.',
    steps:['Understand Original Medicare: Part A (hospital, premium-free if 40+ quarters worked), Part B (outpatient, $174.70/month in 2024). No out-of-pocket maximum.','Understand Medicare Advantage (Part C): private plans replacing A & B, often include Part D (drugs), dental, vision, hearing. Must stay in network for most care.','Compare costs: Original Medicare covers 80% after deductible with no OOP max. Advantage plans have networks and prior authorization requirements.','Check the Medicare Plan Finder at medicare.gov to compare all plans in your ZIP code.','Consider your situation: flexible provider access → Medigap + Original Medicare. All-in-one simplicity + low premium → Advantage.','Enroll during your Initial Enrollment Period (7 months around your 65th birthday) or Annual Enrollment (Oct 15–Dec 7).'],
    tips:['Medigap plans can fill Original Medicare gaps but cost extra — only available with Original Medicare.','Medicare Advantage plans can change networks and benefits annually — review every year during Annual Enrollment.','Once you leave Original Medicare for Advantage, you may not be able to get a Medigap plan without medical underwriting.'],
    faq:[{q:'Can I switch between Original Medicare and Advantage?',a:'Yes, during Annual Enrollment (Oct 15–Dec 7) or Medicare Advantage Open Enrollment (Jan 1–Mar 31).'},{q:'Does Medicare cover nursing home care?',a:'Part A covers up to 100 days of skilled nursing care after a 3-day hospital stay. Long-term custodial care is covered by Medicaid, not Medicare.'}],
    related:[27,28,2], tags:['Medicare','Medicare Advantage','seniors','Part C','Medigap'] },

  { id:27, t:'Long-Term Care: Nursing Homes, Assisted Living & Medicaid', c:'Seniors', icon:'🏡', time:'10 min', v:2100, rating:4.6, reviews:189, diff:'Hard', updated:'Jan 2026',
    summary:'How to pay for nursing home or assisted living care, how Medicaid covers long-term care, and how to plan ahead.',
    steps:['Understand the cost: nursing home care averages $8,000-$10,000/month. Assisted living averages $4,500/month.','Understand coverage gaps: Medicare only covers short-term skilled nursing care (up to 100 days). Long-term custodial care is not covered by Medicare.','Medicaid covers long-term care for those with limited income and assets. In Illinois, the asset limit is $2,000 for the applicant.','Community Spouse Resource Allowance: the community spouse can keep assets up to $148,620 (2024) without affecting Medicaid eligibility.','Plan ahead with Medicaid trust planning (at least 5 years before applying, due to the look-back period) or long-term care insurance.','Use the Eldercare Locator (eldercare.acl.gov) or your local Area Agency on Aging to find local resources.'],
    tips:['The 5-year look-back period means asset transfers within 5 years of applying for Medicaid may result in a penalty period.','Long-term care insurance is most affordable if purchased in your 50s.','PACE provides nursing-home-level care at home for some Medicaid-eligible seniors.','Veteran spouses may qualify for VA Aid and Attendance benefits for in-home or assisted living care.'],
    faq:[{q:'Can I transfer assets to my children to qualify for Medicaid?',a:'Transfers within 5 years of applying trigger a penalty period. Work with an elder law attorney before making transfers.'},{q:'What happens to my home?',a:'Medicaid may file an estate recovery claim on your home after your death. Exceptions exist for spouses, minor children, and disabled adult children.'}],
    related:[26,28,4], tags:['nursing home','long term care','Medicaid','assisted living','seniors','elder law'] },

  { id:28, t:'Social Security Retirement: When to Claim for Maximum Benefit', c:'Seniors', icon:'📅', time:'8 min', v:3200, rating:4.9, reviews:298, diff:'Medium', updated:'Feb 2026',
    summary:'The math behind claiming Social Security at 62, full retirement age, or 70 — and strategies for couples to maximize lifetime benefits.',
    steps:['Check your Social Security Statement at ssa.gov/myaccount to see your estimated benefit at 62, full retirement age (FRA), and 70.','Understand the trade-off: claiming at 62 reduces your benefit by up to 30%. Waiting past FRA increases it by 8% per year until age 70.','Calculate your break-even age: typically 78-80. If you expect to live past that, waiting pays off.','Married couples: the higher earner should consider waiting until 70. The lower earner can claim earlier. Survivor benefits equal the higher earner\'s full benefit.','Consider taxation: up to 85% of Social Security benefits are taxable if combined income exceeds $34,000 (single) or $44,000 (married).','Apply online at ssa.gov up to 4 months before your desired start date.'],
    tips:['You can earn any amount from work after reaching FRA without reducing benefits.','Divorced spouses married 10+ years may claim up to 50% of the ex-spouse\'s benefit without affecting the ex-spouse.','Suspend benefits after FRA to earn delayed retirement credits until age 70.'],
    faq:[{q:'When should I claim if I\'m not sure how long I\'ll live?',a:'If you have a family history of longevity and are in good health, waiting until 70 is usually the mathematically optimal choice.'},{q:'Can I work while collecting Social Security?',a:'Yes, after FRA with no limit. Before FRA, high earnings temporarily reduce your benefit — benefits are recalculated at FRA to credit those withheld months.'}],
    related:[26,27,4], tags:['Social Security','retirement','SSA','claiming strategy','seniors'] },

  // ── Childcare ─────────────────────────────────────────────────────────────
  { id:29, t:'WIC: Women, Infants & Children Nutrition Program', c:'Childcare', icon:'🍼', time:'5 min', v:2400, rating:4.8, reviews:221, diff:'Easy', updated:'Feb 2026',
    summary:'Who qualifies for WIC, what foods and benefits are covered, and how to apply at your local WIC clinic.',
    steps:['Confirm eligibility: pregnant women, new mothers (up to 6 months postpartum or 12 months if breastfeeding), infants under 1, and children under 5. Income limit is 185% of FPL.','Find your local WIC clinic at wic.fns.usda.gov/clinic-locator or call 1-800-942-3678.','Bring to your appointment: proof of identity, residency, income, and documentation of pregnancy/child\'s age.','Meet with a WIC nutritionist who will certify your eligibility.','Receive your WIC benefits card loaded monthly with approved foods: cereals, milk, eggs, fruits/vegetables, beans, whole grains, and infant formula.'],
    tips:['Breastfeeding mothers receive a larger WIC food package.','WIC provides free breast pumps — ask at your clinic.','WIC benefits do not roll over month to month — use them before the end of the period.','WIC can be combined with SNAP and Medicaid for comprehensive support.'],
    faq:[{q:'Can fathers or grandparents apply for WIC for a child?',a:'Yes. Any adult caretaker can apply on behalf of an eligible child.'},{q:'What if I exceed the income limit?',a:'You may still qualify based on nutritional risk even above the income limit in some cases.'}],
    related:[5,30,31], tags:['WIC','nutrition','infants','pregnancy','food assistance'] },

  { id:30, t:'Head Start & Early Head Start: Free Preschool Programs', c:'Childcare', icon:'🎨', time:'6 min', v:1800, rating:4.7, reviews:143, diff:'Easy', updated:'Jan 2026',
    summary:'What Head Start provides, age and income requirements, what a typical day looks like, and how to get on a waiting list.',
    steps:['Understand the programs: Head Start serves children ages 3-5. Early Head Start serves pregnant women and children birth to 3. Both are free, federally funded.','Check eligibility: income must be at or below 100% of FPL. Homeless families and foster children are automatically eligible.','Find your local program at eclkc.ohs.acf.hhs.gov/center-locator or call 1-866-763-6481.','Apply directly at the program — each has its own application and waitlist.','Expect comprehensive services: education, meals, dental/medical screenings, mental health support, and family services.','Participate in required family engagement activities — programs expect parents to volunteer and attend meetings.'],
    tips:['Apply early — many Head Start programs fill by February for the following fall.','Head Start provides transportation in many areas — ask when you apply.','Families above the income limit can enroll if there are open slots after income-eligible families are served.'],
    faq:[{q:'Is Head Start full-day or half-day?',a:'Both options exist. Head Start is often half-day (3-4 hours) but many programs offer full-day options.'},{q:'What language is instruction provided in?',a:'Head Start serves children in their home language when possible and has strong multilingual support requirements.'}],
    related:[29,31], tags:['Head Start','preschool','early education','childcare','low income'] },

  { id:31, t:'Child Care Assistance Program (CCAP) & Subsidies', c:'Childcare', icon:'🧒', time:'7 min', v:2100, rating:4.6, reviews:167, diff:'Medium', updated:'Jan 2026',
    summary:'How to get government help paying for daycare, after-school programs, and babysitters through state childcare subsidy programs.',
    steps:['Check eligibility: in Illinois (CCAP), income must be at or below 185% FPL, and parent(s) must be working, in school, or in job training.','Apply through your state\'s childcare agency. In Illinois: DHS.illinois.gov or a local DHS office.','Choose an approved childcare provider enrolled with the subsidy program.','Pay your family co-payment (sliding scale based on income) directly to the provider. The state pays the remainder.','Recertify every 6-12 months — keep documentation of income and employment updated.','If you lose eligibility temporarily, report it immediately — some states offer a bridge period to maintain care.'],
    tips:['Priority is often given to children in foster care, homeless families, and children with special needs.','Licensed home daycares are approved providers in most states and often have shorter waitlists than centers.','The federal Child and Dependent Care Tax Credit (Form 2441) can reimburse up to $1,050 for one child even if you don\'t qualify for subsidies.'],
    faq:[{q:'Can I use CCAP for a relative watching my child?',a:'In Illinois, a relative 18+ can be a "relative home provider" under CCAP if they register with the state — including grandparents and adult siblings.'},{q:'What if my provider doesn\'t accept subsidies?',a:'Encourage them to enroll — it\'s free for providers to participate.'}],
    related:[29,30,5], tags:['childcare','CCAP','daycare','subsidy','working families'] },

  // ── Disability ────────────────────────────────────────────────────────────
  { id:32, t:'SSDI vs. SSI: Which Disability Program Is Right for You?', c:'Disability', icon:'♿', time:'8 min', v:3100, rating:4.8, reviews:267, diff:'Medium', updated:'Feb 2026',
    summary:'The key differences between Social Security Disability Insurance and Supplemental Security Income — eligibility, benefit amounts, and which to apply for.',
    steps:['Understand SSDI: based on your work history. Need enough "work credits" — generally 40 credits, 20 earned in the last 10 years.','Understand SSI: need-based, not work-history based. Available to disabled adults, children, and people 65+ with limited income and resources.','Check SSDI eligibility: medical condition expected to last 12+ months that prevents earning more than $1,550/month (SGA in 2024).','Check SSI eligibility: same medical criteria, plus income below ~$943/month and resources below $2,000 (individual) or $3,000 (couple).','You may qualify for both — "concurrent" beneficiaries receive SSDI plus SSI if SSDI payment is low.','Apply at ssa.gov or your local Social Security office. Apply for both simultaneously if you might qualify.'],
    tips:['SSDI comes with Medicare after a 24-month waiting period. SSI comes with Medicaid immediately in most states.','The definition of disability is the same for both programs.','Children of disabled or deceased workers may qualify for SSDI Auxiliary Benefits.','Start the process as soon as you become disabled — back pay starts from your application date.'],
    faq:[{q:'Can I work part-time while on SSDI?',a:'Yes, within SGA limits. The Trial Work Period allows 9 months of unlimited earnings while maintaining benefits.'},{q:'What happens if I get better?',a:'SSA conducts Continuing Disability Reviews every 3-7 years. If your condition improves and you no longer meet criteria, benefits may stop. You have appeal rights.'}],
    related:[4,33,34], tags:['SSDI','SSI','disability','Social Security','benefits'] },

  { id:33, t:'Applying for Disability Benefits: Step-by-Step', c:'Disability', icon:'📝', time:'11 min', v:2700, rating:4.7, reviews:234, diff:'Hard', updated:'Feb 2026',
    summary:'A realistic guide to the disability application process — what to expect at each stage, why most are denied initially, and how to maximize your approval chances.',
    steps:['Gather extensive medical documentation: all treating providers, dates of treatment, diagnoses, test results, hospitalizations, medications, and how your condition affects daily function.','Apply online at ssa.gov/applyfordisability or by phone (1-800-772-1213). Be thorough — more detail is better.','Expect an initial decision in 3-6 months. Approximately 67% of initial applications are denied.','If denied, file a Request for Reconsideration within 60 days. About 13% of reconsiderations are approved.','If denied again, request a hearing before an Administrative Law Judge (ALJ). About 45% of ALJ hearings result in approval. Wait time: 12-24 months.','Consider hiring a disability attorney after denial — they work on contingency (25% of back pay, max $7,200) and significantly improve approval rates.','If the ALJ denies, appeal to the Appeals Council, then federal district court.'],
    tips:['The most common reason for denial is insufficient medical evidence — document everything, see doctors regularly, and get functional capacity assessments.','Describe your worst days, not your best, when completing function reports.','Never miss a medical appointment during your application — gaps in treatment suggest your condition isn\'t serious.','Keep a daily symptom diary to document how disability affects daily activities.'],
    faq:[{q:'How long does the process take?',a:'Initial decision: 3-6 months. After two denials and an ALJ hearing, 2-3 years is common. Once approved, you receive back pay to your application date.'},{q:'What if I have an emergency during the wait?',a:'Contact your local Social Security office about Presumptive Disability payments for conditions like terminal cancer or ALS.'}],
    related:[32,34,4], tags:['disability','SSDI','SSI','application','denial','appeal','ALJ'] },

  { id:34, t:'ADA: Your Rights in the Workplace and Public Life', c:'Disability', icon:'🏛️', time:'8 min', v:2400, rating:4.8, reviews:212, diff:'Medium', updated:'Jan 2026',
    summary:'What the Americans with Disabilities Act protects — reasonable accommodations at work, accessibility requirements, and how to file a complaint.',
    steps:['Understand ADA coverage: applies to employers with 15+ employees, all state and local government, places of public accommodation, and transportation.','Request a reasonable accommodation: notify your employer in writing that you need an accommodation due to a disability. You don\'t need to disclose your exact diagnosis.','Engage in the interactive process: your employer must have a good-faith dialogue about feasible accommodations. They can deny requests that cause "undue hardship."','Document everything: keep records of accommodation requests, employer responses, and any adverse actions.','File a charge of discrimination with the EEOC (1-800-669-4000 or eeoc.gov) within 180 days (or 300 days in states with their own laws).','For public accommodation violations, file with the Department of Justice or consult a private attorney.'],
    tips:['"Disability" under ADA is broadly defined — includes mental health conditions, cancer, diabetes, and PTSD.','Your employer does not have to give you your preferred accommodation — only an effective one.','Retaliation for requesting accommodation or filing a complaint is illegal under the ADA.','Many accommodations are free or low-cost — flexible scheduling, ergonomic equipment, remote work, or modified duties.'],
    faq:[{q:'Can my employer fire me because of my disability?',a:'No, if you can perform the essential functions of your job with or without reasonable accommodation.'},{q:'Does ADA cover mental health conditions?',a:'Yes. Depression, anxiety, PTSD, bipolar disorder, and other mental health conditions that substantially limit a major life activity qualify under ADA.'}],
    related:[32,33], tags:['ADA','disability rights','accommodation','workplace','discrimination','EEOC'] },
]

// ── KB Config ─────────────────────────────────────────────────────────────────
const KB_CATS = ['All','Benefits','Business','Healthcare','Taxes','Housing','Education','Immigration','Veterans','Childcare','Disability','Justice','Seniors']
const DIFF_COLOR = {Easy:C.success, Medium:C.warn, Hard:C.danger}
const CAT_META = {
  Benefits:  {icon:'🍎', color:C.success},
  Business:  {icon:'🏢', color:C.primary},
  Healthcare:{icon:'💊', color:'#ec4899'},
  Taxes:     {icon:'📊', color:'#f59e0b'},
  Housing:   {icon:'🏠', color:'#f97316'},
  Education: {icon:'🎓', color:'#8b5cf6'},
  Immigration:{icon:'🌎', color:'#6366f1'},
  Veterans:  {icon:'🏅', color:'#06b6d4'},
  Childcare: {icon:'🧒', color:'#14b8a6'},
  Disability:{icon:'♿', color:'#a78bfa'},
  Justice:   {icon:'⚖️', color:'#f43f5e'},
  Seniors:   {icon:'👴', color:'#fb923c'},
}
const LEARNING_PATHS = [
  { id:'job-loss', title:'Navigating a Job Loss', icon:'💼', desc:'From layoff to recovery', articles:[3,1,2,23,21], color:C.primary },
  { id:'start-biz', title:'Starting a Business', icon:'🚀', desc:'From idea to LLC to first paycheck', articles:[6,7,8,35,36,21], color:C.success },
  { id:'new-baby', title:'New Baby Essentials', icon:'👶', desc:'Benefits and support for new parents', articles:[29,19,31,5,2], color:'#ec4899' },
  { id:'disability', title:'Applying for Disability', icon:'♿', desc:'SSDI, SSI, and workplace rights', articles:[32,33,34,4], color:'#a78bfa' },
  { id:'senior-plan', title:'Senior Life Planning', icon:'👴', desc:'Medicare, Social Security, and long-term care', articles:[26,27,28,12], color:'#fb923c' },
  { id:'immigration', title:'Path to Citizenship', icon:'🇺🇸', desc:'From arrival to naturalization', articles:[10,9,11], color:'#6366f1' },
]

function FaqSection({ faq, catColor }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="card" style={{ marginBottom:20 }}>
      <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:16 }}>❓ Frequently Asked Questions</h2>
      {faq.map((item, i) => (
        <div key={i} style={{ borderBottom: i < faq.length-1 ? `1px solid ${C.border}` : 'none' }}>
          <div onClick={()=>setOpen(open===i?null:i)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', cursor:'pointer', gap:16 }}>
            <div style={{ fontWeight:600, color:C.heading, fontSize:14 }}>{item.q}</div>
            <span style={{ color:catColor, fontSize:18, flexShrink:0 }}>{open===i?'−':'+'}</span>
          </div>
          {open===i && <div style={{ paddingBottom:16, paddingLeft:4 }}><p style={{ color:C.muted, fontSize:14, lineHeight:1.7 }}>{item.a}</p></div>}
        </div>
      ))}
    </div>
  )
}

function ArticleList({ articles, view, onOpen, bookmarks, setBookmarks }) {
  if (view==='grid') return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
      {articles.map(a=>{
        const color = CAT_META[a.c]?.color || C.primary
        return (
          <div key={a.id} onClick={()=>onOpen(a)} className="card" style={{ cursor:'pointer', display:'flex', flexDirection:'column', gap:10, borderTop:`3px solid ${color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="badge badge-blue">{a.c}</span>
              <button onClick={e=>{e.stopPropagation();setBookmarks(b=>{const n=new Set(b);n.has(a.id)?n.delete(a.id):n.add(a.id);return n})}} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:bookmarks.has(a.id)?C.warn:C.muted }}>🔖</button>
            </div>
            <div style={{ fontSize:32 }}>{a.icon}</div>
            <div style={{ fontWeight:700, color:C.heading, fontSize:14, lineHeight:1.4 }}>{a.t}</div>
            <div style={{ fontSize:12, color:C.muted, lineHeight:1.5, flex:1 }}>{a.summary.slice(0,80)}…</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontSize:11, padding:'2px 7px', borderRadius:4, background:`${DIFF_COLOR[a.diff]}22`, color:DIFF_COLOR[a.diff], fontWeight:700 }}>{a.diff}</span>
              <span style={{ fontSize:11, color:C.muted }}>⏱ {a.time}</span>
            </div>
            <div style={{ display:'flex', gap:8, fontSize:12, color:C.muted, marginTop:'auto', paddingTop:6, borderTop:`1px solid ${C.border}` }}>
              <span style={{ color:C.warn }}>★ {a.rating}</span>
              <span>·</span><span>{a.v.toLocaleString()} views</span>
            </div>
          </div>
        )
      })}
    </div>
  )
  return (
    <div style={{ display:'grid', gap:10 }}>
      {articles.map(a=>{
        const color = CAT_META[a.c]?.color || C.primary
        return (
          <div key={a.id} onClick={()=>onOpen(a)} className="card" style={{ display:'flex', alignItems:'center', gap:16, cursor:'pointer', borderLeft:`3px solid ${color}` }}>
            <div style={{ fontSize:28, flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:8, marginBottom:6, flexWrap:'wrap', alignItems:'center' }}>
                <span className="badge badge-blue">{a.c}</span>
                <span style={{ fontSize:11, padding:'2px 7px', borderRadius:4, background:`${DIFF_COLOR[a.diff]}22`, color:DIFF_COLOR[a.diff], fontWeight:700 }}>{a.diff}</span>
                <span style={{ fontSize:12, color:C.muted }}>⏱ {a.time}</span>
                <span style={{ fontSize:11, color:C.success, marginLeft:'auto' }}>Updated {a.updated}</span>
              </div>
              <div style={{ fontWeight:700, color:C.heading, fontSize:14, marginBottom:4 }}>{a.t}</div>
              <div style={{ fontSize:13, color:C.muted, lineHeight:1.4 }}>{a.summary.slice(0,110)}…</div>
              <div style={{ display:'flex', gap:12, fontSize:12, color:C.muted, marginTop:8 }}>
                <span style={{ color:C.warn }}>★ {a.rating}</span>
                <span>({a.reviews})</span><span>·</span><span>{a.v.toLocaleString()} views</span>
              </div>
            </div>
            <button onClick={e=>{e.stopPropagation();setBookmarks(b=>{const n=new Set(b);n.has(a.id)?n.delete(a.id):n.add(a.id);return n})}} style={{ background:'none', border:'none', cursor:'pointer', fontSize:18, color:bookmarks.has(a.id)?C.warn:C.border, flexShrink:0 }}>🔖</button>
            <span style={{ color:C.muted, fontSize:18 }}>›</span>
          </div>
        )
      })}
    </div>
  )
}

function ArticleView({ article, onBack, onViewArticle }) {
  const [helpful, setHelpful] = useState(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [activeStep, setActiveStep] = useState(null)
  const [showIL, setShowIL] = useState(false)
  const related = KB_ARTICLES.filter(a => article.related?.includes(a.id))
  const catColor = CAT_META[article.c]?.color || C.primary

  return (
    <div className="page">
      <button onClick={onBack} style={{ background:'none', border:'none', color:C.primary, cursor:'pointer', fontSize:14, fontWeight:600, marginBottom:24, display:'flex', alignItems:'center', gap:6 }}>← Back to Knowledge Base</button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:24, alignItems:'start' }}>
        <div>
          <div className="card" style={{ marginBottom:20, borderTop:`3px solid ${catColor}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, flexWrap:'wrap' }}>
              <span className="badge badge-blue">{article.c}</span>
              <span style={{ fontSize:12, padding:'2px 8px', borderRadius:4, background:`${DIFF_COLOR[article.diff]}22`, color:DIFF_COLOR[article.diff], fontWeight:700 }}>{article.diff}</span>
              <span style={{ fontSize:12, color:C.muted }}>⏱ {article.time}</span>
              <span style={{ fontSize:12, color:C.muted, marginLeft:'auto' }}>Updated {article.updated}</span>
            </div>
            <div style={{ fontSize:40, marginBottom:12 }}>{article.icon}</div>
            <h1 style={{ color:C.heading, fontSize:26, fontWeight:800, marginBottom:12, lineHeight:1.3 }}>{article.t}</h1>
            <p style={{ color:C.muted, fontSize:15, lineHeight:1.7, marginBottom:16 }}>{article.summary}</p>
            <div style={{ display:'flex', gap:12, color:C.muted, fontSize:13 }}>
              <span style={{ color:C.warn }}>{'★'.repeat(Math.round(article.rating))}{'☆'.repeat(5-Math.round(article.rating))}</span>
              <span>{article.rating} ({article.reviews} reviews)</span>
              <span>·</span><span>{article.v.toLocaleString()} views</span>
            </div>
          </div>

          <div style={{ background:`${catColor}11`, border:`1px solid ${catColor}33`, borderRadius:12, padding:16, marginBottom:20 }}>
            <div style={{ fontWeight:800, color:catColor, fontSize:12, marginBottom:8, letterSpacing:'.06em' }}>TL;DR — QUICK SUMMARY</div>
            <div style={{ fontSize:14, color:C.text, lineHeight:1.6 }}>{article.summary}</div>
            <div style={{ marginTop:10, display:'flex', flexWrap:'wrap', gap:6 }}>
              {article.steps.slice(0,3).map((s,i)=>(
                <span key={i} style={{ padding:'3px 10px', background:`${catColor}22`, borderRadius:20, fontSize:11, color:catColor, fontWeight:600 }}>Step {i+1}: {s.slice(0,38)}…</span>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', background:C.surface, borderRadius:10, border:`1px solid ${C.border}`, marginBottom:20 }}>
            <span>🏛️</span>
            <span style={{ fontSize:13, color:C.text, flex:1 }}>Show Illinois-specific information</span>
            <div className="toggle" style={{ background:showIL?catColor:C.border }} onClick={()=>setShowIL(v=>!v)}>
              <div className="tknob" style={{ left:showIL?23:3 }} />
            </div>
          </div>
          {showIL && (
            <div style={{ background:`${catColor}11`, border:`1px solid ${catColor}33`, borderRadius:12, padding:16, marginBottom:20 }}>
              <div style={{ fontWeight:700, color:catColor, marginBottom:8, fontSize:14 }}>🏛️ Illinois-Specific Details</div>
              <div style={{ fontSize:14, color:C.text, lineHeight:1.7 }}>
                In Illinois, this process is handled through the Illinois Department of Human Services (IDHS) or the relevant state agency.
                Contact the Illinois helpline at <strong>1-800-843-6154</strong> or visit <strong>dhs.illinois.gov</strong> for state-specific guidance.
                Illinois residents can also use the <strong>ABE portal</strong> at abe.illinois.gov for most benefit applications.
              </div>
            </div>
          )}

          <div className="card" style={{ marginBottom:20 }}>
            <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:20 }}>📋 Step-by-Step Guide</h2>
            {article.steps.map((step, i) => (
              <div key={i} onClick={()=>setActiveStep(activeStep===i?null:i)} style={{ marginBottom:i < article.steps.length-1 ? 16 : 0, cursor:'pointer' }}>
                <div style={{ display:'flex', gap:14 }}>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:activeStep===i?catColor:`${catColor}22`, border:`2px solid ${catColor}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:activeStep===i?'#fff':catColor, fontSize:14, flexShrink:0, marginTop:2, transition:'all .2s' }}>{i+1}</div>
                  <div style={{ flex:1, paddingBottom:i < article.steps.length-1 ? 16 : 0, borderBottom:i < article.steps.length-1 ? `1px solid ${C.border}` : 'none' }}>
                    <p style={{ color:C.text, fontSize:14, lineHeight:1.7 }}>{step}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom:20 }}>
            <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:16 }}>💡 Pro Tips</h2>
            {article.tips.map((tip, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:i < article.tips.length-1 ? `1px solid ${C.border}` : 'none' }}>
                <span style={{ color:catColor, fontSize:18, flexShrink:0 }}>→</span>
                <p style={{ color:C.text, fontSize:14, lineHeight:1.6 }}>{tip}</p>
              </div>
            ))}
          </div>

          <FaqSection faq={article.faq} catColor={catColor} />

          <div className="card">
            <h3 style={{ color:C.heading, marginBottom:16 }}>Was this guide helpful?</h3>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={()=>setHelpful('yes')} className="btn" style={{ flex:1, background:helpful==='yes'?`${C.success}22`:C.surface, border:`1px solid ${helpful==='yes'?C.success:C.border}`, color:helpful==='yes'?C.success:C.muted }}>👍 Yes, helpful!</button>
              <button onClick={()=>setHelpful('no')} className="btn" style={{ flex:1, background:helpful==='no'?`${C.danger}22`:C.surface, border:`1px solid ${helpful==='no'?C.danger:C.border}`, color:helpful==='no'?C.danger:C.muted }}>👎 Needs work</button>
            </div>
            {helpful==='yes' && <p style={{ marginTop:12, fontSize:14, color:C.success }}>✓ Thanks! Share this article with someone who might need it.</p>}
            {helpful==='no' && <p style={{ marginTop:12, fontSize:14, color:C.muted }}>We'll use your feedback to improve this guide.</p>}
          </div>
        </div>

        <div style={{ position:'sticky', top:20, display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card">
            <h3 style={{ color:C.heading, fontSize:14, marginBottom:14 }}>Quick Actions</h3>
            <button onClick={()=>setBookmarked(v=>!v)} className="btn" style={{ width:'100%', marginBottom:8, background:bookmarked?`${C.warn}22`:C.surface, border:`1px solid ${bookmarked?C.warn:C.border}`, color:bookmarked?C.warn:C.text, fontSize:13 }}>{bookmarked?'🔖 Bookmarked':'🔖 Save Article'}</button>
            <button className="btn btn-primary" style={{ width:'100%', marginBottom:8, fontSize:13 }}>🤖 Ask CLARA About This</button>
            <button className="btn btn-outline" style={{ width:'100%', fontSize:13 }}>📄 Download PDF</button>
          </div>
          <div className="card">
            <h3 style={{ color:C.heading, fontSize:14, marginBottom:10 }}>Tags</h3>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {article.tags.map(tag=><span key={tag} style={{ padding:'3px 8px', background:C.surface, borderRadius:20, fontSize:11, color:C.muted, border:`1px solid ${C.border}` }}>#{tag}</span>)}
            </div>
          </div>
          {related.length > 0 && (
            <div className="card">
              <h3 style={{ color:C.heading, fontSize:14, marginBottom:12 }}>Related Guides</h3>
              {related.map(a=>(
                <div key={a.id} onClick={()=>onViewArticle(a)} style={{ padding:'10px 0', borderBottom:`1px solid ${C.border}`, cursor:'pointer', display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:20 }}>{a.icon}</span>
                  <div><div style={{ fontSize:13, color:C.text, fontWeight:600, lineHeight:1.3 }}>{a.t}</div><span className="badge badge-blue" style={{ marginTop:4 }}>{a.c}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Knowledge() {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('popular')
  const [diff, setDiff] = useState('All')
  const [view, setView] = useState('list')
  const [selected, setSelected] = useState(null)
  const [bookmarks, setBookmarks] = useState(new Set())
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [activePath, setActivePath] = useState(null)

  function openArticle(a) {
    setSelected(a)
    setRecentlyViewed(rv => [a, ...rv.filter(x=>x.id!==a.id)].slice(0,5))
    window.scrollTo(0,0)
  }
  function handleBack() { setSelected(null); window.scrollTo(0,0) }

  if (selected) return <ArticleView article={selected} onBack={handleBack} onViewArticle={openArticle} />

  const filtered = KB_ARTICLES
    .filter(a => cat==='All' || a.c===cat)
    .filter(a => diff==='All' || a.diff===diff)
    .filter(a => {
      if (!search) return true
      const q = search.toLowerCase()
      return a.t.toLowerCase().includes(q) || a.c.toLowerCase().includes(q) || a.tags.some(t=>t.includes(q)) || a.summary.toLowerCase().includes(q)
    })
    .sort((a,b) => sort==='popular'?b.v-a.v : sort==='rating'?b.rating-a.rating : sort==='newest'?b.id-a.id : a.t.localeCompare(b.t))

  const catCounts = Object.keys(CAT_META).map(c=>({ c, n:KB_ARTICLES.filter(a=>a.c===c).length, ...CAT_META[c] }))
  const trending = [...KB_ARTICLES].sort((a,b)=>b.v-a.v).slice(0,5)
  const totalViews = KB_ARTICLES.reduce((s,a)=>s+a.v,0)
  const avgRating = (KB_ARTICLES.reduce((s,a)=>s+a.rating,0)/KB_ARTICLES.length).toFixed(1)

  return (
    <div className="page">
      <div className="ph">
        <div className="pt">Phase 19 — Expanded</div>
        <h1>Knowledge Base</h1>
        <p>{KB_ARTICLES.length} in-depth guides across {Object.keys(CAT_META).length} categories — benefits, healthcare, taxes, disability, housing, and more.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:32 }}>
        {[[KB_ARTICLES.length,'📚','Guides'],[Object.keys(CAT_META).length,'🗂️','Categories'],[avgRating,'⭐','Avg Rating'],[(totalViews/1000).toFixed(0)+'K','👁️','Monthly Views']].map(([v,i,l])=>(
          <div key={l} style={{ padding:'14px 16px', background:C.card, borderRadius:12, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{i}</div>
            <div style={{ fontSize:24, fontWeight:800, color:C.heading }}>{v}</div>
            <div style={{ fontSize:12, color:C.muted }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ position:'relative', marginBottom:20 }}>
        <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', fontSize:18 }}>🔍</span>
        <input value={search} onChange={e=>{setSearch(e.target.value);setCat('All')}} placeholder={`Search ${KB_ARTICLES.length} guides — try "disability", "SNAP", "taxes", "LLC", "Medicare"…`} style={{ padding:'14px 44px', fontSize:15 }} />
        {search && <button onClick={()=>setSearch('')} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:18 }}>✕</button>}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        <button onClick={()=>{setCat('All');setActivePath(null)}} style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${cat==='All'?C.primary:C.border}`, background:cat==='All'?`${C.primary}22`:'transparent', color:cat==='All'?C.primary:C.muted, cursor:'pointer', fontSize:12, fontWeight:cat==='All'?700:400 }}>All ({KB_ARTICLES.length})</button>
        {catCounts.map(({c,n,icon,color})=>(
          <button key={c} onClick={()=>{setCat(c);setActivePath(null)}} style={{ padding:'6px 12px', borderRadius:20, border:`1px solid ${cat===c?color:C.border}`, background:cat===c?`${color}22`:'transparent', color:cat===c?color:C.muted, cursor:'pointer', fontSize:12, fontWeight:cat===c?700:400 }}>
            {icon} {c} ({n})
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:28, alignItems:'center', flexWrap:'wrap' }}>
        <select value={diff} onChange={e=>setDiff(e.target.value)} style={{ width:'auto', padding:'7px 12px', fontSize:13 }}>
          <option value="All">All Levels</option><option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ width:'auto', padding:'7px 12px', fontSize:13 }}>
          <option value="popular">Most Popular</option><option value="rating">Highest Rated</option>
          <option value="newest">Newest</option><option value="alpha">A–Z</option>
        </select>
        <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
          {['list','grid'].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${view===v?C.primary:C.border}`, background:view===v?`${C.primary}22`:'transparent', color:view===v?C.primary:C.muted, cursor:'pointer', fontSize:13 }}>{v==='grid'?'⊞ Grid':'≡ List'}</button>
          ))}
        </div>
      </div>

      {search ? (
        <div>
          <div style={{ marginBottom:16, fontSize:14, color:C.muted }}>{filtered.length} result{filtered.length!==1?'s':''} for <strong style={{ color:C.text }}>"{search}"</strong></div>
          {filtered.length===0 ? (
            <div className="card" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <div style={{ fontWeight:700, color:C.heading, fontSize:18, marginBottom:8 }}>No articles found</div>
              <div style={{ color:C.muted, marginBottom:16 }}>Try "SNAP", "LLC", "Medicare", "disability", or "taxes"</div>
              <button className="btn btn-primary" onClick={()=>setSearch('')}>Clear Search</button>
            </div>
          ) : <ArticleList articles={filtered} view={view} onOpen={openArticle} bookmarks={bookmarks} setBookmarks={setBookmarks} />}
        </div>
      ) : cat!=='All' ? (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <span style={{ fontSize:36 }}>{CAT_META[cat]?.icon}</span>
            <div><h2 style={{ color:C.heading, fontSize:22, fontWeight:800 }}>{cat}</h2><div style={{ color:C.muted, fontSize:14 }}>{filtered.length} guides</div></div>
          </div>
          <ArticleList articles={filtered} view={view} onOpen={openArticle} bookmarks={bookmarks} setBookmarks={setBookmarks} />
        </div>
      ) : (
        <div>
          {/* Learning Paths */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:6 }}>🗺️ Learning Paths</h2>
            <p style={{ color:C.muted, fontSize:13, marginBottom:16 }}>Curated article sequences for common life situations</p>
            {activePath ? (() => {
              const path = LEARNING_PATHS.find(p=>p.id===activePath)
              const pathArticles = path.articles.map(id=>KB_ARTICLES.find(a=>a.id===id)).filter(Boolean)
              return (
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 20px', background:`${path.color}11`, border:`1px solid ${path.color}33`, borderRadius:12, marginBottom:16 }}>
                    <span style={{ fontSize:28 }}>{path.icon}</span>
                    <div style={{ flex:1 }}><div style={{ fontWeight:700, color:C.heading }}>{path.title}</div><div style={{ fontSize:13, color:C.muted }}>{path.desc}</div></div>
                    <button onClick={()=>setActivePath(null)} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:'pointer', padding:'5px 10px', fontSize:12 }}>✕ Close</button>
                  </div>
                  <div style={{ display:'grid', gap:10 }}>
                    {pathArticles.map((a,i)=>(
                      <div key={a.id} onClick={()=>openArticle(a)} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', background:C.card, border:`1px solid ${C.border}`, borderRadius:12, cursor:'pointer' }}>
                        <div style={{ width:30, height:30, borderRadius:'50%', background:`${path.color}22`, border:`2px solid ${path.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:path.color, flexShrink:0, fontSize:13 }}>{i+1}</div>
                        <span style={{ fontSize:22 }}>{a.icon}</span>
                        <div style={{ flex:1 }}><div style={{ fontWeight:600, color:C.heading, fontSize:14 }}>{a.t}</div><div style={{ fontSize:12, color:C.muted }}>{a.time} · {a.diff}</div></div>
                        <span style={{ color:C.muted }}>›</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })() : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
                {LEARNING_PATHS.map(path=>(
                  <div key={path.id} onClick={()=>setActivePath(path.id)} style={{ padding:16, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, cursor:'pointer' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                      <div style={{ width:40, height:40, borderRadius:10, background:`${path.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{path.icon}</div>
                      <div><div style={{ fontWeight:700, color:C.heading, fontSize:14 }}>{path.title}</div><div style={{ fontSize:12, color:C.muted }}>{path.articles.length} guides</div></div>
                    </div>
                    <div style={{ fontSize:13, color:C.muted }}>{path.desc}</div>
                    <div style={{ marginTop:10, display:'flex', gap:6 }}>
                      {path.articles.slice(0,4).map(id=>{ const a=KB_ARTICLES.find(x=>x.id===id); return a?<span key={id} style={{ fontSize:16 }}>{a.icon}</span>:null })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trending */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:14 }}>🔥 Trending This Week</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
              {trending.map((a,i)=>(
                <div key={a.id} onClick={()=>openArticle(a)} style={{ padding:'12px 16px', background:C.card, border:`1px solid ${C.border}`, borderRadius:12, cursor:'pointer', display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ fontWeight:900, fontSize:20, color:i<3?C.warn:C.muted, minWidth:26 }}>#{i+1}</div>
                  <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600, color:C.heading }}>{a.icon} {a.t}</div><div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{a.v.toLocaleString()} views</div></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Viewed */}
          {recentlyViewed.length > 0 && (
            <div style={{ marginBottom:36 }}>
              <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:14 }}>👁️ Recently Viewed</h2>
              <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8 }}>
                {recentlyViewed.map(a=>(
                  <div key={a.id} onClick={()=>openArticle(a)} style={{ padding:'12px 16px', background:C.card, border:`1px solid ${C.border}`, borderRadius:12, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', gap:10, minWidth:200 }}>
                    <span style={{ fontSize:22 }}>{a.icon}</span>
                    <div><div style={{ fontSize:13, fontWeight:600, color:C.heading }}>{a.t}</div><span className="badge badge-blue">{a.c}</span></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div style={{ marginBottom:36 }}>
            <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:14 }}>📂 Browse by Category</h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:10 }}>
              {catCounts.map(({c,n,icon,color})=>(
                <div key={c} onClick={()=>setCat(c)} style={{ padding:'14px 12px', background:C.card, border:`1px solid ${C.border}`, borderRadius:12, cursor:'pointer', textAlign:'center' }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontWeight:700, color:C.heading, fontSize:13 }}>{c}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{n} guides</div>
                </div>
              ))}
            </div>
          </div>

          {/* All articles */}
          <div>
            <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:16 }}>
              All Guides <span style={{ color:C.muted, fontWeight:400, fontSize:14 }}>({filtered.length})</span>
            </h2>
            <ArticleList articles={filtered} view={view} onOpen={openArticle} bookmarks={bookmarks} setBookmarks={setBookmarks} />
          </div>
        </div>
      )}
    </div>
  )
}


// ── PHASE 21: AI ASSISTANT ────────────────────────────────────────────────────
function AIAssistant() {
  const [msgs, setMsgs] = useState([{ role:'ai', text:"Hi! I\'m CLARA — your government process assistant. Ask me anything about benefits, permits, applications, or any government process." }])
  const [inp, setInp] = useState('')
  const [loading, setLoading] = useState(false)

  const Q = ['How do I apply for SNAP?','What benefits am I eligible for?','How to start an LLC in Illinois?','Check my application status']
  const R = {
    snap:"To apply for SNAP:\n\n1. Check eligibility — gross income ≤130% federal poverty level\n2. Gather documents — ID, proof of income, residency\n3. Apply at benefits.gov or your state DHS portal\n4. Complete a phone interview within 30 days\n5. Receive EBT card if approved\n\nWant me to estimate your benefit amount?",
    llc:"Starting an LLC in Illinois:\n\n1. Choose a unique name (search at ilsos.gov)\n2. File Articles of Organization — $150 fee\n3. Get EIN free at irs.gov (5 minutes online)\n4. Register for state taxes at mytax.illinois.gov\n5. File Annual Report each year — $75 fee\n\nTimeline: 1-2 weeks. Want a checklist?",
    default:"I can help with that! Based on your question, here are the key steps:\n\n1. Verify your eligibility using our screener\n2. Gather required documents\n3. Submit through the official portal\n\nWould you like me to walk you through each step in detail? I can also help in Spanish, French, or 5 other languages."
  }

  function send(text) {
    const msg = text||inp; if(!msg.trim()) return
    setMsgs(m=>[...m,{role:'user',text:msg}]); setInp(''); setLoading(true)
    setTimeout(()=>{
      const l=msg.toLowerCase()
      const resp = l.includes('snap')||l.includes('food')?R.snap:l.includes('llc')||l.includes('business')?R.llc:R.default
      setMsgs(m=>[...m,{role:'ai',text:resp}]); setLoading(false)
    }, 900)
  }

  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 21 — AI Assistant</div><h1>CLARA <span className="tn">NEW</span></h1><p>AI-powered assistant for any government process. Multilingual, 24/7.</p></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:20, alignItems:'start' }}>
        <div className="card" style={{ display:'flex', flexDirection:'column', height:'62vh' }}>
          <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:14, marginBottom:14 }}>
            {msgs.map((m,i)=>(
              <div key={i} style={{ display:'flex', gap:10, justifyContent:m.role==='user'?'flex-end':'flex-start' }}>
                {m.role==='ai'&&<div style={{ width:34,height:34,borderRadius:'50%',background:`${C.primary}33`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:16 }}>🤖</div>}
                <div style={{ maxWidth:'75%', padding:'12px 16px', borderRadius:12, background:m.role==='user'?C.primary:C.surface, color:C.text, fontSize:14, lineHeight:1.6, whiteSpace:'pre-line' }}>{m.text}</div>
              </div>
            ))}
            {loading&&<div style={{ display:'flex', gap:10 }}><div style={{ width:34,height:34,borderRadius:'50%',background:`${C.primary}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16 }}>🤖</div><div style={{ padding:'12px 16px', borderRadius:12, background:C.surface, color:C.muted, fontSize:14 }}>CLARA is thinking…</div></div>}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about any government process…" />
            <button className="btn btn-primary" onClick={()=>send()} style={{ flexShrink:0 }}>Send</button>
          </div>
        </div>
        <div>
          <div className="card" style={{ marginBottom:14 }}>
            <h3 style={{ color:C.heading, marginBottom:14, fontSize:15 }}>Quick Questions</h3>
            {Q.map(q=><button key={q} onClick={()=>send(q)} style={{ display:'block', width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:'9px 12px', cursor:'pointer', textAlign:'left', fontSize:13, marginBottom:8 }}>{q}</button>)}
          </div>
          <div className="card">
            <h3 style={{ color:C.heading, marginBottom:10, fontSize:15 }}>CLARA Can Help With</h3>
            {['Eligibility screening','Step-by-step guidance','Document checklists','Deadline reminders','8 languages supported'].map(i=><div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', fontSize:13, color:C.muted }}>✅ {i}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PHASE 22: VOICE ───────────────────────────────────────────────────────────
function Voice() {
  const [status, setStatus] = useState('idle')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [lang, setLang] = useState('English')

  function go() {
    if(status!=='idle'){setStatus('idle');setTranscript('');setResponse('');return}
    setStatus('listening')
    setTimeout(()=>{setTranscript('How do I apply for unemployment benefits?');setStatus('processing')},2000)
    setTimeout(()=>{setResponse("To apply for unemployment in Illinois: Visit ides.illinois.gov, click 'File a Claim', and complete the online application. You'll need your SSN, 18 months of work history, and banking info. Claims process in 3-4 weeks.");setStatus('speaking')},3500)
    setTimeout(()=>setStatus('idle'),7500)
  }

  const sc = {idle:{c:C.muted,l:'Tap to speak',e:'🎤'},listening:{c:C.danger,l:'Listening…',e:'🔴'},processing:{c:C.warn,l:'Processing…',e:'⚡'},speaking:{c:C.success,l:'Speaking response',e:'🔊'}}[status]
  const langs = ['English','Español','Français','Tiếng Việt','中文','العربية','Tagalog','Русский']

  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 22 — Voice Interface</div><h1>Voice Assistant <span className="tn">NEW</span></h1><p>Speak naturally in 8 languages. No typing required.</p></div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:20 }}>
        <div className="card" style={{ textAlign:'center', padding:48 }}>
          <div style={{ position:'relative', width:160, height:160, margin:'0 auto 32px' }}>
            {status==='listening'&&[0,1,2].map(i=><div key={i} style={{ position:'absolute', inset:`${i*18}px`, borderRadius:'50%', border:`2px solid ${C.danger}`, opacity:.5/(i+1) }} />)}
            <button onClick={go} style={{ position:'absolute', inset:30, borderRadius:'50%', background:`${sc.c}22`, border:`3px solid ${sc.c}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, transition:'all .3s' }}>{sc.e}</button>
          </div>
          <div style={{ fontWeight:700, fontSize:18, color:C.heading, marginBottom:8 }}>{sc.l}</div>
          {transcript&&<div style={{ background:C.surface, borderRadius:12, padding:14, marginTop:20, textAlign:'left' }}><div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>You said:</div><div style={{ color:C.text, fontStyle:'italic' }}>"{transcript}"</div></div>}
          {response&&<div style={{ background:`${C.primary}11`, border:`1px solid ${C.primary}33`, borderRadius:12, padding:14, marginTop:14, textAlign:'left' }}><div style={{ fontSize:12, color:C.primary, marginBottom:8, fontWeight:600 }}>CLARA:</div><div style={{ color:C.text, fontSize:14, lineHeight:1.6 }}>{response}</div></div>}
        </div>
        <div>
          <div className="card" style={{ marginBottom:14 }}>
            <h3 style={{ color:C.heading, marginBottom:14 }}>Language</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {langs.map(l=><button key={l} onClick={()=>setLang(l)} style={{ padding:'8px 12px', borderRadius:8, border:`1px solid ${lang===l?C.primary:C.border}`, background:lang===l?`${C.primary}22`:'transparent', color:lang===l?C.primary:C.text, cursor:'pointer', fontSize:13 }}>{l}</button>)}
            </div>
          </div>
          <div className="card">
            <h3 style={{ color:C.heading, marginBottom:12 }}>Voice Commands</h3>
            {['"Apply for benefits"','"Check my status"','"Find local offices"','"Explain this form"','"Set a deadline reminder"'].map(c=><div key={c} style={{ padding:'6px 0', borderBottom:`1px solid ${C.border}`, fontSize:13, color:C.muted, fontStyle:'italic' }}>{c}</div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PHASE 23: SMS ALERTS ──────────────────────────────────────────────────────
function SMSAlerts() {
  const [phone, setPhone] = useState('')
  const [saved, setSaved] = useState(false)
  const [alerts, setAlerts] = useState({deadlines:true,statusUpdates:true,newPrograms:false,documentReady:true,appointments:true})
  const history = [
    {d:'Feb 15',m:'CLEAR: Your SNAP renewal is due in 30 days. Tap to start: clear.gov/renew'},
    {d:'Feb 10',m:'CLEAR: Application #IL-2024-8847 updated: Approved! 🎉'},
    {d:'Jan 28',m:'CLEAR: New program available — Illinois Heating Assistance (LIHEAP). You may qualify.'},
    {d:'Jan 15',m:'CLEAR: Your Medicaid renewal documents are ready to download.'},
  ]
  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 23 — SMS Alerts</div><h1>SMS Alerts <span className="tn">NEW</span></h1><p>Text notifications for deadlines, status updates, and new programs.</p></div>
      <div className="g2">
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <h3 style={{ color:C.heading, marginBottom:20 }}>Setup Alerts</h3>
            <div style={{ marginBottom:16 }}><label>Mobile Number</label><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(555) 000-0000" /></div>
            {Object.entries(alerts).map(([k,v])=>(
              <div key={k} className="row">
                <span style={{ fontSize:14, color:C.text }}>{k.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</span>
                <div className="toggle" style={{ background:v?C.success:C.border }} onClick={()=>setAlerts(a=>({...a,[k]:!v}))}>
                  <div className="tknob" style={{ left:v?23:3 }} />
                </div>
              </div>
            ))}
            <button className="btn btn-primary" style={{ marginTop:20, width:'100%' }} onClick={()=>setSaved(true)}>
              {saved?'✅ Saved!':'💬 Enable SMS Alerts'}
            </button>
          </div>
        </div>
        <div className="card">
          <h3 style={{ color:C.heading, marginBottom:20 }}>Recent Alerts</h3>
          {history.map((h,i)=><div key={i} style={{ padding:14, background:C.surface, borderRadius:10, border:`1px solid ${C.border}`, marginBottom:10 }}><div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>{h.d}</div><div style={{ fontSize:13, color:C.text, lineHeight:1.5 }}>{h.m}</div></div>)}
          <div style={{ marginTop:16, padding:14, background:`${C.success}11`, borderRadius:10, border:`1px solid ${C.success}33` }}>
            <div style={{ fontSize:13, color:C.success, fontWeight:700, marginBottom:4 }}>✓ TCPA Compliant</div>
            <div style={{ fontSize:12, color:C.muted }}>Reply STOP anytime to unsubscribe.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PHASE 24: TAX ESTIMATOR ───────────────────────────────────────────────────
function TaxEstimator() {
  const [f, setF] = useState({ income:'', filing:'single', state:'IL', deps:0 })
  const [result, setResult] = useState(null)

  function calc() {
    const inc=parseFloat(f.income)||0
    const br=f.filing==='single'?[[0,11600,.10],[11600,47150,.12],[47150,100525,.22],[100525,191950,.24],[191950,Infinity,.32]]:[[0,23200,.10],[23200,94300,.12],[94300,201050,.22],[201050,383900,.24],[383900,Infinity,.32]]
    const std=f.filing==='single'?14600:29200
    const taxable=Math.max(0,inc-std-f.deps*2000)
    let fed=0; for(const [lo,hi,r] of br) fed+=Math.max(0,Math.min(taxable,hi)-lo)*r
    const st=taxable*(f.state==='IL'?.0495:.05)
    const fica=Math.min(inc,168600)*.0765
    const total=fed+st+fica
    setResult({inc,taxable,fed,st,fica,total,eff:inc>0?total/inc*100:0,monthly:inc/12-total/12})
  }

  const fmt = n=>Math.round(n).toLocaleString()

  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 24 — Tax Estimator</div><h1>Tax Estimator <span className="tn">NEW</span></h1><p>Estimate federal and state tax liability. Fortuna Engine integrated.</p></div>
      <div className="g2">
        <div className="card">
          <h3 style={{ color:C.heading, marginBottom:24 }}>Income Information</h3>
          <div style={{ display:'grid', gap:16 }}>
            <div><label>Annual Gross Income</label><input type="number" value={f.income} onChange={e=>setF(ff=>({...ff,income:e.target.value}))} placeholder="$0" /></div>
            <div><label>Filing Status</label><select value={f.filing} onChange={e=>setF(ff=>({...ff,filing:e.target.value}))}><option value="single">Single</option><option value="married">Married Filing Jointly</option></select></div>
            <div><label>State</label><select value={f.state} onChange={e=>setF(ff=>({...ff,state:e.target.value}))}><option value="IL">Illinois (4.95%)</option><option value="TX">Texas (0%)</option><option value="CA">California (~5%)</option><option value="NY">New York (~6%)</option></select></div>
            <div><label>Qualifying Dependents</label><input type="number" value={f.deps} onChange={e=>setF(ff=>({...ff,deps:parseInt(e.target.value)||0}))} min="0" max="10" /></div>
            <button className="btn btn-primary" onClick={calc} style={{ width:'100%' }}>🧮 Calculate Taxes</button>
          </div>
        </div>
        {result&&(
          <div className="card">
            <h3 style={{ color:C.heading, marginBottom:24 }}>Tax Breakdown</h3>
            <div style={{ display:'grid', gap:10, marginBottom:24 }}>
              {[['Gross Income',`$${fmt(result.inc)}`,C.text],['Taxable Income',`$${fmt(result.taxable)}`,C.text],['Federal Income Tax',`$${fmt(result.fed)}`,C.danger],['State Tax',`$${fmt(result.st)}`,C.warn],['FICA (SS + Medicare)',`$${fmt(result.fica)}`,C.warn],['Total Tax',`$${fmt(result.total)}`,C.danger]].map(([l,v,c])=>(
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontSize:14, color:C.muted }}>{l}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:c }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div style={{ padding:16, background:C.surface, borderRadius:10, textAlign:'center' }}><div style={{ fontSize:28, fontWeight:800, color:C.primary }}>{result.eff.toFixed(1)}%</div><div style={{ fontSize:12, color:C.muted }}>Effective Rate</div></div>
              <div style={{ padding:16, background:C.surface, borderRadius:10, textAlign:'center' }}><div style={{ fontSize:28, fontWeight:800, color:C.success }}>${fmt(result.monthly)}</div><div style={{ fontSize:12, color:C.muted }}>Monthly Take-Home</div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── PHASE 25: DOCUMENT OCR ────────────────────────────────────────────────────
function OCR() {
  const [stage, setStage] = useState('idle')
  const [fname, setFname] = useState('')
  const [drag, setDrag] = useState(false)

  function handle(e) {
    const file=e.target?.files?.[0]||e.dataTransfer?.files?.[0]
    if(!file)return
    setFname(file.name);setStage('scanning')
    setTimeout(()=>setStage('done'),3000)
  }

  const extracted = {type:'W-2 Form',employer:'Acme Corporation',ein:'12-3456789',wages:'$64,200.00',fedWithheld:'$7,840.00',ssWages:'$64,200.00',ssTax:'$3,980.40',medicare:'$930.90',stateWages:'$64,200.00',stateWithheld:'$3,178.00'}

  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 25 — Document OCR</div><h1>Document Scanner <span className="tn">NEW</span></h1><p>Upload any government document — we extract the key data automatically.</p></div>
      <div className="g2">
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <h3 style={{ color:C.heading, marginBottom:20 }}>Upload Document</h3>
            <label htmlFor="ocr-upload">
              <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);handle(e)}}
                style={{ border:`2px dashed ${drag?C.primary:C.border}`, borderRadius:12, padding:48, textAlign:'center', cursor:'pointer', background:drag?`${C.primary}11`:'transparent', transition:'all .2s' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>📷</div>
                <div style={{ fontWeight:600, color:C.heading, marginBottom:8 }}>Drop or click to upload</div>
                <div style={{ fontSize:13, color:C.muted }}>PDF · JPG · PNG · up to 20MB</div>
              </div>
            </label>
            <input id="ocr-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handle} style={{ display:'none' }} />
            {stage!=='idle'&&(
              <div style={{ marginTop:16, padding:14, background:C.surface, borderRadius:10 }}>
                <div style={{ fontSize:13, color:C.muted, marginBottom:8 }}>📄 {fname}</div>
                {stage==='scanning'&&<div style={{ fontSize:14, color:C.accent }}>🔍 Scanning with OCR engine…<div style={{ marginTop:8, height:4, borderRadius:2, background:C.border }}><div style={{ height:'100%', width:'60%', background:C.accent, borderRadius:2 }} /></div></div>}
                {stage==='done'&&<div style={{ fontSize:14, color:C.success }}>✅ Extraction complete!</div>}
              </div>
            )}
          </div>
          <div className="card">
            <h3 style={{ color:C.heading, marginBottom:12 }}>Supported Documents</h3>
            {['W-2 & 1099 Forms','Social Security Cards','Birth Certificates','Passports & IDs','Utility Bills','Lease Agreements','Benefit Letters','Insurance Cards'].map(d=><div key={d} style={{ display:'flex', gap:8, padding:'5px 0', fontSize:13, color:C.muted }}>✅ {d}</div>)}
          </div>
        </div>
        {stage==='done'&&(
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
              <span className="badge badge-green">✓ Extracted</span>
              <span style={{ fontWeight:600, color:C.heading }}>{extracted.type}</span>
            </div>
            {Object.entries(extracted).filter(([k])=>k!=='type').map(([k,v])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                <span style={{ fontSize:13, color:C.muted }}>{k.replace(/([A-Z])/g,' $1').trim()}</span>
                <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="btn btn-primary" style={{ flex:1 }}>Save to Profile</button>
              <button className="btn btn-outline" style={{ flex:1 }}>Auto-fill Forms</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── PHASE 26: BLOCKCHAIN ──────────────────────────────────────────────────────
function Blockchain() {
  const [id, setId] = useState('')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  function verify() {
    if(!id.trim())return
    setLoading(true)
    setTimeout(()=>{
      setData({hash:'0x7f9f2a0c3e8b…4d91c2a',block:'19,847,263',timestamp:'2024-03-15 14:32 UTC',issuer:'State of Illinois',type:'Business License',status:'VALID',chain:'Ethereum Mainnet'})
      setLoading(false)
    },2000)
  }

  const recent = [
    {id:'IL-BIZ-2024-9921',type:'Business License',status:'VALID',d:'Mar 15'},
    {id:'IL-DRV-2024-4401',type:"Driver's License",status:'VALID',d:'Feb 28'},
    {id:'IL-SNAP-2024-7712',type:'Benefits Letter',status:'VALID',d:'Feb 10'},
    {id:'IL-TAX-2023-1189',type:'Tax Certificate',status:'EXPIRED',d:'Jan 01'},
  ]

  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 26 — Blockchain Verification</div><h1>Document Verification <span className="tn">NEW</span></h1><p>Verify government documents on the Ethereum blockchain. Tamper-proof.</p></div>
      <div className="g2">
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <h3 style={{ color:C.heading, marginBottom:20 }}>Verify a Document</h3>
            <div style={{ marginBottom:14 }}><label>Document ID or Hash</label><input value={id} onChange={e=>setId(e.target.value)} placeholder="IL-BIZ-2024-9921 or 0x7f9f2a…" /></div>
            <button className="btn btn-primary" style={{ width:'100%' }} onClick={verify} disabled={loading}>
              🔗 {loading?'Checking blockchain…':'Verify Document'}
            </button>
          </div>
          {data&&(
            <div className="card">
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
                <span style={{ fontSize:32 }}>🛡️</span>
                <div><div style={{ fontWeight:700, color:C.heading }}>Document Verified</div><span className="badge badge-green">✓ AUTHENTIC</span></div>
              </div>
              {Object.entries(data).map(([k,v])=>(
                <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
                  <span style={{ color:C.muted }}>{k.charAt(0).toUpperCase()+k.slice(1)}</span>
                  <span style={{ color:k==='status'?C.success:C.text, fontWeight:k==='status'?700:400 }}>{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <h3 style={{ color:C.heading, marginBottom:16 }}>Recent Verifications</h3>
            {recent.map(r=>(
              <div key={r.id} style={{ padding:12, background:C.surface, borderRadius:10, border:`1px solid ${C.border}`, marginBottom:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:C.text }}>{r.type}</span>
                  <span className={`badge ${r.status==='VALID'?'badge-green':'badge-blue'}`}>{r.status}</span>
                </div>
                <div style={{ fontSize:12, color:C.muted }}>{r.id} · {r.d}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <h3 style={{ color:C.heading, marginBottom:12 }}>How It Works</h3>
            {['Document hash stored on Ethereum — immutable record','Verify from anywhere in seconds','No personal data stored on-chain (GDPR compliant)','Integrated with Illinois state issuers'].map((s,i)=>(
              <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
                <span style={{ color:C.accent, fontWeight:700 }}>{i+1}.</span>
                <span style={{ color:C.muted }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── PHASE 27: SOCIAL LOGIN ────────────────────────────────────────────────────
function SocialLogin() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [via, setVia] = useState('')
  const [twoFA, setTwoFA] = useState(false)
  const [bio, setBio] = useState(false)
  const providers = [{n:'Google',i:'🔵'},{n:'Apple',i:'🍎'},{n:'Facebook',i:'📘'},{n:'GitHub',i:'⚫'},{n:'Login.gov',i:'🏛️',fed:true}]

  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 27 — Social Login</div><h1>Secure Authentication <span className="tn">NEW</span></h1><p>One-click sign-in. Federal Login.gov integration for verified identity.</p></div>
      <div className="g2">
        {!loggedIn?(
          <div className="card">
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔐</div>
              <h3 style={{ color:C.heading, fontSize:20 }}>Sign In to CLEAR</h3>
              <p style={{ color:C.muted, fontSize:14, marginTop:8 }}>Your data stays private and secure</p>
            </div>
            {providers.map(p=>(
              <button key={p.n} onClick={()=>{setVia(p.n);setLoggedIn(true)}} style={{ display:'flex', alignItems:'center', gap:16, padding:'13px 18px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, cursor:'pointer', color:C.text, fontSize:15, fontWeight:500, width:'100%', marginBottom:10 }}>
                <span style={{ fontSize:20 }}>{p.i}</span>Continue with {p.n}{p.fed&&<span className="badge badge-blue" style={{ marginLeft:'auto' }}>Federal ID</span>}
              </button>
            ))}
            <div style={{ marginTop:16, padding:14, background:C.surface, borderRadius:10, textAlign:'center', fontSize:12, color:C.muted }}>🔒 256-bit encrypted · FISMA compliant · No password stored</div>
          </div>
        ):(
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:C.primary, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:18, color:'#fff' }}>TG</div>
              <div>
                <div style={{ fontWeight:700, color:C.heading, fontSize:18 }}>Travis Gray</div>
                <div style={{ color:C.muted, fontSize:14 }}>travis@example.com</div>
                <span className="badge badge-green">✓ Signed in via {via}</span>
              </div>
            </div>
            <h4 style={{ color:C.heading, marginBottom:14 }}>Security Settings</h4>
            {[{l:'Two-Factor Authentication',v:twoFA,s:setTwoFA,d:'SMS or authenticator app'},{l:'Biometric Login',v:bio,s:setBio,d:'Face ID / Touch ID'}].map(s=>(
              <div key={s.l} className="row">
                <div><div style={{ fontSize:14, color:C.text }}>{s.l}</div><div style={{ fontSize:12, color:C.muted }}>{s.d}</div></div>
                <div className="toggle" style={{ background:s.v?C.success:C.border }} onClick={()=>s.s(v=>!v)}><div className="tknob" style={{ left:s.v?23:3 }} /></div>
              </div>
            ))}
            <button className="btn btn-outline" style={{ marginTop:20, width:'100%' }} onClick={()=>setLoggedIn(false)}>Sign Out</button>
          </div>
        )}
        <div className="card">
          <h3 style={{ color:C.heading, marginBottom:16 }}>Login.gov Access</h3>
          <p style={{ fontSize:14, color:C.muted, lineHeight:1.7, marginBottom:16 }}>Login.gov gives you verified identity access to 40+ federal agencies with a single account.</p>
          {['SSA — Social Security Administration','IRS — Internal Revenue Service','USCIS — Immigration Services','VA — Veterans Affairs','SBA — Small Business Administration'].map(a=><div key={a} style={{ display:'flex', gap:8, padding:'5px 0', fontSize:13, color:C.muted }}>✅ {a}</div>)}
        </div>
      </div>
    </div>
  )
}

// ── PHASE 28: REFERRAL ────────────────────────────────────────────────────────
function Referral() {
  const [copied, setCopied] = useState(false)
  const code = 'CLEAR-TRAVIS-K9X2'
  const lb = [
    {r:1,n:'Maria S.',refs:47,e:'$235',b:'🥇'},
    {r:2,n:'James K.',refs:38,e:'$190',b:'🥈'},
    {r:3,n:'Priya M.',refs:31,e:'$155',b:'🥉'},
    {r:4,n:'Travis G.',refs:12,e:'$60',b:'⭐',you:true},
    {r:5,n:'Luis R.',refs:9,e:'$45',b:''},
  ]
  const tiers = [{refs:1,r:'$5 credit'},{refs:5,r:'$10 + Badge'},{refs:10,r:'$25 + Pro month'},{refs:25,r:'$100 + Ambassador'}]

  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 28 — Referral Program</div><h1>Refer & Earn <span className="tn">NEW</span></h1><p>Earn rewards for every person you help navigate government processes.</p></div>
      <div className="g2">
        <div>
          <div className="card" style={{ marginBottom:16 }}>
            <h3 style={{ color:C.heading, marginBottom:14 }}>Your Referral Code</h3>
            <div style={{ background:C.surface, borderRadius:10, padding:16, border:`1px solid ${C.border}`, marginBottom:12 }}>
              <div style={{ fontSize:12, color:C.muted, marginBottom:6 }}>Code</div>
              <div style={{ fontSize:22, fontWeight:800, color:C.primary, letterSpacing:'.05em' }}>{code}</div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <input value={`https://clear-platform.netlify.app?ref=${code}`} readOnly style={{ fontSize:12 }} />
              <button className="btn btn-primary" onClick={()=>setCopied(true)} style={{ flexShrink:0 }}>{copied?'✓ Copied!':'Copy'}</button>
            </div>
          </div>
          <div className="card" style={{ marginBottom:16 }}>
            <h3 style={{ color:C.heading, marginBottom:14 }}>Your Stats</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, textAlign:'center' }}>
              {[['12','Referrals'],['$60','Earned'],['#4','Rank']].map(([v,l])=>(
                <div key={l} style={{ padding:14, background:C.surface, borderRadius:10 }}><div style={{ fontSize:24, fontWeight:800, color:C.primary }}>{v}</div><div style={{ fontSize:12, color:C.muted }}>{l}</div></div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 style={{ color:C.heading, marginBottom:14 }}>Reward Tiers</h3>
            {tiers.map((t,i)=>(
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${C.border}`, fontSize:14 }}>
                <span style={{ color:C.text }}>{t.refs} referral{t.refs>1?'s':''}</span>
                <span style={{ color:C.success, fontWeight:700 }}>{t.r}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{ color:C.heading, marginBottom:20 }}>Leaderboard</h3>
          {lb.map(r=>(
            <div key={r.r} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 12px', background:r.you?`${C.primary}11`:C.surface, borderRadius:10, border:`1px solid ${r.you?C.primary:C.border}`, marginBottom:8 }}>
              <span style={{ fontSize:20, width:26 }}>{r.b||r.r}</span>
              <div style={{ flex:1 }}><div style={{ fontWeight:600, color:r.you?C.primary:C.heading, fontSize:14 }}>{r.n}{r.you?' (You)':''}</div><div style={{ fontSize:12, color:C.muted }}>{r.refs} referrals</div></div>
              <span style={{ fontWeight:700, color:C.success }}>{r.e}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── PHASE 29: PREMIUM ─────────────────────────────────────────────────────────
function Premium() {
  const [billing, setBilling] = useState('monthly')
  const [sel, setSel] = useState('pro')
  const plans = [
    {id:'free',n:'Free',p:{monthly:0,annual:0},c:C.muted,feats:['5 process guides/month','Basic AI (10 msgs)','Community forums','Email support'],missing:['Unlimited AI','Document OCR','SMS Alerts','Tax Estimator']},
    {id:'pro',n:'Pro',p:{monthly:12,annual:99},c:C.primary,pop:true,feats:['Unlimited guides','CLARA AI (unlimited)','Document OCR (50/mo)','SMS Alerts','Tax Estimator','Priority support'],missing:['API access','White-label','Team management']},
    {id:'org',n:'Organization',p:{monthly:49,annual:399},c:C.accent,feats:['Everything in Pro','Unlimited OCR','API access','White-label branding','20 team seats','Dedicated account manager','SLA guarantee'],missing:[]},
  ]
  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 29 — Premium Tiers</div><h1>Upgrade Access <span className="tn">NEW</span></h1><p>Full AI, document tools, and priority support.</p></div>
      <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
        <div style={{ display:'flex', background:C.surface, borderRadius:10, padding:4, border:`1px solid ${C.border}` }}>
          {['monthly','annual'].map(b=>(
            <button key={b} onClick={()=>setBilling(b)} style={{ padding:'8px 24px', borderRadius:8, border:'none', cursor:'pointer', background:billing===b?C.primary:'transparent', color:billing===b?'#fff':C.muted, fontWeight:600, fontSize:14, transition:'all .2s' }}>
              {b.charAt(0).toUpperCase()+b.slice(1)}{b==='annual'&&<span style={{ marginLeft:8, fontSize:10, background:C.success, color:'#fff', padding:'2px 6px', borderRadius:10 }}>Save 30%</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="g3">
        {plans.map(plan=>(
          <div key={plan.id} onClick={()=>setSel(plan.id)} className="card" style={{ border:`2px solid ${sel===plan.id?plan.c:C.border}`, cursor:'pointer', transition:'all .2s', position:'relative', transform:plan.pop?'scale(1.04)':'none' }}>
            {plan.pop&&<div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:C.primary, color:'#fff', fontSize:11, fontWeight:700, padding:'4px 16px', borderRadius:20 }}>MOST POPULAR</div>}
            <h3 style={{ color:plan.c, fontSize:20, marginBottom:8 }}>{plan.n}</h3>
            <div style={{ marginBottom:20 }}><span style={{ fontSize:40, fontWeight:800, color:C.heading }}>${plan.p[billing]}</span><span style={{ color:C.muted, fontSize:14 }}>/{billing==='annual'?'yr':'mo'}</span></div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
              {plan.feats.map(f=><div key={f} style={{ display:'flex', gap:10, fontSize:13, color:C.text }}>✅ {f}</div>)}
              {plan.missing.slice(0,3).map(f=><div key={f} style={{ display:'flex', gap:10, fontSize:13, color:C.muted }}>✗ {f}</div>)}
            </div>
            <button className={`btn ${sel===plan.id?'btn-primary':'btn-outline'}`} style={{ width:'100%' }}>{plan.id==='free'?'Current Plan':`Get ${plan.n}`}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PHASE 30: ANNUAL REPORTS ──────────────────────────────────────────────────
function AnnualReports() {
  const [yr, setYr] = useState(2024)
  const data = {
    2024:{users:12400,guides:89234,saved:'$4.2M',hours:142000,nps:72,growth:'+34%',top:'SNAP Application'},
    2023:{users:9200,guides:61000,saved:'$2.8M',hours:98000,nps:68,growth:'+61%',top:'LLC Formation'},
    2022:{users:5700,guides:28000,saved:'$1.1M',hours:42000,nps:61,growth:'+190%',top:'Unemployment'},
  }
  const d = data[yr]
  const demos = [{g:'First-time applicants',p:48},{g:'Low-income households',p:36},{g:'Small business owners',p:22},{g:'Veterans',p:18},{g:'Immigrants & refugees',p:14}]

  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 30 — Annual Reports</div><h1>Impact Reports <span className="tn">NEW</span></h1><p>Measuring the real-world impact of making government accessible.</p></div>
      <div style={{ display:'flex', gap:10, marginBottom:32 }}>
        {[2024,2023,2022].map(y=>(
          <button key={y} onClick={()=>setYr(y)} style={{ padding:'8px 24px', borderRadius:8, border:`2px solid ${yr===y?C.primary:C.border}`, background:yr===y?`${C.primary}22`:'transparent', color:yr===y?C.primary:C.muted, cursor:'pointer', fontWeight:700, transition:'all .2s' }}>{y}</button>
        ))}
      </div>
      <div style={{ background:`linear-gradient(135deg,${C.primary}22,${C.accent}11)`, border:`1px solid ${C.primary}33`, borderRadius:16, padding:48, textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:14, color:C.accent, fontWeight:600, marginBottom:8 }}>{yr} Impact</div>
        <div style={{ fontSize:64, fontWeight:900, color:C.heading, marginBottom:8 }}>{d.saved}</div>
        <div style={{ fontSize:18, color:C.muted }}>saved by users in fees, time, and missed benefits</div>
        <div style={{ marginTop:16 }}><span className="badge badge-green">📈 {d.growth} YoY</span></div>
      </div>
      <div className="g3" style={{ marginBottom:32 }}>
        {[['👥',d.users.toLocaleString(),'Users'],['📚',d.guides.toLocaleString(),'Guides Completed'],['⏰',d.hours.toLocaleString(),'Hours Saved'],['🏆',d.top,'Top Process'],['❤️',d.nps,'NPS Score'],['📈',d.growth,'Year-over-Year']].map(([i,v,l])=>(
          <div key={l} className="card">
            <div style={{ fontSize:28, marginBottom:10 }}>{i}</div>
            <div style={{ fontSize:28, fontWeight:800, color:C.heading, marginBottom:4 }}>{v}</div>
            <div style={{ fontSize:13, color:C.muted }}>{l}</div>
          </div>
        ))}
      </div>
      <div className="g2">
        <div className="card">
          <h3 style={{ color:C.heading, marginBottom:20 }}>Who We Served</h3>
          {demos.map(dg=>(
            <div key={dg.g} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                <span style={{ color:C.text }}>{dg.g}</span>
                <span style={{ color:C.primary, fontWeight:700 }}>{dg.p}%</span>
              </div>
              <div style={{ height:6, background:C.border, borderRadius:3, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${dg.p}%`, background:C.primary, borderRadius:3 }} />
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{ color:C.heading, marginBottom:20 }}>Year-over-Year</h3>
          {[2024,2023,2022].map(y=>(
            <div key={y} style={{ padding:14, background:y===yr?`${C.primary}11`:C.surface, borderRadius:10, border:`1px solid ${y===yr?C.primary:C.border}`, marginBottom:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, color:C.heading }}>{y}</div>
                <div style={{ fontSize:12, color:C.muted }}>{data[y].users.toLocaleString()} users · {data[y].guides.toLocaleString()} guides</div>
              </div>
              <span className="badge badge-green">{data[y].growth}</span>
            </div>
          ))}
          <button className="btn btn-outline" style={{ marginTop:16, width:'100%' }}>📄 Download PDF</button>
        </div>
      </div>
    </div>
  )
}

function Placeholder({title,phase}) {
  return (
    <div className="page">
      <div className="ph"><div className="pt">{phase}</div><h1>{title}</h1></div>
      <div className="card" style={{ textAlign:'center', padding:48 }}>
        <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
        <div style={{ fontWeight:700, color:C.heading, fontSize:20, marginBottom:8 }}>Live & Operational</div>
        <div style={{ color:C.muted }}>This feature is part of the CLEAR platform (Phases 1-20).</div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <style>{css}</style>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/processmap" element={<ProcessMap />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/documents" element={<Placeholder title="Document Generator" phase="Phase 16" />} />
          <Route path="/notifications" element={<Placeholder title="Notification Center" phase="Phase 17" />} />
          <Route path="/achievements" element={<Placeholder title="Achievements" phase="Phase 18" />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/voice" element={<Voice />} />
          <Route path="/sms-alerts" element={<SMSAlerts />} />
          <Route path="/tax-estimator" element={<TaxEstimator />} />
          <Route path="/ocr" element={<OCR />} />
          <Route path="/blockchain" element={<Blockchain />} />
          <Route path="/social-login" element={<SocialLogin />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/annual-reports" element={<AnnualReports />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

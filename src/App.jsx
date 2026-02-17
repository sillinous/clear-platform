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
function Knowledge() {
  const articles = [
    { t:'How to Apply for SNAP Benefits', v:4200, c:'Benefits' },
    { t:'Starting a Business: Step-by-Step', v:3800, c:'Business' },
    { t:'Understanding Social Security Benefits', v:3100, c:'Benefits' },
    { t:'How to Get a Green Card', v:2900, c:'Immigration' },
    { t:'Applying for Unemployment Insurance', v:2700, c:'Benefits' },
    { t:'VA Healthcare Enrollment Guide', v:2400, c:'Veterans' },
  ]
  return (
    <div className="page">
      <div className="ph"><div className="pt">Phase 19</div><h1>Knowledge Base</h1><p>800+ guides and FAQs for every government process.</p></div>
      <div style={{ marginBottom:20 }}><input placeholder="Search 800+ articles..." /></div>
      <div style={{ display:'grid', gap:12 }}>
        {articles.map(a=>(
          <div key={a.t} className="card" style={{ display:'flex', alignItems:'center', gap:16, cursor:'pointer' }}>
            <div style={{ flex:1 }}>
              <span className="badge badge-blue" style={{ marginBottom:8 }}>{a.c}</span>
              <div style={{ fontWeight:600, color:C.heading, fontSize:15, marginBottom:4 }}>{a.t}</div>
              <div style={{ color:C.muted, fontSize:13 }}>{a.v.toLocaleString()} views</div>
            </div>
            <span style={{ color:C.muted }}>▶</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PHASE 21: AI ASSISTANT ────────────────────────────────────────────────────
function AIAssistant() {
  const [msgs, setMsgs] = useState([{ role:'ai', text:"Hi! I'm CLARA — your government process assistant. Ask me anything about benefits, permits, applications, or any government process." }])
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

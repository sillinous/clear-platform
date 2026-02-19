import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'

const C = {
  bg: '#0a0f1e', surface: '#111827', card: '#1a2235', border: '#1e3a5f',
  primary: '#3b82f6', accent: '#06b6d4', success: '#10b981', warn: '#f59e0b',
  danger: '#ef4444', muted: '#6b7280', text: '#e2e8f0', heading: '#f8fafc',
}

// ═══════════════════════════════════════════════════════════════════════════════
// CASE STORE — localStorage-backed persistent state, shared across all components
// ═══════════════════════════════════════════════════════════════════════════════

const CASE_CATEGORIES = {
  benefits:   { label:'Benefits',   icon:'🍎', color:'#10b981' },
  housing:    { label:'Housing',    icon:'🏠', color:'#3b82f6' },
  legal:      { label:'Legal',      icon:'⚖️', color:'#8b5cf6' },
  employment: { label:'Employment', icon:'💼', color:'#f59e0b' },
  business:   { label:'Business',  icon:'🏢', color:'#06b6d4' },
  healthcare: { label:'Healthcare', icon:'💊', color:'#ec4899' },
  education:  { label:'Education', icon:'🎓', color:'#14b8a6' },
  immigration:{ label:'Immigration',icon:'🌍', color:'#fb923c' },
  reentry:    { label:'Reentry',   icon:'🔄', color:'#a855f7' },
  other:      { label:'Other',     icon:'📁', color:'#6b7280' },
}

const CASE_STATUSES = {
  active:    { label:'Active',     color:'#3b82f6', icon:'🔵' },
  pending:   { label:'Waiting',    color:'#f59e0b', icon:'🟡' },
  urgent:    { label:'Urgent',     color:'#ef4444', icon:'🔴' },
  completed: { label:'Completed',  color:'#10b981', icon:'✅' },
  paused:    { label:'On Hold',    color:'#6b7280', icon:'⏸️' },
}

function loadCases() {
  try { return JSON.parse(localStorage.getItem('clear_cases') || '[]') } catch { return [] }
}
function saveCases(cases) {
  try { localStorage.setItem('clear_cases', JSON.stringify(cases)) } catch {}
}
function loadDeadlines() {
  try { return JSON.parse(localStorage.getItem('clear_deadlines') || '[]') } catch { return [] }
}
function saveDeadlines(deadlines) {
  try { localStorage.setItem('clear_deadlines', JSON.stringify(deadlines)) } catch {}
}

function newId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6) }

function deadlineUrgency(dateStr) {
  if (!dateStr) return 'none'
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  if (diff <= 3) return 'soon'
  if (diff <= 7) return 'week'
  return 'upcoming'
}

function urgencyColor(u) {
  return {overdue:'#ef4444',today:'#f97316',soon:'#f59e0b',week:'#3b82f6',upcoming:'#6b7280',none:'#6b7280'}[u]||'#6b7280'
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000)
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return `${diff} days`
}

// Global event bus for cross-component case updates
const caseListeners = new Set()
function notifyCaseUpdate() { caseListeners.forEach(fn => fn()) }

function useCaseStore() {
  const [cases, setCasesState] = useState(loadCases)
  const [deadlines, setDeadlinesState] = useState(loadDeadlines)

  useEffect(() => {
    const refresh = () => {
      setCasesState(loadCases())
      setDeadlinesState(loadDeadlines())
    }
    caseListeners.add(refresh)
    return () => caseListeners.delete(refresh)
  }, [])

  const addCase = useCallback((caseData) => {
    const newCase = {
      id: newId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      steps: [],
      completedSteps: [],
      notes: '',
      ...caseData,
    }
    const updated = [newCase, ...loadCases()]
    saveCases(updated)
    setCasesState(updated)
    notifyCaseUpdate()
    return newCase
  }, [])

  const updateCase = useCallback((id, patch) => {
    const updated = loadCases().map(c => c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c)
    saveCases(updated)
    setCasesState(updated)
    notifyCaseUpdate()
  }, [])

  const deleteCase = useCallback((id) => {
    const updated = loadCases().filter(c => c.id !== id)
    const dl = loadDeadlines().filter(d => d.caseId !== id)
    saveCases(updated)
    saveDeadlines(dl)
    setCasesState(updated)
    setDeadlinesState(dl)
    notifyCaseUpdate()
  }, [])

  const addDeadline = useCallback((deadlineData) => {
    const newDl = { id: newId(), createdAt: new Date().toISOString(), ...deadlineData }
    const updated = [newDl, ...loadDeadlines()]
    saveDeadlines(updated)
    setDeadlinesState(updated)
    notifyCaseUpdate()
    return newDl
  }, [])

  const deleteDeadline = useCallback((id) => {
    const updated = loadDeadlines().filter(d => d.id !== id)
    saveDeadlines(updated)
    setDeadlinesState(updated)
    notifyCaseUpdate()
  }, [])

  const toggleStep = useCallback((caseId, stepIdx) => {
    const c = loadCases().find(x => x.id === caseId)
    if (!c) return
    const done = new Set(c.completedSteps || [])
    done.has(stepIdx) ? done.delete(stepIdx) : done.add(stepIdx)
    updateCase(caseId, { completedSteps: [...done] })
  }, [updateCase])

  // Computed
  const urgentCount = [...cases.filter(c=>c.status==='urgent'&&c.status!=='completed'),
    ...deadlines.filter(d=>['overdue','today'].includes(deadlineUrgency(d.date)))
  ].length

  return { cases, deadlines, addCase, updateCase, deleteCase, addDeadline, deleteDeadline, toggleStep, urgentCount }
}

// Global accessor for non-hook contexts (toast, CLARA, etc.)
function addCaseGlobal(caseData) {
  const existing = loadCases()
  const newCase = {
    id: newId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    status: 'active', steps: [], completedSteps: [], notes: '', ...caseData,
  }
  saveCases([newCase, ...existing])
  notifyCaseUpdate()
  return newCase
}
function addDeadlineGlobal(data) {
  const existing = loadDeadlines()
  const newDl = { id: newId(), createdAt: new Date().toISOString(), ...data }
  saveDeadlines([newDl, ...existing])
  notifyCaseUpdate()
  return newDl
}


const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing:border-box;margin:0;padding:0; }
  body { background:${C.bg};color:${C.text};font-family:'Inter',system-ui,sans-serif;min-height:100vh; }
  a { color:inherit;text-decoration:none; }
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}::-webkit-scrollbar-thumb:hover{background:${C.muted}}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:8px;border:none;cursor:pointer;font-size:14px;font-weight:600;transition:all .18s cubic-bezier(.4,0,.2,1)}
  .btn-primary{background:${C.primary};color:#fff;box-shadow:0 1px 3px rgba(59,130,246,.3)}.btn-primary:hover{background:#2563eb;transform:translateY(-1px);box-shadow:0 4px 12px rgba(59,130,246,.35)}
  .btn-outline{background:transparent;color:${C.primary};border:1px solid ${C.primary}}.btn-outline:hover{background:${C.primary}18;transform:translateY(-1px)}
  .btn-ghost{background:transparent;color:${C.muted};border:1px solid ${C.border}}.btn-ghost:hover{background:${C.surface};border-color:${C.muted};color:${C.text}}
  .btn-success{background:${C.success};color:#fff;box-shadow:0 1px 3px rgba(16,185,129,.3)}.btn-success:hover{background:#059669;transform:translateY(-1px)}
  .btn-sm{padding:6px 12px;font-size:12px;border-radius:6px}
  .card{background:${C.card};border:1px solid ${C.border};border-radius:14px;padding:24px;transition:border-color .18s,box-shadow .18s,transform .18s}
  .card-sm{padding:16px}
  .card-hover:hover{border-color:${C.primary}44;box-shadow:0 4px 20px rgba(59,130,246,.08);transform:translateY(-1px);cursor:pointer}
  .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.01em}
  .badge-blue{background:#1e40af22;color:#60a5fa}.badge-green{background:#064e3b22;color:#34d399}
  .badge-gold{background:#78350f22;color:#fbbf24}.badge-purple{background:#4c1d9522;color:#a78bfa}
  .badge-red{background:#7f1d1d22;color:#f87171}
  .g2{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
  .g3{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
  input,textarea,select{background:${C.surface};border:1px solid ${C.border};border-radius:10px;color:${C.text};padding:10px 14px;font-size:14px;width:100%;outline:none;transition:border-color .18s,box-shadow .18s;font-family:inherit}
  input:focus,textarea:focus,select:focus{border-color:${C.primary};box-shadow:0 0 0 3px ${C.primary}18}
  label{display:block;font-size:13px;color:${C.muted};margin-bottom:6px;font-weight:500}
  .page{max-width:1200px;margin:0 auto;padding:32px 24px}
  .ph{margin-bottom:36px}.ph h1{font-size:32px;font-weight:800;color:${C.heading};margin-bottom:8px;letter-spacing:-.02em}
  .ph p{color:${C.muted};font-size:16px;line-height:1.6}
  .pt{font-size:11px;font-weight:700;letter-spacing:.08em;color:${C.accent};text-transform:uppercase;margin-bottom:6px}
  .tn{background:#0891b222;color:#22d3ee;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:700}
  .toggle{width:44px;height:24px;border-radius:12px;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0}
  .tknob{position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;transition:left .2s}
  .row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid ${C.border}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:none}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.18)}100%{transform:scale(1)}}
  @keyframes confetti-fall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(100px) rotate(360deg);opacity:0}}
  .fade-up{animation:fadeUp .35s cubic-bezier(.22,.61,.36,1) both}
  .fade-in{animation:fadeIn .25s ease both}
  .slide-in{animation:slideIn .3s ease both}
  .card{background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:24px;transition:border-color .2s,box-shadow .2s}
  .card-hover:hover{border-color:${C.primary}44;box-shadow:0 4px 24px rgba(59,130,246,.08);cursor:pointer}
  .progress-bar-track{height:3px;background:${C.border};border-radius:2px;overflow:hidden}
  .progress-bar-fill{height:100%;border-radius:2px;transition:width .4s ease}
  .step-done{background:${C.success}!important;border-color:${C.success}!important;color:#fff!important}
  .step-done-text{color:${C.muted}!important;text-decoration:line-through;text-decoration-color:${C.success}66}
  .tag-pill{padding:3px 9px;border-radius:20px;font-size:11px;cursor:pointer;transition:all .15s;border:1px solid transparent}
  .tag-pill:hover{border-color:${C.primary};color:${C.primary}!important}
  .kbd{display:inline-block;padding:1px 6px;background:${C.surface};border:1px solid ${C.border};border-bottom-width:2px;border-radius:4px;font-size:10px;font-family:monospace;color:${C.muted}}
  .copy-btn{padding:2px 8px;border-radius:4px;border:1px solid ${C.border};background:transparent;color:${C.muted};cursor:pointer;font-size:10px;transition:all .15s}
  .copy-btn:hover{border-color:${C.success};color:${C.success}}
  .toc-link{display:block;padding:6px 10px;border-radius:6px;font-size:12px;color:${C.muted};cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all .15s}
  .toc-link:hover,.toc-link.active{background:${C.primary}15;color:${C.primary}}
  .reading-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:9999;pointer-events:none}
  .highlight{background:#fbbf2433;color:#fbbf24;border-radius:2px;padding:0 1px}
  input::placeholder{color:${C.muted}44}
  .modal-overlay{position:fixed;inset:0;background:#00000088;backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease}
  .modal-content{background:${C.card};border:1px solid ${C.border};border-radius:16px;width:min(640px,95vw);max-height:85vh;overflow:hidden;display:flex;flex-direction:column;animation:fadeUp .25s ease}
  @keyframes toast-in{from{opacity:0;transform:translateY(20px) scale(.95)}to{opacity:1;transform:none}}
  @keyframes toast-out{from{opacity:1;transform:none}to{opacity:0;transform:translateY(10px) scale(.95)}}
  .toast{pointer-events:none;padding:12px 18px;background:${C.card};border:1px solid ${C.border};border-radius:12px;font-size:13px;font-weight:600;color:${C.heading};box-shadow:0 8px 32px #00000060;display:flex;align-items:center;gap:10;animation:toast-in .25s ease;backdrop-filter:blur(12px);min-width:220px;max-width:340px}
  .filter-chip{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid;transition:all .15s}
  .stat-card{background:${C.card};border:1px solid ${C.border};border-radius:14px;padding:18px 20px;display:flex;align-items:center;gap:14;transition:all .18s}
  .stat-card:hover{border-color:${C.primary}44;box-shadow:0 4px 20px rgba(59,130,246,.06)}
  .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .section-title{font-size:15px;font-weight:700;color:${C.heading};display:flex;align-items:center;gap:8px}
  .see-all-btn{font-size:12px;color:${C.primary};background:none;border:none;cursor:pointer;font-weight:600;padding:4px 8px;border-radius:6px;transition:background .15s}
  .see-all-btn:hover{background:${C.primary}15}
  .nav-tooltip{position:absolute;left:100%;top:50%;transform:translateY(-50%);margin-left:10px;background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;color:${C.heading};white-space:nowrap;pointer-events:none;opacity:0;transition:opacity .15s;box-shadow:0 4px 16px #00000040;z-index:100}
  .nav-item:hover .nav-tooltip{opacity:1}
  .topbar{height:52px;background:${C.surface};border-bottom:1px solid ${C.border};display:flex;align-items:center;padding:0 20px;gap:14;position:sticky;top:0;z-index:200;backdrop-filter:blur(12px)}
  .search-pill{display:flex;align-items:center;gap:8px;background:${C.card};border:1px solid ${C.border};border-radius:8px;padding:7px 14px;cursor:text;transition:all .15s;flex:1;max-width:400px}
  .search-pill:hover{border-color:${C.primary}44}
  .search-pill input{background:none;border:none;outline:none;font-size:13px;color:${C.text};flex:1;min-width:0;font-family:inherit}
  .preview-popup{position:absolute;z-index:300;width:280px;background:${C.card};border:1px solid ${C.border};border-radius:12px;padding:16px;box-shadow:0 8px 32px #00000060;pointer-events:none;animation:fadeUp .18s ease}
  @media(max-width:900px){
    .page{padding:16px 14px}
    .kb-layout{grid-template-columns:1fr!important}
    .kb-sidebar{display:none!important}
    .article-2col{grid-template-columns:1fr!important}
    .article-sidebar{position:static!important;display:none!important}
    .hide-mobile{display:none!important}
    .show-mobile{display:flex!important}
    .mobile-bottom-nav{display:flex!important}
    .topbar-search{display:none!important}
  }
  .mobile-bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:${C.surface};border-top:1px solid ${C.border};z-index:500;padding:8px 0 env(safe-area-inset-bottom)}
`

const NAVGROUPS = [
  { label:'Core', items:[
    { label:'Home', path:'/', icon:'🏠' },
    { label:'My Cases', path:'/cases', icon:'📋', badge:'cases' },
    { label:'Process Map', path:'/processmap', icon:'🗺️' },
    { label:'Knowledge Base', path:'/knowledge', icon:'📚' },
  ]},
  { label:'Tools', items:[
    { label:'Documents', path:'/documents', icon:'📄' },
    { label:'My Cases', path:'/cases', icon:'📋' },
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

// ── TOAST SYSTEM ────────────────────────────────────────────────────────────
let _toastId = 0
const _toastListeners = new Set()
function showToast(msg, type='success', dur=2800) {
  const id = ++_toastId
  _toastListeners.forEach(fn => fn({ id, msg, type, dur }))
}
window.showToast = showToast

function ToastContainer() {
  const [toasts, setToasts] = useState([])
  useState(() => {
    const fn = (t) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), t.dur)
    }
    _toastListeners.add(fn)
  }, [])
  const icons = { success:'✓', error:'✕', info:'ℹ', warn:'⚠' }
  const colors = { success:C.success, error:C.danger, info:C.primary, warn:C.warn }
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10, pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span style={{ color:colors[t.type]||C.primary, fontSize:16 }}>{icons[t.type]||'✓'}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  )
}

function Layout({ children }) {
  const [open, setOpen] = useState(true)
  const loc = useLocation()
  const { urgentCount } = useCaseStore()
  const mobileNavItems = [
    { label:'Home', path:'/', icon:'🏠' },
    { label:'Cases', path:'/cases', icon:'📋' },
    { label:'Knowledge', path:'/knowledge', icon:'📚' },
    { label:'CLARA', path:'/ai-assistant', icon:'🤖' },
    { label:'More', path:'/premium', icon:'👑' },
  ]
  return (
    <div style={{ display:'flex', minHeight:'100vh', flexDirection:'column' }}>
      <ToastContainer />

      {/* Top bar */}
      <div className="topbar" style={{ marginLeft: open ? 240 : 52, transition:'margin .2s' }}>
        <div style={{ fontSize:11, fontWeight:800, color:C.primary, letterSpacing:'.1em', marginRight:8, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ background:`${C.primary}22`, padding:'2px 8px', borderRadius:4 }}>CLEAR</span>
        </div>
        <div className="search-pill topbar-search" style={{ flex:1, maxWidth:380 }}>
          <span style={{ fontSize:14, color:C.muted }}>🔍</span>
          <input placeholder="Search guides… (⌘K)" onFocus={()=>{ if(loc.pathname!=='/knowledge') window.location.href='/knowledge' }} style={{ fontSize:13 }} readOnly />
          <span className="kbd">⌘K</span>
        </div>
        <div style={{ flex:1 }} />
        <Link to="/knowledge" style={{ padding:'6px 12px', borderRadius:8, background:`${C.primary}15`, color:C.primary, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
          📚 Knowledge Base
        </Link>
        <Link to="/ai-assistant" style={{ padding:'6px 12px', borderRadius:8, background:`${C.success}15`, color:C.success, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
          🤖 Ask CLARA
        </Link>
      </div>

      <div style={{ display:'flex', flex:1, minHeight:0 }}>
        {/* Sidebar */}
        <aside style={{ width:open?240:52, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', transition:'width .2s', overflow:'hidden', position:'sticky', top:52, height:'calc(100vh - 52px)', flexShrink:0 }} className="hide-mobile">
          <div style={{ padding:'12px 10px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:10 }}>
            {open && <Link to="/" style={{ fontWeight:900, fontSize:17, color:C.primary, flex:1, letterSpacing:'.02em' }}>CLEAR</Link>}
            <button onClick={()=>setOpen(v=>!v)} style={{ background:`${C.border}44`, border:'none', color:C.muted, cursor:'pointer', fontSize:13, padding:'5px 7px', borderRadius:6, transition:'all .15s' }}
              onMouseEnter={e=>e.currentTarget.style.background=C.border}
              onMouseLeave={e=>e.currentTarget.style.background=`${C.border}44`}
            >{open?'◀':'▶'}</button>
          </div>
          <nav style={{ flex:1, padding:'10px 6px', overflowY:'auto' }}>
            {NAVGROUPS.map(g=>(
              <div key={g.label} style={{ marginBottom:14 }}>
                {open && <div style={{ display:'flex', alignItems:'center', gap:8, padding:'0 6px', marginBottom:4 }}>
                  <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.1em', color:C.muted, textTransform:'uppercase' }}>{g.label}</span>
                  {g.badge && <span className="tn">{g.badge}</span>}
                </div>}
                {g.items.map(item=>{
                  const active = loc.pathname===item.path
                  return (
                    <div key={item.path} className="nav-item" style={{ position:'relative' }}>
                      <Link to={item.path}
                        style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 8px', borderRadius:8, marginBottom:2, color:active?C.primary:C.muted, background:active?`${C.primary}15`:'transparent', transition:'all .15s', fontSize:13, fontWeight:active?600:400, whiteSpace:'nowrap', borderLeft:active?`2px solid ${C.primary}`:'2px solid transparent' }}>
                        <span style={{ fontSize:16, flexShrink:0 }}>{item.icon}</span>
                        {open && <><span style={{ flex:1 }}>{item.label}</span>
                          {item.badge==='cases' && urgentCount>0 && <span style={{ background:C.danger, color:'#fff', borderRadius:10, fontSize:10, fontWeight:800, padding:'1px 6px', minWidth:18, textAlign:'center' }}>{urgentCount}</span>}
                          {item.tag&&<span className="tn">NEW</span>}
                        </>}
                      </Link>
                      {!open && <div className="nav-tooltip">{item.label}</div>}
                    </div>
                  )
                })}
              </div>
            ))}
          </nav>
          {open && (
            <div style={{ padding:'12px 10px', borderTop:`1px solid ${C.border}` }}>
              <div style={{ fontSize:11, color:C.muted, lineHeight:1.5 }}>
                CLEAR Platform v3.0<br />
                <span style={{ color:C.success }}>● All systems operational</span>
              </div>
            </div>
          )}
        </aside>

        <main style={{ flex:1, overflowY:'auto', minWidth:0, paddingBottom:80 }}>{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav">
        {mobileNavItems.map(item => {
          const active = loc.pathname===item.path
          return (
            <Link key={item.path} to={item.path} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'6px 4px', color:active?C.primary:C.muted, fontSize:10, fontWeight:active?700:400, transition:'color .15s' }}>
              <span style={{ fontSize:20 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

// ── HOME ──────────────────────────────────────────────────────────────────────
function AnimatedStat({ value, label, icon, color }) {
  return (
    <div className="stat-card" style={{ flex:1, minWidth:140 }}>
      <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:26, fontWeight:900, color:C.heading, letterSpacing:'-.02em', lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12, color:C.muted, marginTop:4, fontWeight:500 }}>{label}</div>
      </div>
    </div>
  )
}

function Home() {
  const phases = [
    { n:'1-5', t:'Core Navigation', d:'Process maps, search, plain-language guides', s:'live', icon:'🗺️' },
    { n:'6-10', t:'Community & APIs', d:'Forums, government API integrations', s:'live', icon:'🔗' },
    { n:'11-15', t:'Intelligence', d:'ML recommendations, regional deployment', s:'live', icon:'🧠' },
    { n:'16-20', t:'UX Enhancements', d:'Doc generator, notifications, achievements', s:'live', icon:'✨' },
    { n:'21-25', t:'AI & Voice', d:'CLARA chatbot, voice UI, SMS, OCR, tax tools', s:'new', icon:'🤖' },
    { n:'26-30', t:'Platform Maturity', d:'Blockchain, social auth, referrals, premium', s:'new', icon:'🚀' },
  ]
  const quickLinks = [
    { label:'Apply for SNAP', path:'/knowledge', icon:'🍎', color:C.success },
    { label:'Start a Business', path:'/knowledge', icon:'🏢', color:C.primary },
    { label:'Veterans Benefits', path:'/knowledge', icon:'🏅', color:'#06b6d4' },
    { label:'Housing Help', path:'/knowledge', icon:'🏠', color:'#f97316' },
    { label:'Medical Insurance', path:'/knowledge', icon:'💊', color:'#ec4899' },
    { label:'Tax Filing', path:'/knowledge', icon:'📊', color:'#f59e0b' },
  ]
  return (
    <div className="page">
      {/* Hero */}
      <div style={{ padding:'32px 0 40px', borderBottom:`1px solid ${C.border}`, marginBottom:36 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'4px 12px', background:`${C.primary}15`, borderRadius:20, marginBottom:20 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:C.success, animation:'pulse 2s infinite' }} />
          <span style={{ fontSize:12, fontWeight:700, color:C.primary, letterSpacing:'.06em' }}>ALL 30 PHASES COMPLETE</span>
        </div>
        <h1 style={{ fontSize:42, fontWeight:900, color:C.heading, letterSpacing:'-.03em', lineHeight:1.15, marginBottom:14 }}>
          Making Government<br />
          <span style={{ background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Simple for Everyone</span>
        </h1>
        <p style={{ color:C.muted, fontSize:17, lineHeight:1.7, maxWidth:500, marginBottom:28 }}>
          90 in-depth guides, AI assistance, and step-by-step tools for every government process — built for real people.
        </p>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          <Link to="/knowledge"><button className="btn btn-primary" style={{ fontSize:15, padding:'12px 24px' }}>📚 Browse All 90 Guides</button></Link>
          <Link to="/ai-assistant"><button className="btn btn-outline" style={{ fontSize:15, padding:'12px 24px' }}>🤖 Ask CLARA Anything</button></Link>
          <Link to="/processmap"><button className="btn btn-ghost" style={{ fontSize:15, padding:'12px 24px' }}>🗺️ Process Map</button></Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:36, flexWrap:'wrap' }}>
        <AnimatedStat value="90" label="In-Depth Guides" icon="📚" color={C.primary} />
        <AnimatedStat value="18" label="Categories" icon="🗂️" color={C.accent} />
        <AnimatedStat value="4.8★" label="Avg Guide Rating" icon="⭐" color={C.warn} />
        <AnimatedStat value="33" label="Interactive Tools" icon="⚡" color={C.success} />
      </div>

      {/* Quick Topic Links */}
      <div style={{ marginBottom:36 }}>
        <div className="section-header">
          <div className="section-title">⚡ Popular Topics</div>
          <Link to="/knowledge"><button className="see-all-btn">See all 90 guides →</button></Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
          {quickLinks.map(q=>(
            <Link key={q.label} to={q.path}>
              <div className="card card-hover" style={{ padding:'16px 14px', borderLeft:`3px solid ${q.color}`, display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ fontSize:24 }}>{q.icon}</span>
                <span style={{ fontSize:13, fontWeight:600, color:C.heading, lineHeight:1.3 }}>{q.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Phases */}
      <div className="card">
        <div className="section-header" style={{ marginBottom:16 }}>
          <div className="section-title">🚀 Platform Phases</div>
          <span style={{ fontSize:12, color:C.success, fontWeight:700 }}>6/6 Complete</span>
        </div>
        <div style={{ display:'grid', gap:8 }}>
          {phases.map((p,i)=>(
            <div key={p.n} className="fade-up" style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', background:C.surface, borderRadius:10, border:`1px solid ${C.border}`, animationDelay:`${i*50}ms` }}>
              <div style={{ width:40, height:40, borderRadius:10, background:p.s==='new'?`${C.accent}18`:`${C.success}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>{p.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:C.heading, fontSize:14 }}>{p.t}</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{p.d}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:11, color:C.muted }}>Phase {p.n}</span>
                <span className={`badge ${p.s==='new'?'badge-blue':'badge-green'}`}>{p.s==='new'?'⚡ New':'✓ Live'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── PROCESS MAP ───────────────────────────────────────────────────────────────
function ProcessMap() {
  const [activeMap, setActiveMap] = useState(null)
  const cats = [
    { name:'Business', color:C.primary, icon:'🏢', count:48, items:['LLC Formation','Business License','EIN Application','Sales Tax Permit','DBA Registration','Annual Reports','Trademark Filing','Business Insurance'] },
    { name:'Benefits', color:C.success, icon:'🛡️', count:62, items:['SNAP / Food Stamps','Medicaid','Unemployment Insurance','SSI Disability','TANF Cash Assist','Child Tax Credit','EITC','WIC'] },
    { name:'Housing', color:C.warn, icon:'🏠', count:35, items:['Section 8 Vouchers','HUD Programs','Emergency Rental Aid','USDA Rural Housing','LIHTC Affordable Apts','Down Payment Help','Foreclosure Prevention','Weatherization'] },
    { name:'Immigration', color:'#8b5cf6', icon:'🌎', count:41, items:['Green Card','Citizenship / Naturalization','Work Visa H-1B / TN','DACA Renewal','Asylum Application','U Visa / T Visa','Immigration Court','Travel Documents'] },
    { name:'Veterans', color:'#06b6d4', icon:'🏅', count:29, items:['VA Healthcare Enrollment','GI Bill Education','Disability Compensation','VA Home Loan','Veterans Pension','Vocational Rehab','VSO Claims Help','PACT Act Claims'] },
    { name:'Education', color:'#f59e0b', icon:'🎓', count:38, items:['FAFSA Filing','Pell Grant','Student Loan IDR','PSLF Forgiveness','GED / Adult Ed','Work-Study','MAP Grant (IL)','529 Savings Plans'] },
    { name:'Healthcare', color:'#ec4899', icon:'💊', count:44, items:['ACA Marketplace','Medicare Parts A-D','Telehealth','Mental Health Coverage','Substance Treatment','COBRA Continuation','Children CHIP','Ryan White HIV'] },
    { name:'Legal', color:'#ef4444', icon:'⚖️', count:31, items:['Power of Attorney','Living Will / DNR','Small Claims Court','Expungement','Landlord-Tenant','Consumer Rights','Identity Theft','FCRA Disputes'] },
  ]
  return (
    <div className="page">
      <div style={{ marginBottom:28 }}>
        <div style={{ fontSize:11, fontWeight:800, color:C.primary, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Process Map</div>
        <h1 style={{ fontSize:28, fontWeight:900, color:C.heading, letterSpacing:'-.02em', marginBottom:8 }}>500+ Government Processes</h1>
        <p style={{ color:C.muted, fontSize:14 }}>Browse by category. Click any process to explore its step-by-step guide.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
        {cats.map(c=>(
          <div key={c.name} className="card" style={{ borderTop:`3px solid ${c.color}`, padding:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${c.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{c.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, color:C.heading, fontSize:15 }}>{c.name}</div>
                <div style={{ color:C.muted, fontSize:12, marginTop:2 }}>{c.count} processes</div>
              </div>
              <div style={{ width:32, height:32, borderRadius:8, background:`${c.color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div className="progress-bar-fill" style={{ width:Math.round((c.count/62)*100)+'%', height:3, background:c.color, borderRadius:2 }} />
              </div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {c.items.map(item=>(
                <span key={item} style={{ padding:'5px 11px', background:C.surface, borderRadius:20, fontSize:12, color:C.text, border:`1px solid ${C.border}`, cursor:'pointer', transition:'all .15s', display:'flex', alignItems:'center', gap:4 }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=c.color;e.currentTarget.style.color=c.color;e.currentTarget.style.background=`${c.color}12`}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.text;e.currentTarget.style.background=C.surface}}>
                  {item}
                </span>
              ))}
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

  // ── Consumer Rights (NEW) ─────────────────────────────────────────────────
  { id:41, t:'Disputing Credit Report Errors (Your FCRA Rights)', c:'Consumer', icon:'📋', time:'7 min', v:3200, rating:4.8, reviews:312, diff:'Medium', updated:'Feb 2026',
    summary:'How to find errors on your Equifax, Experian, and TransUnion credit reports and get them removed — for free, without a lawyer or credit repair company.',
    steps:['Get your free credit reports at AnnualCreditReport.com — the only federally authorized source. Pull all three bureaus (Equifax, Experian, TransUnion).','Review each report for errors: wrong personal info, accounts you don\'t recognize, late payments you made on time, duplicate accounts, or debts past the 7-year reporting limit.','For each error, write a dispute letter to the credit bureau. State what is incorrect, why it is wrong, and request removal or correction. Attach supporting documents.','Submit your dispute online (fastest), by certified mail, or by phone. The bureau must investigate within 30 days (45 if you provide additional info).','Also dispute directly with the original creditor (data furnisher) — they must investigate independently under FCRA.','If the item is verified as accurate but you still disagree, add a 100-word consumer statement to your file — it will appear on future reports.'],
    tips:['AnnualCreditReport.com is the only site authorized by federal law — annualcreditreport.com, not any lookalike sites.','The credit bureaus have 30 days to respond — if they fail to respond in time, the item must be removed.','You are entitled to a free credit report after any adverse action (loan denial, higher insurance rate) within 60 days.','Paid credit repair companies cannot do anything you cannot do yourself for free. Avoid services charging upfront fees.'],
    faq:[{q:'How long do negative items stay on my credit report?',a:'Most negative items remain for 7 years. Chapter 7 bankruptcy stays for 10 years. Positive accounts can stay indefinitely.'},{q:'What if the bureau says my dispute is frivolous?',a:'Request the specific reason in writing. If you have evidence proving the item is wrong, resubmit with that documentation. You can also file a complaint with the CFPB (consumerfinance.gov) or sue under FCRA for violations.'}],
    related:[42,43], tags:['credit report','FCRA','dispute','credit bureau','consumer rights'] },

  { id:42, t:'Debt Collection: What Collectors Can and Cannot Do (FDCPA)', c:'Consumer', icon:'📞', time:'6 min', v:2700, rating:4.7, reviews:267, diff:'Easy', updated:'Feb 2026',
    summary:'The Fair Debt Collection Practices Act gives you powerful rights against abusive collectors — including the right to demand they stop calling.',
    steps:['Know what FDCPA covers: third-party debt collectors (not original creditors) collecting personal, family, or household debts (credit cards, medical bills, mortgages, student loans).','Understand prohibited practices: collectors cannot call before 8am or after 9pm, call your workplace if told not to, use profane language, make false statements, threaten arrest, or add unauthorized fees.','Send a Cease Communication Letter (certified mail, return receipt) to demand all contact stop. The collector may then only contact you to confirm no further contact or to notify you of a specific action.','Request debt validation within 30 days of first contact — the collector must stop collection until they provide written verification of the debt amount and creditor name.','Review the debt\'s statute of limitations. After expiration, the debt is legally uncollectable, though it may still appear on your credit report.','If a collector violates FDCPA, you can sue in federal court within one year for actual damages plus up to $1,000 in statutory damages, plus attorney\'s fees.'],
    tips:['Document every interaction: dates, times, names, and what was said. Save voicemails.','A debt being sent to collections does not mean you owe it — verify everything before paying.','Paying a very old debt can restart the statute of limitations in some states — consult an attorney before paying old debts.','Illinois statute of limitations on credit card debt: 5 years. On written contracts: 10 years.'],
    faq:[{q:'Can collectors contact my family or friends?',a:'Only to locate you (get your address or phone number), not to discuss the debt. They cannot reveal that you owe a debt to third parties.'},{q:'What if a debt collector sues me?',a:'Respond to the lawsuit — if you ignore it, the collector gets a default judgment and can garnish wages or bank accounts. Many debts can be settled for less than the full amount or dismissed for procedural errors.'}],
    related:[41,43], tags:['debt collection','FDCPA','collectors','consumer rights','harassment'] },

  { id:43, t:'Understanding and Building Your Credit Score', c:'Consumer', icon:'💯', time:'8 min', v:3800, rating:4.9, reviews:445, diff:'Easy', updated:'Feb 2026',
    summary:'How FICO scores are calculated, what actions actually move the needle, and a realistic roadmap to excellent credit.',
    steps:['Understand the five FICO factors: Payment History (35%), Amounts Owed/Utilization (30%), Length of Credit History (15%), Credit Mix (10%), New Credit (10%).','Pull your free score — many banks, credit cards, and apps (Credit Karma, Credit Sesame) provide free FICO or VantageScore access. Checking your own score never hurts it.','Fix payment history first: set up autopay for at least the minimum on every account. One 30-day late payment can drop your score 50-100 points.','Reduce your credit utilization: aim to use less than 30% of each card\'s limit (ideally under 10%). Pay down balances before your statement closes, not just before the due date.','Do not close old accounts — length of history matters. Keep old cards open even if unused (put a small recurring charge on them).','Apply for new credit sparingly — each hard inquiry drops your score slightly for up to two years. Space out applications by at least 6 months.'],
    tips:['Becoming an authorized user on a family member\'s old, well-managed card is one of the fastest ways to build credit history.','Credit builder loans from credit unions and CDFIs are designed for people with no credit — the payments are reported to all three bureaus.','Requesting a credit limit increase (without spending more) lowers your utilization ratio immediately.','Score improvements from good habits take 3-6 months to reflect in your score — be patient and consistent.'],
    faq:[{q:'What credit score do I need for an apartment?',a:'Most landlords want a score of 620+ for standard rentals. With scores below 620, expect to pay a larger deposit or provide a co-signer.'},{q:'How quickly can I build credit from scratch?',a:'You can establish a credit profile within 3-6 months using a secured card or credit builder loan. Getting to "good" (670+) from zero typically takes 12-18 months of responsible use.'}],
    related:[41,42], tags:['credit score','FICO','credit utilization','credit building','personal finance'] },

  // ── Employment (NEW) ──────────────────────────────────────────────────────
  { id:44, t:'FMLA: Your Right to Job-Protected Medical Leave', c:'Employment', icon:'🏥', time:'8 min', v:2900, rating:4.8, reviews:289, diff:'Medium', updated:'Feb 2026',
    summary:'The Family and Medical Leave Act entitles eligible employees to 12 weeks of unpaid, job-protected leave per year for serious health conditions, childbirth, or family care.',
    steps:['Check employer eligibility: FMLA applies to employers with 50+ employees within 75 miles. Federal, state, and local governments are always covered.','Check employee eligibility: you must have worked for the employer for at least 12 months AND at least 1,250 hours in the past 12 months.','Qualifying reasons: serious health condition of you, spouse, child, or parent; birth, adoption, or foster placement of a child; qualifying military exigency.','Notify your employer at least 30 days in advance for foreseeable leave. For emergencies, notify as soon as practical — same day or next business day.','Your employer may require you to use accrued PTO concurrently with FMLA, but FMLA protects the job regardless.','Upon return, you must be restored to the same or equivalent position with the same pay, benefits, and working conditions.'],
    tips:['FMLA leave can be taken intermittently — for example, 2 hours per week for medical appointments — not just in a block.','Your employer cannot retaliate against you for taking FMLA leave. Documenting your leave request and any negative actions afterward is crucial.','Illinois employees at companies with 5+ employees may also have protections under the Illinois Human Rights Act for disability-related leave.','Many states have their own paid family leave laws that provide wage replacement during FMLA — check your state\'s program.'],
    faq:[{q:'Is FMLA leave paid?',a:'No. FMLA itself is unpaid, though your employer may require or you may choose to use paid time off concurrently. Some states have separate Paid Family Leave programs.'},{q:'What if my employer denies my FMLA request?',a:'File a complaint with the U.S. Department of Labor Wage and Hour Division (dol.gov/agencies/whd) within 2 years of the violation. You may also sue for back pay, damages, and attorney\'s fees.'}],
    related:[45,46,34], tags:['FMLA','family leave','medical leave','job protection','employment rights'] },

  { id:45, t:'Wage Theft and Overtime: Know Your Pay Rights', c:'Employment', icon:'💵', time:'7 min', v:2600, rating:4.8, reviews:254, diff:'Medium', updated:'Feb 2026',
    summary:'Federal and state laws guarantee minimum wage, overtime pay, and protection from illegal wage deductions — and give you powerful tools to recover stolen wages.',
    steps:['Know the federal minimum wage: $7.25/hr (2024). Illinois minimum wage: $14/hr (rising to $15/hr Jan 1, 2025). You are entitled to whichever is higher.','Understand overtime: non-exempt employees covered by the FLSA must receive 1.5x their regular rate for all hours over 40 in a workweek. "Exempt" classification requires meeting specific salary and duties tests.','Recognize wage theft: unpaid overtime, improper tip pooling, illegal paycheck deductions, misclassification as independent contractor, off-the-clock work requirements, and minimum wage violations.','Gather evidence: keep copies of pay stubs, timesheets, work schedules, and any written communications about pay. If possible, keep a personal log of hours worked.','File a wage claim with the Illinois Department of Labor (labor.illinois.gov) or the U.S. Department of Labor Wage and Hour Division. No lawyer needed — the agency investigates for free.','You can also sue your employer privately — FLSA allows you to recover back wages, an equal amount in liquidated damages, plus attorney\'s fees.'],
    tips:['The statute of limitations for federal FLSA claims is 2 years (3 years for willful violations). Don\'t delay.','Retaliation for reporting wage violations is illegal — document any adverse actions taken against you.','Tipped workers: tips cannot reduce your wage below $7.25/hr (federal). If tips plus direct wage don\'t reach minimum wage, the employer must make up the difference.','Illinois workers can join a class action for widespread wage violations — contact a plaintiff\'s employment attorney for free consultation.'],
    faq:[{q:'Am I exempt from overtime as a salaried employee?',a:'Not necessarily. The salary threshold for exemption is $684/week ($35,568/year) federally, and you must also perform specific duties. Many salaried workers are misclassified.'},{q:'Can my employer average my hours over two weeks?',a:'No. Overtime is calculated weekly, not bi-weekly. An employer cannot use a long week to offset a short week.'}],
    related:[44,46], tags:['minimum wage','overtime','wage theft','FLSA','employment rights','pay'] },

  { id:46, t:'OSHA: Workplace Safety Rights and How to File a Complaint', c:'Employment', icon:'⛑️', time:'6 min', v:1900, rating:4.7, reviews:178, diff:'Easy', updated:'Jan 2026',
    summary:'Every worker has the right to a safe workplace. OSHA gives you the right to report hazards, refuse dangerous work, and be protected from retaliation.',
    steps:['Know your basic OSHA rights: the right to a workplace free from recognized hazards, to receive safety training, to see OSHA records of work-related injuries, and to report violations without retaliation.','Report hazards to your employer first — they have primary responsibility for maintaining safe conditions.','If your employer fails to address serious hazards, file a complaint with OSHA online (osha.gov), by phone (1-800-321-OSHA), or by mail. Complaints can be anonymous.','Request an OSHA inspection — OSHA must inspect if an imminent danger is reported. You have the right to accompany the OSHA inspector during the walkaround.','Refuse imminently dangerous work — you have the legal right to refuse work you reasonably believe poses imminent danger of death or serious physical harm, and the employer cannot discipline you.','Report retaliation within 30 days to OSHA — retaliation for safety complaints is illegal and OSHA investigates these complaints separately.'],
    tips:['Keep a personal log of safety hazards, incidents, and your reports to management — dates and details matter if there is a dispute.','OSHA does not cover self-employed workers or federal government employees (who have separate protections).','Many OSHA standards require employers to provide safety equipment free of charge — you should never have to pay for required PPE.','In Illinois, IDOL (Illinois Department of Labor) enforces state occupational safety standards for public sector workers not covered by federal OSHA.'],
    faq:[{q:'Can I be fired for filing an OSHA complaint?',a:'No. Retaliation for reporting safety concerns is prohibited under Section 11(c) of the OSH Act. File a retaliation complaint with OSHA within 30 days of the adverse action.'},{q:'What is a General Duty Clause violation?',a:'OSHA\'s General Duty Clause requires employers to fix recognized hazards even if no specific standard covers them. This is OSHA\'s catch-all requirement for workplace safety.'}],
    related:[44,45], tags:['OSHA','workplace safety','workers rights','hazards','retaliation'] },

  // ── Mental Health (NEW) ───────────────────────────────────────────────────
  { id:47, t:'Finding Affordable Mental Health Care', c:'Mental Health', icon:'🧠', time:'8 min', v:3500, rating:4.9, reviews:398, diff:'Easy', updated:'Feb 2026',
    summary:'A practical guide to finding therapists, psychiatrists, and counselors who accept your insurance, charge on a sliding scale, or are completely free.',
    steps:['Start with your insurance: call the member services number on your card and ask for in-network therapists who are accepting new patients. Also ask about out-of-network benefits.','Use the SAMHSA treatment locator (findtreatment.gov) or the Psychology Today therapist directory (psychologytoday.com/us/therapists) to search by insurance, location, and specialty.','Community Mental Health Centers (CMHCs): every county has one. They provide mental health services regardless of ability to pay, often on a sliding-scale fee based on income.','Federally Qualified Health Centers (FQHCs): offer integrated behavioral health at sliding-scale fees. Find your nearest one at findahealthcenter.hrsa.gov.','Open Path Collective (openpathcollective.org): vetted therapists who charge $30-$80 per session for individuals earning under $100K.','University training clinics offer high-quality low-cost therapy provided by supervised graduate students — typically $0-$30 per session.'],
    tips:['Telehealth dramatically expanded mental health access — most therapists now offer video sessions, removing transportation and geographic barriers.','If your first therapist isn\'t a good fit, switch — the therapeutic relationship is the strongest predictor of outcomes.','Many employers offer an Employee Assistance Program (EAP) providing 3-8 free sessions per year — check with HR.','For adolescents: school counselors can provide referrals and sometimes brief counseling, and many community providers specialize in youth services.'],
    faq:[{q:'What is the difference between a therapist, psychologist, and psychiatrist?',a:'Therapists (LCSWs, LPCs, MFTs) provide counseling and cannot prescribe medication. Psychologists (PhD/PsyD) also provide therapy and testing. Psychiatrists (MD/DO) are medical doctors who specialize in mental health and can prescribe medication.'},{q:'How long does therapy take?',a:'Depends on your goals and the type of therapy. Cognitive Behavioral Therapy (CBT) for anxiety or depression is typically 12-20 sessions. Ongoing therapy for complex issues may continue for years.'}],
    related:[48,49], tags:['mental health','therapy','therapist','sliding scale','affordable care','counseling'] },

  { id:48, t:'988 Suicide and Crisis Lifeline: What It Is and How to Use It', c:'Mental Health', icon:'📱', time:'4 min', v:4100, rating:4.9, reviews:489, diff:'Easy', updated:'Feb 2026',
    summary:'The 988 Lifeline provides free, confidential crisis support 24/7 by call, text, or chat — here\'s who it is for, what to expect, and other crisis resources.',
    steps:['Call or text 988 from any phone in the U.S. — it\'s free, available 24/7, and your call is answered by a trained crisis counselor, not a robot.','You can also chat online at 988lifeline.org if you prefer not to call.','Specialized lines within 988: press 1 for Veterans Crisis Line, press 2 for Spanish-language support. The Trevor Project (1-866-488-7386) specializes in LGBTQ+ youth.','What to expect: a counselor will listen, help you feel heard, and work with you on next steps. They will not automatically dispatch emergency services unless you are in immediate danger.','Crisis Text Line: text HOME to 741741 for text-based crisis support — helpful if calling is not possible.','After a crisis call, the counselor may help you create a safety plan and connect you with local follow-up resources.'],
    tips:['988 is not only for suicidal crises — it is for anyone experiencing a mental health emergency, substance use crisis, or overwhelming emotional distress.','You will not automatically lose your rights or be involuntarily hospitalized for calling 988 — counselors use the least restrictive intervention.','If calling for someone else in crisis, 988 can coach you on how to help.','Save 988 in your phone now so you have it available during a crisis when it\'s hardest to think clearly.'],
    faq:[{q:'Will my location be traced?',a:'988 can identify your approximate location to connect you with local resources but will not dispatch police without your consent unless there is an imminent threat to life.'},{q:'Is the 988 Lifeline only for adults?',a:'No. 988 is for people of all ages. There are counselors specializing in youth crisis.'}],
    related:[47,49], tags:['988','crisis line','suicide prevention','mental health crisis','hotline'] },

  { id:49, t:'Mental Health Parity: Your Insurance Coverage Rights', c:'Mental Health', icon:'⚖️', time:'7 min', v:2100, rating:4.7, reviews:198, diff:'Medium', updated:'Jan 2026',
    summary:'Federal law requires insurers to cover mental health and substance use treatment no more restrictively than medical care — and how to fight back when they don\'t.',
    steps:['Understand the law: the Mental Health Parity and Addiction Equity Act (MHPAEA) requires insurers that cover mental health/substance use disorders to provide coverage comparable to medical/surgical coverage.','Parity applies to: treatment limitations (number of sessions, prior authorization requirements), cost sharing (copays, deductibles), and network composition.','Get a Summary of Benefits and Coverage from your insurer — compare the rules applied to mental health vs. medical benefits side by side.','If your insurer applies stricter limits (e.g., limits therapy to 20 sessions but not medical visits), file a complaint with your state insurance commissioner.','Request a Non-Quantitative Treatment Limitation (NQTL) analysis from your insurer in writing — federal law now requires them to provide this document.','File a complaint with the U.S. Department of Labor (for employer plans) or HHS (for individual/marketplace plans) if parity violations occur.'],
    tips:['Keep detailed records of all denials, prior authorization requirements, and limitations applied to your mental health claims.','Many parity violations are in non-quantitative limits like prior authorization, step therapy requirements, or network adequacy — not just visit limits.','If you are denied coverage, use the internal appeal process first, then external review, then file regulatory complaints.','The Parity Compliance Guide (paritytrack.org) tracks state enforcement actions and provides parity complaint resources.'],
    faq:[{q:'Does parity apply to my small employer\'s health plan?',a:'MHPAEA applies to employer health plans with more than 50 employees that cover mental health/substance use disorders. Small employer plans and some Medicaid plans may have different rules.'},{q:'What if my insurer claims a treatment is "not medically necessary"?',a:'Request the clinical criteria they used for the denial in writing. If the criteria are more restrictive than for comparable medical conditions, that is likely a parity violation.'}],
    related:[47,48,18], tags:['mental health parity','insurance','MHPAEA','coverage','behavioral health'] },

  // ── More Housing ──────────────────────────────────────────────────────────
  { id:50, t:'Renters\' Rights: Security Deposits, Repairs, and Eviction', c:'Housing', icon:'🔑', time:'9 min', v:3100, rating:4.8, reviews:312, diff:'Medium', updated:'Feb 2026',
    summary:'Your legal rights as a renter in Illinois — what landlords must provide, how to get your deposit back, and what to do if you face eviction.',
    steps:['Security deposit rights: Illinois landlords in cities with local ordinances (Chicago requires written receipts and interest on deposits held over 31 days) must follow specific rules. Outside of Chicago, state law provides baseline protections.','Get everything in writing: lease terms, move-in condition (take photos/video), and all communications with your landlord.','Habitability rights: landlords must maintain rentals in habitable condition — working heat, plumbing, electrical, and freedom from pests. If they fail to repair after written notice, you may have the right to withhold rent, repair-and-deduct, or terminate the lease.','Getting your deposit back: landlords must return deposits within 30-45 days of move-out (varies by city) with itemized deductions. Improper withholding entitles you to 2x the deposit amount in damages in many Illinois cities.','Know the eviction process: landlords cannot lock you out, remove your belongings, or shut off utilities — these are illegal self-help evictions. They must go through court.','If served an eviction notice, respond within the deadline stated. Legal aid organizations provide free representation for low-income renters facing eviction.'],
    tips:['Never pay rent in cash — always pay by check, money order, or electronic transfer so you have a record of payment.','Document everything before you move in: take time-stamped photos of every room and send them to your landlord in writing.','In Chicago, the Residential Landlord and Tenant Ordinance (RLTO) provides stronger renter protections than state law.','Illinois Legal Aid Online (illinoislegalaid.org) provides free legal resources and attorney referrals for housing issues.'],
    faq:[{q:'Can my landlord raise my rent at any time?',a:'During a lease term, no — unless the lease specifically allows it. For month-to-month tenancies, the landlord must give proper notice (typically 30 days in Illinois).'},{q:'What if my landlord enters without notice?',a:'Illinois law requires landlords to give at least 24 hours\' notice before entry except in emergencies. Repeated unauthorized entry may constitute harassment and give you grounds to terminate the lease.'}],
    related:[14,15,39], tags:['renters rights','security deposit','eviction','habitability','landlord','tenant'] },

  { id:51, t:'First-Time Homebuyer Programs and Down Payment Assistance', c:'Housing', icon:'🏡', time:'9 min', v:2700, rating:4.8, reviews:267, diff:'Medium', updated:'Feb 2026',
    summary:'Federal and state programs that help first-time buyers with down payments, closing costs, and below-market interest rates.',
    steps:['Understand first-time buyer status: most programs define this as not having owned a primary residence in the past 3 years — even if you owned before.','HUD-approved housing counseling (free at 800-569-4287): required for many assistance programs and provides personalized homebuying guidance.','FHA Loans: require only 3.5% down with a 580+ credit score (10% down with 500-579). More flexible debt-to-income requirements than conventional loans.','Illinois Housing Development Authority (IHDA): offers the SmartBuy and Access Mortgage programs providing 4% of purchase price in down payment assistance (up to $6,000) paired with a 30-year fixed mortgage.','USDA Rural Development loans: 0% down for properties in eligible rural and suburban areas. Income limits apply. Check eligibility at eligibility.sc.egov.usda.gov.','VA Loans: 0% down, no PMI, competitive rates for eligible veterans and service members.'],
    tips:['Shop multiple lenders — even a 0.25% difference in interest rate saves thousands over a 30-year loan.','Get pre-approved (not just pre-qualified) before making offers — it shows sellers you are serious.','Private Mortgage Insurance (PMI) is required for conventional loans with less than 20% down — it adds 0.5-1.5% of the loan amount annually. It can be removed once you reach 20% equity.','Ask about employer-assisted housing (EAH) programs — many large employers offer forgivable loans or grants for employees buying in certain areas.'],
    faq:[{q:'What credit score do I need to buy a home?',a:'620 for most conventional loans. 580 for FHA with 3.5% down. VA and USDA have no minimum, but lenders typically want 620+.'},{q:'How much house can I afford?',a:'A general rule: keep your total housing payment (PITI — principal, interest, taxes, insurance) at 28% or less of your gross monthly income. Total debt payments should be under 36-43%.'}],
    related:[14,50,39], tags:['first time homebuyer','down payment','FHA','IHDA','home buying','mortgage'] },

  // ── More Immigration ──────────────────────────────────────────────────────
  { id:52, t:'Asylum: How to Apply for Refugee Protection in the U.S.', c:'Immigration', icon:'🛡️', time:'11 min', v:2400, rating:4.8, reviews:245, diff:'Hard', updated:'Jan 2026',
    summary:'Who qualifies for asylum, the two ways to apply (affirmative and defensive), and what to expect during the process.',
    steps:['Understand who qualifies: asylum protects people who have suffered persecution or have a well-founded fear of persecution based on race, religion, nationality, membership in a particular social group, or political opinion.','Apply within 1 year of arriving in the U.S. — missing this deadline bars most asylum claims unless you qualify for an exception (changed or extraordinary circumstances).','Affirmative asylum: if you are not in removal proceedings, file Form I-589 with USCIS. You\'ll be interviewed by an asylum officer. If denied, your case goes to immigration court.','Defensive asylum: if you are in removal proceedings, raise asylum as a defense before an immigration judge. The burden of proof is higher.','Prepare your case: gather country condition evidence, personal testimony, witness statements, medical records of any injuries, and expert testimony on conditions in your country.','If approved, you receive asylum status, which leads to a green card after 1 year, and U.S. citizenship 5 years after asylum grant.'],
    tips:['Hire an immigration attorney or find free legal help through ILRC (ilrc.org), PAIR Project, or local legal aid — asylum cases are complex and the stakes are high.','Be consistent and detailed in all statements — inconsistencies are closely scrutinized.','Keep copies of all documents submitted and all receipts from USCIS.','Asylum seekers are eligible for work authorization 180 days after filing a complete asylum application.'],
    faq:[{q:'Can I include my family in my asylum application?',a:'Yes. Your spouse and unmarried children under 21 who are in the U.S. can be included as derivatives on your Form I-589.'},{q:'What if I miss the one-year filing deadline?',a:'You may still apply if you can show changed circumstances (new persecution risk) or extraordinary circumstances (serious illness, ineffective counsel) that explain the delay.'}],
    related:[9,10,53], tags:['asylum','refugee','I-589','immigration','persecution','protection'] },

  { id:53, t:'Work Visas: H-1B, TN, OPT, and Employment Authorization', c:'Immigration', icon:'💼', time:'10 min', v:2200, rating:4.7, reviews:212, diff:'Hard', updated:'Feb 2026',
    summary:'An overview of the most common pathways to work legally in the U.S. on a temporary basis, and how each visa works.',
    steps:['H-1B Specialty Occupation: requires a bachelor\'s or higher in a specific field. Employer must sponsor and file a Labor Condition Application. Subject to an annual cap (65,000 + 20,000 for U.S. master\'s holders) with a lottery system.','TN Visa (USMCA/NAFTA): for Canadian and Mexican citizens in specific professional occupations. No annual cap, faster process. Canadians can apply at the border.','Optional Practical Training (OPT): F-1 students may work in their field of study for 12 months (or 36 months for STEM graduates) after completing their degree.','L-1 Intracompany Transferee: for employees of international companies transferred to a U.S. office in a managerial, executive, or specialized knowledge capacity.','Employment Authorization Document (EAD): some visa holders and certain immigration categories (DACA, asylum applicants, adjustment of status applicants) can apply for an EAD that allows work for any employer.','EB-1, EB-2, EB-3: employment-based green card categories for extraordinary ability workers, professionals, and skilled workers respectively.'],
    tips:['H-1B cap season opens March 1 — work with an immigration attorney to ensure your petition is filed before the registration window closes.','J-1 scholars and students with J-1 visas may be subject to a 2-year home country residency requirement that must be waived before applying for most other visas or green cards.','Premium processing ($2,805 in 2024) guarantees USCIS will act on your H-1B within 15 business days.','Keep copies of all I-94 arrival/departure records and monitor your authorized stay dates carefully.'],
    faq:[{q:'Can I change employers on an H-1B?',a:'Yes, through H-1B portability — if you file a new H-1B petition before your current status expires, you can start working for the new employer immediately upon filing.'},{q:'What happens if I lose my job on an H-1B?',a:'You have a 60-day grace period to find a new employer, change status, or depart the U.S. File for a change of status or new employer petition within that window.'}],
    related:[9,10,52], tags:['H-1B','work visa','OPT','TN visa','employment authorization','immigration'] },

  // ── More Benefits ─────────────────────────────────────────────────────────
  { id:54, t:'Child Tax Credit and Child Care Tax Credits Explained', c:'Benefits', icon:'👶', time:'7 min', v:3300, rating:4.8, reviews:334, diff:'Easy', updated:'Feb 2026',
    summary:'The Child Tax Credit (CTC), Additional Child Tax Credit (ACTC), and Child and Dependent Care Credit — how much you get and how to claim them.',
    steps:['Child Tax Credit (CTC): up to $2,000 per qualifying child under 17. Phases out at $200K (single) / $400K (married). The refundable portion (ACTC) is up to $1,700 per child for lower-income families.','Qualifying child requirements: under 17 at year-end, related to you, lived with you more than half the year, and you provided more than half their support.','Claim the CTC on Schedule 8812 when filing your federal tax return. You don\'t need to do anything extra if you file — the credit is calculated automatically.','Child and Dependent Care Credit: if you paid for childcare while working or looking for work, you can claim 20-35% of up to $3,000 (one child) or $6,000 (two or more children) in care expenses.','Use Form 2441 to claim the Child and Dependent Care Credit. You\'ll need the care provider\'s name, address, and Tax ID (EIN or SSN).','Dependent Care FSA through your employer: you can contribute up to $5,000 pre-tax per year to a Dependent Care FSA — this reduces your taxable income and is often more valuable than the credit for higher earners.'],
    tips:['Keep childcare receipts and provider information throughout the year — you\'ll need it at tax time.','The Earned Income Tax Credit (EITC) is separate from CTC and you may qualify for both.','If the other parent claims the child for CTC, you cannot also claim it — divorce agreements should specify who claims each child each year.','The IRS Free File program and VITA sites can help you claim all credits you\'re entitled to accurately.'],
    faq:[{q:'Can I claim the CTC for a child born late in the year?',a:'Yes. A child born at any point during the tax year qualifies for the full CTC for that year.'},{q:'What if I didn\'t file taxes last year and missed the CTC?',a:'You can file an amended return (Form 1040-X) for up to 3 years back to claim credits you missed, including the CTC and EITC.'}],
    related:[1,23,5], tags:['child tax credit','CTC','dependent care','tax credit','families','childcare'] },

  { id:55, t:'Medicare Extra Help: Low-Income Prescription Drug Assistance', c:'Benefits', icon:'💊', time:'6 min', v:2100, rating:4.7, reviews:187, diff:'Easy', updated:'Jan 2026',
    summary:'The Extra Help program (also called Low Income Subsidy or LIS) dramatically reduces Medicare Part D drug costs — worth up to $5,300/year for eligible beneficiaries.',
    steps:['Check eligibility: you must be enrolled in Medicare Part A and/or B, live in the U.S. (including Puerto Rico), and have income below 150% of the federal poverty level (~$21,870/yr for a single person in 2024).','Resource limits: single person up to $17,220 in countable resources; married couple up to $34,360. Some resources are excluded (home, car, life insurance).','Apply online at ssa.gov/extrahelp, call 1-800-772-1213, or visit your local Social Security office. Medicaid beneficiaries and those receiving Medicare Savings Program benefits are automatically enrolled.','If approved, you pay reduced Part D premiums ($0 in many cases), reduced deductibles, and copays of $4.50-$11.20 per drug (2024). Costs are the same at any Part D-participating pharmacy.','Medicare Savings Programs (QMB, SLMB, QI) can also help pay Part A and Part B premiums — apply through your state Medicaid agency.','Reapply annually — Extra Help eligibility is redetermined each year based on income and resources.'],
    tips:['Automatically qualifying beneficiaries (full Medicaid, SSI, Medicare Savings Program) are enrolled in Extra Help without needing to apply.','Even if you were denied before, reapply — income and resource limits are updated annually and may now include you.','Extra Help also protects you from the coverage gap ("donut hole") — you pay the same low copays throughout the year.','State Pharmaceutical Assistance Programs (SPAPs) can provide additional help — many states have programs beyond the federal Extra Help.'],
    faq:[{q:'Will applying for Extra Help affect my Social Security benefits?',a:'No. Extra Help is a Medicare benefit, not a welfare program. Applying will not affect your SSI, Social Security retirement, or disability benefits.'},{q:'Can I have both Extra Help and a Medicare Advantage plan?',a:'Yes. If your Medicare Advantage plan includes Part D drug coverage, Extra Help will apply to your drug costs within that plan.'}],
    related:[2,26,27], tags:['Extra Help','LIS','Medicare Part D','prescription drugs','low income','seniors'] },

  // ── More Business ─────────────────────────────────────────────────────────
  { id:56, t:'Trademarks and Copyrights: Protecting Your Business', c:'Business', icon:'™️', time:'9 min', v:2300, rating:4.7, reviews:221, diff:'Medium', updated:'Feb 2026',
    summary:'When and how to register a trademark or copyright, what protection each provides, and common mistakes small business owners make.',
    steps:['Understand the difference: copyright protects original creative works (written content, logos, art, music, code) automatically upon creation. Trademark protects brand identifiers (name, logo, slogan) used in commerce and requires registration for full protection.','Copyright: you own copyright automatically, but registration at copyright.gov ($35-$65 online) is required to sue for infringement and to recover statutory damages and attorney\'s fees.','Trademark: search the USPTO database (tmsearch.uspto.gov) to ensure your mark isn\'t already registered before investing in branding.','File a trademark application at USPTO.gov. Basic TEAS Plus application: $250/class. Processing takes 8-12 months. Use the "Intent to Use" basis if you haven\'t started using it yet.','Common law trademark rights: even without registration, you have some rights in a mark you\'ve been using in commerce. Registration provides nationwide priority and public notice.','Trade secrets: valuable business information (recipes, customer lists, algorithms) is protected by keeping it confidential, not by registration.'],
    tips:['Register your trademark in every class of goods/services you sell — it\'s class-specific protection.','A trademark attorney can cost $1,000-$3,000 for a straightforward registration but can prevent costly mistakes and office action responses.','Monitor for infringement: set up Google Alerts for your brand name and check USPTO\'s TSDR database regularly.','Domain name registration is NOT trademark registration — owning a .com doesn\'t give you trademark rights.'],
    faq:[{q:'Can I trademark my business name?',a:'Yes, if it is distinctive enough. Generic or descriptive marks (like "Best Plumbing") are harder to register. Suggestive, arbitrary, or fanciful marks (like "Apple" for computers) are strongest.'},{q:'How long does a trademark last?',a:'Indefinitely, as long as you continue using it in commerce and file maintenance documents with the USPTO (between years 5-6, and then every 10 years).'}],
    related:[6,7,57], tags:['trademark','copyright','intellectual property','brand protection','small business'] },

  { id:57, t:'Hiring Your First Employee: Taxes, Payroll, and Legal Requirements', c:'Business', icon:'🤝', time:'10 min', v:2100, rating:4.7, reviews:198, diff:'Hard', updated:'Feb 2026',
    summary:'A compliance checklist for small business owners taking on their first hire — payroll taxes, workers\' comp, I-9 verification, and more.',
    steps:['Get your EIN (if you don\'t have one) at irs.gov and register with your state labor department for state unemployment insurance (SUI).','Verify employment eligibility: complete Form I-9 within 3 days of the employee\'s start date. You must physically verify original documents — photocopies are not acceptable.','Set up payroll withholding: withhold federal income tax (based on W-4), Social Security (6.2%), and Medicare (1.45%) from each paycheck. You match Social Security and Medicare as the employer.','Register for FUTA (federal unemployment tax): 6% on the first $7,000 of each employee\'s wages, offset by state unemployment tax credit (typically reducing it to 0.6%).','Obtain workers\' compensation insurance: required in Illinois for all employers with one or more employees. Contact your state\'s workers\' comp agency or a commercial insurer.','Display required workplace posters: FLSA, FMLA, OSHA, EEO, USERRA, and state-required posters must be visibly displayed. Free posters available at dol.gov.'],
    tips:['Payroll software (Gusto, QuickBooks Payroll, ADP) automates withholding, filing, and deposits — highly recommended for first-time employers.','Misclassifying employees as independent contractors is one of the most common and costly mistakes — the IRS and state agencies scrutinize this closely.','New hire reporting: you must report new employees to the Illinois New Hire Reporting Center within 20 days of hiring.','Consider an HR consultant for your first hire — getting it right from the start avoids expensive compliance problems.'],
    faq:[{q:'Can I pay my employee as an independent contractor to avoid payroll taxes?',a:'Only if they genuinely meet the IRS and state tests for contractor status. Misclassification penalties include back taxes, penalties, and interest — often more than the taxes you were trying to avoid.'},{q:'Do I need an employee handbook?',a:'Not legally required, but strongly recommended. A handbook sets expectations, establishes policies, and provides legal protection in disputes.'}],
    related:[6,7,35], tags:['hiring','payroll','I-9','workers comp','small business','employment'] },

  // ── More Veterans ─────────────────────────────────────────────────────────
  { id:58, t:'VA Vocational Rehabilitation and Employment (VR&E / Chapter 31)', c:'Veterans', icon:'🎯', time:'7 min', v:1700, rating:4.8, reviews:143, diff:'Medium', updated:'Jan 2026',
    summary:'Chapter 31 Veteran Readiness and Employment helps veterans with service-connected disabilities prepare for, find, and maintain suitable employment.',
    steps:['Check eligibility: you must have a service-connected disability rating of at least 10% (or a memorandum rating of 20%+) and need help overcoming an employment barrier related to your disability.','Apply at va.gov/careers-employment/vocational-rehabilitation — the application is online and takes about 15 minutes.','Meet with a VR&E Counselor who will conduct a comprehensive evaluation of your abilities, interests, and employment barriers, then develop an Individual Plan for Employment (IPE).','Choose your track: Reemployment (return to prior occupation), Rapid Access to Employment, Self-Employment, Employment through Long-Term Services (college or trade school), or Independent Living.','If a degree or certification is needed, VR&E pays tuition, fees, books, supplies, and a monthly subsistence allowance while you are enrolled.','Job search assistance: the program provides resume help, interview coaching, job placement assistance, and workplace accommodations coordination.'],
    tips:['VR&E subsistence allowance is separate from and in addition to GI Bill benefits — you cannot use both simultaneously for the same training, but VR&E often pays more.','There is no dollar cap on VR&E services — the program will fund the education and support needed to achieve your employment goal.','Self-employment track: the VA can fund business plan development, equipment, and supplies for veterans starting a business with a disability-related barrier.','Even veterans with a 0% rating may qualify if the VA determines they have a serious employment handicap.'],
    faq:[{q:'Can I use VR&E and the GI Bill at the same time?',a:'Not for the same training program simultaneously. You can switch between them, and sometimes VR&E is the better choice — consult with your VR&E counselor.'},{q:'How long does VR&E last?',a:'The basic entitlement is 48 months of full-time services, which can be extended in certain circumstances. The program may also cover job coaching and placement services after program completion.'}],
    related:[12,13,37], tags:['vocational rehab','VR&E','Chapter 31','employment','veterans','disability'] },

  // ── More Education ────────────────────────────────────────────────────────
  { id:59, t:'Adult Education: GED, HiSET, and Workforce Training', c:'Education', icon:'📚', time:'7 min', v:2200, rating:4.7, reviews:198, diff:'Easy', updated:'Feb 2026',
    summary:'How to earn a high school equivalency credential as an adult, find free classes, and access workforce training programs that lead to good-paying jobs.',
    steps:['Choose your credential: GED (most widely recognized), HiSET (accepted in most states), or TASC (some states). Check which your state offers — Illinois accepts GED and HiSET.','Find free adult education classes: Illinois Adult Education programs are available at community colleges, libraries, and community organizations. Search at careerlinkil.com or call 877-342-7870.','Prepare for the exam: Khan Academy (khanacademy.org) and the GED official website (ged.com) offer free practice tests and study materials.','Register and take the exam: GED tests are administered at approved testing centers. Cost is $36 per subject ($144 total for all four). Fee waivers available through your adult ed program.','After earning your credential, explore Workforce Innovation and Opportunity Act (WIOA) funded programs for job training in high-demand fields (healthcare, manufacturing, IT, trades).','Illinois Workforce Development: Illinois workNet Centers provide free job training, resume help, and career counseling statewide. Find yours at illinoisworknet.com.'],
    tips:['Many adult education programs are completely free — including textbooks and practice tests.','You can retake failed GED subjects individually without retaking all four — there is a mandatory waiting period after two failures.','Apprenticeship programs combine on-the-job training with classroom instruction and pay you while you learn — explore options at apprenticeship.gov.','SNAP Employment and Training (SNAP E&T) provides additional support for SNAP recipients pursuing job training.'],
    faq:[{q:'Is a GED equivalent to a high school diploma?',a:'For most purposes, yes. Employers, colleges, and military recruiters generally treat a GED the same as a diploma. Some selective employers or institutions may prefer a diploma.'},{q:'Am I too old to get my GED?',a:'No. There is no age maximum — people in their 60s, 70s, and beyond earn their GED. You must be at least 17 (or 16 with special circumstances) and not currently enrolled in high school.'}],
    related:[16,17], tags:['GED','adult education','HiSET','workforce training','WIOA','job training'] },

  { id:60, t:'College Work-Study and Campus Financial Aid Programs', c:'Education', icon:'🎓', time:'6 min', v:1800, rating:4.6, reviews:154, diff:'Easy', updated:'Jan 2026',
    summary:'How Federal Work-Study works, how to find on-campus jobs, and other campus-based financial aid programs beyond the Pell Grant.',
    steps:['Federal Work-Study (FWS): a need-based program that provides part-time jobs for students, funded jointly by the federal government and the school. Eligibility is determined through the FAFSA.','Check your financial aid award letter for a Work-Study award — it will show a dollar amount. This is not free money; you earn it by working.','Find campus jobs: your school\'s financial aid or student employment office maintains a list of FWS-eligible positions. Apply early — spots fill quickly.','Work-Study earnings are paid directly to you (not applied to your bill) and are reported on your W-2. They do not count against you on next year\'s FAFSA.','Institutional grants: in addition to federal aid, most colleges offer their own scholarships and grants based on merit and need — ask the financial aid office what campus-specific aid you may qualify for.','Tuition payment plans: most colleges offer interest-free installment plans (typically 4-5 monthly payments) to spread tuition across the semester — contact your bursar\'s office.'],
    tips:['Work-Study off-campus positions with nonprofits and community service organizations often pay more and provide valuable experience.','If you don\'t use your full Work-Study award in one semester, the unused portion does not carry over.','Appeal your financial aid award if your family circumstances have changed significantly — schools have professional judgment authority to adjust aid.','Scholarship search engines like Fastweb and Scholly can find private scholarships you may qualify for beyond federal aid.'],
    faq:[{q:'Do I have to pay back Work-Study earnings?',a:'No. Work-Study is earned wages, not a loan. However, you will owe taxes on earnings above certain thresholds.'},{q:'What if my school doesn\'t participate in FWS?',a:'About 3,400 schools participate in the FWS program. If your school doesn\'t, ask about institutional work programs, which operate similarly.'}],
    related:[16,17], tags:['work study','financial aid','campus jobs','college','FWS'] },

  // ── More Seniors ──────────────────────────────────────────────────────────
  { id:61, t:'Reverse Mortgage: What It Is, What It Costs, and When It Makes Sense', c:'Seniors', icon:'🏠', time:'9 min', v:2400, rating:4.6, reviews:198, diff:'Hard', updated:'Jan 2026',
    summary:'A no-nonsense guide to Home Equity Conversion Mortgages (HECMs) — how they work, the real costs, and the key questions to ask before signing.',
    steps:['Understand the basics: a HECM (federally insured reverse mortgage) lets homeowners 62+ borrow against their home equity with no monthly mortgage payment required. The loan is repaid when you sell, move out, or die.','Eligibility: must be 62+, own your home outright or have a low balance, live in it as your primary residence, and not be delinquent on any federal debt.','Required counseling: before applying, you must receive HUD-approved HECM counseling from an independent agency (find one at hecmcounseling.org). This is not optional.','Understand the true costs: origination fees (up to $6,000), upfront MIP (2% of home value), ongoing MIP (0.5% annually), closing costs, and servicing fees. These are typically rolled into the loan.','Disbursement options: lump sum (fixed rate only), line of credit (grows over time — often the most flexible), monthly payments, or a combination.','Non-borrowing spouses: if one spouse is under 62, they can be a "non-borrowing spouse" and stay in the home after the borrowing spouse dies — but they cannot access new funds and must maintain the property.'],
    tips:['A reverse mortgage should not be used to fund investments — the costs are too high.','If you plan to move within 5 years, a reverse mortgage is almost never a good idea — the upfront costs make it extremely expensive for short-term use.','Compare with alternatives: home equity loan, HELOC, downsizing, renting out a room, or property tax deferral programs.','HUD-approved counselors are impartial — unlike lenders, they have no incentive to sell you a product.'],
    faq:[{q:'Will I lose my home with a reverse mortgage?',a:'You can lose your home if you fail to pay property taxes, homeowners insurance, or let the property fall into disrepair. These are the most common causes of reverse mortgage foreclosure.'},{q:'What happens when I die?',a:'Your heirs have 30 days (extendable to 12 months) to repay the loan or sell the home. If the home is worth more than the loan, heirs keep the difference. If it\'s worth less, HUD\'s insurance covers the shortfall — heirs never owe more than the home\'s value.'}],
    related:[27,28,26], tags:['reverse mortgage','HECM','home equity','seniors','retirement'] },

  // ── More Justice ─────────────────────────────────────────────────────────
  { id:62, t:'Small Claims Court: Suing Without a Lawyer', c:'Justice', icon:'⚖️', time:'7 min', v:2800, rating:4.8, reviews:289, diff:'Medium', updated:'Feb 2026',
    summary:'How to file a small claims case, what to expect at the hearing, and how to collect your judgment — without needing an attorney.',
    steps:['Check the dollar limit: Illinois Small Claims Court handles disputes up to $10,000. Different states have limits ranging from $2,500 to $25,000.','Identify the correct court: file in the county where the defendant lives, works, or where the dispute occurred. File at the circuit court clerk\'s office.','Complete the complaint form: describe what happened, who the defendant is, and how much money you\'re owed. Filing fees range from $30-$200 depending on the amount claimed.','Serve the defendant: the court will send a summons. In some cases you\'ll need a process server or the county sheriff to serve papers. Keep your proof of service.','Prepare for your hearing: bring all evidence — contracts, receipts, photos, texts, emails, and witness testimony. Organize everything chronologically.','Collect your judgment: winning in court doesn\'t mean you\'ll automatically receive payment. Collection tools include wage garnishment, bank account liens, and property liens.'],
    tips:['Send a demand letter before suing — many disputes are resolved without court, and judges look favorably on plaintiffs who tried to resolve things first.','Bring two copies of all documents — one for the judge, one for yourself. The clerk will handle the defendant\'s copy.','Practice your presentation — you typically have 10-15 minutes. Focus on the most important facts.','A judgment is good for 7-20 years in most states and can be renewed — even if the defendant can\'t pay now, you can collect later.'],
    faq:[{q:'Can I sue a business in small claims court?',a:'Yes. You can sue businesses, including corporations and LLCs. Name the business entity (not just the owner) and find the registered agent\'s address for service.'},{q:'Can I have a lawyer in small claims court?',a:'In most states, yes — though it rarely makes financial sense given the dollar limits. Some states prohibit attorneys in small claims proceedings.'}],
    related:[24,25], tags:['small claims court','lawsuit','self-represented','legal rights','consumer'] },

  { id:63, t:'Immigration Court: What to Expect If You Receive a Notice to Appear', c:'Justice', icon:'🏛️', time:'10 min', v:2600, rating:4.8, reviews:267, diff:'Hard', updated:'Feb 2026',
    summary:'What a Notice to Appear (NTA) means, how immigration court proceedings work, and your rights during the process.',
    steps:['Understand the NTA: a Notice to Appear is the charging document that initiates removal proceedings. It lists the reasons DHS believes you are removable from the U.S.','Appear at every hearing: failure to appear (FTA) results in an automatic order of removal in absentia. Keep your address updated with the immigration court (EOIR).','Find an immigration attorney immediately: immigration proceedings are complex, stakes are extremely high, and there is no right to a government-appointed attorney in immigration court. Many nonprofits provide free representation.','At the Master Calendar Hearing (first appearance): you will state whether you admit or deny the charges and what forms of relief you will seek. Do not answer questions without an attorney present.','Apply for relief: depending on your situation, you may apply for asylum, cancellation of removal, adjustment of status, withholding of removal, or Convention Against Torture (CAT) protection.','At the Individual (Merits) Hearing: you present your full case, testimony, and evidence. The immigration judge decides whether to grant relief or issue removal.'],
    tips:['Update your address with EOIR within 5 days of moving — failure to do so and missing a hearing can result in removal.','Even if you cannot afford an attorney, attend every hearing. Judges cannot help unrepresented people but can continue cases to allow time to find counsel.','Legal aid resources: find free immigration legal services at immigrationadvocates.org/nonprofit/legaldirectory.','Your children who are U.S. citizens are not subject to removal — make plans for their care in all scenarios.'],
    faq:[{q:'Can I work while in removal proceedings?',a:'Only with an Employment Authorization Document (EAD). You may be eligible to apply for one depending on your immigration status or relief application.'},{q:'How long does immigration court take?',a:'The current backlog means cases can take 4-7 years or more from NTA to final decision. You may remain in the U.S. (with or without authorization) during this time.'}],
    related:[9,10,52], tags:['immigration court','removal','NTA','deportation','EOIR','asylum'] },

  // ── More Disability ───────────────────────────────────────────────────────
  { id:64, t:'Special Education: IEP and 504 Plan Rights for Students', c:'Disability', icon:'🎒', time:'8 min', v:2700, rating:4.8, reviews:278, diff:'Medium', updated:'Feb 2026',
    summary:'How to get an IEP or 504 Plan for your child, what each provides, and how to advocate effectively when schools push back.',
    steps:['Understand the two frameworks: IDEA (Individuals with Disabilities Education Act) provides Individualized Education Programs (IEPs) for students whose disability affects their education and who need specialized instruction. Section 504 provides accommodations for students whose disability substantially limits a major life activity but who don\'t need special instruction.','Request an evaluation in writing: send a dated, signed letter to the school principal and special education director requesting a comprehensive evaluation. The school has 60 days (14 school days in Illinois) to respond.','The evaluation is free and must cover all suspected areas of disability. You must give written consent before the evaluation begins.','IEP meeting: you are a full member of the IEP team. The IEP must include: present levels of performance, measurable annual goals, services to be provided, and how progress will be measured.','If you disagree with the IEP: you can request a resolution meeting, file for mediation (free through your state), or request a due process hearing. You do not have to sign the IEP.','504 Plan: simpler than an IEP — a list of accommodations (extended time, preferential seating, note-taking assistance) the school agrees to provide. Request one in writing and get it in writing.'],
    tips:['Document everything in writing: requests, meeting summaries, and agreements. Follow up verbal conversations with a written email summary.','Bring an advocate to IEP meetings — a disability rights organization, parent training center, or trusted person who knows your child. You are allowed to bring anyone.','Schools cannot require you to medicate your child as a condition of receiving services.','Parent Training and Information Centers (PTIs) provide free help navigating special education — find yours at parentcenterhub.org.'],
    faq:[{q:'My child has ADHD — do they qualify for an IEP or 504?',a:'Possibly both. ADHD can qualify under IDEA\'s "Other Health Impairment" category if it adversely affects educational performance. Most students with ADHD who don\'t need special instruction qualify for a 504 Plan.'},{q:'What if the school says my child doesn\'t qualify?',a:'You can disagree with the eligibility determination and request a due process hearing. Get an independent educational evaluation (IEE) at the school\'s expense if you disagree with their evaluation.'}],
    related:[32,33,34], tags:['IEP','504 plan','special education','IDEA','disability','children','school'] },

  // ── More Childcare ────────────────────────────────────────────────────────
  { id:65, t:'Foster Care and Adoption: How to Become a Foster Parent', c:'Childcare', icon:'💛', time:'9 min', v:1900, rating:4.8, reviews:167, diff:'Medium', updated:'Jan 2026',
    summary:'The step-by-step process to become a licensed foster parent in Illinois, what support is provided, and pathways to adoption.',
    steps:['Attend an orientation: in Illinois, DCFS (Department of Children and Family Services) holds free orientations explaining the foster care system, what to expect, and the licensing process.','Complete the pre-service training (PRIDE training): a 30-hour training program covering child development, trauma-informed care, and the foster care system. Usually offered evenings and weekends.','Complete the licensing application and home study: background checks (all adults in the home), medical clearances, home inspection, and interviews with a licensing worker.','Licensing requirements in Illinois: must be at least 21, have a stable income, adequate space for children, and no disqualifying criminal history.','Receive your license and work with a caseworker to accept children: you can specify age ranges, number of children, and any special needs you are or aren\'t equipped to handle.','Foster parent support: Illinois provides a monthly board rate ($507-$1,200+ depending on the child\'s age and needs), Medicaid coverage for foster children, clothing allowances, and respite care.'],
    tips:['Foster parenting is challenging — build a strong support network before you begin.','Trauma-informed parenting training beyond PRIDE is highly valuable — children in foster care have often experienced significant adverse childhood experiences (ACEs).','If adoption is your goal, foster-to-adopt programs focus on placements where adoption may be an outcome — ask DCFS specifically about concurrent planning placements.','The National Foster Parent Association (nfpaonline.org) provides resources and community for foster families nationwide.'],
    faq:[{q:'Can single people or same-sex couples become foster parents?',a:'Yes. Illinois law prohibits discrimination in foster/adoptive parent licensing based on marital status, sexual orientation, or gender identity.'},{q:'How long will a child be placed with me?',a:'It varies — some placements are days, others are years. The goal is always reunification with the birth family if safe. Foster parents are a critical part of that process.'}],
    related:[29,30,31], tags:['foster care','adoption','DCFS','foster parent','children'] },


  // ── Legal Planning (NEW) ──────────────────────────────────────────────────
  { id:66, t:'Power of Attorney: Types, How to Create One, and When You Need It', c:'Legal', icon:'📜', time:'8 min', v:2900, rating:4.8, reviews:267, diff:'Medium', updated:'Feb 2026',
    summary:'A power of attorney lets someone you trust manage your finances or medical care if you\'re unable to. Here\'s what each type does and how to create one correctly.',
    steps:['Understand the types: Financial POA (manages bank accounts, property, bills), Healthcare POA / Healthcare Proxy (makes medical decisions), General POA (broad financial authority), Limited POA (specific tasks), Durable POA (survives incapacitation — the most important type to have).','Choose your agent carefully: this person will have significant legal authority over your affairs. Choose someone trustworthy, organized, and willing to serve in your best interest.','Draft the document: Illinois POA forms are available free at illinoislegalaid.org. You do not need an attorney, but one is recommended for complex situations.','Sign before a notary and two witnesses (requirements vary by state and document type). In Illinois, the agent cannot serve as a witness.','Store it safely and give copies to your agent, your bank, and your doctor. File the healthcare POA with your medical providers.','Review and update POAs every 5-7 years or after major life changes (divorce, death of agent, significant health change).'],
    tips:['A Durable POA is critical — without one, your family may need to go to court for guardianship if you become incapacitated, which is expensive and time-consuming.','Your agent must keep detailed records of all transactions made on your behalf.','You can revoke a POA at any time while you still have mental capacity — do so in writing and notify all relevant parties.','Illinois Legal Aid Online provides free POA forms and instructions for Illinois residents at illinoislegalaid.org.'],
    faq:[{q:'Is a power of attorney the same as a will?',a:'No. A POA is effective during your lifetime and ends at death. A will takes effect at death. You need both for comprehensive planning.'},{q:'Can I have multiple agents?',a:'Yes. You can name co-agents (who must act together) or successor agents (who serve if the first is unable). Co-agents can be efficient but also create conflict — discuss with an attorney.'}],
    related:[67,68], tags:['power of attorney','POA','estate planning','incapacity','legal documents'] },

  { id:67, t:'Advance Directives: Living Wills and Healthcare Wishes', c:'Legal', icon:'🏥', time:'7 min', v:2600, rating:4.8, reviews:245, diff:'Easy', updated:'Feb 2026',
    summary:'How to document your healthcare wishes in advance so they are honored if you can\'t speak for yourself — including living wills, DNR orders, and POLST forms.',
    steps:['Understand the documents: Living Will (documents your wishes about life-sustaining treatment), Healthcare POA / Proxy (names someone to make decisions for you), POLST/MOLST (Physician Orders for Life-Sustaining Treatment — a medical order that travels with you across care settings), DNR (Do Not Resuscitate order — specific instruction to medical staff).','Decide what matters most to you: quality vs. length of life, acceptable medical interventions, pain management preferences, and organ donation wishes.','Complete Illinois-specific forms: the Illinois Declaration for Mental Health Treatment and the Illinois Directive to Physicians are available free at the Illinois Department of Public Health website.','Discuss your wishes with your healthcare agent, family members, and primary care doctor — the conversation is as important as the document.','Give copies to your healthcare agent, primary care doctor, and each hospital or care facility where you receive treatment.','Review your advance directive every 5 years or after a significant diagnosis, hospitalization, or change in your beliefs.'],
    tips:['POLST forms are for people with serious illness or advanced age — they provide more specific medical guidance than a living will and must be signed by a physician.','Your healthcare agent can override your documented wishes only if they believe circumstances have changed significantly — choose someone who truly understands your values.','If you are admitted to a hospital without these documents, hospital staff must make decisions based on state law, which may not reflect your wishes.','Five Wishes (agingwithdignity.org) is a widely used document that meets legal requirements in most states and is written in plain language.'],
    faq:[{q:'What happens if I don\'t have an advance directive?',a:'Medical decisions default to next-of-kin under state law (spouse, adult children, parents, siblings in order). This may not reflect your wishes, and can create family conflict.'},{q:'Can I change my mind after creating one?',a:'Yes, at any time while you have decision-making capacity. Destroy old copies, create new documents, and notify your healthcare providers.'}],
    related:[66,68], tags:['living will','advance directive','DNR','POLST','healthcare','estate planning'] },

  { id:68, t:'Wills and Estate Planning: Protecting What You Leave Behind', c:'Legal', icon:'🏛️', time:'9 min', v:2800, rating:4.8, reviews:289, diff:'Medium', updated:'Feb 2026',
    summary:'Who needs a will, what happens if you die without one, and how to create a basic estate plan that protects your family without spending thousands on lawyers.',
    steps:['Understand dying intestate: if you die without a will, Illinois law decides who gets your assets — typically your spouse and children, but not always as you would choose. Unmarried partners receive nothing.','Inventory your assets: bank accounts, investment accounts, real estate, retirement accounts, life insurance, vehicles, and valuable personal property.','Choose your beneficiaries and executor: the executor administers your estate, pays debts, and distributes assets. Choose someone organized and trustworthy.','Create your will: online tools like LegalZoom, Trust & Will, or FreeWill (freewill.com — free for basic wills) can create valid wills for most people. For complex estates, use an estate attorney.','Sign with witnesses: in Illinois, a will must be signed by you and two adult witnesses who are not beneficiaries. Notarization is not required but recommended.','Update beneficiary designations: bank accounts, retirement accounts (401k, IRA), and life insurance pass by beneficiary designation — outside your will. Review and update these separately.'],
    tips:['A will does NOT avoid probate — it just directs the probate process. A revocable living trust can avoid probate for assets transferred into it.','Store your original will in a fireproof location and tell your executor where it is. A bank safety deposit box can be inaccessible after death.','If you have minor children, name a guardian in your will — this is one of the most important decisions for parents.','Review your will every 3-5 years and after major life events: marriage, divorce, death of a beneficiary or executor, birth of a child, or significant change in assets.'],
    faq:[{q:'Do I need a lawyer to write a will?',a:'No. Online will-creation tools are legally valid for straightforward estates. An attorney is worth the cost for blended families, business ownership, large estates, or when you want to minimize estate taxes.'},{q:'What is probate and should I avoid it?',a:'Probate is the court-supervised process of validating your will and distributing assets. It is public, can take 6-18 months, and costs 3-7% of estate value. Assets with beneficiary designations, POD accounts, and assets in a trust bypass probate.'}],
    related:[66,67], tags:['will','estate planning','probate','executor','inheritance','guardian'] },

  // ── Reentry (NEW) ─────────────────────────────────────────────────────────
  { id:69, t:'Reentry After Incarceration: Benefits, IDs, and Getting Back on Track', c:'Reentry', icon:'🔓', time:'10 min', v:2700, rating:4.8, reviews:245, diff:'Medium', updated:'Feb 2026',
    summary:'A practical guide to restoring benefits, getting ID documents, finding housing and employment after release from prison or jail.',
    steps:['Get your ID documents first: without ID, you cannot work, open a bank account, or access benefits. Illinois releases individuals with a state ID if they don\'t have one. You can also get a birth certificate from your birth state (often $10-$20) and a Social Security card at ssa.gov at no cost.','Restore benefits eligibility: SNAP and Medicaid eligibility is restored upon release for most convictions (drug felonies no longer automatically disqualify in Illinois). Apply at your local DHS office or abe.illinois.gov.','Housing: halfway houses/transitional housing are available through the Illinois Department of Corrections. Apply before release if possible. Most Section 8 programs cannot exclude you based solely on a conviction.','Employment: Illinois Ban the Box law (Job Opportunities for Qualified Applicants Act) prohibits most employers from asking about convictions on initial applications. Convictions can still be considered, but later in the process.','Expungement: certain convictions may be eligible for expungement or sealing after your sentence is complete — potentially opening more housing and employment opportunities.','Healthcare: if released without insurance, apply for Medicaid immediately — you may qualify starting your first day out.'],
    tips:['Contact Safer Foundation (saferfoundation.org) or Heartland Alliance for comprehensive reentry services in Illinois.','Social Security benefits (SSI/SSDI) are suspended during incarceration but not terminated — contact your local SSA office 3 months before release to restart benefits.','Illinois record sealing has expanded significantly — even some felonies can be sealed. Consult Illinois Legal Aid or a free legal clinic.','Many libraries offer free computer access, job search assistance, and reentry resource guides.'],
    faq:[{q:'Can I get food stamps (SNAP) right after release?',a:'Yes, in Illinois. Previous drug felony conviction restrictions on SNAP were removed. Apply immediately upon release.'},{q:'What about voting rights?',a:'In Illinois, your voting rights are automatically restored upon release from incarceration — even for felony convictions. You can register to vote immediately.'}],
    related:[24,25,62], tags:['reentry','incarceration','expungement','housing','employment','benefits'] },

  { id:70, t:'Workers\' Compensation: What to Do When You\'re Injured on the Job', c:'Employment', icon:'🦺', time:'8 min', v:3100, rating:4.8, reviews:298, diff:'Medium', updated:'Feb 2026',
    summary:'How to file a workers\' comp claim in Illinois, what benefits you\'re entitled to, and what to do when your employer disputes your claim.',
    steps:['Report your injury immediately: Illinois law requires you to report a work injury to your employer within 45 days. Do it in writing, dated, and keep a copy.','Seek medical treatment: your employer has the right to send you to a specific doctor for the first visit (in some cases). After that, you have the right to choose your own physician.','File a claim with the Illinois Workers\' Compensation Commission (IWCC) at iwcc.il.gov — especially if your employer disputes your claim or doesn\'t offer a settlement.','Understand your benefits: medical expenses (100% covered), temporary total disability (TTD) = 2/3 of your average weekly wage while you cannot work, permanent partial disability (PPD) for lasting impairments, and vocational rehabilitation.','Do not resign or sign any release without consulting an attorney — you may be giving up significant rights.','Hire a workers\' comp attorney: they work on contingency (typically 20% of your settlement) and can dramatically improve your outcome.'],
    tips:['Never exaggerate injuries — this gives the insurer grounds to deny your entire claim.','Keep records of all medical appointments, medications, mileage to appointments, and how the injury affects your daily life.','Your employer cannot legally fire you for filing a workers\' comp claim — retaliation is a separate cause of action.','Independent Medical Examinations (IMEs) are often ordered by the insurance company — these doctors often minimize findings. You have the right to your own medical opinion.'],
    faq:[{q:'What if my employer says I\'m an independent contractor?',a:'Contractors are generally not covered by workers\' comp. However, if you were misclassified as a contractor when you should be an employee, you may still have a claim. Consult an attorney.'},{q:'How long do I have to file a claim?',a:'In Illinois, you generally have 3 years from the date of injury (or 2 years from the last payment of compensation) to file a claim with the IWCC.'}],
    related:[44,45,46], tags:['workers comp','workplace injury','Illinois','IWCC','disability','employment'] },

  { id:71, t:'Unemployment Appeals: How to Win Your Hearing', c:'Employment', icon:'📢', time:'8 min', v:2800, rating:4.7, reviews:267, diff:'Medium', updated:'Feb 2026',
    summary:'Step-by-step guide to winning an unemployment benefits appeal — what to argue, how to prepare evidence, and common mistakes to avoid.',
    steps:['Understand why you were denied: the most common reasons are voluntary quit, misconduct, and insufficient earnings. Your denial letter will state the specific reason.','File your appeal within the deadline: in Illinois, you have 30 days from the mailing date of the denial to file your appeal with the Illinois Department of Employment Security (IDES).','Gather evidence: gather documentation that supports your version of events — emails, texts, written warnings, HR policies, witness contact information, pay stubs, and medical records if relevant.','For voluntary quit appeals, argue: good cause connected to work (unsafe conditions, significant pay cut, harassment, health issue requiring relocation). Personal reasons do not qualify as good cause.','For misconduct appeals, argue: the alleged conduct did not rise to the level of "misconduct" as defined by law, or you had good cause for your actions, or the employer\'s policy was not clear.','At the hearing (usually by phone): be concise, respectful, and factual. The referee asks questions and both parties present evidence. You can call witnesses and cross-examine the employer\'s witnesses.'],
    tips:['Confirm your hearing by phone the day before — many people miss hearings by assuming notice was sufficient.','Request a postponement if you need more time to gather evidence or get an attorney — it is usually granted once.','An attorney or union rep can represent you at the hearing — Illinois Legal Aid Online can help you find representation.','Even if you lose at the referee level, you can appeal to the IDES Board of Review, then to circuit court.'],
    faq:[{q:'What happens if I miss my appeal deadline?',a:'You lose your right to appeal in most cases. Call IDES immediately — in rare circumstances, a late appeal can be accepted for "good cause" such as medical emergency.'},{q:'What does "misconduct" mean for unemployment purposes?',a:'Deliberate or wanton disregard of the employer\'s interests. Simple mistakes, poor performance, or disagreements with management do not constitute misconduct under Illinois law.'}],
    related:[3,44,45], tags:['unemployment appeal','IDES','misconduct','voluntary quit','hearing'] },

  // ── More Consumer ─────────────────────────────────────────────────────────
  { id:72, t:'Identity Theft: How to Recover and Protect Yourself', c:'Consumer', icon:'🔐', time:'9 min', v:3400, rating:4.9, reviews:389, diff:'Medium', updated:'Feb 2026',
    summary:'What to do immediately after discovering identity theft, how to dispute fraudulent accounts, and steps to prevent it from happening again.',
    steps:['Place a fraud alert: call one of the three credit bureaus (Equifax 800-685-1111, Experian 888-397-3742, TransUnion 800-888-4213) — they must notify the other two. A fraud alert is free and lasts 1 year.','Place a credit freeze (strongest protection): contact each bureau separately to freeze your credit. This prevents anyone from opening new accounts in your name. Free, effective immediately, and can be lifted when needed.','Report to the FTC: file an identity theft report at identitytheft.gov — this creates an official report and generates a personalized recovery plan.','File a police report: bring your FTC Identity Theft Report to your local police department. A police report helps dispute fraudulent accounts and may be required by some creditors.','Dispute fraudulent accounts: write to each creditor and credit bureau listing fraudulent accounts. Include your FTC report and police report as supporting documents.','Monitor all accounts: check bank statements, credit reports, and tax transcripts (account.irs.gov) for signs of continued fraud.'],
    tips:['An extended fraud alert (7 years) is available to identity theft victims — you\'ll need to provide a police report or FTC report.','Consider a credit freeze over a fraud alert — freezes prevent new accounts entirely, while alerts just require creditors to take extra steps.','IRS Identity Protection PIN (IP PIN): if your SSN was used to file a fraudulent tax return, request an IP PIN at irs.gov/ippin.','Synthetic identity fraud (combining real and fake information) is harder to detect — monitor your credit regularly even if you haven\'t been affected.'],
    faq:[{q:'Does a credit freeze affect my existing accounts?',a:'No. A freeze only prevents new accounts from being opened. Your existing credit cards, loans, and accounts continue to work normally.'},{q:'What if someone filed taxes using my SSN?',a:'File a paper return with Form 14039 (Identity Theft Affidavit) attached. The IRS will investigate and, if resolved in your favor, issue your refund — though it can take 12-18 months.'}],
    related:[41,43,42], tags:['identity theft','credit freeze','fraud alert','FTC','recovery','security'] },

  { id:73, t:'Bankruptcy Basics: Chapter 7 vs. Chapter 13 — Is It Right for You?', c:'Consumer', icon:'⚖️', time:'10 min', v:2900, rating:4.7, reviews:278, diff:'Hard', updated:'Jan 2026',
    summary:'When bankruptcy makes sense, what it can and cannot discharge, and the key differences between Chapter 7 (liquidation) and Chapter 13 (repayment plan).',
    steps:['Understand when bankruptcy helps: it discharges (eliminates) most unsecured debts — credit cards, medical bills, personal loans — but NOT student loans (usually), child support, alimony, recent taxes, or criminal fines.','Chapter 7 (Liquidation): most debts discharged in 3-4 months. Your non-exempt assets may be sold. You must pass the "means test" (income below your state median or pass a disposable income calculation).','Chapter 13 (Reorganization): you keep your assets and repay some or all debts over 3-5 years through a court-approved plan. Best if you want to save a home from foreclosure or have non-exempt assets.','Consult a bankruptcy attorney before filing: many offer free consultations. Filing incorrectly can result in case dismissal.','Credit counseling: federal law requires completing a credit counseling course from an approved agency within 180 days before filing.','After discharge: Chapter 7 stays on your credit report for 10 years; Chapter 13 for 7 years. Rebuilding credit can begin immediately with secured cards and responsible habits.'],
    tips:['Don\'t transfer assets or pay back family members before filing — these can be "preference payments" or fraudulent transfers that complicate your case.','Illinois exemptions protect certain assets in Chapter 7: your home equity up to $15,000 ($30,000 for married couples), one vehicle up to $2,400, and more.','Bankruptcy stops foreclosures, repossessions, wage garnishments, and collection calls immediately via the "automatic stay."','Non-bankruptcy alternatives: debt management plans, debt settlement, and negotiating directly with creditors may achieve debt relief without the long-term credit impact of bankruptcy.'],
    faq:[{q:'Will I lose my home in bankruptcy?',a:'In Chapter 13, typically no — you can cure mortgage arrears through your repayment plan. In Chapter 7, if your equity exceeds the homestead exemption, the trustee may sell your home.'},{q:'Can I include tax debt in bankruptcy?',a:'Some income tax debt can be discharged in Chapter 7 if the taxes are at least 3 years old, the return was filed on time at least 2 years ago, and the IRS assessed the tax at least 240 days before filing.'}],
    related:[41,42,43], tags:['bankruptcy','Chapter 7','Chapter 13','debt relief','financial hardship'] },

  // ── More Healthcare ───────────────────────────────────────────────────────
  { id:74, t:'Telehealth: How to Access Virtual Doctor Visits and Mental Health Care', c:'Healthcare', icon:'💻', time:'6 min', v:3200, rating:4.8, reviews:312, diff:'Easy', updated:'Feb 2026',
    summary:'How to use telehealth services through your insurance, for free, or at low cost — including mental health, primary care, and specialist visits.',
    steps:['Check your insurance first: most major insurers and Medicare now cover telehealth for primary care, mental health, and many specialty visits at the same cost as in-person visits.','Find free or low-cost telehealth: Federally Qualified Health Centers (FQHCs) at findahealthcenter.hrsa.gov offer telehealth at sliding-scale fees. Open Door Community Health Centers serve anyone regardless of ability to pay.','Mental health apps and platforms: Talkspace and BetterHelp offer therapy subscriptions ($65-$100/week). Some insurance plans fully cover BetterHelp sessions. Headspace and Calm offer free meditations.','For urgent non-emergency care: Urgent Care virtual visits (MDLive, Teladoc, AmWell) typically cost $75-$90 without insurance and can prescribe most non-controlled medications.','Prescription refills: many primary care telehealth services can issue refills for chronic condition medications. Controlled substances (like ADHD medications) have more restrictions.','Prepare for your visit: find a quiet, private location, test your internet connection and camera, and have your ID, insurance card, pharmacy info, and a list of current medications ready.'],
    tips:['Many employers offer free telehealth through their EAP or benefits package — check before paying out of pocket.','Amazon Clinic and Walmart Health (where available) offer low-cost telehealth services with transparent pricing.','Mental health telehealth is often more accessible and less stigmatizing than in-person — appointment wait times are typically much shorter.','Illinois expanded telehealth coverage requirements significantly in 2021 — insurers must cover telehealth at parity with in-person services.'],
    faq:[{q:'Is telehealth as good as in-person care?',a:'For most conditions — yes. Studies show comparable outcomes for primary care, mental health, chronic disease management, and many specialty consultations. Some conditions require physical examination.'},{q:'What about prescriptions from telehealth?',a:'Telehealth providers can prescribe most medications. The Ryan Haight Act restricts prescribing controlled substances via telehealth without an in-person relationship (with some exceptions expanded during COVID).'}],
    related:[18,47,49], tags:['telehealth','virtual care','online doctor','mental health','prescription'] },

  { id:75, t:'Substance Use Treatment: Finding Help and Understanding Your Options', c:'Healthcare', icon:'🌱', time:'8 min', v:2800, rating:4.9, reviews:334, diff:'Easy', updated:'Feb 2026',
    summary:'How to access substance use treatment — from free community programs to residential rehab — and understanding insurance coverage, MAT, and crisis resources.',
    steps:['Contact SAMHSA\'s National Helpline: 1-800-662-4357 (1-800-662-HELP) — free, confidential, 24/7, in English and Spanish. Provides referrals to local treatment facilities, support groups, and community-based organizations.','Find local treatment: SAMHSA\'s treatment locator at findtreatment.gov lists providers by location, type of care, insurance accepted, and specialty.','Illinois DHS Division of Substance Use Prevention and Recovery (SUPR): provides publicly funded treatment for Illinois residents who are uninsured or underinsured. Call 800-843-6154 or search at dhs.illinois.gov.','Medication-Assisted Treatment (MAT): FDA-approved medications (buprenorphine, methadone, naltrexone/Vivitrol) combined with counseling are the most effective treatment for opioid and alcohol use disorders. These are covered by Medicaid and most insurance.','Levels of care: outpatient (weekly appointments), intensive outpatient (IOP, 9+ hrs/week), partial hospitalization (PHP), residential (inpatient), and detox (medically supervised withdrawal).','Peer support specialists: people in recovery who provide support and connection to resources. Many treatment centers and community organizations offer peer support at no cost.'],
    tips:['Medicaid covers comprehensive substance use treatment in Illinois including MAT, counseling, and residential treatment.','Narcan/naloxone (opioid overdose reversal medication) is available without a prescription at Illinois pharmacies — stock it if you or someone you know uses opioids.','Recovery housing (sober living homes) provides a supportive, drug-free environment post-treatment — costs range from free to $800+/month.','Al-Anon (al-anon.org) and Nar-Anon provide free support for family members of people struggling with addiction.'],
    faq:[{q:'What if someone refuses treatment?',a:'You cannot force an adult into treatment. Focus on harm reduction, maintain the relationship, and consider an intervention facilitated by a professional interventionist or counselor.'},{q:'Does my employer find out if I seek treatment?',a:'HIPAA protects your health information. The ADA also protects employees who voluntarily seek treatment for substance use disorders. Your employer is not entitled to know unless your work performance is affected.'}],
    related:[47,48,18], tags:['substance use','addiction','treatment','MAT','recovery','SAMHSA'] },

  // ── More Benefits ─────────────────────────────────────────────────────────
  { id:76, t:'Social Security Survivors Benefits', c:'Benefits', icon:'💔', time:'8 min', v:2600, rating:4.8, reviews:245, diff:'Medium', updated:'Feb 2026',
    summary:'If a spouse, parent, or other family member dies, their Social Security record may support monthly survivor benefits for you — here\'s who qualifies and how to apply.',
    steps:['Notify Social Security immediately after a death: call 1-800-772-1213. You cannot apply for survivor benefits online — you must call or visit a local office.','Who qualifies: widow/widower (60+, or 50+ if disabled, or any age if caring for deceased\'s child under 16), divorced spouse (if married 10+ years), children under 18 (or 19 if in high school), and dependent parents (62+).','Understand the benefit amount: widow/widowers receive 100% of the deceased\'s benefit amount at full retirement age, or a reduced amount as early as age 60. Children receive 75% of the deceased\'s benefit.','One-time lump-sum death payment: $255 is available to the surviving spouse or, if no surviving spouse, to children — apply within 2 years of death.','You must choose: if you qualify for both your own Social Security benefit and survivor benefits, you can take the lower benefit first and switch to the higher one later.','If you remarry before 60, you generally cannot collect survivor benefits on the prior spouse\'s record. Remarriage at 60+ does not affect eligibility.'],
    tips:['Survivor benefits are separate from your own retirement benefits — you can maximize by claiming one early and the other at 70.','Divorced spouses who were married 10+ years may collect survivor benefits even if the deceased has remarried.','Apply as soon as possible after death — benefits are not paid for months before the application date.','Death certificates will be requested — have several certified copies available.'],
    faq:[{q:'Do survivor benefits affect my own future Social Security?',a:'No. Collecting survivor benefits does not reduce or affect your own future Social Security retirement or disability benefits.'},{q:'My parent died. Do I qualify as an adult child?',a:'Generally only if you were disabled before age 22 and remain disabled. Otherwise, adult children do not receive survivor benefits.'}],
    related:[28,4,5], tags:['survivor benefits','Social Security','widow','death','family benefits'] },

  { id:77, t:'Low Income Home Weatherization Assistance Program (WAP)', c:'Benefits', icon:'🏠', time:'5 min', v:1900, rating:4.7, reviews:167, diff:'Easy', updated:'Jan 2026',
    summary:'Free home energy efficiency improvements — insulation, air sealing, furnace tune-ups, and more — for income-qualifying homeowners and renters.',
    steps:['Check eligibility: income at or below 200% of the federal poverty level (~$61,320 for a family of 4 in 2024). Households receiving LIHEAP, SSI, SNAP, or TANF are automatically income-eligible.','Find your local WAP provider: contact the Illinois Home Weatherization Assistance Program at 800-843-6154 or visit dhs.illinois.gov/energy. Each county has a designated community action agency.','Apply through your local provider — they will assess your home and determine eligible measures.','A certified energy auditor inspects your home to identify where energy is being wasted and what improvements will have the most impact.','Approved work is completed by certified contractors at no cost to you: attic/wall insulation, air sealing, window/door weatherstripping, heating system tune-up or replacement, health and safety repairs.','Renters can also receive WAP services with landlord permission — the improvements benefit both the tenant (lower bills) and landlord (improved property value).'],
    tips:['WAP services are completely free — the average home receives about $7,500 in improvements.','Homes with elderly, disabled, or young children get priority scheduling.','WAP and LIHEAP are complementary — you can receive both energy bill assistance and weatherization improvements.','After weatherization, the average household saves 25-35% on energy bills annually.'],
    faq:[{q:'Do I own the home to qualify?',a:'No. Renters qualify too, but the landlord must agree to allow the work. For rental properties, landlords are sometimes required to contribute to the cost of larger improvements.'},{q:'Will this affect my rent?',a:'It should not. WAP typically requires landlords to agree not to raise rent as a direct result of the improvements for a set period.'}],
    related:[40,14,15], tags:['weatherization','WAP','energy efficiency','low income','home improvement'] },

  // ── More Taxes ────────────────────────────────────────────────────────────
  { id:78, t:'Self-Employment Taxes: What Freelancers and Gig Workers Must Know', c:'Taxes', icon:'🧾', time:'8 min', v:3100, rating:4.8, reviews:312, diff:'Medium', updated:'Feb 2026',
    summary:'Quarterly estimated taxes, the self-employment tax, business deductions, and how to avoid the most common mistakes that get freelancers into trouble with the IRS.',
    steps:['Understand the self-employment tax: you pay both the employee and employer portions of Social Security (12.4%) and Medicare (2.9%) — totaling 15.3% on net self-employment income. This is in addition to income tax.','Deduct half of self-employment tax: the IRS allows you to deduct 50% of your SE tax from gross income, effectively reducing your income tax burden.','Make quarterly estimated payments to avoid penalties: due April 15, June 15, September 15, and January 15. Use Form 1040-ES or pay at irs.gov/payments.','Calculate quarterly payments: a safe harbor is paying 100% of last year\'s tax liability in equal installments (110% if your prior year income exceeded $150K).','Maximize business deductions: home office (must be exclusive, regular business use), vehicle mileage (67 cents/mile in 2024), health insurance premiums, retirement contributions (SEP-IRA up to 25% of net SE income), business equipment, and professional development.','Keep meticulous records: use accounting software (Wave is free, QuickBooks Self-Employed is ~$15/month) to track all income and expenses throughout the year.'],
    tips:['Open a separate business bank account and credit card immediately — this makes tracking deductions vastly easier and protects you in an audit.','Set aside 25-30% of each payment you receive for taxes — it\'s easy to spend money you\'ll need for taxes later.','1099-K reporting change: payment platforms must issue 1099-Ks for payments over $600 starting in 2026 (delayed multiple times). Keep records of all transactions regardless.','A SEP-IRA lets you contribute up to $69,000 (2024) based on income — a powerful tax reduction tool for profitable self-employed individuals.'],
    faq:[{q:'Do I have to pay quarterly taxes if I also have a W-2 job?',a:'If your side income results in more than $1,000 in annual taxes, quarterly payments are recommended to avoid the underpayment penalty. You can also increase W-4 withholding from your employer to cover side income taxes.'},{q:'Can I deduct my home office if I work from home sometimes?',a:'Only if you have a dedicated space used exclusively and regularly for business. A corner of your living room or a shared room doesn\'t qualify — but a separate room used only for work does.'}],
    related:[21,22,35], tags:['self-employment tax','freelance','gig worker','quarterly taxes','deductions','1099'] },

  { id:79, t:'Property Tax Exemptions and Appeals', c:'Taxes', icon:'🏡', time:'7 min', v:2400, rating:4.7, reviews:221, diff:'Medium', updated:'Feb 2026',
    summary:'How to reduce your property taxes through exemptions for seniors, disabled homeowners, and veterans — and how to appeal if your assessment is too high.',
    steps:['Find your current assessed value: check your county assessor\'s website or your property tax bill. In Illinois, property is assessed at 33.33% of fair market value in most counties (except Cook County).','Apply for all exemptions you qualify for — in Illinois: General Homestead Exemption ($10,000 reduction in EAV for your primary residence), Senior Citizens Homestead Exemption (additional $8,000), Senior Citizens Assessment Freeze (locks your assessed value), Disabled Persons Exemption ($2,000 reduction), and Disabled Veterans Exemptions (up to 100% exemption for service-connected disability).','Apply through your county assessor\'s office — most exemptions require annual renewal. Deadlines vary by county.','Review your assessment for errors: compare your assessed value to recent sales of similar properties. Look for errors in property characteristics (square footage, number of rooms, lot size).','File an appeal if your assessment is too high: in Cook County, appeal to the Cook County Assessor\'s Office, then the Board of Review. In other Illinois counties, appeal to the County Board of Review.','Gather comparables: find 3-5 similar properties (same neighborhood, similar size and age) that sold recently for less than your assessed value implies. This is your evidence.'],
    tips:['Deadlines for exemptions and appeals vary by county — look up your specific county\'s calendar as missing the deadline means waiting another year.','In Cook County, property assessments rotate — your township is reassessed every 3 years. Appeal in your reassessment year for maximum impact.','Hiring a property tax appeal firm is common — they typically charge a contingency fee of 30-40% of your first year\'s savings. Worth it for high-value properties.','Senior Assessment Freeze is often the most valuable benefit — it can save thousands per year as the market rises.'],
    faq:[{q:'What if I miss the appeal deadline?',a:'You wait until next year. In Cook County, you can appeal during the Assessor\'s open appeals period or at the Board of Review — two separate opportunities annually.'},{q:'Can I get a refund on past property taxes?',a:'Generally no — appeals are prospective. However, if you discover you never applied for an exemption you qualified for, you may be able to apply retroactively for up to 2-3 years in some counties.'}],
    related:[21,22,68], tags:['property tax','exemption','seniors','disabled','appeal','homeowner'] },

  // ── More Housing ─────────────────────────────────────────────────────────
  { id:80, t:'Emergency Rental Assistance: Programs When You\'re Behind on Rent', c:'Housing', icon:'🆘', time:'6 min', v:3300, rating:4.8, reviews:312, diff:'Easy', updated:'Feb 2026',
    summary:'What to do if you\'re facing eviction for unpaid rent — emergency rental assistance programs, utility help, and your rights during the process.',
    steps:['Contact Illinois Rental Payment Program (ILRPP) or local equivalent immediately at illinoisrentalassistance.org — programs provide up to 15 months of rent and utility arrears for eligible households.','Eligibility for most ERA programs: household income at or below 80% of Area Median Income (AMI), one or more household members at risk of housing instability.','Call 211: dial 2-1-1 or visit 211.org to find local emergency rental assistance, food banks, utility assistance, and other crisis resources near you.','Negotiation with landlord: landlords often prefer partial payment and a payment plan over the cost and time of eviction proceedings — communicate openly before legal action begins.','Know your eviction timeline: Illinois law requires a 5-day written notice for nonpayment before eviction proceedings can begin. Use this time to find assistance.','Legal aid: if served with eviction papers, contact Illinois Legal Aid Online (illinoislegalaid.org) or Prairie State Legal Services immediately — free representation may be available.'],
    tips:['Apply for assistance even if you\'re only one month behind — programs often require documentation of a risk of homelessness, not actual eviction proceedings.','Emergency assistance is often available through local churches, community action agencies, and mutual aid networks — search "[your city] rental assistance."','In Illinois, an eviction takes 30-60+ days through the court process — you have time if you act quickly.','Document all communications with your landlord about your situation in writing.'],
    faq:[{q:'Will emergency rental assistance affect my credit?',a:'The assistance itself does not appear on your credit report. However, unpaid rent that goes to collections can damage your credit — act before that happens.'},{q:'Can I get help with back rent from before the pandemic?',a:'Most current programs focus on recent arrears. Contact 211 for the most up-to-date information on what periods are covered by local programs.'}],
    related:[14,15,50], tags:['emergency rental assistance','eviction','ERA','housing crisis','ILRPP'] },

  // ── More Seniors ──────────────────────────────────────────────────────────
  { id:81, t:'Senior Nutrition Programs: Meals on Wheels and Congregate Dining', c:'Seniors', icon:'🍽️', time:'5 min', v:2100, rating:4.7, reviews:187, diff:'Easy', updated:'Jan 2026',
    summary:'Free and low-cost meal programs for seniors — home-delivered meals, community dining sites, and supplemental food programs available in every Illinois county.',
    steps:['Contact your local Area Agency on Aging: the Illinois network of 13 Area Agencies on Aging coordinates nutrition programs in every county. Find yours at ageguide.org or call 800-252-8966.','Home-Delivered Meals (Meals on Wheels): available for homebound seniors who cannot leave home without assistance. Meals are delivered to your door typically 5 days a week. Based on the Older Americans Act — no income requirement, though donations are welcomed.','Congregate Meal Sites: community dining sites at senior centers, churches, and community centers provide hot meals in a social setting. Also funded by the Older Americans Act with no income requirement.','Commodity Supplemental Food Program (CSFP): USDA program providing monthly food packages specifically for low-income seniors 60+. Income limit: 130% of FPL. Contact your local food bank to enroll.','SNAP: seniors often qualify for SNAP benefits and can use them at grocery stores and farmers markets. The application can be completed at home by phone.','Illinois Senior Health Insurance Program (SHIP): provides free Medicare counseling alongside nutrition program connections — call 800-548-9034.'],
    tips:['Most nutrition programs allow you to request culturally appropriate foods or accommodate dietary restrictions — ask when enrolling.','Meals on Wheels programs often provide more than food — regular wellness checks, safety monitoring, and social connection.','Grocery delivery services (Instacart, Amazon Fresh, Walmart+) accept EBT/SNAP as payment and are an option for mobile seniors.','Illinois seniors can get additional produce at farmers markets through the Farmers Market Nutrition Program — check local farmers markets for the program.'],
    faq:[{q:'Is there a cost for Meals on Wheels?',a:'The program is funded through the Older Americans Act and is available at no required cost. Voluntary donations are accepted to support the program.'},{q:'How do I qualify for home-delivered meals?',a:'You must be 60 or older and homebound (leaving home requires considerable effort or assistance). There is no income requirement. Contact your local Area Agency on Aging to be assessed.'}],
    related:[26,27,55], tags:['meals on wheels','senior nutrition','congregate dining','Older Americans Act','food'] },

  { id:82, t:'Senior Transportation Options and Reduced Fare Programs', c:'Seniors', icon:'🚌', time:'6 min', v:1800, rating:4.6, reviews:154, diff:'Easy', updated:'Jan 2026',
    summary:'Free and reduced-cost transportation options for seniors and disabled individuals — from Ride Free Transit Programs to medical transportation benefits.',
    steps:['Illinois Ride Free Program: Illinois seniors 65+ and disabled individuals with valid Ride Free Transit Card can ride RTA public transit (CTA, Metra, Pace) for free. Apply at RTAChicago.org.','Pace ADA Paratransit: for individuals whose disability prevents use of fixed-route transit, Pace provides door-to-door service in the Chicago metro area. ADA certification required.','Downstate Public Transit: Illinois has public transit systems in most mid-size cities — Champaign, Springfield, Peoria, and others — many with senior reduced fares.','Medical transportation through Medicaid: if you are a Medicaid beneficiary, you may be entitled to free Non-Emergency Medical Transportation (NEMT) to medical appointments. Call your MCO (managed care organization) 48+ hours in advance.','Area Agency on Aging transportation programs: many local AAA programs provide volunteer driver programs for seniors — for medical appointments, errands, and social activities.','Senior ride services: programs like GoGoGrandparent (1-855-464-6872) enable seniors without smartphones to use Uber/Lyft via a simple phone call.'],
    tips:['AARP Smart Driver Course can reduce auto insurance premiums by 5-15% and refreshes driving skills — available online or in person.','For rural seniors, contact your local Township Road Commissioner or Township Supervisor — Illinois townships often run transportation assistance programs.','Veterans may be eligible for VA transportation services to medical appointments — contact your VA medical center\'s patient transportation coordinator.','Free vehicle modification programs may be available for disabled veterans and low-income disabled individuals through state programs.'],
    faq:[{q:'What is the Ride Free Transit Card?',a:'A card issued to Illinois seniors 65+ and qualifying disabled individuals that provides free rides on all CTA, Metra, and Pace routes. Apply at RTAChicago.org or at participating libraries and community centers.'},{q:'What if I live in a rural area with no public transit?',a:'Contact your local Area Agency on Aging and your township office — volunteer driver networks, medical transportation programs, and community shuttles exist in most rural Illinois counties.'}],
    related:[26,27,81], tags:['senior transportation','RTA','Ride Free','Medicaid transportation','paratransit'] },

  // ── More Education ────────────────────────────────────────────────────────
  { id:83, t:'Pell Grant Lifetime Limit and Transfer Student Aid Guide', c:'Education', icon:'🎓', time:'7 min', v:2200, rating:4.7, reviews:198, diff:'Medium', updated:'Feb 2026',
    summary:'How the Pell Grant lifetime limit works, how to maximize your aid when transferring between schools, and other grant programs you may have missed.',
    steps:['Understand Pell Grant lifetime eligibility: you have 600% of Pell Grant eligibility total (equivalent to 6 full-time years of aid). Check your remaining eligibility at studentaid.gov under "Aid Summary."','Pell for short-term programs: the FAFSA Simplification Act created "Short-Term Pell" for high-quality, non-degree workforce programs in high-demand fields — expanding access in 2024-25.','Transferring schools: your financial aid does not automatically transfer. File an updated FAFSA listing your new school and contact the financial aid office at both your old and new school.','Federal Supplemental Educational Opportunity Grant (SEOG): schools with the highest-need students receive SEOG funds to supplement Pell. Awards range from $100-$4,000/year — ask your financial aid office.','Illinois state grants: Monetary Award Program (MAP) grant provides up to $6,998/year for Illinois residents with exceptional financial need at in-state schools. Apply early via FAFSA — MAP funds run out.','Teacher Education Assistance for College and Higher Education (TEACH) Grant: provides up to $4,000/year for students committed to teaching in high-need subjects at low-income schools — converts to a loan if you don\'t fulfill the teaching obligation.'],
    tips:['File FAFSA as close to October 1 (the opening date) as possible — state grant funds are limited and distributed first-come, first-served.','Even community colleges have institutional grants — ask the financial aid office what school-specific aid you may qualify for.','If your family\'s financial situation changed significantly since the prior tax year used on your FAFSA, request a "professional judgment" review from your financial aid office.','Academic Competitiveness Grant and National SMART Grant: no longer active, but some schools have their own merit-based equivalents for high achievers with financial need.'],
    faq:[{q:'Can I get Pell Grant for graduate school?',a:'No. Pell Grants are only for undergraduate students who have not yet earned a bachelor\'s degree.'},{q:'What happens to my financial aid if I drop below half-time enrollment?',a:'Pell Grant is reduced — you receive a prorated amount. Federal loans and some grants are only available to half-time+ students. Check with your financial aid office before dropping courses.'}],
    related:[16,17,59], tags:['Pell Grant','MAP grant','financial aid','transfer','SEOG','college'] },

  // ── More Justice ─────────────────────────────────────────────────────────
  { id:84, t:'Landlord-Tenant Mediation and Avoiding Court', c:'Justice', icon:'🤝', time:'6 min', v:2300, rating:4.7, reviews:212, diff:'Easy', updated:'Feb 2026',
    summary:'How to resolve landlord-tenant disputes through mediation — faster, cheaper, and less stressful than going to court.',
    steps:['Try direct negotiation first: put your request in writing (email or letter), be specific about the issue and resolution you want, and give a reasonable deadline.','Contact local mediation programs: many Illinois counties and cities offer free or low-cost landlord-tenant mediation through the court system or community organizations. Chicago has the Chicago Eviction Prevention Project.','File a complaint with your local housing authority: habitability violations (heat, plumbing, pests) can be reported to your city or county housing inspector, who can issue violations against the landlord.','Illinois Attorney General Consumer Protection Division: file complaints about lease violations, deposit disputes, and other landlord misconduct at illinoisattorneygeneral.gov.','Small claims court: for security deposit disputes under $10,000, small claims court is a practical option. Many deposit disputes are resolved through the mediation offered before the hearing.','Request a hearing with the Illinois Human Rights Commission if the dispute involves discrimination based on a protected class (race, sex, religion, national origin, disability, familial status).'],
    tips:['Most housing disputes are resolved before court — a formal written complaint to the right agency often gets a quicker response than litigation.','Document everything: photos, dates, communications. This protects you whether you resolve the dispute informally or go to court.','A letter from a legal aid attorney (even if you never intend to sue) often motivates landlords to resolve issues quickly.','Community mediation centers (often free) can facilitate conversations when direct negotiation has broken down.'],
    faq:[{q:'What is mediation?',a:'A voluntary, confidential process where a neutral third party helps both parties reach an agreement. It is not binding unless both parties sign an agreement. Much faster and cheaper than court.'},{q:'Do I need a lawyer for mediation?',a:'No, and lawyers are often not present. You represent yourself. Legal aid can advise you on your rights before mediation.'}],
    related:[50,62,14], tags:['mediation','landlord','tenant','dispute','eviction','housing'] },

  // ── More Business ─────────────────────────────────────────────────────────
  { id:85, t:'Crowdfunding, Grants, and Alternative Funding for Small Businesses', c:'Business', icon:'🌟', time:'8 min', v:2600, rating:4.7, reviews:245, diff:'Medium', updated:'Feb 2026',
    summary:'Beyond bank loans — equity crowdfunding, reward-based crowdfunding, business grants, and community development financial institutions that fund entrepreneurs banks won\'t.',
    steps:['Crowdfunding platforms: Kickstarter and Indiegogo (reward-based, keep the money if funded by supporters through rewards/perks), Wefunder and Republic (equity-based, sell small equity stakes to many small investors under SEC Reg CF).','Business grants: unlike loans, grants don\'t need to be repaid. Grants.gov lists all federal business grants. SBIR/STTR grants fund R&D projects at small businesses. Many states, cities, and foundations offer small business grants.','Illinois-specific grants: the Illinois Department of Commerce and Economic Opportunity (DCEO) administers various business grants at commerce.illinois.gov. Check city and county economic development offices for hyperlocal grants.','CDFIs (Community Development Financial Institutions): nonprofits that provide loans to businesses that can\'t access traditional banking. In Illinois: Accion Chicago, Chicago Community Loan Fund, and IFF are key CDFIs.','Microloans: Accion (accionchicago.org) provides microloans $5,000-$100,000 to small businesses and startups in the Chicago area. Kiva U.S. offers 0% interest loans up to $15,000 through crowdfunded lending.','Women-, minority-, and veteran-owned business certifications: these designations unlock set-aside government contracts and specialized grant programs. Apply through the SBA (8(a), WOSB, VOSB programs) and DCEO.'],
    tips:['A Kickstarter campaign is not just fundraising — it is a marketing exercise that validates your idea and builds a customer base.','Apply for SBIR/STTR grants early in your R&D process — they are highly competitive but provide non-dilutive funding without giving up equity.','Minority Business Development Agency (MBDA) centers provide free technical assistance for minority-owned businesses applying for grants and contracts — find yours at mbda.gov.','Many foundations (Knight Foundation, MacArthur Foundation, local community foundations) fund small business development in specific industries or communities — research foundations aligned with your work.'],
    faq:[{q:'What\'s the difference between a grant and a loan?',a:'Grants are free money that don\'t need to be repaid — but they often have restrictions on how funds are used and require detailed reporting. Loans must be repaid with interest but have fewer restrictions.'},{q:'Is equity crowdfunding right for my business?',a:'It works best for consumer-facing businesses with a story that resonates with many small investors. It requires significant marketing effort and legal compliance. Not suited for service businesses with low growth potential.'}],
    related:[6,36,56], tags:['crowdfunding','grant','CDFI','microloan','small business','funding'] },

  // ── More Disability ───────────────────────────────────────────────────────
  { id:86, t:'Guardianship Alternatives: Supported Decision-Making and Conservatorship', c:'Disability', icon:'🌿', time:'8 min', v:1900, rating:4.7, reviews:167, diff:'Hard', updated:'Jan 2026',
    summary:'When full guardianship isn\'t necessary — less restrictive options that preserve autonomy for people with disabilities or cognitive impairments.',
    steps:['Understand the spectrum: Full Guardianship (court removes almost all legal rights from the person and grants them to a guardian) → Plenary Guardianship of the Estate or Person → Limited Guardianship → Conservatorship → Representative Payee → Supported Decision-Making.','Supported Decision-Making Agreements (SDM): Illinois recognized SDM in 2019. A person with a disability chooses trusted supporters who help them understand information and communicate decisions — without any court process. Free to create.','Representative Payee: if someone receives SSI or SSDI but cannot manage finances, you can be designated as their representative payee by SSA to manage benefits on their behalf. No court required.','Limited Guardianship: rather than removing all rights, courts can grant guardianship only for specific decisions (medical, financial, housing) while preserving the person\'s right to vote, marry, or make other choices.','Conservatorship: court-appointed management of finances only (not personal decisions). Less restrictive than full guardianship of the person.','Illinois Guardianship: if full guardianship is truly necessary, petition the circuit court in the person\'s county of residence. An attorney guardian ad litem is appointed to investigate.'],
    tips:['Disability rights advocates strongly encourage exploring Supported Decision-Making before pursuing any form of guardianship — SDM preserves more dignity and autonomy.','Illinois ARC (thearcofil.org) provides resources on SDM agreements and can connect families with advocates.','Guardianship is NOT a one-time decision — courts expect annual reporting and can modify or terminate guardianship if circumstances change.','A Special Needs Trust (SNT) can hold assets for a person with disabilities without disqualifying them from Medicaid or SSI — consult a special needs attorney.'],
    faq:[{q:'Does my adult child with an intellectual disability automatically need a guardian at 18?',a:'No. Reaching adulthood automatically grants legal decision-making authority. Guardianship must be established through a court process and only if the person truly lacks capacity. Explore SDM first.'},{q:'What if the person with a disability objects to guardianship?',a:'The person has the right to contest guardianship in court and to have an attorney represent them. Courts must take seriously a respondent\'s objection.'}],
    related:[32,33,34], tags:['guardianship','supported decision-making','conservatorship','disability','autonomy'] },

  // ── More Immigration ──────────────────────────────────────────────────────
  { id:87, t:'U Visa and T Visa: Protection for Crime and Trafficking Victims', c:'Immigration', icon:'🛡️', time:'9 min', v:2200, rating:4.8, reviews:198, diff:'Hard', updated:'Feb 2026',
    summary:'Two special visas for undocumented immigrants who are victims of qualifying crimes or human trafficking — providing legal status and a path to a green card.',
    steps:['U Visa (crime victims): for victims of qualifying crimes (domestic violence, sexual assault, trafficking, murder, robbery, felonious assault, and more) who have suffered physical or psychological abuse and are helpful to law enforcement.','T Visa (trafficking victims): for victims of severe sex or labor trafficking who are present in the U.S. due to trafficking, have complied with reasonable law enforcement requests, and would suffer extreme hardship if removed.','Get a law enforcement certification: for U visa, a law enforcement agency (police, prosecutor, judge, labor/social services) must sign a certification (Form I-918B) confirming you are helpful to the investigation.','File Form I-918 (U visa) or I-914 (T visa) with USCIS — the annual U visa cap is 10,000. There is a waiting list — USCIS grants deferred action to those waiting.','If approved: U visa provides 4 years of status and work authorization. After 3 years, you can apply for a green card. T visa provides up to 4 years of status and a path to a green card after 3 years.','Legal help is critical: find a nonprofit immigration legal services organization through immigrationadvocates.org — these cases are complex and must be handled carefully.'],
    tips:['You do not need to have reported the crime before learning about the U visa — you can report now and cooperate going forward.','USCIS grants U visa applicants "bona fide determination" status while waiting on the cap, providing work authorization and deferred action on removal.','T visa applicants may be eligible for special benefits including Refugee Medical Assistance and Refugee Cash Assistance during the application period.','Derivatives: your spouse, children (under 21), parents (if you are under 21), and siblings can sometimes be included in your U or T visa petition.'],
    faq:[{q:'What if the police won\'t certify my U visa?',a:'Other agencies can certify — prosecutors, labor departments, social service agencies, and some judges have certifying authority. Legal advocates can help identify the right certifying agency.'},{q:'Can I apply if I\'m already in removal proceedings?',a:'Yes. Filing a U or T visa petition can result in administrative closure or termination of removal proceedings — but you need an attorney to navigate this.'}],
    related:[9,52,53], tags:['U visa','T visa','crime victim','trafficking','immigration','undocumented'] },

  // ── More Mental Health ────────────────────────────────────────────────────
  { id:88, t:'Mental Health and the Workplace: Accommodations, Leave, and Rights', c:'Mental Health', icon:'🧩', time:'8 min', v:2700, rating:4.8, reviews:256, diff:'Medium', updated:'Feb 2026',
    summary:'How to get workplace accommodations for mental health conditions, use FMLA for mental health crises, and protect yourself from discrimination.',
    steps:['Mental health conditions as disabilities: anxiety disorders, depression, bipolar disorder, PTSD, OCD, and many others qualify as disabilities under the ADA if they substantially limit a major life activity (including thinking, concentrating, working, sleeping).','Request a reasonable accommodation: notify HR or your manager in writing that you have a medical condition requiring accommodation. You do not need to name the diagnosis — just that you have a condition and need help.','Common mental health accommodations: flexible scheduling, permission to work from home, quiet workspace, modified break schedule, leave for therapy appointments, reduced workload during acute episodes.','FMLA for mental health: serious mental health conditions qualify for FMLA leave. Your therapist or psychiatrist can complete FMLA paperwork certifying your condition.','ADA interactive process: after requesting accommodation, your employer must engage in good-faith discussion about what would work. Document all communications.','If accommodations are denied or you face retaliation: file with the EEOC within 180 days (300 days in Illinois). You can also file with the Illinois Department of Human Rights.'],
    tips:['You have the right to keep your diagnosis private — you only need to provide enough information for your employer to understand you have a condition requiring accommodation.','Employee Assistance Programs (EAPs) provide confidential counseling and can help you navigate workplace issues — use them without fear of employer knowledge.','Psychiatric disabilities are among the most common bases for ADA accommodation requests and are well-established legal territory.','If you take FMLA for a mental health hospitalization, your employer cannot discipline you for the absence — but you may need to provide proper notice.'],
    faq:[{q:'Can my employer ask about my mental health diagnosis?',a:'Not directly. They can ask for documentation that you have a medical condition requiring accommodation. A healthcare provider\'s letter confirming functional limitations is sufficient — they cannot demand your full records.'},{q:'What if my performance is suffering due to my mental health?',a:'Address this proactively by requesting accommodations before you receive a performance warning. Once disciplinary action begins, it is harder (though still possible) to use ADA as a defense.'}],
    related:[34,44,47], tags:['mental health workplace','ADA','accommodation','FMLA','disability','employment'] },

  // ── More Reentry ──────────────────────────────────────────────────────────
  { id:89, t:'Restoring Gun Rights and Other Collateral Consequences of Conviction', c:'Reentry', icon:'📋', time:'8 min', v:2100, rating:4.6, reviews:187, diff:'Hard', updated:'Jan 2026',
    summary:'Beyond the sentence — the hidden legal consequences of a criminal conviction affecting voting, housing, employment, professional licensing, and more.',
    steps:['Understand collateral consequences: these are legal penalties and restrictions beyond the criminal sentence itself. They affect employment licenses, public housing, voting rights, benefits eligibility, immigration status, and more.','Illinois Collateral Consequences: use the Collateral Consequences Calculator at ilconsequences.com to see all consequences of any Illinois conviction — by offense type and category.','Voting rights in Illinois: automatically restored upon release from incarceration — no petition or waiting period required. You can register immediately upon release.','Employment licenses: many professional boards can deny licenses for convictions, but Illinois law (License Restoration Act) requires they consider rehabilitation and the nature of the offense. Appeal license denials.','Public housing: PHA policies on conviction-based denials vary. The Obama-era "One Strike" policy was modified — automatic lifetime bans on most offenses are prohibited. Request individual consideration.','Restoring firearm rights in Illinois: if your Firearm Owner\'s Identification (FOID) card was revoked due to a disqualifying conviction, you must petition the circuit court after the disqualifying period has passed (varies by offense).'],
    tips:['The National Inventory of Collateral Consequences of Conviction (NICCC) at niccc.csgjusticecenter.org lists every collateral consequence by state and conviction type.','Many states are reforming automatic license revocation laws — check current Illinois law, as reforms occur regularly.','Federal law bans from public housing, SNAP, and Pell Grants for drug convictions have been significantly limited — apply even if you were previously denied.','Reentry courts in Illinois provide a supportive legal environment with connections to services — check if your county has one.'],
    faq:[{q:'Can I get Pell Grant with a drug conviction?',a:'Yes, as of 2021. The law eliminating Pell Grant eligibility for drug convictions was repealed — all students now qualify regardless of conviction history.'},{q:'Can I be denied an apartment because of my conviction?',a:'Private landlords can still consider convictions, but HUD guidance prohibits blanket bans and requires considering the nature, age, and severity of the offense. Arrest records alone cannot be used to deny housing.'}],
    related:[69,24,25], tags:['collateral consequences','reentry','voting rights','FOID','professional license','conviction'] },

  { id:90, t:'Navigating Government Agencies: Tips for Getting Results', c:'Benefits', icon:'🧭', time:'7 min', v:3400, rating:4.8, reviews:312, diff:'Easy', updated:'Feb 2026',
    summary:'How to communicate effectively with government agencies, escalate when you\'re stuck, and get the help you need when the system seems designed to make you give up.',
    steps:['Document everything: keep a log of every call and visit — date, time, name of person you spoke with, and what was said. Follow up verbal promises in writing with a confirmation email or letter.','Know your rights to appeal: virtually every government benefit denial is appealable. The denial letter must state your appeal rights and deadlines. Appeals are powerful — approval rates at hearing level are often 30-50%.','Escalate systematically: if front-line staff can\'t help, ask for a supervisor. If the supervisor can\'t help, ask for the agency\'s ombudsman or constituent services office. For state agencies, contact your state representative.','Use the Congressional office for federal agencies: your U.S. Senators and Representatives have caseworkers specifically for helping constituents navigate federal agencies (USCIS, SSA, VA, IRS, Medicare). This service is free and often dramatically speeds up stuck cases.','Contact your state legislator\'s office for state agencies: the same service exists for state benefits agencies (SNAP, Medicaid, IDES). Call or email your state representative or senator.','Legal aid and advocacy organizations: Illinois Legal Aid Online (illinoislegalaid.org), Prairie State Legal Services, and many issue-specific advocates can intervene when you\'re stuck.'],
    tips:['Always get the case number, confirmation number, or document receipt for any application or request — this is your proof that you applied.','If an agency employee gives you incorrect information that causes you harm, document it and request a "good faith" exception when you appeal.','Request everything in writing — agencies are more careful when creating a written record.','FOIA requests: under the Freedom of Information Act, you can request your case file from any federal agency. This often reveals errors or missing documents that caused problems.'],
    faq:[{q:'What if I just get endless runarounds and can\'t get anyone to help?',a:'Contact your U.S. Senator\'s or Representative\'s constituent services office. This is one of the most underused and effective tools for cutting through bureaucracy — and the service is completely free.'},{q:'Can a benefits advocate or caseworker help me for free?',a:'Yes. Legal aid organizations, community health workers, patient navigators, and benefits counselors are often available at no cost. Ask at your local library, community health center, or United Way office.'}],
    related:[1,2,3], tags:['government agencies','appeals','advocacy','caseworker','bureaucracy','tips'] },

]

// ── KB Config ─────────────────────────────────────────────────────────────────
const KB_CATS = ['All','Benefits','Business','Healthcare','Taxes','Housing','Education','Immigration','Veterans','Childcare','Disability','Justice','Seniors','Consumer','Employment','Mental Health','Legal','Reentry']
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
  Consumer:  {icon:'💳', color:'#10b981'},
  Employment:{icon:'💼', color:'#6366f1'},
  'Mental Health':{icon:'🧠', color:'#8b5cf6'},
  Legal:     {icon:'📜', color:'#0ea5e9'},
  Reentry:   {icon:'🔓', color:'#f43f5e'},
}
const LEARNING_PATHS = [
  { id:'job-loss', title:'Navigating a Job Loss', icon:'💼', desc:'From layoff to stable footing', articles:[3,1,2,23,21,44], color:C.primary },
  { id:'start-biz', title:'Starting a Business', icon:'🚀', desc:'From idea to LLC to first paycheck', articles:[6,7,8,35,36,57], color:C.success },
  { id:'new-baby', title:'New Baby Essentials', icon:'👶', desc:'Benefits and support for new parents', articles:[29,19,31,54,5,2], color:'#ec4899' },
  { id:'disability', title:'Applying for Disability', icon:'♿', desc:'SSDI, SSI, ADA, and workplace rights', articles:[32,33,34,4,64], color:'#a78bfa' },
  { id:'senior-plan', title:'Senior Life Planning', icon:'👴', desc:'Medicare, Social Security, and long-term care', articles:[26,27,28,55,61,12], color:'#fb923c' },
  { id:'immigration', title:'Path to Citizenship', icon:'🇺🇸', desc:'From arrival to naturalization', articles:[10,9,52,11], color:'#6366f1' },
  { id:'credit-repair', title:'Fix Your Credit & Finances', icon:'💳', desc:'Credit score, debt, and consumer rights', articles:[43,41,42,21,23], color:'#10b981' },
  { id:'renter-rights', title:'Renter Survival Guide', icon:'🔑', desc:'Deposits, repairs, eviction, and housing aid', articles:[50,14,15,40,39,80], color:'#f97316' },
  { id:'estate-plan', title:'Estate Planning Basics', icon:'📜', desc:'Wills, POAs, and advance directives', articles:[66,67,68], color:'#0ea5e9' },
  { id:'reentry', title:'Life After Incarceration', icon:'🔓', desc:'Benefits, IDs, housing, and expungement', articles:[69,24,89,90], color:'#f43f5e' },
  { id:'mental-health', title:'Mental Health Support', icon:'🧠', desc:'Finding care, workplace rights, and crisis resources', articles:[47,48,49,88,74], color:'#8b5cf6' },
]

const GLOSSARY = [
  {term:'ADA',def:'Americans with Disabilities Act — prohibits discrimination against people with disabilities in employment, public accommodations, and more.'},
  {term:'ADL (Activities of Daily Living)',def:'Basic self-care tasks (bathing, dressing, eating, toileting) used to assess need for long-term care services.'},
  {term:'ALJ',def:'Administrative Law Judge — an independent hearing officer who decides Social Security disability appeals.'},
  {term:'AnnualCreditReport.com',def:'The only federally authorized source for free credit reports from all three major bureaus (Equifax, Experian, TransUnion).'},
  {term:'Area Agency on Aging (AAA)',def:'Local nonprofit organizations funded under the Older Americans Act to coordinate services for seniors — transportation, meals, caregiver support.'},
  {term:'Automatic Stay',def:'An immediate halt to all collection actions (foreclosure, garnishment, repossession) that goes into effect the moment you file for bankruptcy.'},
  {term:'BAH',def:'Basic Allowance for Housing — military pay used by VA to calculate the GI Bill housing stipend for student veterans.'},
  {term:'C&P Exam',def:'Compensation & Pension Exam — a VA medical examination used to evaluate service-connected disabilities for rating purposes.'},
  {term:'CCAP',def:'Child Care Assistance Program — Illinois state program subsidizing childcare costs for working low-income families.'},
  {term:'CDFI',def:'Community Development Financial Institution — a nonprofit lender that provides affordable loans to underserved communities and small businesses.'},
  {term:'COE',def:'Certificate of Eligibility — a VA document confirming you are eligible to use your GI Bill benefits.'},
  {term:'COBRA',def:'Continuation of health insurance coverage after leaving an employer — you pay the full premium. Available for 18-36 months.'},
  {term:'Collateral Consequences',def:'Legal penalties and restrictions that apply after a criminal conviction beyond the prison sentence — affecting jobs, housing, benefits, and voting.'},
  {term:'Concurrent Benefit',def:'Receiving both SSDI and SSI simultaneously, which happens when your SSDI payment is low enough that SSI fills the gap.'},
  {term:'CSR (Cost-Sharing Reduction)',def:'Subsidies that lower your deductible, copay, and out-of-pocket maximum on ACA Silver health plans for lower-income enrollees.'},
  {term:'DACA',def:'Deferred Action for Childhood Arrivals — an executive program providing protection from deportation and work permits to certain immigrants brought to the U.S. as children.'},
  {term:'Deed-in-Lieu',def:'Voluntarily transferring your home title to your mortgage lender to avoid foreclosure — less damaging to credit than a full foreclosure.'},
  {term:'Deferred Action',def:'A discretionary decision by USCIS not to pursue removal proceedings against an individual — does not grant legal status but provides some protection.'},
  {term:'Disability (ADA)',def:'A physical or mental impairment that substantially limits one or more major life activities, including working, thinking, concentrating, communicating.'},
  {term:'Discretionary Income',def:'For student loan IDR plans: the difference between your annual income and 150-225% of the federal poverty guideline for your family size.'},
  {term:'Durable POA',def:'A Power of Attorney that remains in effect if you become mentally incapacitated — essential for estate planning.'},
  {term:'EAD',def:'Employment Authorization Document — a card issued by USCIS allowing non-citizens to legally work in the United States.'},
  {term:'EBT Card',def:'Electronic Benefits Transfer — a debit card used to access SNAP (food stamp) and TANF benefits at grocery stores.'},
  {term:'EITC',def:'Earned Income Tax Credit — a refundable federal tax credit for low-to-moderate income working individuals and families, worth up to $7,830.'},
  {term:'EIN',def:'Employer Identification Number — a federal tax ID number for businesses, issued free by the IRS at irs.gov/ein.'},
  {term:'ERA',def:'Emergency Rental Assistance — federal programs providing rent and utility relief to tenants at risk of eviction.'},
  {term:'FAFSA',def:'Free Application for Federal Student Aid — the form used to determine eligibility for federal grants, loans, and work-study.'},
  {term:'FCRA',def:'Fair Credit Reporting Act — federal law governing credit bureau practices and giving consumers the right to dispute errors.'},
  {term:'FDCPA',def:'Fair Debt Collection Practices Act — prohibits abusive, deceptive, and unfair debt collection practices.'},
  {term:'FICA',def:'Federal Insurance Contributions Act taxes — the payroll taxes that fund Social Security and Medicare.'},
  {term:'FICO Score',def:'The most widely used credit score model, ranging from 300 to 850. Based on payment history, utilization, history length, credit mix, and new credit.'},
  {term:'FMLA',def:'Family and Medical Leave Act — guarantees eligible employees up to 12 weeks of unpaid, job-protected leave per year for qualifying medical or family reasons.'},
  {term:'Forbearance',def:'A temporary pause or reduction in mortgage or student loan payments agreed upon by your lender — interest typically continues to accrue.'},
  {term:'FPL (Federal Poverty Level)',def:'Annual income benchmarks set by HHS used to determine eligibility for many federal and state benefit programs.'},
  {term:'FUTA',def:'Federal Unemployment Tax Act — the employer-paid federal payroll tax that funds the federal unemployment insurance program.'},
  {term:'GI Bill',def:'Post-9/11 GI Bill (Chapter 33) — provides veterans with education benefits including tuition, housing allowance, and a book stipend.'},
  {term:'Green Card',def:'Lawful Permanent Resident status — allows a foreign national to live and work permanently in the United States.'},
  {term:'HECM',def:'Home Equity Conversion Mortgage — the federally insured reverse mortgage product for homeowners 62+.'},
  {term:'HUD',def:'U.S. Department of Housing and Urban Development — administers federal housing programs including Section 8, public housing, and Fair Housing enforcement.'},
  {term:'IDR (Income-Driven Repayment)',def:'Federal student loan repayment plans (SAVE, PAYE, IBR, ICR) that cap monthly payments at a percentage of your discretionary income.'},
  {term:'IEP',def:'Individualized Education Program — a legally binding document specifying special education services for an eligible student with a disability.'},
  {term:'IHDA',def:'Illinois Housing Development Authority — the state agency that administers affordable housing programs and homebuyer assistance.'},
  {term:'ILRPP',def:'Illinois Rental Payment Program — emergency rental assistance for Illinois tenants at risk of eviction.'},
  {term:'IMR (Independent Medical Review)',def:'A free external review of a health insurance denial by an independent medical expert — a federal right for ACA plans.'},
  {term:'IWCC',def:'Illinois Workers\' Compensation Commission — the state agency that resolves workers\' comp disputes between employees and employers.'},
  {term:'Legal Status',def:'Authorization to be present in the United States — includes visas, green cards, asylum, DACA, and other categories. Unauthorized presence has serious legal consequences.'},
  {term:'LIHTC',def:'Low-Income Housing Tax Credit — a federal program that funds affordable apartment construction. Resulting units rent at below-market rates to income-qualifying tenants.'},
  {term:'LIS (Low Income Subsidy)',def:'Also called Extra Help — a Medicare program reducing Part D prescription drug costs for low-income beneficiaries.'},
  {term:'MAT',def:'Medication-Assisted Treatment — FDA-approved medications (buprenorphine, methadone, naltrexone) combined with counseling to treat opioid and alcohol use disorders.'},
  {term:'Means Test',def:'A financial eligibility test. For Chapter 7 bankruptcy: comparing your income to your state\'s median. For benefits: determining whether your income/assets are below program limits.'},
  {term:'MHPAEA',def:'Mental Health Parity and Addiction Equity Act — federal law requiring insurers to cover mental health and substance use disorders no more restrictively than medical care.'},
  {term:'NQTL',def:'Non-Quantitative Treatment Limitation — restrictions on mental health coverage like prior authorization, step therapy, or network composition that are harder to detect than visit limits.'},
  {term:'NTA',def:'Notice to Appear — the charging document that initiates removal (deportation) proceedings in immigration court.'},
  {term:'OIC (Offer in Compromise)',def:'An IRS program allowing certain taxpayers to settle their tax debt for less than the full amount owed.'},
  {term:'OSHA',def:'Occupational Safety and Health Administration — federal agency that enforces workplace safety standards and investigates work-related injuries and hazards.'},
  {term:'Paratransit',def:'Demand-responsive transportation service for individuals with disabilities who cannot use fixed-route public transit.'},
  {term:'PELL Grant',def:'A federal grant of up to $7,395/year for undergraduate students with financial need — does not need to be repaid.'},
  {term:'PHA',def:'Public Housing Authority — local government agency administering Section 8 vouchers and public housing communities.'},
  {term:'PMI',def:'Private Mortgage Insurance — required for conventional mortgages with less than 20% down payment, adds 0.5-1.5% of loan amount annually.'},
  {term:'POLST',def:'Physician Orders for Life-Sustaining Treatment — a medical order documenting a seriously ill patient\'s wishes about end-of-life care that travels across care settings.'},
  {term:'Priority Date',def:'In immigration, the date your visa petition was filed — determines your place in the visa backlog queue.'},
  {term:'Probate',def:'The court-supervised process of validating a will and distributing a deceased person\'s assets — can be avoided through trusts and beneficiary designations.'},
  {term:'PSLF',def:'Public Service Loan Forgiveness — forgives remaining federal student loan balances after 120 qualifying payments while working for a government or nonprofit employer.'},
  {term:'RAP Sheet',def:'Record of Arrests and Prosecutions — your official criminal history maintained by the state Bureau of Identification.'},
  {term:'Representative Payee',def:'A person or organization approved by SSA to receive and manage Social Security or SSI benefits on behalf of someone who cannot manage their own funds.'},
  {term:'SAVE Plan',def:'Saving on a Valuable Education — the newest federal IDR repayment plan, offering the lowest monthly payments (as low as $0) for eligible borrowers.'},
  {term:'SDM',def:'Supported Decision-Making — an alternative to guardianship where a person with a disability chooses trusted supporters to help them understand and communicate decisions.'},
  {term:'SGA',def:'Substantial Gainful Activity — the monthly earnings limit ($1,550 in 2024) above which you are generally not considered disabled for SSDI purposes.'},
  {term:'SNAP',def:'Supplemental Nutrition Assistance Program — formerly food stamps. Provides monthly EBT benefits for groceries to income-eligible households.'},
  {term:'Special Enrollment Period (SEP)',def:'A time outside Open Enrollment when you can sign up for ACA health insurance due to a qualifying life event (job loss, marriage, birth, move).'},
  {term:'SSI',def:'Supplemental Security Income — a needs-based federal payment for disabled adults, disabled children, and people 65+ with limited income and resources.'},
  {term:'SSDI',def:'Social Security Disability Insurance — monthly benefits for workers with disabilities who have sufficient work credits paid into Social Security.'},
  {term:'TANF',def:'Temporary Assistance for Needy Families — provides time-limited cash assistance to low-income families with children, subject to work requirements.'},
  {term:'TDIU',def:'Total Disability Individual Unemployability — VA compensation at the 100% rate for veterans whose service-connected disabilities prevent gainful employment.'},
  {term:'USDA',def:'U.S. Department of Agriculture — administers SNAP, WIC, and the Rural Development loan program for homes in eligible rural and suburban areas.'},
  {term:'VITA',def:'Volunteer Income Tax Assistance — IRS-sponsored free tax preparation sites for people earning under ~$67,000, operated by trained volunteers.'},
  {term:'VAWA',def:'Violence Against Women Act — provides immigration protections and HUD program protections for survivors of domestic violence.'},
  {term:'VSO',def:'Veterans Service Organization — nonprofit organizations (DAV, VFW, American Legion, etc.) providing free VA claims assistance to veterans.'},
  {term:'WAP',def:'Weatherization Assistance Program — provides free home energy efficiency improvements to income-eligible households.'},
  {term:'WIC',def:'Women, Infants, and Children — a federal nutrition program providing healthy food, nutrition education, and healthcare referrals for pregnant women, new mothers, and young children.'},
]

const FEATURED_ARTICLES = [47, 90, 43, 25, 3, 78, 50, 32, 21, 41]

const COLLECTIONS = [
  { id:'crisis', title:'In a Crisis Right Now', icon:'🆘', color:'#ef4444', articles:[48, 80, 3, 1, 39, 75] },
  { id:'finances', title:'Get Your Finances on Track', icon:'💰', color:'#10b981', articles:[43, 41, 22, 23, 78, 73] },
  { id:'health', title:'Get Covered: Healthcare Guide', icon:'💊', color:'#ec4899', articles:[18, 2, 19, 20, 74, 49] },
  { id:'new-job', title:'Starting Over Professionally', icon:'💼', color:'#6366f1', articles:[3, 44, 45, 46, 70, 71] },
  { id:'seniors-essentials', title:'Essential Senior Resources', icon:'👴', color:'#fb923c', articles:[26, 27, 28, 55, 81, 82] },
  { id:'family', title:'Supporting Your Family', icon:'👨‍👩‍👧', color:'#14b8a6', articles:[54, 29, 31, 19, 5, 65] },
]

function FaqSection({ faq, catColor }) {
  const [open, setOpen] = useState(null)
  return (
    <div className="card" style={{ marginBottom:20 }}>
      <h2 style={{ color:C.heading, fontSize:18, fontWeight:700, marginBottom:4 }}>Frequently Asked Questions</h2>
      <p style={{ color:C.muted, fontSize:12, marginBottom:18 }}>{faq.length} questions answered</p>
      {faq.map((item, i) => (
        <div key={i} style={{ borderRadius:8, marginBottom:6, background:open===i?`${catColor}08`:C.surface, border:`1px solid ${open===i?catColor+'44':C.border}`, transition:'all .2s', overflow:'hidden' }}>
          <div onClick={()=>setOpen(open===i?null:i)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 16px', cursor:'pointer', gap:16 }}>
            <div style={{ fontWeight:600, color:C.heading, fontSize:14, lineHeight:1.4 }}>{item.q}</div>
            <div style={{ width:22, height:22, borderRadius:'50%', background:open===i?catColor:`${catColor}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
              <span style={{ color:open===i?'#fff':catColor, fontSize:14, lineHeight:1 }}>{open===i?'−':'+'}</span>
            </div>
          </div>
          {open===i && (
            <div style={{ padding:'0 16px 16px', animation:'fadeUp .2s ease' }}>
              <div style={{ height:1, background:`${catColor}22`, marginBottom:12 }} />
              <p style={{ color:C.text, fontSize:14, lineHeight:1.75 }}>{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function highlight(text, query) {
  if (!query) return text
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return text
  return <>{text.slice(0,i)}<mark className="highlight">{text.slice(i,i+query.length)}</mark>{text.slice(i+query.length)}</>
}

function ArticleList({ articles, view, onOpen, bookmarks, setBookmarks, searchQuery='' }) {
  const [hoverId, setHoverId] = useState(null)
  const [hoverPos, setHoverPos] = useState({x:0,y:0})
  const hoverArticle = hoverId ? articles.find(a=>a.id===hoverId) : null

  const PreviewPopup = () => {
    if (!hoverArticle) return null
    const catColor = CAT_META[hoverArticle.c]?.color || C.primary
    return (
      <div className="preview-popup" style={{ position:'fixed', left:Math.min(hoverPos.x+16,window.innerWidth-300), top:Math.min(hoverPos.y-80,window.innerHeight-220), zIndex:9000 }}>
        <div style={{ display:'flex', gap:8, marginBottom:8, alignItems:'center' }}>
          <span style={{ fontSize:22 }}>{hoverArticle.icon}</span>
          <span style={{ padding:'2px 8px', borderRadius:12, background:`${catColor}22`, color:catColor, fontSize:11, fontWeight:700 }}>{hoverArticle.c}</span>
          <span style={{ fontSize:11, color:C.muted, marginLeft:'auto' }}>⏱ {hoverArticle.time}</span>
        </div>
        <div style={{ fontWeight:700, color:C.heading, fontSize:13, lineHeight:1.35, marginBottom:6 }}>{hoverArticle.t}</div>
        <div style={{ fontSize:12, color:C.muted, lineHeight:1.55, marginBottom:8 }}>{hoverArticle.summary.slice(0,110)}…</div>
        <div style={{ display:'flex', gap:10, fontSize:11, color:C.muted }}>
          <span style={{ color:C.warn }}>★ {hoverArticle.rating}</span>
          <span>·</span><span>{hoverArticle.v.toLocaleString()} views</span>
          <span style={{ marginLeft:'auto', padding:'2px 8px', borderRadius:4, background:`${DIFF_COLOR[hoverArticle.diff]}22`, color:DIFF_COLOR[hoverArticle.diff], fontWeight:700 }}>{hoverArticle.diff}</span>
        </div>
        <div style={{ marginTop:8, paddingTop:8, borderTop:`1px solid ${C.border}`, fontSize:11, color:C.primary, fontWeight:600 }}>Click to open guide →</div>
      </div>
    )
  }

  if (view==='grid') return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
      {articles.map((a,idx)=>{
        const color = CAT_META[a.c]?.color || C.primary
        return (
          <div key={a.id} onClick={()=>onOpen(a)} className="card card-hover fade-up" style={{ cursor:'pointer', display:'flex', flexDirection:'column', gap:10, borderTop:`3px solid ${color}`, animationDelay:`${idx*30}ms` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="badge badge-blue">{a.c}</span>
              <button onClick={e=>{e.stopPropagation();setBookmarks(b=>{const n=new Set(b);const adding=!n.has(a.id);adding?n.add(a.id):n.delete(a.id);showToast(adding?`Saved: ${a.t.slice(0,30)}…`:'Bookmark removed','success');return n})}} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:bookmarks.has(a.id)?C.warn:C.muted, transition:'all .2s', transform:bookmarks.has(a.id)?'scale(1.2)':'scale(1)' }}>🔖</button>
            </div>
            <div style={{ fontSize:32 }}>{a.icon}</div>
            <div style={{ fontWeight:700, color:C.heading, fontSize:14, lineHeight:1.4 }}>{highlight(a.t, searchQuery)}</div>
            <div style={{ fontSize:12, color:C.muted, lineHeight:1.5, flex:1 }}>{a.summary.slice(0,90)}…</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              <span style={{ fontSize:11, padding:'2px 7px', borderRadius:4, background:`${DIFF_COLOR[a.diff]}22`, color:DIFF_COLOR[a.diff], fontWeight:700 }}>{a.diff}</span>
              <span style={{ fontSize:11, color:C.muted }}>⏱ {a.time}</span>
              <span style={{ fontSize:11, color:C.muted, marginLeft:'auto' }}>{a.updated}</span>
            </div>
            <div style={{ display:'flex', gap:8, fontSize:12, color:C.muted, marginTop:'auto', paddingTop:8, borderTop:`1px solid ${C.border}` }}>
              <span style={{ color:C.warn }}>★ {a.rating}</span>
              <span>·</span><span>{a.v.toLocaleString()} views</span>
              <span>·</span><span>{a.reviews} reviews</span>
            </div>
          </div>
        )
      })}
    </div>
  )
  return (
    <>
    <div style={{ display:'grid', gap:8 }}>
      {articles.map((a,idx)=>{
        const color = CAT_META[a.c]?.color || C.primary
        return (
          <div key={a.id} onClick={()=>onOpen(a)} className="card card-hover fade-up"
            onMouseEnter={e=>{setHoverId(a.id);setHoverPos({x:e.clientX,y:e.clientY})}}
            onMouseLeave={()=>setHoverId(null)}
            style={{ display:'flex', alignItems:'center', gap:16, cursor:'pointer', borderLeft:`3px solid ${color}`, padding:'16px 20px', animationDelay:`${idx*20}ms`, position:'relative' }}>
            <div style={{ fontSize:28, flexShrink:0 }}>{a.icon}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', gap:8, marginBottom:6, flexWrap:'wrap', alignItems:'center' }}>
                <span className="badge badge-blue">{a.c}</span>
                <span style={{ fontSize:11, padding:'2px 7px', borderRadius:4, background:`${DIFF_COLOR[a.diff]}22`, color:DIFF_COLOR[a.diff], fontWeight:700 }}>{a.diff}</span>
                <span style={{ fontSize:11, color:C.muted }}>⏱ {a.time}</span>
                <span style={{ fontSize:11, color:C.success, marginLeft:'auto' }}>Updated {a.updated}</span>
              </div>
              <div style={{ fontWeight:700, color:C.heading, fontSize:14, marginBottom:4 }}>{highlight(a.t, searchQuery)}</div>
              <div style={{ fontSize:13, color:C.muted, lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%' }}>{a.summary}</div>
              <div style={{ display:'flex', gap:10, fontSize:12, color:C.muted, marginTop:8 }}>
                <span style={{ color:C.warn }}>★ {a.rating}</span>
                <span>({a.reviews})</span><span>·</span><span>{a.v.toLocaleString()} views</span>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
              <button onClick={e=>{e.stopPropagation();setBookmarks(b=>{const n=new Set(b);const adding=!n.has(a.id);adding?n.add(a.id):n.delete(a.id);showToast(adding?'Guide saved!':'Removed from saved','success');return n})}} style={{ background:'none', border:'none', cursor:'pointer', fontSize:16, color:bookmarks.has(a.id)?C.warn:C.border, transition:'all .2s' }}>🔖</button>
              <span style={{ color:C.muted, fontSize:18 }}>›</span>
            </div>
          </div>
        )
      })}
    </div>
    {hoverArticle && <PreviewPopup />}
    </>
  )
}


function ReadingProgressBar() {
  const [pct, setPct] = useState(0)
  useState(()=>{
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? Math.round((scrolled/total)*100) : 0)
    }
    window.addEventListener('scroll', onScroll, {passive:true})
  }, [])
  return (
    <div className="reading-progress">
      <div style={{ height:'100%', background:`linear-gradient(90deg, #3b82f6, #06b6d4)`, width:`${pct}%`, transition:'width .1s linear', boxShadow:'0 0 8px #3b82f688' }} />
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const copy = (e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(text).catch(()=>{})
    setCopied(true)
    setTimeout(()=>setCopied(false), 1800)
  }
  return (
    <button className="copy-btn" onClick={copy} title="Copy to clipboard">
      {copied ? '✓ copied' : '⎘ copy'}
    </button>
  )
}

function enrichText(text) {
  const phoneRe = /(\d{1}-\d{3}-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4}|\d{3}-\d{3}-\d{4})/g
  const urlRe = /(https?:\/\/[^\s,;]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s,;]*)?)/g
  const parts = []
  let lastIdx = 0
  const matches = []
  let m
  const combined = new RegExp(phoneRe.source + '|' + urlRe.source, 'g')
  while ((m = combined.exec(text)) !== null) {
    matches.push({start:m.index, end:m.index+m[0].length, val:m[0]})
  }
  matches.forEach(({start,end,val},i) => {
    if (start > lastIdx) parts.push(text.slice(lastIdx,start))
    const isPhone = /\d{3}[-. ]\d{3}/.test(val)
    parts.push(
      <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${C.primary}11`, borderRadius:4, padding:'0 4px' }}>
        <span style={{ color:C.accent, fontWeight:600 }}>{val}</span>
        <CopyButton text={val} />
      </span>
    )
    lastIdx = end
  })
  if (lastIdx < text.length) parts.push(text.slice(lastIdx))
  return parts.length > 1 ? parts : text
}

function ArticleView({ article, onBack, onViewArticle }) {
  const [helpful, setHelpful] = useState(null)
  const [bookmarked, setBookmarked] = useState(false)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [showIL, setShowIL] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [activeSection, setActiveSection] = useState('steps')
  const related = KB_ARTICLES.filter(a => article.related?.includes(a.id))
  const catColor = CAT_META[article.c]?.color || C.primary
  const progress = Math.round((completedSteps.size / article.steps.length) * 100)
  const allDone = completedSteps.size === article.steps.length

  const toggleStep = (i) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(i)) { next.delete(i) } else {
        next.add(i)
        if (next.size === article.steps.length) {
          setShowConfetti(true)
          setTimeout(()=>setShowConfetti(false), 3000)
        }
      }
      return next
    })
  }

  const scrollTo = (id) => {
    setActiveSection(id)
    document.getElementById('section-'+id)?.scrollIntoView({behavior:'smooth',block:'start'})
  }

  return (
    <div className="page fade-in" style={{ paddingTop:20 }}>
      <ReadingProgressBar />

      {showConfetti && (
        <div style={{ position:'fixed', top:0, left:0, right:0, bottom:0, pointerEvents:'none', zIndex:9998, overflow:'hidden' }}>
          {Array.from({length:20}).map((_,i)=>(
            <div key={i} style={{ position:'absolute', left:`${Math.random()*100}%`, top:'-20px', width:8, height:8, borderRadius:'50%', background:['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899'][i%6], animation:`confetti-fall ${1.5+Math.random()}s ease forwards`, animationDelay:`${Math.random()*0.8}s` }} />
          ))}
        </div>
      )}

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24, flexWrap:'wrap' }}>
        <button onClick={onBack} style={{ background:'none', border:`1px solid ${C.border}`, color:C.muted, cursor:'pointer', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6, padding:'6px 12px', borderRadius:8, transition:'all .2s' }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primary }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.muted }}>
          ← Back
        </button>
        <div style={{ display:'flex', gap:6, flex:1, flexWrap:'wrap' }}>
          <span className="badge badge-blue">{article.c}</span>
          <span style={{ fontSize:11, padding:'2px 8px', borderRadius:4, background:`${DIFF_COLOR[article.diff]}22`, color:DIFF_COLOR[article.diff], fontWeight:700 }}>{article.diff}</span>
          <span style={{ fontSize:12, color:C.muted }}>⏱ {article.time}</span>
          <span style={{ fontSize:12, color:C.muted }}>Updated {article.updated}</span>
        </div>
        <button onClick={()=>setBookmarked(v=>!v)} style={{ background:bookmarked?`${C.warn}22`:'none', border:`1px solid ${bookmarked?C.warn:C.border}`, color:bookmarked?C.warn:C.muted, cursor:'pointer', padding:'6px 12px', borderRadius:8, fontSize:13, transition:'all .2s' }}>
          {bookmarked?'🔖 Saved':'🔖 Save'}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:24, alignItems:'start' }} className="article-2col">
        <div>
          {/* Header */}
          <div className="card fade-up" style={{ marginBottom:20, borderTop:`3px solid ${catColor}`, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, right:0, fontSize:80, opacity:.06, transform:'translate(10px,-10px)', userSelect:'none' }}>{article.icon}</div>
            <div style={{ fontSize:44, marginBottom:12 }}>{article.icon}</div>
            <h1 style={{ color:C.heading, fontSize:24, fontWeight:800, marginBottom:12, lineHeight:1.3 }}>{article.t}</h1>
            <p style={{ color:C.muted, fontSize:15, lineHeight:1.75, marginBottom:16 }}>{article.summary}</p>
            <div style={{ display:'flex', gap:16, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ display:'flex', gap:2 }}>
                {Array.from({length:5}).map((_,i)=>(
                  <span key={i} style={{ fontSize:14, color:i<Math.round(article.rating)?C.warn:C.border }}>★</span>
                ))}
              </div>
              <span style={{ fontSize:13, color:C.muted }}>{article.rating} · {article.reviews.toLocaleString()} reviews · {article.v.toLocaleString()} views</span>
            </div>
          </div>

          {/* Progress banner */}
          {completedSteps.size > 0 && (
            <div className="fade-up" style={{ padding:'12px 16px', background:allDone?`${C.success}15`:`${catColor}10`, border:`1px solid ${allDone?C.success:catColor}33`, borderRadius:12, marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:allDone?C.success:catColor }}>
                    {allDone ? '🎉 All steps complete!' : `${completedSteps.size} of ${article.steps.length} steps done`}
                  </span>
                  <span style={{ fontSize:12, color:C.muted }}>{progress}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width:`${progress}%`, background:allDone?C.success:catColor }} />
                </div>
              </div>
              {!allDone && (
                <button onClick={()=>setCompletedSteps(new Set())} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:12, padding:'2px 6px', borderRadius:4 }}>Reset</button>
              )}
            </div>
          )}

          {/* TL;DR */}
          <div className="fade-up" style={{ background:`${catColor}09`, border:`1px solid ${catColor}25`, borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
            <div style={{ fontWeight:800, color:catColor, fontSize:10, marginBottom:8, letterSpacing:'.1em', textTransform:'uppercase' }}>Quick Summary</div>
            <p style={{ fontSize:14, color:C.text, lineHeight:1.7, marginBottom:10 }}>{article.summary}</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {article.steps.slice(0,3).map((s,i)=>(
                <span key={i} style={{ padding:'3px 10px', background:`${catColor}18`, borderRadius:20, fontSize:11, color:catColor, fontWeight:600 }}>
                  {i+1}. {s.slice(0,35)}{s.length>35?'…':''}
                </span>
              ))}
              {article.steps.length > 3 && <span style={{ padding:'3px 10px', background:C.surface, borderRadius:20, fontSize:11, color:C.muted }}>+{article.steps.length-3} more</span>}
            </div>
          </div>

          {/* IL toggle */}
          <div className="fade-up" style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 16px', background:C.surface, borderRadius:10, border:`1px solid ${C.border}`, marginBottom:16 }}>
            <span style={{ fontSize:18 }}>🏛️</span>
            <span style={{ fontSize:13, color:C.text, flex:1 }}>Illinois-specific information</span>
            <div className="toggle" style={{ background:showIL?catColor:C.border }} onClick={()=>setShowIL(v=>!v)}>
              <div className="tknob" style={{ left:showIL?23:3 }} />
            </div>
          </div>
          {showIL && (
            <div className="fade-up" style={{ background:`${catColor}09`, border:`1px solid ${catColor}25`, borderRadius:12, padding:16, marginBottom:16 }}>
              <div style={{ fontWeight:700, color:catColor, marginBottom:8, fontSize:13, display:'flex', alignItems:'center', gap:8 }}>
                🏛️ Illinois Details
              </div>
              <div style={{ fontSize:14, color:C.text, lineHeight:1.75 }}>
                In Illinois, this is handled through IDHS or the relevant state agency. Contact the Illinois helpline at{' '}
                <span style={{ color:C.accent, fontWeight:600 }}>1-800-843-6154</span>
                <CopyButton text="1-800-843-6154" />
                {' '}or visit <span style={{ color:C.accent, fontWeight:600 }}>dhs.illinois.gov</span>. Illinois residents can use the <span style={{ color:C.accent, fontWeight:600 }}>ABE portal</span> at abe.illinois.gov.
              </div>
            </div>
          )}

          {/* Steps */}
          <div id="section-steps" className="card fade-up" style={{ marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ color:C.heading, fontSize:17, fontWeight:700 }}>📋 Step-by-Step Guide</h2>
              <span style={{ fontSize:12, color:C.muted }}>{article.steps.length} steps · click to mark done</span>
            </div>
            {article.steps.map((step, i) => {
              const done = completedSteps.has(i)
              return (
                <div key={i} onClick={()=>toggleStep(i)} style={{ marginBottom:i < article.steps.length-1 ? 14 : 0, cursor:'pointer' }}>
                  <div style={{ display:'flex', gap:12, padding:'10px 12px', borderRadius:8, background:done?`${C.success}08`:activeSection==='steps'?'transparent':'transparent', border:`1px solid ${done?C.success+'33':C.border}`, transition:'all .2s' }}
                    onMouseEnter={e=>!done&&(e.currentTarget.style.borderColor=catColor+'44')}
                    onMouseLeave={e=>!done&&(e.currentTarget.style.borderColor=C.border)}>
                    <div style={{ width:28, height:28, borderRadius:'50%', background:done?C.success:`${catColor}22`, border:`2px solid ${done?C.success:catColor}`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:done?'#fff':catColor, fontSize:12, flexShrink:0, transition:'all .25s' }}>
                      {done?'✓':i+1}
                    </div>
                    <p style={{ color:done?C.muted:C.text, fontSize:14, lineHeight:1.7, flex:1, transition:'color .2s', textDecoration:done?'line-through':'none', textDecorationColor:done?`${C.success}66`:'transparent' }}>{step}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tips */}
          <div id="section-tips" className="card fade-up" style={{ marginBottom:16 }}>
            <h2 style={{ color:C.heading, fontSize:17, fontWeight:700, marginBottom:16 }}>💡 Pro Tips</h2>
            {article.tips.map((tip, i) => (
              <div key={i} style={{ display:'flex', gap:12, padding:'12px 12px', borderRadius:8, marginBottom:8, background:C.surface }}>
                <span style={{ color:catColor, fontSize:16, flexShrink:0, marginTop:2 }}>→</span>
                <p style={{ color:C.text, fontSize:14, lineHeight:1.7 }}>{enrichText(tip)}</p>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div id="section-faq">
            <FaqSection faq={article.faq} catColor={catColor} />
          </div>

          {/* Track This Process */}
          <div className="card fade-up" style={{ marginBottom:16, borderLeft:`3px solid ${catColor}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${catColor}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>📋</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:C.heading, fontSize:14 }}>Track this process</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Save to My Cases with all steps and set deadline reminders</div>
              </div>
              <button onClick={()=>{
                const cat = Object.entries(CASE_CATEGORIES).find(([k])=>article.c?.toLowerCase().includes(k))
                addCaseGlobal({
                  title: article.t,
                  category: cat?cat[0]:'other',
                  status:'active',
                  notes: article.summary,
                  steps: article.steps.map(s=>({ text: s.slice(0,120), done:false })),
                  articleId: article.id,
                })
                showToast(`"${article.t}" added to My Cases`, 'success')
              }} className="btn btn-primary" style={{ flexShrink:0, fontSize:13, padding:'8px 16px' }}>
                + Track This
              </button>
            </div>
          </div>

          {/* Helpful */}
          <div className="card" style={{ marginBottom:0 }}>
            <h3 style={{ color:C.heading, marginBottom:6, fontSize:15 }}>Was this guide helpful?</h3>
            <p style={{ color:C.muted, fontSize:12, marginBottom:14 }}>Your feedback helps us improve these guides.</p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setHelpful('yes')} className="btn" style={{ flex:1, background:helpful==='yes'?`${C.success}22`:C.surface, border:`1px solid ${helpful==='yes'?C.success:C.border}`, color:helpful==='yes'?C.success:C.muted, fontSize:13 }}>👍 Helpful</button>
              <button onClick={()=>setHelpful('no')} className="btn" style={{ flex:1, background:helpful==='no'?`${C.danger}22`:C.surface, border:`1px solid ${helpful==='no'?C.danger:C.border}`, color:helpful==='no'?C.danger:C.muted, fontSize:13 }}>👎 Needs work</button>
            </div>
            {helpful==='yes' && <p style={{ marginTop:10, fontSize:13, color:C.success }}>✓ Thanks for the feedback!</p>}
            {helpful==='no' && <p style={{ marginTop:10, fontSize:13, color:C.muted }}>We'll use your feedback to improve this guide.</p>}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position:'sticky', top:24, display:'flex', flexDirection:'column', gap:12 }} className="article-sidebar">
          {/* Progress */}
          <div className="card" style={{ padding:'16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:700, color:C.heading }}>Your Progress</span>
              <span style={{ fontSize:12, color:catColor, fontWeight:700 }}>{progress}%</span>
            </div>
            <div className="progress-bar-track" style={{ marginBottom:12 }}>
              <div className="progress-bar-fill" style={{ width:`${progress}%`, background:progress===100?C.success:catColor }} />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              {article.steps.map((s,i)=>(
                <button key={i} onClick={()=>toggleStep(i)} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 8px', borderRadius:6, background:completedSteps.has(i)?`${C.success}15`:C.surface, border:`1px solid ${completedSteps.has(i)?C.success+'44':C.border}`, cursor:'pointer', width:'100%', transition:'all .15s' }}>
                  <div style={{ width:14, height:14, borderRadius:'50%', border:`2px solid ${completedSteps.has(i)?C.success:C.border}`, background:completedSteps.has(i)?C.success:'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {completedSteps.has(i) && <span style={{ color:'#fff', fontSize:8 }}>✓</span>}
                  </div>
                  <span style={{ fontSize:11, color:completedSteps.has(i)?C.muted:C.text, textAlign:'left', lineHeight:1.3, flex:1, textDecoration:completedSteps.has(i)?'line-through':'none' }}>
                    {s.slice(0,40)}{s.length>40?'…':''}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Jump to */}
          <div className="card" style={{ padding:'14px' }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase' }}>Jump to</span>
            <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:2 }}>
              {[['steps','📋 Steps'],['tips','💡 Tips'],['faq','❓ FAQ']].map(([id,label])=>(
                <button key={id} className={`toc-link ${activeSection===id?'active':''}`} onClick={()=>scrollTo(id)}>{label}</button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card" style={{ padding:'14px' }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase' }}>Quick Actions</span>
            <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:8 }}>
              <button className="btn btn-primary" style={{ width:'100%', fontSize:12, padding:'8px 12px', justifyContent:'center' }}>🤖 Ask CLARA About This</button>
              <button onClick={()=>setBookmarked(v=>!v)} className="btn" style={{ width:'100%', fontSize:12, padding:'8px 12px', justifyContent:'center', background:bookmarked?`${C.warn}15`:C.surface, border:`1px solid ${bookmarked?C.warn:C.border}`, color:bookmarked?C.warn:C.text }}>{bookmarked?'🔖 Saved':'🔖 Save Guide'}</button>
            </div>
          </div>

          {/* Tags */}
          <div className="card" style={{ padding:'14px' }}>
            <span style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase' }}>Tags</span>
            <div style={{ marginTop:10, display:'flex', flexWrap:'wrap', gap:5 }}>
              {article.tags.map(tag=><span key={tag} className="tag-pill" style={{ background:C.surface, color:C.muted }}>#{tag}</span>)}
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="card" style={{ padding:'14px' }}>
              <span style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase' }}>Related Guides</span>
              <div style={{ marginTop:10 }}>
                {related.map(a=>(
                  <div key={a.id} onClick={()=>onViewArticle(a)} className="card-hover" style={{ padding:'10px 8px', borderBottom:`1px solid ${C.border}`, cursor:'pointer', display:'flex', gap:10, alignItems:'center', borderRadius:6, transition:'background .15s' }}
                    onMouseEnter={e=>e.currentTarget.style.background=`${C.primary}08`}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <span style={{ fontSize:18 }}>{a.icon}</span>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, color:C.text, fontWeight:600, lineHeight:1.3 }}>{a.t}</div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.c} · {a.time}</div>
                    </div>
                    <span style={{ color:C.muted, fontSize:14 }}>›</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function GlossaryModal({ onClose }) {
  const [q, setQ] = useState('')
  const [copied, setCopied] = useState(null)
  const [activeLetter, setActiveLetter] = useState(null)
  const filtered = GLOSSARY.filter(g => {
    const qLow = q.toLowerCase()
    const matchesSearch = g.term.toLowerCase().includes(qLow) || g.def.toLowerCase().includes(qLow)
    const matchesLetter = !activeLetter || g.term[0].toUpperCase() === activeLetter
    return matchesSearch && matchesLetter
  })
  const letters = [...new Set(GLOSSARY.map(g => g.term[0].toUpperCase()))].sort()
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e=>e.stopPropagation()} style={{ maxWidth:720 }}>
        <div style={{ padding:'18px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:10, background:`${C.primary}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>📖</div>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:800, color:C.heading, fontSize:17 }}>Benefits & Legal Glossary</div>
            <div style={{ fontSize:12, color:C.muted }}>{filtered.length} of {GLOSSARY.length} terms · Click any term to copy definition</div>
          </div>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ padding:'12px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:8, alignItems:'center' }}>
          <input value={q} onChange={e=>{setQ(e.target.value);setActiveLetter(null)}} placeholder="Search 80+ government and legal terms…" style={{ padding:'9px 14px', fontSize:13 }} autoFocus />
          {q && <button onClick={()=>setQ('')} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:16, flexShrink:0 }}>✕</button>}
        </div>
        {!q && (
          <div style={{ padding:'8px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', gap:4, flexWrap:'wrap' }}>
            {['All',...letters].map(l => (
              <button key={l} onClick={()=>setActiveLetter(l==='All'?null:l)}
                style={{ padding:'3px 8px', borderRadius:6, border:`1px solid ${activeLetter===l||(l==='All'&&!activeLetter)?C.primary:C.border}`, background:activeLetter===l||(l==='All'&&!activeLetter)?`${C.primary}22`:'transparent', color:activeLetter===l||(l==='All'&&!activeLetter)?C.primary:C.muted, cursor:'pointer', fontSize:11, fontWeight:700, transition:'all .12s' }}>
                {l}
              </button>
            ))}
          </div>
        )}
        <div style={{ overflowY:'auto', padding:'12px 24px 24px', flex:1 }}>
          {filtered.length === 0 && <div style={{ padding:32, textAlign:'center', color:C.muted, fontSize:14 }}>No terms matching "{q}"</div>}
          {filtered.map((g, i) => (
            <div key={i} onClick={()=>{ navigator.clipboard.writeText(`${g.term}: ${g.def}`).catch(()=>{}); setCopied(i); setTimeout(()=>setCopied(null),1800) }}
              style={{ padding:'12px 14px', borderRadius:10, marginBottom:6, background:C.surface, border:`1px solid ${copied===i?C.success:C.border}`, cursor:'pointer', transition:'all .15s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.primary+'44'}
              onMouseLeave={e=>copied!==i&&(e.currentTarget.style.borderColor=C.border)}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <span style={{ fontWeight:800, color:C.primary, fontSize:13 }}>{g.term}</span>
                <span style={{ marginLeft:'auto', fontSize:10, color:copied===i?C.success:C.muted, transition:'color .2s' }}>
                  {copied===i ? '✓ Copied!' : '⎘ click to copy'}
                </span>
              </div>
              <div style={{ fontSize:13, color:C.text, lineHeight:1.65 }}>{g.def}</div>
            </div>
          ))}
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
  const [activeCollection, setActiveCollection] = useState(null)
  const [showGlossary, setShowGlossary] = useState(false)
  const [featIdx, setFeatIdx] = useState(0)

  useState(()=>{
    const handler = (e) => {
      if ((e.metaKey||e.ctrlKey) && e.key==='k') {
        e.preventDefault()
        setSelected(null)
        setTimeout(()=>document.querySelector('input[placeholder*="Search"]')?.focus(), 100)
      }
      if (e.key==='Escape') {
        setSelected(null)
        setShowGlossary(false)
        setActiveCollection(null)
        setActivePath(null)
      }
    }
    window.addEventListener('keydown', handler)
  }, [])

  function openArticle(a) {
    setSelected(a)
    setRecentlyViewed(rv => [a, ...rv.filter(x=>x.id!==a.id)].slice(0,8))
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
  const trending = [...KB_ARTICLES].sort((a,b)=>b.v-a.v).slice(0,6)
  const totalViews = KB_ARTICLES.reduce((s,a)=>s+a.v,0)
  const avgRating = (KB_ARTICLES.reduce((s,a)=>s+a.rating,0)/KB_ARTICLES.length).toFixed(1)
  const featuredArticle = KB_ARTICLES.find(a=>a.id===FEATURED_ARTICLES[featIdx % FEATURED_ARTICLES.length])
  const newArticles = [...KB_ARTICLES].sort((a,b)=>b.id-a.id).slice(0,4)

  return (
    <div className="page">
      {showGlossary && <GlossaryModal onClose={()=>setShowGlossary(false)} />}

      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:800, color:C.primary, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Knowledge Base</div>
            <h1 style={{ fontSize:28, fontWeight:900, color:C.heading, letterSpacing:'-.02em', marginBottom:6 }}>
              {KB_ARTICLES.length} Government Guides
            </h1>
            <p style={{ color:C.muted, fontSize:14, maxWidth:480 }}>Benefits, healthcare, taxes, legal rights, housing, employment and more — in plain English.</p>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button onClick={()=>setShowGlossary(true)} className="btn btn-ghost btn-sm">📖 Glossary</button>
            <button onClick={()=>{
              const r = KB_ARTICLES[Math.floor(Math.random()*KB_ARTICLES.length)]
              openArticle(r)
              showToast(`Opening: ${r.icon} ${r.t.slice(0,40)}…`, 'info')
            }} className="btn btn-ghost btn-sm">🎲 Random Guide</button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
        {[[KB_ARTICLES.length+'','📚',C.primary,'Guides'],[Object.keys(CAT_META).length+'','🗂️',C.accent,'Categories'],[avgRating+'★','⭐',C.warn,'Avg Rating'],[(totalViews/1000).toFixed(0)+'K','👁️',C.success,'Monthly Views']].map(([v,i,color,l])=>(
          <div key={l} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:C.card, border:`1px solid ${C.border}`, borderRadius:12, flex:1, minWidth:100 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>{i}</div>
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:C.heading, letterSpacing:'-.01em' }}>{v}</div>
              <div style={{ fontSize:11, color:C.muted, fontWeight:500 }}>{l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:16 }}>
        <span style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', fontSize:18 }}>🔍</span>
        <input
          value={search}
          onChange={e=>{setSearch(e.target.value);setCat('All');setActivePath(null);setActiveCollection(null)}}
          placeholder={`Search ${KB_ARTICLES.length} guides — try "disability", "SNAP", "eviction", "Medicare"…`}
          style={{ padding:'14px 48px', fontSize:15, borderRadius:12, border:`1px solid ${search?C.primary:C.border}`, boxShadow:search?`0 0 0 3px ${C.primary}18`:'none' }}
        />
        {search
          ? <button onClick={()=>setSearch('')} style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.muted, cursor:'pointer', padding:'3px 8px', fontSize:12 }}>✕ Clear</button>
          : <span style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)' }}><span className="kbd">⌘K</span></span>
        }
      </div>

      {/* Category Scroll + Filter Row */}
      <div style={{ display:'flex', gap:6, marginBottom:12, overflowX:'auto', paddingBottom:4 }}>
        <button onClick={()=>{setCat('All');setActivePath(null);setActiveCollection(null)}}
          style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${cat==='All'?C.primary:C.border}`, background:cat==='All'?`${C.primary}22`:'transparent', color:cat==='All'?C.primary:C.muted, cursor:'pointer', fontSize:12, fontWeight:cat==='All'?700:400, flexShrink:0, transition:'all .15s' }}>
          All · {KB_ARTICLES.length}
        </button>
        {catCounts.map(({c,n,icon,color})=>(
          <button key={c} onClick={()=>{setCat(c);setActivePath(null);setActiveCollection(null)}}
            style={{ padding:'6px 12px', borderRadius:20, border:`1px solid ${cat===c?color:C.border}`, background:cat===c?`${color}22`:'transparent', color:cat===c?color:C.muted, cursor:'pointer', fontSize:12, fontWeight:cat===c?700:400, flexShrink:0, transition:'all .15s' }}>
            {icon} {c} · {n}
          </button>
        ))}
      </div>

      {/* Filter row + active chips */}
      <div style={{ display:'flex', gap:8, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>
        <select value={diff} onChange={e=>setDiff(e.target.value)} style={{ width:'auto', padding:'7px 12px', fontSize:12, borderRadius:8 }}>
          <option value="All">All Levels</option><option>Easy</option><option>Medium</option><option>Hard</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ width:'auto', padding:'7px 12px', fontSize:12, borderRadius:8 }}>
          <option value="popular">🔥 Popular</option><option value="rating">★ Rating</option>
          <option value="newest">🆕 Newest</option><option value="alpha">A–Z</option>
        </select>

        {/* Active filter chips */}
        {cat!=='All' && (
          <span className="filter-chip" style={{ background:`${CAT_META[cat]?.color||C.primary}18`, borderColor:`${CAT_META[cat]?.color||C.primary}44`, color:CAT_META[cat]?.color||C.primary }}
            onClick={()=>setCat('All')}>
            {CAT_META[cat]?.icon} {cat} ✕
          </span>
        )}
        {diff!=='All' && (
          <span className="filter-chip" style={{ background:`${DIFF_COLOR[diff]}18`, borderColor:`${DIFF_COLOR[diff]}44`, color:DIFF_COLOR[diff] }}
            onClick={()=>setDiff('All')}>
            {diff} ✕
          </span>
        )}
        {search && (
          <span className="filter-chip" style={{ background:`${C.primary}18`, borderColor:`${C.primary}44`, color:C.primary }}
            onClick={()=>setSearch('')}>
            "{search.slice(0,20)}{search.length>20?'…':''}" ✕
          </span>
        )}

        <span style={{ color:C.muted, fontSize:12, marginLeft:'auto' }}>{filtered.length} guides</span>
        <div style={{ display:'flex', gap:4 }}>
          {[['≡','list'],['⊞','grid']].map(([label,v])=>(
            <button key={v} onClick={()=>setView(v)} style={{ padding:'7px 10px', borderRadius:8, border:`1px solid ${view===v?C.primary:C.border}`, background:view===v?`${C.primary}22`:'transparent', color:view===v?C.primary:C.muted, cursor:'pointer', fontSize:14, transition:'all .15s' }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── SEARCH RESULTS ── */}
      {search ? (
        <div>
          <div style={{ marginBottom:16, fontSize:14, color:C.muted }}>{filtered.length} result{filtered.length!==1?'s':''} for <strong style={{ color:C.text }}>"{search}"</strong></div>
          {filtered.length===0 ? (
            <div className="card fade-in" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:56, marginBottom:16 }}>🔍</div>
              <div style={{ fontWeight:800, color:C.heading, fontSize:20, marginBottom:8 }}>No results for "{search}"</div>
              <div style={{ color:C.muted, marginBottom:20, lineHeight:1.6 }}>Try one of these popular topics:</div>
              <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
                {['SNAP','Medicare','disability','taxes','LLC','eviction','credit','veterans'].map(s=>(
                  <button key={s} onClick={()=>setSearch(s)} style={{ padding:'6px 14px', borderRadius:20, border:`1px solid ${C.border}`, background:C.surface, color:C.text, cursor:'pointer', fontSize:13, transition:'all .15s' }}>{s}</button>
                ))}
              </div>
              <button className="btn btn-primary" onClick={()=>setSearch('')}>Clear Search</button>
            </div>
          ) : <ArticleList articles={filtered} view={view} onOpen={openArticle} bookmarks={bookmarks} setBookmarks={setBookmarks} searchQuery={search} />}
        </div>

      /* ── CATEGORY VIEW ── */
      ) : cat!=='All' ? (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <span style={{ fontSize:40 }}>{CAT_META[cat]?.icon}</span>
            <div>
              <h2 style={{ color:C.heading, fontSize:22, fontWeight:800 }}>{cat}</h2>
              <div style={{ color:C.muted, fontSize:14 }}>{filtered.length} guides</div>
            </div>
          </div>
          <ArticleList articles={filtered} view={view} onOpen={openArticle} bookmarks={bookmarks} setBookmarks={setBookmarks} searchQuery="" />
        </div>

      /* ── COLLECTION VIEW ── */
      ) : activeCollection ? (() => {
        const col = COLLECTIONS.find(c=>c.id===activeCollection)
        const colArticles = col.articles.map(id=>KB_ARTICLES.find(a=>a.id===id)).filter(Boolean)
        return (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', background:`${col.color}11`, border:`1px solid ${col.color}33`, borderRadius:14, marginBottom:20 }}>
              <span style={{ fontSize:32 }}>{col.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, color:C.heading, fontSize:18 }}>{col.title}</div>
                <div style={{ fontSize:13, color:C.muted }}>{col.articles.length} curated guides</div>
              </div>
              <button onClick={()=>setActiveCollection(null)} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:'pointer', padding:'5px 10px', fontSize:12 }}>✕ Back</button>
            </div>
            <ArticleList articles={colArticles} view={view} onOpen={openArticle} bookmarks={bookmarks} setBookmarks={setBookmarks} searchQuery="" />
          </div>
        )
      })() : activePath ? (() => {
        const path = LEARNING_PATHS.find(p=>p.id===activePath)
        const pathArticles = path.articles.map(id=>KB_ARTICLES.find(a=>a.id===id)).filter(Boolean)
        return (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:16, padding:'14px 20px', background:`${path.color}11`, border:`1px solid ${path.color}33`, borderRadius:12, marginBottom:16 }}>
              <span style={{ fontSize:28 }}>{path.icon}</span>
              <div style={{ flex:1 }}><div style={{ fontWeight:700, color:C.heading }}>{path.title}</div><div style={{ fontSize:13, color:C.muted }}>{path.desc}</div></div>
              <button onClick={()=>setActivePath(null)} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, cursor:'pointer', padding:'5px 10px', fontSize:12 }}>✕ Back</button>
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
      })()

      /* ── HOME VIEW ── */
      : (
        <div>

          {/* Featured Article Hero */}
          {featuredArticle && (() => {
            const fc = CAT_META[featuredArticle.c]?.color || C.primary
            return (
              <div style={{ marginBottom:28 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:12, fontWeight:800, color:C.warn, letterSpacing:'.08em', textTransform:'uppercase' }}>⭐ Featured Guide</span>
                  <div style={{ flex:1, height:1, background:C.border }} />
                  <div style={{ display:'flex', gap:5 }}>
                    {FEATURED_ARTICLES.slice(0,6).map((id,i)=>(
                      <button key={id} onClick={()=>setFeatIdx(i)}
                        style={{ width:i===featIdx%FEATURED_ARTICLES.length?24:8, height:8, borderRadius:4, border:'none', cursor:'pointer', background:i===featIdx%FEATURED_ARTICLES.length?C.primary:C.border, transition:'all .25s' }} />
                    ))}
                  </div>
                </div>
                <div onClick={()=>openArticle(featuredArticle)} className="card card-hover"
                  style={{ background:`linear-gradient(135deg, ${C.card}, ${fc}08)`, borderLeft:`4px solid ${fc}`, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, right:0, fontSize:100, opacity:.07, transform:'translate(20px,-10px)', userSelect:'none', pointerEvents:'none' }}>{featuredArticle.icon}</div>
                  <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
                    <span style={{ padding:'3px 10px', borderRadius:20, background:`${fc}22`, color:fc, fontSize:11, fontWeight:800 }}>{featuredArticle.c}</span>
                    <span style={{ fontSize:11, padding:'2px 8px', borderRadius:4, background:`${DIFF_COLOR[featuredArticle.diff]}22`, color:DIFF_COLOR[featuredArticle.diff], fontWeight:700 }}>{featuredArticle.diff}</span>
                    <span style={{ fontSize:12, color:C.muted }}>⏱ {featuredArticle.time}</span>
                    <span style={{ marginLeft:'auto', fontSize:12, color:C.muted }}>{featuredArticle.v.toLocaleString()} views</span>
                  </div>
                  <h2 style={{ color:C.heading, fontSize:21, fontWeight:800, marginBottom:10, lineHeight:1.35, maxWidth:'75%' }}>
                    {featuredArticle.icon} {featuredArticle.t}
                  </h2>
                  <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, marginBottom:16, maxWidth:'72%' }}>{featuredArticle.summary}</p>
                  <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                    <div style={{ display:'flex', gap:2 }}>
                      {Array.from({length:5}).map((_,i)=><span key={i} style={{ color:i<Math.round(featuredArticle.rating)?C.warn:C.border, fontSize:13 }}>★</span>)}
                    </div>
                    <span style={{ fontSize:13, color:C.muted }}>{featuredArticle.rating} ({featuredArticle.reviews} reviews)</span>
                    <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={e=>{e.stopPropagation();openArticle(featuredArticle)}}>Read Guide →</button>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Quick-Start Collections */}
          <div style={{ marginBottom:28 }}>
            <div className="section-header">
              <div className="section-title">⚡ Quick-Start Collections</div>
              <span style={{ fontSize:12, color:C.muted }}>Curated for urgent situations</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(188px,1fr))', gap:10 }}>
              {COLLECTIONS.map(col=>(
                <div key={col.id} onClick={()=>setActiveCollection(col.id)} className="card card-hover"
                  style={{ padding:'14px 16px', borderTop:`3px solid ${col.color}`, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:-8, right:-4, fontSize:48, opacity:.06 }}>{col.icon}</div>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${col.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, marginBottom:10 }}>{col.icon}</div>
                  <div style={{ fontWeight:700, color:C.heading, fontSize:13, lineHeight:1.35, marginBottom:4 }}>{col.title}</div>
                  <div style={{ fontSize:11, color:C.muted }}>{col.articles.length} guides · click to explore</div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Paths */}
          <div style={{ marginBottom:28 }}>
            <div className="section-header">
              <div className="section-title">🗺️ Learning Paths</div>
              <span style={{ fontSize:12, color:C.muted }}>{LEARNING_PATHS.length} curated sequences</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10 }}>
              {LEARNING_PATHS.map(path=>(
                <div key={path.id} onClick={()=>setActivePath(path.id)} className="card card-hover"
                  style={{ padding:16, borderLeft:`3px solid ${path.color}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:`${path.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:19, flexShrink:0 }}>{path.icon}</div>
                    <div>
                      <div style={{ fontWeight:700, color:C.heading, fontSize:13, lineHeight:1.3 }}>{path.title}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{path.articles.length} guides</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:10, lineHeight:1.5 }}>{path.desc}</div>
                  <div style={{ display:'flex', gap:4 }}>
                    {path.articles.slice(0,5).map(id=>{ const a=KB_ARTICLES.find(x=>x.id===id); return a?<span key={id} title={a.t} style={{ fontSize:15 }}>{a.icon}</span>:null })}
                    {path.articles.length>5 && <span style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center' }}>+{path.articles.length-5}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending + New Split */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
            <div>
              <div className="section-header">
                <div className="section-title">🔥 Trending Now</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {trending.map((a,i)=>{
                  const color = i===0?C.warn:i<3?C.primary:C.muted
                  return (
                    <div key={a.id} onClick={()=>openArticle(a)} className="card card-hover"
                      style={{ padding:'10px 14px', display:'flex', gap:12, alignItems:'center' }}>
                      <div style={{ width:26, height:26, borderRadius:6, background:i<3?`${color}22`:C.surface, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span style={{ fontWeight:900, fontSize:13, color }}>{i+1}</span>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:C.heading, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.icon} {a.t}</div>
                        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.v.toLocaleString()} views · {a.c}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <div className="section-header">
                <div className="section-title">🆕 Recently Added</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {newArticles.map(a=>(
                  <div key={a.id} onClick={()=>openArticle(a)} className="card card-hover" style={{ padding:'10px 14px' }}>
                    <div style={{ display:'flex', gap:8, marginBottom:5, alignItems:'center' }}>
                      <span style={{ padding:'2px 8px', borderRadius:20, background:`${CAT_META[a.c]?.color||C.primary}22`, color:CAT_META[a.c]?.color||C.primary, fontSize:11, fontWeight:700 }}>{CAT_META[a.c]?.icon} {a.c}</span>
                      <span style={{ fontSize:10, padding:'2px 7px', borderRadius:4, background:`${C.success}22`, color:C.success, fontWeight:800, letterSpacing:'.05em' }}>NEW</span>
                    </div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.heading, lineHeight:1.4 }}>{a.icon} {a.t.length>52?a.t.slice(0,52)+'…':a.t}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recently Viewed + Bookmarks */}
          {(recentlyViewed.length > 0 || bookmarks.size > 0) && (
            <div style={{ display:'grid', gridTemplateColumns:recentlyViewed.length>0&&bookmarks.size>0?'1fr 1fr':'1fr', gap:16, marginBottom:28 }}>
              {recentlyViewed.length > 0 && (
                <div>
                  <div className="section-header"><div className="section-title">👁️ Continue Reading</div></div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {recentlyViewed.slice(0,4).map(a=>(
                      <div key={a.id} onClick={()=>openArticle(a)} className="card card-hover"
                        style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:20, flexShrink:0 }}>{a.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:C.heading, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.t}</div>
                          <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.c} · {a.time}</div>
                        </div>
                        <span style={{ color:C.muted, fontSize:16 }}>›</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {bookmarks.size > 0 && (
                <div>
                  <div className="section-header"><div className="section-title">🔖 Saved Guides ({bookmarks.size})</div></div>
                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {KB_ARTICLES.filter(a=>bookmarks.has(a.id)).slice(0,4).map(a=>(
                      <div key={a.id} onClick={()=>openArticle(a)} className="card card-hover"
                        style={{ padding:'10px 14px', display:'flex', alignItems:'center', gap:10, border:`1px solid ${C.warn}33` }}>
                        <span style={{ fontSize:20, flexShrink:0 }}>{a.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:C.heading, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.t}</div>
                          <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.c}</div>
                        </div>
                        <span style={{ color:C.warn, fontSize:14 }}>🔖</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Categories Grid */}
          <div style={{ marginBottom:28 }}>
            <div className="section-header">
              <div className="section-title">📂 All Categories</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(110px,1fr))', gap:8 }}>
              {catCounts.map(({c,n,icon,color})=>(
                <div key={c} onClick={()=>setCat(c)} className="card card-hover"
                  style={{ padding:'14px 10px', textAlign:'center', borderTop:`2px solid ${color}` }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{icon}</div>
                  <div style={{ fontWeight:700, color:C.heading, fontSize:11, lineHeight:1.3, marginBottom:3 }}>{c}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{n}</div>
                </div>
              ))}
            </div>
          </div>

          {/* All Articles */}
          <div>
            <div className="section-header" style={{ marginBottom:16 }}>
              <div className="section-title">📋 All Guides <span style={{ color:C.muted, fontWeight:400, fontSize:12 }}>({filtered.length})</span></div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={()=>setSort('popular')} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${sort==='popular'?C.primary:C.border}`, background:sort==='popular'?`${C.primary}18`:'transparent', color:sort==='popular'?C.primary:C.muted, cursor:'pointer', fontSize:11, fontWeight:600 }}>🔥</button>
                <button onClick={()=>setSort('rating')} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${sort==='rating'?C.primary:C.border}`, background:sort==='rating'?`${C.primary}18`:'transparent', color:sort==='rating'?C.primary:C.muted, cursor:'pointer', fontSize:11, fontWeight:600 }}>★</button>
                <button onClick={()=>setSort('newest')} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${sort==='newest'?C.primary:C.border}`, background:sort==='newest'?`${C.primary}18`:'transparent', color:sort==='newest'?C.primary:C.muted, cursor:'pointer', fontSize:11, fontWeight:600 }}>🆕</button>
                <button onClick={()=>setSort('alpha')} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${sort==='alpha'?C.primary:C.border}`, background:sort==='alpha'?`${C.primary}18`:'transparent', color:sort==='alpha'?C.primary:C.muted, cursor:'pointer', fontSize:11, fontWeight:600 }}>A-Z</button>
              </div>
            </div>
            <ArticleList articles={filtered} view={view} onOpen={openArticle} bookmarks={bookmarks} setBookmarks={setBookmarks} searchQuery="" />
          </div>
        </div>
      )}
    </div>
  )
}


// ── PHASE 21: AI ASSISTANT ────────────────────────────────────────────────────
// ── PHASE 21: CLARA AI ASSISTANT (Real OpenRouter integration) ───────────────

const INTAKE_QUESTIONS = [
  {
    id: 'situation',
    q: "What best describes your current situation?",
    opts: [
      { v:'benefits', l:'🍎 Applying for benefits', d:'SNAP, Medicaid, SSI, TANF' },
      { v:'housing',  l:'🏠 Housing issue',        d:'Eviction, rent help, Section 8' },
      { v:'reentry',  l:'🔄 Returning from incarceration', d:'Benefits, ID, housing, employment' },
      { v:'work',     l:'💼 Work / employment',    d:'Job rights, workers comp, unemployment' },
      { v:'legal',    l:'⚖️ Legal issue',           d:'Court, rights, forms, immigration' },
      { v:'business', l:'🏢 Starting a business',  d:'LLC, EIN, licenses, funding' },
      { v:'other',    l:'❓ Something else',        d:'I will describe it' },
    ]
  },
  {
    id: 'urgency',
    q: "How urgent is your situation?",
    opts: [
      { v:'crisis',   l:'🚨 Crisis — I need help today',  d:'Eviction notice, benefit cutoff, emergency' },
      { v:'soon',     l:'⚡ Soon — within the next week', d:'Deadline coming up, in process' },
      { v:'planning', l:'📋 Planning ahead',              d:'Not urgent, gathering info' },
    ]
  },
]

const STARTER_MSGS = {
  benefits: "I can help you navigate benefits. To get started — which benefit are you trying to apply for or keep? (SNAP, Medicaid, SSI/SSDI, TANF, Medicare, or something else?)",
  housing:  "Housing issues can be stressful. Are you dealing with an eviction notice, looking for rental assistance, applying for Section 8, or something else with your housing?",
  reentry:  "Welcome back. Getting benefits, IDs, and housing set up after incarceration is complicated but very doable. What's most pressing right now — getting your ID, finding housing, applying for benefits, or finding a job?",
  work:     "I can help with work and employment issues. Are you dealing with unpaid wages, a workplace injury, filing for unemployment, FMLA leave, or something else?",
  legal:    "For legal issues, I can walk you through processes and help you understand your rights. What's the legal matter — immigration, eviction court, criminal record, small claims, or something else?",
  business: "Great — let's get your business set up right. Are you starting from scratch (need an LLC and EIN), or are you further along and need licenses, taxes, or funding help?",
  other:    "Tell me what's going on and I'll do my best to help navigate it.",
}

function TypingDots() {
  return (
    <div style={{ display:'flex', gap:4, padding:'14px 16px', background:C.surface, borderRadius:12, width:'fit-content', alignItems:'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:C.primary, animation:'pulse 1.2s ease infinite', animationDelay:`${i*0.2}s` }} />
      ))}
    </div>
  )
}

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user'
  const [copied, setCopied] = useState(false)

  const copyText = () => {
    navigator.clipboard.writeText(msg.text).catch(()=>{})
    setCopied(true)
    setTimeout(()=>setCopied(false), 1500)
  }

  return (
    <div style={{ display:'flex', gap:10, justifyContent:isUser?'flex-end':'flex-start', animation:'fadeUp .25s ease', marginBottom:4 }}>
      {!isUser && (
        <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14, fontWeight:800, color:'#fff' }}>C</div>
      )}
      <div style={{ maxWidth:'78%', display:'flex', flexDirection:'column', gap:4, alignItems:isUser?'flex-end':'flex-start' }}>
        <div style={{
          padding:'12px 16px', borderRadius:isUser?'16px 16px 4px 16px':'16px 16px 16px 4px',
          background:isUser?`linear-gradient(135deg, ${C.primary}, #2563eb)`:C.surface,
          color:C.text, fontSize:14, lineHeight:1.75, whiteSpace:'pre-line',
          border:isUser?'none':`1px solid ${C.border}`,
          boxShadow:isUser?'0 2px 12px rgba(59,130,246,.25)':'none',
        }}>
          {msg.text}
        </div>
        {msg.suggestedArticles?.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:4 }}>
            {msg.suggestedArticles.map(title => {
              const art = KB_ARTICLES.find(a => a.t === title || a.t.toLowerCase().includes(title.toLowerCase().split(' ')[0]))
              return art ? (
                <a key={title} href="/knowledge" style={{ padding:'4px 10px', background:`${C.primary}15`, border:`1px solid ${C.primary}33`, borderRadius:20, fontSize:11, color:C.primary, fontWeight:600, cursor:'pointer', textDecoration:'none' }}>
                  📄 {art.t.length > 30 ? art.t.slice(0,30)+'…' : art.t}
                </a>
              ) : null
            })}
          </div>
        )}
        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
          <button onClick={copyText} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:10, padding:'2px 4px', opacity:.6 }}>
            {copied ? '✓ copied' : '⎘'}
          </button>
          {!isUser && msg.text?.length > 80 && (
            <button onClick={()=>{
              addCaseGlobal({
                title: msg.text.slice(0,60).replace(/[\n\r]+/g,' ').trim() + '…',
                category: 'other',
                status:'active',
                notes: msg.text.slice(0,500),
                steps: msg.text.split('\n').filter(l=>/^\d+\./.test(l.trim())).map(l=>({ text:l.replace(/^\d+\.\s*/,'').trim(), done:false })),
              })
              showToast('Added to My Cases','success')
            }} style={{ background:'none', border:`1px solid ${C.primary}44`, borderRadius:4, color:C.primary, cursor:'pointer', fontSize:10, padding:'2px 7px', opacity:.8 }}>
              + Track
            </button>
          )}
        </div>
      </div>
      {isUser && (
        <div style={{ width:32, height:32, borderRadius:'50%', background:`${C.success}22`, border:`1px solid ${C.success}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:13 }}>👤</div>
      )}
    </div>
  )
}

function AIAssistant({ initialArticle = null }) {
  const [phase, setPhase] = useState(initialArticle ? 'chat' : 'intake')
  const [intakeStep, setIntakeStep] = useState(0)
  const [intakeData, setIntakeData] = useState({})
  const [msgs, setMsgs] = useState(() => {
    if (initialArticle) {
      return [{
        role: 'ai',
        text: `Hi! I'm CLARA. I see you're looking at "${initialArticle.t}" — what would you like to know about this? I can explain any step, check eligibility, or generate a personalized checklist.`,
        ts: Date.now(),
      }]
    }
    return []
  })
  const [inp, setInp] = useState('')
  const [loading, setLoading] = useState(false)
  const [articleCtx, setArticleCtx] = useState(initialArticle)
  const [sessionId] = useState(() => Math.random().toString(36).slice(2))
  const bottomRef = useState(null)
  const inputRef = useState(null)

  const scrollBottom = () => {
    setTimeout(() => {
      document.getElementById('clara-msgs-end')?.scrollIntoView({ behavior:'smooth' })
    }, 50)
  }

  const addMsg = (role, text, extra = {}) => {
    setMsgs(m => [...m, { role, text, ts:Date.now(), ...extra }])
    scrollBottom()
  }

  const sendToAPI = async (userText, history, ctx = null) => {
    setLoading(true)
    try {
      const res = await fetch('/api/clara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { role:'user', text:userText }],
          articleContext: ctx,
          sessionId,
        })
      })
      const data = await res.json()
      addMsg('ai', data.reply || "I couldn't generate a response. Please try again.", { suggestedArticles: data.suggestedArticles })
    } catch {
      addMsg('ai', "Connection error. For immediate help call 211 or visit abe.illinois.gov.")
    } finally {
      setLoading(false)
    }
  }

  const handleIntakeAnswer = (questionId, value) => {
    const newData = { ...intakeData, [questionId]: value }
    setIntakeData(newData)

    if (intakeStep < INTAKE_QUESTIONS.length - 1) {
      setIntakeStep(s => s + 1)
    } else {
      // Intake complete — build opening message and go to chat
      const situation = newData.situation || 'other'
      const urgency = newData.urgency || 'planning'
      const starterText = STARTER_MSGS[situation] || STARTER_MSGS.other
      const urgencyNote = urgency === 'crisis' ? '\n\n⚠️ I see this is urgent. I will prioritize immediate action steps.' : urgency === 'soon' ? '\n\nI will make sure to highlight any deadlines.' : ''

      setPhase('chat')
      setMsgs([{ role:'ai', text: starterText + urgencyNote, ts:Date.now() }])
      scrollBottom()
    }
  }

  const send = (text) => {
    const msg = text || inp
    if (!msg.trim() || loading) return
    setInp('')
    addMsg('user', msg)
    sendToAPI(msg, msgs, articleCtx)
  }

  const QUICK_PROMPTS = [
    'Am I eligible for SNAP?',
    'How do I appeal a benefits denial?',
    'What documents do I need for Medicaid?',
    'How do I start an LLC in Illinois?',
    'What are my rights if I get evicted?',
    'Help me find free legal aid',
  ]

  // ── INTAKE PHASE ────────────────────────────────────────────────────────────
  if (phase === 'intake') {
    const q = INTAKE_QUESTIONS[intakeStep]
    return (
      <div className="page">
        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <div style={{ width:64, height:64, borderRadius:'50%', background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'#fff', margin:'0 auto 16px' }}>C</div>
            <h1 style={{ color:C.heading, fontSize:28, fontWeight:800, marginBottom:8 }}>Hi, I'm CLARA</h1>
            <p style={{ color:C.muted, fontSize:15, lineHeight:1.6 }}>Your civic guide. Let me ask a couple quick questions so I can give you the most relevant help.</p>
          </div>

          <div className="card fade-up" style={{ padding:32 }}>
            <div style={{ display:'flex', gap:8, marginBottom:24 }}>
              {INTAKE_QUESTIONS.map((_,i) => (
                <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i <= intakeStep ? C.primary : C.border, transition:'background .3s' }} />
              ))}
            </div>

            <div style={{ fontSize:12, color:C.primary, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>
              Question {intakeStep + 1} of {INTAKE_QUESTIONS.length}
            </div>
            <h2 style={{ color:C.heading, fontSize:20, fontWeight:700, marginBottom:24 }}>{q.q}</h2>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {q.opts.map(opt => (
                <button key={opt.v} onClick={() => handleIntakeAnswer(q.id, opt.v)}
                  style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 18px', borderRadius:10, border:`1px solid ${C.border}`, background:C.surface, cursor:'pointer', textAlign:'left', transition:'all .15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.background=`${C.primary}0a` }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface }}>
                  <span style={{ fontSize:20, flexShrink:0 }}>{opt.l.split(' ')[0]}</span>
                  <div>
                    <div style={{ fontWeight:600, color:C.heading, fontSize:14 }}>{opt.l.slice(opt.l.indexOf(' ')+1)}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{opt.d}</div>
                  </div>
                  <span style={{ marginLeft:'auto', color:C.muted }}>›</span>
                </button>
              ))}
            </div>

            <button onClick={() => { setPhase('chat'); setMsgs([{ role:'ai', text:"Hi! I'm CLARA — your guide to government processes and benefits. What can I help you with today?", ts:Date.now() }]) }}
              style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:13, marginTop:16, display:'block', width:'100%', textAlign:'center' }}>
              Skip — just take me to the chat →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── CHAT PHASE ──────────────────────────────────────────────────────────────
  return (
    <div className="page" style={{ paddingBottom:0 }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', gap:20, height:'calc(100vh - 100px)', alignItems:'start' }}>
        {/* Main chat */}
        <div className="card" style={{ display:'flex', flexDirection:'column', height:'100%', padding:0, overflow:'hidden' }}>
          {/* Header */}
          <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:16 }}>C</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:800, color:C.heading, fontSize:15 }}>CLARA</div>
              <div style={{ fontSize:12, color:C.success, display:'flex', alignItems:'center', gap:4 }}>
                <div style={{ width:6, height:6, borderRadius:'50%', background:C.success }} />
                Online · Free tier (OpenRouter)
              </div>
            </div>
            {articleCtx && (
              <div style={{ padding:'4px 10px', background:`${C.primary}15`, border:`1px solid ${C.primary}33`, borderRadius:8, fontSize:11, color:C.primary, display:'flex', alignItems:'center', gap:6 }}>
                📄 {articleCtx.title?.slice(0,25)}…
                <button onClick={()=>setArticleCtx(null)} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:12 }}>✕</button>
              </div>
            )}
            <button onClick={()=>{setPhase('intake');setIntakeStep(0);setIntakeData({});setMsgs([])}} style={{ background:'none', border:`1px solid ${C.border}`, borderRadius:6, color:C.muted, cursor:'pointer', fontSize:11, padding:'4px 8px' }}>New chat</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:12 }}>
            {msgs.length === 0 && (
              <div style={{ textAlign:'center', padding:'40px 20px', color:C.muted }}>
                <div style={{ fontSize:40, marginBottom:12 }}>💬</div>
                <div style={{ fontSize:14 }}>Ask me anything about benefits, housing, legal rights, or any government process.</div>
              </div>
            )}
            {msgs.map((m, i) => <MessageBubble key={i} msg={m} />)}
            {loading && (
              <div style={{ display:'flex', gap:10, animation:'fadeUp .2s ease' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:'#fff', fontSize:14, flexShrink:0 }}>C</div>
                <TypingDots />
              </div>
            )}
            <div id="clara-msgs-end" />
          </div>

          {/* Input */}
          <div style={{ padding:'16px 20px', borderTop:`1px solid ${C.border}`, background:C.card }}>
            <div style={{ display:'flex', gap:10, alignItems:'flex-end' }}>
              <textarea
                value={inp}
                onChange={e=>setInp(e.target.value)}
                onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); send() } }}
                placeholder="Ask about benefits, housing, legal rights… (Enter to send)"
                rows={2}
                style={{ flex:1, resize:'none', padding:'10px 14px', fontSize:14, borderRadius:10, lineHeight:1.5 }}
              />
              <button onClick={()=>send()} disabled={!inp.trim()||loading} className="btn btn-primary"
                style={{ flexShrink:0, padding:'10px 18px', opacity:(!inp.trim()||loading)?0.5:1, height:44 }}>
                {loading ? '…' : '↑'}
              </button>
            </div>
            <div style={{ fontSize:11, color:C.muted, marginTop:6, textAlign:'center' }}>
              CLARA can make mistakes. Verify important info at official .gov sites or with a legal aid attorney.
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, overflowY:'auto', maxHeight:'100%' }} className="hide-mobile">
          <div className="card" style={{ padding:'16px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:12 }}>Quick Prompts</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {QUICK_PROMPTS.map(q => (
                <button key={q} onClick={()=>send(q)} style={{ display:'block', width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, padding:'8px 12px', cursor:'pointer', textAlign:'left', fontSize:12, lineHeight:1.4, transition:'all .15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.primary; e.currentTarget.style.color=C.primary }}
                  onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.text }}>
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding:'16px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:12 }}>CLARA Can Help</div>
            {[
              ['✅','Check eligibility'],
              ['📋','Generate checklists'],
              ['📞','Find phone numbers'],
              ['⚖️','Explain your rights'],
              ['📄','Decode gov forms'],
              ['🇪🇸','Responde en español'],
            ].map(([icon, label]) => (
              <div key={label} style={{ display:'flex', gap:8, alignItems:'center', padding:'5px 0', fontSize:12, color:C.muted }}>
                <span>{icon}</span>{label}
              </div>
            ))}
          </div>

          <div className="card" style={{ padding:'16px', background:`${C.danger}08`, borderColor:`${C.danger}33` }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.danger, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>Crisis Resources</div>
            {[
              ['211','Local resources'],
              ['988','Mental health crisis'],
              ['1-800-843-6154','IDHS helpline'],
            ].map(([num, label]) => (
              <div key={num} style={{ marginBottom:8 }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{num}</div>
                <div style={{ fontSize:11, color:C.muted }}>{label}</div>
              </div>
            ))}
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
    setTimeout(()=>{setResponse("To apply for unemployment in Illinois: Visit ides.illinois.gov, click 'File a Claim', and complete the online application. You\'ll need your SSN, 18 months of work history, and banking info. Claims process in 3-4 weeks.");setStatus('speaking')},3500)
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
    {id:'IL-DRV-2024-4401',type:"Driver\'s License",status:'VALID',d:'Feb 28'},
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

// ═══════════════════════════════════════════════════════════════════════════════
// CASE TRACKER — Persistent case management with deadline reminders
// ═══════════════════════════════════════════════════════════════════════════════

function AddCaseModal({ onClose, onAdd, prefill = null }) {
  const [form, setForm] = useState({
    title: prefill?.title || '',
    category: prefill?.category || 'benefits',
    status: 'active',
    notes: prefill?.notes || '',
    steps: prefill?.steps || [],
  })
  const [stepInput, setStepInput] = useState('')
  const [deadlines, setDeadlines] = useState(prefill?.deadlines || [])
  const [dlInput, setDlInput] = useState({ label:'', date:'' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addStep = () => {
    if (!stepInput.trim()) return
    set('steps', [...form.steps, { text: stepInput.trim(), done: false }])
    setStepInput('')
  }

  const addDl = () => {
    if (!dlInput.label || !dlInput.date) return
    setDeadlines(d => [...d, dlInput])
    setDlInput({ label:'', date:'' })
  }

  const submit = () => {
    if (!form.title.trim()) return
    onAdd({ ...form, deadlines })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth:520 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding:'18px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:22 }}>📋</div>
          <div style={{ flex:1, fontWeight:800, color:C.heading, fontSize:16 }}>{prefill ? 'Add Case from CLARA' : 'New Case'}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:20 }}>✕</button>
        </div>
        <div style={{ padding:'20px 24px', overflowY:'auto', maxHeight:'65vh', display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <label>Case title *</label>
            <input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="e.g. SNAP Application, LLC Formation, Eviction Response" autoFocus />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label>Category</label>
              <select value={form.category} onChange={e=>set('category',e.target.value)}>
                {Object.entries(CASE_CATEGORIES).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div>
              <label>Status</label>
              <select value={form.status} onChange={e=>set('status',e.target.value)}>
                {Object.entries(CASE_STATUSES).map(([k,v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
          </div>

          {/* Steps */}
          <div>
            <label>Steps / tasks</label>
            {form.steps.map((s,i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'center', padding:'6px 10px', background:C.surface, borderRadius:6, marginBottom:4 }}>
                <span style={{ color:C.success, fontSize:12 }}>●</span>
                <span style={{ flex:1, fontSize:13, color:C.text }}>{s.text}</span>
                <button onClick={()=>set('steps', form.steps.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer' }}>✕</button>
              </div>
            ))}
            <div style={{ display:'flex', gap:8, marginTop:4 }}>
              <input value={stepInput} onChange={e=>setStepInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addStep()} placeholder="Add a step… (Enter to add)" style={{ flex:1 }} />
              <button onClick={addStep} className="btn btn-outline" style={{ flexShrink:0, padding:'8px 14px' }}>+</button>
            </div>
          </div>

          {/* Deadlines */}
          <div>
            <label>Deadlines</label>
            {deadlines.map((d,i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'center', padding:'6px 10px', background:C.surface, borderRadius:6, marginBottom:4 }}>
                <span style={{ color:urgencyColor(deadlineUrgency(d.date)), fontSize:12 }}>⏰</span>
                <span style={{ flex:1, fontSize:13, color:C.text }}>{d.label}</span>
                <span style={{ fontSize:11, color:C.muted }}>{new Date(d.date).toLocaleDateString()}</span>
                <button onClick={()=>setDeadlines(dl=>dl.filter((_,j)=>j!==i))} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer' }}>✕</button>
              </div>
            ))}
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto auto', gap:8, marginTop:4 }}>
              <input value={dlInput.label} onChange={e=>setDlInput(d=>({...d,label:e.target.value}))} placeholder="Deadline label…" />
              <input type="date" value={dlInput.date} onChange={e=>setDlInput(d=>({...d,date:e.target.value}))} style={{ width:140 }} />
              <button onClick={addDl} className="btn btn-outline" style={{ padding:'8px 14px' }}>+</button>
            </div>
          </div>

          <div>
            <label>Notes</label>
            <textarea value={form.notes} onChange={e=>set('notes',e.target.value)} placeholder="Any extra context, reference numbers, contact info…" rows={3} />
          </div>
        </div>
        <div style={{ padding:'16px 24px', borderTop:`1px solid ${C.border}`, display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} className="btn" style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>Cancel</button>
          <button onClick={submit} className="btn btn-primary" disabled={!form.title.trim()} style={{ opacity:form.title.trim()?1:0.5 }}>Create Case</button>
        </div>
      </div>
    </div>
  )
}

function CaseCard({ c, deadlines, onUpdate, onDelete, onToggleStep }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [noteVal, setNoteVal] = useState(c.notes || '')
  const cat = CASE_CATEGORIES[c.category] || CASE_CATEGORIES.other
  const status = CASE_STATUSES[c.status] || CASE_STATUSES.active
  const cDl = deadlines.filter(d => d.caseId === c.id)
  const nextDl = cDl.sort((a,b) => new Date(a.date)-new Date(b.date))[0]
  const urgency = nextDl ? deadlineUrgency(nextDl.date) : 'none'
  const progress = c.steps?.length > 0 ? Math.round(((c.completedSteps||[]).length / c.steps.length) * 100) : null
  const isComplete = c.status === 'completed'

  return (
    <div className="card fade-up" style={{ marginBottom:10, borderLeft:`3px solid ${cat.color}`, opacity:isComplete?0.65:1, transition:'all .2s' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:10, background:`${cat.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{cat.icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
            <span style={{ fontWeight:700, color:C.heading, fontSize:15 }}>{c.title}</span>
            <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background:`${status.color}20`, color:status.color, fontWeight:700 }}>{status.icon} {status.label}</span>
            {nextDl && urgency !== 'none' && (
              <span style={{ fontSize:11, padding:'2px 8px', borderRadius:10, background:`${urgencyColor(urgency)}20`, color:urgencyColor(urgency), fontWeight:700 }}>
                ⏰ {daysUntil(nextDl.date)}: {nextDl.label}
              </span>
            )}
          </div>
          <div style={{ display:'flex', gap:12, fontSize:12, color:C.muted, flexWrap:'wrap' }}>
            <span>{cat.label}</span>
            {progress !== null && <span style={{ color:progress===100?C.success:C.primary }}>{'▓'.repeat(Math.round(progress/10))}{'░'.repeat(10-Math.round(progress/10))} {progress}%</span>}
            <span>Updated {new Date(c.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div style={{ display:'flex', gap:6, flexShrink:0 }}>
          <select value={c.status} onChange={e=>onUpdate(c.id,{status:e.target.value})}
            style={{ fontSize:11, padding:'4px 8px', borderRadius:6, background:C.surface, border:`1px solid ${C.border}`, color:C.text, cursor:'pointer', width:'auto' }}>
            {Object.entries(CASE_STATUSES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          <button onClick={()=>setExpanded(v=>!v)} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, color:C.muted, cursor:'pointer', padding:'4px 10px', fontSize:12 }}>
            {expanded ? '▲' : '▼'}
          </button>
          <button onClick={()=>{ if(confirm('Delete this case?')) onDelete(c.id) }} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer', fontSize:16, padding:'4px' }}>🗑️</button>
        </div>
      </div>

      {expanded && (
        <div className="fade-up" style={{ marginTop:16, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
          {/* Steps */}
          {c.steps?.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Steps</div>
              {c.steps.map((step, i) => {
                const done = (c.completedSteps||[]).includes(i)
                return (
                  <div key={i} onClick={()=>onToggleStep(c.id, i)} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'8px 10px', borderRadius:6, marginBottom:4, background:done?`${C.success}08`:C.surface, border:`1px solid ${done?C.success+'33':C.border}`, cursor:'pointer', transition:'all .15s' }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${done?C.success:C.border}`, background:done?C.success:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, transition:'all .2s' }}>
                      {done && <span style={{ color:'#fff', fontSize:9 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:13, color:done?C.muted:C.text, textDecoration:done?'line-through':'none', lineHeight:1.5 }}>{step.text}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Deadlines */}
          {cDl.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Deadlines</div>
              {cDl.map(d => {
                const u = deadlineUrgency(d.date)
                return (
                  <div key={d.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'8px 12px', borderRadius:6, marginBottom:4, background:`${urgencyColor(u)}10`, border:`1px solid ${urgencyColor(u)}33` }}>
                    <span style={{ color:urgencyColor(u), fontSize:16 }}>⏰</span>
                    <span style={{ flex:1, fontSize:13, color:C.text, fontWeight:600 }}>{d.label}</span>
                    <span style={{ fontSize:12, color:urgencyColor(u), fontWeight:700 }}>{daysUntil(d.date)}</span>
                    <span style={{ fontSize:11, color:C.muted }}>{new Date(d.date).toLocaleDateString()}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Notes */}
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Notes</div>
            {editing ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <textarea value={noteVal} onChange={e=>setNoteVal(e.target.value)} rows={3} style={{ fontSize:13 }} autoFocus />
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={()=>{onUpdate(c.id,{notes:noteVal});setEditing(false)}} className="btn btn-primary" style={{ fontSize:12, padding:'6px 14px' }}>Save</button>
                  <button onClick={()=>{setNoteVal(c.notes||'');setEditing(false)}} className="btn" style={{ fontSize:12, padding:'6px 14px', background:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div onClick={()=>setEditing(true)} style={{ fontSize:13, color:c.notes?C.text:C.muted, padding:'8px 10px', background:C.surface, borderRadius:6, border:`1px solid ${C.border}`, cursor:'text', lineHeight:1.6, minHeight:36 }}>
                {c.notes || 'Click to add notes, reference numbers, contact info…'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function DeadlineCalendar({ deadlines, cases }) {
  const sorted = [...deadlines].sort((a,b) => new Date(a.date)-new Date(b.date))
  const upcoming = sorted.filter(d => {
    const u = deadlineUrgency(d.date)
    return u !== 'none'
  }).slice(0,8)

  if (upcoming.length === 0) return (
    <div style={{ textAlign:'center', padding:'24px 16px', color:C.muted, fontSize:13 }}>
      <div style={{ fontSize:32, marginBottom:8 }}>📅</div>
      No upcoming deadlines
    </div>
  )

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {upcoming.map(d => {
        const u = deadlineUrgency(d.date)
        const relCase = cases.find(c => c.id === d.caseId)
        return (
          <div key={d.id} style={{ display:'flex', gap:10, alignItems:'center', padding:'10px 12px', borderRadius:8, background:`${urgencyColor(u)}10`, border:`1px solid ${urgencyColor(u)}33` }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:urgencyColor(u), flexShrink:0 }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{d.label}</div>
              {relCase && <div style={{ fontSize:11, color:C.muted }}>{relCase.title}</div>}
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:urgencyColor(u), flexShrink:0 }}>{daysUntil(d.date)}</div>
          </div>
        )
      })}
    </div>
  )
}

function CaseTracker() {
  const { cases, deadlines, addCase, updateCase, deleteCase, addDeadline, deleteDeadline, toggleStep, urgentCount } = useCaseStore()
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState('active')
  const [catFilter, setCatFilter] = useState('all')
  const [sortBy, setSortBy] = useState('updated')
  const [search, setSearch] = useState('')

  const handleAdd = (data) => {
    const newCase = addCase(data)
    // Add case-linked deadlines
    if (data.deadlines?.length > 0) {
      data.deadlines.forEach(d => addDeadline({ ...d, caseId: newCase.id }))
    }
    showToast(`Case "${data.title}" created`, 'success')
  }

  let filtered = cases
    .filter(c => filter === 'all' ? true : filter === 'active' ? ['active','urgent','pending'].includes(c.status) : c.status === filter)
    .filter(c => catFilter === 'all' || c.category === catFilter)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.notes?.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b) => sortBy === 'updated' ? new Date(b.updatedAt)-new Date(a.updatedAt) : sortBy === 'created' ? new Date(b.createdAt)-new Date(a.createdAt) : a.title.localeCompare(b.title))

  const statCounts = {
    active: cases.filter(c=>['active','urgent','pending'].includes(c.status)).length,
    completed: cases.filter(c=>c.status==='completed').length,
    overdue: deadlines.filter(d=>deadlineUrgency(d.date)==='overdue').length,
  }

  // Sample starter cases for empty state
  const addSampleCase = () => {
    const sample = addCase({ title:'SNAP Application', category:'benefits', status:'active', notes:'Need to gather: ID, proof of income, utility bills', steps:[{text:'Gather documents: ID, proof of income, utility bills'},{text:'Apply at abe.illinois.gov or local IDHS office'},{text:'Complete phone interview (within 30 days of applying)'},{text:'Receive decision letter (allow 30 days)'},{text:'Set up EBT card if approved'}] })
    addDeadline({ caseId: sample.id, label:'Initial application deadline', date: new Date(Date.now() + 14*86400000).toISOString().split('T')[0] })
    showToast('Sample case added!', 'success')
  }

  return (
    <div className="page">
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:11, fontWeight:700, color:C.primary, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>Case Tracker</div>
          <h1 style={{ color:C.heading, fontSize:28, fontWeight:800, marginBottom:4 }}>My Cases</h1>
          <p style={{ color:C.muted, fontSize:14 }}>Track applications, deadlines, and next steps — all in one place.</p>
        </div>
        <button onClick={()=>setShowAdd(true)} className="btn btn-primary" style={{ flexShrink:0 }}>+ New Case</button>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:24 }}>
        {[
          { label:'Active Cases', val:statCounts.active, color:C.primary, icon:'📋' },
          { label:'Completed', val:statCounts.completed, color:C.success, icon:'✅' },
          { label:'Overdue', val:statCounts.overdue, color:C.danger, icon:'🚨' },
          { label:'Total Deadlines', val:deadlines.length, color:C.warn, icon:'⏰' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding:'14px 18px', display:'flex', gap:12, alignItems:'center', borderLeft:`3px solid ${s.color}` }}>
            <span style={{ fontSize:22 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize:22, fontWeight:800, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:12, color:C.muted }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', gap:20, alignItems:'start' }}>
        {/* Cases list */}
        <div>
          {/* Filters */}
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ position:'relative', flex:1, minWidth:200 }}>
              <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.muted, fontSize:14 }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search cases…" style={{ paddingLeft:36 }} />
            </div>
            <div style={{ display:'flex', gap:4 }}>
              {[['active','Active'],['completed','Done'],['all','All']].map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)} style={{ padding:'6px 12px', borderRadius:6, border:`1px solid ${filter===v?C.primary:C.border}`, background:filter===v?`${C.primary}20`:C.surface, color:filter===v?C.primary:C.muted, cursor:'pointer', fontSize:12, fontWeight:700 }}>{l}</button>
              ))}
            </div>
            <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ padding:'6px 10px', borderRadius:6, fontSize:12, width:'auto' }}>
              <option value="all">All Categories</option>
              {Object.entries(CASE_CATEGORIES).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
          </div>

          {/* Empty state */}
          {cases.length === 0 && (
            <div className="card fade-in" style={{ textAlign:'center', padding:48 }}>
              <div style={{ fontSize:56, marginBottom:16 }}>📋</div>
              <h2 style={{ color:C.heading, fontSize:20, fontWeight:800, marginBottom:8 }}>No cases yet</h2>
              <p style={{ color:C.muted, marginBottom:24, lineHeight:1.6, maxWidth:360, margin:'0 auto 24px' }}>
                Create a case to track any government process — benefits applications, legal matters, business filings, and more.
              </p>
              <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
                <button onClick={()=>setShowAdd(true)} className="btn btn-primary">+ Create First Case</button>
                <button onClick={addSampleCase} className="btn" style={{ background:C.surface, border:`1px solid ${C.border}`, color:C.text }}>Try Sample Case</button>
              </div>
            </div>
          )}

          {cases.length > 0 && filtered.length === 0 && (
            <div className="card" style={{ textAlign:'center', padding:32, color:C.muted }}>
              No cases match your filters.
              <button onClick={()=>{setFilter('all');setCatFilter('all');setSearch('')}} style={{ display:'block', margin:'12px auto 0', background:'none', border:'none', color:C.primary, cursor:'pointer', fontSize:13 }}>Clear filters</button>
            </div>
          )}

          {filtered.map(c => (
            <CaseCard key={c.id} c={c} deadlines={deadlines} onUpdate={updateCase} onDelete={id=>{deleteCase(id);showToast('Case deleted','success')}} onToggleStep={toggleStep} />
          ))}
        </div>

        {/* Sidebar — Deadlines calendar */}
        <div style={{ position:'sticky', top:20, display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card" style={{ padding:'16px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:12 }}>Upcoming Deadlines</div>
            <DeadlineCalendar deadlines={deadlines} cases={cases} />
          </div>

          <div className="card" style={{ padding:'16px', background:`${C.primary}06` }}>
            <div style={{ fontSize:13, fontWeight:700, color:C.heading, marginBottom:8 }}>💡 Quick Add</div>
            <p style={{ fontSize:12, color:C.muted, marginBottom:12, lineHeight:1.6 }}>CLARA can create cases automatically after a conversation. Visit <strong>Ask CLARA</strong> and describe your situation.</p>
            <a href="/ai-assistant" className="btn btn-primary" style={{ display:'block', textAlign:'center', fontSize:13, padding:'8px 14px' }}>🤖 Ask CLARA</a>
          </div>

          <div className="card" style={{ padding:'16px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>Common Case Types</div>
            {[
              ['🍎','SNAP Application','benefits'],
              ['🏠','Eviction Response','housing'],
              ['💊','Medicaid Enrollment','healthcare'],
              ['⚖️','Expungement','legal'],
              ['🏢','LLC Formation','business'],
            ].map(([icon,title,cat]) => (
              <button key={title} onClick={()=>{ setShowAdd(true) }} style={{ display:'flex', alignItems:'center', gap:8, width:'100%', background:'none', border:'none', color:C.text, cursor:'pointer', padding:'6px 4px', fontSize:12, textAlign:'left', borderBottom:`1px solid ${C.border}` }}>
                <span>{icon}</span><span style={{ flex:1 }}>{title}</span><span style={{ color:C.muted }}>›</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showAdd && <AddCaseModal onClose={()=>setShowAdd(false)} onAdd={handleAdd} />}
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
          <Route path="/cases" element={<CaseTracker />} />
          <Route path="/notifications" element={<CaseTracker />} />
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

// CLARA AI — Netlify serverless function
// Uses OpenRouter free tier models (dev-only, key never exposed to client)
// Model: meta-llama/llama-3.1-8b-instruct:free (fast, free, capable)

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY
const MODEL = 'meta-llama/llama-3.3-70b-instruct:free'
const FALLBACK_MODEL = 'meta-llama/llama-3.1-8b-instruct:free'

const SYSTEM_PROMPT = `You are CLARA (Civic Legal Assistance & Resource Advisor), an AI assistant built into the CLEAR Platform — a government process navigation tool serving Illinois residents, especially people who are low-income, recently incarcerated, navigating disability, facing eviction, immigrants, seniors, and veterans.

YOUR MISSION: Give clear, actionable, accurate guidance on government processes, benefits, legal rights, and civic navigation. You are the trusted guide that makes complex systems understandable.

YOUR KNOWLEDGE BASE covers 90 detailed guides across 18 categories:
- Benefits: SNAP, Medicaid, SSI/SSDI, TANF, WIC, Medicare Extra Help, Child Tax Credit, Survivors Benefits, Weatherization
- Healthcare: ACA/Marketplace, Medicaid, Medicare A/B/D, CHIP, telehealth, substance use treatment (MAT), mental health parity
- Housing: Section 8 vouchers, public housing, rental assistance (ILRPP), renters rights, first-time homebuyer (IHDA), emergency rental assistance
- Business: LLC formation, EIN, business licenses, trademarks, hiring first employee, crowdfunding, CDFIs
- Taxes: Free filing (VITA), IRS payment plans, EITC, self-employment tax, property tax exemptions
- Education: FAFSA, Pell Grant, student loans (IDR/PSLF/SAVE plan), GED/HiSET, work-study
- Immigration: Green card, naturalization, DACA, asylum (I-589), work visas (H-1B/OPT), U-visa/T-visa, immigration court
- Veterans: VA disability claims, GI Bill, VR&E, VA healthcare
- Disability: SSDI/SSI, ADA accommodations, IEP/504 plans, guardianship alternatives (SDM)
- Justice: Expungement, small claims court, landlord-tenant mediation, immigration court
- Reentry: Post-incarceration benefits, IDs, housing, employment, collateral consequences, FOID, voting rights
- Seniors: Medicare, Social Security, reverse mortgage (HECM), Meals on Wheels, senior transportation
- Consumer: Credit report disputes (FCRA), debt collection (FDCPA), credit building, identity theft, bankruptcy
- Employment: FMLA, wage theft, OSHA, workers comp (IWCC), unemployment appeals
- Mental Health: Affordable care, 988 crisis line, insurance parity, workplace accommodations
- Legal: Power of attorney, advance directives, wills & estate planning
- Childcare: CCAP subsidies, Head Start, foster care, adoption
- Transportation: RTA services, paratransit

ILLINOIS-SPECIFIC KNOWLEDGE:
- ABE portal (abe.illinois.gov) for SNAP, Medicaid, TANF applications
- IDHS helpline: 1-800-843-6154
- Illinois Legal Aid Online: illinoislegalaid.org (free legal help)
- IHDA (Illinois Housing Development Authority): ihda.org for homebuyer programs
- IWCC for workers comp: iwcc.il.gov
- IDES for unemployment: ides.illinois.gov
- Cook County Circuit Court for Chicago-area legal matters
- Illinois Secretary of State for LLC filing: ilsos.gov (Articles of Organization: $150)
- DCFS for child welfare: dcfs.illinois.gov
- Illinois AG Consumer Protection: illinoisattorneygeneral.gov

RESPONSE STYLE:
- Be warm, direct, and plain-language. Avoid jargon unless you immediately explain it.
- Structure responses with clear steps when giving guidance. Use numbered lists for processes.
- Always include the most important phone number or website when relevant.
- If someone seems to be in crisis (eviction tonight, benefit cutoff, no food), prioritize immediate action steps first.
- Acknowledge that government systems are genuinely hard and frustrating — validate before advising.
- When you're not certain about something, say so and point to where they can verify.
- Keep responses concise but complete. Most answers should be 150-300 words.
- End with a specific follow-up offer: "Want me to walk through [specific next step]?" or "Should I generate a checklist for this?"

WHAT YOU CAN GENERATE:
- Personalized checklists (list required documents, steps, deadlines)
- Eligibility estimates based on what the user tells you
- Plain-English explanations of forms, legal terms, government letters
- Action plans for complex multi-step processes
- Spanish responses if the user writes in Spanish

WHAT YOU DON'T DO:
- Give legal advice (point to Illinois Legal Aid Online or suggest consulting an attorney)
- Give medical advice (suggest consulting a doctor or calling 988 for mental health crisis)
- Make definitive eligibility determinations (you can estimate but always say to verify)
- Discuss things outside your mission (you're focused on civic/government navigation)

If someone is in immediate crisis: housing emergency → 211 | mental health → 988 | food emergency → SNAP/food bank | domestic violence → 1-877-863-6338 (IL DV hotline)`

export default async (req) => {
  // CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers })
  }

  const { messages, articleContext } = body

  if (!messages || !Array.isArray(messages)) {
    return new Response(JSON.stringify({ error: 'messages array required' }), { status: 400, headers })
  }

  // Build system message — optionally inject article context
  let systemContent = SYSTEM_PROMPT
  if (articleContext) {
    systemContent += `\n\nCURRENT ARTICLE CONTEXT: The user is viewing the article "${articleContext.title}" (category: ${articleContext.category}). Their question likely relates to this topic. Article summary: ${articleContext.summary}. Key steps covered: ${articleContext.steps?.slice(0, 3).join(' | ')}`
  }

  const openRouterMessages = [
    { role: 'system', content: systemContent },
    ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
  ]

  // Try primary model, fall back if needed
  const tryModel = async (model) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://clear-platform.netlify.app',
        'X-Title': 'CLEAR Platform - CLARA AI',
      },
      body: JSON.stringify({
        model,
        messages: openRouterMessages,
        max_tokens: 600,
        temperature: 0.4,
        top_p: 0.9,
      })
    })
    return res
  }

  try {
    let res = await tryModel(MODEL)
    
    // Fallback to smaller model if rate limited or unavailable
    if (!res.ok && (res.status === 429 || res.status === 503)) {
      res = await tryModel(FALLBACK_MODEL)
    }

    if (!res.ok) {
      const errText = await res.text()
      console.error('OpenRouter error:', res.status, errText)
      return new Response(JSON.stringify({ 
        error: 'AI service temporarily unavailable',
        fallback: true,
        reply: "I'm having trouble connecting right now. For immediate help: call 211 for local resources, visit abe.illinois.gov for benefits, or call IDHS at 1-800-843-6154."
      }), { status: 200, headers })
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again."

    // Extract any article suggestions from the response
    const suggestedArticles = extractArticleSuggestions(reply, body.availableTopics || [])

    return new Response(JSON.stringify({ 
      reply,
      model: data.model || MODEL,
      suggestedArticles,
    }), { status: 200, headers })

  } catch (err) {
    console.error('CLARA function error:', err)
    return new Response(JSON.stringify({ 
      error: 'Internal error',
      fallback: true,
      reply: "Something went wrong on my end. For immediate help: 211 (local resources), 1-800-843-6154 (IDHS), or illinoislegalaid.org (free legal help)."
    }), { status: 200, headers })
  }
}

// Simple keyword matching to suggest relevant KB articles
function extractArticleSuggestions(replyText, availableTopics) {
  const lower = replyText.toLowerCase()
  const suggestions = []
  const topicMap = {
    'snap': 'SNAP Food Assistance',
    'food stamp': 'SNAP Food Assistance', 
    'medicaid': 'Medicaid',
    'medicare': 'Medicare',
    'disability': 'SSDI/SSI Disability',
    'ssdi': 'SSDI/SSI Disability',
    'ssi': 'SSDI/SSI Disability',
    'unemployment': 'Unemployment Insurance',
    'eviction': 'Emergency Rental Assistance',
    'rent': 'Emergency Rental Assistance',
    'housing': 'Section 8 Vouchers',
    'llc': 'Starting an LLC',
    'business': 'Starting an LLC',
    'eitc': 'Earned Income Tax Credit',
    'tax': 'Free Tax Filing (VITA)',
    'fafsa': 'FAFSA & Student Aid',
    'student loan': 'Student Loan Repayment',
    'green card': 'Green Card (LPR)',
    'asylum': 'Asylum Application',
    'veterans': 'VA Disability Claims',
    'expungement': 'Expungement',
    'credit': 'Credit Report Disputes',
    'bankruptcy': 'Bankruptcy',
  }
  for (const [keyword, topic] of Object.entries(topicMap)) {
    if (lower.includes(keyword) && !suggestions.includes(topic)) {
      suggestions.push(topic)
      if (suggestions.length >= 3) break
    }
  }
  return suggestions
}

export const config = { path: '/api/clara' }

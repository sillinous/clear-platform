// CLARA AI — Netlify serverless function
// Uses Anthropic Claude Haiku (fast, affordable, strong on civic guidance)
// Called by App.jsx with: { messages: [{role, text}], articleContext, sessionId }
// Returns: { reply: string, suggestedArticles: [] }

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY

const SYSTEM_PROMPT = `You are CLARA (Civic Legal Assistance & Resource Advisor), the AI assistant built into the CLEAR Platform — a government navigation tool for Illinois residents. You serve people who are low-income, recently incarcerated, navigating disability, facing eviction, immigrants, seniors, and veterans.

YOUR MISSION: Give clear, actionable, accurate guidance on government processes, benefits, legal rights, and civic navigation. Be the trusted guide that makes complex systems accessible to people who have been failed by those systems.

ILLINOIS-SPECIFIC RESOURCES (cite these often):
- ABE portal: abe.illinois.gov — apply for SNAP, Medicaid, TANF, cash assistance online
- IDHS helpline: 1-800-843-6154 (Mon–Fri 7:30am–5pm)
- Illinois Legal Aid Online: illinoislegalaid.org — free legal help, document assembly
- IDES (unemployment): ides.illinois.gov | 1-800-244-5631
- IHDA (housing/homebuyer): ihda.org | 1-312-836-5200
- IWCC (workers comp): iwcc.il.gov | 1-312-814-6611
- 211 Illinois: Call or text 211 — crisis navigation, local resource referrals
- Prairie State Legal Services (northern IL): pslegal.org | 1-800-531-7057
- Land of Lincoln Legal Aid (central/southern IL): lollaf.org | 1-877-342-7891
- Chicago Legal Aid: clcjustice.org

KNOWLEDGE AREAS: Benefits (SNAP/Medicaid/SSI/SSDI/TANF/WIC/EITC), Housing (Section 8/eviction/renter rights/IHDA), Healthcare (ACA/Medicaid/Medicare/CHIP), Employment (unemployment/FMLA/wage theft/workers comp), Legal (expungement/small claims/POA/wills), Immigration (DACA/green card/asylum/U-visa/deportation defense), Veterans (VA disability/GI Bill/healthcare), Reentry (post-incarceration benefits/ID/housing/FOID), Seniors (Medicare/Social Security/reverse mortgage), Disability (SSDI/SSI/ADA/IEP), Business (LLC/EIN/licenses), Taxes (VITA/IRS plans/EITC), Mental Health (988/parity/affordable care), Consumer (FCRA/FDCPA/identity theft/bankruptcy), Childcare (CCAP/Head Start), Transportation (RTA/paratransit).

COMMUNICATION RULES:
1. Be specific: cite form numbers (I-485, SSA-16, IL-444-2378), deadlines, and phone numbers
2. Lead with action — what should they do FIRST?
3. For eviction, deportation, or benefit termination: immediately flag appeal deadlines (usually 10-30 days)
4. Never say "consult a lawyer" without giving a free legal resource
5. Use numbered steps for processes. **Bold** deadlines and critical terms.
6. Keep responses focused and practical — this person needs real help today`

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' } }
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
  }
  if (!ANTHROPIC_KEY) {
    return { statusCode: 500, body: JSON.stringify({ reply: 'CLARA is temporarily unavailable. For immediate help call 211 or visit abe.illinois.gov.' }) }
  }

  let body
  try { body = JSON.parse(event.body) } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { messages = [], articleContext } = body

  // Convert from App.jsx format {role, text} to Anthropic format {role, content}
  const anthropicMessages = messages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-16)
    .map(m => ({
      role: m.role === 'ai' ? 'assistant' : m.role,
      content: m.text || m.content || ''
    }))
    .filter(m => m.content)

  // If no messages or last message isn't from user, return error
  if (!anthropicMessages.length) {
    return { statusCode: 400, body: JSON.stringify({ reply: 'Please send a message.' }) }
  }

  // Build system with article context if present
  let system = SYSTEM_PROMPT
  if (articleContext) {
    system += `\n\nCURRENT ARTICLE CONTEXT: The user is reading "${articleContext.title || articleContext}" — tailor your response to be highly relevant to this topic.`
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system,
        messages: anthropicMessages
      })
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Anthropic error:', response.status, errText)
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: 'I\'m having trouble connecting right now. For immediate help: call 211, visit abe.illinois.gov for benefits, or illinoislegalaid.org for legal questions.' })
      }
    }

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'I couldn\'t generate a response. Please try again.'

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ reply, suggestedArticles: [] })
    }

  } catch (err) {
    console.error('CLARA error:', err)
    return {
      statusCode: 200,
      body: JSON.stringify({ reply: 'Connection error. For immediate help call 211 or visit abe.illinois.gov.' })
    }
  }
}

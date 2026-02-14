// Netlify Function: Translation API
// Proxies requests to Anthropic API with server-side key

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export const handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { text, readingLevel = 'general', userApiKey } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Text is required' }),
      };
    }

    // Use user's key or fall back to server key
    const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'No API key configured',
          demo: true,
          translation: getDemoTranslation(text, readingLevel),
        }),
      };
    }

    const levelPrompts = {
      simple: 'a 5th grader',
      general: 'the general public',
      professional: 'business professionals',
    };

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: `You are a legal document translator. Translate the following legal text into plain language that ${levelPrompts[readingLevel]} can understand.

Also analyze the document and provide:
1. Document type (e.g., privacy policy, lease, terms of service, etc.)
2. Risk score from 1-10 (10 being highest risk to the reader)
3. List of specific concerns or red flags

Legal text to translate:
${text}

Respond in this exact JSON format:
{
  "translation": "your plain language translation here",
  "documentType": "the type of document",
  "riskScore": 5,
  "concerns": ["concern 1", "concern 2"]
}`,
        }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Try to parse as JSON, fall back to raw text
    let result;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch {
      result = {
        translation: content,
        documentType: 'Unknown',
        riskScore: 5,
        concerns: [],
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error('Translation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

// Demo translation for when no API key is available
function getDemoTranslation(text, level) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('privacy') || lowerText.includes('data')) {
    return {
      translation: level === 'simple'
        ? 'They can collect and share your personal information with other companies.'
        : 'This grants broad rights to collect, process, and share your personal data with third parties.',
      documentType: 'Privacy Policy',
      riskScore: 7,
      concerns: ['Broad data collection', 'Third-party sharing', 'Limited control over data'],
    };
  }
  
  if (lowerText.includes('waiver') || lowerText.includes('liability')) {
    return {
      translation: level === 'simple'
        ? 'You agree not to sue them if something goes wrong.'
        : 'This waives your right to legal recourse for potential damages or injuries.',
      documentType: 'Liability Waiver',
      riskScore: 8,
      concerns: ['Waives legal rights', 'Limits liability', 'Broad indemnification'],
    };
  }
  
  return {
    translation: level === 'simple'
      ? 'This legal document has rules you need to follow. Read carefully before agreeing.'
      : 'This establishes contractual obligations and terms. Review thoroughly before signing.',
    documentType: 'Legal Document',
    riskScore: 5,
    concerns: ['Review all terms carefully', 'Consider consulting a professional'],
  };
}

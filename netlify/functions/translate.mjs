// PlainSpeak AI Translation Function
// Netlify Serverless Function that calls Claude API for legal document translation

export default async (req, context) => {
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200 });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { text, level } = await req.json();

    if (!text || !level) {
      return new Response(JSON.stringify({ error: 'Missing required fields: text and level' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get API key from environment or request header
    const apiKey = Netlify.env.get('ANTHROPIC_API_KEY') || req.headers.get('x-api-key');

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'No API key provided. Set ANTHROPIC_API_KEY environment variable or pass X-API-Key header.' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Build the prompt based on reading level
    const levelDescriptions = {
      'simple': 'very simple language that a 5th grader (10-11 year old) could easily understand. Use short sentences, common words, and explain any necessary terms.',
      'general': 'clear, everyday language that any adult can understand. Avoid jargon and explain complex concepts simply.',
      'professional': 'professional but accessible business language. Maintain formality while ensuring clarity.',
      'legal-lite': 'simplified but legally accurate language. Preserve key legal terms but explain their meaning.'
    };

    const levelDesc = levelDescriptions[level] || levelDescriptions['general'];

    const systemPrompt = `You are PlainSpeak, an AI assistant that translates complex legal and bureaucratic language into plain, understandable English.

Your task is to translate the given legal/formal text into ${levelDesc}

Guidelines:
1. Preserve ALL important meaning, obligations, and rights
2. Highlight any concerning terms or unusual provisions
3. Break down complex sentences into shorter, clearer ones
4. Define any technical terms that must be kept
5. Identify action items or deadlines
6. Flag potential risks or warnings

Format your response as JSON with this exact structure:
{
  "translation": "Your plain language translation here",
  "keyPoints": ["Array of 3-5 most important points"],
  "watchOut": ["Array of concerning provisions or risks"],
  "actionItems": ["Any deadlines or required actions"],
  "originalComplexity": 7,
  "translatedComplexity": 3,
  "wordCount": {
    "original": 150,
    "translated": 100
  }
}

Respond ONLY with valid JSON, no markdown or other formatting.`;

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: `Please translate this legal/formal text to plain language:\n\n${text}`
          }
        ],
        system: systemPrompt
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'Translation API error', 
        details: response.status === 401 ? 'Invalid API key' : `API error ${response.status}`,
        message: errorText.substring(0, 200)
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    
    // Extract the text content
    const content = data.content?.[0]?.text;
    
    if (!content) {
      return new Response(JSON.stringify({ error: 'No content in API response' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse the JSON response
    let result;
    try {
      // Clean up potential markdown code blocks
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(cleanContent);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response from the text
      result = {
        translation: content,
        keyPoints: ['See translation above for details'],
        watchOut: ['Please review the full translation carefully'],
        actionItems: [],
        originalComplexity: 7,
        translatedComplexity: 4,
        wordCount: {
          original: text.split(/\s+/).length,
          translated: content.split(/\s+/).length
        }
      };
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Function error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: '/api/translate'
};

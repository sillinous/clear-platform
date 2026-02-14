// CLEAR PlainSpeak Browser Extension - Background Service Worker

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'clear-translate',
    title: 'Translate with PlainSpeak',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'clear-translate-simple',
    title: 'Translate (5th Grade)',
    parentId: 'clear-translate',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'clear-translate-general',
    title: 'Translate (General)',
    parentId: 'clear-translate',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'clear-translate-professional',
    title: 'Translate (Professional)',
    parentId: 'clear-translate',
    contexts: ['selection']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!info.menuItemId.startsWith('clear-translate')) return;
  
  const selectedText = info.selectionText;
  if (!selectedText) return;
  
  // Determine level from menu item
  let level = 'general';
  if (info.menuItemId === 'clear-translate-simple') level = 'simple';
  else if (info.menuItemId === 'clear-translate-professional') level = 'professional';
  
  // Get API key
  const result = await chrome.storage.sync.get(['anthropicApiKey']);
  const apiKey = result.anthropicApiKey;
  
  // Translate
  let translation;
  try {
    if (apiKey) {
      translation = await translateWithAPI(selectedText, level, apiKey);
    } else {
      translation = translateDemo(selectedText, level);
    }
    
    // Send to content script to show overlay
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_TRANSLATION',
      original: selectedText,
      translation: translation.text,
      riskScore: translation.riskScore,
      riskLevel: translation.riskLevel
    });
    
  } catch (err) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_ERROR',
      error: err.message
    });
  }
});

// API translation
async function translateWithAPI(text, level, apiKey) {
  const levelPrompts = {
    simple: 'a 5th grader',
    general: 'the general public',
    professional: 'business professionals'
  };
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Translate this legal text into plain language for ${levelPrompts[level]}. Be concise. Rate risk 1-10.

Text: ${text}

Format:
TRANSLATION: [translation]
RISK: [1-10]`
      }]
    })
  });
  
  if (!response.ok) {
    throw new Error('Translation failed');
  }
  
  const data = await response.json();
  const content = data.content[0].text;
  
  const translationMatch = content.match(/TRANSLATION:\s*([\s\S]*?)(?=RISK:|$)/i);
  const riskMatch = content.match(/RISK:\s*(\d+)/i);
  
  const riskScore = riskMatch ? parseInt(riskMatch[1]) : 5;
  let riskLevel = 'low';
  if (riskScore >= 7) riskLevel = 'high';
  else if (riskScore >= 4) riskLevel = 'moderate';
  
  return {
    text: translationMatch ? translationMatch[1].trim() : content,
    riskScore,
    riskLevel
  };
}

// Demo translation
function translateDemo(text, level) {
  const lowerText = text.toLowerCase();
  let translation = level === 'simple'
    ? 'This legal text has important rules. Read carefully.'
    : 'This establishes contractual terms. Review before agreeing.';
  let riskScore = 5;
  
  if (lowerText.includes('waiver') || lowerText.includes('liability')) {
    translation = 'This limits your ability to take legal action.';
    riskScore = 7;
  }
  
  return {
    text: translation,
    riskScore,
    riskLevel: riskScore >= 7 ? 'high' : riskScore >= 4 ? 'moderate' : 'low'
  };
}

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_API_KEY') {
    chrome.storage.sync.get(['anthropicApiKey']).then(result => {
      sendResponse({ apiKey: result.anthropicApiKey });
    });
    return true;
  }
});

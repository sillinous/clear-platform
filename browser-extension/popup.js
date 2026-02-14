// CLEAR PlainSpeak Browser Extension - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const inputText = document.getElementById('inputText');
  const translateBtn = document.getElementById('translateBtn');
  const outputSection = document.getElementById('outputSection');
  const outputText = document.getElementById('outputText');
  const copyBtn = document.getElementById('copyBtn');
  const errorMsg = document.getElementById('errorMsg');
  const riskBadge = document.getElementById('riskBadge');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const levelBtns = document.querySelectorAll('.level-btn');
  
  let selectedLevel = 'general';
  let apiKey = null;
  
  // Load API key from storage
  const loadApiKey = async () => {
    const result = await chrome.storage.sync.get(['anthropicApiKey']);
    apiKey = result.anthropicApiKey;
    updateStatus();
  };
  
  // Update connection status
  const updateStatus = () => {
    if (apiKey) {
      statusDot.classList.add('active');
      statusDot.classList.remove('inactive');
      statusText.textContent = 'AI Connected';
    } else {
      statusDot.classList.remove('active');
      statusDot.classList.add('inactive');
      statusText.textContent = 'Demo Mode';
    }
  };
  
  // Check for selected text from content script
  const checkSelectedText = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_SELECTION' });
        if (response?.selectedText) {
          inputText.value = response.selectedText;
        }
      }
    } catch (e) {
      // Content script might not be loaded
    }
  };
  
  // Level selector
  levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      levelBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedLevel = btn.dataset.level;
    });
  });
  
  // Translate function
  const translate = async () => {
    const text = inputText.value.trim();
    if (!text) return;
    
    // Show loading state
    translateBtn.classList.add('loading');
    translateBtn.querySelector('.btn-text').textContent = 'Translating...';
    translateBtn.querySelector('.spinner').classList.remove('hidden');
    translateBtn.disabled = true;
    errorMsg.classList.add('hidden');
    
    try {
      let result;
      
      if (apiKey) {
        // Use live API
        result = await translateWithAPI(text, selectedLevel);
      } else {
        // Demo mode
        result = await translateDemo(text, selectedLevel);
      }
      
      // Show output
      outputSection.classList.remove('hidden');
      outputText.classList.remove('empty');
      outputText.textContent = result.translation;
      
      // Show risk badge if available
      if (result.riskScore) {
        riskBadge.classList.remove('hidden');
        riskBadge.className = `risk-badge risk-${result.riskLevel}`;
        riskBadge.textContent = `Risk: ${result.riskScore}/10`;
      }
      
    } catch (err) {
      errorMsg.textContent = err.message || 'Translation failed. Please try again.';
      errorMsg.classList.remove('hidden');
    } finally {
      translateBtn.classList.remove('loading');
      translateBtn.querySelector('.btn-text').textContent = 'Translate';
      translateBtn.querySelector('.spinner').classList.add('hidden');
      translateBtn.disabled = false;
    }
  };
  
  // API translation
  const translateWithAPI = async (text, level) => {
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
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Translate this legal text into plain language that ${levelPrompts[level]} can understand. Be concise. Also rate the risk level 1-10 and identify the document type.

Text: ${text}

Respond in this exact format:
TRANSLATION: [your translation]
RISK: [1-10]
TYPE: [document type]`
        }]
      })
    });
    
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API request failed');
    }
    
    const data = await response.json();
    const content = data.content[0].text;
    
    // Parse response
    const translationMatch = content.match(/TRANSLATION:\s*([\s\S]*?)(?=RISK:|$)/i);
    const riskMatch = content.match(/RISK:\s*(\d+)/i);
    
    const riskScore = riskMatch ? parseInt(riskMatch[1]) : null;
    let riskLevel = 'low';
    if (riskScore >= 7) riskLevel = 'high';
    else if (riskScore >= 4) riskLevel = 'moderate';
    
    return {
      translation: translationMatch ? translationMatch[1].trim() : content,
      riskScore,
      riskLevel
    };
  };
  
  // Demo translation
  const translateDemo = async (text, level) => {
    await new Promise(r => setTimeout(r, 800));
    
    const lowerText = text.toLowerCase();
    let translation = '';
    let riskScore = 5;
    
    if (lowerText.includes('privacy') || lowerText.includes('data')) {
      translation = level === 'simple' 
        ? 'They can collect and share your personal information with other companies.'
        : 'This grants broad rights to collect and share your data with third parties.';
      riskScore = 7;
    } else if (lowerText.includes('waiver') || lowerText.includes('liability')) {
      translation = level === 'simple'
        ? 'You agree not to sue them if something goes wrong.'
        : 'This waives your right to legal recourse for potential harms.';
      riskScore = 8;
    } else if (lowerText.includes('arbitration')) {
      translation = level === 'simple'
        ? 'If there\'s a dispute, you can\'t go to court - you must use their private system.'
        : 'Disputes must be resolved through binding arbitration, not courts.';
      riskScore = 7;
    } else {
      translation = level === 'simple'
        ? 'This legal text creates rules you need to follow. Read carefully before agreeing.'
        : 'This establishes contractual obligations. Review key terms before signing.';
    }
    
    let riskLevel = 'low';
    if (riskScore >= 7) riskLevel = 'high';
    else if (riskScore >= 4) riskLevel = 'moderate';
    
    return { translation, riskScore, riskLevel };
  };
  
  // Copy to clipboard
  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(outputText.textContent);
    copyBtn.classList.add('copied');
    copyBtn.querySelector('span').textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.querySelector('span').textContent = 'Copy';
    }, 2000);
  });
  
  // Translate button
  translateBtn.addEventListener('click', translate);
  
  // Enter key to translate
  inputText.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      translate();
    }
  });
  
  // Initialize
  await loadApiKey();
  await checkSelectedText();
});

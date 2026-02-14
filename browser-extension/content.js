// CLEAR PlainSpeak Browser Extension - Content Script

// Store selected text
let lastSelectedText = '';

// Track selection
document.addEventListener('mouseup', () => {
  const selection = window.getSelection().toString().trim();
  if (selection.length > 10) {
    lastSelectedText = selection;
  }
});

// Handle messages from popup/background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTION') {
    sendResponse({ selectedText: lastSelectedText });
    return;
  }
  
  if (message.type === 'SHOW_TRANSLATION') {
    showTranslationOverlay(message);
    return;
  }
  
  if (message.type === 'SHOW_ERROR') {
    showErrorOverlay(message.error);
    return;
  }
});

// Create and show translation overlay
function showTranslationOverlay({ original, translation, riskScore, riskLevel }) {
  // Remove existing overlay
  removeOverlay();
  
  const overlay = document.createElement('div');
  overlay.id = 'clear-plainspeak-overlay';
  overlay.innerHTML = `
    <div class="clear-overlay-content">
      <div class="clear-overlay-header">
        <div class="clear-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 3v18M3 12h18"/>
          </svg>
        </div>
        <span>CLEAR PlainSpeak</span>
        <button class="clear-close-btn">&times;</button>
      </div>
      <div class="clear-overlay-body">
        <div class="clear-section">
          <div class="clear-label">Original</div>
          <div class="clear-original">${escapeHtml(original.substring(0, 200))}${original.length > 200 ? '...' : ''}</div>
        </div>
        <div class="clear-section">
          <div class="clear-label">Plain Language</div>
          <div class="clear-translation">${escapeHtml(translation)}</div>
        </div>
        ${riskScore ? `
          <div class="clear-risk clear-risk-${riskLevel}">
            Risk Score: ${riskScore}/10
          </div>
        ` : ''}
      </div>
      <div class="clear-overlay-footer">
        <button class="clear-copy-btn">Copy Translation</button>
        <a href="https://clear-platform.netlify.app/tools/plainspeak-ai" target="_blank">Full Analysis →</a>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Event listeners
  overlay.querySelector('.clear-close-btn').addEventListener('click', removeOverlay);
  overlay.querySelector('.clear-copy-btn').addEventListener('click', () => {
    navigator.clipboard.writeText(translation);
    const btn = overlay.querySelector('.clear-copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy Translation', 2000);
  });
  
  // Close on outside click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) removeOverlay();
  });
  
  // Close on escape
  document.addEventListener('keydown', handleEscape);
}

function showErrorOverlay(error) {
  removeOverlay();
  
  const overlay = document.createElement('div');
  overlay.id = 'clear-plainspeak-overlay';
  overlay.innerHTML = `
    <div class="clear-overlay-content clear-error">
      <div class="clear-overlay-header">
        <span>Translation Error</span>
        <button class="clear-close-btn">&times;</button>
      </div>
      <div class="clear-overlay-body">
        <p>${escapeHtml(error)}</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  overlay.querySelector('.clear-close-btn').addEventListener('click', removeOverlay);
}

function removeOverlay() {
  const existing = document.getElementById('clear-plainspeak-overlay');
  if (existing) existing.remove();
  document.removeEventListener('keydown', handleEscape);
}

function handleEscape(e) {
  if (e.key === 'Escape') removeOverlay();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

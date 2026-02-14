# CLEAR PlainSpeak Browser Extension

Translate legal jargon into plain language with one click.

## Features

- **Instant Translation**: Paste text or select it on any webpage
- **Context Menu**: Right-click selected text to translate
- **Risk Scoring**: See a 1-10 risk assessment for legal documents
- **Multiple Reading Levels**: 5th Grade, General, and Professional options
- **Works Everywhere**: Any webpage with legal text

## Installation

### Chrome / Edge / Brave

1. Download or clone this folder
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select this `browser-extension` folder

### Firefox

1. Go to `about:debugging`
2. Click "This Firefox"
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file

## Setup

1. Click the extension icon
2. Click "Settings" or go to extension options
3. Add your Anthropic API key (optional - works in demo mode without it)

### Getting an API Key

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account
3. Go to API Keys
4. Create a new key
5. Paste it in the extension settings

## Usage

### Method 1: Popup
1. Click the extension icon
2. Paste legal text into the input
3. Select reading level
4. Click "Translate"

### Method 2: Selection Auto-Fill
1. Select text on any webpage
2. Click the extension icon
3. Text is automatically filled
4. Click "Translate"

### Method 3: Right-Click Menu
1. Select text on any webpage
2. Right-click
3. Choose "Translate with PlainSpeak"
4. Select reading level
5. See translation overlay

## Privacy

- Your API key is stored locally in Chrome's sync storage
- Text is sent directly to Anthropic's API (if API key configured)
- No data is collected by CLEAR
- Demo mode uses local pattern matching only

## Support

For issues or feature requests:
- GitHub: https://github.com/sillinous/clear-platform
- Platform: https://clear-platform.netlify.app

## License

MIT License - Part of the CLEAR Platform

# CLEAR Platform - Netlify Deployment Guide

## Quick Deploy (2 minutes)

### Option A: Netlify Dashboard (Recommended)

1. **Go to Netlify**: https://app.netlify.com/projects/clear-platform
2. **Drag & Drop Deploy**: 
   - Extract `clear-platform-netlify.zip`
   - Drag the `dist` folder to the deploy area
3. **Set Environment Variable**:
   - Go to Site Configuration → Environment Variables
   - Add: `ANTHROPIC_API_KEY` = `your-key-here`
4. **Deploy Functions**:
   - Go to Functions tab
   - The function at `netlify/functions/translate.mjs` will auto-deploy on next build

### Option B: Netlify CLI

```bash
# Extract the package
unzip clear-platform-netlify.zip
cd clear-platform-netlify

# Install dependencies
npm install

# Deploy to production
npx netlify deploy --prod --dir=dist --functions=netlify/functions

# Or link to existing site first
npx netlify link --id 197d2f44-7c93-40fb-8489-8b60e9f1653d
npx netlify deploy --prod
```

### Option C: Git-based Deploy

```bash
# Initialize git and push to a repo
git init
git add .
git commit -m "CLEAR Platform v2"
git remote add origin https://github.com/YOUR_USERNAME/clear-platform.git
git push -u origin main

# Then in Netlify:
# 1. Import project from Git
# 2. Select the repository
# 3. Build settings auto-detected from netlify.toml
```

## Environment Variables Required

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Claude API key for PlainSpeak AI | Yes (for Live AI mode) |

Set in: Netlify Dashboard → Site Configuration → Environment Variables

## Live URLs

- **Site**: https://clear-platform.netlify.app
- **Dashboard**: https://app.netlify.com/projects/clear-platform

## Features

### Tools (All Functional)
- `/tools/processmap` - Interactive government process navigator (5 processes)
- `/tools/plainspeak-ai` - Claude-powered legal document translator
- `/tools/plainspeak` - Demo translator (no API needed)

### Pages
- `/` - Home
- `/about` - About CLEAR
- `/research` - Research methodology
- `/tools` - All tools
- `/legislation` - Model legislation
- `/education` - Educational resources
- `/coalition` - Join the coalition
- `/coalition/launch` - Partner materials
- `/pilot` - 3-state pilot launch kit
- `/post-labor` - Post-labor economics

## Serverless Function

The PlainSpeak AI translation is powered by a Netlify serverless function:

**Endpoint**: `/api/translate`

**Request**:
```json
POST /api/translate
{
  "text": "Legal document text here...",
  "level": "general" // Options: simple, general, professional, legal-lite
}
```

**Response**:
```json
{
  "translation": "Plain language version...",
  "keyPoints": ["Important point 1", "Important point 2"],
  "watchOut": ["Warning about this clause"],
  "actionItems": ["Deadline: March 15"],
  "originalComplexity": 8,
  "translatedComplexity": 3,
  "wordCount": { "original": 150, "translated": 80 }
}
```

## Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Visualization**: ReactFlow (process diagrams)
- **State**: Zustand (progress persistence)
- **Serverless**: Netlify Functions
- **AI**: Claude claude-sonnet-4-20250514 via Anthropic API

## Local Development

```bash
npm install
npm run dev        # Start dev server at localhost:5173
npm run build      # Build for production
```

For local function testing:
```bash
npx netlify dev    # Runs both frontend and functions locally
```

## Troubleshooting

### PlainSpeak AI shows "No API key" error
→ Set `ANTHROPIC_API_KEY` in Netlify environment variables

### Process progress not saving
→ Check browser localStorage is enabled

### Functions not deploying
→ Ensure `netlify/functions/translate.mjs` exists and redeploy

## Support

Site ID: `197d2f44-7c93-40fb-8489-8b60e9f1653d`
Team: Sirius Unbound (travisgray)

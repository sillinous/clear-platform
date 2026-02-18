# CLEAR Platform — GitHub + Netlify Auto-Deploy Setup

## One-Time Setup (run these commands on your machine)

### Step 1: Extract and enter the project
```bash
unzip clear-platform-v3-phases21-30.zip
cd clear-platform
```

### Step 2: Create GitHub repo and push
```bash
# If you have GitHub CLI installed:
gh repo create clear-platform --public --push --source .

# OR manually via GitHub API (replace YOUR_TOKEN):
curl -X POST https://api.github.com/user/repos \
  -H "Authorization: token YOUR_TOKEN" \
  -d '{"name":"clear-platform","description":"CLEAR Platform v3.0 — All 30 Phases","private":false}'

# Then push:
git remote add origin https://github.com/YOUR_USERNAME/clear-platform.git
git push -u origin main
```

### Step 3: Link Netlify to GitHub
1. Go to https://app.netlify.com/projects/clear-platform/settings/deploys
2. Click **Link site to Git**
3. Choose **GitHub** → authorize → select `clear-platform` repo
4. Build settings (auto-detected from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**

### Step 4: Done!
Every `git push` to `main` will auto-deploy to https://clear-platform.netlify.app

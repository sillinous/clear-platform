# CLEAR Platform

**Coalition for Legal & Administrative Reform**

Making law accessible • Preparing for the post-labor transition • Building economic agency for all

## Overview

CLEAR is a comprehensive platform for legal reform and post-labor economics education. It includes:

- **Research Tools**: Complexity Index and Economic Agency Dashboard
- **Citizen Tools**: PlainSpeak document translator
- **Model Legislation**: 5 ready-to-adapt legislative frameworks
- **Education**: 8-module curriculum for civic literacy
- **Coalition**: Infrastructure for movement building

## Tech Stack

- **React 18** - UI framework
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Styling
- **React Router 6** - Routing
- **Lucide React** - Icons
- **Recharts** - Charts
- **Framer Motion** - Animations

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or extract the project
cd clear-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` folder.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Deploy automatically

Or use Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Netlify

1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

Or drag and drop the `dist/` folder to Netlify.

### Traditional Hosting

1. Run `npm run build`
2. Upload contents of `dist/` folder to your web server
3. Configure server to serve `index.html` for all routes (SPA)

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Project Structure

```
clear-platform/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   └── UI.jsx
│   ├── pages/
│   │   ├── AboutPage.jsx
│   │   ├── CoalitionPage.jsx
│   │   ├── EducationPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LegislationPage.jsx
│   │   ├── PostLaborPage.jsx
│   │   ├── ResearchPage.jsx
│   │   └── ToolsPage.jsx
│   ├── tools/
│   │   └── PlainSpeak.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_API_URL=https://api.clear-coalition.org
VITE_ANALYTICS_ID=your-analytics-id
```

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:

```js
theme: {
  extend: {
    colors: {
      primary: '#3B82F6',  // Blue
      secondary: '#06B6D4', // Cyan
    }
  }
}
```

### Content

All content is directly in the page components. Edit the relevant file in `src/pages/` to update text, images, or structure.

## Features

### PlainSpeak Tool

AI-powered legal document translator. Currently uses demo translations. To integrate with a real LLM API:

1. Add your API endpoint to environment variables
2. Update `src/tools/PlainSpeak.jsx` to call the API
3. Handle authentication and rate limiting

### Coalition Sign-Up

The coalition form currently logs submissions to console. To integrate with a backend:

1. Create an API endpoint or use a service like Formspree
2. Update the form handler in `src/pages/CoalitionPage.jsx`

## Contributing

CLEAR is open source under MIT License. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Credits

- Post-Labor Economics framework by [David Shapiro](https://daveshap.substack.com)
- Icons by [Lucide](https://lucide.dev)
- Built with [Vite](https://vitejs.dev) and [React](https://react.dev)

## Contact

- Website: https://clear-coalition.org
- Email: contact@clear-coalition.org
- GitHub: https://github.com/clear-coalition

---

*Making law accessible. Preparing for the post-labor transition. Building economic agency for all.*
# Trigger rebuild Fri Feb 13 00:23:59 UTC 2026

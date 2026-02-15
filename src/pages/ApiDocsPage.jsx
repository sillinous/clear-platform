import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code, Copy, Check, ExternalLink, Key, Zap, Shield,
  FileText, Send, MessageCircle, ChevronRight, Terminal
} from 'lucide-react';

const endpoints = [
  {
    method: 'POST',
    path: '/api/translate',
    title: 'Translate Text',
    description: 'Translate legal text to plain language with risk scoring',
    request: {
      text: 'string (required) - The legal text to translate',
      readingLevel: 'string - "simple" | "general" | "professional"',
      userApiKey: 'string (optional) - Your Anthropic API key',
    },
    response: {
      translation: 'The plain language translation',
      documentType: 'Detected document type',
      riskScore: 'Risk score 1-10',
      concerns: 'Array of specific concerns',
    },
    example: `{
  "text": "Notwithstanding any provisions herein...",
  "readingLevel": "general"
}`,
    responseExample: `{
  "translation": "They can collect your data...",
  "documentType": "Privacy Policy",
  "riskScore": 7,
  "concerns": ["Broad data collection", "Third-party sharing"]
}`,
  },
  {
    method: 'GET',
    path: '/api/submissions',
    title: 'Get Submissions',
    description: 'Retrieve process submissions with optional filters',
    request: {
      status: 'string (optional) - "pending" | "approved" | "rejected"',
      state: 'string (optional) - State abbreviation',
      category: 'string (optional) - Process category',
      limit: 'number (optional) - Max results',
    },
    response: {
      submissions: 'Array of submission objects',
    },
    example: `GET /api/submissions?status=approved&state=CA&limit=10`,
    responseExample: `{
  "submissions": [
    {
      "id": "abc123",
      "process_name": "Business License",
      "state": "CA",
      "status": "approved",
      ...
    }
  ]
}`,
  },
  {
    method: 'POST',
    path: '/api/submissions',
    title: 'Create Submission',
    description: 'Submit a new process to the database',
    request: {
      process_name: 'string (required)',
      category: 'string (required)',
      state: 'string (required)',
      step_count: 'string',
      time_estimate: 'string',
      challenges: 'string',
      suggestions: 'string',
    },
    response: {
      submission: 'The created submission object',
    },
    example: `{
  "process_name": "Food Handler Permit",
  "category": "licensing",
  "state": "TX",
  "step_count": "4-7",
  "time_estimate": "Same day",
  "challenges": "Limited testing locations",
  "suggestions": "Add online testing option"
}`,
    responseExample: `{
  "submission": {
    "id": "new123",
    "status": "pending",
    "created_at": "2024-02-14T10:30:00Z",
    ...
  }
}`,
  },
  {
    method: 'POST',
    path: '/api/feedback',
    title: 'Submit Feedback',
    description: 'Submit bug reports, feature requests, or general feedback',
    request: {
      type: 'string (required) - "bug" | "feature" | "general"',
      message: 'string (required)',
      email: 'string (optional)',
      page: 'string (optional) - Page URL',
    },
    response: {
      success: 'boolean',
      message: 'Confirmation message',
    },
    example: `{
  "type": "feature",
  "message": "Would love multi-language support",
  "email": "user@example.com"
}`,
    responseExample: `{
  "success": true,
  "message": "Thank you for your feedback!"
}`,
  },
];

const CodeBlock = ({ code, language = 'json' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-slate-950 rounded-lg p-4 overflow-x-auto text-sm">
        <code className="text-slate-300">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-slate-400" />
        )}
      </button>
    </div>
  );
};

const MethodBadge = ({ method }) => {
  const colors = {
    GET: 'bg-green-500/20 text-green-400',
    POST: 'bg-blue-500/20 text-blue-400',
    PUT: 'bg-yellow-500/20 text-yellow-400',
    DELETE: 'bg-red-500/20 text-red-400',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${colors[method]}`}>
      {method}
    </span>
  );
};

export default function ApiDocsPage() {
  const [activeEndpoint, setActiveEndpoint] = useState(endpoints[0].path);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">API Documentation</h1>
              <p className="text-slate-400">Integrate CLEAR into your applications</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Start */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Start
          </h2>
          <p className="text-slate-400 mb-4">
            The CLEAR API is available at <code className="px-2 py-1 bg-slate-900 rounded text-emerald-400">https://clear-platform.netlify.app/api</code>
          </p>
          <CodeBlock code={`// Example: Translate legal text
const response = await fetch('https://clear-platform.netlify.app/api/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Your legal text here...',
    readingLevel: 'general'
  })
});

const data = await response.json();
console.log(data.translation);`} />
        </div>

        {/* Authentication */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            Authentication
          </h2>
          <p className="text-slate-400 mb-4">
            The API works in two modes:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h3 className="text-white font-medium mb-2">Demo Mode (No Key Required)</h3>
              <p className="text-slate-400 text-sm">
                Basic translations using pattern matching. Good for testing and simple use cases.
              </p>
            </div>
            <div className="bg-slate-900 rounded-lg p-4 border border-emerald-500/30">
              <h3 className="text-white font-medium mb-2">Full Mode (API Key)</h3>
              <p className="text-slate-400 text-sm">
                Pass your Anthropic API key in the request body for AI-powered translations.
              </p>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Endpoints</h3>
              <nav className="space-y-1">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.path}
                    onClick={() => setActiveEndpoint(endpoint.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeEndpoint === endpoint.path
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    <MethodBadge method={endpoint.method} />
                    <span className="text-sm truncate">{endpoint.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-8">
            {endpoints.map((endpoint) => (
              <motion.div
                key={endpoint.path}
                id={endpoint.path}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeEndpoint === endpoint.path ? 1 : 0.5 }}
                className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
              >
                {/* Endpoint Header */}
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <MethodBadge method={endpoint.method} />
                    <code className="text-white font-mono">{endpoint.path}</code>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{endpoint.title}</h3>
                  <p className="text-slate-400 mt-2">{endpoint.description}</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Request Parameters */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      {endpoint.method === 'GET' ? 'Query Parameters' : 'Request Body'}
                    </h4>
                    <div className="bg-slate-900 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <tbody>
                          {Object.entries(endpoint.request).map(([key, value]) => (
                            <tr key={key} className="border-b border-slate-800 last:border-0">
                              <td className="px-4 py-3 font-mono text-sm text-emerald-400">{key}</td>
                              <td className="px-4 py-3 text-sm text-slate-400">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Example Request */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Example Request
                    </h4>
                    <CodeBlock code={endpoint.example} />
                  </div>

                  {/* Example Response */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Example Response
                    </h4>
                    <CodeBlock code={endpoint.responseExample} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rate Limits */}
        <div className="mt-8 bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Rate Limits
          </h2>
          <p className="text-slate-300 mb-4">
            To ensure fair usage and platform stability, the following rate limits apply:
          </p>
          <ul className="space-y-2 text-slate-400">
            <li>• <strong className="text-white">Demo mode:</strong> 10 requests per minute</li>
            <li>• <strong className="text-white">With API key:</strong> 60 requests per minute</li>
            <li>• <strong className="text-white">Submissions:</strong> 5 per hour per IP</li>
          </ul>
        </div>

        {/* Support */}
        <div className="mt-8 bg-slate-800 rounded-xl border border-slate-700 p-6 text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Need Help?</h2>
          <p className="text-slate-400 mb-4">
            Check out our GitHub or submit feedback if you have questions.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://github.com/sillinous/clear-platform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
            >
              <Terminal className="w-4 h-4" />
              GitHub
              <ExternalLink className="w-4 h-4" />
            </a>
            <a
              href="/submit"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 rounded-lg text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Submit Feedback
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

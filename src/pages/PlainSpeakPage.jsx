import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, ArrowRight, RefreshCw, Copy, Check, Download,
  Sparkles, AlertCircle, ChevronDown, Settings, Loader2, Zap,
  BookOpen, Scale, GraduationCap, Users, Brain, MessageSquare
} from 'lucide-react';

// PlainSpeak - LLM-Powered Legal Document Translation
const PlainSpeakPage = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [readingLevel, setReadingLevel] = useState('general');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiMode, setApiMode] = useState('demo'); // 'demo' | 'live'
  const [apiKey, setApiKey] = useState('');
  const [stats, setStats] = useState(null);

  const readingLevels = [
    { id: 'simple', label: '5th Grade', description: 'Very simple language, short sentences', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'general', label: 'General Public', description: 'Clear language for everyday readers', icon: <Users className="w-4 h-4" /> },
    { id: 'professional', label: 'Professional', description: 'Business-appropriate plain language', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'legal-lite', label: 'Legal Lite', description: 'Simplified but legally accurate', icon: <Scale className="w-4 h-4" /> }
  ];

  const sampleDocuments = [
    {
      title: 'Privacy Policy Excerpt',
      text: `Notwithstanding any provisions herein to the contrary, the Company reserves the right, in its sole and absolute discretion, to collect, process, store, and disseminate any and all information, including but not limited to personally identifiable information, behavioral data, and metadata, for purposes including but not limited to service improvement, targeted advertising, and third-party data sharing, subject to applicable laws and regulations, which may vary by jurisdiction and are subject to change without notice.`
    },
    {
      title: 'Lease Agreement Clause',
      text: `The Lessee shall be liable for and shall indemnify, defend, and hold harmless the Lessor from and against any and all claims, actions, damages, liability, and expense, including but not limited to reasonable attorneys' fees, in connection with loss of life, personal injury, or damage to property arising from or out of any occurrence in, upon, or at the Premises, or the occupancy or use by the Lessee of the Premises or any part thereof.`
    },
    {
      title: 'Terms of Service',
      text: `By accessing or utilizing the Services provided herein, You (hereinafter "User") hereby acknowledge, affirm, and covenant that You have read, understood, and agree to be bound by these Terms and Conditions in their entirety, including any modifications, amendments, or supplements thereto that may be posted from time to time, without limitation or qualification, and that such agreement shall be binding upon User, User's heirs, successors, and assigns.`
    },
    {
      title: 'Insurance Waiver',
      text: `The undersigned hereby releases, waives, discharges, and covenants not to sue the Organization, its directors, officers, employees, and agents from any and all liability, claims, demands, actions, and causes of action whatsoever, arising out of or related to any loss, damage, or injury, including death, that may be sustained by the undersigned, or to any property belonging to the undersigned, while participating in such activity, while in, on, or upon the premises where the activity is being conducted, or while traveling to or from said premises.`
    }
  ];

  // Demo translations for when API is not configured
  const demoTranslations = {
    'simple': {
      prefix: "Here's what this means in simple words:\n\n",
      style: "Use very short sentences. Use common words a 5th grader would know."
    },
    'general': {
      prefix: "Here's what this means:\n\n",
      style: "Use clear, everyday language that most adults can understand."
    },
    'professional': {
      prefix: "Plain Language Summary:\n\n",
      style: "Use clear business language while maintaining professionalism."
    },
    'legal-lite': {
      prefix: "Simplified Legal Summary:\n\n",
      style: "Simplify the language while preserving legal accuracy and key terms."
    }
  };

  const translateWithLLM = async (text, level) => {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-Key': apiKey })
      },
      body: JSON.stringify({
        text,
        level
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Translation failed. Please check your API configuration.');
    }

    return await response.json();
  };

  const generateDemoTranslation = (text, level) => {
    // Simulate processing time
    return new Promise((resolve) => {
      setTimeout(() => {
        const levelConfig = demoTranslations[level];
        
        // Generate a simulated translation based on the input
        const wordCount = text.split(' ').length;
        const sentenceCount = text.split(/[.!?]+/).length;
        const avgWordsPerSentence = Math.round(wordCount / sentenceCount);
        
        let translation = '';
        
        if (text.toLowerCase().includes('privacy') || text.toLowerCase().includes('data')) {
          translation = level === 'simple' 
            ? "This company can collect your information. They can use it in many ways. They might share it with other companies. The rules might change, and they don't have to tell you first."
            : level === 'general'
            ? "The company reserves broad rights to collect and use your personal information, including sharing it with third parties for advertising purposes. These terms can change at any time, so it's worth checking back periodically."
            : level === 'professional'
            ? "This clause grants the organization extensive data collection and processing rights, including third-party sharing for marketing purposes. Users should note the unilateral amendment provision and jurisdiction-dependent applicability."
            : "The Company retains discretionary authority over personal data collection, processing, and third-party dissemination for service and advertising purposes, subject to variable jurisdictional requirements and unilateral modification rights.";
        } else if (text.toLowerCase().includes('lease') || text.toLowerCase().includes('lessee')) {
          translation = level === 'simple'
            ? "If something bad happens at the apartment (someone gets hurt or property is damaged), you have to pay for it. You also have to protect the landlord from any lawsuits."
            : level === 'general'
            ? "As a tenant, you're responsible for any injuries or property damage that occurs on the premises. If someone sues the landlord because of something that happened in your rental, you'll need to cover those costs, including legal fees."
            : level === 'professional'
            ? "This indemnification clause places liability for premises-related incidents on the tenant, including legal defense costs. Standard in commercial leases, but worth noting for residential contexts."
            : "Tenant assumes full liability for premises-related claims including personal injury and property damage, with indemnification obligations extending to legal defense costs.";
        } else if (text.toLowerCase().includes('terms') || text.toLowerCase().includes('service')) {
          translation = level === 'simple'
            ? "By using this, you agree to all the rules. The rules can change anytime. If the rules change, you still have to follow them."
            : level === 'general'
            ? "Using this service means you've agreed to these terms—all of them. The company can update these terms whenever they want, and continued use means you accept any changes."
            : level === 'professional'
            ? "Service utilization constitutes acceptance of current and future terms. Note the binding arbitration clause and automatic acceptance of amendments through continued use."
            : "User access constitutes comprehensive acceptance of terms including future modifications, with binding effect extending to successors and assigns.";
        } else if (text.toLowerCase().includes('release') || text.toLowerCase().includes('waiver')) {
          translation = level === 'simple'
            ? "You promise not to sue if you get hurt. This includes getting hurt at the place, during the activity, or even while traveling there. You can't blame the organization for anything bad that happens."
            : level === 'general'
            ? "By signing this, you give up your right to sue if you're injured during the activity—even if it's their fault. This covers injuries at the location, during participation, and while traveling to/from the event."
            : level === 'professional'
            ? "This is a comprehensive liability waiver covering all claims arising from participation, including negligence by the organization. Note that such waivers may not be enforceable in all jurisdictions or for gross negligence."
            : "Signatory releases all claims against organization including personal injury, property damage, and wrongful death, waiving rights to legal action regardless of fault or negligence.";
        } else {
          translation = level === 'simple'
            ? "This text has a lot of complicated words and long sentences. It makes promises and rules that might be hard to understand. The main idea is that someone has to do something or give up some rights."
            : level === 'general'
            ? "This is a formal legal document that outlines specific obligations and rights. The complex language is designed to be legally precise, but the core message involves duties, liabilities, or agreements between parties."
            : level === 'professional'
            ? "This document contains standard legal provisions establishing party obligations and liabilities. Key terms should be reviewed carefully, particularly any indemnification, limitation of liability, or modification clauses."
            : "Standard legal language establishing contractual obligations between parties, with typical provisions for liability, indemnification, and dispute resolution.";
        }
        
        const result = {
          translation: levelConfig.prefix + translation,
          keyPoints: [
            "Review any sections about your obligations carefully",
            "Note any provisions that limit your rights",
            "Check for automatic renewal or modification terms",
            "Consider seeking legal advice for significant agreements"
          ],
          watchOut: [
            "Broad liability waivers",
            "Unilateral modification rights",
            "Binding arbitration clauses",
            "Automatic consent provisions"
          ],
          originalComplexity: Math.min(10, Math.round(avgWordsPerSentence / 3) + 4),
          translatedComplexity: level === 'simple' ? 2 : level === 'general' ? 3 : level === 'professional' ? 4 : 5,
          wordCount: {
            original: wordCount,
            translated: translation.split(' ').length
          }
        };
        
        resolve(result);
      }, 1500);
    });
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setStats(null);
    
    try {
      let result;
      
      if (apiMode === 'live') {
        result = await translateWithLLM(inputText, readingLevel);
      } else {
        result = await generateDemoTranslation(inputText, readingLevel);
      }
      
      // Format the output
      let formatted = '';
      
      if (result.translation) {
        formatted = result.translation + '\n\n';
      }
      
      if (result.keyPoints && result.keyPoints.length > 0) {
        formatted += '**Key Points:**\n';
        result.keyPoints.forEach(point => {
          formatted += `• ${point}\n`;
        });
      }
      
      if (result.watchOut && result.watchOut.length > 0) {
        formatted += '\n**Watch Out For:**\n';
        result.watchOut.forEach(item => {
          formatted += `⚠️ ${item}\n`;
        });
      }
      
      if (result.actionItems && result.actionItems.length > 0) {
        formatted += '\n**Action Items:**\n';
        result.actionItems.forEach(item => {
          formatted += `→ ${item}\n`;
        });
      }
      
      if (result.originalComplexity && result.translatedComplexity) {
        formatted += `\n📊 Complexity: ${result.originalComplexity}/10 → ${result.translatedComplexity}/10`;
      }
      
      setTranslatedText(formatted);
      setStats(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plainspeak-translation.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = (sample) => {
    setInputText(sample.text);
    setTranslatedText('');
    setStats(null);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PlainSpeak</h1>
              <p className="text-slate-400">AI-powered legal language translation</p>
            </div>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl">
            Transform confusing legal jargon into clear, understandable language. 
            Powered by AI, designed for everyone.
          </p>
          
          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
            {showSettings ? 'Hide Settings' : 'API Settings'}
            <ChevronDown className={`w-4 h-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Mode</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setApiMode('demo')}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            apiMode === 'demo' 
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          Demo Mode
                        </button>
                        <button
                          onClick={() => setApiMode('live')}
                          className={`px-4 py-2 rounded-lg text-sm ${
                            apiMode === 'live' 
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          Live AI
                        </button>
                      </div>
                    </div>
                    {apiMode === 'live' && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-300 mb-2">API Key (Optional)</label>
                        <input
                          type="password"
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Uses server key if blank"
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400"
                        />
                      </div>
                    )}
                  </div>
                  {apiMode === 'demo' && (
                    <p className="mt-3 text-sm text-slate-400">
                      Demo mode uses pre-generated translations. Switch to Live AI for real Claude-powered translations.
                    </p>
                  )}
                  {apiMode === 'live' && (
                    <p className="mt-3 text-sm text-slate-400">
                      Live AI mode uses Claude to translate documents. Server API key is configured—leave the field blank to use it.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Reading Level Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Target Reading Level</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {readingLevels.map(level => (
              <button
                key={level.id}
                onClick={() => setReadingLevel(level.id)}
                className={`p-4 rounded-lg border text-left transition-colors ${
                  readingLevel === level.id
                    ? 'bg-purple-500/20 border-purple-500/50 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {level.icon}
                  <span className="font-medium">{level.label}</span>
                </div>
                <p className="text-xs text-slate-400">{level.description}</p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Sample Documents */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">Quick Start with Sample</label>
          <div className="flex flex-wrap gap-2">
            {sampleDocuments.map((sample, i) => (
              <button
                key={i}
                onClick={() => loadSample(sample)}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:border-purple-500/50 hover:text-purple-400 transition-colors"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* Main Translation Interface */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-medium text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                Original Text
              </h3>
              <span className="text-xs text-slate-400">
                {inputText.split(' ').filter(w => w).length} words
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your legal document, contract clause, terms of service, or any complex text here..."
              className="w-full h-80 p-4 bg-transparent text-slate-200 placeholder-slate-500 resize-none focus:outline-none"
            />
            <div className="px-4 py-3 border-t border-slate-700 flex items-center justify-between">
              <button
                onClick={() => setInputText('')}
                className="text-sm text-slate-400 hover:text-white"
              >
                Clear
              </button>
              <button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Translate
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Output */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-medium text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                Plain Language
              </h3>
              {translatedText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    title="Copy"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <div className="h-80 p-4 overflow-y-auto">
              {error ? (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400">Translation Error</p>
                    <p className="text-sm text-red-200 mt-1">{error}</p>
                  </div>
                </div>
              ) : translatedText ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  {translatedText.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <h4 key={i} className="text-white font-semibold mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
                    }
                    if (line.startsWith('•')) {
                      return <p key={i} className="text-slate-300 ml-2">{line}</p>;
                    }
                    if (line.startsWith('⚠️')) {
                      return <p key={i} className="text-amber-300 ml-2">{line}</p>;
                    }
                    if (line.startsWith('📊')) {
                      return <p key={i} className="text-purple-300 mt-4 font-mono text-sm">{line}</p>;
                    }
                    return line ? <p key={i} className="text-slate-200">{line}</p> : <br key={i} />;
                  })}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Translation will appear here</p>
                    <p className="text-sm mt-1">Paste text and click Translate</p>
                  </div>
                </div>
              )}
            </div>
            {stats && (
              <div className="px-4 py-3 border-t border-slate-700 flex items-center gap-4 text-xs text-slate-400">
                <span>Original: {stats.wordCount.original} words</span>
                <span>→</span>
                <span>Translated: {stats.wordCount.translated} words</span>
                <span className="ml-auto flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {apiMode === 'demo' ? 'Demo Mode' : 'Claude API'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mt-12 bg-slate-800/50 rounded-xl p-8 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-6">How PlainSpeak Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-medium text-white mb-2">1. Paste Legal Text</h3>
              <p className="text-sm text-slate-400">
                Contracts, terms of service, legal notices, government forms—any complex document
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-medium text-white mb-2">2. AI Analysis</h3>
              <p className="text-sm text-slate-400">
                Our AI breaks down complex language while preserving legal meaning
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-medium text-white mb-2">3. Get Plain Language</h3>
              <p className="text-sm text-slate-400">
                Receive clear explanations with key points and warnings highlighted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlainSpeakPage;

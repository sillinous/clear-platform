import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, ArrowRight, RefreshCw, Copy, Check, Download,
  Sparkles, AlertCircle, ChevronDown, Settings, Loader2, Zap,
  BookOpen, Scale, GraduationCap, Users, Brain, MessageSquare,
  Key, ExternalLink, FileUp, X, Clock, Shield, AlertTriangle,
  History, Trash2, Search, ChevronRight, Info
} from 'lucide-react';
import useUserSettings from '../store/useUserSettings';
import useTranslationHistory, { 
  classifyDocument, 
  calculateRiskScore, 
  DOCUMENT_TYPES,
  RISK_LEVELS 
} from '../store/useTranslationHistory';
import { parseFile, validateFile, getFileTypeInfo } from '../utils/fileParser';

const PlainSpeakPage = () => {
  const {
    anthropicApiKey,
    apiKeyStatus,
    preferredReadingLevel,
    incrementTranslations
  } = useUserSettings();

  const {
    history,
    addTranslation,
    deleteTranslation,
    clearHistory,
    getStats
  } = useTranslationHistory();

  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [readingLevel, setReadingLevel] = useState(preferredReadingLevel || 'general');
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiMode, setApiMode] = useState(anthropicApiKey ? 'live' : 'demo');
  const [stats, setStats] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isParsingFile, setIsParsingFile] = useState(false);
  const [documentType, setDocumentType] = useState(null);
  const [riskScore, setRiskScore] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  const readingLevels = [
    { id: 'simple', label: '5th Grade', description: 'Very simple language', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'general', label: 'General Public', description: 'Clear everyday language', icon: <Users className="w-4 h-4" /> },
    { id: 'professional', label: 'Professional', description: 'Business appropriate', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'legal-lite', label: 'Legal Lite', description: 'Simplified but accurate', icon: <Scale className="w-4 h-4" /> }
  ];

  const sampleDocuments = [
    { title: 'Privacy Policy', text: 'Notwithstanding any provisions herein to the contrary, the Company reserves the right, in its sole and absolute discretion, to collect, process, store, and disseminate any and all information, including but not limited to personally identifiable information, behavioral data, and metadata, for purposes including but not limited to service improvement, targeted advertising, and third-party data sharing.' },
    { title: 'Lease Agreement', text: 'The Lessee shall be liable for and shall indemnify, defend, and hold harmless the Lessor from and against any and all claims, actions, damages, liability, and expense, including but not limited to reasonable attorneys fees, in connection with loss of life, personal injury, or damage to property arising from or out of any occurrence in, upon, or at the Premises.' },
    { title: 'Terms of Service', text: 'By accessing or utilizing the Services provided herein, You hereby acknowledge, affirm, and covenant that You have read, understood, and agree to be bound by these Terms in their entirety, including binding arbitration and waiver of class action rights.' },
    { title: 'Liability Waiver', text: 'The undersigned hereby releases, waives, discharges, and covenants not to sue the Organization from any and all liability, claims, demands arising out of or related to any loss, damage, or injury, including death, regardless of whether caused by negligence.' }
  ];

  useEffect(() => {
    if (preferredReadingLevel) setReadingLevel(preferredReadingLevel);
  }, [preferredReadingLevel]);

  useEffect(() => {
    if (anthropicApiKey && apiKeyStatus === 'valid') setApiMode('live');
  }, [anthropicApiKey, apiKeyStatus]);

  useEffect(() => {
    if (inputText.length > 100) {
      const type = classifyDocument(inputText);
      setDocumentType(type);
      setRiskScore(calculateRiskScore(inputText, type));
    } else {
      setDocumentType(null);
      setRiskScore(null);
    }
  }, [inputText]);

  const handleFileSelect = async (file) => {
    const validation = validateFile(file);
    if (!validation.valid) { setError(validation.errors.join(' ')); return; }
    setIsParsingFile(true); setError(null); setUploadedFile(file);
    try {
      const result = await parseFile(file);
      setInputText(result.text);
    } catch (err) { setError(err.message); setUploadedFile(null); }
    setIsParsingFile(false);
  };

  const handleDrop = useCallback((e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]); }, []);
  const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);

  const clearFile = () => { setUploadedFile(null); setInputText(''); setTranslatedText(''); setDocumentType(null); setRiskScore(null); };

  const translateWithLLM = async (text, level) => {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(anthropicApiKey && { 'X-API-Key': anthropicApiKey }) },
      body: JSON.stringify({ text, level })
    });
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error || 'Translation failed');
    return response.json();
  };

  const generateDemoTranslation = async (text, level) => {
    await new Promise(r => setTimeout(r, 1500));
    const lowerText = text.toLowerCase();
    let translation = level === 'simple' ? 'This document has rules about what you can and cannot do. Read carefully.' : 'This document establishes obligations and liabilities. Review carefully.';
    if (lowerText.includes('privacy')) translation = level === 'simple' ? 'They can collect and share your data with others.' : 'Broad rights to collect and share personal data with third parties.';
    if (lowerText.includes('lease')) translation = level === 'simple' ? 'If something bad happens, you pay for it.' : 'Tenant assumes liability for premises-related incidents.';
    return { translation, keyPoints: ['Review your obligations', 'Note liability limitations'], watchOut: ['Liability waivers', 'Arbitration clauses'], originalComplexity: 8, translatedComplexity: level === 'simple' ? 2 : 4 };
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true); setError(null); setStats(null);
    try {
      const result = apiMode === 'live' ? await translateWithLLM(inputText, readingLevel) : await generateDemoTranslation(inputText, readingLevel);
      let formatted = result.translation + '\n\n**Key Points:**\n' + result.keyPoints.map(p => '• ' + p).join('\n') + '\n\n**Watch Out:**\n' + result.watchOut.map(w => '⚠️ ' + w).join('\n');
      setTranslatedText(formatted); setStats(result);
      addTranslation({ originalText: inputText.substring(0, 500), translatedText: formatted.substring(0, 500), readingLevel, documentType, riskScore, fileName: uploadedFile?.name, mode: apiMode });
      if (apiMode === 'live') incrementTranslations();
    } catch (err) { setError(err.message); }
    setIsLoading(false);
  };

  const handleCopy = () => { navigator.clipboard.writeText(translatedText); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const loadFromHistory = (entry) => { setInputText(entry.originalText); setTranslatedText(entry.translatedText); setReadingLevel(entry.readingLevel); setShowHistory(false); };

  const getRiskColor = (level) => ({ low: 'text-green-400 bg-green-500/20', moderate: 'text-yellow-400 bg-yellow-500/20', high: 'text-orange-400 bg-orange-500/20', critical: 'text-red-400 bg-red-500/20' }[level] || 'text-slate-400 bg-slate-500/20');

  const historyStats = getStats();

  return (
    <div className="min-h-screen bg-slate-900">
      <section className="bg-gradient-to-br from-purple-900/50 to-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">PlainSpeak AI</h1>
              <p className="text-slate-400">Upload PDF/DOCX • Auto-classify • Risk scoring • Translation history</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">
              <History className="w-4 h-4" /> History ({historyStats.total})
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">
              <Settings className="w-4 h-4" /> Settings
            </button>
            {anthropicApiKey && apiKeyStatus === 'valid' && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm"><Check className="w-4 h-4" /> AI Active</span>}
          </div>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700 flex flex-wrap gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Mode</label>
                    <div className="flex gap-2">
                      <button onClick={() => setApiMode('demo')} className={`px-4 py-2 rounded-lg text-sm ${apiMode === 'demo' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-300'}`}>Demo</button>
                      <button onClick={() => setApiMode('live')} disabled={!anthropicApiKey} className={`px-4 py-2 rounded-lg text-sm ${apiMode === 'live' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700 text-slate-300'} disabled:opacity-50`}>Live AI</button>
                    </div>
                  </div>
                  <Link to="/settings" className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm self-end"><Key className="w-4 h-4" />{anthropicApiKey ? 'Manage Key' : 'Add API Key'}</Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showHistory && history.length > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="mt-4 p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-2 max-h-64 overflow-y-auto">
                  {history.slice(0, 10).map(entry => (
                    <div key={entry.id} onClick={() => loadFromHistory(entry)} className="flex items-center gap-3 p-3 bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer">
                      <span className="text-xl">{DOCUMENT_TYPES[entry.documentType]?.icon || '📄'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{entry.originalText?.substring(0, 50)}...</p>
                        <p className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleDateString()}</p>
                      </div>
                      {entry.riskScore && <span className={`px-2 py-1 rounded text-xs ${getRiskColor(entry.riskScore.level)}`}>{entry.riskScore.score}/10</span>}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {(documentType || riskScore) && (
          <div className="mb-6 flex flex-wrap gap-4">
            {documentType && <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg"><span className="text-xl">{DOCUMENT_TYPES[documentType]?.icon}</span><span className="text-white">{DOCUMENT_TYPES[documentType]?.name}</span></div>}
            {riskScore && <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getRiskColor(riskScore.level)}`}><Shield className="w-5 h-5" /><span className="font-bold">{riskScore.score}/10 - {RISK_LEVELS[riskScore.level]?.label}</span></div>}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm text-slate-300 mb-3">Target Reading Level</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {readingLevels.map(level => (
              <button key={level.id} onClick={() => setReadingLevel(level.id)} className={`p-3 rounded-lg border text-left ${readingLevel === level.id ? 'bg-purple-500/20 border-purple-500/50 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                <div className="flex items-center gap-2 mb-1">{level.icon}<span className="font-medium">{level.label}</span></div>
                <p className="text-xs text-slate-400">{level.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-300">Original Document</label>
              {uploadedFile && <button onClick={clearFile} className="text-sm text-slate-400 hover:text-white flex items-center gap-1"><X className="w-4 h-4" />Clear</button>}
            </div>
            
            <div onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className={`border-2 border-dashed rounded-xl p-6 text-center ${isDragging ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700'}`}>
              {isParsingFile ? <div className="flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 text-purple-400 animate-spin" /><p className="text-slate-300">Parsing...</p></div>
              : uploadedFile ? <div className="flex items-center justify-center gap-3"><span className="text-2xl">{getFileTypeInfo(uploadedFile.name).icon}</span><span className="text-white">{uploadedFile.name}</span></div>
              : <>
                <FileUp className="w-8 h-8 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-300 mb-2">Drop PDF or DOCX here</p>
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg">Browse Files</button>
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" onChange={e => e.target.files[0] && handleFileSelect(e.target.files[0])} className="hidden" />
              </>}
            </div>
            
            <textarea value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Or paste legal text here..." className="w-full h-64 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:border-purple-500" />
            
            <div className="flex flex-wrap gap-2">
              {sampleDocuments.map(doc => <button key={doc.title} onClick={() => setInputText(doc.text)} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300">{doc.title}</button>)}
            </div>
            
            {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><p className="text-red-200">{error}</p></div>}
            
            <button onClick={handleTranslate} disabled={!inputText.trim() || isLoading} className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-50 rounded-xl font-semibold text-white flex items-center justify-center gap-2">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Translating...</> : <><Sparkles className="w-5 h-5" />Translate</>}
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-300">Plain Language Translation</label>
              {translatedText && <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300">{copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>}
            </div>
            
            {riskScore && translatedText && (
              <div className={`p-4 rounded-lg ${getRiskColor(riskScore.level)}`}>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5" />
                  <div>
                    <p className="font-medium mb-1">Risk Assessment: {riskScore.score}/10</p>
                    <p className="text-sm opacity-90">{riskScore.summary}</p>
                    {riskScore.risks?.slice(0, 5).map((r, i) => <div key={i} className="flex items-center gap-2 text-sm mt-1"><span className={`w-2 h-2 rounded-full ${r.severity === 'high' ? 'bg-red-400' : 'bg-amber-400'}`} />{r.description}</div>)}
                  </div>
                </div>
              </div>
            )}
            
            <div className="h-[400px] px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white overflow-y-auto whitespace-pre-wrap">
              {translatedText || <span className="text-slate-500">Translation appears here...</span>}
            </div>
            
            {stats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Complexity</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-400">{stats.originalComplexity}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="text-2xl font-bold text-green-400">{stats.translatedComplexity}</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Mode</p>
                  <p className="text-lg font-semibold text-white flex items-center gap-2">{apiMode === 'live' ? <><Zap className="w-5 h-5 text-purple-400" />Claude AI</> : <><Brain className="w-5 h-5 text-slate-400" />Demo</>}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlainSpeakPage;

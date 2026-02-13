import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Key, Eye, EyeOff, Check, X, AlertCircle, Loader2,
  Shield, Trash2, ExternalLink, Zap, BarChart3, Clock, RefreshCw,
  CreditCard, HelpCircle, Copy, CheckCircle
} from 'lucide-react';
import useUserSettings from '../store/useUserSettings';

const SettingsPage = () => {
  const [showKey, setShowKey] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [copied, setCopied] = useState(false);
  
  const {
    anthropicApiKey,
    apiKeyStatus,
    apiKeyLastValidated,
    preferredReadingLevel,
    translationsCount,
    lastTranslationAt,
    setAnthropicApiKey,
    validateApiKey,
    clearApiKey,
    setPreferredReadingLevel
  } = useUserSettings();

  const handleSaveKey = async () => {
    if (!inputKey.trim()) return;
    setAnthropicApiKey(inputKey.trim());
    await validateApiKey(inputKey.trim());
  };

  const handleValidateExisting = async () => {
    if (anthropicApiKey) {
      await validateApiKey(anthropicApiKey);
    }
  };

  const handleClearKey = () => {
    clearApiKey();
    setInputKey('');
  };

  const maskKey = (key) => {
    if (!key) return '';
    if (key.length < 20) return '•'.repeat(key.length);
    return key.substring(0, 10) + '•'.repeat(key.length - 18) + key.substring(key.length - 8);
  };

  const getStatusBadge = () => {
    switch (apiKeyStatus) {
      case 'valid':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" /> Valid
          </span>
        );
      case 'invalid':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
            <X className="w-4 h-4" /> Invalid
          </span>
        );
      case 'no_credits':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm">
            <CreditCard className="w-4 h-4" /> No Credits
          </span>
        );
      case 'checking':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Checking...
          </span>
        );
      case 'error':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
            <AlertCircle className="w-4 h-4" /> Error
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-500/20 text-slate-400 rounded-full text-sm">
            <Key className="w-4 h-4" /> Not Set
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-slate-400">Manage your API keys and preferences</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* API Key Management */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Anthropic API Key</h2>
            </div>
            {getStatusBadge()}
          </div>
          
          <div className="p-6 space-y-6">
            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400 mb-1">Your key stays private</h4>
                  <p className="text-sm text-blue-200/80">
                    Your API key is stored locally in your browser and sent directly to Anthropic. 
                    It never touches our servers or logs. You maintain full control.
                  </p>
                </div>
              </div>
            </div>

            {/* Current Key Display */}
            {anthropicApiKey && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-300">Current Key</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-900 rounded-lg px-4 py-3 font-mono text-sm text-slate-300 flex items-center justify-between">
                    <span>{showKey ? anthropicApiKey : maskKey(anthropicApiKey)}</span>
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 hover:bg-slate-700 rounded text-slate-400"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={handleValidateExisting}
                    disabled={apiKeyStatus === 'checking'}
                    className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
                    title="Re-validate key"
                  >
                    <RefreshCw className={`w-5 h-5 ${apiKeyStatus === 'checking' ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleClearKey}
                    className="p-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400"
                    title="Remove key"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {apiKeyLastValidated && (
                  <p className="text-xs text-slate-500">
                    Last validated: {new Date(apiKeyLastValidated).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Add/Update Key */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-300">
                {anthropicApiKey ? 'Update API Key' : 'Add Your API Key'}
              </label>
              <div className="flex gap-3">
                <input
                  type="password"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSaveKey}
                  disabled={!inputKey.trim() || apiKeyStatus === 'checking'}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-white flex items-center gap-2"
                >
                  {apiKeyStatus === 'checking' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  Save & Validate
                </button>
              </div>
            </div>

            {/* Status Messages */}
            {apiKeyStatus === 'invalid' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-400">Invalid API Key</h4>
                  <p className="text-sm text-red-200/80">
                    The API key could not be validated. Please check that it's correct and try again.
                  </p>
                </div>
              </div>
            )}

            {apiKeyStatus === 'no_credits' && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-400">No API Credits</h4>
                  <p className="text-sm text-amber-200/80 mb-2">
                    Your API key is valid but has no credits. Add credits to use PlainSpeak AI.
                  </p>
                  <a 
                    href="https://console.anthropic.com/settings/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 text-sm"
                  >
                    Add credits at Anthropic Console <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {apiKeyStatus === 'valid' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-400">API Key Active</h4>
                  <p className="text-sm text-green-200/80">
                    Your API key is valid and ready to use. PlainSpeak AI will use your key for translations.
                  </p>
                </div>
              </div>
            )}

            {/* Get API Key Help */}
            <div className="border-t border-slate-700 pt-6">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                How to get an API key
              </h4>
              <ol className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0">1</span>
                  <span>Go to <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">console.anthropic.com</a> and sign up or log in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0">2</span>
                  <span>Navigate to <strong>API Keys</strong> in the settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0">3</span>
                  <span>Click <strong>Create Key</strong> and copy it</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0">4</span>
                  <span>Add credits under <strong>Billing</strong> (pay-as-you-go, ~$0.003 per translation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-xs shrink-0">5</span>
                  <span>Paste your key above and click Save</span>
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Usage Statistics</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm">Total Translations</span>
                </div>
                <div className="text-3xl font-bold text-white">{translationsCount}</div>
              </div>
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Last Translation</span>
                </div>
                <div className="text-lg font-medium text-white">
                  {lastTranslationAt 
                    ? new Date(lastTranslationAt).toLocaleDateString()
                    : 'Never'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center gap-3">
            <Settings className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">Preferences</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Default Reading Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'simple', label: '5th Grade' },
                  { id: 'general', label: 'General Public' },
                  { id: 'professional', label: 'Professional' },
                  { id: 'legal-lite', label: 'Legal Lite' }
                ].map(level => (
                  <button
                    key={level.id}
                    onClick={() => setPreferredReadingLevel(level.id)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      preferredReadingLevel === level.id
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

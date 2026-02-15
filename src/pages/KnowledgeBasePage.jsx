import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, HelpCircle, ChevronDown, ChevronRight, Book, FileText,
  Zap, Shield, Users, Settings, ExternalLink, MessageCircle,
  Lightbulb, AlertCircle, CheckCircle, ArrowRight, Clock
} from 'lucide-react';

// FAQ categories and articles
const helpCategories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    icon: Zap,
    articles: [
      {
        id: 'what-is-clear',
        title: 'What is CLEAR?',
        content: `CLEAR (Coalition for Legal & Administrative Reform) is a platform designed to make government processes accessible to everyone. We provide:

• **PlainSpeak AI** - Translates legal jargon into plain language
• **ProcessMap** - Step-by-step guides for government processes  
• **Progress Tracker** - Track your process completion
• **Community Forum** - Connect with others navigating bureaucracy
• **State Requirements Database** - Compare requirements across states

Our mission is to reduce the complexity burden that costs Americans billions of hours and dollars each year.`,
      },
      {
        id: 'create-account',
        title: 'How do I create an account?',
        content: `Creating a CLEAR account is optional but recommended:

1. Click "Sign In" in the top right corner
2. Choose "Create Account" 
3. Enter your email and create a password
4. Verify your email address
5. Complete your profile (optional)

**Benefits of an account:**
• Save your progress across devices
• Track multiple processes
• Get personalized recommendations
• Participate in the community
• Earn achievements and points`,
      },
      {
        id: 'mobile-app',
        title: 'Is there a mobile app?',
        content: `Yes! CLEAR is available as:

• **Progressive Web App (PWA)** - Add to your home screen from any browser
• **iOS App** - Coming soon to the App Store
• **Android App** - Coming soon to Google Play

The PWA works offline and syncs when you're back online. To install:

1. Visit clear-platform.netlify.app on your phone
2. Tap the share icon (iOS) or menu (Android)
3. Select "Add to Home Screen"
4. Open from your home screen like any app`,
      },
    ],
  },
  {
    id: 'plainspeak',
    name: 'PlainSpeak AI',
    icon: FileText,
    articles: [
      {
        id: 'how-plainspeak-works',
        title: 'How does PlainSpeak work?',
        content: `PlainSpeak uses advanced AI to translate complex legal language into plain, understandable terms:

1. **Paste or upload** your document (PDF, DOCX, or text)
2. **Select reading level** (5th grade, general, or professional)
3. **Get instant translation** with:
   - Plain language explanation
   - Document type classification
   - Risk score (1-10)
   - Specific concerns highlighted

**Privacy:** Your documents are processed securely and never stored permanently. You can use your own API key for additional privacy.`,
      },
      {
        id: 'api-key-setup',
        title: 'How do I use my own API key?',
        content: `Using your own Anthropic API key gives you:
• Unlimited translations
• Faster response times
• Enhanced privacy

**Setup:**
1. Get an API key from console.anthropic.com
2. Go to Settings in CLEAR
3. Enter your API key in the PlainSpeak section
4. Click "Validate" to confirm it works

Your key is stored locally in your browser and never sent to our servers.`,
      },
      {
        id: 'supported-documents',
        title: 'What documents can I translate?',
        content: `PlainSpeak supports:

**File Types:**
• PDF files (up to 10MB)
• Word documents (.docx)
• Plain text (copy/paste)

**Document Types:**
• Privacy policies
• Terms of service
• Contracts and agreements
• Government forms
• Legal notices
• Insurance documents
• Medical consent forms
• Lease agreements

For best results, ensure text is selectable (not scanned images).`,
      },
    ],
  },
  {
    id: 'processmap',
    name: 'ProcessMap',
    icon: Book,
    articles: [
      {
        id: 'using-processmap',
        title: 'How do I use ProcessMap?',
        content: `ProcessMap provides step-by-step guides for common government processes:

1. Go to **Tools > ProcessMap**
2. Browse categories or search for a process
3. Select your state (requirements vary)
4. Follow the visual flowchart
5. Check off steps as you complete them

Each process includes:
• Time estimates
• Cost breakdown
• Required documents checklist
• Tips and warnings
• Links to official forms`,
      },
      {
        id: 'submit-process',
        title: 'How can I contribute a process?',
        content: `Help others by sharing your experience:

1. Go to **Tools > Submit a Process**
2. Fill out the 4-step wizard:
   - Basic info (name, state, category)
   - Steps you followed
   - Documents required
   - Pain points and tips
3. Submit for review

Approved submissions earn **100 points** toward achievements!`,
      },
    ],
  },
  {
    id: 'account',
    name: 'Account & Privacy',
    icon: Shield,
    articles: [
      {
        id: 'data-privacy',
        title: 'How is my data protected?',
        content: `Your privacy is our priority:

**What we store:**
• Account info (email, profile)
• Progress and achievements
• Community posts (public)

**What we DON'T store:**
• Documents you translate
• API keys (stored locally only)
• Sensitive personal info

**Security measures:**
• End-to-end encryption
• No third-party data sharing
• GDPR compliant
• Right to deletion

Delete your account anytime in Settings.`,
      },
      {
        id: 'delete-account',
        title: 'How do I delete my account?',
        content: `To permanently delete your account:

1. Go to **Settings > Account**
2. Scroll to "Danger Zone"
3. Click "Delete Account"
4. Confirm by typing "DELETE"
5. Your account and data will be removed within 24 hours

**Note:** Community posts may remain but will be anonymized. This action cannot be undone.`,
      },
    ],
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    icon: AlertCircle,
    articles: [
      {
        id: 'translation-error',
        title: 'Translation not working',
        content: `If translations fail:

**Check these first:**
1. Verify your internet connection
2. Make sure the document isn't too large (max 10MB)
3. Ensure text is selectable (not a scanned image)
4. Try a smaller section of text

**If using your own API key:**
1. Verify the key is correct in Settings
2. Check your Anthropic account has credits
3. Try removing and re-adding the key

**Still not working?** Use the Feedback button to report the issue.`,
      },
      {
        id: 'sync-issues',
        title: 'Progress not syncing',
        content: `If your progress isn't syncing:

1. **Check login status** - Ensure you're signed in
2. **Clear cache** - Settings > Clear Local Data
3. **Refresh** - Hard refresh (Ctrl+Shift+R)
4. **Check connection** - Offline mode queues changes

Progress is saved locally first, then synced. If offline, changes sync when connection returns.`,
      },
    ],
  },
];

const popularArticles = [
  { id: 'what-is-clear', category: 'getting-started', title: 'What is CLEAR?' },
  { id: 'how-plainspeak-works', category: 'plainspeak', title: 'How does PlainSpeak work?' },
  { id: 'api-key-setup', category: 'plainspeak', title: 'How do I use my own API key?' },
  { id: 'data-privacy', category: 'account', title: 'How is my data protected?' },
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);

  // Search across all articles
  const searchResults = searchQuery.trim() 
    ? helpCategories.flatMap(cat => 
        cat.articles.filter(article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(article => ({ ...article, categoryId: cat.id, categoryName: cat.name }))
      )
    : [];

  // Get current view
  const currentCategory = selectedCategory 
    ? helpCategories.find(c => c.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900/30 via-slate-900 to-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-teal-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
            <p className="text-xl text-slate-400 mb-8">
              Find answers to common questions about CLEAR
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-lg"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery.trim() && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-lg font-medium text-slate-400 mb-4">
            {searchResults.length} results for "{searchQuery}"
          </h2>
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((article) => (
                <button
                  key={article.id}
                  onClick={() => {
                    setSelectedCategory(article.categoryId);
                    setExpandedArticle(article.id);
                    setSearchQuery('');
                  }}
                  className="w-full bg-slate-800 rounded-xl border border-slate-700 p-4 text-left hover:border-teal-500/50 transition-colors"
                >
                  <h3 className="text-white font-medium">{article.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{article.categoryName}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400">No results found. Try different keywords.</p>
            </div>
          )}
        </section>
      )}

      {/* Main Content */}
      {!searchQuery.trim() && (
        <section className="max-w-6xl mx-auto px-4 py-8">
          {!selectedCategory ? (
            <>
              {/* Popular Articles */}
              <div className="mb-12">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Popular Articles
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {popularArticles.map((article) => {
                    const category = helpCategories.find(c => c.id === article.category);
                    return (
                      <button
                        key={article.id}
                        onClick={() => {
                          setSelectedCategory(article.category);
                          setExpandedArticle(article.id);
                        }}
                        className="flex items-center gap-4 bg-slate-800 rounded-xl border border-slate-700 p-4 text-left hover:border-teal-500/50 transition-colors"
                      >
                        <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center shrink-0">
                          <category.icon className="w-5 h-5 text-teal-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{article.title}</h3>
                          <p className="text-sm text-slate-500">{category.name}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-600 ml-auto" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories */}
              <h2 className="text-xl font-bold text-white mb-4">Browse by Topic</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {helpCategories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className="bg-slate-800 rounded-xl border border-slate-700 p-5 text-left hover:border-teal-500/50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4">
                      <category.icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{category.name}</h3>
                    <p className="text-sm text-slate-500">{category.articles.length} articles</p>
                  </motion.button>
                ))}
              </div>
            </>
          ) : (
            /* Category View */
            <div>
              <button
                onClick={() => { setSelectedCategory(null); setExpandedArticle(null); }}
                className="flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Help Center
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <currentCategory.icon className="w-7 h-7 text-teal-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{currentCategory.name}</h1>
                  <p className="text-slate-400">{currentCategory.articles.length} articles</p>
                </div>
              </div>

              <div className="space-y-4">
                {currentCategory.articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <h3 className="text-lg font-medium text-white">{article.title}</h3>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedArticle === article.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {expandedArticle === article.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 prose prose-invert prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-slate-300" dangerouslySetInnerHTML={{
                              __html: article.content
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/• /g, '<br/>• ')
                            }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Contact Support */}
      <section className="max-w-4xl mx-auto px-4 py-12 pb-20">
        <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center">
          <MessageCircle className="w-12 h-12 text-teal-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Still need help?</h2>
          <p className="text-slate-400 mb-6">
            Can't find what you're looking for? Reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/community"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl flex items-center gap-2"
            >
              Ask the Community
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="mailto:support@clear-platform.org"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl"
            >
              Email Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

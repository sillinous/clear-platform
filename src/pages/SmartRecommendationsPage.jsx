import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Sparkles, TrendingUp, Clock, DollarSign, MapPin,
  CheckCircle, ArrowRight, Lightbulb, Target, Users, Star,
  RefreshCw, ThumbsUp, ThumbsDown, ChevronRight, Zap, Award
} from 'lucide-react';

// Simulated ML model outputs - in production these would come from a real ML service
const generateRecommendations = (profile) => {
  const recommendations = [];
  
  // Life stage recommendations
  if (profile.lifeStage === 'new-homeowner') {
    recommendations.push({
      id: 'homestead',
      type: 'tax-savings',
      title: 'Apply for Homestead Exemption',
      description: 'Based on your recent home purchase, you may qualify for property tax savings of $500-2,000/year.',
      confidence: 0.94,
      impact: 'high',
      timeToComplete: '2-4 weeks',
      potentialSavings: '$500-2,000/year',
      deadline: 'Before March 1',
      relevanceScore: 98,
    });
    recommendations.push({
      id: 'voter-reg',
      type: 'civic',
      title: 'Update Voter Registration',
      description: 'Your address change requires updating your voter registration to participate in local elections.',
      confidence: 0.91,
      impact: 'medium',
      timeToComplete: '5 minutes',
      deadline: '30 days before election',
      relevanceScore: 85,
    });
  }
  
  if (profile.lifeStage === 'new-business') {
    recommendations.push({
      id: 'ein',
      type: 'business',
      title: 'Get Your EIN (Free)',
      description: 'An Employer Identification Number is required for hiring, banking, and taxes. Apply instantly online.',
      confidence: 0.99,
      impact: 'critical',
      timeToComplete: 'Same day',
      potentialSavings: 'Required',
      relevanceScore: 100,
    });
    recommendations.push({
      id: 'sales-tax',
      type: 'compliance',
      title: 'Register for Sales Tax Permit',
      description: 'If selling taxable goods in your state, you need a sales tax permit to collect and remit taxes.',
      confidence: 0.87,
      impact: 'high',
      timeToComplete: '1-2 weeks',
      deadline: 'Before first sale',
      relevanceScore: 92,
    });
  }
  
  if (profile.lifeStage === 'new-parent') {
    recommendations.push({
      id: 'ssn-baby',
      type: 'identity',
      title: 'Apply for Baby\'s SSN',
      description: 'Your newborn needs a Social Security Number for tax benefits and future identification.',
      confidence: 0.99,
      impact: 'critical',
      timeToComplete: '2-4 weeks',
      relevanceScore: 100,
    });
    recommendations.push({
      id: 'fmla',
      type: 'benefits',
      title: 'Understand FMLA Rights',
      description: 'You may be entitled to 12 weeks of unpaid, job-protected leave under federal law.',
      confidence: 0.85,
      impact: 'high',
      timeToComplete: 'Research: 30 min',
      relevanceScore: 88,
    });
  }
  
  // Default recommendations for everyone
  recommendations.push({
    id: 'license-renewal',
    type: 'reminder',
    title: 'Check License Expiration',
    description: 'Proactively check when your driver\'s license expires to avoid late fees and complications.',
    confidence: 0.75,
    impact: 'medium',
    timeToComplete: '5 minutes',
    relevanceScore: 70,
  });
  
  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

const lifeStages = [
  { id: 'new-homeowner', name: 'Just Bought a Home', icon: '🏠' },
  { id: 'new-business', name: 'Starting a Business', icon: '💼' },
  { id: 'new-parent', name: 'New Parent', icon: '👶' },
  { id: 'recently-married', name: 'Recently Married', icon: '💒' },
  { id: 'relocating', name: 'Moving to New State', icon: '📦' },
  { id: 'retiring', name: 'Approaching Retirement', icon: '🌴' },
];

const impactColors = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

export default function SmartRecommendationsPage() {
  const [selectedStages, setSelectedStages] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState({});
  const [state, setState] = useState('');

  const toggleStage = (stageId) => {
    setSelectedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(s => s !== stageId)
        : [...prev, stageId]
    );
  };

  const generateRecs = async () => {
    setIsGenerating(true);
    
    // Simulate ML processing time
    await new Promise(r => setTimeout(r, 1500));
    
    let allRecs = [];
    selectedStages.forEach(stage => {
      const recs = generateRecommendations({ lifeStage: stage, state });
      allRecs = [...allRecs, ...recs];
    });
    
    // Deduplicate and sort
    const unique = allRecs.reduce((acc, rec) => {
      if (!acc.find(r => r.id === rec.id)) acc.push(rec);
      return acc;
    }, []);
    
    setRecommendations(unique.sort((a, b) => b.relevanceScore - a.relevanceScore));
    setIsGenerating(false);
  };

  const handleFeedback = (recId, isHelpful) => {
    setFeedback(prev => ({ ...prev, [recId]: isHelpful }));
    // In production, this would send feedback to improve the ML model
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full text-violet-400 text-sm mb-6">
              <Brain className="w-4 h-4" />
              AI-Powered
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Smart Recommendations
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Tell us about your life situation, and our ML model will identify 
              government processes you might need—including ones you might not know about.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Life Stage Selection */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-white mb-4">What's happening in your life?</h2>
        <p className="text-slate-400 mb-6">Select all that apply</p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {lifeStages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => toggleStage(stage.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedStages.includes(stage.id)
                  ? 'bg-violet-500/20 border-violet-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <span className="text-2xl mb-2 block">{stage.icon}</span>
              <span className="font-medium">{stage.name}</span>
            </button>
          ))}
        </div>

        {/* State Selection */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-2">Your State (for localized recommendations)</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500"
            >
              <option value="">Select State...</option>
              <option value="CA">California</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="NY">New York</option>
              <option value="IL">Illinois</option>
            </select>
          </div>
          
          <button
            onClick={generateRecs}
            disabled={selectedStages.length === 0 || isGenerating}
            className="px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get Recommendations
              </>
            )}
          </button>
        </div>
      </section>

      {/* Recommendations */}
      <AnimatePresence>
        {recommendations.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-4 pb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                Your Personalized Recommendations
              </h2>
              <span className="text-sm text-slate-500">
                {recommendations.length} actions identified
              </span>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Relevance Score */}
                      <div className="w-14 h-14 bg-violet-500/20 rounded-xl flex flex-col items-center justify-center shrink-0">
                        <span className="text-lg font-bold text-violet-400">{rec.relevanceScore}</span>
                        <span className="text-[10px] text-violet-400/70">MATCH</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">{rec.title}</h3>
                            <p className="text-slate-400 text-sm mt-1">{rec.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border shrink-0 ${impactColors[rec.impact]}`}>
                            {rec.impact.toUpperCase()}
                          </span>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mt-4 text-sm">
                          <div className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-4 h-4" />
                            {rec.timeToComplete}
                          </div>
                          {rec.potentialSavings && (
                            <div className="flex items-center gap-1 text-green-400">
                              <DollarSign className="w-4 h-4" />
                              {rec.potentialSavings}
                            </div>
                          )}
                          {rec.deadline && (
                            <div className="flex items-center gap-1 text-amber-400">
                              <Target className="w-4 h-4" />
                              {rec.deadline}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-slate-500">
                            <Brain className="w-4 h-4" />
                            {Math.round(rec.confidence * 100)}% confidence
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700">
                          <Link
                            to={`/tools/processmap/${rec.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-violet-500 hover:bg-violet-400 text-white rounded-lg text-sm transition-colors"
                          >
                            Start Process
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          
                          {/* Feedback */}
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs text-slate-500">Helpful?</span>
                            <button
                              onClick={() => handleFeedback(rec.id, true)}
                              className={`p-2 rounded-lg transition-colors ${
                                feedback[rec.id] === true 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : 'hover:bg-slate-700 text-slate-500'
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleFeedback(rec.id, false)}
                              className={`p-2 rounded-lg transition-colors ${
                                feedback[rec.id] === false 
                                  ? 'bg-red-500/20 text-red-400' 
                                  : 'hover:bg-slate-700 text-slate-500'
                              }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ML Info */}
            <div className="mt-8 bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <div className="flex items-start gap-4">
                <Lightbulb className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <h3 className="text-white font-medium mb-1">How Our Recommendations Work</h3>
                  <p className="text-slate-400 text-sm">
                    Our model analyzes your life situation against our database of 100+ government processes, 
                    identifying relevant actions based on common patterns, legal requirements, and potential savings. 
                    Your feedback helps improve recommendations for everyone.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

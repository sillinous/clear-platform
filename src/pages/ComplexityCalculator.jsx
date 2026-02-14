import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator, Clock, FileText, Building2, DollarSign, Brain,
  AlertTriangle, Accessibility, ChevronRight, RotateCcw, Download,
  Share2, CheckCircle, HelpCircle, TrendingUp, TrendingDown
} from 'lucide-react';

// Complexity Index weights (matching CLEAR methodology)
const COMPLEXITY_WEIGHTS = {
  stepCount: { weight: 0.15, label: 'Step Count', icon: CheckCircle, description: 'Number of distinct steps required' },
  timeRequired: { weight: 0.20, label: 'Time Required', icon: Clock, description: 'Total time from start to completion' },
  documentBurden: { weight: 0.15, label: 'Document Burden', icon: FileText, description: 'Documents needed to complete' },
  agencyTouchpoints: { weight: 0.10, label: 'Agency Touchpoints', icon: Building2, description: 'Different agencies/offices involved' },
  cost: { weight: 0.15, label: 'Total Cost', icon: DollarSign, description: 'Fees, copies, travel, time off work' },
  languageComplexity: { weight: 0.10, label: 'Language Complexity', icon: Brain, description: 'Reading level of instructions' },
  errorRisk: { weight: 0.10, label: 'Error Risk', icon: AlertTriangle, description: 'Likelihood of rejection/restart' },
  accessibility: { weight: 0.05, label: 'Accessibility', icon: Accessibility, description: 'Online availability, hours, locations' }
};

const ComplexityCalculator = () => {
  const [processName, setProcessName] = useState('');
  const [processState, setProcessState] = useState('');
  const [scores, setScores] = useState({
    stepCount: 5,
    timeRequired: 5,
    documentBurden: 5,
    agencyTouchpoints: 5,
    cost: 5,
    languageComplexity: 5,
    errorRisk: 5,
    accessibility: 5
  });
  const [showResults, setShowResults] = useState(false);
  const [showHelp, setShowHelp] = useState(null);

  // Scoring guides for each dimension
  const scoringGuides = {
    stepCount: [
      { range: '1-2', score: '1-2', description: 'Very simple (1-2 steps)' },
      { range: '3-5', score: '3-4', description: 'Simple (3-5 steps)' },
      { range: '6-10', score: '5-6', description: 'Moderate (6-10 steps)' },
      { range: '11-15', score: '7-8', description: 'Complex (11-15 steps)' },
      { range: '16+', score: '9-10', description: 'Very complex (16+ steps)' }
    ],
    timeRequired: [
      { range: '< 1 hour', score: '1-2', description: 'Same-day completion' },
      { range: '1-7 days', score: '3-4', description: 'Within a week' },
      { range: '1-4 weeks', score: '5-6', description: 'Within a month' },
      { range: '1-3 months', score: '7-8', description: 'Several months' },
      { range: '3+ months', score: '9-10', description: 'Extensive timeline' }
    ],
    documentBurden: [
      { range: '0-1', score: '1-2', description: 'Minimal documentation' },
      { range: '2-3', score: '3-4', description: 'Basic documents' },
      { range: '4-6', score: '5-6', description: 'Multiple documents' },
      { range: '7-10', score: '7-8', description: 'Heavy documentation' },
      { range: '10+', score: '9-10', description: 'Extensive paperwork' }
    ],
    agencyTouchpoints: [
      { range: '1', score: '1-2', description: 'Single agency' },
      { range: '2', score: '3-4', description: 'Two agencies' },
      { range: '3-4', score: '5-6', description: 'Multiple agencies' },
      { range: '5-6', score: '7-8', description: 'Many agencies' },
      { range: '7+', score: '9-10', description: 'Extensive coordination' }
    ],
    cost: [
      { range: '$0-25', score: '1-2', description: 'Minimal cost' },
      { range: '$26-100', score: '3-4', description: 'Low cost' },
      { range: '$101-300', score: '5-6', description: 'Moderate cost' },
      { range: '$301-1000', score: '7-8', description: 'Significant cost' },
      { range: '$1000+', score: '9-10', description: 'High cost burden' }
    ],
    languageComplexity: [
      { range: '5th grade', score: '1-2', description: 'Plain language' },
      { range: '8th grade', score: '3-4', description: 'General audience' },
      { range: '12th grade', score: '5-6', description: 'Some jargon' },
      { range: 'College', score: '7-8', description: 'Technical language' },
      { range: 'Legal/Expert', score: '9-10', description: 'Expert knowledge required' }
    ],
    errorRisk: [
      { range: '< 5%', score: '1-2', description: 'Rarely rejected' },
      { range: '5-15%', score: '3-4', description: 'Occasionally rejected' },
      { range: '15-30%', score: '5-6', description: 'Sometimes rejected' },
      { range: '30-50%', score: '7-8', description: 'Often rejected' },
      { range: '50%+', score: '9-10', description: 'Frequently rejected' }
    ],
    accessibility: [
      { range: 'Fully online', score: '1-2', description: '24/7 online access' },
      { range: 'Mostly online', score: '3-4', description: 'Online with some in-person' },
      { range: 'Mixed', score: '5-6', description: 'Equal online/in-person' },
      { range: 'Mostly in-person', score: '7-8', description: 'Limited online options' },
      { range: 'In-person only', score: '9-10', description: 'No online access' }
    ]
  };

  // Calculate weighted complexity score
  const complexityScore = useMemo(() => {
    let total = 0;
    for (const [key, config] of Object.entries(COMPLEXITY_WEIGHTS)) {
      total += scores[key] * config.weight;
    }
    return Math.round(total * 10) / 10;
  }, [scores]);

  // Get complexity level
  const getComplexityLevel = (score) => {
    if (score <= 3) return { label: 'Low', color: 'green', description: 'This process is relatively straightforward.' };
    if (score <= 5) return { label: 'Moderate', color: 'yellow', description: 'This process requires some effort but is manageable.' };
    if (score <= 7) return { label: 'High', color: 'orange', description: 'This process presents significant challenges.' };
    return { label: 'Very High', color: 'red', description: 'This process is extremely burdensome and may need reform.' };
  };

  const complexityLevel = getComplexityLevel(complexityScore);

  // Comparison benchmarks
  const benchmarks = [
    { name: 'Driver\'s License Renewal', score: 3.2, state: 'Best States' },
    { name: 'Small Business License', score: 5.8, state: 'National Avg' },
    { name: 'Building Permit', score: 6.4, state: 'National Avg' },
    { name: 'Medicaid Application', score: 7.1, state: 'National Avg' }
  ];

  const handleScoreChange = (dimension, value) => {
    setScores(prev => ({ ...prev, [dimension]: parseInt(value) }));
  };

  const resetCalculator = () => {
    setScores({
      stepCount: 5,
      timeRequired: 5,
      documentBurden: 5,
      agencyTouchpoints: 5,
      cost: 5,
      languageComplexity: 5,
      errorRisk: 5,
      accessibility: 5
    });
    setProcessName('');
    setProcessState('');
    setShowResults(false);
  };

  const generateReport = () => {
    const report = `CLEAR Complexity Index Report
================================
Process: ${processName || 'Unnamed Process'}
State: ${processState || 'Not specified'}
Overall Score: ${complexityScore}/10 (${complexityLevel.label})

Dimension Scores:
${Object.entries(COMPLEXITY_WEIGHTS).map(([key, config]) => 
  `- ${config.label}: ${scores[key]}/10 (${(config.weight * 100).toFixed(0)}% weight)`
).join('\n')}

Assessment: ${complexityLevel.description}

Generated by CLEAR Platform
https://clear-platform.netlify.app/calculator
`;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `complexity-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score) => {
    if (score <= 3) return 'bg-green-500';
    if (score <= 5) return 'bg-yellow-500';
    if (score <= 7) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900/50 to-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Calculator className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Complexity Calculator</h1>
              <p className="text-slate-400">Measure any government process using the CLEAR methodology</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Process Info */}
        <div className="mb-8 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Process Name</label>
            <input
              type="text"
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="e.g., Driver's License Renewal"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">State/Jurisdiction</label>
            <input
              type="text"
              value={processState}
              onChange={(e) => setProcessState(e.target.value)}
              placeholder="e.g., California"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Dimension Sliders */}
        <div className="space-y-6 mb-8">
          {Object.entries(COMPLEXITY_WEIGHTS).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-blue-400" />
                    <div>
                      <span className="font-medium text-white">{config.label}</span>
                      <span className="text-xs text-slate-400 ml-2">({(config.weight * 100).toFixed(0)}% weight)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowHelp(showHelp === key ? null : key)}
                      className="p-1 text-slate-400 hover:text-white"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                    <span className={`text-lg font-bold ${scores[key] <= 3 ? 'text-green-400' : scores[key] <= 5 ? 'text-yellow-400' : scores[key] <= 7 ? 'text-orange-400' : 'text-red-400'}`}>
                      {scores[key]}
                    </span>
                  </div>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores[key]}
                  onChange={(e) => handleScoreChange(key, e.target.value)}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Simple</span>
                  <span>Complex</span>
                </div>

                {/* Help panel */}
                {showHelp === key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="mt-4 p-3 bg-slate-900 rounded-lg"
                  >
                    <p className="text-sm text-slate-300 mb-3">{config.description}</p>
                    <div className="grid grid-cols-5 gap-2 text-xs">
                      {scoringGuides[key].map((guide, i) => (
                        <div key={i} className="text-center">
                          <div className="font-bold text-blue-400">{guide.score}</div>
                          <div className="text-slate-400">{guide.range}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Results Card */}
        <div className={`bg-gradient-to-br ${
          complexityLevel.color === 'green' ? 'from-green-900/50 to-green-800/30 border-green-500/30' :
          complexityLevel.color === 'yellow' ? 'from-yellow-900/50 to-yellow-800/30 border-yellow-500/30' :
          complexityLevel.color === 'orange' ? 'from-orange-900/50 to-orange-800/30 border-orange-500/30' :
          'from-red-900/50 to-red-800/30 border-red-500/30'
        } rounded-xl p-6 border mb-8`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Complexity Score</h3>
            <div className="flex gap-2">
              <button onClick={resetCalculator} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={generateReport} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex items-end gap-4 mb-4">
            <span className={`text-6xl font-bold ${
              complexityLevel.color === 'green' ? 'text-green-400' :
              complexityLevel.color === 'yellow' ? 'text-yellow-400' :
              complexityLevel.color === 'orange' ? 'text-orange-400' :
              'text-red-400'
            }`}>{complexityScore}</span>
            <span className="text-2xl text-slate-400 mb-2">/ 10</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium mb-2 ${
              complexityLevel.color === 'green' ? 'bg-green-500/20 text-green-400' :
              complexityLevel.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
              complexityLevel.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {complexityLevel.label} Complexity
            </span>
          </div>
          
          <p className="text-slate-300">{complexityLevel.description}</p>
          
          {/* Visual breakdown */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {Object.entries(COMPLEXITY_WEIGHTS).map(([key, config]) => (
              <div key={key} className="text-center">
                <div className={`h-2 rounded-full ${getScoreColor(scores[key])} mb-1`} style={{ width: `${scores[key] * 10}%`, marginLeft: 'auto', marginRight: 'auto' }} />
                <span className="text-xs text-slate-400">{config.label.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark Comparison */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">How Does This Compare?</h3>
          <div className="space-y-3">
            {benchmarks.map((benchmark, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-white">{benchmark.name}</span>
                    <span className="text-sm text-slate-400">{benchmark.state}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getScoreColor(benchmark.score)} transition-all`}
                      style={{ width: `${benchmark.score * 10}%` }}
                    />
                  </div>
                </div>
                <span className={`text-sm font-bold w-10 text-right ${
                  benchmark.score <= 3 ? 'text-green-400' :
                  benchmark.score <= 5 ? 'text-yellow-400' :
                  benchmark.score <= 7 ? 'text-orange-400' :
                  'text-red-400'
                }`}>{benchmark.score}</span>
                {complexityScore > benchmark.score ? (
                  <TrendingUp className="w-4 h-4 text-red-400" />
                ) : complexityScore < benchmark.score ? (
                  <TrendingDown className="w-4 h-4 text-green-400" />
                ) : (
                  <span className="w-4 h-4 text-slate-400">—</span>
                )}
              </div>
            ))}
            
            {/* Your process */}
            <div className="flex items-center gap-4 pt-3 border-t border-slate-700">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white font-medium">{processName || 'Your Process'}</span>
                  <span className="text-sm text-blue-400">Current</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getScoreColor(complexityScore)} transition-all`}
                    style={{ width: `${complexityScore * 10}%` }}
                  />
                </div>
              </div>
              <span className={`text-sm font-bold w-10 text-right ${
                complexityScore <= 3 ? 'text-green-400' :
                complexityScore <= 5 ? 'text-yellow-400' :
                complexityScore <= 7 ? 'text-orange-400' :
                'text-red-400'
              }`}>{complexityScore}</span>
              <span className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplexityCalculator;

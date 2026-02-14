import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Document types with risk patterns
export const DOCUMENT_TYPES = {
  privacy_policy: {
    name: 'Privacy Policy',
    icon: '🔒',
    patterns: ['privacy', 'data collection', 'personal information', 'cookies', 'tracking', 'third party', 'share your data'],
    riskFactors: ['data sharing', 'third party', 'sell', 'marketing', 'analytics', 'indefinitely', 'retain']
  },
  terms_of_service: {
    name: 'Terms of Service',
    icon: '📜',
    patterns: ['terms of service', 'terms and conditions', 'user agreement', 'by using', 'agree to be bound', 'acceptance'],
    riskFactors: ['arbitration', 'waive', 'class action', 'modify', 'terminate', 'sole discretion', 'liability']
  },
  lease_agreement: {
    name: 'Lease Agreement',
    icon: '🏠',
    patterns: ['lease', 'tenant', 'landlord', 'rent', 'premises', 'occupancy', 'lessee', 'lessor', 'dwelling'],
    riskFactors: ['indemnify', 'forfeit', 'eviction', 'penalty', 'automatic renewal', 'withhold', 'security deposit']
  },
  employment_contract: {
    name: 'Employment Contract',
    icon: '💼',
    patterns: ['employment', 'employee', 'employer', 'salary', 'compensation', 'duties', 'termination', 'non-compete'],
    riskFactors: ['non-compete', 'non-solicitation', 'intellectual property', 'at-will', 'confidential', 'restrictive covenant']
  },
  liability_waiver: {
    name: 'Liability Waiver',
    icon: '⚠️',
    patterns: ['waiver', 'release', 'hold harmless', 'assume risk', 'indemnify', 'covenant not to sue', 'negligence'],
    riskFactors: ['death', 'injury', 'negligence', 'gross negligence', 'heirs', 'forever', 'all claims']
  },
  nda: {
    name: 'Non-Disclosure Agreement',
    icon: '🤐',
    patterns: ['confidential', 'non-disclosure', 'nda', 'proprietary', 'trade secret', 'receiving party', 'disclosing party'],
    riskFactors: ['perpetual', 'injunctive relief', 'irreparable harm', 'specific performance', 'broad definition']
  },
  loan_agreement: {
    name: 'Loan Agreement',
    icon: '💰',
    patterns: ['loan', 'principal', 'interest', 'repayment', 'borrower', 'lender', 'collateral', 'default'],
    riskFactors: ['default', 'acceleration', 'penalty', 'compound interest', 'variable rate', 'prepayment penalty']
  },
  insurance_policy: {
    name: 'Insurance Policy',
    icon: '🛡️',
    patterns: ['insurance', 'coverage', 'premium', 'deductible', 'claim', 'policyholder', 'insurer', 'beneficiary'],
    riskFactors: ['exclusion', 'pre-existing', 'waiting period', 'denial', 'lapse', 'cancellation', 'limitation']
  },
  unknown: {
    name: 'Legal Document',
    icon: '📄',
    patterns: [],
    riskFactors: []
  }
};

// Risk levels
export const RISK_LEVELS = {
  low: { label: 'Low Risk', color: 'green', score: [0, 3] },
  moderate: { label: 'Moderate Risk', color: 'yellow', score: [4, 6] },
  high: { label: 'High Risk', color: 'orange', score: [7, 8] },
  critical: { label: 'Critical Risk', color: 'red', score: [9, 10] }
};

// Classify document type based on content
export const classifyDocument = (text) => {
  const lowerText = text.toLowerCase();
  let bestMatch = { type: 'unknown', score: 0 };
  
  for (const [typeId, typeInfo] of Object.entries(DOCUMENT_TYPES)) {
    if (typeId === 'unknown') continue;
    
    let matchScore = 0;
    for (const pattern of typeInfo.patterns) {
      if (lowerText.includes(pattern.toLowerCase())) {
        matchScore += 1;
      }
    }
    
    if (matchScore > bestMatch.score) {
      bestMatch = { type: typeId, score: matchScore };
    }
  }
  
  return bestMatch.score >= 2 ? bestMatch.type : 'unknown';
};

// Calculate risk score based on document content
export const calculateRiskScore = (text, documentType) => {
  const lowerText = text.toLowerCase();
  const typeInfo = DOCUMENT_TYPES[documentType] || DOCUMENT_TYPES.unknown;
  
  const risks = [];
  let riskScore = 0;
  
  // Common high-risk phrases across all documents
  const universalRiskPatterns = [
    { pattern: 'waive', weight: 2, description: 'Waiver of rights' },
    { pattern: 'indemnif', weight: 2, description: 'Indemnification clause' },
    { pattern: 'hold harmless', weight: 2, description: 'Hold harmless provision' },
    { pattern: 'binding arbitration', weight: 3, description: 'Mandatory arbitration' },
    { pattern: 'class action', weight: 2, description: 'Class action waiver' },
    { pattern: 'sole discretion', weight: 1, description: 'Unilateral decision rights' },
    { pattern: 'modify at any time', weight: 2, description: 'Unilateral modification rights' },
    { pattern: 'without notice', weight: 2, description: 'Actions without notice' },
    { pattern: 'automatically renew', weight: 1, description: 'Auto-renewal clause' },
    { pattern: 'perpetual', weight: 2, description: 'Perpetual/unlimited duration' },
    { pattern: 'irrevocable', weight: 2, description: 'Irrevocable terms' },
    { pattern: 'unlimited license', weight: 2, description: 'Unlimited usage rights' },
    { pattern: 'sell your', weight: 2, description: 'Data selling provisions' },
    { pattern: 'share with third part', weight: 1, description: 'Third-party data sharing' },
    { pattern: 'not responsible for', weight: 1, description: 'Limited responsibility' },
    { pattern: 'no liability', weight: 2, description: 'Liability exclusion' },
    { pattern: 'consequential damages', weight: 1, description: 'Damages limitation' },
    { pattern: 'attorney', weight: 1, description: 'Legal fee provisions' },
    { pattern: 'jurisdiction', weight: 0.5, description: 'Jurisdiction clause' },
    { pattern: 'governing law', weight: 0.5, description: 'Choice of law' },
  ];
  
  // Check universal patterns
  for (const { pattern, weight, description } of universalRiskPatterns) {
    if (lowerText.includes(pattern)) {
      riskScore += weight;
      risks.push({ pattern, description, severity: weight >= 2 ? 'high' : 'medium' });
    }
  }
  
  // Check document-specific risk factors
  for (const factor of typeInfo.riskFactors) {
    if (lowerText.includes(factor.toLowerCase()) && !risks.find(r => r.pattern === factor)) {
      riskScore += 1;
      risks.push({ pattern: factor, description: `${typeInfo.name} specific: ${factor}`, severity: 'medium' });
    }
  }
  
  // Complexity factors
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = text.split(/\s+/).length / Math.max(sentences.length, 1);
  
  if (avgWordsPerSentence > 35) {
    riskScore += 1;
    risks.push({ pattern: 'complexity', description: 'Highly complex language', severity: 'low' });
  }
  
  // Normalize score to 0-10
  const normalizedScore = Math.min(10, Math.round(riskScore * 0.8));
  
  // Determine risk level
  let riskLevel = 'low';
  if (normalizedScore >= 9) riskLevel = 'critical';
  else if (normalizedScore >= 7) riskLevel = 'high';
  else if (normalizedScore >= 4) riskLevel = 'moderate';
  
  return {
    score: normalizedScore,
    level: riskLevel,
    risks: risks.slice(0, 10), // Top 10 risks
    summary: generateRiskSummary(normalizedScore, risks.length, documentType)
  };
};

const generateRiskSummary = (score, riskCount, documentType) => {
  const typeName = DOCUMENT_TYPES[documentType]?.name || 'document';
  
  if (score <= 3) {
    return `This ${typeName} appears relatively standard with ${riskCount} notable provisions. Review recommended but no major red flags detected.`;
  } else if (score <= 6) {
    return `This ${typeName} contains ${riskCount} provisions that deserve careful attention. Consider negotiating key terms or seeking clarification.`;
  } else if (score <= 8) {
    return `This ${typeName} has ${riskCount} concerning provisions including significant liability or rights limitations. Legal review strongly recommended before signing.`;
  } else {
    return `This ${typeName} contains ${riskCount} high-risk provisions that could significantly impact your rights. Do not sign without professional legal review.`;
  }
};

// Translation History Store
const useTranslationHistory = create(
  persist(
    (set, get) => ({
      history: [],
      maxHistory: 50,
      
      addTranslation: (entry) => set((state) => {
        const newEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ...entry
        };
        
        const updated = [newEntry, ...state.history].slice(0, state.maxHistory);
        return { history: updated };
      }),
      
      getTranslation: (id) => {
        return get().history.find(h => h.id === id);
      },
      
      deleteTranslation: (id) => set((state) => ({
        history: state.history.filter(h => h.id !== id)
      })),
      
      clearHistory: () => set({ history: [] }),
      
      searchHistory: (query) => {
        const lower = query.toLowerCase();
        return get().history.filter(h => 
          h.originalText?.toLowerCase().includes(lower) ||
          h.translatedText?.toLowerCase().includes(lower) ||
          h.documentType?.toLowerCase().includes(lower)
        );
      },
      
      getRecentByType: (type, limit = 5) => {
        return get().history
          .filter(h => h.documentType === type)
          .slice(0, limit);
      },
      
      getStats: () => {
        const history = get().history;
        const byType = {};
        let totalRisk = 0;
        
        for (const entry of history) {
          byType[entry.documentType] = (byType[entry.documentType] || 0) + 1;
          totalRisk += entry.riskScore?.score || 0;
        }
        
        return {
          total: history.length,
          byType,
          avgRiskScore: history.length > 0 ? (totalRisk / history.length).toFixed(1) : 0,
          thisWeek: history.filter(h => {
            const date = new Date(h.timestamp);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date > weekAgo;
          }).length
        };
      }
    }),
    {
      name: 'clear-translation-history'
    }
  )
);

export default useTranslationHistory;

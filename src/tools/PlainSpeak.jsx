import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText, Languages, Info, CheckCircle, AlertTriangle,
  ArrowLeft, Shield, BookOpen, Code
} from 'lucide-react'
import { Card, Badge } from '../components/UI'

// Sample translations for demo
const SAMPLE_TEXTS = {
  lease: {
    original: `WHEREAS, Lessor is the owner of certain real property located at the address specified above (the "Premises"), and WHEREAS, Lessee desires to lease the Premises from Lessor subject to the terms and conditions as contained herein; NOW, THEREFORE, for and in consideration of the covenants and obligations contained herein and other good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged, the parties agree as follows: Lessee shall pay to Lessor the sum of One Thousand Two Hundred Dollars ($1,200.00) per month as rent for the Premises, payable in advance on the first day of each calendar month during the term hereof. In the event that any payment required to be paid by Lessee hereunder is not made within five (5) days of when due, Lessee shall pay to Lessor, in addition to such payment or other charges due hereunder, a "late fee" in the amount of Fifty Dollars ($50.00). Lessor shall have the right to terminate this Lease upon thirty (30) days' written notice to Lessee in the event of any default by Lessee.`,
    title: "Residential Lease Agreement"
  },
  terms: {
    original: `By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use our Services. We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Services after any revisions become effective, you agree to be bound by the revised terms. You agree to indemnify, defend and hold harmless the Company and its officers, directors, employees, agents, affiliates, successors, and assigns from and against any and all losses, damages, liabilities, deficiencies, claims, actions, judgments, settlements, interest, awards, penalties, fines, costs, or expenses of whatever kind, including reasonable attorneys' fees.`,
    title: "Terms of Service"
  },
  medical: {
    original: `I hereby authorize the healthcare provider(s) named above to perform the procedure(s) described, including any additional procedures that may be deemed necessary during the course of the primary procedure(s). I understand that the practice of medicine and surgery is not an exact science and I acknowledge that no guarantees have been made to me concerning the results of this operation or procedure. I have been informed of the risks, benefits, and alternatives to this procedure, including the option of no treatment. I understand that there are risks inherent in any surgical or invasive procedure, including but not limited to: infection, bleeding, nerve damage, blood clots, adverse reactions to anesthesia, and unforeseen complications that may require additional treatment. I consent to the administration of anesthesia as may be deemed advisable by my healthcare provider.`,
    title: "Medical Consent Form"
  },
  tax: {
    original: `For purposes of this section, the term "qualified business income" means, for any taxable year, the net amount of qualified items of income, gain, deduction, and loss with respect to any qualified trade or business of the taxpayer. Such term shall not include any qualified REIT dividends, qualified cooperative dividends, or qualified publicly traded partnership income. The deduction allowed under subsection (a) shall be determined without regard to any deduction allowable under this chapter for the taxable year (other than this section and section 199A), and shall be allocated between qualified business income and qualified REIT dividends or qualified publicly traded partnership income in proportion to the relative amounts of such income.`,
    title: "Tax Code Section"
  }
}

// Simulated translations
const getTranslation = (text, level, docType) => {
  const translations = {
    lease: {
      '8': {
        summary: "This is a rental agreement. Here's what you need to know:",
        sections: [
          { heading: "How Much You Pay", content: "You pay $1,200 every month for rent. Pay by the 1st of each month." },
          { heading: "Late Fees", content: "If you're more than 5 days late paying rent, you owe an extra $50." },
          { heading: "Getting Kicked Out", content: "If you break the rules, the landlord can make you leave after giving you 30 days notice in writing." }
        ],
        actions: ["Pay $1,200 rent by the 1st of each month", "Avoid $50 late fee by paying within 5 days", "Follow all lease rules to avoid eviction"],
        warnings: ["You can be evicted with only 30 days notice if you break any rules"]
      },
      '12': {
        summary: "This residential lease agreement establishes the rental terms between landlord (Lessor) and tenant (Lessee).",
        sections: [
          { heading: "Rent Payment Terms", content: "Monthly rent of $1,200 is due in advance on the first of each month. A $50 late fee applies to payments received more than 5 days after the due date." },
          { heading: "Termination Clause", content: "The landlord may terminate this lease with 30 days written notice if you fail to meet any obligations under this agreement." }
        ],
        actions: ["Submit $1,200 rent payment by the 1st of each month", "Maintain compliance with all lease terms to avoid termination"],
        warnings: ["Late payments trigger automatic $50 fee after 5-day grace period", "Any default could result in lease termination with 30 days notice"]
      }
    },
    terms: {
      '8': {
        summary: "These are the rules for using this service. By using it, you agree to follow them.",
        sections: [
          { heading: "The Rules Can Change", content: "The company can change these rules whenever they want. They'll give you 30 days notice for big changes." },
          { heading: "You're Responsible", content: "If something goes wrong because of how you use the service, you have to pay for it - including lawyer fees." }
        ],
        actions: ["Read these terms before using the service", "Check for updates regularly", "Use the service responsibly"],
        warnings: ["You could owe money if your use of the service causes problems", "The company decides what counts as a 'big' change to the rules"]
      },
      '12': {
        summary: "This Terms of Service agreement governs your use of the platform and establishes mutual obligations between you and the service provider.",
        sections: [
          { heading: "Modification Rights", content: "The company reserves unilateral authority to modify these terms. Material changes require 30 days advance notice, though 'material' is defined at company discretion." },
          { heading: "Indemnification Obligations", content: "You agree to defend and compensate the company for any losses, legal costs, or damages arising from your use of the service, including attorney fees." }
        ],
        actions: ["Review terms before accepting", "Monitor for updates to terms", "Understand your indemnification obligations"],
        warnings: ["Broad indemnification clause could create significant financial liability", "Company has discretion to determine what constitutes 'material' changes"]
      }
    },
    medical: {
      '8': {
        summary: "This form asks for your permission to do a medical procedure. Read it carefully before signing.",
        sections: [
          { heading: "What You're Agreeing To", content: "You're saying it's okay for the doctor to do the procedure. If they find something else during the procedure, they can fix that too." },
          { heading: "The Risks", content: "Things can go wrong with any surgery. This includes infection, bleeding, nerve damage, and problems with anesthesia. The doctor can't promise everything will go perfectly." }
        ],
        actions: ["Ask questions before signing", "Make sure you understand the risks", "You can ask for more time if you need it"],
        warnings: ["No one can guarantee the results", "The doctor may do extra procedures if needed", "There are real risks including serious complications"]
      },
      '12': {
        summary: "This consent form authorizes medical personnel to perform a specified procedure and acknowledges your understanding of associated risks.",
        sections: [
          { heading: "Scope of Authorization", content: "You authorize the named procedure plus any additional procedures deemed necessary during the operation. This provides medical flexibility but means the exact scope may vary." },
          { heading: "Risk Acknowledgment", content: "You acknowledge understanding of inherent surgical risks: infection, bleeding, nerve damage, blood clots, anesthesia reactions, and unforeseen complications." }
        ],
        actions: ["Verify you understand the primary procedure", "Confirm you've discussed risks with your provider", "Ensure you've been informed of alternatives"],
        warnings: ["Authorization extends to 'necessary' additional procedures", "No guarantees of outcome are provided", "All surgical procedures carry inherent risks"]
      }
    },
    tax: {
      '8': {
        summary: "This section of tax law is about a deduction for business owners. Here's the simple version:",
        sections: [
          { heading: "What It Is", content: "If you own a business, you might get to pay less taxes on the money you make from it." },
          { heading: "What Counts", content: "It's based on the profit from your business - money you made minus expenses. Some types of investment income don't count." }
        ],
        actions: ["Check if your business qualifies", "Talk to a tax professional", "Keep good records of business income and expenses"],
        warnings: ["This is complicated - professional help recommended", "Not all business income qualifies", "Rules are different for different business types"]
      },
      '12': {
        summary: "This section defines 'qualified business income' (QBI) for purposes of the pass-through deduction available to certain business owners.",
        sections: [
          { heading: "QBI Definition", content: "Qualified business income is the net amount of income, gains, deductions, and losses from a qualified trade or business." },
          { heading: "Deduction Calculation", content: "The deduction is calculated before other chapter deductions and allocated proportionally between QBI and other qualified income types." }
        ],
        actions: ["Determine if your business generates QBI", "Separate different income types", "Consult IRS guidance or tax professional"],
        warnings: ["Complex calculation with multiple income categories", "Professional preparation strongly recommended"]
      }
    }
  }
  return translations[docType]?.[level] || translations['lease']['8']
}

// Readability analysis
const analyzeReadability = (text) => {
  const words = text.split(/\s+/).length
  const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
  const syllables = text.split(/\s+/).reduce((acc, word) => {
    return acc + Math.max(1, word.replace(/[^aeiouy]/gi, '').length)
  }, 0)
  const avgWordsPerSentence = words / sentences
  const avgSyllablesPerWord = syllables / words
  const gradeLevel = Math.round(0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59)
  return {
    words,
    sentences,
    gradeLevel: Math.max(1, Math.min(20, gradeLevel)),
    avgSentenceLength: Math.round(avgWordsPerSentence),
    complexityScore: Math.min(100, Math.round(gradeLevel * 5))
  }
}

export default function PlainSpeakTool() {
  const [inputText, setInputText] = useState('')
  const [selectedSample, setSelectedSample] = useState('')
  const [targetLevel, setTargetLevel] = useState('8')
  const [translation, setTranslation] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [isTranslating, setIsTranslating] = useState(false)

  const loadSample = (key) => {
    setSelectedSample(key)
    setInputText(SAMPLE_TEXTS[key].original)
    setTranslation(null)
  }

  const handleTranslate = () => {
    if (!inputText.trim()) return
    setIsTranslating(true)
    setAnalysis(analyzeReadability(inputText))
    setTimeout(() => {
      const docType = selectedSample || 'lease'
      setTranslation(getTranslation(inputText, targetLevel, docType))
      setIsTranslating(false)
    }, 1500)
  }

  const readingLevels = [
    { value: '8', label: '8th Grade', desc: 'General public' },
    { value: '12', label: '12th Grade', desc: 'Educated adult' },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50">
        <div className="container-wide py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/tools" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">PlainSpeak</h1>
                  <p className="text-xs text-slate-400">Legal Document Translator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container-wide py-8">
        {/* Intro */}
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Translate legal documents into plain language
          </h2>
          <p className="text-slate-400">
            Paste any legal document, contract, or government form and get a clear explanation 
            at your chosen reading level.
          </p>
        </div>

        {/* Sample Buttons */}
        <div className="mb-6">
          <label className="text-sm text-slate-400 mb-2 block">Try a sample document:</label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SAMPLE_TEXTS).map(([key, val]) => (
              <button
                key={key}
                onClick={() => loadSample(key)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedSample === key
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {val.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-4">
            <Card>
              <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <h3 className="font-medium text-white">Original Document</h3>
                {analysis && (
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-slate-400">{analysis.words} words</span>
                    <Badge variant={analysis.gradeLevel > 12 ? 'red' : analysis.gradeLevel > 8 ? 'amber' : 'green'}>
                      Grade {analysis.gradeLevel}
                    </Badge>
                  </div>
                )}
              </div>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value)
                  setSelectedSample('')
                  setTranslation(null)
                }}
                placeholder="Paste your legal document, contract, terms of service, or government form here..."
                className="w-full h-64 p-4 bg-transparent text-slate-200 placeholder-slate-500 resize-none focus:outline-none font-mono text-sm"
              />
            </Card>

            {/* Reading Level Selector */}
            <Card className="p-4">
              <label className="text-sm text-slate-400 mb-3 block">Target reading level:</label>
              <div className="flex gap-3">
                {readingLevels.map(level => (
                  <button
                    key={level.value}
                    onClick={() => setTargetLevel(level.value)}
                    className={`flex-1 p-3 rounded-lg border transition-colors ${
                      targetLevel === level.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className={`font-medium ${targetLevel === level.value ? 'text-blue-400' : 'text-white'}`}>
                      {level.label}
                    </div>
                    <div className="text-xs text-slate-400">{level.desc}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              className="w-full py-4 bg-blue-500 hover:bg-blue-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isTranslating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="w-5 h-5" />
                  Translate to Plain Language
                </>
              )}
            </button>
          </div>

          {/* Output Panel */}
          <Card>
            <div className="px-4 py-3 border-b border-slate-700">
              <h3 className="font-medium text-white">Plain Language Translation</h3>
            </div>
            
            {!translation ? (
              <div className="p-8 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Paste a document and click translate to see the plain language version</p>
              </div>
            ) : (
              <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
                {/* Summary */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />Summary
                  </h4>
                  <p className="text-slate-200">{translation.summary}</p>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  {translation.sections.map((section, idx) => (
                    <div key={idx}>
                      <h4 className="text-white font-medium mb-2">{section.heading}</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {translation.actions && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-green-400 font-medium mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />What You Should Do
                    </h4>
                    <ul className="space-y-2">
                      {translation.actions.map((action, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-200">
                          <span className="text-green-400 mt-1">•</span>{action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {translation.warnings && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                    <h4 className="text-amber-400 font-medium mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />Watch Out For
                    </h4>
                    <ul className="space-y-2">
                      {translation.warnings.map((warning, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-200">
                          <span className="text-amber-400 mt-1">!</span>{warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="pt-4 border-t border-slate-700 text-xs text-slate-500">
                  <strong>Disclaimer:</strong> This translation is for informational purposes only and does not constitute legal advice.
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Analysis Panel */}
        {analysis && (
          <Card className="mt-8 p-6">
            <h3 className="font-medium text-white mb-4">Document Analysis</h3>
            <div className="grid sm:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-semibold text-white">{analysis.words}</div>
                <div className="text-sm text-slate-400">Total words</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">{analysis.sentences}</div>
                <div className="text-sm text-slate-400">Sentences</div>
              </div>
              <div>
                <div className={`text-3xl font-semibold ${
                  analysis.gradeLevel > 12 ? 'text-red-400' : 
                  analysis.gradeLevel > 8 ? 'text-amber-400' : 'text-green-400'
                }`}>
                  {analysis.gradeLevel}
                </div>
                <div className="text-sm text-slate-400">Reading grade level</div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-white">{analysis.avgSentenceLength}</div>
                <div className="text-sm text-slate-400">Avg words/sentence</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Complexity Score</span>
                <span className="text-sm font-medium text-white">{analysis.complexityScore}/100</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    analysis.complexityScore > 70 ? 'bg-red-500' : 
                    analysis.complexityScore > 40 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${analysis.complexityScore}%` }}
                />
              </div>
            </div>
          </Card>
        )}

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <Shield className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-medium text-white mb-2">Privacy First</h3>
            <p className="text-sm text-slate-400">
              Your documents are processed securely and never stored.
            </p>
          </Card>
          <Card className="p-6">
            <BookOpen className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="font-medium text-white mb-2">Plain Language Standards</h3>
            <p className="text-sm text-slate-400">
              Translations follow federal plain language guidelines.
            </p>
          </Card>
          <Card className="p-6">
            <Code className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="font-medium text-white mb-2">Open Source</h3>
            <p className="text-sm text-slate-400">
              PlainSpeak is open source. Help us improve legal accessibility.
            </p>
          </Card>
        </div>
      </main>
    </div>
  )
}

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, CheckCircle, AlertCircle, FileText, Clock, Building2,
  DollarSign, MapPin, User, Mail, ChevronRight, Plus, X,
  Upload, HelpCircle, ArrowLeft, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PROCESS_CATEGORIES = [
  { id: 'licensing', label: 'Licensing & Permits', examples: 'Business license, building permit, professional license' },
  { id: 'benefits', label: 'Benefits & Assistance', examples: 'SNAP, Medicaid, unemployment, housing assistance' },
  { id: 'documents', label: 'Vital Documents', examples: 'Birth certificate, ID, passport, Social Security' },
  { id: 'vehicles', label: 'Vehicles & Transportation', examples: 'Registration, driver\'s license, title transfer' },
  { id: 'property', label: 'Property & Housing', examples: 'Property tax, zoning, deed recording' },
  { id: 'courts', label: 'Courts & Legal', examples: 'Name change, expungement, small claims' },
  { id: 'business', label: 'Business Operations', examples: 'Tax registration, employer ID, business formation' },
  { id: 'other', label: 'Other', examples: 'Anything not listed above' }
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'Washington D.C.', 'Federal'
];

const ProcessSubmissionForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Process Info
    processName: '',
    category: '',
    state: '',
    agency: '',
    description: '',
    
    // Complexity Data
    stepCount: '',
    timeEstimate: '',
    documents: [''],
    fees: '',
    onlineAvailable: '',
    
    // Pain Points
    challenges: '',
    suggestions: '',
    
    // Contact (optional)
    name: '',
    email: '',
    wantsUpdates: false
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const addDocument = () => {
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, '']
    }));
  };

  const updateDocument = (index, value) => {
    const newDocs = [...formData.documents];
    newDocs[index] = value;
    setFormData(prev => ({ ...prev, documents: newDocs }));
  };

  const removeDocument = (index) => {
    if (formData.documents.length > 1) {
      const newDocs = formData.documents.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, documents: newDocs }));
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};
    
    if (stepNum === 1) {
      if (!formData.processName.trim()) newErrors.processName = 'Process name is required';
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.state) newErrors.state = 'Please select a state';
    }
    
    if (stepNum === 2) {
      if (!formData.stepCount) newErrors.stepCount = 'Please estimate the number of steps';
      if (!formData.timeEstimate) newErrors.timeEstimate = 'Please estimate the time required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    
    // Simulate API call - in production, this would POST to a backend
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store locally for now
    const submissions = JSON.parse(localStorage.getItem('clear-submissions') || '[]');
    submissions.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...formData
    });
    localStorage.setItem('clear-submissions', JSON.stringify(submissions));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-slate-800 rounded-2xl p-8 text-center border border-slate-700"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Thank You!</h2>
          <p className="text-slate-300 mb-6">
            Your process submission has been received. Our team will review it and add it to the CLEAR database.
          </p>
          <p className="text-sm text-slate-400 mb-8">
            Submissions like yours help us build a comprehensive picture of bureaucratic complexity across America.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/tools"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium"
            >
              Back to Tools
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setStep(1);
                setFormData({
                  processName: '', category: '', state: '', agency: '', description: '',
                  stepCount: '', timeEstimate: '', documents: [''], fees: '', onlineAvailable: '',
                  challenges: '', suggestions: '', name: '', email: '', wantsUpdates: false
                });
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium"
            >
              Submit Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-900/50 to-slate-900 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Send className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Submit a Process</h1>
              <p className="text-slate-400">Help us map bureaucratic complexity in your state</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-8">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  s === step ? 'bg-emerald-500 text-white' :
                  s < step ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {s < step ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 rounded ${s < step ? 'bg-emerald-500/50' : 'bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>Basic Info</span>
            <span>Complexity</span>
            <span>Experience</span>
            <span>Submit</span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Process Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.processName}
                  onChange={(e) => updateField('processName', e.target.value)}
                  placeholder="e.g., Small Business License Application"
                  className={`w-full px-4 py-3 bg-slate-800 border ${errors.processName ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white placeholder-slate-500`}
                />
                {errors.processName && <p className="text-red-400 text-sm mt-1">{errors.processName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {PROCESS_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateField('category', cat.id)}
                      className={`p-4 rounded-lg border text-left transition-all ${
                        formData.category === cat.id
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-medium">{cat.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{cat.examples}</div>
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  State/Jurisdiction <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-800 border ${errors.state ? 'border-red-500' : 'border-slate-700'} rounded-lg text-white`}
                >
                  <option value="">Select a state...</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Agency/Department (Optional)
                </label>
                <input
                  type="text"
                  value={formData.agency}
                  onChange={(e) => updateField('agency', e.target.value)}
                  placeholder="e.g., Department of Revenue"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Brief Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="What is this process for? Who needs to complete it?"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Complexity Data */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Estimated Number of Steps <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {['1-3', '4-7', '8-12', '13+'].map((range) => (
                    <button
                      key={range}
                      onClick={() => updateField('stepCount', range)}
                      className={`p-3 rounded-lg border text-center ${
                        formData.stepCount === range
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {range} steps
                    </button>
                  ))}
                </div>
                {errors.stepCount && <p className="text-red-400 text-sm mt-1">{errors.stepCount}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Total Time Required <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Same day', '1-7 days', '1-4 weeks', '1+ months'].map((time) => (
                    <button
                      key={time}
                      onClick={() => updateField('timeEstimate', time)}
                      className={`p-3 rounded-lg border text-center ${
                        formData.timeEstimate === time
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {errors.timeEstimate && <p className="text-red-400 text-sm mt-1">{errors.timeEstimate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Required Documents
                </label>
                <div className="space-y-2">
                  {formData.documents.map((doc, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={doc}
                        onChange={(e) => updateDocument(i, e.target.value)}
                        placeholder="e.g., Photo ID, Proof of address"
                        className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                      />
                      {formData.documents.length > 1 && (
                        <button
                          onClick={() => removeDocument(i)}
                          className="p-2 text-red-400 hover:text-red-300"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addDocument}
                    className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm"
                  >
                    <Plus className="w-4 h-4" /> Add another document
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Total Fees (approximate)
                </label>
                <input
                  type="text"
                  value={formData.fees}
                  onChange={(e) => updateField('fees', e.target.value)}
                  placeholder="e.g., $150"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Can this be completed online?
                </label>
                <div className="flex gap-3">
                  {['Fully online', 'Partially online', 'In-person only', 'Not sure'].map((option) => (
                    <button
                      key={option}
                      onClick={() => updateField('onlineAvailable', option)}
                      className={`px-4 py-2 rounded-lg border ${
                        formData.onlineAvailable === option
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  What challenges did you face?
                </label>
                <textarea
                  value={formData.challenges}
                  onChange={(e) => updateField('challenges', e.target.value)}
                  placeholder="Describe any difficulties, confusing steps, long waits, or frustrations..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  How could this process be improved?
                </label>
                <textarea
                  value={formData.suggestions}
                  onChange={(e) => updateField('suggestions', e.target.value)}
                  placeholder="Your ideas for making this easier, faster, or clearer..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 resize-none"
                />
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-white mb-1">Your experience matters</h4>
                    <p className="text-sm text-slate-400">
                      Real stories from citizens help us advocate for meaningful reform. 
                      Your challenges and suggestions may be featured in our research reports.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <h3 className="font-semibold text-white mb-4">Review Your Submission</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-slate-400">Process</span>
                    <span className="text-white">{formData.processName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-slate-400">Category</span>
                    <span className="text-white">{PROCESS_CATEGORIES.find(c => c.id === formData.category)?.label}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-slate-400">State</span>
                    <span className="text-white">{formData.state}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-slate-400">Steps</span>
                    <span className="text-white">{formData.stepCount}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-700">
                    <span className="text-slate-400">Time</span>
                    <span className="text-white">{formData.timeEstimate}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Documents</span>
                    <span className="text-white">{formData.documents.filter(d => d).length} listed</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="For attribution in reports"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="To receive updates on this process"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wantsUpdates}
                  onChange={(e) => updateField('wantsUpdates', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-emerald-500"
                />
                <span className="text-slate-300">Notify me when this process is added to CLEAR</span>
              </label>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          ) : (
            <Link
              to="/tools"
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" /> Cancel
            </Link>
          )}

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg font-medium"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white rounded-lg font-medium"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>Submit Process <Send className="w-5 h-5" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessSubmissionForm;

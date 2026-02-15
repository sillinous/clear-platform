import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Download, Edit, CheckCircle, User, MapPin, Calendar,
  Building2, Phone, Mail, CreditCard, Car, Briefcase, Heart,
  ChevronRight, Save, Eye, Printer, RefreshCw, Shield, AlertTriangle
} from 'lucide-react';

// Form templates
const formTemplates = [
  {
    id: 'ds-11',
    name: 'Form DS-11',
    agency: 'U.S. Department of State',
    title: 'Application for a U.S. Passport',
    category: 'identity',
    fields: ['fullName', 'dateOfBirth', 'placeOfBirth', 'ssn', 'address', 'phone', 'email', 'height', 'hairColor', 'eyeColor'],
    estimatedTime: '15 min',
    fee: '$165',
  },
  {
    id: 'ss-5',
    name: 'Form SS-5',
    agency: 'Social Security Administration',
    title: 'Application for a Social Security Card',
    category: 'identity',
    fields: ['fullName', 'dateOfBirth', 'placeOfBirth', 'citizenship', 'address', 'phone'],
    estimatedTime: '10 min',
    fee: 'Free',
  },
  {
    id: 'i-9',
    name: 'Form I-9',
    agency: 'U.S. Citizenship and Immigration Services',
    title: 'Employment Eligibility Verification',
    category: 'employment',
    fields: ['fullName', 'dateOfBirth', 'address', 'ssn', 'citizenship', 'email'],
    estimatedTime: '10 min',
    fee: 'Free',
  },
  {
    id: 'w-4',
    name: 'Form W-4',
    agency: 'Internal Revenue Service',
    title: 'Employee\'s Withholding Certificate',
    category: 'tax',
    fields: ['fullName', 'address', 'ssn', 'filingStatus', 'dependents'],
    estimatedTime: '5 min',
    fee: 'Free',
  },
  {
    id: 'dmv-dl44',
    name: 'Form DL 44',
    agency: 'California DMV',
    title: 'Driver License Application',
    category: 'vehicle',
    fields: ['fullName', 'dateOfBirth', 'address', 'ssn', 'height', 'weight', 'hairColor', 'eyeColor'],
    estimatedTime: '10 min',
    fee: '$41',
  },
  {
    id: 'voter-reg',
    name: 'Voter Registration',
    agency: 'Secretary of State',
    title: 'National Voter Registration Form',
    category: 'civic',
    fields: ['fullName', 'dateOfBirth', 'address', 'citizenship', 'party'],
    estimatedTime: '5 min',
    fee: 'Free',
  },
];

const categories = [
  { id: 'all', name: 'All Forms', icon: FileText },
  { id: 'identity', name: 'Identity', icon: User },
  { id: 'tax', name: 'Tax', icon: CreditCard },
  { id: 'vehicle', name: 'Vehicle', icon: Car },
  { id: 'employment', name: 'Employment', icon: Briefcase },
  { id: 'civic', name: 'Civic', icon: Building2 },
];

// User profile fields
const defaultProfile = {
  fullName: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  placeOfBirth: '',
  ssn: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  citizenship: 'US Citizen',
  height: '',
  weight: '',
  hairColor: '',
  eyeColor: '',
  filingStatus: 'Single',
  dependents: '0',
  party: '',
};

const PROFILE_KEY = 'clear-user-profile';

export default function DocumentGeneratorPage() {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved ? JSON.parse(saved) : defaultProfile;
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedForm, setSelectedForm] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const saveProfile = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  };

  const updateProfile = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const filteredForms = formTemplates.filter(
    form => selectedCategory === 'all' || form.category === selectedCategory
  );

  const calculateCompletion = () => {
    const filledFields = Object.values(profile).filter(v => v.trim() !== '').length;
    return Math.round((filledFields / Object.keys(profile).length) * 100);
  };

  const generateDocument = async () => {
    setGenerating(true);
    // Simulate generation
    await new Promise(r => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated(true);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-amber-900/30 via-slate-900 to-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                <FileText className="w-7 h-7 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Document Generator</h1>
                <p className="text-slate-400">Auto-fill government forms with your saved profile</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition-colors"
            >
              <User className="w-5 h-5" />
              My Profile ({calculateCompletion()}%)
            </button>
          </div>

          {/* Categories */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Form Grid */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredForms.map((form, index) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedForm(form)}
              className="bg-slate-800 rounded-xl border border-slate-700 p-5 cursor-pointer hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                  {form.name}
                </span>
                <span className="text-sm text-slate-500">{form.fee}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-1">{form.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{form.agency}</p>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{form.fields.length} fields</span>
                <span className="text-slate-400">~{form.estimatedTime}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => setShowProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-800 z-10">
                <h2 className="text-xl font-semibold text-white">Your Profile</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">{calculateCompletion()}% complete</span>
                  <button
                    onClick={() => { saveProfile(); setShowProfile(false); }}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-6">
                {/* Personal Info */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-amber-400" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => updateProfile('fullName', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={profile.dateOfBirth}
                        onChange={(e) => updateProfile('dateOfBirth', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Place of Birth</label>
                      <input
                        type="text"
                        value={profile.placeOfBirth}
                        onChange={(e) => updateProfile('placeOfBirth', e.target.value)}
                        placeholder="City, State, Country"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">SSN (Last 4)</label>
                      <input
                        type="password"
                        value={profile.ssn}
                        onChange={(e) => updateProfile('ssn', e.target.value)}
                        maxLength={4}
                        placeholder="••••"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-amber-400" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm text-slate-400 mb-1">Street Address</label>
                      <input
                        type="text"
                        value={profile.address}
                        onChange={(e) => updateProfile('address', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">City</label>
                      <input
                        type="text"
                        value={profile.city}
                        onChange={(e) => updateProfile('city', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">State</label>
                        <input
                          type="text"
                          value={profile.state}
                          onChange={(e) => updateProfile('state', e.target.value)}
                          maxLength={2}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">ZIP</label>
                        <input
                          type="text"
                          value={profile.zip}
                          onChange={(e) => updateProfile('zip', e.target.value)}
                          maxLength={5}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => updateProfile('phone', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-medium">Your data stays on your device</h4>
                      <p className="text-sm text-slate-400 mt-1">
                        Profile information is stored locally in your browser and never sent to our servers.
                        You can clear it anytime from Settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Detail Modal */}
      <AnimatePresence>
        {selectedForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
            onClick={() => { setSelectedForm(null); setGenerated(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                      {selectedForm.name}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-2">{selectedForm.title}</h2>
                    <p className="text-slate-500">{selectedForm.agency}</p>
                  </div>
                </div>

                {/* Form Preview */}
                <div className="bg-slate-900 rounded-xl p-4 mb-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-3">Fields to be auto-filled:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedForm.fields.map((field) => {
                      const hasValue = profile[field]?.trim();
                      return (
                        <span
                          key={field}
                          className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                            hasValue 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {hasValue && <CheckCircle className="w-3 h-3" />}
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{selectedForm.fields.length}</div>
                    <div className="text-xs text-slate-500">Fields</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{selectedForm.estimatedTime}</div>
                    <div className="text-xs text-slate-500">Est. Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-400">{selectedForm.fee}</div>
                    <div className="text-xs text-slate-500">Fee</div>
                  </div>
                </div>

                {/* Actions */}
                {generated ? (
                  <div className="space-y-3">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Document Generated!</p>
                      <p className="text-sm text-slate-400">Your form is ready to download</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                      <button className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl">
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={generateDocument}
                    disabled={generating}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        Generate Pre-filled Form
                      </>
                    )}
                  </button>
                )}

                <p className="text-xs text-slate-500 text-center mt-4">
                  Review all fields before submitting. CLEAR is not responsible for submission errors.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

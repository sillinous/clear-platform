// Expanded ProcessMap Data - 18 Government Processes
// Each process includes steps, documents, tips, and complexity metrics

export const PROCESS_CATEGORIES = {
  documents: { label: 'Vital Documents', icon: '📄', color: 'blue' },
  vehicles: { label: 'Vehicles & Driving', icon: '🚗', color: 'green' },
  benefits: { label: 'Benefits & Assistance', icon: '🏥', color: 'purple' },
  business: { label: 'Business & Licensing', icon: '💼', color: 'orange' },
  property: { label: 'Property & Housing', icon: '🏠', color: 'cyan' },
  legal: { label: 'Courts & Legal', icon: '⚖️', color: 'red' }
};

export const PROCESSES = {
  // ============ VITAL DOCUMENTS ============
  'drivers-license-renewal': {
    id: 'drivers-license-renewal',
    name: "Driver's License Renewal",
    category: 'vehicles',
    complexity: 3.2,
    timeEstimate: '1-2 hours',
    cost: '$25-40',
    description: 'Renew your driver\'s license before expiration to maintain driving privileges.',
    steps: [
      { id: 'check', title: 'Check Eligibility', description: 'Verify you can renew online, by mail, or must visit in person. Check expiration date - most states allow renewal up to 6 months early.', duration: '5 min', type: 'research' },
      { id: 'gather', title: 'Gather Documents', description: 'Current license, proof of address (if required), payment method. Some states require vision test results.', duration: '15 min', type: 'document' },
      { id: 'apply', title: 'Submit Application', description: 'Complete online, mail, or in-person application. Answer questions about medical conditions if applicable.', duration: '20-60 min', type: 'action' },
      { id: 'pay', title: 'Pay Fee', description: 'Pay renewal fee by card, check, or cash (in-person only).', duration: '5 min', type: 'payment' },
      { id: 'photo', title: 'New Photo (if required)', description: 'Take new photo at DMV if in-person renewal or if current photo is over 10 years old.', duration: '15 min', type: 'action' },
      { id: 'receive', title: 'Receive New License', description: 'Get temporary paper license immediately; permanent card arrives by mail in 2-4 weeks.', duration: '2-4 weeks', type: 'wait' }
    ],
    documents: ['Current driver\'s license', 'Proof of address (some states)', 'Payment'],
    tips: [
      'Renew online if eligible - much faster',
      'Make DMV appointment to avoid long waits',
      'Check if REAL ID upgrade is required'
    ],
    warnings: ['Driving with expired license is illegal', 'Some states have grace periods, others don\'t']
  },

  'passport-application': {
    id: 'passport-application',
    name: 'Passport Application (First Time)',
    category: 'documents',
    complexity: 5.8,
    timeEstimate: '6-11 weeks',
    cost: '$165 (book) / $205 (book + card)',
    description: 'Apply for your first U.S. passport for international travel.',
    steps: [
      { id: 'form', title: 'Complete DS-11 Form', description: 'Fill out Form DS-11 online or by hand. Do NOT sign until instructed by acceptance agent.', duration: '30 min', type: 'document' },
      { id: 'photo', title: 'Get Passport Photo', description: '2x2 inch photo with white background. Many pharmacies and post offices offer this service.', duration: '15 min', type: 'action' },
      { id: 'citizenship', title: 'Gather Citizenship Evidence', description: 'Birth certificate (original or certified copy) OR naturalization certificate.', duration: '1-2 weeks if ordering', type: 'document' },
      { id: 'id', title: 'Prepare ID', description: 'Valid driver\'s license, state ID, or military ID. Bring original + photocopy.', duration: '10 min', type: 'document' },
      { id: 'appointment', title: 'Schedule Appointment', description: 'Find acceptance facility (post office, clerk office) and schedule appointment.', duration: '15 min', type: 'action' },
      { id: 'appear', title: 'Appear In Person', description: 'Bring all documents, sign form in front of agent, pay fees.', duration: '30-60 min', type: 'action' },
      { id: 'wait', title: 'Wait for Processing', description: 'Standard: 6-8 weeks. Expedited ($60 extra): 2-3 weeks.', duration: '6-8 weeks', type: 'wait' }
    ],
    documents: ['Form DS-11', 'Citizenship evidence', 'Photo ID + photocopy', 'Passport photo', 'Payment'],
    tips: [
      'Apply during off-peak season (fall/winter)',
      'Expedite if traveling within 3 months',
      'Make photocopies of everything'
    ],
    warnings: ['First-time applicants MUST apply in person', 'Name must match citizenship document exactly']
  },

  'birth-certificate': {
    id: 'birth-certificate',
    name: 'Birth Certificate Request',
    category: 'documents',
    complexity: 3.5,
    timeEstimate: '1-6 weeks',
    cost: '$15-50',
    description: 'Obtain a certified copy of a birth certificate from vital records.',
    steps: [
      { id: 'identify', title: 'Identify Issuing Office', description: 'Birth certificates are issued by the state/county where birth occurred, not where you live now.', duration: '10 min', type: 'research' },
      { id: 'form', title: 'Complete Application', description: 'Fill out request form with full name at birth, date, place, parent names.', duration: '15 min', type: 'document' },
      { id: 'id', title: 'Prepare ID', description: 'Copy of your photo ID. Some states require notarized request.', duration: '10-30 min', type: 'document' },
      { id: 'submit', title: 'Submit Request', description: 'Online, by mail, or in-person. Online is fastest for participating states.', duration: '20 min', type: 'action' },
      { id: 'pay', title: 'Pay Fee', description: 'Fees vary by state ($15-50). Expedited shipping available.', duration: '5 min', type: 'payment' },
      { id: 'receive', title: 'Receive Certificate', description: 'Standard mail: 2-6 weeks. Expedited: 1-2 weeks.', duration: '2-6 weeks', type: 'wait' }
    ],
    documents: ['Photo ID copy', 'Application form', 'Payment'],
    tips: [
      'VitalChek.com processes requests for many states',
      'Order multiple certified copies at once',
      'Keep original in safe place'
    ],
    warnings: ['Only certified copies accepted for official purposes', 'Hospital certificates are NOT certified copies']
  },

  'social-security-card': {
    id: 'social-security-card',
    name: 'Social Security Card Replacement',
    category: 'documents',
    complexity: 3.0,
    timeEstimate: '2-4 weeks',
    cost: 'Free',
    description: 'Replace a lost or stolen Social Security card.',
    steps: [
      { id: 'account', title: 'Create my Social Security Account', description: 'Go to ssa.gov and create account. May be able to request card online if eligible.', duration: '15 min', type: 'action' },
      { id: 'form', title: 'Complete SS-5 Form', description: 'If not eligible online, complete Form SS-5 (Application for Social Security Card).', duration: '15 min', type: 'document' },
      { id: 'docs', title: 'Gather Documents', description: 'Proof of identity (driver\'s license, passport), proof of citizenship if not on file.', duration: '10 min', type: 'document' },
      { id: 'submit', title: 'Submit Application', description: 'Online, by mail, or at local Social Security office. In-person requires appointment.', duration: '15-60 min', type: 'action' },
      { id: 'receive', title: 'Receive New Card', description: 'Card arrives by mail in 2-4 weeks. You\'re limited to 3 replacements per year.', duration: '2-4 weeks', type: 'wait' }
    ],
    documents: ['Photo ID', 'Proof of citizenship (if needed)', 'Form SS-5'],
    tips: [
      'You rarely need the physical card - memorize your number',
      'Online replacement is fastest if eligible',
      'Limited to 3 per year, 10 lifetime'
    ],
    warnings: ['Never carry card in wallet', 'Report stolen cards to prevent identity theft']
  },

  // ============ VEHICLES ============
  'vehicle-registration': {
    id: 'vehicle-registration',
    name: 'Vehicle Registration (New)',
    category: 'vehicles',
    complexity: 4.5,
    timeEstimate: '1-3 hours',
    cost: '$50-500+',
    description: 'Register a newly purchased vehicle in your state.',
    steps: [
      { id: 'title', title: 'Obtain Title', description: 'Get signed title from seller (private sale) or dealer handles if dealership.', duration: 'Immediate', type: 'document' },
      { id: 'insurance', title: 'Get Insurance', description: 'Obtain auto insurance meeting state minimums. Get insurance card.', duration: '30 min', type: 'action' },
      { id: 'inspection', title: 'Pass Inspection (if required)', description: 'Some states require safety and/or emissions inspection.', duration: '30-60 min', type: 'action' },
      { id: 'form', title: 'Complete Application', description: 'Fill out title/registration application form.', duration: '15 min', type: 'document' },
      { id: 'visit', title: 'Visit DMV', description: 'Bring all documents. Some states allow online for dealer purchases.', duration: '1-2 hours', type: 'action' },
      { id: 'pay', title: 'Pay Fees', description: 'Registration fee + title fee + sales tax (if not paid at purchase).', duration: '10 min', type: 'payment' },
      { id: 'plates', title: 'Receive Plates', description: 'Get license plates immediately or by mail. Attach to vehicle.', duration: 'Immediate', type: 'action' }
    ],
    documents: ['Signed title', 'Bill of sale', 'Insurance card', 'Photo ID', 'Inspection certificate', 'Payment'],
    tips: [
      'Deadline is usually 30 days from purchase',
      'Make appointment to avoid DMV lines',
      'Calculate sales tax in advance'
    ],
    warnings: ['Fines for late registration', 'Cannot drive unregistered vehicle legally']
  },

  'vehicle-title-transfer': {
    id: 'vehicle-title-transfer',
    name: 'Vehicle Title Transfer',
    category: 'vehicles',
    complexity: 4.2,
    timeEstimate: '1-2 hours',
    cost: '$15-75',
    description: 'Transfer vehicle title when buying or receiving a car from another person.',
    steps: [
      { id: 'verify', title: 'Verify Title', description: 'Ensure seller\'s name matches title. Check for liens - must be released first.', duration: '10 min', type: 'research' },
      { id: 'sign', title: 'Complete Title', description: 'Seller signs title, fills in buyer info, odometer reading, sale price, date.', duration: '10 min', type: 'document' },
      { id: 'bill', title: 'Get Bill of Sale', description: 'Create bill of sale with VIN, sale price, both parties\' info, date, signatures.', duration: '15 min', type: 'document' },
      { id: 'form', title: 'Complete Application', description: 'Fill out title transfer application form for your state.', duration: '15 min', type: 'document' },
      { id: 'submit', title: 'Submit to DMV', description: 'Bring all documents to DMV. Some states allow mail-in.', duration: '30-60 min', type: 'action' },
      { id: 'receive', title: 'Receive New Title', description: 'New title in your name arrives in 2-6 weeks by mail.', duration: '2-6 weeks', type: 'wait' }
    ],
    documents: ['Signed title', 'Bill of sale', 'Lien release (if applicable)', 'Photo ID', 'Application form', 'Payment'],
    tips: [
      'Meet at bank or DMV for secure transaction',
      'Verify VIN matches title before paying',
      'Seller should keep copy of signed title'
    ],
    warnings: ['Open titles (no buyer info) can cause problems', 'Verify no odometer tampering']
  },

  // ============ BENEFITS ============
  'snap-benefits': {
    id: 'snap-benefits',
    name: 'SNAP Benefits Application',
    category: 'benefits',
    complexity: 6.5,
    timeEstimate: '30 days',
    cost: 'Free',
    description: 'Apply for Supplemental Nutrition Assistance Program (food stamps).',
    steps: [
      { id: 'screen', title: 'Pre-Screen Eligibility', description: 'Use online screening tool to check if household may qualify based on income/size.', duration: '10 min', type: 'research' },
      { id: 'apply', title: 'Submit Application', description: 'Apply online, by mail, fax, or in-person at local SNAP office.', duration: '30-60 min', type: 'action' },
      { id: 'interview', title: 'Complete Interview', description: 'Phone or in-person interview with caseworker. Schedule within 30 days.', duration: '30-45 min', type: 'action' },
      { id: 'verify', title: 'Submit Verification', description: 'Provide documents proving income, expenses, identity, residency.', duration: '1-2 weeks', type: 'document' },
      { id: 'decision', title: 'Receive Decision', description: 'Decision made within 30 days (7 days if expedited eligible).', duration: '7-30 days', type: 'wait' },
      { id: 'card', title: 'Receive EBT Card', description: 'If approved, EBT card arrives by mail. Benefits loaded monthly.', duration: '3-7 days', type: 'wait' }
    ],
    documents: ['Photo ID', 'Social Security cards (all household)', 'Proof of income', 'Rent/mortgage statements', 'Utility bills', 'Bank statements'],
    tips: [
      'Apply as soon as need arises - benefits can be retroactive',
      'Expedited processing if very low income/resources',
      'Include all household members who buy/prepare food together'
    ],
    warnings: ['Report changes within 10 days', 'Benefits can be reduced/ended for unreported changes']
  },

  'medicaid-application': {
    id: 'medicaid-application',
    name: 'Medicaid Application',
    category: 'benefits',
    complexity: 7.1,
    timeEstimate: '45-90 days',
    cost: 'Free',
    description: 'Apply for Medicaid health insurance coverage.',
    steps: [
      { id: 'screen', title: 'Check Eligibility', description: 'Review income limits for your state and household size. Expansion states have higher limits.', duration: '15 min', type: 'research' },
      { id: 'apply', title: 'Submit Application', description: 'Apply via Healthcare.gov, state Medicaid website, by phone, mail, or in-person.', duration: '45-60 min', type: 'action' },
      { id: 'docs', title: 'Gather Documentation', description: 'Collect proof of income, citizenship/immigration status, residency, identity.', duration: '1-2 weeks', type: 'document' },
      { id: 'verify', title: 'Submit Verification', description: 'Upload or mail requested documents. Respond to all requests promptly.', duration: '15-30 min', type: 'action' },
      { id: 'interview', title: 'Complete Interview (if required)', description: 'Some states require phone interview. Answer questions about household.', duration: '30 min', type: 'action' },
      { id: 'wait', title: 'Await Decision', description: 'Standard: 45 days. Disability-based: 90 days apply.', duration: '45-90 days', type: 'wait' },
      { id: 'enroll', title: 'Select Plan/Provider', description: 'If approved, choose managed care plan (if applicable) and primary care provider.', duration: '30 min', type: 'action' }
    ],
    documents: ['Photo ID', 'Social Security card', 'Proof of income (all household)', 'Citizenship/immigration documents', 'Proof of residency'],
    tips: [
      'Apply during open enrollment or after qualifying life event',
      'Presumptive eligibility may provide temporary coverage while application processes',
      'Check for auto-enrollment if receiving other benefits'
    ],
    warnings: ['Coverage effective date varies by state', 'Must renew annually']
  },

  'unemployment-benefits': {
    id: 'unemployment-benefits',
    name: 'Unemployment Benefits Claim',
    category: 'benefits',
    complexity: 5.5,
    timeEstimate: '2-4 weeks',
    cost: 'Free',
    description: 'File for unemployment insurance after job loss.',
    steps: [
      { id: 'gather', title: 'Gather Employment Info', description: 'Collect employer names, addresses, dates of employment, earnings from past 18 months.', duration: '30 min', type: 'document' },
      { id: 'file', title: 'File Initial Claim', description: 'File online through state unemployment website. Complete all sections.', duration: '45-60 min', type: 'action' },
      { id: 'register', title: 'Register for Work', description: 'Create account on state job search website. Required for most states.', duration: '20 min', type: 'action' },
      { id: 'verify', title: 'Employer Verification', description: 'Former employer has 10 days to respond to claim. May contest.', duration: '10 days', type: 'wait' },
      { id: 'certify', title: 'Certify Weekly', description: 'Complete weekly certification - report job search activities, any earnings.', duration: '15 min/week', type: 'action' },
      { id: 'receive', title: 'Receive Benefits', description: 'If approved, first payment arrives 2-4 weeks after filing. Then weekly/bi-weekly.', duration: '2-4 weeks', type: 'wait' }
    ],
    documents: ['Social Security number', 'Photo ID', 'Employment history (18 months)', 'Earnings records', 'Separation reason', 'Direct deposit info'],
    tips: [
      'File immediately after job loss - there\'s a waiting week',
      'Keep detailed job search records',
      'Report ALL earnings, even part-time work'
    ],
    warnings: ['Fraud penalties are severe', 'Must actively seek work to remain eligible']
  },

  // ============ BUSINESS ============
  'business-license': {
    id: 'business-license',
    name: 'Business License Application',
    category: 'business',
    complexity: 5.8,
    timeEstimate: '1-4 weeks',
    cost: '$50-500+',
    description: 'Obtain a general business license to operate legally.',
    steps: [
      { id: 'structure', title: 'Choose Business Structure', description: 'Decide: sole proprietorship, LLC, corporation. Register with state if needed.', duration: '1-3 days', type: 'research' },
      { id: 'name', title: 'Register Business Name', description: 'File DBA (Doing Business As) if using name other than your own.', duration: '1-2 weeks', type: 'action' },
      { id: 'ein', title: 'Get EIN', description: 'Apply for Employer Identification Number from IRS (free, instant online).', duration: '15 min', type: 'action' },
      { id: 'local', title: 'Apply for Local License', description: 'Complete city/county business license application.', duration: '30 min', type: 'document' },
      { id: 'zoning', title: 'Verify Zoning', description: 'Confirm business location is zoned for your business type.', duration: '1-3 days', type: 'research' },
      { id: 'permits', title: 'Obtain Additional Permits', description: 'Health permit (food), fire permit, signage permit as needed.', duration: '1-4 weeks', type: 'action' },
      { id: 'pay', title: 'Pay Fees', description: 'Pay license fee. Amount varies by business type and location.', duration: '10 min', type: 'payment' }
    ],
    documents: ['Photo ID', 'EIN letter', 'Lease/property ownership proof', 'Business formation documents', 'Zoning approval'],
    tips: [
      'Check state-specific requirements for your industry',
      'Some businesses need professional licenses too',
      'Set reminder for annual renewal'
    ],
    warnings: ['Operating without license = fines', 'Some industries heavily regulated']
  },

  'llc-formation': {
    id: 'llc-formation',
    name: 'LLC Formation',
    category: 'business',
    complexity: 4.8,
    timeEstimate: '1-2 weeks',
    cost: '$50-500',
    description: 'Form a Limited Liability Company for your business.',
    steps: [
      { id: 'name', title: 'Choose LLC Name', description: 'Must be unique in your state, include "LLC" or "Limited Liability Company".', duration: '1 hour', type: 'research' },
      { id: 'agent', title: 'Designate Registered Agent', description: 'Person or service to receive legal documents. Can be yourself.', duration: '15 min', type: 'action' },
      { id: 'file', title: 'File Articles of Organization', description: 'Submit formation document to Secretary of State online or by mail.', duration: '30 min', type: 'document' },
      { id: 'pay', title: 'Pay Filing Fee', description: 'State filing fee varies ($50-500). Some states have annual fees.', duration: '5 min', type: 'payment' },
      { id: 'agreement', title: 'Create Operating Agreement', description: 'Internal document outlining ownership and operations. Not always required but recommended.', duration: '1-2 hours', type: 'document' },
      { id: 'ein', title: 'Get EIN', description: 'Apply for federal tax ID number from IRS website.', duration: '15 min', type: 'action' },
      { id: 'compliance', title: 'Set Up Compliance', description: 'Annual reports, franchise taxes, business licenses as required.', duration: '30 min', type: 'action' }
    ],
    documents: ['Articles of Organization', 'Operating Agreement', 'EIN confirmation'],
    tips: [
      'Wyoming/Delaware popular for privacy/tax benefits',
      'Single-member LLC can use personal SSN initially',
      'Keep business and personal finances separate'
    ],
    warnings: ['Annual report deadlines vary by state', 'Failure to maintain can dissolve LLC']
  },

  // ============ PROPERTY ============
  'property-tax-appeal': {
    id: 'property-tax-appeal',
    name: 'Property Tax Assessment Appeal',
    category: 'property',
    complexity: 6.2,
    timeEstimate: '2-6 months',
    cost: 'Free - $500',
    description: 'Challenge your property\'s assessed value to lower property taxes.',
    steps: [
      { id: 'review', title: 'Review Assessment', description: 'Get assessment notice, understand how value was determined.', duration: '30 min', type: 'research' },
      { id: 'compare', title: 'Research Comparables', description: 'Find similar properties that sold for less or were assessed lower.', duration: '2-4 hours', type: 'research' },
      { id: 'evidence', title: 'Gather Evidence', description: 'Photos of property issues, repair estimates, comparable sales data.', duration: '1-2 weeks', type: 'document' },
      { id: 'file', title: 'File Appeal', description: 'Submit formal appeal to assessor\'s office by deadline (usually 30-90 days from notice).', duration: '1-2 hours', type: 'document' },
      { id: 'informal', title: 'Informal Review', description: 'Meet with assessor to discuss. Many appeals resolved here.', duration: '30-60 min', type: 'action' },
      { id: 'hearing', title: 'Formal Hearing', description: 'If not resolved, present case to Board of Review or equivalent.', duration: '1-2 hours', type: 'action' },
      { id: 'decision', title: 'Receive Decision', description: 'Board issues ruling. Can appeal further to state board or court.', duration: '2-8 weeks', type: 'wait' }
    ],
    documents: ['Assessment notice', 'Comparable sales data', 'Photos', 'Repair estimates', 'Appraisal (optional)'],
    tips: [
      'Deadlines are strict - mark calendar',
      'Focus on factual errors and comparables',
      'Professional appraisal helps but has cost'
    ],
    warnings: ['Appeal could raise your assessment', 'Missing deadline = no appeal that year']
  },

  'building-permit': {
    id: 'building-permit',
    name: 'Building Permit Application',
    category: 'property',
    complexity: 6.8,
    timeEstimate: '2-12 weeks',
    cost: '$100-2000+',
    description: 'Obtain permit for construction, renovation, or major repairs.',
    steps: [
      { id: 'determine', title: 'Determine Permit Needs', description: 'Check if project requires permit. Most structural, electrical, plumbing work does.', duration: '30 min', type: 'research' },
      { id: 'plans', title: 'Prepare Plans', description: 'Create or obtain construction drawings, site plans. May need licensed architect.', duration: '1-4 weeks', type: 'document' },
      { id: 'apply', title: 'Submit Application', description: 'Complete permit application, submit plans to building department.', duration: '1-2 hours', type: 'document' },
      { id: 'review', title: 'Plan Review', description: 'Department reviews for code compliance. May request revisions.', duration: '2-8 weeks', type: 'wait' },
      { id: 'pay', title: 'Pay Fees', description: 'Permit fee based on project value. Additional fees for inspections.', duration: '15 min', type: 'payment' },
      { id: 'permit', title: 'Receive Permit', description: 'Post permit visibly at job site. Valid for limited time.', duration: '1-3 days', type: 'action' },
      { id: 'inspect', title: 'Schedule Inspections', description: 'Required at various stages: foundation, framing, final.', duration: 'Ongoing', type: 'action' },
      { id: 'final', title: 'Final Approval', description: 'Pass final inspection to close permit and get certificate of occupancy.', duration: '1-2 weeks', type: 'wait' }
    ],
    documents: ['Construction drawings', 'Site plan', 'Contractor licenses', 'HOA approval (if applicable)', 'Engineering reports'],
    tips: [
      'Talk to building dept before applying',
      'Unpermitted work = problems selling',
      'Budget 10-15% of project for permits/fees'
    ],
    warnings: ['Work without permit = fines, tear-down orders', 'Insurance may not cover unpermitted work']
  },

  // ============ LEGAL ============
  'name-change': {
    id: 'name-change',
    name: 'Legal Name Change',
    category: 'legal',
    complexity: 5.5,
    timeEstimate: '2-3 months',
    cost: '$150-500',
    description: 'Legally change your name through the court system.',
    steps: [
      { id: 'petition', title: 'File Petition', description: 'Complete name change petition form for your county court.', duration: '1-2 hours', type: 'document' },
      { id: 'fingerprint', title: 'Background Check', description: 'Some courts require fingerprinting and criminal background check.', duration: '30-60 min', type: 'action' },
      { id: 'pay', title: 'Pay Filing Fee', description: 'Court filing fee ($150-400). Fee waiver available for low income.', duration: '15 min', type: 'payment' },
      { id: 'publish', title: 'Publish Notice', description: 'Many states require publishing name change in local newspaper for 2-4 weeks.', duration: '2-4 weeks', type: 'action' },
      { id: 'hearing', title: 'Attend Hearing', description: 'Appear before judge. Most approved if no objections.', duration: '15-30 min', type: 'action' },
      { id: 'decree', title: 'Receive Court Order', description: 'Get certified copies of name change decree ($5-20 each).', duration: '1-2 weeks', type: 'wait' },
      { id: 'update', title: 'Update Records', description: 'Use decree to update Social Security, DMV, passport, banks, etc.', duration: '2-4 weeks', type: 'action' }
    ],
    documents: ['Petition form', 'Birth certificate', 'Photo ID', 'Background check results', 'Court filing fee'],
    tips: [
      'Order multiple certified copies of decree',
      'Start with Social Security, then DMV',
      'Keep list of everywhere name appears'
    ],
    warnings: ['Cannot change name to avoid debts/legal issues', 'Some restrictions on name choices']
  },

  'small-claims-court': {
    id: 'small-claims-court',
    name: 'Small Claims Court Filing',
    category: 'legal',
    complexity: 4.5,
    timeEstimate: '1-3 months',
    cost: '$30-100',
    description: 'Sue someone for money owed (usually under $10,000).',
    steps: [
      { id: 'demand', title: 'Send Demand Letter', description: 'Required in many jurisdictions. Request payment in writing first.', duration: '30 min', type: 'document' },
      { id: 'forms', title: 'Complete Court Forms', description: 'Fill out plaintiff\'s claim form with details of dispute.', duration: '1 hour', type: 'document' },
      { id: 'file', title: 'File with Court', description: 'File claim at courthouse for county where defendant lives or incident occurred.', duration: '30-60 min', type: 'action' },
      { id: 'pay', title: 'Pay Filing Fee', description: 'Fee based on claim amount ($30-100 typically).', duration: '10 min', type: 'payment' },
      { id: 'serve', title: 'Serve Defendant', description: 'Defendant must be formally notified. Sheriff, process server, or certified mail.', duration: '1-3 weeks', type: 'action' },
      { id: 'prepare', title: 'Prepare Evidence', description: 'Organize contracts, photos, receipts, witness statements.', duration: '2-4 hours', type: 'document' },
      { id: 'hearing', title: 'Attend Hearing', description: 'Present your case to judge. No attorneys in most small claims courts.', duration: '30-60 min', type: 'action' },
      { id: 'judgment', title: 'Receive Judgment', description: 'Judge rules immediately or by mail. Winning doesn\'t guarantee collection.', duration: 'Immediate-2 weeks', type: 'wait' }
    ],
    documents: ['Demand letter copy', 'Contracts/agreements', 'Photos/evidence', 'Receipts', 'Witness info', 'Proof of service'],
    tips: [
      'Bring organized evidence',
      'Practice explaining clearly and briefly',
      'Consider settlement before trial'
    ],
    warnings: ['Winning ≠ collecting - separate process', 'Can be counter-sued']
  },

  'expungement': {
    id: 'expungement',
    name: 'Criminal Record Expungement',
    category: 'legal',
    complexity: 7.5,
    timeEstimate: '3-6 months',
    cost: '$100-1500',
    description: 'Seal or expunge criminal records from public view.',
    steps: [
      { id: 'records', title: 'Obtain Criminal Records', description: 'Request your complete criminal history from state police or court.', duration: '1-4 weeks', type: 'document' },
      { id: 'eligible', title: 'Determine Eligibility', description: 'Review state laws - waiting periods, offense types, completion of sentence.', duration: '1-2 hours', type: 'research' },
      { id: 'petition', title: 'Prepare Petition', description: 'Complete expungement petition with case numbers, charges, dispositions.', duration: '2-4 hours', type: 'document' },
      { id: 'file', title: 'File Petition', description: 'File with court that handled original case. Pay filing fee.', duration: '1-2 hours', type: 'action' },
      { id: 'notify', title: 'Notify Prosecutors', description: 'Serve petition on district attorney. They may object.', duration: '2-4 weeks', type: 'action' },
      { id: 'hearing', title: 'Attend Hearing', description: 'Some cases decided on papers; others require hearing.', duration: '30-60 min', type: 'action' },
      { id: 'order', title: 'Receive Order', description: 'If granted, receive expungement order. Distribute to relevant agencies.', duration: '2-6 weeks', type: 'wait' },
      { id: 'verify', title: 'Verify Completion', description: 'Check that records are sealed from background check services.', duration: '1-3 months', type: 'action' }
    ],
    documents: ['Criminal record', 'Petition form', 'Proof of sentence completion', 'Character references', 'Employment/education proof'],
    tips: [
      'Some states have free legal clinics for expungement',
      'Many states expanding automatic expungement',
      'Check all counties where arrested/convicted'
    ],
    warnings: ['Not all offenses eligible', 'May still appear on some government checks']
  }
};

// Helper functions
export const getProcessById = (id) => PROCESSES[id];

export const getProcessesByCategory = (category) => 
  Object.values(PROCESSES).filter(p => p.category === category);

export const getAllProcesses = () => Object.values(PROCESSES);

export const searchProcesses = (query) => {
  const lower = query.toLowerCase();
  return Object.values(PROCESSES).filter(p => 
    p.name.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower) ||
    p.category.toLowerCase().includes(lower)
  );
};

export const getComplexityLabel = (score) => {
  if (score <= 3) return { label: 'Low', color: 'green' };
  if (score <= 5) return { label: 'Moderate', color: 'yellow' };
  if (score <= 7) return { label: 'High', color: 'orange' };
  return { label: 'Very High', color: 'red' };
};

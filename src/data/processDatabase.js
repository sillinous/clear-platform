// Expanded ProcessMap Data - 18 Government Processes
// Each process includes steps, timelines, documents, and tips

export const PROCESS_DATABASE = {
  // ============ VEHICLES & TRANSPORTATION ============
  'drivers-license-renewal': {
    id: 'drivers-license-renewal',
    title: "Driver's License Renewal",
    category: 'vehicles',
    icon: '🚗',
    difficulty: 'easy',
    timeEstimate: '1-2 hours',
    cost: '$25-50',
    description: 'Renew your state driver\'s license before expiration',
    overview: 'Most states allow online renewal if your license hasn\'t been expired for too long and you don\'t need a new photo.',
    steps: [
      { id: 1, title: 'Check Eligibility', description: 'Verify you qualify for renewal (not expired >2 years, no major violations)', duration: '5 min', type: 'research' },
      { id: 2, title: 'Gather Documents', description: 'Current license, proof of address if required', duration: '10 min', type: 'document' },
      { id: 3, title: 'Choose Method', description: 'Online, mail, or in-person at DMV', duration: '5 min', type: 'decision' },
      { id: 4, title: 'Complete Application', description: 'Fill out renewal form with current information', duration: '15 min', type: 'form' },
      { id: 5, title: 'Pay Fee', description: 'Pay renewal fee ($25-50 depending on state)', duration: '5 min', type: 'payment' },
      { id: 6, title: 'Vision Test', description: 'If in-person, complete vision screening', duration: '5 min', type: 'test', conditional: true },
      { id: 7, title: 'Receive License', description: 'Get temporary license immediately, permanent by mail in 2-4 weeks', duration: '2-4 weeks', type: 'waiting' }
    ],
    documents: ['Current driver\'s license', 'Proof of address (if required)', 'Payment method'],
    tips: ['Check if you can renew online first', 'Schedule DMV appointment to avoid long waits', 'Some states allow renewal up to 6 months early'],
    warnings: ['Driving with expired license is illegal', 'Some states require vision test every renewal'],
    relatedProcesses: ['vehicle-registration', 'real-id']
  },

  'vehicle-registration': {
    id: 'vehicle-registration',
    title: 'Vehicle Registration Renewal',
    category: 'vehicles',
    icon: '📋',
    difficulty: 'easy',
    timeEstimate: '30 min - 1 hour',
    cost: '$50-200',
    description: 'Renew your vehicle registration annually',
    overview: 'Vehicle registration must be renewed annually. Most states allow online renewal.',
    steps: [
      { id: 1, title: 'Receive Renewal Notice', description: 'DMV sends notice 1-2 months before expiration', duration: 'Automatic', type: 'notification' },
      { id: 2, title: 'Emissions Test', description: 'If required in your area, get vehicle tested', duration: '30 min', type: 'test', conditional: true },
      { id: 3, title: 'Verify Insurance', description: 'Ensure auto insurance is current and on file', duration: '5 min', type: 'verification' },
      { id: 4, title: 'Pay Registration Fee', description: 'Online, by mail, or at DMV/kiosk', duration: '10 min', type: 'payment' },
      { id: 5, title: 'Receive Sticker/Card', description: 'New registration sticker mailed or printed', duration: '1-2 weeks', type: 'waiting' },
      { id: 6, title: 'Apply Sticker', description: 'Place new sticker on license plate', duration: '2 min', type: 'action' }
    ],
    documents: ['Current registration', 'Proof of insurance', 'Emissions certificate (if required)'],
    tips: ['Many states have kiosks at grocery stores for quick renewal', 'Set calendar reminder 1 month before expiration'],
    warnings: ['Expired registration can result in tickets', 'Some areas require emissions test first'],
    relatedProcesses: ['drivers-license-renewal', 'vehicle-title-transfer']
  },

  'vehicle-title-transfer': {
    id: 'vehicle-title-transfer',
    title: 'Vehicle Title Transfer',
    category: 'vehicles',
    icon: '📝',
    difficulty: 'moderate',
    timeEstimate: '1-3 hours',
    cost: '$15-75',
    description: 'Transfer vehicle ownership when buying/selling a car',
    overview: 'When buying or selling a vehicle, the title must be transferred to the new owner within a specific timeframe.',
    steps: [
      { id: 1, title: 'Obtain Title', description: 'Seller provides signed title with sale information', duration: '10 min', type: 'document' },
      { id: 2, title: 'Bill of Sale', description: 'Complete bill of sale with purchase details', duration: '10 min', type: 'form' },
      { id: 3, title: 'Odometer Disclosure', description: 'Record current mileage (required for vehicles <10 years)', duration: '5 min', type: 'form' },
      { id: 4, title: 'Get Insurance', description: 'Obtain insurance before driving/registering', duration: '30 min', type: 'action' },
      { id: 5, title: 'Visit DMV', description: 'Submit paperwork and pay transfer fees', duration: '1-2 hours', type: 'in-person' },
      { id: 6, title: 'Pay Taxes', description: 'Pay sales tax on purchase price', duration: '10 min', type: 'payment' },
      { id: 7, title: 'Receive New Title', description: 'New title issued in your name', duration: '2-6 weeks', type: 'waiting' }
    ],
    documents: ['Signed title from seller', 'Bill of sale', 'Your ID', 'Proof of insurance', 'Payment for fees/taxes'],
    tips: ['Check for liens on vehicle before purchase', 'Many states have online title status lookup'],
    warnings: ['Must transfer within 30 days in most states', 'Never buy a car without a clear title'],
    relatedProcesses: ['vehicle-registration']
  },

  // ============ VITAL DOCUMENTS ============
  'birth-certificate': {
    id: 'birth-certificate',
    title: 'Birth Certificate Copy',
    category: 'documents',
    icon: '👶',
    difficulty: 'easy',
    timeEstimate: '1-4 weeks',
    cost: '$10-30',
    description: 'Obtain a certified copy of your birth certificate',
    overview: 'Birth certificates are issued by the vital records office in the state where you were born.',
    steps: [
      { id: 1, title: 'Identify Vital Records Office', description: 'Find the office for your birth state', duration: '5 min', type: 'research' },
      { id: 2, title: 'Complete Application', description: 'Fill out request form with birth details', duration: '15 min', type: 'form' },
      { id: 3, title: 'Gather ID', description: 'Copy of government-issued ID required', duration: '5 min', type: 'document' },
      { id: 4, title: 'Submit Request', description: 'Online, by mail, or in-person', duration: '10 min', type: 'submission' },
      { id: 5, title: 'Pay Fee', description: 'Typically $10-30 per copy', duration: '5 min', type: 'payment' },
      { id: 6, title: 'Receive Certificate', description: 'Mailed to you in 1-4 weeks', duration: '1-4 weeks', type: 'waiting' }
    ],
    documents: ['Government-issued ID', 'Proof of relationship (if requesting for someone else)'],
    tips: ['VitalChek is an official online service for many states', 'Order multiple copies if needed for other applications'],
    warnings: ['Only certified copies are accepted for official purposes', 'Processing times vary significantly by state'],
    relatedProcesses: ['passport-application', 'real-id', 'name-change']
  },

  'passport-application': {
    id: 'passport-application',
    title: 'Passport Application (First-Time)',
    category: 'documents',
    icon: '🛂',
    difficulty: 'moderate',
    timeEstimate: '6-11 weeks',
    cost: '$165',
    description: 'Apply for your first U.S. passport',
    overview: 'First-time passport applicants must apply in person at an acceptance facility.',
    steps: [
      { id: 1, title: 'Complete DS-11', description: 'Fill out Form DS-11 (do not sign yet)', duration: '30 min', type: 'form' },
      { id: 2, title: 'Gather Citizenship Evidence', description: 'Birth certificate or naturalization certificate', duration: '10 min', type: 'document' },
      { id: 3, title: 'Get Passport Photo', description: '2x2 inch photo meeting specific requirements', duration: '15 min', type: 'action' },
      { id: 4, title: 'Bring ID', description: 'Driver\'s license or state ID', duration: '5 min', type: 'document' },
      { id: 5, title: 'Schedule Appointment', description: 'Book at post office or acceptance facility', duration: '10 min', type: 'scheduling' },
      { id: 6, title: 'Apply In-Person', description: 'Submit application and sign in front of agent', duration: '30 min', type: 'in-person' },
      { id: 7, title: 'Pay Fees', description: '$130 application + $35 execution fee', duration: '5 min', type: 'payment' },
      { id: 8, title: 'Wait for Processing', description: 'Standard: 6-8 weeks, Expedited: 2-3 weeks', duration: '6-8 weeks', type: 'waiting' }
    ],
    documents: ['Form DS-11', 'Citizenship evidence', 'ID', 'Passport photo', 'Payment'],
    tips: ['Apply 3+ months before travel', 'Expedited service costs extra $60', 'Can track status online'],
    warnings: ['Cannot sign DS-11 before your appointment', 'Photos have strict requirements'],
    relatedProcesses: ['passport-renewal', 'birth-certificate']
  },

  'real-id': {
    id: 'real-id',
    title: 'REAL ID Application',
    category: 'documents',
    icon: '🪪',
    difficulty: 'moderate',
    timeEstimate: '1-3 hours',
    cost: '$30-60',
    description: 'Upgrade to a REAL ID compliant driver\'s license or ID',
    overview: 'REAL ID will be required for domestic flights and federal facilities starting May 2025.',
    steps: [
      { id: 1, title: 'Check Requirements', description: 'Verify your state\'s specific document requirements', duration: '10 min', type: 'research' },
      { id: 2, title: 'Gather Identity Proof', description: 'Passport, birth certificate, or citizenship docs', duration: '15 min', type: 'document' },
      { id: 3, title: 'Gather SSN Proof', description: 'Social Security card or W-2', duration: '5 min', type: 'document' },
      { id: 4, title: 'Gather Residency Proof', description: 'Two documents showing current address', duration: '10 min', type: 'document' },
      { id: 5, title: 'Schedule Appointment', description: 'Book DMV appointment online', duration: '10 min', type: 'scheduling' },
      { id: 6, title: 'Visit DMV', description: 'Bring all documents, complete application', duration: '1-2 hours', type: 'in-person' },
      { id: 7, title: 'Pay Fee', description: 'Varies by state, typically $30-60', duration: '5 min', type: 'payment' },
      { id: 8, title: 'Receive REAL ID', description: 'Mailed in 2-4 weeks', duration: '2-4 weeks', type: 'waiting' }
    ],
    documents: ['Identity proof (passport or birth cert)', 'SSN proof', 'Two residency proofs', 'Current license'],
    tips: ['Many states allow you to renew and upgrade simultaneously', 'Marriage certificate needed if name differs'],
    warnings: ['Without REAL ID, you\'ll need passport for domestic flights', 'Document requirements are strict'],
    relatedProcesses: ['drivers-license-renewal', 'birth-certificate']
  },

  // ============ BENEFITS & ASSISTANCE ============
  'snap-benefits': {
    id: 'snap-benefits',
    title: 'SNAP Benefits (Food Stamps)',
    category: 'benefits',
    icon: '🍎',
    difficulty: 'moderate',
    timeEstimate: '30 days',
    cost: 'Free',
    description: 'Apply for Supplemental Nutrition Assistance Program benefits',
    overview: 'SNAP helps low-income households buy groceries. Benefits are loaded onto an EBT card monthly.',
    steps: [
      { id: 1, title: 'Check Eligibility', description: 'Income must be below 130% of poverty level', duration: '15 min', type: 'research' },
      { id: 2, title: 'Gather Documents', description: 'ID, income proof, expenses, household info', duration: '30 min', type: 'document' },
      { id: 3, title: 'Submit Application', description: 'Online, in-person, by mail, or by fax', duration: '45 min', type: 'form' },
      { id: 4, title: 'Complete Interview', description: 'Phone or in-person interview with caseworker', duration: '30 min', type: 'interview' },
      { id: 5, title: 'Provide Verification', description: 'Submit any additional documents requested', duration: 'varies', type: 'document' },
      { id: 6, title: 'Receive Decision', description: 'Within 30 days (7 days for expedited)', duration: '7-30 days', type: 'waiting' },
      { id: 7, title: 'Receive EBT Card', description: 'Card mailed or picked up at office', duration: '3-7 days', type: 'waiting' }
    ],
    documents: ['ID for all household members', 'Proof of income', 'Rent/mortgage statement', 'Utility bills', 'Social Security numbers'],
    tips: ['Apply even if unsure - you may qualify', 'Many states have online portals', 'Benefits can be expedited in emergencies'],
    warnings: ['Must report changes in income/household', 'Must recertify periodically'],
    relatedProcesses: ['medicaid-application']
  },

  'medicaid-application': {
    id: 'medicaid-application',
    title: 'Medicaid Application',
    category: 'benefits',
    icon: '🏥',
    difficulty: 'moderate',
    timeEstimate: '45 days',
    cost: 'Free',
    description: 'Apply for Medicaid health insurance coverage',
    overview: 'Medicaid provides free or low-cost health coverage based on income and household size.',
    steps: [
      { id: 1, title: 'Check Eligibility', description: 'Income limits vary by state and category', duration: '15 min', type: 'research' },
      { id: 2, title: 'Choose Application Method', description: 'Healthcare.gov, state website, phone, or in-person', duration: '10 min', type: 'decision' },
      { id: 3, title: 'Gather Information', description: 'Income, household, current coverage details', duration: '20 min', type: 'document' },
      { id: 4, title: 'Complete Application', description: 'Answer questions about household and income', duration: '30-45 min', type: 'form' },
      { id: 5, title: 'Submit Documents', description: 'Provide verification if requested', duration: 'varies', type: 'document' },
      { id: 6, title: 'Wait for Decision', description: 'Usually within 45 days', duration: '45 days', type: 'waiting' },
      { id: 7, title: 'Enroll in Plan', description: 'Select a managed care plan if required', duration: '15 min', type: 'decision' }
    ],
    documents: ['ID', 'Social Security numbers', 'Proof of income', 'Immigration status docs (if applicable)'],
    tips: ['Apply through Healthcare.gov during open enrollment', 'Coverage can be retroactive up to 3 months'],
    warnings: ['Must report income changes', 'Annual renewal required'],
    relatedProcesses: ['snap-benefits']
  },

  'unemployment-benefits': {
    id: 'unemployment-benefits',
    title: 'Unemployment Benefits',
    category: 'benefits',
    icon: '💼',
    difficulty: 'moderate',
    timeEstimate: '2-4 weeks',
    cost: 'Free',
    description: 'File for unemployment insurance after job loss',
    overview: 'Unemployment insurance provides temporary income while you search for new employment.',
    steps: [
      { id: 1, title: 'File Initial Claim', description: 'Apply through state unemployment website', duration: '30-45 min', type: 'form' },
      { id: 2, title: 'Provide Work History', description: 'Last 18 months of employment information', duration: '20 min', type: 'form' },
      { id: 3, title: 'Wait for Determination', description: 'State verifies eligibility with employers', duration: '1-2 weeks', type: 'waiting' },
      { id: 4, title: 'Receive Decision', description: 'Get monetary determination letter', duration: '2-3 weeks', type: 'notification' },
      { id: 5, title: 'File Weekly Claims', description: 'Certify each week that you\'re job searching', duration: '10 min/week', type: 'recurring' },
      { id: 6, title: 'Document Job Search', description: 'Keep records of applications and contacts', duration: 'ongoing', type: 'action' }
    ],
    documents: ['Social Security number', 'Employment history', 'Employer contact information', 'Reason for separation'],
    tips: ['File immediately after job loss', 'Keep detailed records of job search activities', 'Appeal if denied'],
    warnings: ['Must actively seek work', 'Benefits are taxable income', 'Limited duration (usually 26 weeks)'],
    relatedProcesses: ['snap-benefits', 'medicaid-application']
  },

  // ============ BUSINESS ============
  'business-license': {
    id: 'business-license',
    title: 'Business License Application',
    category: 'business',
    icon: '🏪',
    difficulty: 'moderate',
    timeEstimate: '2-4 weeks',
    cost: '$50-500',
    description: 'Obtain a general business license to operate in your city/county',
    overview: 'Most businesses need a license from their city or county to operate legally.',
    steps: [
      { id: 1, title: 'Determine License Type', description: 'Research what licenses your business needs', duration: '30 min', type: 'research' },
      { id: 2, title: 'Register Business Name', description: 'File DBA if using a trade name', duration: '1-2 weeks', type: 'action', conditional: true },
      { id: 3, title: 'Get EIN', description: 'Apply for Employer Identification Number from IRS', duration: '10 min', type: 'form' },
      { id: 4, title: 'Zoning Verification', description: 'Confirm business location is properly zoned', duration: '1-3 days', type: 'verification' },
      { id: 5, title: 'Complete Application', description: 'Fill out business license application', duration: '30 min', type: 'form' },
      { id: 6, title: 'Pay Fees', description: 'License fees vary by business type and location', duration: '10 min', type: 'payment' },
      { id: 7, title: 'Receive License', description: 'Approval typically takes 1-4 weeks', duration: '1-4 weeks', type: 'waiting' }
    ],
    documents: ['Business entity documents', 'EIN confirmation', 'Lease agreement', 'Zoning approval', 'ID'],
    tips: ['Check if you need state licenses too', 'Some professions require additional certifications'],
    warnings: ['Operating without license can result in fines', 'Must renew annually'],
    relatedProcesses: ['sales-tax-permit', 'dba-registration']
  },

  'sales-tax-permit': {
    id: 'sales-tax-permit',
    title: 'Sales Tax Permit',
    category: 'business',
    icon: '🧾',
    difficulty: 'easy',
    timeEstimate: '1-2 weeks',
    cost: 'Free-$25',
    description: 'Register to collect and remit sales tax',
    overview: 'If you sell taxable goods or services, you need a sales tax permit from your state.',
    steps: [
      { id: 1, title: 'Determine Nexus', description: 'Confirm you have sales tax obligations in the state', duration: '15 min', type: 'research' },
      { id: 2, title: 'Gather Business Info', description: 'EIN, business address, ownership details', duration: '10 min', type: 'document' },
      { id: 3, title: 'Complete Application', description: 'Apply through state revenue department', duration: '20 min', type: 'form' },
      { id: 4, title: 'Receive Permit', description: 'Usually issued within 1-2 weeks', duration: '1-2 weeks', type: 'waiting' },
      { id: 5, title: 'Set Up Collection', description: 'Configure POS system to collect sales tax', duration: '30 min', type: 'action' },
      { id: 6, title: 'File Returns', description: 'Submit sales tax returns on schedule', duration: 'recurring', type: 'recurring' }
    ],
    documents: ['EIN', 'Business license', 'Business entity documents', 'Owner information'],
    tips: ['Many states offer online registration', 'Filing frequency depends on sales volume'],
    warnings: ['Failure to collect can result in penalties', 'Must file even if no sales'],
    relatedProcesses: ['business-license', 'ein-application']
  },

  // ============ PROPERTY ============
  'property-tax-appeal': {
    id: 'property-tax-appeal',
    title: 'Property Tax Assessment Appeal',
    category: 'property',
    icon: '🏠',
    difficulty: 'moderate',
    timeEstimate: '2-6 months',
    cost: 'Free-$100',
    description: 'Challenge your property tax assessment if you believe it\'s too high',
    overview: 'Property owners can appeal their assessment if comparable properties are valued lower.',
    steps: [
      { id: 1, title: 'Review Assessment', description: 'Get your property assessment notice', duration: '15 min', type: 'research' },
      { id: 2, title: 'Research Comparables', description: 'Find similar properties with lower assessments', duration: '1-2 hours', type: 'research' },
      { id: 3, title: 'Gather Evidence', description: 'Photos, inspection reports, comparable sales', duration: '1-2 hours', type: 'document' },
      { id: 4, title: 'File Appeal', description: 'Submit within deadline (usually 30-90 days)', duration: '30 min', type: 'form' },
      { id: 5, title: 'Informal Review', description: 'Meet with assessor to discuss', duration: '1-2 weeks', type: 'meeting' },
      { id: 6, title: 'Formal Hearing', description: 'Present case to review board if needed', duration: '1-3 months', type: 'hearing' },
      { id: 7, title: 'Receive Decision', description: 'Board issues ruling', duration: '1-2 months', type: 'waiting' }
    ],
    documents: ['Assessment notice', 'Comparable property data', 'Photos of property issues', 'Recent appraisal (if available)'],
    tips: ['Deadlines are strict - don\'t miss them', 'Many appeals are settled in informal review', 'Professional appraisal strengthens your case'],
    warnings: ['Assessment could potentially increase', 'Must have valid grounds for appeal'],
    relatedProcesses: ['homestead-exemption']
  },

  'homestead-exemption': {
    id: 'homestead-exemption',
    title: 'Homestead Exemption',
    category: 'property',
    icon: '🏡',
    difficulty: 'easy',
    timeEstimate: '2-4 weeks',
    cost: 'Free',
    description: 'Reduce property taxes on your primary residence',
    overview: 'Most states offer homestead exemptions that lower the taxable value of your home.',
    steps: [
      { id: 1, title: 'Verify Eligibility', description: 'Must be primary residence, owner-occupied', duration: '10 min', type: 'research' },
      { id: 2, title: 'Get Application', description: 'Obtain from county assessor or online', duration: '5 min', type: 'form' },
      { id: 3, title: 'Gather Documents', description: 'Proof of ownership and residency', duration: '15 min', type: 'document' },
      { id: 4, title: 'Complete Application', description: 'Fill out homestead exemption form', duration: '15 min', type: 'form' },
      { id: 5, title: 'Submit Application', description: 'File with county assessor by deadline', duration: '10 min', type: 'submission' },
      { id: 6, title: 'Receive Confirmation', description: 'Exemption applied to next tax bill', duration: '2-4 weeks', type: 'waiting' }
    ],
    documents: ['Deed or closing documents', 'Driver\'s license with property address', 'Vehicle registration (some states)'],
    tips: ['Apply immediately after buying home', 'Some states have additional exemptions for seniors/veterans'],
    warnings: ['Must notify if property is no longer primary residence', 'Deadline varies by state'],
    relatedProcesses: ['property-tax-appeal']
  },

  // ============ COURTS & LEGAL ============
  'name-change': {
    id: 'name-change',
    title: 'Legal Name Change',
    category: 'courts',
    icon: '✍️',
    difficulty: 'moderate',
    timeEstimate: '2-3 months',
    cost: '$150-500',
    description: 'Legally change your name through the court system',
    overview: 'Adults can petition the court to change their legal name for various reasons.',
    steps: [
      { id: 1, title: 'Complete Petition', description: 'Fill out name change petition form', duration: '30 min', type: 'form' },
      { id: 2, title: 'File with Court', description: 'Submit petition to county court clerk', duration: '30 min', type: 'in-person' },
      { id: 3, title: 'Pay Filing Fee', description: 'Typically $150-300', duration: '10 min', type: 'payment' },
      { id: 4, title: 'Background Check', description: 'Court runs criminal background check', duration: '1-2 weeks', type: 'waiting' },
      { id: 5, title: 'Publish Notice', description: 'Some states require newspaper publication', duration: '4-6 weeks', type: 'action', conditional: true },
      { id: 6, title: 'Attend Hearing', description: 'Appear before judge for approval', duration: '15-30 min', type: 'hearing' },
      { id: 7, title: 'Receive Order', description: 'Get certified copies of name change order', duration: '1-2 weeks', type: 'waiting' },
      { id: 8, title: 'Update Documents', description: 'SSA, DMV, bank, passport, etc.', duration: '2-4 weeks', type: 'action' }
    ],
    documents: ['Birth certificate', 'Current ID', 'Petition form', 'Filing fee'],
    tips: ['Order multiple certified copies of the court order', 'Start with Social Security, then DMV'],
    warnings: ['Cannot change name to defraud creditors', 'Must update all official documents'],
    relatedProcesses: ['birth-certificate', 'passport-application', 'drivers-license-renewal']
  },

  'small-claims-court': {
    id: 'small-claims-court',
    title: 'Small Claims Court Filing',
    category: 'courts',
    icon: '⚖️',
    difficulty: 'moderate',
    timeEstimate: '1-3 months',
    cost: '$30-100',
    description: 'Sue someone for a small amount without a lawyer',
    overview: 'Small claims court handles disputes under a certain dollar amount (varies by state, typically $5,000-$10,000).',
    steps: [
      { id: 1, title: 'Verify Eligibility', description: 'Confirm amount is within small claims limit', duration: '15 min', type: 'research' },
      { id: 2, title: 'Attempt Resolution', description: 'Try to settle before filing', duration: 'varies', type: 'action' },
      { id: 3, title: 'Complete Forms', description: 'Fill out plaintiff\'s claim and summons', duration: '30 min', type: 'form' },
      { id: 4, title: 'File Claim', description: 'Submit to court clerk', duration: '30 min', type: 'in-person' },
      { id: 5, title: 'Pay Filing Fee', description: 'Typically $30-100', duration: '10 min', type: 'payment' },
      { id: 6, title: 'Serve Defendant', description: 'Have defendant formally notified', duration: '1-2 weeks', type: 'action' },
      { id: 7, title: 'Prepare Evidence', description: 'Gather documents, photos, witnesses', duration: '1-2 weeks', type: 'document' },
      { id: 8, title: 'Attend Hearing', description: 'Present your case to the judge', duration: '1-2 hours', type: 'hearing' },
      { id: 9, title: 'Receive Judgment', description: 'Judge issues decision', duration: 'same day', type: 'decision' }
    ],
    documents: ['Contracts', 'Receipts', 'Photos', 'Correspondence', 'Witness statements'],
    tips: ['Bring organized evidence', 'Practice explaining your case concisely', 'Arrive early'],
    warnings: ['Winning doesn\'t guarantee payment', 'You cannot bring a lawyer in most states'],
    relatedProcesses: []
  },

  'expungement': {
    id: 'expungement',
    title: 'Criminal Record Expungement',
    category: 'courts',
    icon: '🗑️',
    difficulty: 'hard',
    timeEstimate: '3-6 months',
    cost: '$100-400',
    description: 'Seal or erase a criminal record from public view',
    overview: 'Expungement removes or seals criminal records, making them invisible to most background checks.',
    steps: [
      { id: 1, title: 'Check Eligibility', description: 'Not all convictions qualify - research your state', duration: '1 hour', type: 'research' },
      { id: 2, title: 'Obtain Records', description: 'Get certified copies of your criminal record', duration: '1-2 weeks', type: 'document' },
      { id: 3, title: 'Complete Petition', description: 'Fill out expungement petition form', duration: '1 hour', type: 'form' },
      { id: 4, title: 'File Petition', description: 'Submit to the court that handled your case', duration: '30 min', type: 'in-person' },
      { id: 5, title: 'Pay Filing Fee', description: 'Varies by jurisdiction', duration: '10 min', type: 'payment' },
      { id: 6, title: 'Serve Prosecutor', description: 'Notify DA\'s office of your petition', duration: '1-2 weeks', type: 'action' },
      { id: 7, title: 'Wait for Response', description: 'Prosecutor may object', duration: '30-60 days', type: 'waiting' },
      { id: 8, title: 'Attend Hearing', description: 'Appear before judge if required', duration: '1 hour', type: 'hearing', conditional: true },
      { id: 9, title: 'Receive Order', description: 'Court grants or denies expungement', duration: '2-4 weeks', type: 'waiting' }
    ],
    documents: ['Criminal record', 'Petition form', 'Character references', 'Proof of rehabilitation'],
    tips: ['Many legal aid organizations offer free help', 'Some states have automatic expungement programs'],
    warnings: ['Expungement rules vary dramatically by state', 'Some convictions can never be expunged'],
    relatedProcesses: []
  }
};

// Process categories for filtering
export const PROCESS_CATEGORIES = {
  vehicles: { name: 'Vehicles & Transportation', icon: '🚗', color: 'blue' },
  documents: { name: 'Vital Documents', icon: '📄', color: 'purple' },
  benefits: { name: 'Benefits & Assistance', icon: '🤝', color: 'green' },
  business: { name: 'Business', icon: '💼', color: 'amber' },
  property: { name: 'Property & Housing', icon: '🏠', color: 'cyan' },
  courts: { name: 'Courts & Legal', icon: '⚖️', color: 'red' }
};

// Export process list for search/browse
export const getProcessList = () => {
  return Object.values(PROCESS_DATABASE).map(p => ({
    id: p.id,
    title: p.title,
    category: p.category,
    icon: p.icon,
    difficulty: p.difficulty,
    timeEstimate: p.timeEstimate,
    cost: p.cost
  }));
};

// Get process by ID
export const getProcessById = (id) => {
  return PROCESS_DATABASE[id] || null;
};

// Search processes
export const searchProcesses = (query) => {
  const lower = query.toLowerCase();
  return Object.values(PROCESS_DATABASE).filter(p => 
    p.title.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower) ||
    p.category.toLowerCase().includes(lower)
  );
};

export default PROCESS_DATABASE;

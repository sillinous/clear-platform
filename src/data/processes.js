// ProcessMap Data Library
// Each process includes nodes (steps) and edges (connections)
// Node types: start, action, decision, wait, document, end, pain-point

export const processes = {
  'start-business': {
    id: 'start-business',
    title: 'Starting a Small Business (LLC)',
    description: 'Complete guide to forming an LLC, from initial planning to opening your doors.',
    category: 'Business',
    icon: 'Building2',
    estimatedTime: '2-6 weeks',
    estimatedCost: '$50 - $500+',
    complexityScore: 6.8,
    nationalAverage: 7.2,
    bestPractice: 4.5,
    jurisdictionNote: 'Requirements vary significantly by state. This shows a typical process.',
    lastUpdated: '2024-12-01',
    nodes: [
      {
        id: 'start',
        type: 'start',
        label: 'Begin LLC Formation',
        position: { x: 250, y: 0 },
        data: {
          description: 'You\'ve decided to start a business. Let\'s make it official.',
          timeEstimate: null,
          cost: null,
          tips: ['Have a business idea clearly defined', 'Consider consulting with a business attorney or accountant']
        }
      },
      {
        id: 'choose-name',
        type: 'action',
        label: 'Choose Business Name',
        position: { x: 250, y: 100 },
        data: {
          description: 'Select a unique name that complies with your state\'s LLC naming rules.',
          timeEstimate: '1-3 days',
          cost: 'Free',
          requirements: [
            'Must include "LLC" or "Limited Liability Company"',
            'Cannot be same as existing business in your state',
            'Cannot include restricted words (Bank, Insurance, etc.) without approval'
          ],
          documents: [],
          tips: [
            'Search your state\'s business database first',
            'Check domain name availability',
            'Consider trademark search for nationwide protection'
          ],
          links: [
            { label: 'USPTO Trademark Search', url: 'https://www.uspto.gov/trademarks' }
          ]
        }
      },
      {
        id: 'name-available',
        type: 'decision',
        label: 'Is name available?',
        position: { x: 250, y: 200 },
        data: {
          description: 'Check if your desired name is available in your state.',
          options: [
            { label: 'Yes', target: 'reserve-name' },
            { label: 'No', target: 'choose-name' }
          ]
        }
      },
      {
        id: 'reserve-name',
        type: 'action',
        label: 'Reserve Name (Optional)',
        position: { x: 250, y: 300 },
        data: {
          description: 'Most states allow you to reserve your business name for 30-120 days.',
          timeEstimate: '1-5 days',
          cost: '$10 - $50',
          requirements: ['Name reservation application', 'Filing fee'],
          optional: true,
          tips: ['Useful if you need time to prepare other documents', 'Not required if filing Articles immediately']
        }
      },
      {
        id: 'registered-agent',
        type: 'action',
        label: 'Designate Registered Agent',
        position: { x: 250, y: 400 },
        data: {
          description: 'Choose a person or service to receive legal documents on behalf of your LLC.',
          timeEstimate: '1 day',
          cost: '$0 - $300/year',
          requirements: [
            'Must have physical address in state of formation',
            'Must be available during business hours',
            'Can be yourself, another person, or a registered agent service'
          ],
          tips: [
            'You can be your own agent if you have a physical address (not PO Box)',
            'Professional services provide privacy and reliability',
            'Required in all 50 states'
          ],
          painPoint: false
        }
      },
      {
        id: 'articles',
        type: 'document',
        label: 'Prepare Articles of Organization',
        position: { x: 250, y: 500 },
        data: {
          description: 'The primary document that officially creates your LLC.',
          timeEstimate: '1-2 hours',
          cost: 'Included in filing fee',
          requirements: [
            'LLC name',
            'Principal business address',
            'Registered agent name and address',
            'Member/manager names (some states)',
            'Purpose of business (some states)',
            'Duration (perpetual or fixed term)'
          ],
          documents: ['State-specific Articles of Organization form'],
          tips: [
            'Many states offer online filing',
            'Keep it simple - you can add details in Operating Agreement'
          ]
        }
      },
      {
        id: 'file-articles',
        type: 'action',
        label: 'File Articles with State',
        position: { x: 250, y: 600 },
        data: {
          description: 'Submit your Articles of Organization to the state filing office.',
          timeEstimate: '1-10 business days',
          cost: '$50 - $500',
          requirements: ['Completed Articles of Organization', 'Filing fee'],
          costBreakdown: {
            'California': '$70',
            'Delaware': '$90',
            'Texas': '$300',
            'New York': '$200',
            'Wyoming': '$100'
          },
          tips: [
            'Many states offer expedited processing for additional fee',
            'Online filing is usually faster',
            'Keep copies of everything you submit'
          ],
          painPoint: true,
          painReason: 'Fees vary wildly. Some states also have annual fees on top of this.'
        }
      },
      {
        id: 'wait-approval',
        type: 'wait',
        label: 'Wait for State Approval',
        position: { x: 250, y: 700 },
        data: {
          description: 'The state reviews your filing and issues a Certificate of Formation.',
          timeEstimate: '1-15 business days',
          cost: null,
          tips: [
            'Check status online if available',
            'Normal processing: 5-10 days in most states',
            'Expedited: 1-3 days for additional fee'
          ]
        }
      },
      {
        id: 'ein',
        type: 'action',
        label: 'Get EIN (Tax ID)',
        position: { x: 250, y: 800 },
        data: {
          description: 'Obtain an Employer Identification Number from the IRS. Required for most LLCs.',
          timeEstimate: 'Immediate online, 4 weeks by mail',
          cost: 'Free',
          requirements: [
            'LLC must be officially formed first',
            'SSN or ITIN of responsible party',
            'Business name and address'
          ],
          links: [
            { label: 'IRS EIN Application', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online' }
          ],
          tips: [
            'Apply online for immediate EIN',
            'Required to open business bank account',
            'Required if you have employees'
          ]
        }
      },
      {
        id: 'operating-agreement',
        type: 'document',
        label: 'Create Operating Agreement',
        position: { x: 100, y: 900 },
        data: {
          description: 'Internal document outlining ownership, management, and operating procedures.',
          timeEstimate: '2-8 hours',
          cost: '$0 - $1,000+',
          requirements: [
            'Ownership percentages',
            'Voting rights and procedures',
            'Profit/loss distribution',
            'Management structure',
            'Buy-sell provisions',
            'Dissolution procedures'
          ],
          optional: false,
          tips: [
            'Required in some states (NY, CA, MO, ME)',
            'Strongly recommended even when not required',
            'Templates available online, but complex situations need attorney',
            'All members should sign and keep copies'
          ]
        }
      },
      {
        id: 'bank-account',
        type: 'action',
        label: 'Open Business Bank Account',
        position: { x: 400, y: 900 },
        data: {
          description: 'Separate your business and personal finances. Critical for liability protection.',
          timeEstimate: '1-3 days',
          cost: '$0 - $50/month',
          requirements: [
            'EIN',
            'Articles of Organization (or Certificate)',
            'Operating Agreement (some banks)',
            'Government-issued ID'
          ],
          tips: [
            'Shop around - fees and features vary',
            'Consider online banks for lower fees',
            'Never mix personal and business funds'
          ]
        }
      },
      {
        id: 'licenses',
        type: 'action',
        label: 'Obtain Business Licenses',
        position: { x: 250, y: 1000 },
        data: {
          description: 'Get required federal, state, and local licenses and permits.',
          timeEstimate: '1-4 weeks',
          cost: '$50 - $500+',
          requirements: [
            'General business license (city/county)',
            'Professional licenses (if applicable)',
            'Health permits (food businesses)',
            'Zoning permits',
            'Industry-specific permits'
          ],
          painPoint: true,
          painReason: 'This is where most people get stuck. Requirements vary by location, industry, and business type. There\'s no single source listing all requirements.',
          tips: [
            'Contact your city/county clerk\'s office',
            'Check with industry associations',
            'SBA.gov has a license finder tool'
          ],
          links: [
            { label: 'SBA License Finder', url: 'https://www.sba.gov/business-guide/launch-your-business/apply-licenses-permits' }
          ]
        }
      },
      {
        id: 'tax-registration',
        type: 'action',
        label: 'Register for State Taxes',
        position: { x: 250, y: 1100 },
        data: {
          description: 'Register with your state for applicable taxes (sales tax, payroll tax, etc.).',
          timeEstimate: '1-5 days',
          cost: 'Usually free',
          requirements: [
            'EIN',
            'Business address',
            'Estimated sales (for sales tax)'
          ],
          tips: [
            'Sales tax required if selling taxable goods/services',
            'Payroll tax registration if you have employees',
            'Some states have franchise taxes for LLCs'
          ]
        }
      },
      {
        id: 'insurance',
        type: 'action',
        label: 'Get Business Insurance',
        position: { x: 250, y: 1200 },
        data: {
          description: 'Protect your business with appropriate insurance coverage.',
          timeEstimate: '1-3 days',
          cost: '$300 - $3,000+/year',
          requirements: [
            'General liability insurance',
            'Professional liability (if applicable)',
            'Workers compensation (if employees)',
            'Property insurance (if physical location)'
          ],
          optional: true,
          tips: [
            'Some landlords and clients require proof of insurance',
            'LLC protection doesn\'t cover everything - insurance fills gaps',
            'Get multiple quotes'
          ]
        }
      },
      {
        id: 'complete',
        type: 'end',
        label: 'Business Ready to Operate!',
        position: { x: 250, y: 1300 },
        data: {
          description: 'Congratulations! Your LLC is officially set up and ready for business.',
          nextSteps: [
            'Set up accounting system',
            'Create business contracts/templates',
            'Develop marketing plan',
            'Remember annual filing requirements'
          ]
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'choose-name' },
      { id: 'e2', source: 'choose-name', target: 'name-available' },
      { id: 'e3', source: 'name-available', target: 'reserve-name', label: 'Yes' },
      { id: 'e4', source: 'name-available', target: 'choose-name', label: 'No', type: 'loop' },
      { id: 'e5', source: 'reserve-name', target: 'registered-agent' },
      { id: 'e6', source: 'registered-agent', target: 'articles' },
      { id: 'e7', source: 'articles', target: 'file-articles' },
      { id: 'e8', source: 'file-articles', target: 'wait-approval' },
      { id: 'e9', source: 'wait-approval', target: 'ein' },
      { id: 'e10', source: 'ein', target: 'operating-agreement' },
      { id: 'e11', source: 'ein', target: 'bank-account' },
      { id: 'e12', source: 'operating-agreement', target: 'licenses' },
      { id: 'e13', source: 'bank-account', target: 'licenses' },
      { id: 'e14', source: 'licenses', target: 'tax-registration' },
      { id: 'e15', source: 'tax-registration', target: 'insurance' },
      { id: 'e16', source: 'insurance', target: 'complete' }
    ]
  },

  'snap-benefits': {
    id: 'snap-benefits',
    title: 'Applying for SNAP Benefits',
    description: 'Step-by-step guide to applying for food assistance (food stamps).',
    category: 'Benefits',
    icon: 'ShoppingCart',
    estimatedTime: '30-45 days',
    estimatedCost: 'Free',
    complexityScore: 7.4,
    nationalAverage: 7.6,
    bestPractice: 3.0,
    jurisdictionNote: 'SNAP is federally funded but state-administered. Processes vary.',
    lastUpdated: '2024-12-01',
    nodes: [
      {
        id: 'start',
        type: 'start',
        label: 'Check SNAP Eligibility',
        position: { x: 250, y: 0 },
        data: {
          description: 'SNAP (Supplemental Nutrition Assistance Program) helps low-income individuals and families buy food.',
          tips: [
            'Income limits vary by household size',
            'Most households must have gross income below 130% of poverty line',
            'Some states have expanded eligibility'
          ]
        }
      },
      {
        id: 'income-check',
        type: 'decision',
        label: 'Meet income requirements?',
        position: { x: 250, y: 100 },
        data: {
          description: 'Check if your household income falls within SNAP limits.',
          requirements: [
            '1 person: $1,580/month gross',
            '2 people: $2,137/month gross',
            '3 people: $2,694/month gross',
            '4 people: $3,250/month gross',
            'Add $557 for each additional person'
          ],
          tips: ['These are 2024 figures for 48 states. Alaska and Hawaii are higher.']
        }
      },
      {
        id: 'not-eligible',
        type: 'end',
        label: 'May Not Qualify',
        position: { x: 450, y: 100 },
        data: {
          description: 'Your income appears to exceed SNAP limits. However, deductions may still qualify you.',
          nextSteps: [
            'Apply anyway - deductions may reduce countable income',
            'Check other assistance programs',
            'Situation may change - can reapply later'
          ]
        }
      },
      {
        id: 'gather-docs',
        type: 'document',
        label: 'Gather Required Documents',
        position: { x: 250, y: 200 },
        data: {
          description: 'Collect documents to verify your identity, income, and expenses.',
          timeEstimate: '1-3 days',
          documents: [
            'Photo ID for all adult household members',
            'Social Security cards or numbers',
            'Proof of income (pay stubs, benefit letters)',
            'Proof of housing costs (lease, mortgage, utility bills)',
            'Bank statements',
            'Proof of citizenship/immigration status'
          ],
          tips: [
            'Don\'t delay applying if you\'re missing documents',
            'You can submit documents after applying',
            'Workers can help verify some information'
          ]
        }
      },
      {
        id: 'apply',
        type: 'action',
        label: 'Submit SNAP Application',
        position: { x: 250, y: 300 },
        data: {
          description: 'Apply online, in person, by mail, or by fax.',
          timeEstimate: '30-60 minutes',
          cost: 'Free',
          requirements: ['Application form', 'Basic household information'],
          tips: [
            'Online: Many states offer online applications',
            'In person: Visit local SNAP office',
            'You can apply with minimal info and provide documents later',
            'Application date is important - benefits can be backdated to it'
          ],
          links: [
            { label: 'Find Your State SNAP Office', url: 'https://www.fns.usda.gov/snap/state-directory' }
          ]
        }
      },
      {
        id: 'expedited-check',
        type: 'decision',
        label: 'Emergency situation?',
        position: { x: 250, y: 400 },
        data: {
          description: 'You may qualify for expedited (7-day) processing.',
          requirements: [
            'Monthly income below $150 AND',
            'Cash/bank balance below $100 AND',
            'Monthly expenses exceed income/resources'
          ]
        }
      },
      {
        id: 'expedited',
        type: 'action',
        label: 'Expedited Processing',
        position: { x: 100, y: 500 },
        data: {
          description: 'Emergency SNAP benefits within 7 days.',
          timeEstimate: '7 days maximum',
          tips: [
            'Must complete interview within 7 days',
            'Benefits issued before full verification',
            'May need to provide remaining docs later'
          ]
        }
      },
      {
        id: 'schedule-interview',
        type: 'wait',
        label: 'Wait for Interview Scheduling',
        position: { x: 400, y: 500 },
        data: {
          description: 'The SNAP office will contact you to schedule an eligibility interview.',
          timeEstimate: '5-15 days',
          tips: [
            'Watch for mail and phone calls',
            'Keep your phone on and voicemail active',
            'You can call to check status or reschedule'
          ],
          painPoint: true,
          painReason: 'Many applicants miss calls or letters and their applications are denied. Follow up proactively.'
        }
      },
      {
        id: 'interview',
        type: 'action',
        label: 'Complete Interview',
        position: { x: 250, y: 600 },
        data: {
          description: 'Interview with SNAP caseworker to verify information and discuss your situation.',
          timeEstimate: '20-45 minutes',
          requirements: [
            'All gathered documents',
            'Information about household members',
            'Details about income and expenses'
          ],
          tips: [
            'Can be done by phone in most states',
            'Be honest and thorough',
            'Ask about deductions (shelter, child care, medical)',
            'Request interpreter if needed'
          ]
        }
      },
      {
        id: 'submit-docs',
        type: 'action',
        label: 'Submit Verification Documents',
        position: { x: 250, y: 700 },
        data: {
          description: 'Provide any remaining documents requested by your caseworker.',
          timeEstimate: '1-10 days (deadline)',
          tips: [
            'Meet all deadlines - applications can be denied for missing docs',
            'Get receipts for all submitted documents',
            'Fax, mail, or upload through portal',
            'Call to confirm receipt'
          ],
          painPoint: true,
          painReason: 'Document submission is where most applications stall. Track everything.'
        }
      },
      {
        id: 'wait-decision',
        type: 'wait',
        label: 'Wait for Decision',
        position: { x: 250, y: 800 },
        data: {
          description: 'SNAP office reviews all information and makes eligibility determination.',
          timeEstimate: '30 days from application (by law)',
          tips: [
            'Federal law requires decision within 30 days',
            'You\'ll receive a notice by mail',
            'Check status online if your state offers it'
          ]
        }
      },
      {
        id: 'decision',
        type: 'decision',
        label: 'Application Decision',
        position: { x: 250, y: 900 },
        data: {
          description: 'You\'ll receive a letter with the decision.'
        }
      },
      {
        id: 'approved',
        type: 'action',
        label: 'Receive EBT Card',
        position: { x: 100, y: 1000 },
        data: {
          description: 'Benefits loaded onto Electronic Benefits Transfer (EBT) card.',
          timeEstimate: '3-7 days after approval',
          tips: [
            'Card arrives by mail',
            'Create your PIN',
            'Benefits deposited monthly',
            'Use at grocery stores, farmers markets'
          ]
        }
      },
      {
        id: 'denied',
        type: 'decision',
        label: 'Denied - Appeal?',
        position: { x: 400, y: 1000 },
        data: {
          description: 'You have the right to appeal any denial.',
          tips: [
            'Request a fair hearing within 90 days',
            'Review denial reason carefully',
            'Gather additional evidence',
            'Free legal help may be available'
          ]
        }
      },
      {
        id: 'appeal',
        type: 'action',
        label: 'File Appeal',
        position: { x: 400, y: 1100 },
        data: {
          description: 'Request a fair hearing to contest the denial.',
          timeEstimate: '30-90 days for hearing',
          tips: [
            'Put request in writing',
            'Explain why you disagree',
            'Include new evidence if available',
            'Contact legal aid for help'
          ]
        }
      },
      {
        id: 'receiving',
        type: 'end',
        label: 'Receiving SNAP Benefits',
        position: { x: 100, y: 1100 },
        data: {
          description: 'You\'re enrolled! Remember to recertify before your benefit period ends.',
          nextSteps: [
            'Report income changes within 10 days',
            'Watch for recertification notices',
            'Typical certification period: 6-12 months',
            'Report address changes immediately'
          ]
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'income-check' },
      { id: 'e2', source: 'income-check', target: 'gather-docs', label: 'Yes' },
      { id: 'e3', source: 'income-check', target: 'not-eligible', label: 'No' },
      { id: 'e4', source: 'gather-docs', target: 'apply' },
      { id: 'e5', source: 'apply', target: 'expedited-check' },
      { id: 'e6', source: 'expedited-check', target: 'expedited', label: 'Yes' },
      { id: 'e7', source: 'expedited-check', target: 'schedule-interview', label: 'No' },
      { id: 'e8', source: 'expedited', target: 'interview' },
      { id: 'e9', source: 'schedule-interview', target: 'interview' },
      { id: 'e10', source: 'interview', target: 'submit-docs' },
      { id: 'e11', source: 'submit-docs', target: 'wait-decision' },
      { id: 'e12', source: 'wait-decision', target: 'decision' },
      { id: 'e13', source: 'decision', target: 'approved', label: 'Approved' },
      { id: 'e14', source: 'decision', target: 'denied', label: 'Denied' },
      { id: 'e15', source: 'denied', target: 'appeal', label: 'Yes' },
      { id: 'e16', source: 'approved', target: 'receiving' }
    ]
  },

  'home-buying': {
    id: 'home-buying',
    title: 'Buying Your First Home',
    description: 'Navigate the complex journey from pre-approval to closing day.',
    category: 'Housing',
    icon: 'Home',
    estimatedTime: '30-60 days (after offer accepted)',
    estimatedCost: '2-5% of purchase price in closing costs',
    complexityScore: 8.2,
    nationalAverage: 8.0,
    bestPractice: 5.5,
    jurisdictionNote: 'Real estate laws vary by state. Attorney involvement differs.',
    lastUpdated: '2024-12-01',
    nodes: [
      {
        id: 'start',
        type: 'start',
        label: 'Begin Home Buying Journey',
        position: { x: 250, y: 0 },
        data: {
          description: 'Buying a home is one of the biggest financial decisions you\'ll make.',
          tips: [
            'Start saving for down payment (3-20% typical)',
            'Check your credit score (aim for 620+, 740+ for best rates)',
            'Avoid major purchases or new credit before applying'
          ]
        }
      },
      {
        id: 'pre-approval',
        type: 'action',
        label: 'Get Pre-Approved for Mortgage',
        position: { x: 250, y: 100 },
        data: {
          description: 'A lender reviews your finances and commits to lending you a specific amount.',
          timeEstimate: '1-3 days',
          cost: 'Usually free',
          requirements: [
            '2 years of tax returns',
            '2 months of bank statements',
            '2 months of pay stubs',
            'W-2s from past 2 years',
            'ID and Social Security number'
          ],
          tips: [
            'Shop multiple lenders - rates vary',
            'Pre-approval is stronger than pre-qualification',
            'Valid for 60-90 days typically',
            'Sellers prefer pre-approved buyers'
          ]
        }
      },
      {
        id: 'find-agent',
        type: 'action',
        label: 'Find a Real Estate Agent',
        position: { x: 250, y: 200 },
        data: {
          description: 'A buyer\'s agent represents your interests in the home search and purchase.',
          timeEstimate: '1-7 days',
          cost: 'Typically free to buyer (seller pays commission)',
          tips: [
            'Interview multiple agents',
            'Look for local market expertise',
            'Check reviews and references',
            'Ask about their communication style'
          ]
        }
      },
      {
        id: 'house-hunt',
        type: 'action',
        label: 'Search for Homes',
        position: { x: 250, y: 300 },
        data: {
          description: 'View homes that match your criteria and budget.',
          timeEstimate: '2 weeks - 6+ months',
          tips: [
            'Define must-haves vs nice-to-haves',
            'Consider commute, schools, neighborhood',
            'Attend open houses',
            'Take photos and notes'
          ]
        }
      },
      {
        id: 'make-offer',
        type: 'action',
        label: 'Make an Offer',
        position: { x: 250, y: 400 },
        data: {
          description: 'Submit a formal offer to purchase including price, contingencies, and timeline.',
          timeEstimate: '1 day to prepare',
          cost: 'Earnest money deposit: 1-3% of price',
          requirements: [
            'Pre-approval letter',
            'Offer price',
            'Contingencies (inspection, financing, appraisal)',
            'Closing date',
            'Earnest money amount'
          ],
          tips: [
            'Your agent will help craft competitive offer',
            'Consider escalation clauses in hot markets',
            'Earnest money shows you\'re serious',
            'Contingencies protect you but may weaken offer'
          ]
        }
      },
      {
        id: 'offer-response',
        type: 'decision',
        label: 'Seller Response?',
        position: { x: 250, y: 500 },
        data: {
          description: 'Seller can accept, reject, or counter your offer.'
        }
      },
      {
        id: 'negotiate',
        type: 'action',
        label: 'Negotiate Terms',
        position: { x: 450, y: 500 },
        data: {
          description: 'Counter-offers go back and forth until agreement or impasse.',
          tips: [
            'Be prepared to compromise',
            'Decide your walk-away point',
            'Don\'t get emotionally attached'
          ]
        }
      },
      {
        id: 'under-contract',
        type: 'action',
        label: 'Under Contract!',
        position: { x: 250, y: 600 },
        data: {
          description: 'Offer accepted! Now begins the due diligence period.',
          timeEstimate: '30-60 days to closing',
          tips: [
            'Don\'t make major purchases',
            'Don\'t change jobs',
            'Don\'t open new credit',
            'Respond quickly to lender requests'
          ]
        }
      },
      {
        id: 'inspection',
        type: 'action',
        label: 'Home Inspection',
        position: { x: 100, y: 700 },
        data: {
          description: 'Professional inspector examines the home for defects and issues.',
          timeEstimate: '3-4 hours, results in 1-2 days',
          cost: '$300 - $500',
          requirements: ['Licensed home inspector'],
          tips: [
            'Attend the inspection if possible',
            'Ask questions',
            'May also want radon, pest, sewer line inspections',
            'Use findings to negotiate repairs or credits'
          ],
          painPoint: true,
          painReason: 'Inspection often reveals unexpected issues. Be prepared emotionally and financially.'
        }
      },
      {
        id: 'appraisal',
        type: 'action',
        label: 'Appraisal',
        position: { x: 400, y: 700 },
        data: {
          description: 'Lender orders independent appraisal to verify home value.',
          timeEstimate: '1-2 weeks',
          cost: '$300 - $600 (you pay)',
          tips: [
            'Required by lender',
            'If appraisal is low, may need to renegotiate or pay difference',
            'Appraiser uses comparable sales data'
          ]
        }
      },
      {
        id: 'inspection-decision',
        type: 'decision',
        label: 'Inspection Results OK?',
        position: { x: 100, y: 800 },
        data: {
          description: 'Review inspection findings and decide how to proceed.',
          options: [
            { label: 'Accept as-is', target: 'continue' },
            { label: 'Request repairs', target: 'negotiate-repairs' },
            { label: 'Walk away', target: 'start' }
          ]
        }
      },
      {
        id: 'negotiate-repairs',
        type: 'action',
        label: 'Negotiate Repairs/Credits',
        position: { x: 100, y: 900 },
        data: {
          description: 'Request seller fix issues or provide credits at closing.',
          timeEstimate: '3-7 days',
          tips: [
            'Focus on safety and structural issues',
            'Cosmetic issues usually not worth fighting over',
            'Credit at closing is often easier than repairs'
          ]
        }
      },
      {
        id: 'loan-processing',
        type: 'wait',
        label: 'Loan Processing & Underwriting',
        position: { x: 250, y: 900 },
        data: {
          description: 'Lender verifies all information and prepares final approval.',
          timeEstimate: '2-4 weeks',
          tips: [
            'Respond immediately to any requests',
            'Don\'t make financial changes',
            'Provide any additional documents quickly'
          ],
          painPoint: true,
          painReason: 'Underwriting can request endless documents. Stay organized and responsive.'
        }
      },
      {
        id: 'clear-to-close',
        type: 'action',
        label: 'Clear to Close',
        position: { x: 250, y: 1000 },
        data: {
          description: 'Final loan approval! You\'ll receive the Closing Disclosure.',
          timeEstimate: '3 days before closing (required)',
          requirements: [
            'Review Closing Disclosure carefully',
            'Compare to Loan Estimate',
            'Prepare funds for closing'
          ],
          tips: [
            'Wire fraud is common - verify wire instructions by phone',
            'Get certified check or wire funds for closing costs',
            'Closing costs typically 2-5% of purchase price'
          ]
        }
      },
      {
        id: 'final-walkthrough',
        type: 'action',
        label: 'Final Walk-Through',
        position: { x: 250, y: 1100 },
        data: {
          description: 'Last look at the property before closing.',
          timeEstimate: '1 hour, within 24 hours of closing',
          tips: [
            'Verify agreed repairs were made',
            'Check all systems work',
            'Ensure seller has moved out',
            'Check for any new damage'
          ]
        }
      },
      {
        id: 'closing',
        type: 'action',
        label: 'Closing Day',
        position: { x: 250, y: 1200 },
        data: {
          description: 'Sign final documents and receive the keys!',
          timeEstimate: '1-2 hours',
          requirements: [
            'Photo ID',
            'Certified check or wire confirmation',
            'Proof of insurance'
          ],
          tips: [
            'Review all documents carefully',
            'Ask questions if anything unclear',
            'You\'ll sign A LOT of papers',
            'Bring hand for signing!'
          ]
        }
      },
      {
        id: 'complete',
        type: 'end',
        label: 'Congratulations, Homeowner!',
        position: { x: 250, y: 1300 },
        data: {
          description: 'You own a home! Here\'s what comes next.',
          nextSteps: [
            'Change locks',
            'Set up utilities',
            'File homestead exemption if applicable',
            'Keep all closing documents forever',
            'Plan for maintenance and repairs'
          ]
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'pre-approval' },
      { id: 'e2', source: 'pre-approval', target: 'find-agent' },
      { id: 'e3', source: 'find-agent', target: 'house-hunt' },
      { id: 'e4', source: 'house-hunt', target: 'make-offer' },
      { id: 'e5', source: 'make-offer', target: 'offer-response' },
      { id: 'e6', source: 'offer-response', target: 'negotiate', label: 'Counter' },
      { id: 'e7', source: 'offer-response', target: 'house-hunt', label: 'Rejected' },
      { id: 'e8', source: 'offer-response', target: 'under-contract', label: 'Accepted' },
      { id: 'e9', source: 'negotiate', target: 'offer-response' },
      { id: 'e10', source: 'under-contract', target: 'inspection' },
      { id: 'e11', source: 'under-contract', target: 'appraisal' },
      { id: 'e12', source: 'inspection', target: 'inspection-decision' },
      { id: 'e13', source: 'inspection-decision', target: 'loan-processing', label: 'Accept' },
      { id: 'e14', source: 'inspection-decision', target: 'negotiate-repairs', label: 'Negotiate' },
      { id: 'e15', source: 'negotiate-repairs', target: 'loan-processing' },
      { id: 'e16', source: 'appraisal', target: 'loan-processing' },
      { id: 'e17', source: 'loan-processing', target: 'clear-to-close' },
      { id: 'e18', source: 'clear-to-close', target: 'final-walkthrough' },
      { id: 'e19', source: 'final-walkthrough', target: 'closing' },
      { id: 'e20', source: 'closing', target: 'complete' }
    ]
  },

  'traffic-ticket': {
    id: 'traffic-ticket',
    title: 'Resolving a Traffic Ticket',
    description: 'Options for handling a traffic citation, from payment to court contest.',
    category: 'Legal',
    icon: 'Car',
    estimatedTime: '1 day - 3 months',
    estimatedCost: '$50 - $1,000+',
    complexityScore: 5.2,
    nationalAverage: 5.5,
    bestPractice: 2.5,
    jurisdictionNote: 'Traffic laws and courts vary significantly by state and municipality.',
    lastUpdated: '2024-12-01',
    nodes: [
      {
        id: 'start',
        type: 'start',
        label: 'Received Traffic Ticket',
        position: { x: 250, y: 0 },
        data: {
          description: 'You\'ve been cited for a traffic violation. Here are your options.',
          tips: [
            'Note the deadline on your ticket',
            'Don\'t ignore it - consequences get worse',
            'Consider the points impact on your license'
          ]
        }
      },
      {
        id: 'understand-ticket',
        type: 'action',
        label: 'Understand Your Ticket',
        position: { x: 250, y: 100 },
        data: {
          description: 'Review what you\'re charged with and potential consequences.',
          requirements: [
            'Violation code/description',
            'Fine amount',
            'Court date (if any)',
            'Response deadline'
          ],
          tips: [
            'Look up the violation online',
            'Check point value for your license',
            'Some violations affect insurance rates'
          ]
        }
      },
      {
        id: 'decision',
        type: 'decision',
        label: 'How will you respond?',
        position: { x: 250, y: 200 },
        data: {
          description: 'Choose your path forward.'
        }
      },
      {
        id: 'pay-fine',
        type: 'action',
        label: 'Pay the Fine',
        position: { x: 50, y: 300 },
        data: {
          description: 'Admit guilt and pay the citation amount.',
          timeEstimate: 'Immediate',
          cost: 'Fine amount on ticket',
          tips: [
            'Usually can pay online, by mail, or in person',
            'Payment = admission of guilt',
            'Points will be added to your license',
            'May increase insurance rates'
          ]
        }
      },
      {
        id: 'traffic-school',
        type: 'action',
        label: 'Traffic School Option',
        position: { x: 250, y: 300 },
        data: {
          description: 'Complete traffic school to avoid points (if eligible).',
          timeEstimate: '4-8 hours',
          cost: '$20 - $100 + fine',
          requirements: [
            'Typically allowed once per 12-18 months',
            'Usually only for minor violations',
            'Must request before deadline'
          ],
          tips: [
            'Points masked from license',
            'May prevent insurance increase',
            'Online options available in many states',
            'Still must pay fine'
          ]
        }
      },
      {
        id: 'contest',
        type: 'action',
        label: 'Contest the Ticket',
        position: { x: 450, y: 300 },
        data: {
          description: 'Plead not guilty and fight the citation in court.',
          timeEstimate: '1-3 months',
          cost: '$0 - $500+ (potential attorney)',
          tips: [
            'Request a court date',
            'Some jurisdictions offer trial by written declaration',
            'May need to take time off work for court',
            'If you lose, may owe court costs too'
          ]
        }
      },
      {
        id: 'paid-complete',
        type: 'end',
        label: 'Ticket Resolved (Paid)',
        position: { x: 50, y: 400 },
        data: {
          description: 'Fine paid. Points added to license.',
          nextSteps: [
            'Monitor insurance rates',
            'Check DMV record',
            'Drive more carefully!'
          ]
        }
      },
      {
        id: 'school-complete',
        type: 'end',
        label: 'Ticket Resolved (School)',
        position: { x: 250, y: 500 },
        data: {
          description: 'Traffic school completed. Points avoided.',
          nextSteps: [
            'Keep certificate for records',
            'Can\'t use this option again soon',
            'Still paid the fine'
          ]
        }
      },
      {
        id: 'prepare-case',
        type: 'action',
        label: 'Prepare Your Defense',
        position: { x: 450, y: 400 },
        data: {
          description: 'Gather evidence and prepare arguments for court.',
          timeEstimate: '2-10 hours',
          requirements: [
            'Photos of location/signage',
            'Weather records',
            'Witness statements',
            'Dashcam footage',
            'Calibration records (speed)',
            'Your driving record'
          ],
          tips: [
            'Request officer\'s notes via discovery',
            'Note any errors on ticket',
            'Research common defenses',
            'Consider hiring traffic attorney for serious violations'
          ]
        }
      },
      {
        id: 'court-date',
        type: 'action',
        label: 'Appear in Court',
        position: { x: 450, y: 500 },
        data: {
          description: 'Present your case before the judge.',
          timeEstimate: '2-4 hours (mostly waiting)',
          requirements: [
            'Arrive early',
            'Dress appropriately',
            'Bring all evidence',
            'Be respectful to judge'
          ],
          tips: [
            'If officer doesn\'t appear, case may be dismissed',
            'Prosecutor may offer plea deal before trial',
            'You can question the officer',
            'Judge decides based on preponderance of evidence'
          ],
          painPoint: true,
          painReason: 'Courts are confusing. No one explains procedure. Dress codes unwritten.'
        }
      },
      {
        id: 'court-result',
        type: 'decision',
        label: 'Court Decision',
        position: { x: 450, y: 600 },
        data: {
          description: 'The judge rules on your case.'
        }
      },
      {
        id: 'not-guilty',
        type: 'end',
        label: 'Case Dismissed / Not Guilty',
        position: { x: 350, y: 700 },
        data: {
          description: 'You won! No fine, no points.',
          nextSteps: [
            'Request refund of any bail/bond',
            'No points on license',
            'No insurance impact'
          ]
        }
      },
      {
        id: 'guilty',
        type: 'action',
        label: 'Found Guilty',
        position: { x: 550, y: 700 },
        data: {
          description: 'You lost. Must pay fine and points assessed.',
          cost: 'Original fine + possible court costs',
          tips: [
            'May be able to appeal (additional time/cost)',
            'Ask about payment plan if needed',
            'Traffic school may still be option for points'
          ]
        }
      },
      {
        id: 'final-end',
        type: 'end',
        label: 'Ticket Resolution Complete',
        position: { x: 550, y: 800 },
        data: {
          description: 'Case closed. Learn from the experience.',
          nextSteps: [
            'Pay any remaining fines',
            'Complete any required actions',
            'Monitor license status'
          ]
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'understand-ticket' },
      { id: 'e2', source: 'understand-ticket', target: 'decision' },
      { id: 'e3', source: 'decision', target: 'pay-fine', label: 'Pay' },
      { id: 'e4', source: 'decision', target: 'traffic-school', label: 'School' },
      { id: 'e5', source: 'decision', target: 'contest', label: 'Fight' },
      { id: 'e6', source: 'pay-fine', target: 'paid-complete' },
      { id: 'e7', source: 'traffic-school', target: 'school-complete' },
      { id: 'e8', source: 'contest', target: 'prepare-case' },
      { id: 'e9', source: 'prepare-case', target: 'court-date' },
      { id: 'e10', source: 'court-date', target: 'court-result' },
      { id: 'e11', source: 'court-result', target: 'not-guilty', label: 'Win' },
      { id: 'e12', source: 'court-result', target: 'guilty', label: 'Lose' },
      { id: 'e13', source: 'guilty', target: 'final-end' }
    ]
  },

  'unemployment': {
    id: 'unemployment',
    title: 'Filing for Unemployment Benefits',
    description: 'How to apply for unemployment insurance after job loss.',
    category: 'Benefits',
    icon: 'Briefcase',
    estimatedTime: '2-4 weeks to first payment',
    estimatedCost: 'Free',
    complexityScore: 6.5,
    nationalAverage: 6.8,
    bestPractice: 3.5,
    jurisdictionNote: 'Unemployment is state-run. Rules, benefit amounts, and duration vary.',
    lastUpdated: '2024-12-01',
    nodes: [
      {
        id: 'start',
        type: 'start',
        label: 'Lost Your Job',
        position: { x: 250, y: 0 },
        data: {
          description: 'Unemployment insurance provides temporary income while you search for work.',
          tips: [
            'File as soon as you\'re unemployed',
            'Benefits start from file date, not layoff date',
            'Don\'t wait - delays cost you money'
          ]
        }
      },
      {
        id: 'eligibility-check',
        type: 'decision',
        label: 'Are you eligible?',
        position: { x: 250, y: 100 },
        data: {
          description: 'Basic eligibility requirements for unemployment.',
          requirements: [
            'Lost job through no fault of your own (laid off, reduction in force)',
            'Worked enough weeks/earned enough in "base period"',
            'Able and available to work',
            'Actively seeking employment'
          ],
          tips: [
            'Quit for good cause may still qualify',
            'Fired for misconduct usually disqualifies',
            'Part-time workers may qualify'
          ]
        }
      },
      {
        id: 'maybe-eligible',
        type: 'action',
        label: 'Apply Anyway',
        position: { x: 450, y: 100 },
        data: {
          description: 'Uncertain cases should still apply - let the state decide.',
          tips: [
            'Good cause quit (unsafe conditions, harassment) may qualify',
            'Constructive dismissal may qualify',
            'State makes final determination'
          ]
        }
      },
      {
        id: 'gather-info',
        type: 'document',
        label: 'Gather Required Information',
        position: { x: 250, y: 200 },
        data: {
          description: 'Collect information needed for your application.',
          documents: [
            'Social Security number',
            'Driver\'s license or state ID',
            'Employment history (past 18 months)',
            'Employer names, addresses, phone numbers',
            'Dates of employment',
            'Earnings information',
            'Reason for separation from each job',
            'Direct deposit information'
          ],
          tips: [
            'Last 4-5 quarters of work history needed',
            'Have final pay stub if available',
            'Know your employer\'s official business name'
          ]
        }
      },
      {
        id: 'file-claim',
        type: 'action',
        label: 'File Initial Claim',
        position: { x: 250, y: 300 },
        data: {
          description: 'Submit your unemployment claim with your state.',
          timeEstimate: '30-60 minutes',
          cost: 'Free',
          tips: [
            'File in the state where you worked (not necessarily where you live)',
            'Online filing is fastest',
            'File same week you become unemployed',
            'Answer all questions honestly'
          ],
          painPoint: true,
          painReason: 'State websites are often outdated and crash during high-traffic times. Try early morning or late night.'
        }
      },
      {
        id: 'waiting-week',
        type: 'wait',
        label: 'Waiting Week',
        position: { x: 250, y: 400 },
        data: {
          description: 'Most states require a one-week unpaid waiting period.',
          timeEstimate: '1 week',
          tips: [
            'Still certify for this week',
            'Some states eliminated this during COVID (check current rules)',
            'Start job search documentation now'
          ]
        }
      },
      {
        id: 'claim-review',
        type: 'wait',
        label: 'Claim Under Review',
        position: { x: 250, y: 500 },
        data: {
          description: 'State verifies your information and employer may respond.',
          timeEstimate: '1-3 weeks',
          tips: [
            'Employer has limited time to contest',
            'You may be called for phone interview',
            'Keep phone charged and answer unknown numbers',
            'Check mail daily for notices'
          ],
          painPoint: true,
          painReason: 'Phone systems are overloaded. Some people call hundreds of times. Try calling exactly when lines open.'
        }
      },
      {
        id: 'determination',
        type: 'decision',
        label: 'Claim Decision',
        position: { x: 250, y: 600 },
        data: {
          description: 'State issues determination on your eligibility.'
        }
      },
      {
        id: 'approved',
        type: 'action',
        label: 'Claim Approved',
        position: { x: 100, y: 700 },
        data: {
          description: 'You\'re approved for unemployment benefits!',
          tips: [
            'Note your weekly benefit amount',
            'Note total benefit weeks available',
            'Understand weekly certification requirements'
          ]
        }
      },
      {
        id: 'denied',
        type: 'decision',
        label: 'Claim Denied - Appeal?',
        position: { x: 400, y: 700 },
        data: {
          description: 'You have the right to appeal the denial.',
          tips: [
            'Read denial reason carefully',
            'Strict deadlines for appeals (usually 10-30 days)',
            'Can represent yourself or hire attorney',
            'Many denials are overturned on appeal'
          ]
        }
      },
      {
        id: 'appeal',
        type: 'action',
        label: 'File Appeal',
        position: { x: 400, y: 800 },
        data: {
          description: 'Request a hearing to contest the denial.',
          timeEstimate: '2-6 weeks for hearing',
          tips: [
            'Submit appeal in writing immediately',
            'Gather evidence (emails, witnesses, documents)',
            'Prepare testimony',
            'Many appeals are done by phone'
          ]
        }
      },
      {
        id: 'weekly-cert',
        type: 'action',
        label: 'Weekly Certification',
        position: { x: 100, y: 800 },
        data: {
          description: 'Certify each week that you\'re still eligible and job searching.',
          timeEstimate: '5-15 minutes weekly',
          requirements: [
            'Confirm you were able and available to work',
            'Report any income earned',
            'Report job search activities (usually 3+ per week)',
            'Report any job offers'
          ],
          tips: [
            'Set weekly reminder - same day each week',
            'Missing certification = no payment for that week',
            'Keep detailed job search log',
            'Be honest about any work or income'
          ],
          painPoint: true,
          painReason: 'One missed certification and you don\'t get paid. Systems have narrow windows.'
        }
      },
      {
        id: 'receive-benefits',
        type: 'action',
        label: 'Receive Weekly Benefits',
        position: { x: 100, y: 900 },
        data: {
          description: 'Benefits deposited to your account or debit card.',
          timeEstimate: '2-3 days after certification',
          tips: [
            'Direct deposit is fastest',
            'State debit cards have fees - transfer to bank',
            'Benefits are taxable income',
            'Can elect to have taxes withheld'
          ]
        }
      },
      {
        id: 'continue-search',
        type: 'action',
        label: 'Continue Job Search',
        position: { x: 100, y: 1000 },
        data: {
          description: 'Keep searching and documenting while collecting benefits.',
          requirements: [
            'Apply for suitable jobs',
            'Keep records of all applications',
            'Attend required job training if assigned',
            'Report for any scheduled interviews with state'
          ],
          tips: [
            'Accepting suitable work is required',
            '"Suitable" becomes broader over time',
            'Use state job services',
            'Network and update resume'
          ]
        }
      },
      {
        id: 'end-benefits',
        type: 'end',
        label: 'Benefits End',
        position: { x: 100, y: 1100 },
        data: {
          description: 'Benefits end when you find work or exhaust available weeks.',
          nextSteps: [
            'Standard benefits: 12-26 weeks depending on state',
            'Extensions may be available during high unemployment',
            'Report new employment immediately',
            'Keep records for taxes'
          ]
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'start', target: 'eligibility-check' },
      { id: 'e2', source: 'eligibility-check', target: 'gather-info', label: 'Yes' },
      { id: 'e3', source: 'eligibility-check', target: 'maybe-eligible', label: 'Unsure' },
      { id: 'e4', source: 'maybe-eligible', target: 'gather-info' },
      { id: 'e5', source: 'gather-info', target: 'file-claim' },
      { id: 'e6', source: 'file-claim', target: 'waiting-week' },
      { id: 'e7', source: 'waiting-week', target: 'claim-review' },
      { id: 'e8', source: 'claim-review', target: 'determination' },
      { id: 'e9', source: 'determination', target: 'approved', label: 'Approved' },
      { id: 'e10', source: 'determination', target: 'denied', label: 'Denied' },
      { id: 'e11', source: 'denied', target: 'appeal', label: 'Yes' },
      { id: 'e12', source: 'approved', target: 'weekly-cert' },
      { id: 'e13', source: 'weekly-cert', target: 'receive-benefits' },
      { id: 'e14', source: 'receive-benefits', target: 'continue-search' },
      { id: 'e15', source: 'continue-search', target: 'weekly-cert' },
      { id: 'e16', source: 'continue-search', target: 'end-benefits' }
    ]
  }
};

export const processCategories = [
  { id: 'business', name: 'Business', icon: 'Building2', color: 'blue' },
  { id: 'benefits', name: 'Benefits', icon: 'Heart', color: 'green' },
  { id: 'housing', name: 'Housing', icon: 'Home', color: 'orange' },
  { id: 'legal', name: 'Legal', icon: 'Scale', color: 'purple' },
  { id: 'health', name: 'Health', icon: 'Stethoscope', color: 'red' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'teal' }
];

export const getProcessById = (id) => processes[id];
export const getAllProcesses = () => Object.values(processes);
export const getProcessesByCategory = (category) => 
  Object.values(processes).filter(p => p.category.toLowerCase() === category.toLowerCase());

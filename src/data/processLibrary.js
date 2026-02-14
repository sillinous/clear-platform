// CLEAR Process Library - Expanded Government Process Database
// Each process includes full flowchart data for ProcessMap visualization

export const PROCESS_LIBRARY = {
  // LICENSING & PERMITS
  'drivers-license-renewal': {
    id: 'drivers-license-renewal',
    name: "Driver's License Renewal",
    category: 'licensing',
    complexity: 3.2,
    timeEstimate: '1-2 hours',
    cost: '$25-40',
    description: 'Renew your state driver\'s license before expiration',
    icon: '🚗',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Start Renewal', description: 'Check eligibility for renewal' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'decision', data: { label: 'Online Eligible?', description: 'Most states allow online renewal every other cycle' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Online Renewal', description: 'Complete form, pay fee, receive by mail', time: '15 min', cost: '$25-35' }, position: { x: 100, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Visit DMV', description: 'Schedule appointment or walk in', time: '1-3 hours', cost: '$25-40' }, position: { x: 400, y: 200 } },
      { id: '5', type: 'process', data: { label: 'Vision Test', description: 'Basic vision screening' }, position: { x: 400, y: 300 } },
      { id: '6', type: 'process', data: { label: 'Photo Taken', description: 'New photo for license' }, position: { x: 400, y: 400 } },
      { id: '7', type: 'output', data: { label: 'License Issued', description: 'Temporary issued, permanent mailed' }, position: { x: 250, y: 500 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      { id: 'e2-4', source: '2', target: '4', label: 'No' },
      { id: 'e3-7', source: '3', target: '7' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7' }
    ],
    documents: ['Current license', 'Proof of address (if changed)'],
    tips: ['Check online eligibility first', 'Make appointment to avoid wait times', 'Bring backup documents']
  },

  'small-business-license': {
    id: 'small-business-license',
    name: 'Small Business License',
    category: 'licensing',
    complexity: 5.8,
    timeEstimate: '2-4 weeks',
    cost: '$50-500',
    description: 'Obtain a general business license to operate in your city/county',
    icon: '🏪',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Start Application', description: 'Determine business type and location' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'process', data: { label: 'Choose Structure', description: 'LLC, Corporation, Sole Prop, Partnership' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Register Business Name', description: 'File DBA or entity registration', time: '1-5 days', cost: '$10-150' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Get EIN', description: 'Apply for federal tax ID (free)', time: '1 day' }, position: { x: 250, y: 300 } },
      { id: '5', type: 'decision', data: { label: 'Special Permits?', description: 'Food, liquor, health, construction?' }, position: { x: 250, y: 400 } },
      { id: '6', type: 'process', data: { label: 'Apply for Permits', description: 'Industry-specific permits', time: '2-8 weeks', cost: 'Varies' }, position: { x: 450, y: 500 } },
      { id: '7', type: 'process', data: { label: 'City Business License', description: 'Apply with city clerk', time: '3-10 days', cost: '$50-300' }, position: { x: 250, y: 600 } },
      { id: '8', type: 'process', data: { label: 'Zoning Approval', description: 'Verify location is zoned properly' }, position: { x: 250, y: 700 } },
      { id: '9', type: 'output', data: { label: 'License Issued', description: 'Display license at business location' }, position: { x: 250, y: 800 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6', label: 'Yes' },
      { id: 'e5-7', source: '5', target: '7', label: 'No' },
      { id: 'e6-7', source: '6', target: '7' },
      { id: 'e7-8', source: '7', target: '8' },
      { id: 'e8-9', source: '8', target: '9' }
    ],
    documents: ['ID', 'Proof of address', 'Business plan', 'Lease agreement', 'EIN confirmation'],
    tips: ['Start with Secretary of State website', 'Check local zoning before signing lease', 'Budget for multiple fees']
  },

  'building-permit': {
    id: 'building-permit',
    name: 'Building Permit',
    category: 'licensing',
    complexity: 6.4,
    timeEstimate: '2-8 weeks',
    cost: '$100-2000+',
    description: 'Obtain permits for construction, renovation, or major home improvements',
    icon: '🏗️',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Plan Your Project', description: 'Define scope and requirements' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'decision', data: { label: 'Permit Required?', description: 'Minor repairs may not need permits' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Prepare Plans', description: 'Detailed drawings, possibly by architect', cost: '$500-5000' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Submit Application', description: 'Online or in-person at building dept', cost: '$100-500' }, position: { x: 250, y: 300 } },
      { id: '5', type: 'process', data: { label: 'Plan Review', description: 'City reviews for code compliance', time: '1-4 weeks' }, position: { x: 250, y: 400 } },
      { id: '6', type: 'decision', data: { label: 'Approved?', description: 'May require revisions' }, position: { x: 250, y: 500 } },
      { id: '7', type: 'process', data: { label: 'Revise & Resubmit', description: 'Address reviewer comments' }, position: { x: 450, y: 500 } },
      { id: '8', type: 'process', data: { label: 'Pay Fees', description: 'Permit and inspection fees', cost: '$200-2000' }, position: { x: 250, y: 600 } },
      { id: '9', type: 'process', data: { label: 'Construction', description: 'Build per approved plans' }, position: { x: 250, y: 700 } },
      { id: '10', type: 'process', data: { label: 'Inspections', description: 'Schedule required inspections' }, position: { x: 250, y: 800 } },
      { id: '11', type: 'output', data: { label: 'Final Approval', description: 'Certificate of occupancy issued' }, position: { x: 250, y: 900 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7', label: 'No' },
      { id: 'e6-8', source: '6', target: '8', label: 'Yes' },
      { id: 'e7-5', source: '7', target: '5' },
      { id: 'e8-9', source: '8', target: '9' },
      { id: 'e9-10', source: '9', target: '10' },
      { id: 'e10-11', source: '10', target: '11' }
    ],
    documents: ['Property deed', 'Site plan', 'Construction drawings', 'Contractor license', 'Insurance certificate'],
    tips: ['Check what needs permits first', 'Hire licensed contractors', 'Never skip inspections']
  },

  // BENEFITS & ASSISTANCE
  'snap-benefits': {
    id: 'snap-benefits',
    name: 'SNAP Benefits (Food Stamps)',
    category: 'benefits',
    complexity: 5.5,
    timeEstimate: '30 days',
    cost: 'Free',
    description: 'Apply for Supplemental Nutrition Assistance Program benefits',
    icon: '🍎',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Check Eligibility', description: 'Income and resource limits apply' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'process', data: { label: 'Gather Documents', description: 'ID, income proof, expenses, residency' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'decision', data: { label: 'Apply Online?', description: 'Most states have online applications' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Online Application', description: 'Complete state benefits portal', time: '30-60 min' }, position: { x: 100, y: 300 } },
      { id: '5', type: 'process', data: { label: 'Paper Application', description: 'Submit at local DSS office', time: '1-2 hours' }, position: { x: 400, y: 300 } },
      { id: '6', type: 'process', data: { label: 'Interview', description: 'Phone or in-person interview', time: '30 min' }, position: { x: 250, y: 400 } },
      { id: '7', type: 'process', data: { label: 'Verification', description: 'Agency verifies information', time: '1-3 weeks' }, position: { x: 250, y: 500 } },
      { id: '8', type: 'decision', data: { label: 'Approved?', description: 'Based on eligibility criteria' }, position: { x: 250, y: 600 } },
      { id: '9', type: 'output', data: { label: 'EBT Card Issued', description: 'Benefits loaded monthly' }, position: { x: 100, y: 700 } },
      { id: '10', type: 'process', data: { label: 'Appeal', description: 'Request fair hearing if denied' }, position: { x: 400, y: 700 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
      { id: 'e3-5', source: '3', target: '5', label: 'No' },
      { id: 'e4-6', source: '4', target: '6' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7' },
      { id: 'e7-8', source: '7', target: '8' },
      { id: 'e8-9', source: '8', target: '9', label: 'Yes' },
      { id: 'e8-10', source: '8', target: '10', label: 'No' }
    ],
    documents: ['Photo ID', 'Social Security cards', 'Proof of income', 'Rent/mortgage statement', 'Utility bills'],
    tips: ['Apply even if unsure of eligibility', 'Keep all pay stubs', 'Report changes within 10 days']
  },

  'medicaid-application': {
    id: 'medicaid-application',
    name: 'Medicaid Application',
    category: 'benefits',
    complexity: 7.1,
    timeEstimate: '45 days',
    cost: 'Free',
    description: 'Apply for Medicaid health insurance coverage',
    icon: '🏥',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Check Eligibility', description: 'Income limits vary by state and category' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'decision', data: { label: 'Expansion State?', description: 'Coverage differs by state' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Gather Documents', description: 'ID, income, citizenship, residency' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Apply via Marketplace', description: 'Healthcare.gov or state exchange' }, position: { x: 250, y: 300 } },
      { id: '5', type: 'process', data: { label: 'Application Review', description: 'State processes application', time: '15-45 days' }, position: { x: 250, y: 400 } },
      { id: '6', type: 'decision', data: { label: 'More Info Needed?', description: 'May request verification' }, position: { x: 250, y: 500 } },
      { id: '7', type: 'process', data: { label: 'Submit Documents', description: 'Respond within deadline', time: '10-30 days' }, position: { x: 450, y: 500 } },
      { id: '8', type: 'decision', data: { label: 'Approved?', description: 'Eligibility determination' }, position: { x: 250, y: 600 } },
      { id: '9', type: 'output', data: { label: 'Coverage Begins', description: 'Receive Medicaid card' }, position: { x: 100, y: 700 } },
      { id: '10', type: 'process', data: { label: 'Appeal or Reapply', description: 'Options if denied' }, position: { x: 400, y: 700 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7', label: 'Yes' },
      { id: 'e6-8', source: '6', target: '8', label: 'No' },
      { id: 'e7-5', source: '7', target: '5' },
      { id: 'e8-9', source: '8', target: '9', label: 'Yes' },
      { id: 'e8-10', source: '8', target: '10', label: 'No' }
    ],
    documents: ['Photo ID', 'Birth certificate or passport', 'Social Security card', 'Proof of income', 'Proof of residency', 'Immigration documents (if applicable)'],
    tips: ['Coverage can be retroactive 3 months', 'Pregnant women have expedited processing', 'Children may qualify even if parents don\'t']
  },

  'unemployment-benefits': {
    id: 'unemployment-benefits',
    name: 'Unemployment Benefits',
    category: 'benefits',
    complexity: 5.2,
    timeEstimate: '2-4 weeks',
    cost: 'Free',
    description: 'File for unemployment insurance after job loss',
    icon: '💼',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Job Loss Occurs', description: 'Must be through no fault of your own' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'process', data: { label: 'File Claim Online', description: 'State workforce agency website', time: '30-60 min' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Waiting Week', description: 'First week is unpaid in most states', time: '1 week' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Employer Response', description: 'Employer can contest claim', time: '10 days' }, position: { x: 250, y: 300 } },
      { id: '5', type: 'decision', data: { label: 'Claim Approved?', description: 'Based on eligibility' }, position: { x: 250, y: 400 } },
      { id: '6', type: 'process', data: { label: 'Weekly Certification', description: 'Report job search activities weekly' }, position: { x: 100, y: 500 } },
      { id: '7', type: 'process', data: { label: 'Appeal Denial', description: 'Request hearing within deadline' }, position: { x: 400, y: 500 } },
      { id: '8', type: 'output', data: { label: 'Benefits Paid', description: 'Direct deposit or debit card' }, position: { x: 100, y: 600 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6', label: 'Yes' },
      { id: 'e5-7', source: '5', target: '7', label: 'No' },
      { id: 'e6-8', source: '6', target: '8' }
    ],
    documents: ['Social Security number', 'Driver\'s license', 'Employment history (2 years)', 'Reason for separation', 'Bank account info'],
    tips: ['File immediately after job loss', 'Document your job search', 'Respond to all agency requests promptly']
  },

  // VITAL DOCUMENTS
  'birth-certificate': {
    id: 'birth-certificate',
    name: 'Birth Certificate',
    category: 'documents',
    complexity: 3.8,
    timeEstimate: '1-6 weeks',
    cost: '$10-50',
    description: 'Obtain a certified copy of your birth certificate',
    icon: '📜',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Determine Location', description: 'State where birth occurred' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'decision', data: { label: 'Online Available?', description: 'Many states offer online ordering' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Order Online', description: 'State vital records or VitalChek', time: '1-2 weeks', cost: '$20-50' }, position: { x: 100, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Mail Application', description: 'Send form with payment and ID', time: '4-6 weeks', cost: '$10-30' }, position: { x: 400, y: 200 } },
      { id: '5', type: 'process', data: { label: 'In-Person Request', description: 'Visit vital records office', time: 'Same day - 1 week', cost: '$10-25' }, position: { x: 250, y: 300 } },
      { id: '6', type: 'output', data: { label: 'Certificate Issued', description: 'Certified copy received' }, position: { x: 250, y: 400 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      { id: 'e2-4', source: '2', target: '4', label: 'No' },
      { id: 'e2-5', source: '2', target: '5', label: 'Urgent' },
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e4-6', source: '4', target: '6' },
      { id: 'e5-6', source: '5', target: '6' }
    ],
    documents: ['Photo ID', 'Relationship proof (if not self)'],
    tips: ['Order extra copies', 'Check apostille requirements for international use', 'Some states require notarized request']
  },

  'passport-application': {
    id: 'passport-application',
    name: 'U.S. Passport Application',
    category: 'documents',
    complexity: 4.5,
    timeEstimate: '6-12 weeks',
    cost: '$165-205',
    description: 'Apply for a new U.S. passport book or card',
    icon: '🛂',
    states: ['Federal'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Determine Type', description: 'First-time, renewal, child' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'decision', data: { label: 'Eligible for Mail Renewal?', description: 'Must have previous passport' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Mail Renewal', description: 'DS-82 form by mail', time: '8-11 weeks', cost: '$130' }, position: { x: 100, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Complete DS-11', description: 'First-time application form' }, position: { x: 400, y: 200 } },
      { id: '5', type: 'process', data: { label: 'Get Passport Photo', description: '2x2 inch photo, specific requirements', cost: '$15' }, position: { x: 400, y: 300 } },
      { id: '6', type: 'process', data: { label: 'Visit Acceptance Facility', description: 'Post office, clerk office, or library' }, position: { x: 400, y: 400 } },
      { id: '7', type: 'process', data: { label: 'Submit & Pay', description: 'Application fee + execution fee', cost: '$165', time: '6-8 weeks' }, position: { x: 400, y: 500 } },
      { id: '8', type: 'output', data: { label: 'Passport Issued', description: 'Mailed to your address' }, position: { x: 250, y: 600 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      { id: 'e2-4', source: '2', target: '4', label: 'No' },
      { id: 'e3-8', source: '3', target: '8' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7' },
      { id: 'e7-8', source: '7', target: '8' }
    ],
    documents: ['Proof of citizenship (birth certificate)', 'Photo ID', 'Passport photo', 'DS-11 or DS-82 form'],
    tips: ['Apply 4-6 months before travel', 'Expedited service available for extra fee', 'Check name matches all documents exactly']
  },

  'social-security-card': {
    id: 'social-security-card',
    name: 'Social Security Card',
    category: 'documents',
    complexity: 3.5,
    timeEstimate: '2-4 weeks',
    cost: 'Free',
    description: 'Replace or obtain a Social Security card',
    icon: '💳',
    states: ['Federal'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Determine Need', description: 'Replacement, name change, or new' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'decision', data: { label: 'Online Eligible?', description: 'Some replacements can be done online' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Apply Online', description: 'my Social Security account', time: '2 weeks' }, position: { x: 100, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Complete SS-5', description: 'Application for Social Security Card' }, position: { x: 400, y: 200 } },
      { id: '5', type: 'process', data: { label: 'Gather Documents', description: 'ID, citizenship, age proof' }, position: { x: 400, y: 300 } },
      { id: '6', type: 'process', data: { label: 'Visit SSA Office', description: 'In-person or mail application' }, position: { x: 400, y: 400 } },
      { id: '7', type: 'output', data: { label: 'Card Mailed', description: 'New card arrives in 2-4 weeks' }, position: { x: 250, y: 500 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      { id: 'e2-4', source: '2', target: '4', label: 'No' },
      { id: 'e3-7', source: '3', target: '7' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7' }
    ],
    documents: ['U.S. passport OR', 'Driver\'s license + birth certificate', 'Immigration documents (if applicable)'],
    tips: ['Limited to 3 replacements per year, 10 lifetime', 'Name changes require legal documentation', 'Original documents returned by mail']
  },

  // COURTS & LEGAL
  'name-change': {
    id: 'name-change',
    name: 'Legal Name Change',
    category: 'courts',
    complexity: 5.8,
    timeEstimate: '2-3 months',
    cost: '$150-500',
    description: 'Legally change your name through the court system',
    icon: '⚖️',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Prepare Petition', description: 'Name change petition form' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'process', data: { label: 'File with Court', description: 'Submit petition and pay fee', cost: '$150-400' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'decision', data: { label: 'Publication Required?', description: 'Many states require newspaper notice' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Publish Notice', description: 'Run in local newspaper 4-6 weeks', cost: '$50-200' }, position: { x: 450, y: 300 } },
      { id: '5', type: 'process', data: { label: 'Court Hearing', description: 'Appear before judge' }, position: { x: 250, y: 400 } },
      { id: '6', type: 'decision', data: { label: 'Granted?', description: 'Judge reviews petition' }, position: { x: 250, y: 500 } },
      { id: '7', type: 'output', data: { label: 'Court Order Issued', description: 'Legal name change document' }, position: { x: 100, y: 600 } },
      { id: '8', type: 'process', data: { label: 'Update Documents', description: 'SS card, license, passport, etc.' }, position: { x: 100, y: 700 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
      { id: 'e3-5', source: '3', target: '5', label: 'No' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7', label: 'Yes' },
      { id: 'e7-8', source: '7', target: '8' }
    ],
    documents: ['Birth certificate', 'Photo ID', 'Petition form', 'Fingerprints (some states)', 'Background check'],
    tips: ['Order multiple certified copies of court order', 'Update Social Security first, then DMV', 'Some states waive fees for DV survivors']
  },

  'expungement': {
    id: 'expungement',
    name: 'Criminal Record Expungement',
    category: 'courts',
    complexity: 7.5,
    timeEstimate: '3-6 months',
    cost: '$100-400',
    description: 'Petition to seal or expunge criminal records',
    icon: '🔒',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Check Eligibility', description: 'Based on offense, time passed, completion' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'process', data: { label: 'Obtain Records', description: 'Get certified copies of case', cost: '$20-50' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Complete Petition', description: 'Expungement forms for your jurisdiction' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'process', data: { label: 'File Petition', description: 'Submit to court with filing fee', cost: '$100-300' }, position: { x: 250, y: 300 } },
      { id: '5', type: 'process', data: { label: 'Serve Prosecutor', description: 'DA must be notified' }, position: { x: 250, y: 400 } },
      { id: '6', type: 'decision', data: { label: 'Objection Filed?', description: 'Prosecutor may object' }, position: { x: 250, y: 500 } },
      { id: '7', type: 'process', data: { label: 'Hearing', description: 'Argue before judge' }, position: { x: 400, y: 600 } },
      { id: '8', type: 'output', data: { label: 'Order Granted', description: 'Records sealed/expunged' }, position: { x: 250, y: 700 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7', label: 'Yes' },
      { id: 'e6-8', source: '6', target: '8', label: 'No' },
      { id: 'e7-8', source: '7', target: '8' }
    ],
    documents: ['Certified court records', 'Completion certificates', 'Character references', 'Employment/education proof'],
    tips: ['Waiting periods vary by offense', 'Some offenses not eligible', 'Legal aid may help for free']
  },

  // PROPERTY
  'property-tax-appeal': {
    id: 'property-tax-appeal',
    name: 'Property Tax Appeal',
    category: 'property',
    complexity: 5.5,
    timeEstimate: '2-6 months',
    cost: '$0-500',
    description: 'Appeal your property tax assessment for a lower valuation',
    icon: '🏠',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Review Assessment', description: 'Check notice for errors and deadline' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'process', data: { label: 'Research Comparables', description: 'Find similar properties with lower values' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'File Appeal', description: 'Submit within deadline (30-90 days)', cost: '$0-50' }, position: { x: 250, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Informal Review', description: 'Meet with assessor first' }, position: { x: 250, y: 300 } },
      { id: '5', type: 'decision', data: { label: 'Resolved?', description: 'May settle at this stage' }, position: { x: 250, y: 400 } },
      { id: '6', type: 'process', data: { label: 'Formal Hearing', description: 'Present case to review board' }, position: { x: 400, y: 500 } },
      { id: '7', type: 'output', data: { label: 'Decision Issued', description: 'New assessment or denial' }, position: { x: 250, y: 600 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-7', source: '5', target: '7', label: 'Yes' },
      { id: 'e5-6', source: '5', target: '6', label: 'No' },
      { id: 'e6-7', source: '6', target: '7' }
    ],
    documents: ['Assessment notice', 'Comparable sales data', 'Photos of property issues', 'Independent appraisal (optional)'],
    tips: ['Deadlines are strict - don\'t miss them', 'Focus on factual errors first', 'Bring photos of any defects']
  },

  'vehicle-registration': {
    id: 'vehicle-registration',
    name: 'Vehicle Registration',
    category: 'vehicles',
    complexity: 3.5,
    timeEstimate: '1 day - 2 weeks',
    cost: '$50-200',
    description: 'Register a vehicle in your state',
    icon: '🚙',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Gather Documents', description: 'Title, ID, insurance, inspection' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'decision', data: { label: 'New or Transfer?', description: 'Type of registration' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Complete Title Transfer', description: 'Sign title, bill of sale' }, position: { x: 100, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Get Inspection', description: 'Safety/emissions if required', cost: '$20-50' }, position: { x: 250, y: 300 } },
      { id: '5', type: 'process', data: { label: 'Visit DMV or Online', description: 'Submit application', time: '30 min - 2 hours', cost: '$50-150' }, position: { x: 250, y: 400 } },
      { id: '6', type: 'process', data: { label: 'Pay Fees', description: 'Registration, title, taxes' }, position: { x: 250, y: 500 } },
      { id: '7', type: 'output', data: { label: 'Plates Issued', description: 'Registration complete' }, position: { x: 250, y: 600 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Transfer' },
      { id: 'e2-4', source: '2', target: '4', label: 'New' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7' }
    ],
    documents: ['Vehicle title', 'Photo ID', 'Proof of insurance', 'Inspection certificate', 'Bill of sale (if purchased)'],
    tips: ['Some states allow online registration', 'Budget for sales tax on vehicle value', 'Keep old plates until new ones arrive']
  },

  'voter-registration': {
    id: 'voter-registration',
    name: 'Voter Registration',
    category: 'documents',
    complexity: 2.0,
    timeEstimate: '5-30 days',
    cost: 'Free',
    description: 'Register to vote in federal, state, and local elections',
    icon: '🗳️',
    states: ['All States'],
    nodes: [
      { id: '1', type: 'input', data: { label: 'Check Eligibility', description: 'U.S. citizen, 18+, resident' }, position: { x: 250, y: 0 } },
      { id: '2', type: 'decision', data: { label: 'Online Available?', description: 'Most states offer online registration' }, position: { x: 250, y: 100 } },
      { id: '3', type: 'process', data: { label: 'Register Online', description: 'State election website', time: '5 min' }, position: { x: 100, y: 200 } },
      { id: '4', type: 'process', data: { label: 'Mail Form', description: 'National voter registration form', time: '2-4 weeks' }, position: { x: 400, y: 200 } },
      { id: '5', type: 'process', data: { label: 'In-Person', description: 'DMV, library, or election office' }, position: { x: 250, y: 300 } },
      { id: '6', type: 'output', data: { label: 'Registration Confirmed', description: 'Voter card mailed' }, position: { x: 250, y: 400 } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
      { id: 'e2-4', source: '2', target: '4', label: 'No' },
      { id: 'e2-5', source: '2', target: '5', label: 'Prefer' },
      { id: 'e3-6', source: '3', target: '6' },
      { id: 'e4-6', source: '4', target: '6' },
      { id: 'e5-6', source: '5', target: '6' }
    ],
    documents: ['State ID or SSN last 4 digits'],
    tips: ['Register early - deadlines apply', 'Update registration if you move', 'Check status before elections']
  }
};

// Category metadata
export const CATEGORIES = {
  licensing: { name: 'Licensing & Permits', icon: '📋', color: 'blue' },
  benefits: { name: 'Benefits & Assistance', icon: '🤝', color: 'green' },
  documents: { name: 'Vital Documents', icon: '📄', color: 'purple' },
  vehicles: { name: 'Vehicles & Transportation', icon: '🚗', color: 'orange' },
  property: { name: 'Property & Housing', icon: '🏠', color: 'teal' },
  courts: { name: 'Courts & Legal', icon: '⚖️', color: 'red' },
  business: { name: 'Business Operations', icon: '💼', color: 'amber' }
};

// Get all processes as array
export const getAllProcesses = () => Object.values(PROCESS_LIBRARY);

// Get processes by category
export const getProcessesByCategory = (category) => 
  Object.values(PROCESS_LIBRARY).filter(p => p.category === category);

// Search processes
export const searchProcesses = (query) => {
  const lower = query.toLowerCase();
  return Object.values(PROCESS_LIBRARY).filter(p => 
    p.name.toLowerCase().includes(lower) ||
    p.description.toLowerCase().includes(lower) ||
    p.category.toLowerCase().includes(lower)
  );
};

// Get process by ID
export const getProcessById = (id) => PROCESS_LIBRARY[id];

export default PROCESS_LIBRARY;

export type MockEntity = { key: string; value: string; source_offset: [number, number] }
export type MockDoc = {
  id: string
  filename: string
  status: 'COMPLETED' | 'PENDING'
  uploadDate: string
  source: 'Direct Upload' | 'WhatsApp Bot' | 'Email Import' | 'Complaint Report'
  category: 'Safety' | 'Finance' | 'Technical' | 'Contract' | 'HR' | 'Legal/Compliance' | 'Analytics' | 'Issues' | 'Others'
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  isCritical: boolean
  title?: string
  details?: string
  summary?: string[]
  extractedEntities?: MockEntity[]
  fullText?: string
}

export const mockDocuments: Record<string, MockDoc> = {
  // NEW Docs from user-provided images
  'doc-kpi-q1-2025': {
    id: 'doc-kpi-q1-2025',
    filename: 'Q1_FY2025-26_Performance_Report.pdf',
    status: 'COMPLETED',
    uploadDate: '2025-04-25',
    source: 'Direct Upload',
    category: 'Finance',
    importance: 'Critical',
    isCritical: true,
    title: 'Quarterly Performance Report (Q1 FY 2025-26)',
    details: 'Presents operational and financial KPIs for Q1, evaluating service efficiency, passenger satisfaction, and sustainability impact.',
    summary: [
      'Daily average ridership reached 215,000 passengers, a 12% YoY increase.',
      'Total revenue for the quarter was ₹89.9 Cr (₹68.5 Cr from fares, ₹21.4 Cr non-fare).',
      'Train punctuality stood at 98.7%, exceeding the 95% benchmark.',
      'Customer satisfaction score is 4.3/5, with key improvement areas being first/last mile connectivity.',
      'AI-driven predictive maintenance reduced rolling stock downtime by 14%.',
    ],
    extractedEntities: [
      { key: 'Report Period', value: 'Q1 FY 2025-26', source_offset: [0,0] },
      { key: 'Avg. Ridership', value: '215,000 passengers/day', source_offset: [0,0] },
      { key: 'Farebox Revenue', value: '₹68.5 Cr', source_offset: [0,0] },
      { key: 'Train Punctuality', value: '98.7%', source_offset: [0,0] },
      { key: 'Satisfaction Score', value: '4.3/5', source_offset: [0,0] },
      { key: 'Debt Servicing Ratio', value: '1.45', source_offset: [0,0] },
    ],
    fullText: `Title: Quarterly Performance Report – Kochi Metro Rail Limited (Q1 FY 2025-26)\nExecutive Overview\nThis quarterly report presents operational and financial KPIs to evaluate service efficiency, passenger satisfaction, and overall sustainability impact.\nKey Metrics\n1. Ridership & Revenue\nDaily Average Ridership: 215,000 passengers (↑ 12% YoY).\nFarebox Revenue: ₹68.5 Cr (↑ 10% YoY).\nNon-Fare Revenue (advertisements, retail leases): ₹21.4 Cr († 18% YoY).\n2. Operational Performance\nTrain Punctuality: 98.7% (benchmark ≥ 95%).\nEnergy Efficiency: 16.2 kWh per 1,000 passenger-km (↓ 5% vs last quarter).\nIncident Response Time: Average 12 minutes (target ≤ 15 mins).\n3. Customer Satisfaction (Survey-Based)\nOverall Satisfaction Score: 4.3/5.\nTop Positives: Safety, cleanliness, digital ticketing.\nImprovement Areas: First/last mile connectivity, train frequency during late hours.\n4. Sustainability & Compliance\nRenewable Energy Utilization: 32% of traction power.\nCO2 Emissions Avoided: ~19,200 tons this quarter.\nMoHUA Directive Compliance Status: On track (Rooftop solar tender floated).\n5. Financial Health\nEBITDA Margin: 23%.\nDebt Servicing Ratio: 1.45 (safe zone >1.2).\nStrategic Insights\nKakkanad corridor preparatory surveys indicate potential ridership increase of 30% post-Phase II completion.\nAl-driven predictive maintenance reduced rolling stock downtime by 14%.\nNon-fare revenue diversification critical—plans underway for smart advertising platforms.`
  },
  'doc-mohua-directive': {
    id: 'doc-mohua-directive',
    filename: 'MoHUA_Green_Energy_Directive_2025-47.pdf',
    status: 'COMPLETED',
    uploadDate: '2025-04-10',
    source: 'Email Import',
    category: 'Legal/Compliance',
    importance: 'High',
    isCritical: true,
    title: 'MoHUA Directive on Green Energy Standards',
    details: 'Directive from the Ministry of Housing and Urban Affairs for all Metro Rail operators to transition towards sustainable and renewable energy sources.',
    summary: [
      'Mandates that at least 60% of power must be from renewable sources by 2030.',
      'Requires installation of rooftop solar PV panels in depots and stations by 2027.',
      'Mandates 100% electrification of feeder services (e-buses, e-autos) by 2028.',
      'Introduces penalties up to ₹5 crore annually for non-compliance.',
    ],
    extractedEntities: [
        { key: 'Issuing Body', value: 'MoHUA', source_offset: [0,0] },
        { key: 'Directive No.', value: 'MoHUA/UrbanTransport/2025/47', source_offset: [0,0] },
        { key: 'Target: Renewable Energy', value: '60% by 2030', source_offset: [0,0] },
        { key: 'Target: Solar Panels', value: 'By 2027', source_offset: [0,0] },
        { key: 'Target: Feeder Service EV', value: '100% by 2028', source_offset: [0,0] },
        { key: 'Effective Date', value: 'April 2025', source_offset: [0,0] },
    ],
    fullText: `Regulatory Directive (Sample from MoHUA)\nTitle: Directive No. MoHUA/UrbanTransport/2025/47 – Implementation of Green Energy Standards in Metro Rail Operations\nBackground\nThe Ministry of Housing and Urban Affairs (MoHUA) directs all Metro Rail operators to transition towards sustainable and renewable energy sources in compliance with India's National Green Mobility Mission.\nDirectives\n1. Renewable Energy Integration\nAt least 60% of traction and non-traction power must be sourced from solar, wind, or hybrid sources by 2030.\nMetro depots and stations must install rooftop solar PV panels by 2027.\n2. Operational Mandates\nLED lighting in all facilities by 2026.\n100% electrification of feeder services (e-buses, e-autos) by 2028.\n3. Reporting Requirements\nQuarterly energy usage and carbon reduction reports to MoHUA.\nIndependent annual audit of sustainability compliance.\n4. Incentives & Penalties\nProjects exceeding targets are eligible for Viability Gap Funding (VGF).\nNon-compliance will result in reduced central assistance and penalties up to ₹5 crore annually.\nEnforcement\nThe directive comes into effect from April 2025, with the first compliance audit due in March 2026.`
  },
  'doc-perf-framework': {
    id: 'doc-perf-framework',
    filename: 'KMRL_Performance_Framework_2025.docx',
    status: 'COMPLETED',
    uploadDate: '2025-02-20',
    source: 'Direct Upload',
    category: 'Analytics',
    importance: 'Medium',
    isCritical: false,
    title: 'Performance Measurement & Reporting Framework',
    details: 'Integrates KPIs across financial health, operational performance, energy usage, and sustainability tracking.',
    summary: [
      'Documents ridership growth from 2021 to 2025, reaching over 240,000 daily passengers.',
      'Provides a revenue breakdown for 2025: 60% from Ticket Sales, 20% Commercial, 10% Grants, 10% Other.',
      'Shows energy usage by source: Solar (~35%), Grid Power (~55%), Diesel Backup (~10%).'
    ],
    extractedEntities: [
      { key: 'Document Type', value: 'Framework', source_offset: [0,0] },
      { key: 'Focus Year', value: '2025', source_offset: [0,0] },
      { key: 'Primary Revenue Source', value: 'Ticket Sales (60%)', source_offset: [0,0] },
      { key: 'Primary Energy Source', value: 'Grid Power (~55%)', source_offset: [0,0] },
    ],
    fullText: `Kochi Metro Rail Limited (KMRL) Performance Measurement & Reporting Framework - 2025\nThis document provides detailed performance insights for Kochi Metro Rail Limited (KMRL), integrating KPIs, financial health, operational performance, energy usage, and sustainability tracking.`
  },

  // Updated existing docs for consistency
  'doc-001': {
    id: 'doc-001',
    filename: 'Escalator_Incident_Report_Palarivattom.pdf',
    status: 'COMPLETED',
    uploadDate: '2025-09-17',
    source: 'Direct Upload',
    category: 'Safety',
    importance: 'Critical',
    isCritical: true,
    title: 'Safety Incident Report: Escalator Malfunction',
    details:
      'Minor incident involving an escalator malfunction at Palarivattom station. A system-wide check of all "Model-B" escalators is recommended.',
    summary: [
      'Documents a minor incident involving an escalator (Model-B) malfunction at Palarivattom station on August 5th, 2025.',
      'Details the immediate response, including passenger assistance and temporary escalator shutdown.',
      'Root cause analysis points to a faulty bearing in the main gearbox.',
      'No major injuries were reported; however, it highlights a potential vulnerability in aging equipment.',
    ],
    extractedEntities: [
      { key: 'Incident Type', value: 'Equipment Malfunction', source_offset: [55, 76] },
      { key: 'Location', value: 'Palarivattom station', source_offset: [81, 101] },
      { key: 'Date', value: 'August 5th, 2025', source_offset: [105, 122] },
      { key: 'Equipment Model', value: 'Model-B Escalator', source_offset: [350, 395] },
      { key: 'Action Item', value: "System-wide check of 'Model-B' escalators", source_offset: [350, 395] },
    ],
    fullText:
      "Official KMRL Incident Report: A minor incident occurred involving an Equipment Malfunction at Palarivattom station on August 5th, 2025. The event concerned the primary escalator on the northbound platform. Immediate response protocols were activated. Staff provided assistance to all passengers and the unit was taken out of service for emergency inspection. The root cause analysis points towards a faulty bearing in the main gearbox. Recommendations include an immediate, system-wide check of 'Model-B' escalators and a refresh of staff training for such events.",
  },
  'doc-003': {
    id: 'doc-003',
    filename: 'Technical_Manual_Escalator_Model_B.pdf',
    status: 'PENDING',
    uploadDate: '2025-09-18',
    source: 'Direct Upload',
    category: 'Technical',
    importance: 'Low',
    isCritical: false,
    title: 'Technical Manual for Escalator Model B',
    details: 'This document is currently being processed by the system. Insights will be available shortly.'
  },
  'doc-004': {
    id: 'doc-004',
    filename: 'Master_Services_Agreement_OmniCorp.docx',
    status: 'COMPLETED',
    uploadDate: '2025-09-15',
    source: 'WhatsApp Bot',
    category: 'Contract',
    importance: 'High',
    isCritical: true,
    title: 'Master Services Agreement with OmniCorp',
    details:
      'The master services agreement with OmniCorp expires in 15 days. Finance team must review and approve renewal terms.',
    summary: [
      'Master Services Agreement with OmniCorp for station maintenance.',
      'Contract term is 3 years, starting from 2022-10-01.',
      'Renewal clause requires 90-day notice prior to expiration.',
    ],
    extractedEntities: [
      { key: 'Vendor', value: 'OmniCorp', source_offset: [10, 18] },
      { key: 'Term', value: '3 years', source_offset: [30, 37] },
      { key: 'Effective Date', value: '2022-10-01', source_offset: [50, 60] },
    ],
    fullText: 'This MSA with OmniCorp is effective 2022-10-01 for a term of 3 years...',
  },
  'doc-005': {
    id: 'doc-005',
    filename: 'HR_Onboarding_Policy_2025.pdf',
    status: 'PENDING',
    uploadDate: '2025-09-15',
    source: 'Email Import',
    category: 'HR',
    importance: 'Medium',
    isCritical: false,
    title: 'Updated HR Onboarding Policy',
    details: 'This document is currently being processed by the system. Insights will be available shortly.'
  },
};

export const categoriesOrder: Array<MockDoc['category']> = [
  'Safety', 'Finance', 'Technical', 'Contract', 'HR', 'Legal/Compliance', 'Analytics', 'Issues', 'Others'
];

export function countByCategory() {
  const counts: Record<string, number> = {
    Safety: 0, Finance: 0, Technical: 0, Contract: 0, HR: 0, 'Legal/Compliance': 0, Analytics: 0, Issues: 0, Others: 0
  }
  Object.values(mockDocuments).forEach(d => {
    if (counts[d.category] !== undefined) {
      counts[d.category] += 1
    }
  })
  return counts
}

export function docsForCategory(cat: MockDoc['category']) {
  return Object.values(mockDocuments).filter(d => d.category === cat)
}

export function getDoc(id: string) {
  return mockDocuments[id] || null
}

export function getAllDocs(): MockDoc[] {
  return Object.values(mockDocuments)
}
export type MockEntity = { key: string; value: string; source_offset: [number, number] }
export type MockDoc = {
  id: string
  filename: string
  status: 'COMPLETED' | 'PENDING'
  uploadDate: string
  source: 'Direct Upload' | 'WhatsApp Bot' | 'Email Import' | 'Complaint Report'
  category: 'Safety' | 'Finance' | 'Technical' | 'Contract' | 'HR'
  importance: 'Critical' | 'High' | 'Medium' | 'Low';
  isCritical: boolean
  title?: string
  details?: string
  summary?: string[]
  extractedEntities?: MockEntity[]
  fullText?: string
}

export const mockDocuments: Record<string, MockDoc> = {
  'doc-001': {
    id: 'doc-001',
    filename: 'KMRL_Safety_Report_Q3.pdf',
    status: 'COMPLETED',
    uploadDate: '2025-09-17',
    source: 'Direct Upload',
    category: 'Safety',
    importance: 'Critical',
    isCritical: true,
    title: 'Safety Bulletin: Emergency Shutdown Procedure Update',
    details:
      'Immediate update to shutdown protocols for all Series‑7 machinery. Action required by all plant supervisors within 48 hours.',
    summary: [
      'Documents a minor incident involving an escalator malfunction at Palarivattom station on August 5th, 2025.',
      'Details the immediate response, including passenger assistance and temporary escalator shutdown.',
      "Recommends a system-wide check of all 'Model-B' escalators and a review of emergency protocols.",
      'No major injuries were reported; however, it highlights a potential vulnerability in aging equipment.',
    ],
    extractedEntities: [
      { key: 'Incident Type', value: 'Equipment Malfunction', source_offset: [55, 76] },
      { key: 'Location', value: 'Palarivattom station', source_offset: [81, 101] },
      { key: 'Date', value: 'August 5th, 2025', source_offset: [105, 122] },
      { key: 'Severity', value: 'Minor', source_offset: [12, 18] },
      { key: 'Action Item', value: "System-wide check of 'Model-B' escalators", source_offset: [350, 395] },
    ],
    fullText:
      "Official KMRL Incident Report: A minor incident occurred involving an Equipment Malfunction at Palarivattom station on August 5th, 2025. The event concerned the primary escalator on the northbound platform. Immediate response protocols were activated. Staff provided assistance to all passengers and the unit was taken out of service for emergency inspection. The root cause analysis points towards a faulty bearing in the main gearbox. Recommendations include an immediate, system-wide check of 'Model-B' escalators and a refresh of staff training for such events.",
  },
  'doc-002': {
    id: 'doc-002',
    filename: 'Vendor_Invoice_78B4.docx',
    status: 'COMPLETED',
    uploadDate: '2025-09-16',
    source: 'Email Import',
    category: 'Finance',
    importance: 'Medium',
    isCritical: false,
    summary: [
      "Invoice from 'Stark Industries' for security system upgrade.",
      'Total amount due is ₹1,250,000.',
      'Payment due within 30 days of receipt.',
    ],
    extractedEntities: [
      { key: 'Vendor Name', value: 'Stark Industries', source_offset: [12, 28] },
      { key: 'Amount Due', value: '₹1,250,000', source_offset: [40, 50] },
      { key: 'Due Date', value: '2025-10-16', source_offset: [60, 71] },
    ],
    fullText: 'INVOICE To: KMRL... Amount Due: ₹1,250,000... Due Date: 2025-10-16',
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
    title: 'Vendor Contract Renewal - Critical Deadline Approaching',
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
    filename: 'Old_Scanned_Circular.pdf',
    status: 'PENDING',
    uploadDate: '2025-09-15',
    source: 'Email Import',
    category: 'HR',
    importance: 'Medium',
    isCritical: false,
  },
};

export const categoriesOrder: Array<MockDoc['category']> = [
  'Safety', 'Finance', 'Technical', 'Contract', 'HR'
];

export function countByCategory() {
  const counts: Record<MockDoc['category'], number> = {
    Safety: 0, Finance: 0, Technical: 0, Contract: 0, HR: 0
  }
  Object.values(mockDocuments).forEach(d => { counts[d.category] += 1 })
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
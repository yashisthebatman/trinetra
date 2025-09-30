import { DocumentResponse } from '../types';

// Expanded to 5 detailed, hardcoded results for presentation variety.
// Each summary now includes points and sub-points for a richer display.
export const mockUploadResults: DocumentResponse[] = [
  // --- RESULT 1: Business Proposal ---
  {
    doc_id: 'mock-doc-001',
    filename: 'Kochi_Metro_Phase_II_Expansion.pdf',
    page_count: 12,
    ocr_applied: false,
    language_primary: 'en',
    summary: {
      summary_bullets: [
        "**Project Scope:** Proposes a 11.2 km elevated corridor to enhance urban mobility and reduce congestion in key economic zones.",
        "   - **Route:** The new line will connect JLN Stadium to the InfoPark/Kakkanad IT hub.",
        "   - **Stations:** Includes the construction of 11 new, modern stations with multimodal integration points.",
        "**Financial Framework:** Outlines a sustainable financial model based on a Public-Private Partnership (PPP).",
        "   - **Revenue Mix:** Projects a 65% farebox, 25% non-farebox (retail, ads), and 10% state subsidy model.",
        "   - **Partnership:** Oversight will be managed jointly by the Government of Kerala and MoHUA via a Steering Committee.",
        "**Operational Projections:** Aims for significant ridership and urban development impact within five years.",
        "   - **Ridership:** Forecasts an initial daily ridership of 350,000.",
        "   - **Development:** Emphasizes Transit-Oriented Development (TOD) to build commercial and residential hubs around stations.",
      ],
      citations: [ { page_start: 2, page_end: 3 }, { page_start: 5, page_end: 5 }, { page_start: 8, page_end: 9 } ]
    },
    classification: { label: 'Business Proposal', confidence: 0.95 },
    extraction: {
      project_name: "Kochi Metro Phase II",
      total_length_km: 11.2,
      station_count: 11,
      projected_ridership: "350,000/day",
      governing_body: "KMRL & MoHUA"
    },
    pages: [
      { page_number: 1, has_images: true, lang_detected: 'en', text_len: 1583 },
      { page_number: 2, has_images: false, lang_detected: 'en', text_len: 2104 },
    ],
  },
  // --- RESULT 2: Safety Report ---
  {
    doc_id: 'mock-doc-002',
    filename: 'Quarterly_Safety_Audit_Q3.docx',
    page_count: 8,
    ocr_applied: false,
    language_primary: 'en',
    summary: {
      summary_bullets: [
        "**Critical Finding:** A recurring mechanical fault was identified in escalator model 'Esca-B' at Palarivattom station.",
        "   - **Analysis:** Vibration analysis indicates premature wear on the main gearbox bearing, a 20% increase in unscheduled maintenance.",
        "   - **Impact:** Poses a significant operational risk and potential for service disruption.",
        "**Emergency Drill Evaluation:** The drill conducted on September 15th revealed procedural inefficiencies.",
        "   - **Performance:** Evacuation of the main concourse took 7 minutes, exceeding the 5-minute safety target.",
        "   - **Bottleneck:** The north-side exit was identified as a major point of congestion.",
        "**Actionable Recommendations:** A two-tiered corrective action plan is proposed.",
        "   - **Immediate:** Initiate a system-wide replacement of gearbox bearings in all 24 'Esca-B' model escalators.",
        "   - **Short-Term:** Revise evacuation protocols to redirect passenger flow and conduct a new drill within 30 days.",
      ],
      citations: [ { page_start: 4, page_end: 4 }, { page_start: 6, page_end: 7 } ]
    },
    classification: { label: 'Safety Report', confidence: 0.99 },
    extraction: {
      report_period: "Q3 2025",
      critical_issue: "Escalator Model 'Esca-B' maintenance",
      location: "Palarivattom Station",
      action_item: "Replace gearbox bearings and revise evacuation plan"
    },
    pages: [
        { page_number: 1, has_images: false, lang_detected: 'en', text_len: 1890 },
        { page_number: 2, has_images: false, lang_detected: 'en', text_len: 2450 },
    ],
  },
  // --- RESULT 3: Vendor Invoice ---
  {
    doc_id: 'mock-doc-003',
    filename: 'Vendor_Invoice_TechSys.pdf',
    page_count: 1,
    ocr_applied: true,
    language_primary: 'en',
    summary: {
      summary_bullets: [
        "**Invoice Details:** Issued by 'Tech Systems Inc.' for security system upgrades at Aluva station.",
        "   - **Invoice Number:** TS-INV-2025-088.",
        "   - **Date of Issue:** September 25, 2025.",
        "**Line Items:** Details the specific hardware and services provided.",
        "   - **Hardware:** 42 high-definition CCTV dome cameras and 1 central monitoring unit.",
        "   - **Services:** Includes installation, wiring, and system configuration labor costs.",
        "**Payment Information:** The total outstanding amount is ₹4,50,000, inclusive of GST.",
        "   - **Due Date:** Payment is due by October 25, 2025 (Net 30 terms).",
        "   - **Penalty:** A 1.5% late fee per month is applicable on overdue payments.",
      ],
      citations: [ { page_start: 1, page_end: 1 } ]
    },
    classification: { label: 'Vendor Invoice', confidence: 0.92 },
    extraction: {
      vendor_name: "Tech Systems Inc.",
      total_amount: "₹4,50,000",
      invoice_number: "TS-INV-2025-088",
      payment_due_date: "2025-10-25"
    },
    pages: [
        { page_number: 1, has_images: false, lang_detected: 'en', text_len: 850 },
    ],
  },
  // --- RESULT 4: HR Policy (NEW) ---
  {
    doc_id: 'mock-doc-004',
    filename: 'HR_Policy_Update_Remote_Work.pdf',
    page_count: 5,
    ocr_applied: false,
    language_primary: 'en',
    summary: {
      summary_bullets: [
        "**Policy Introduction:** Establishes a formal Hybrid Work Policy for all eligible KMRL administrative employees.",
        "   - **Effective Date:** The policy will commence from November 1, 2025.",
        "   - **Objective:** Aims to improve work-life balance and talent retention.",
        "**Eligibility and Schedule:** Defines the criteria for participation.",
        "   - **Criteria:** Open to permanent employees with a tenure of over one year in non-operational roles.",
        "   - **Structure:** Employees will work 3 days from the office and are permitted to work 2 days remotely.",
        "**Allowances and IT Security:** Details support and requirements for remote work.",
        "   - **Stipend:** A one-time allowance of ₹15,000 will be provided for home office setup.",
        "   - **Security:** Mandates the use of company-issued VPNs and encrypted hard drives for all remote work.",
      ],
      citations: [ { page_start: 2, page_end: 2 }, { page_start: 4, page_end: 4 } ]
    },
    classification: { label: 'HR Policy', confidence: 0.98 },
    extraction: {
      policy_name: "Hybrid Work Policy",
      effective_date: "2025-11-01",
      in_office_days: 3,
      home_office_stipend: "₹15,000"
    },
    pages: [
        { page_number: 1, has_images: false, lang_detected: 'en', text_len: 2200 },
        { page_number: 2, has_images: false, lang_detected: 'en', text_len: 2500 },
    ],
  },
  // --- RESULT 5: Legal Agreement (NEW) ---
  {
    doc_id: 'mock-doc-005',
    filename: 'Land_Lease_Agreement_Vyttila_Hub.pdf',
    page_count: 25,
    ocr_applied: true,
    language_primary: 'en',
    summary: {
      summary_bullets: [
        "**Agreement Overview:** Formalizes a 50-year land lease between Kochi Metro Rail Limited (KMRL) and the Vyttila Merchants Association.",
        "   - **Purpose:** For the development and operation of a new commercial and parking hub adjacent to Vyttila station.",
        "   - **Leased Area:** Covers a total of 2.5 acres as detailed in Annexure A.",
        "**Financial Terms:** Specifies the lease payments and escalation clauses.",
        "   - **Annual Rent:** An initial annual lease rent of ₹2.5 Crore.",
        "   - **Escalation:** The rent is subject to a 10% upward revision every 5 years.",
        "**Usage and Responsibilities:** Defines the rights and duties of the lessee.",
        "   - **Permitted Use:** Commercial retail outlets, a multi-level car park, and digital advertising hoardings.",
        "   - **Maintenance:** The Vyttila Merchants Association is responsible for all maintenance, security, and operational costs of the hub.",
      ],
      citations: [ { page_start: 3, page_end: 4 }, { page_start: 12, page_end: 12 } ]
    },
    classification: { label: 'Legal/Contract', confidence: 0.96 },
    extraction: {
      agreement_type: "Land Lease",
      lessor: "Kochi Metro Rail Limited",
      lessee: "Vyttila Merchants Association",
      lease_term_years: 50,
      annual_rent: "₹2.5 Crore"
    },
    pages: [
        { page_number: 1, has_images: false, lang_detected: 'en', text_len: 1200 },
        { page_number: 2, has_images: false, lang_detected: 'en', text_len: 1500 },
    ],
  }
];
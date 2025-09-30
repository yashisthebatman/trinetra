import { DocumentResponse } from '../types';

// Expanded to 5 detailed, hardcoded results for presentation variety.
// Each summary now includes points and sub-points for a richer display.
export const mockUploadResults: DocumentResponse[] = [
  // --- RESULT 1: KPI Report ---
  {
    doc_id: 'mock-doc-001',
    filename: 'Q1_FY2025-26_Performance_Report.pdf',
    page_count: 2,
    ocr_applied: false,
    language_primary: 'en',
    summary: {
      summary_bullets: [
        "**Ridership Growth:** Daily average ridership reached **215,000 passengers**, a 12% year-over-year increase.",
        "**Financial Health:** Total revenue for the quarter was **₹89.9 Cr**, with a strong Debt Servicing Ratio of 1.45.",
        "**Operational Excellence:** Train punctuality stood at **98.7%**, exceeding the 95% benchmark.",
        "**Customer Satisfaction:** Overall score is **4.3/5**, with cleanliness and safety being top positives.",
        "**Strategic Insight:** AI-driven maintenance has successfully reduced rolling stock downtime by **14%**."
      ],
      citations: [ { page_start: 1, page_end: 1 }, { page_start: 2, page_end: 2 } ]
    },
    classification: { label: 'Finance', confidence: 0.98 },
    extraction: {
      report_period: "Q1 FY 2025-26",
      average_daily_ridership: "215,000",
      total_revenue_cr: 89.9,
      train_punctuality: "98.7%",
      satisfaction_score: "4.3/5"
    },
    pages: [
      { page_number: 1, has_images: false, lang_detected: 'en', text_len: 1583 },
      { page_number: 2, has_images: false, lang_detected: 'en', text_len: 2104 },
    ],
  },
  // --- RESULT 2: Safety Report ---
  {
    doc_id: 'mock-doc-002',
    filename: 'Escalator_Incident_Report_Palarivattom.pdf',
    page_count: 8,
    ocr_applied: false,
    language_primary: 'en',
    summary: {
      summary_bullets: [
        "**Critical Finding:** A recurring mechanical fault was identified in escalator model 'Esca-B' at Palarivattom station.",
        "   - **Analysis:** Vibration analysis indicates premature wear on the main gearbox bearing.",
        "   - **Impact:** Poses a significant operational risk and potential for service disruption.",
        "**Incident Details:** The event occurred on August 5th, 2025. No major injuries were reported.",
        "**Actionable Recommendations:** A corrective action plan is proposed.",
        "   - **Immediate:** Initiate a system-wide inspection and replacement of gearbox bearings in all 'Esca-B' models."
      ],
      citations: [ { page_start: 4, page_end: 4 }, { page_start: 6, page_end: 7 } ]
    },
    classification: { label: 'Safety Report', confidence: 0.99 },
    extraction: {
      report_type: "Safety Incident",
      critical_issue: "Escalator Model 'Esca-B' maintenance",
      location: "Palarivattom Station",
      action_item: "System-wide inspection of 'Esca-B' escalators"
    },
    pages: [
        { page_number: 1, has_images: false, lang_detected: 'en', text_len: 1890 },
        { page_number: 2, has_images: false, lang_detected: 'en', text_len: 2450 },
    ],
  },
    // --- RESULT 3: MoHUA Directive ---
  {
    doc_id: 'mock-doc-003',
    filename: 'MoHUA_Green_Energy_Directive.pdf',
    page_count: 2,
    ocr_applied: true,
    language_primary: 'en',
    summary: {
      summary_bullets: [
        "**Primary Mandate:** All Metro Rail operators must transition towards sustainable and renewable energy sources.",
        "**Renewable Energy Target:** At least **60% of power** must be sourced from solar, wind, or hybrid sources by **2030**.",
        "**Infrastructure Requirement:** All metro depots and stations must install rooftop solar PV panels by **2027**.",
        "**Feeder Services:** Mandates **100% electrification** of feeder services (e-buses, e-autos) by **2028**.",
        "**Non-Compliance Penalty:** Failure to comply can result in penalties up to **₹5 crore annually**."
      ],
      citations: [ { page_start: 1, page_end: 1 } ]
    },
    classification: { label: 'Legal/Compliance', confidence: 0.97 },
    extraction: {
      issuing_body: "MoHUA",
      renewable_target: "60% by 2030",
      solar_deadline: "2027",
      ev_feeder_deadline: "2028",
      max_penalty_cr: 5
    },
    pages: [
        { page_number: 1, has_images: false, lang_detected: 'en', text_len: 1200 },
        { page_number: 2, has_images: false, lang_detected: 'en', text_len: 300 },
    ],
  },
];
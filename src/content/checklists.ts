// Printable checklists (2026-11-25), one per source page: the 3 guides and /adu-oahu.
//
// Rules for items:
// - Built only from sentences already on the source page, word for word (a whole sentence or a
//   whole clause). Each item carries a comment with its source sentence and where it sits.
// - confirm: true only when the source sentence is already cleared in the claims audit
//   (docs/prelaunch-audit-2026-11-24.md: cited third party facts in the guides, Part B area 3).
// - confirm: false (Draft on previews, left out of production, see src/lib/draft.ts) for anything
//   new, changed, or from a sentence the audit has not cleared: the /adu-oahu service copy is
//   marked "DRAFT copy: needs approval before launch" in site.ts, legal content is audit finding
//   17 (attorney read), uncited general statements are finding 30.
// - The checklist itself (title, intro, offer box text) is new copy: confirm:false on the
//   checklist line. While it is unconfirmed, the checklist page and its offer box are left out
//   of production.
// - The guides' citation markers ([6]) are left off; each checklist links to its source page.
// - `n` is the checklist number sent by the step counter (docs/funnel-counter.md).
// - Group headings carry no step numbers (2026-11-26): the hiring guide's Steps 3 and 4 are
//   legal content and left out, so its numbers would show gaps.

export type ChecklistItem = { id: string; confirm: boolean; text: string };
export type ChecklistGroup = { heading: string; items: ChecklistItem[] };
export type Checklist = {
  id: string;
  confirm: boolean;
  n: number;
  slug: string;
  sourcePath: string;
  title: string;
  intro: string;
  offerHeading: string;
  offerText: string;
  groups: ChecklistGroup[];
};

export const checklistUi = {
  pageTitleSuffix: 'Checklist | Elite Construction Management',
  printButton: 'Print or save as PDF',
  sourceLead: 'From:',
  sourcesNote: 'Sources for each item are on the page this checklist comes from.',
  estimateLead: 'Ready to talk about your project?',
  // Offer box form (Netlify form "checklist-request").
  formName: 'checklist-request',
  leadType: 'checklist',
  // Goes into the hidden form-version field (lead log "Form version"); change it when the
  // email-ok wording changes.
  formVersion: 'checklist-v1',
  subjectPrefix: 'New checklist request',
  firstName: 'First name',
  email: 'Email',
  phone: 'Phone (optional)',
  island: 'Island',
  emailOk: 'Yes, ECM can email me about my project',
  submit: 'Get the checklist',
};

// Thank you page text after a checklist request (/thank-you?form=checklist&c=<slug>).
export const checklistThanks = { id: 'checklist-thanks', confirm: false,
  text: 'Thanks. Your checklist is ready.',
  openLabel: 'Open your checklist',
  estimateButton: 'Start your estimate',
};

export const checklists: Checklist[] = [
  { id: 'checklist-hiring', confirm: false,
    n: 1,
    slug: 'hiring-a-general-contractor-in-hawaii',
    sourcePath: '/guides/hiring-a-general-contractor-in-hawaii',
    title: 'Checklist: hiring a general contractor in Hawaii',
    intro: 'The steps from our guide on hiring a general contractor, as a list you can print or save.',
    offerHeading: 'Get the printable checklist',
    offerText: 'Get the steps from this guide as a checklist you can print or save as a PDF.',
    groups: [
      {
        // Guide heading "Step 1: Check the license and complaint history". Step numbers are dropped so the checklist never shows gaps.
        heading: 'Check the license and complaint history',
        items: [
          // Source (Step 1, cited [6]): "Search the license. DCCA's Professional and Vocational License Search shows license status, classifications and proof of insurance."
          { id: 'hiring-license', confirm: true, text: "Search the license. DCCA's Professional and Vocational License Search shows license status, classifications and proof of insurance." },
          // Source (Step 1, cited [6]): "Check complaints. The Regulated Industries Complaints Office (RICO) complaint history search shows complaints against licensees and unlicensed contracting investigations."
          { id: 'hiring-complaints', confirm: true, text: 'Check complaints. The Regulated Industries Complaints Office (RICO) complaint history search shows complaints against licensees and unlicensed contracting investigations.' },
          // Source (Step 1, cited [6]): "Call if you prefer. The DCCA Consumer Resource Center number is 1-844-808-3222."
          { id: 'hiring-call', confirm: true, text: 'Call if you prefer. The DCCA Consumer Resource Center number is 1-844-808-3222.' },
          // Source (Step 1, cited [6]): "Match the person to the license. DCCA warns that some unlicensed operators use fake license numbers or numbers that belong to someone else, and suggests asking for photo ID."
          { id: 'hiring-photo-id', confirm: true, text: 'Match the person to the license. DCCA warns that some unlicensed operators use fake license numbers or numbers that belong to someone else, and suggests asking for photo ID.' },
        ],
      },
      {
        // Guide heading "Step 2: Get bids you can compare". Step numbers are dropped so the checklist never shows gaps.
        heading: 'Get bids you can compare',
        items: [
          // Source (Step 2, cited [3]): "Set a budget in advance and keep a reserve for changes or unexpected costs."
          { id: 'hiring-budget', confirm: true, text: 'Set a budget in advance and keep a reserve for changes or unexpected costs.' },
          // Source (Step 2, cited [3]): "Get at least three bids for the same work and materials, and ask why if the amounts vary a lot."
          { id: 'hiring-bids', confirm: true, text: 'Get at least three bids for the same work and materials, and ask why if the amounts vary a lot.' },
          // Source (Step 2, cited [3]): "Ask for references, look at completed projects and speak with past clients."
          { id: 'hiring-references', confirm: true, text: 'Ask for references, look at completed projects and speak with past clients.' },
        ],
      },
      {
        // Guide heading "Step 5: Pay as the work is done". Step numbers are dropped so the checklist never shows gaps.
        heading: 'Pay as the work is done',
        items: [
          // Source (Step 5, cited [12]): "DCCA's advice is to never pay all of the money up front, to tie payments to completed work and to hold back 5 to 10 percent until all work is done."
          { id: 'hiring-pay', confirm: true, text: "DCCA's advice is to never pay all of the money up front, to tie payments to completed work and to hold back 5 to 10 percent until all work is done." },
          // Source (Step 5, cited [3]): "It also suggests getting a receipt for every payment, putting change orders in writing, and collecting lien releases from subcontractors and suppliers as they are paid."
          // CHANGED: "It" became "DCCA" so the item stands alone; lien releases are legal content (audit finding 17).
          { id: 'hiring-receipts', confirm: false, text: 'DCCA also suggests getting a receipt for every payment, putting change orders in writing, and collecting lien releases from subcontractors and suppliers as they are paid.' },
        ],
      },
      {
        // Guide heading "Step 6: Settle permits before work starts". Step numbers are dropped so the checklist never shows gaps.
        heading: 'Settle permits before work starts',
        items: [
          // Source (Step 6, cited [3]): "Ask who will handle the building, electrical and plumbing permits."
          { id: 'hiring-permits', confirm: true, text: 'Ask who will handle the building, electrical and plumbing permits.' },
        ],
      },
      {
        heading: 'What are the warning signs?',
        items: [
          // Source (warning signs, cited [6]): "DCCA lists door-to-door sales pitches, pressure to decide today, and requests for cash, a large down payment or full payment in advance."
          { id: 'hiring-warning-signs', confirm: true, text: 'DCCA lists door-to-door sales pitches, pressure to decide today, and requests for cash, a large down payment or full payment in advance.' },
        ],
      },
    ],
  },
  { id: 'checklist-cost', confirm: false,
    n: 2,
    slug: 'cost-to-build-a-house-in-hawaii',
    sourcePath: '/guides/cost-to-build-a-house-in-hawaii',
    title: 'Checklist: cost to build a house in Hawaii',
    intro: 'The cost and permit points from our guide on building a house in Hawaii, as a list you can print or save.',
    offerHeading: 'Get the printable checklist',
    offerText: 'Get the points from this guide as a checklist you can print or save as a PDF.',
    groups: [
      {
        heading: 'What drives the cost of building a house in Hawaii?',
        items: [
          // Source (2. Your site, cited [5]): "In Honolulu, plans must be stamped by a licensed professional when the work is in a special management area, a flood hazard area or a special design district, and retaining walls 5 feet or higher must be stamped by an architect or engineer."
          { id: 'cost-site', confirm: true, text: 'In Honolulu, plans must be stamped by a licensed professional when the work is in a special management area, a flood hazard area or a special design district, and retaining walls 5 feet or higher must be stamped by an architect or engineer.' },
          // Source (3. Design and engineering, cited [5]): "DPP says plans must be stamped and signed by a licensed professional when work on a one-story residence exceeds $180,000 or work on a two-story residence exceeds $162,000."
          { id: 'cost-stamp', confirm: true, text: 'DPP says plans must be stamped and signed by a licensed professional when work on a one-story residence exceeds $180,000 or work on a two-story residence exceeds $162,000.' },
          // Source (4. Permit fees, cited [6]): "Honolulu permit fees are based on project value, meaning fair market labor and materials. A plan review fee also applies, and each structure needs its own permit and fees."
          { id: 'cost-fees', confirm: true, text: 'Honolulu permit fees are based on project value, meaning fair market labor and materials. A plan review fee also applies, and each structure needs its own permit and fees.' },
          // Source (6. General excise tax, after cited [8] facts): "Ask your contractor how the tax is shown in the contract price."
          { id: 'cost-tax', confirm: true, text: 'Ask your contractor how the tax is shown in the contract price.' },
          // Source (7. Required features, cited [6]): "DPP says solar water heaters are required for new single-family dwellings. It also says homes generally need one parking space per 1,000 square feet and that paved areas cannot exceed 75 percent of the lot."
          { id: 'cost-features', confirm: true, text: 'DPP says solar water heaters are required for new single-family dwellings. It also says homes generally need one parking space per 1,000 square feet and that paved areas cannot exceed 75 percent of the lot.' },
          // Source (What does that number include, uncited, audit finding 30): "In construction budgeting, land, design and engineering fees, permit fees and financing are usually counted separately as soft costs, so budget for those on top."
          { id: 'cost-soft-costs', confirm: false, text: 'In construction budgeting, land, design and engineering fees, permit fees and financing are usually counted separately as soft costs, so budget for those on top.' },
        ],
      },
      {
        heading: 'How long does a building permit take in Hawaii?',
        items: [
          // Source (permit times, after cited [7] facts): "Processing times change. Check with your county permitting office before you set a schedule."
          { id: 'cost-permit-office', confirm: true, text: 'Processing times change. Check with your county permitting office before you set a schedule.' },
        ],
      },
      {
        heading: 'How do I get a real number for my lot?',
        items: [
          // Source (real number, cited [10]): "The Hawaii Department of Commerce and Consumer Affairs (DCCA) suggests setting a budget with a reserve for changes, getting at least three bids for the same work and materials, and asking why if the amounts vary a lot."
          { id: 'cost-bids', confirm: true, text: 'The Hawaii Department of Commerce and Consumer Affairs (DCCA) suggests setting a budget with a reserve for changes, getting at least three bids for the same work and materials, and asking why if the amounts vary a lot.' },
        ],
      },
    ],
  },
  { id: 'checklist-bathroom', confirm: false,
    n: 3,
    slug: 'bathroom-remodel-cost-honolulu',
    sourcePath: '/guides/bathroom-remodel-cost-honolulu',
    title: 'Checklist: bathroom remodel in Honolulu',
    intro: 'The permit, trade and bid points from our guide on bathroom remodel cost in Honolulu, as a list you can print or save.',
    offerHeading: 'Get the printable checklist',
    offerText: 'Get the points from this guide as a checklist you can print or save as a PDF.',
    groups: [
      {
        heading: 'What drives the cost of a bathroom remodel?',
        items: [
          // Source (Moving plumbing or wiring, cited [6] [7]): "In Honolulu a permit is required for electrical or plumbing work that is not exempted, and that work must be done by licensed trades."
          { id: 'bath-licensed-trades', confirm: true, text: 'In Honolulu a permit is required for electrical or plumbing work that is not exempted, and that work must be done by licensed trades.' },
          // Source (The age of the home, cited [8]): "Under the federal lead rule, anyone paid to do work that disturbs paint in housing built before 1978 must be certified in lead-safe work practices."
          { id: 'bath-lead-rule', confirm: true, text: 'Under the federal lead rule, anyone paid to do work that disturbs paint in housing built before 1978 must be certified in lead-safe work practices.' },
          // Source (The age of the home, cited [8]): "The Environmental Protection Agency recommends that owners of homes built before 1978 hire a lead-safe certified contractor."
          { id: 'bath-lead-contractor', confirm: true, text: 'The Environmental Protection Agency recommends that owners of homes built before 1978 hire a lead-safe certified contractor.' },
          // Source (Surprises, cited [9]): "The state consumer agency advises setting a budget in advance and keeping a reserve for changes or unexpected costs."
          { id: 'bath-reserve', confirm: true, text: 'The state consumer agency advises setting a budget in advance and keeping a reserve for changes or unexpected costs.' },
        ],
      },
      {
        heading: 'Do I need a permit to remodel a bathroom in Honolulu?',
        items: [
          // Source (permit section, last sentence of an uncited paragraph): "Check with DPP before you start."
          { id: 'bath-check-dpp', confirm: true, text: 'Check with DPP before you start.' },
        ],
      },
      {
        heading: 'Who is allowed to do the work?',
        items: [
          // Source (handyman, cited [9]): "DCCA says the handyman exemption for jobs under $1,500 does not cover electrical or plumbing work."
          { id: 'bath-handyman', confirm: true, text: 'DCCA says the handyman exemption for jobs under $1,500 does not cover electrical or plumbing work.' },
          // Source (Permits, cited [11]): "DCCA says only licensed persons or companies may apply for electrical or plumbing permits."
          { id: 'bath-permit-applicant', confirm: true, text: 'DCCA says only licensed persons or companies may apply for electrical or plumbing permits.' },
        ],
      },
      {
        heading: 'How do I get an accurate price?',
        items: [
          // Source (accurate price, cited [9]): "DCCA suggests getting at least three bids for the same work and materials and asking why if the amounts vary a lot."
          { id: 'bath-bids', confirm: true, text: 'DCCA suggests getting at least three bids for the same work and materials and asking why if the amounts vary a lot.' },
          // Source (accurate price, cited [9]): "DCCA also advises paying as the work is completed and not paying everything up front."
          { id: 'bath-pay', confirm: true, text: 'DCCA also advises paying as the work is completed and not paying everything up front.' },
          // Source (accurate price, uncited general advice): "When you compare bids, check that each one covers the same things: demolition, plumbing, electrical, tile, fixtures, permits and tax."
          { id: 'bath-compare-bids', confirm: true, text: 'When you compare bids, check that each one covers the same things: demolition, plumbing, electrical, tile, fixtures, permits and tax.' },
        ],
      },
    ],
  },
  { id: 'checklist-adu', confirm: false,
    n: 4,
    slug: 'adu-oahu',
    sourcePath: '/adu-oahu',
    title: 'Checklist: ADU or ohana unit project',
    intro: 'What an ADU or ohana unit project involves, from our ADU page, as a list you can print or save.',
    offerHeading: 'Get the printable checklist',
    offerText: 'Get this list as a checklist you can print or save as a PDF.',
    groups: [
      {
        // Heading from the page (site.ts serviceDetail.adu, DRAFT service copy).
        heading: 'What an ADU or ohana unit project involves',
        items: [
          // Source (/adu-oahu list, DRAFT service copy, not cleared): "Talking through how you plan to use the new unit and what fits on your lot."
          { id: 'adu-use-and-lot', confirm: false, text: 'Talking through how you plan to use the new unit and what fits on your lot.' },
          // Source (/adu-oahu list, DRAFT service copy, not cleared): "Plans from your architect or designer."
          { id: 'adu-plans', confirm: false, text: 'Plans from your architect or designer.' },
          // Source (/adu-oahu list, DRAFT service copy, not cleared): "Permit applications and plan review."
          { id: 'adu-permits', confirm: false, text: 'Permit applications and plan review.' },
          // Source (/adu-oahu list, DRAFT service copy, not cleared): "Site work, utilities and foundation."
          { id: 'adu-site-work', confirm: false, text: 'Site work, utilities and foundation.' },
          // Source (/adu-oahu list, DRAFT service copy, not cleared): "Framing, roofing, windows and doors."
          { id: 'adu-framing', confirm: false, text: 'Framing, roofing, windows and doors.' },
          // Source (/adu-oahu list; claim C23 "Plumbing and electrical are done by licensed subcontractors" is OK in the audit): "Plumbing and electrical by licensed subcontractors."
          { id: 'adu-licensed-subs', confirm: true, text: 'Plumbing and electrical by licensed subcontractors.' },
          // Source (/adu-oahu list, DRAFT service copy, not cleared): "Insulation, drywall, flooring, cabinets and finishes."
          { id: 'adu-finishes', confirm: false, text: 'Insulation, drywall, flooring, cabinets and finishes.' },
          // Source (/adu-oahu list, DRAFT service copy, not cleared): "Inspections through final."
          { id: 'adu-inspections', confirm: false, text: 'Inspections through final.' },
        ],
      },
    ],
  },
];

export const checklistBySlug = (slug: string) => checklists.find((c) => c.slug === slug);
export const checklistForSource = (path: string) => checklists.find((c) => c.sourcePath === path);

// Privacy Policy, Terms and the consent lines on the forms (2026-11-25).
// ALL DRAFTS: confirm:false (see src/lib/draft.ts). They show on deploy previews with a Draft
// badge and are left out of production. Unconfirmed privacy and terms pages block launch in
// check:launch. Legal wording: review by Jesse's attorney before confirming (workspace rule 7).
//
// Facts only, from how the site is built:
// - forms: src/pages/start-your-project.astro, contact.astro, subcontractors.astro and
//   src/components/ChecklistOffer.astro (field lists below match those forms)
// - where submissions go: Netlify Forms, Netlify's email notification to the ECM team, and the
//   lead log Google Sheet (ops/lead-log; estimate, contact and checklist requests only)
// - step counter: docs/funnel-counter.md
// Links in text use [label](/path) and only point to pages on this site.

export type LegalSection = { heading: string; paragraphs?: string[]; list?: string[]; after?: string[] };

export const legalUi = {
  draftHeader: 'Draft for review',
  draftNote: 'This page is a draft and is not in effect.',
  // Shown at the top of the page; "Changes" sections point to it.
  updatedLabel: 'Last updated',
};

export const privacyPage = { id: 'privacy-page', confirm: false,
  path: '/privacy',
  title: 'Privacy Policy | Elite Construction Management',
  description: 'What the forms on this site collect, where that information goes, who helps us handle it, and your choices.',
  h1: 'Privacy Policy',
  navLabel: 'Privacy Policy',
  updated: 'November 26, 2026',
  updatedISO: '2026-11-26',
  intro: 'This policy covers ecmhawaii.com. It explains what the forms on this site collect, where that information goes, how we use it and the choices you have.',
  sections: [
    {
      // JESSE CHECK: legal business name and address for privacy and terms (not on file).
      heading: 'Who we are',
      paragraphs: ['This website is run by Elite Construction Management (ECM), based in Kapolei, Hawaii.'],
    },
    {
      heading: 'What each form collects',
      paragraphs: ['You choose what to send. Fields marked optional can be left blank.'],
      list: [
        'Estimate request: project type, island, ZIP code (optional), when you want to start, budget range, whether you have plans, your name, phone number and email, the best time to call (optional), notes (optional), how you heard about us (optional) and whether ECM may text you (optional).',
        'Contact form: your name, email, subject and message.',
        'Checklist request: your first name, email, phone number (optional), island, which checklist you asked for and whether ECM may email you about your project (optional).',
        'Subcontractor signup: company name, contact name, phone number, email, trade, license number (optional), islands served (optional), insurance on file (optional) and a short note (optional).',
        'With each request the form also sends the type of request and the page it was sent from. The estimate form also sends the page on this site you came from, or the name of the website that linked you here.',
      ],
    },
    {
      // Netlify technical details: PM confirmed 2026-11-26 that submission payloads carry ip, user_agent and referrer.
      heading: 'Where your information goes',
      list: [
        'Netlify, the company that hosts this website, receives and stores each form submission for ECM.',
        'Netlify emails each submission to the ECM team.',
        'Estimate, contact and checklist requests are also copied to a Google Sheet that the ECM team uses to follow up.',
        'Netlify also records technical details with each form submission, such as the IP address, the browser type and the address of the page the form was sent from.',
      ],
    },
    {
      heading: 'Service providers',
      paragraphs: ['ECM uses these service providers:'],
      list: [
        'Netlify, the company that hosts this site and its forms.',
        "Google, which stores the follow up sheet and sends the team's lead alerts.",
        'Our email provider.',
        'Once texting starts, our phone and text message provider.',
      ],
      after: ['They handle your information only to provide those services to ECM.'],
    },
    {
      heading: 'How we use it',
      paragraphs: [
        'We use what you send to reply to your request and to follow up about your project. If you check the email box on a checklist request, ECM may email you about your project. If you check the text box on the estimate form, ECM may text you about your project (see Text messages below).',
      ],
    },
    {
      heading: 'We do not sell or share it for marketing',
      paragraphs: ['We do not sell your information. We do not share it with third parties or affiliates for their marketing.'],
    },
    {
      heading: 'Text messages',
      list: [
        'Text messages are sent only if you check the text box on the estimate form. Consent is not required to get an estimate.',
        'Mobile numbers and SMS consent are not shared with third parties or affiliates for marketing purposes.',
        'Message frequency varies.',
        'Message and data rates may apply.',
        'Reply STOP to opt out. Reply HELP for help.',
      ],
    },
    {
      heading: 'Step counter',
      paragraphs: [
        'The estimate form, the checklist request form and the project readiness check send anonymous step counts to this site, for example "estimate form, step 2 shown". Each count is only the form, the step and what happened, stored with the date. No IP address, browser details, cookie or other identifier is stored with it, and no answers are sent.',
      ],
    },
    {
      heading: 'Cookies and browser storage',
      paragraphs: [
        'This site does not set cookies and does not use analytics, advertising or social media trackers. After you send a form, your browser keeps the type of request (and for an estimate, the project type, island and timeline) in its session storage for a moment so the thank you page can show the right next steps. The thank you page clears it.',
        'The project readiness check runs in your browser and does not send your answers. Its "Start my estimate" button puts the project type, island and timeline you picked into the link to the estimate form so those answers are filled in.',
      ],
    },
    {
      heading: 'Your choices',
      list: [
        'To stop emails from ECM, reply to any ECM email and ask us to stop.',
        'To stop text messages, reply STOP.',
        'To see, correct or delete the information you sent us, ask through the [contact page](/contact).',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [
        'We keep your information as long as we need it to answer your request, follow up and keep business records. Then we delete it. There is no fixed period.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: ['We take reasonable steps to protect what you send us. No website or system is perfectly secure.'],
    },
    {
      heading: 'Children',
      paragraphs: [
        'This site is not meant for children under 13, and we do not knowingly collect their information. If you think we have, tell us through the [contact page](/contact) and we will delete it.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: ['If we change this policy, we update the date at the top of this page.'],
    },
    {
      heading: 'Questions',
      paragraphs: ['For questions about this policy or your information, use the [contact page](/contact).'],
    },
  ] as LegalSection[],
};

export const termsPage = { id: 'terms-page', confirm: false,
  path: '/terms',
  title: 'Terms | Elite Construction Management',
  description: 'Terms for using the Elite Construction Management website and its forms, including the ECM project texts program.',
  h1: 'Terms',
  navLabel: 'Terms',
  updated: 'November 26, 2026',
  updatedISO: '2026-11-26',
  intro: 'These terms apply to ecmhawaii.com, the website of Elite Construction Management (ECM) in Kapolei, Hawaii.',
  sections: [
    {
      heading: 'Information on this site',
      paragraphs: [
        'The guides and checklists on this site are general information. They describe published sources and are not legal or tax advice. Figures in the guides are published third party data, labeled with their year and source. They are not ECM prices.',
      ],
    },
    {
      // CHANGED from the brief ("belong to ECM"): some job photos belong to the client, who
      // approved ECM using them (src/assets/images/SOURCES.md), so the line says "or are used with permission".
      heading: 'Content and photos',
      paragraphs: [
        'The content and photos on this site belong to ECM or are used with permission. Do not copy them for commercial use without written permission from ECM.',
      ],
    },
    {
      heading: 'The site is provided as is',
      paragraphs: ['This site is provided as is. We try to keep it accurate, but we do not promise that it is complete or current.'],
    },
    {
      heading: 'Limits on liability',
      paragraphs: ['To the extent the law allows, ECM is not liable for losses that come from relying on the general information on this site.'],
    },
    {
      heading: 'Links to other websites',
      paragraphs: ['Links to other websites go to sites ECM does not control.'],
    },
    {
      heading: 'Requests and estimates',
      paragraphs: [
        'Sending a form asks ECM to contact you. It does not create a contract. Any work is agreed in a separate written contract.',
      ],
    },
    {
      heading: 'Text messages',
      list: [
        'Program name: ECM project texts.',
        'If you check the text box on the estimate form, ECM may text you replies about your request, scheduling and project updates. Consent is not required to get an estimate.',
        'Message frequency varies.',
        'Message and data rates may apply.',
        'Reply STOP to opt out.',
        'For help, reply HELP or use the [contact page](/contact).',
        'Carriers are not liable for delayed or undelivered messages.',
        'Mobile numbers and SMS consent are not shared with third parties or affiliates for marketing purposes.',
      ],
    },
    {
      heading: 'Privacy',
      paragraphs: ['How the forms handle your information is described in the [Privacy Policy](/privacy).'],
    },
    {
      heading: 'Governing law',
      paragraphs: ['These terms are governed by Hawaii law.'],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: ['If we change these terms, we update the date at the top of this page.'],
    },
    {
      heading: 'Questions',
      paragraphs: ['For questions about these terms, use the [contact page](/contact).'],
    },
  ] as LegalSection[],
};

// Line under every form (estimate, contact, checklist request, subcontractor signup).
export const formAgreement = { id: 'form-agreement', confirm: false,
  before: 'By submitting you agree to our',
  terms: 'Terms',
  and: 'and',
  privacy: 'Privacy Policy',
  after: '.',
};

// Separate, unchecked, optional SMS consent box on the estimate form's phone step.
export const smsConsent = { id: 'sms-consent', confirm: false,
  name: 'sms-ok',
  value: 'Yes',
  label: 'Yes, ECM can text me about my project. Message frequency varies. Message and data rates may apply. Reply STOP to opt out, HELP for help. Consent is not required to get an estimate.',
  linksLead: 'See our',
  privacy: 'Privacy Policy',
  and: 'and',
  terms: 'Terms',
  after: '.',
};

export const legalPages = [privacyPage, termsPage];

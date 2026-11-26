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
// Links in text use [label](/path) and only point to pages on this site; **text** is bold.
import { business } from './site';

export type LegalSection = { heading: string; paragraphs?: string[]; list?: string[]; after?: string[] };

export const legalUi = {
  draftHeader: 'Draft for review',
  draftNote: 'This page is a draft and is not in effect.',
  // Shown at the top of the page; "Changes" sections point to it.
  updatedLabel: 'Last updated',
  // Shown only once the page's effectiveDate is set (when Jesse confirms it).
  effectiveLabel: 'Effective date',
};

export const privacyPage = { id: 'privacy-page', confirm: false,
  path: '/privacy',
  title: 'Privacy Policy | Elite Construction Management',
  description: 'What the forms on this site collect, where that information goes, who helps us handle it, text message consent and your choices.',
  h1: 'Privacy Policy',
  navLabel: 'Privacy Policy',
  updated: 'November 26, 2026',
  updatedISO: '2026-11-26',
  // Filled when Jesse confirms the page; check:launch blocks a confirmed page without it.
  effectiveDate: '',
  effectiveDateISO: '',
  intro: 'This policy applies to the pages and forms on ecmhawaii.com.',
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
        'With each request the form also sends the type of request, a form version label and the page it was sent from. The estimate form also sends the page on this site you came from, or the name of the website that linked you here.',
      ],
    },
    {
      // PM confirmed 2026-11-26 that Netlify submission payloads carry ip, user_agent and referrer;
      // ops/lead-log drops them before writing the sheet.
      heading: 'Where your information goes',
      paragraphs: [
        "Netlify stores every form submission, emails it to ECM and records the IP address, browser details and referring page with each submission. Estimate, contact and checklist submissions are also copied to a Google Sheet for follow up. Netlify's IP address, browser details and referring page records are not copied to that sheet. Google also sends lead alert emails to ECM.",
      ],
    },
    {
      heading: 'Service providers',
      paragraphs: [
        'ECM uses Netlify for website hosting, form processing, submission storage and submission emails. Google stores selected submissions in a team spreadsheet and sends lead alerts. ECM also receives submissions through its email service. We plan to use Twilio for text messages. These providers receive information to provide the services described here.',
      ],
    },
    {
      heading: 'How we use it',
      paragraphs: [
        'We use estimate and contact submissions to respond to your request. We use checklist submissions to deliver the checklist you asked for, and we send more project follow up emails only if you check the optional email box. We use subcontractor submissions to evaluate working together and to contact you about relevant work. Giving us your phone number alone does not sign you up for text messages.',
      ],
    },
    {
      heading: 'We do not sell or share it for marketing',
      paragraphs: ['We do not sell your information. We do not share it with third parties or affiliates for their marketing.'],
    },
    {
      // Twilio error 30932 guidance (PM, 2026-11-26): the two sharing lines below.
      heading: 'Text messages',
      list: [
        'Text messages are sent only if you check the text box on the estimate form. Consent is not required to get an estimate.',
        'Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes.',
        'Text messaging opt in data and consent will not be shared with any third parties.',
        'Message frequency varies.',
        'Message and data rates may apply.',
        '**Reply STOP to stop ECM project texts. You can also ask us to stop through the [contact page](/contact).**',
        'Reply HELP for help.',
      ],
      after: [
        'For text messaging, we keep your phone number, your consent choice, the date and source of your consent, the consent wording shown and any request to stop messages. We use these records to confirm permission and honor your choices.',
      ],
    },
    {
      heading: 'Step counter',
      paragraphs: [
        "This website does not use third party analytics, advertising pixels or social media trackers. Our own counter records only the form, step, event and date. Counter records do not contain form answers, IP addresses, browser details, cookies or other identifiers. These records are separate from Netlify's form submission records.",
      ],
    },
    {
      heading: 'Cookies and browser storage',
      paragraphs: [
        'This site does not set cookies and does not use analytics, advertising or social media trackers.',
        'The site uses browser session storage to carry the request type and, for estimates, the project type, island and timeline to the confirmation page. It is designed to clear those values when that page loads.',
        'The readiness check works out your result in your browser and sends only counts of starts and completions. If you choose Start my estimate, your project type, island and timeline are included in the estimate page address and sent to Netlify when that page loads. Your other readiness answers are not included.',
      ],
    },
    {
      heading: 'Tracking and Do Not Track',
      paragraphs: [
        'We do not track your activity over time across other websites, and we do not let other companies do so through this website. Our practices do not change in response to Do Not Track signals.',
      ],
    },
    {
      heading: 'Your choices',
      paragraphs: [
        'To stop promotional emails, use the instructions in the email or reply and ask us to stop. We honor these requests within ten business days. This does not stop replies you ask for or necessary messages about an existing project.',
        'To stop text messages, reply STOP.',
        'You can ask to see, correct or delete your information through the [contact page](/contact). We may need to verify your identity. We may keep some information when the law requires it, for disputes, or to honor your requests to stop contact.',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [
        'How long we keep information depends on why you sent it, any working relationship that follows, recordkeeping requirements and any unresolved disputes. Records may exist in Netlify, Google Sheets and ECM email accounts. We delete records when they are no longer needed for these purposes. We may keep limited records of your contact preferences so we can honor requests to stop contact.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: [
        'We use safeguards suited to the information we handle. No website or system can guarantee complete security. Do not send passwords, payment card details, Social Security numbers or identity documents through these forms.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'This website is meant for adults looking for construction services. We do not knowingly collect personal information from children under 13. If you believe a child has sent us personal information, tell us through the [contact page](/contact). If we confirm it, we will stop using the information and delete it as the law requires.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: ['We post policy changes on this page and update the effective date. For important changes, we also post a clear notice on the website.'],
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
  // Filled when Jesse confirms the page; check:launch blocks a confirmed page without it.
  effectiveDate: '',
  effectiveDateISO: '',
  intro: 'These terms apply to the pages and forms on ecmhawaii.com.',
  sections: [
    {
      // The old line "Figures in the guides are published third party data, labeled with their
      // year and source" was dropped (2026-11-26): not every guide figure carries a year in the
      // text (for example the $1,500 license threshold and the DPP stamp thresholds).
      heading: 'Information on this site',
      paragraphs: [
        'Guides, checklists and readiness results give general planning information. They are not an assessment of your property and do not replace architectural, engineering, permitting, legal or tax advice. Published cost figures are not an ECM quote. Project requirements, pricing and timing need a separate assessment.',
      ],
    },
    {
      heading: 'Content and photos',
      paragraphs: ['Copyright and other rights in the materials on this website stay with their owners. Uses the law allows remain allowed. Contact ECM to ask permission for other uses.'],
    },
    {
      heading: 'The site is provided as is',
      paragraphs: ['This site is provided as is. We try to keep it accurate, but we do not promise that it is complete or current.'],
    },
    {
      heading: 'Liability and governing law',
      paragraphs: [
        "To the extent the law allows, ECM is not liable for losses that come from relying on the general information on this site. Hawaii law governs these website terms, except where applicable law requires otherwise. These terms do not exclude rights or liability that cannot legally be excluded. Website disclaimers do not change ECM's obligations under a separate construction agreement.",
      ],
    },
    {
      heading: 'Links to other websites',
      paragraphs: ['Links to other websites go to sites ECM does not control.'],
    },
    {
      heading: 'Requests and estimates',
      paragraphs: [
        'Sending a form does not create a construction contract, reserve a start date or guarantee that ECM will accept the project. Construction work requires a separate written agreement.',
      ],
    },
    {
      heading: 'Using the forms',
      paragraphs: [
        'Use the forms for real inquiries. Send accurate information that you are allowed to share. Do not pretend to be someone else, send unlawful content or interfere with how the website works.',
      ],
    },
    {
      // <PHONE> comes from the PHONE value in src/content/site.ts (the placeholder is a launch blocker).
      heading: 'Text messages',
      list: [
        'ECM project texts are provided by Elite Construction Management.',
        'Program name: ECM project texts.',
        'If you check the text box on the estimate form, ECM may text you replies about your request, scheduling and project updates. Consent is not required to get an estimate.',
        'Message frequency varies.',
        'Message and data rates may apply.',
        `**For help, reply HELP, call ${business.phoneDisplay} or use the [contact page](/contact). To stop messages, reply STOP.**`,
        'You can also ask us to stop through the [contact page](/contact). You may receive one final message confirming your request.',
        'Carriers are not liable for delayed or undelivered messages.',
        'Mobile information will not be shared with third parties or affiliates for marketing or promotional purposes.',
        'Text messaging opt in data and consent will not be shared with any third parties.',
      ],
    },
    {
      heading: 'Privacy',
      paragraphs: ['How the forms handle your information is described in the [Privacy Policy](/privacy).'],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: [
        'Updated terms apply from the effective date shown on this page. They do not change a separate agreement after the fact. A change to these terms does not expand your consent to receive text messages.',
      ],
    },
    {
      heading: 'Questions',
      paragraphs: ['For questions about these terms, use the [contact page](/contact).'],
    },
  ] as LegalSection[],
};

// Agreement line, directly above each form's submit button (2026-11-26).
// Rendered as: "By clicking <button label>, you agree to the website Terms. Our Privacy Policy
// explains how we handle your information." The estimate form adds `estimateExtra`.
export const formAgreement = { id: 'form-agreement', confirm: false,
  byClicking: 'By clicking',
  agree: ', you agree to the website',
  terms: 'Terms',
  our: '. Our',
  privacy: 'Privacy Policy',
  explains: 'explains how we handle your information.',
  estimateExtra: 'Sending this form alone does not sign you up for text messages. Text consent is separate and optional.',
};

// Separate, unchecked, optional SMS consent box on the estimate form's phone step.
// `version` goes into the estimate form's form-version field, so the lead log records which
// consent wording was shown. Change it whenever the label changes.
export const smsConsent = { id: 'sms-consent', confirm: false,
  version: 'sms-2026-11-26',
  name: 'sms-ok',
  value: 'Yes',
  label: 'Yes, I agree to receive text messages from Elite Construction Management at the number I provided about my estimate request, appointment scheduling and project updates. Messages may be sent using automated technology. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is optional and is not required to get an estimate or buy goods or services.',
  linksLead: 'See our',
  privacy: 'Privacy Policy',
  and: 'and',
  terms: 'Terms',
  after: '.',
};

export const legalPages = [privacyPage, termsPage];

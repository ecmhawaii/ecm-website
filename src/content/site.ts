import { copy } from '../lib/draft';
// ALL visible website text and every on/off switch lives in this file.
// Images live in src/content/images.ts.
//
// Rules (see CLAUDE.md):
// - No em dashes or en dashes. Use "to" in ranges.
// - Only claims Jesse has confirmed in writing. Anything not confirmed stays in a
//   switched-off slot below, never in live copy.
// - Business name, phone and license come from `business` so they match on every page.

// PUBLIC PHONE: the one value behind every phone spot on the site and the JSON-LD telephone.
// Website leads go to Ellard and Bleys (ECM Standing Decision 2026-11-25), through an ECM owned
// Twilio number that does not exist yet. While PHONE is the placeholder, every phone spot shows
// the placeholder text and is not a link, and the JSON-LD has no telephone. When the number
// exists, set PHONE to it in the (808) 000-0000 format: every spot becomes a tel: link again.
// check:launch fails while PHONE is empty or the placeholder.
export const PHONE_PLACEHOLDER = 'Twilio number coming soon';
const PHONE: string = PHONE_PLACEHOLDER;
// PUBLIC EMAIL: empty = no email address anywhere on the site or in the JSON-LD.
const EMAIL: string = '';

const phoneDigits = PHONE.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
const phoneLive = PHONE !== PHONE_PLACEHOLDER && phoneDigits.length === 10;

// Site visit wording (2026-11-26): a site visit is one possible next step, not a promise to every
// lead. Each line keeps the old wording in `was`; production uses it until the new text is
// confirmed (see `copy` in src/lib/draft.ts).
export const siteVisitCopy = {
  estimateIntro: { id: 'copy-estimate-intro', confirm: false, was: 'Tell us a little about your project. We will get back to you to set up a site visit.', text: 'Tell us a little about your project. We will get back to you about next steps, which may include a site visit.' },
  estimateMeta: { id: 'copy-estimate-meta', confirm: false, was: 'Tell us about your project and Elite Construction Management will follow up to schedule a site visit.', text: 'Tell us about your project and Elite Construction Management will follow up about next steps.' },
  ctaBand: { id: 'copy-cta-band', confirm: false, was: 'Tell us what you have in mind and we will follow up to set up a site visit.', text: 'Tell us what you have in mind and we will follow up about next steps, which may include a site visit.' },
  contactEstimate: { id: 'copy-contact-estimate', confirm: false, was: 'Tell us about your project and we will follow up to set up a site visit.', text: 'Tell us about your project and we will follow up about next steps, which may include a site visit.' },
  thanksText: { id: 'copy-thanks-text', confirm: false, was: 'We received your request and will contact you to schedule a site visit.', text: 'We received your request and will contact you about next steps, which may include a site visit.' },
  thanksStep: { id: 'copy-thanks-step', confirm: false, was: 'We schedule a site visit.', text: 'If it is a fit, we schedule a site visit.' },
  faqEstimate: { id: 'copy-faq-estimate', confirm: false, was: 'Fill out the estimate form, or send us a message on the contact page. We will follow up to set up a site visit, walk the property with you and talk through scope, budget and timing.', text: 'Fill out the estimate form, or send us a message on the contact page. We will follow up about next steps. That may include a site visit to walk the property with you and talk through scope, budget and timing.' },
};

export const business = {
  name: 'Elite Construction Management',
  city: 'Kapolei, Hawaii',
  locality: 'Kapolei',
  region: 'HI',
  country: 'US',
  /** True once PHONE is a real 10 digit number. */
  phoneLive,
  phoneDisplay: PHONE,
  phoneHref: phoneLive ? `tel:+1${phoneDigits}` : '',
  phoneE164: phoneLive ? `+1-${phoneDigits.slice(0, 3)}-${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6)}` : '',
  // License ID as listed by Hawaii DCCA public license search (checked 2026-11-22). BC is the class prefix, not the ID; BC-37929 returns no result there.
  license: 'Hawaii contractor license CT-37929',
  licenseShort: 'License CT-37929',
  licenseClass: 'Class B General Building',
  email: EMAIL,
  emailHref: EMAIL ? `mailto:${EMAIL}` : '',
  // Confirmed by Jesse (via Ellard, 2026-11-21).
  veteranOwned: 'Veteran owned',
  // Islands Jesse has confirmed ECM serves (2026-11-21). Drives areaServed in structured data.
  areaServed: ['Oahu', 'Maui', 'Big Island'] as string[],
  islandsLine: 'Oahu, Maui and the Big Island',
  // Business hours. Empty = nothing shows. Fill from Answer Sheet #31; must match the Google listing.
  //   text:         shown in the footer next to the phone, e.g. 'Mon to Fri, 7am to 4pm' (no dashes)
  //   openingHours: schema.org format for the JSON-LD, e.g. ['Mo-Fr 07:00-16:00']
  hours: { text: '', openingHours: [] as string[] },
};

// Clients ECM has built for. Confirmed by Jesse (via Ellard, 2026-11-21). Names only, as text. No logos.
export const clients = {
  heading: 'Trusted on projects for',
  names: ['Longs Drugs', 'American Cancer Society', 'Tesla', 'Buffalo Wild Wings'],
};

// ---------------------------------------------------------------------------
// HIDDEN SLOTS. Each one is off until Jesse supplies real material.
// Never put sample or made up data in these.
// ---------------------------------------------------------------------------
export const slots = {
  // Google reviews. Shows only when enabled AND at least `minCount` real reviews are listed.
  reviews: {
    enabled: false,
    minCount: 5,
    heading: 'What clients say',
    sourceLabel: 'Google reviews',
    profileUrl: '', // ECM's Google Business Profile reviews link
    items: [] as Array<{ author: string; rating: 1 | 2 | 3 | 4 | 5; text: string; date: string }>,
  },
  // Instagram. Links and local image files only. No third party script or embed.
  instagram: {
    enabled: false,
    heading: 'On Instagram',
    profileUrl: '',
    handle: '',
    // Each post: link to the post, a photo saved in /public, and alt text.
    posts: [] as Array<{ url: string; image: string; alt: string }>,
  },
  // Hearth financing link. Needs Jesse's Hearth account link and approved wording.
  financing: {
    enabled: false,
    heading: '',
    text: '',
    linkLabel: '',
    url: '',
  },
  // Trusted By: partner, supplier and association logos. Needs each owner's written OK.
  trustedBy: {
    enabled: false,
    heading: 'Trusted by',
    logos: [] as Array<{ name: string; image: string; url?: string }>,
  },
  // Insurance line for the credentials strip and About page. Off until Jesse confirms
  // the coverage in writing (or a certificate of insurance is on file).
  insurance: {
    enabled: false,
    text: '',
  },
  // Reply time promise. Confirmed by Jesse (via Ellard, 2026-11-21). Shown on the thank you
  // page, the estimate page and the estimate band.
  replyTime: {
    enabled: true,
    text: "We'll call you back within one business day.",
  },
};

// Header navigation (desktop order). Services opens a dropdown of servicePages plus "All services".
export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/portfolio' },
  { label: 'Guides', href: '/guides' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const servicePages = [
  { label: 'Custom homes', href: '/custom-homes' },
  { label: 'ADUs and ohana units', href: '/adu-oahu' },
  { label: 'Remodeling', href: '/remodeling' },
  { label: 'Commercial tenant improvements', href: '/commercial-tenant-improvements' },
];

export const ui = {
  skipLink: 'Skip to main content',
  menu: 'Menu',
  allServices: 'All services',
  servicesMenuLabel: 'Services menu',
  home: 'Home',
  callButton: `Call ${business.phoneDisplay}`,
  callShort: 'Call',
  estimateButton: 'Request an Estimate',
  estimateShort: 'Request Estimate',
  mainNavLabel: 'Main',
  footerNavLabel: 'Footer',
  footerServicesLabel: 'Services',
  footerCompanyLabel: 'Company',
  footerSubcontractors: 'Subcontractors',
  footerGuides: 'Guides',
  footerContactLabel: 'Contact',
  footerIslandsLabel: 'Islands served',
  emailLabel: 'Email',
  phoneLabel: 'Phone',
  viewProject: 'View project',
  viewAllProjects: 'See all projects',
  openPhoto: 'Open photo',
  closePhoto: 'Close',
  photoOf: (n: number, total: number) => `Photo ${n} of ${total}`,
  prevPhoto: 'Previous photo',
  nextPhoto: 'Next photo',
  photoDialogLabel: 'Project photo',
  compareLabel: 'Drag to compare',
  compareHint: 'Drag the handle or use the arrow keys to compare.',
  breadcrumbLabel: 'Breadcrumb',
  photoComing: 'Photo coming',
  projectPhotosComing: 'Project photos coming soon',
  samplePhoto: 'Sample photo',
  requiredNote: 'Fields marked * are required.',
  selectPlaceholder: 'Choose one',
  submit: 'Send',
  honeypotLabel: 'Leave this field empty',
  learnMore: 'Learn more',
  sliderLabel: 'Job site photos',
  sliderPrev: 'Previous photo',
  sliderNext: 'Next photo',
  draftBadge: 'DRAFT, content pending',
  // Badge on confirm:false items (deploy previews only, see src/lib/draft.ts).
  draftTag: 'Draft',
  faqHeading: 'Questions and answers',
  onThisPage: 'On this page',
  guideEyebrow: 'Guide',
  sourcesChecked: 'Sources checked',
  relatedGuide: 'Related guide',
};

// Credentials strip: confirmed facts only. Shown with a middle dot between items.
export const credentials = [`Hawaii license CT-37929`, business.licenseClass, business.veteranOwned, business.islandsLine];

export const howItWorks = {
  eyebrow: 'Process',
  heading: 'How it works',
  steps: [
    { title: 'Tell us about your project.', text: 'Use the estimate form or call.' },
    {
      title: 'Site visit.',
      text: 'We walk the property with you and talk through scope, budget and timing.',
    },
    // Finding 3 (2026-11-24): the fixed price sentence was removed pending Jesse's attorney.
    { title: 'Proposal.', text: '' },
    {
      title: 'Build.',
      text: 'Our crew and licensed subs do the work, and you get regular updates.',
    },
  ],
};

export const ctaBand = {
  eyebrow: 'Request an estimate',
  heading: 'Planning a project?',
  text: copy(siteVisitCopy.ctaBand),
};

export const home = {
  title: 'General Contractor in Honolulu and Oahu | Elite Construction Management',
  description:
    'Kapolei general contractor for custom homes, ADUs, remodels and commercial tenant improvements. Request an estimate online.',
  eyebrow: 'Licensed Hawaii general contractor',
  h1: 'General contractor on Oahu for homes and businesses',
  heroLine: 'Custom homes, ADUs and additions, remodels and commercial tenant improvements on Oahu, Maui and the Big Island.',
  hookEyebrow: 'How we work',
  hook: 'One team from the first walkthrough to the final inspection.',
  intro:
    'Elite Construction Management is a licensed Hawaii general contractor based in Kapolei. We build new homes, ADUs and additions, remodels and commercial tenant improvements, and we run the job from first walkthrough to final inspection.',
  servicesEyebrow: 'Services',
  servicesHeading: 'What we build',
  // Big service list: name, one line (confirmed copy), photo slot, page.
  servicesList: [
    { name: 'Custom homes and new construction', line: 'New homes built from your plans, or from scratch with an architect or designer we connect you with.', image: 'home', href: '/custom-homes' },
    { name: 'ADUs and additions', line: 'An ADU or addition adds space without moving.', image: 'adu', href: '/adu-oahu' },
    { name: 'Remodels', line: 'Kitchens, bathrooms and whole home remodels, scoped clearly before work starts.', image: 'mililani-kitchen-1', href: '/remodeling' },
    { name: 'Commercial', line: 'Build outs and renovations for retail, office and other commercial spaces.', image: 'acsSign', href: '/commercial-tenant-improvements' },
  ],
  featuredEyebrow: 'Recent work',
  featuredHeading: 'Featured projects',
  // Three slots. Waianae replaced the Kaneohe bamboo floor (2026-11-23); swap back here if wanted.
  featured: ['acs-hope-lodge', 'longs-drugs', 'waianae-remodel-addition'],
  sliderEyebrow: 'On the job',
  sliderHeading: 'From the job site',
  bandImage: 'hawaii-island-new-home-great-room-1',
  faqEyebrow: 'FAQ',
  faqHeading: 'Common questions',
  // Kept for pages that still link by service card.
  serviceCards: [
    { name: 'Custom homes and new construction', href: '/custom-homes', image: 'home' },
    { name: 'ADUs and additions', href: '/adu-oahu', image: 'adu' },
    { name: 'Remodels', href: '/remodeling', image: 'mililani-kitchen-1' },
    { name: 'Commercial tenant improvements', href: '/commercial-tenant-improvements', image: 'acsSign' },
  ],
};

// Service pages. `involves` lists are plain descriptions of what that kind of job
// includes. They are NOT claims about ECM and contain no prices, timelines,
// permit rules or guarantees. DRAFT copy: needs approval before launch.
export const services = {
  title: 'Services | Elite Construction Management',
  description:
    'Custom homes, ADUs, additions, remodels and commercial tenant improvements. Licensed Hawaii general contractor CT-37929.',
  h1: 'What we build',
  intro: 'Open a category to read more, or go straight to the estimate form.',
  items: [
    {
      id: 'custom-homes',
      // Recent projects shown at the bottom of this panel on /services (ids in projects.cards, max 4).
      related: ['hawaii-island-new-homes'],
      name: 'Custom homes and new construction',
      text: 'Already have plans? We build from them. Starting with just an idea or a lot? We connect you with an architect or designer and take it from first drawings to move in. We manage permits, subs and inspections the whole way.',
      href: '/custom-homes',
    },
    {
      id: 'adus-additions',
      // Recent projects shown at the bottom of this panel on /services (ids in projects.cards, max 4).
      related: ['waianae-remodel-addition'],
      name: 'ADUs and additions',
      text: 'An ADU or addition adds space without moving. We handle the build and coordinate permits and inspections.',
      href: '/adu-oahu',
    },
    {
      id: 'remodels',
      // Recent projects shown at the bottom of this panel on /services (ids in projects.cards, max 4).
      related: ['waianae-remodel-addition', 'mililani-remodel', 'waianae-remodel-2', 'kaneohe-bamboo-floor'],
      name: 'Remodels',
      text: 'Kitchens, bathrooms and whole home remodels, scoped clearly before work starts.',
      href: '/remodeling',
    },
    {
      id: 'commercial',
      // Recent projects shown at the bottom of this panel on /services (ids in projects.cards, max 4).
      related: ['acs-hope-lodge', 'longs-drugs'],
      name: 'Commercial tenant improvements',
      text: 'Build outs and renovations for retail, office and other commercial spaces.',
      href: '/commercial-tenant-improvements',
    },
  ],
  subsLine: 'Plumbing and electrical are done by licensed subcontractors.',
  relatedLabel: 'Recent projects',
};

export type ServiceSection = { id: string; heading: string; text?: string; list?: string[]; image?: string };
export type ServicePage = {
  key: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  image: string;
  sections: ServiceSection[];
};

export const serviceDetail: Record<string, ServicePage> = {
  adu: {
    key: 'adu',
    path: '/adu-oahu',
    title: 'ADU and Ohana Unit Builder on Oahu | Elite Construction Management',
    description:
      'ADUs, ohana units and additions built by Elite Construction Management, a licensed Hawaii general contractor based in Kapolei. Request an estimate.',
    h1: 'ADU and ohana unit builder on Oahu',
    intro: [
      // SEO dispatch 2 (2026-11-25): first paragraph uses both 'ADU' and 'ohana unit'.
      'An ADU, ohana unit or addition adds space without moving. We handle the build and coordinate permits and inspections.',
      'Elite Construction Management is a licensed Hawaii general contractor based in Kapolei.',
    ],
    image: 'adu',
    sections: [
      {
        id: 'what-it-involves',
        heading: 'What an ADU or ohana unit project involves',
        list: [
          'Talking through how you plan to use the new unit and what fits on your lot.',
          'Plans from your architect or designer.',
          'Permit applications and plan review.',
          'Site work, utilities and foundation.',
          'Framing, roofing, windows and doors.',
          'Plumbing and electrical by licensed subcontractors.',
          'Insulation, drywall, flooring, cabinets and finishes.',
          'Inspections through final.',
        ],
      },
      {
        id: 'additions',
        heading: 'Additions',
        text: 'An addition extends the home you already have, for example a new bedroom, a bathroom or a larger living area. The work ties new foundation, framing, roofing, plumbing and electrical into the existing house.',
      },
    ],
  },
  customHomes: {
    key: 'customHomes',
    path: '/custom-homes',
    title: 'Custom Home Builders on Oahu and the Big Island | Elite Construction Management',
    description:
      'Custom homes and new construction by Elite Construction Management, a licensed general contractor based in Kapolei, Hawaii. Request an estimate.',
    h1: 'Custom home builder in Hawaii',
    intro: [
      'Already have plans? We build from them. Starting with just an idea or a lot? We connect you with an architect or designer and take it from first drawings to move in. We manage permits, subs and inspections the whole way. Recent work includes new single family homes in Puna on the Big Island.',
    ],
    image: 'home',
    sections: [
      {
        id: 'what-it-involves',
        heading: 'What building a custom home involves',
        list: [
          'Reviewing your plans, your lot and your budget.',
          'Permit applications and plan review.',
          'Site preparation and foundation.',
          'Framing, roofing, windows and exterior.',
          'Plumbing, electrical and other trades by licensed subcontractors.',
          'Insulation, drywall, cabinets, flooring and finishes.',
          'Inspections and a final walkthrough before move in.',
        ],
      },
    ],
  },
  remodeling: {
    key: 'remodeling',
    path: '/remodeling',
    title: 'Kitchen, Bathroom and Home Remodeling on Oahu | Elite Construction Management',
    description:
      'Kitchen, bathroom and whole home remodels by Elite Construction Management, a licensed Hawaii general contractor based in Kapolei. Request an estimate.',
    h1: 'Home remodeling on Oahu: kitchens, bathrooms and whole homes',
    intro: [
      'Kitchens, bathrooms and whole home remodels, scoped clearly before work starts.',
    ],
    image: 'bambooAfter',
    sections: [
      {
        id: 'kitchens',
        heading: 'Kitchen remodels',
        image: 'kitchen',
        text: 'A kitchen remodel can be new cabinets and counters or a full change to the layout. The work can include demolition, framing changes, plumbing and electrical by licensed subcontractors, cabinets, counters, flooring, fixtures and finishes.',
      },
      {
        id: 'bathrooms',
        heading: 'Bathroom remodels',
        image: 'bathroom',
        text: 'A bathroom remodel can be new fixtures and tile or a full rebuild down to the framing. The work can include demolition, plumbing and electrical by licensed subcontractors, waterproofing, tile, vanities, fixtures and finishes.',
      },
      {
        id: 'whole-home',
        heading: 'Whole home remodels',
        text: 'A whole home remodel updates several rooms or the full house at once. It can include layout changes, kitchens, bathrooms, flooring, windows and finishes throughout.',
      },
    ],
  },
  commercial: {
    key: 'commercial',
    path: '/commercial-tenant-improvements',
    title: 'Commercial Tenant Improvement Contractor in Hawaii | Elite Construction Management',
    description:
      'Commercial build outs and tenant improvements for retail, office and other commercial spaces. Licensed Hawaii general contractor CT-37929 in Kapolei.',
    h1: 'Commercial tenant improvement contractor',
    intro: ['Build outs and renovations for retail, office and other commercial spaces.'],
    // Back to the sign close-up until a full size building photo arrives (Ellard, 2026-11-25).
    // The sign fills the frame, so the header shows it beside the heading, not under it.
    image: 'acsSign',
    imageSide: true,
    sections: [
      {
        id: 'what-it-involves',
        heading: 'What a tenant improvement involves',
        list: [
          'Reviewing the space, your plans and what the landlord requires.',
          'Permit applications and plan review.',
          'Demolition of existing finishes.',
          'Framing, walls, ceilings and doors.',
          'Plumbing and electrical by licensed subcontractors.',
          'Flooring, paint and finishes.',
          'Inspections through final.',
        ],
      },
    ],
  },
};

export type Project = {
  id: string;
  name: string;
  type: string;
  place: string; // '' when not stated in SOURCES.md
  summary: string;
  cover: string; // image slot
  gallery?: Array<{ image: string; caption: string }>;
  compare?: { before: string; after: string; beforeLabel: string; afterLabel: string };
};

// Real ECM projects. Captions use only the wording supplied by the PM (2026-11-22) and
// SOURCES.md. Client names approved by Jesse (via Ellard, 2026-11-21).
export const projects = {
  title: 'Projects | Elite Construction Management',
  description:
    'Projects by Elite Construction Management: Hope Lodge, Longs Drugs, new homes on the Big Island, and remodels and an addition in Waianae and Mililani.',
  h1: 'Our projects',
  text: 'A few recent jobs. Ask us about similar projects when you request an estimate.',
  eyebrow: 'Portfolio',
  compareHeading: 'Before and after',
  galleryHeading: 'Photos',
  cards: [
    {
      id: 'acs-hope-lodge',
      name: 'American Cancer Society Hope Lodge',
      type: 'Restoration and pergola',
      place: 'Honolulu, Oahu',
      summary: 'Leak prevention and water mitigation, interior restoration and ceiling work, and an aluminum pergola system.',
      cover: 'acsSign',
      gallery: [
        { image: 'acsExterior', caption: 'American Cancer Society Hope Lodge, Honolulu' },
        { image: 'acsCeiling1', caption: 'Interior restoration and ceiling work' },
        { image: 'acsCeiling2', caption: 'Interior restoration and ceiling work' },
        { image: 'pergolaView', caption: 'Aluminum pergola system' },
      ],
    },
    {
      id: 'longs-drugs',
      name: 'Longs Drugs Oahu stores',
      type: 'Retail',
      place: 'Honolulu, Kapolei and Nanakuli',
      summary: 'Metal drip edge replacement, plus retail store renovations and maintenance.',
      cover: 'longsStore',
      gallery: [
        { image: 'longsBefore', caption: 'Metal drip edge replacement, before' },
        { image: 'longsAfter', caption: 'Metal drip edge replacement, after' },
        { image: 'longs1', caption: 'Metal drip edge replacement' },
        { image: 'longsSign', caption: 'Metal drip edge replacement' },
      ],
    },
    // Waianae and Mililani: wording supplied by the PM (2026-11-23). Before and after shots are
    // different angles, so no compare slider; the gallery order puts the pairs side by side.
    {
      id: 'waianae-remodel-addition',
      name: 'Waianae remodel and addition',
      type: 'Remodel and addition',
      place: 'Waianae, Oahu',
      summary: 'Gut remodel of an older home plus a new addition with a second unit, including a new kitchen, bathrooms and a kitchenette.',
      cover: 'waianae-kitchen-after-1',
      gallery: [
        { image: 'waianae-remodel-exterior-before-1', caption: 'Before' },
        { image: 'waianae-remodel-demo', caption: 'During demolition' },
        { image: 'waianae-addition-framing-1', caption: 'Addition framing' },
        { image: 'waianae-addition-framing-3', caption: 'Addition framing' },
        { image: 'waianae-addition-house-wrap', caption: 'Addition wrapped' },
        { image: 'waianae-addition-siding-done', caption: 'Addition sided' },
        { image: 'waianae-kitchen-before-1', caption: 'Kitchen before' },
        { image: 'waianae-kitchen-after-1', caption: 'Kitchen after' },
        { image: 'waianae-bathroom-before-1', caption: 'Bathroom before' },
        { image: 'waianae-shower-after', caption: 'Bathroom after' },
        { image: 'waianae-bathroom-after-1', caption: 'Bathroom after' },
        { image: 'waianae-second-unit-kitchenette-1', caption: 'Second unit kitchenette' },
      ],
    },
    {
      id: 'mililani-remodel',
      name: 'Mililani remodel',
      type: 'Remodel',
      place: 'Mililani, Oahu',
      summary: 'Home remodel with a new kitchen and bathrooms.',
      cover: 'mililani-kitchen-1',
      gallery: [
        { image: 'mililani-remodel-living-room', caption: 'Living room' },
        { image: 'mililani-remodel-dining-kitchen', caption: 'Dining and kitchen' },
        { image: 'mililani-kitchen-2', caption: 'Kitchen' },
        { image: 'mililani-bathroom-1', caption: 'Bathroom' },
        { image: 'mililani-bathroom-2', caption: 'Bathroom' },
      ],
    },
    // Big Island new homes and a second Waianae remodel: PM wording (2026-11-23).
    // Built as new homes for sale: never caption them as custom homes.
    {
      id: 'hawaii-island-new-homes',
      name: 'Big Island new homes',
      type: 'New homes',
      place: 'Big Island',
      summary: 'New single family homes built on the Big Island.',
      cover: 'hawaii-island-new-home-exterior-2',
      gallery: [
        { image: 'hawaii-island-new-home-exterior-1', caption: 'New home' },
        { image: 'hawaii-island-new-home-exterior-3', caption: 'New home' },
        { image: 'hawaii-island-new-home-exterior-4', caption: 'New home' },
        { image: 'hawaii-island-new-home-entry', caption: 'Entry porch' },
        { image: 'hawaii-island-new-home-great-room-1', caption: 'Great room and kitchen' },
        { image: 'hawaii-island-new-home-living-dining', caption: 'Living and dining' },
        { image: 'hawaii-island-new-home-kitchen-1', caption: 'Kitchen' },
        { image: 'hawaii-island-new-home-kitchen-3', caption: 'Kitchen' },
        { image: 'hawaii-island-new-home-bathroom-1', caption: 'Bathroom' },
        { image: 'hawaii-island-new-home-shower', caption: 'Shower and tub' },
        { image: 'hawaii-island-new-home-double-vanity', caption: 'Double vanity' },
        { image: 'hawaii-island-new-home-barn-door', caption: 'Barn door detail' },
      ],
    },
    {
      id: 'waianae-remodel-2',
      name: 'Waianae home remodel',
      type: 'Remodel',
      place: 'Waianae, Oahu',
      summary: 'Home remodel with a new kitchen and bathroom.',
      cover: 'waianae-remodel-2-kitchen',
      gallery: [
        { image: 'waianae-remodel-2-kitchen', caption: 'Kitchen' },
        { image: 'waianae-remodel-2-shower', caption: 'Shower' },
      ],
    },
    {
      id: 'kaneohe-bamboo-floor',
      name: 'Kaneohe bamboo floor remodel',
      type: 'Remodel',
      place: 'Kaneohe, Oahu',
      summary: 'Bamboo floor remodel at a Kaneohe residence.',
      cover: 'bambooAfter',
      compare: { before: 'bambooBefore', after: 'bambooAfterAligned', beforeLabel: 'Before', afterLabel: 'After' },
    },
    {
      id: 'salt-lake-driveway',
      name: 'Salt Lake concrete driveway and walkway',
      type: 'Concrete',
      place: 'Salt Lake, Oahu',
      summary: 'Concrete driveway and walkway at a Salt Lake residence.',
      cover: 'drivewayDuring',
      // No finished "after" photo on file yet: the second photo is during the pour.
      compare: { before: 'drivewayBeforeAligned', after: 'drivewayDuring', beforeLabel: 'Before', afterLabel: 'During' },
    },
    {
      id: 'concrete-walkway',
      name: 'Concrete walkway',
      type: 'Concrete',
      place: '',
      summary: 'Concrete walkway in a garden courtyard.',
      cover: 'walk2',
      gallery: [
        { image: 'walk1', caption: 'Concrete walkway in a garden courtyard' },
        { image: 'walk2', caption: 'Concrete walkway in a garden courtyard' },
      ],
    },
  ] as Project[],
};

export const about = {
  title: 'About | Elite Construction Management',
  description:
    'Elite Construction Management is a licensed Hawaii general contractor in Kapolei led by Jesse Alverio.',
  h1: 'About Elite Construction Management',
  text: 'Elite Construction Management is a Hawaii general contractor based in Kapolei, led by owner Jesse Alverio. Our crews are backed by licensed subcontractors for plumbing, electrical and other trades.',
  credentialsHeading: 'Credentials',
  image: 'hawaii-island-new-home-exterior-4',
  contactLead: 'Have a question?',
  contactLink: 'Contact us',
};

// Multi-step estimate form. Netlify form name stays "estimate".
export const estimate = {
  title: 'Request an Estimate | Elite Construction Management',
  description:
    copy(siteVisitCopy.estimateMeta),
  h1: 'Request an Estimate',
  intro: copy(siteVisitCopy.estimateIntro),
  // Line under the form (2026-11-25).
  questionLead: 'Just have a question?',
  questionLink: 'Send us a message.',
  formName: 'estimate',
  // Hidden lead-type field: the lead log (ops/lead-log) sorts leads by it.
  leadType: 'estimate',
  formVersion: 'v2-multistep',
  defaultSubject: 'New lead: estimate request',
  subjectPrefix: 'New lead',
  progressTemplate: 'Step {n} of {total}',
  next: 'Next',
  back: 'Back',
  chooseOne: 'Please choose one to continue.',
  steps: {
    type: {
      legend: 'What kind of project is it?',
      name: 'project-type',
      otherLabel: 'What kind of project?',
      otherName: 'project-type-other',
      options: [
        'Custom home',
        'ADU or ohana unit',
        'Addition',
        'Kitchen remodel',
        'Bathroom remodel',
        'Whole home remodel',
        'Commercial build out',
        'Other',
      ],
    },
    location: {
      legend: 'Where is the project?',
      islandLabel: 'Island',
      islandOtherLabel: 'Which island or area?',
      islandOtherName: 'island-other',
      islandName: 'island',
      islands: ['Oahu', 'Maui', 'Big Island', 'Kauai', 'Other'],
      zipLabel: 'ZIP code',
      zipName: 'zip',
      zipHint: '5 digits',
    },
    timeline: {
      legend: 'When do you want to start?',
      name: 'timeline',
      options: ['As soon as possible', '1 to 3 months', '3 to 6 months', '6 months or more', 'Just planning'],
    },
    budget: {
      legend: 'What is your budget range?',
      name: 'budget',
      options: ['Under $50k', '$50k to $150k', '$150k to $500k', '$500k to $1M', 'Over $1M', 'Not sure yet'],
    },
    plans: {
      legend: 'Do you have plans?',
      name: 'plans',
      options: ['I have plans', 'I need design help', 'Not sure'],
    },
    contact: {
      legend: 'How do we reach you?',
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      bestTime: 'Best time to call',
      bestTimes: ['Morning', 'Afternoon', 'Evening', 'Any time'],
      notes: 'Anything else about the project (optional)',
      // How did you hear about us (Ellard, 2026-11-25). Optional; "Other" uses the same
      // show-and-require text field pattern as project type and island.
      heardAbout: {
        label: 'How did you hear about us? (optional)',
        name: 'heard-about',
        otherLabel: 'Where did you hear about us?',
        otherName: 'heard-about-other',
        options: ['Google search', 'Google Maps', 'Instagram', 'Facebook', 'Friend or family', 'Architect or designer', 'Saw an ECM job sign', 'Other'],
      },
    },
  },
};

export const subcontractors = {
  title: 'Subcontractor Signup | Elite Construction Management',
  description:
    'Licensed subcontractors and suppliers in Hawaii can send their details to work with Elite Construction Management.',
  h1: 'Work with us',
  intro:
    'We work with licensed subcontractors and suppliers in Hawaii. Send us your details and we will reach out when a project fits.',
  formName: 'subcontractor',
  // Email subject for Netlify's alert (hidden "subject" field). JS fills in trade and islands.
  defaultSubject: 'New subcontractor: form submission',
  subjectPrefix: 'New subcontractor',
  fields: {
    company: 'Company name',
    contact: 'Contact name',
    phone: 'Phone',
    email: 'Email',
    trade: 'Trade',
    license: 'License number',
    islands: 'Islands served',
    insurance: 'Insurance on file',
    note: 'Short note',
  },
  yes: 'Yes',
  no: 'No',
};

// Contact page (2026-11-25). Netlify form name "contact".
export const contact = {
  title: 'Contact | Elite Construction Management',
  description:
    'Call, request an estimate or send a message to Elite Construction Management, a licensed general contractor in Kapolei, Hawaii.',
  h1: 'Contact us',
  intro: 'Three ways to reach Elite Construction Management.',
  callHeading: 'Call',
  estimateHeading: 'Request an estimate',
  estimateLine: copy(siteVisitCopy.contactEstimate),
  messageHeading: 'Send a message',
  messageLine: 'For questions that are not an estimate request. We reply by email within one business day.',
  formName: 'contact',
  leadType: 'contact',
  // Email subject for Netlify's alert (hidden "subject" field). JS adds the visitor's subject.
  defaultSubject: 'Website message',
  subjectPrefix: 'Website message',
  fields: {
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
  },
};

export const thankYou = {
  title: 'Thank You | Elite Construction Management',
  description: copy(siteVisitCopy.thanksText),
  h1: 'Thanks.',
  text: copy(siteVisitCopy.thanksText),
  subcontractorText: 'We received your details and will reach out when a project fits.',
  contactText: 'Thanks, we got your message. We reply by email within one business day.',
  urgentLead: 'For anything urgent, call',
  nextHeading: 'What happens next',
  nextSteps: ['We review your project.', 'We call you.', copy(siteVisitCopy.thanksStep)],
  planningHeading: 'Still planning?',
  planningLead: 'This guide may help while you plan:',
};

export const notFound = {
  title: 'Page Not Found | Elite Construction Management',
  description: 'This page could not be found.',
  h1: 'Page not found',
  text: 'The page you are looking for is not here.',
  homeLink: 'Go to the home page',
};

// ---------------------------------------------------------------------------
// GUIDES.
// Final guides live as approved Markdown in src/content/guides/*.md (loaded by src/lib/guides.ts).
// Only guides that are still drafts stay in the `guides` array below.
// status 'draft': page shows a DRAFT badge, gets noindex and stays out of the sitemap.
// ---------------------------------------------------------------------------
export type Guide = {
  slug: string;
  status: 'draft' | 'final';
  title: string;
  description: string;
  h1: string;
  intro: string; // INTRO SLOT: empty until the PM writes it
  sections: Array<{ id: string; heading: string; body: string[] }>; // body empty until written
};

export const guidesHub = {
  status: 'final' as 'draft' | 'final',
  title: 'Building Guides | Elite Construction Management',
  description: 'Guides for planning ADUs, custom homes and remodels in Hawaii, from Elite Construction Management.',
  h1: 'Guides',
  intro: 'Plain guides to building and remodeling in Hawaii, based on published sources and checked on the date shown.',
};

export const guides: Guide[] = [
  {
    slug: 'adu-oahu',
    status: 'draft',
    title: 'ADUs on Oahu: A Planning Guide | Elite Construction Management',
    description: 'A planning guide to building an ADU or ohana unit on Oahu, from Elite Construction Management.',
    h1: 'Building an ADU on Oahu',
    intro: '',
    sections: [
      { id: 'adu-or-ohana', heading: 'ADU or ohana unit', body: [] },
      { id: 'lot', heading: 'Is your lot a fit', body: [] },
      { id: 'design', heading: 'Design and plans', body: [] },
      { id: 'permits', heading: 'Permits', body: [] },
      { id: 'costs', heading: 'Costs to plan for', body: [] },
      { id: 'build', heading: 'The build and inspections', body: [] },
      { id: 'questions', heading: 'Questions to ask a contractor', body: [] },
    ],
  },
];

export const guidePath = (slug: string) => `/guides/${slug}`;

// First publication date of the final guides (Article datePublished).
export const guidesPublished = '2026-11-24';

// Paths kept out of the sitemap because they are still drafts (read by astro.config.mjs).
export const draftPaths = [
  ...(guidesHub.status === 'draft' ? ['/guides'] : []),
  ...guides.filter((g) => g.status === 'draft').map((g) => guidePath(g.slug)),
];

// One related guide link per page, placed after the named section (service pages) or under
// the estimate form. Links only render when the guide is final.
export const relatedGuides: Record<string, { slug: string; afterSection?: string }> = {
  remodeling: { slug: 'bathroom-remodel-cost-honolulu', afterSection: 'bathrooms' },
  customHomes: { slug: 'cost-to-build-a-house-in-hawaii', afterSection: 'what-it-involves' },
  estimate: { slug: 'hiring-a-general-contractor-in-hawaii' },
};

// Thank you page: which guide to suggest to someone who picked "Just planning".
// Only final guides are linked; a draft entry falls back to `default`.
export const planningGuideByType: Record<string, string> = {
  'Custom home': 'cost-to-build-a-house-in-hawaii',
  'ADU or ohana unit': 'adu-oahu',
  Addition: 'adu-oahu',
  'Bathroom remodel': 'bathroom-remodel-cost-honolulu',
  default: 'hiring-a-general-contractor-in-hawaii',
};

// FAQ blocks, keyed by page. Empty = no FAQ section and no FAQPage structured data.
// Answers use ONLY confirmed facts. No prices, timelines, permit rules or guarantees.
const Q = {
  licensed: { q: 'Are you a licensed contractor?', a: 'Yes. Elite Construction Management holds Hawaii contractor license CT-37929, Class B General Building.' },
  islands: { q: 'What islands do you serve?', a: 'We work on Oahu, Maui and the Big Island. We are based in Kapolei.' },
  adus: { q: 'Do you build ADUs and ohana units?', a: 'Yes. We build ADUs, ohana units and additions. We handle the build and coordinate permits and inspections.' },
  commercial: { q: 'Do you do commercial build outs?', a: 'Yes. We do build outs and renovations for retail, office and other commercial spaces. We have worked on projects for Longs Drugs, American Cancer Society, Tesla and Buffalo Wild Wings.' },
  plans: { q: "Can you build from my architect's plans?", a: 'Yes. And if you do not have plans yet, we connect you with an architect or designer to draw them.' },
  // ^ 'we connect you with an architect or designer' is audit claim C29: needs Jesse's yes (Answer Sheet #30).
  trades: { q: 'Who does the plumbing and electrical?', a: 'Licensed subcontractors. Our crews are backed by licensed subcontractors for plumbing, electrical and other trades.' },
  estimate: { q: 'How do I get an estimate?', a: copy(siteVisitCopy.faqEstimate) },
  callback: { q: 'How fast will you call me back?', a: "We'll call you back within one business day." },
  smallJobs: { q: 'Do you take smaller jobs?', a: 'Yes. We take jobs under $50k as well as larger projects.' },
  veteran: { q: 'Are you veteran owned?', a: 'Yes. Elite Construction Management is veteran owned. Owner Jesse Alverio is a veteran.' },
  permitsSubs: { q: 'Do you manage permits, subs and inspections?', a: 'Yes. We manage permits, subs and inspections through to move in.' },
  remodels: { q: 'Do you remodel kitchens and bathrooms?', a: 'Yes. We do kitchen, bathroom and whole home remodels, scoped clearly before work starts.' },
};

export const faqs: Record<string, Array<{ q: string; a: string }>> = {
  home: [Q.licensed, Q.islands, Q.adus, Q.commercial, Q.plans, Q.trades, Q.estimate, Q.callback, Q.smallJobs, Q.veteran],
  services: [],
  adu: [Q.adus, Q.plans, Q.islands, Q.callback],
  customHomes: [Q.plans, Q.permitsSubs, Q.trades, Q.islands],
  remodeling: [Q.remodels, Q.smallJobs, Q.trades, Q.estimate],
  commercial: [Q.commercial, Q.licensed, Q.islands, Q.trades],
  'guide:adu-oahu': [],
  // Final guides take their FAQ from the ## FAQ section of their Markdown file.
};

// GUIDE CONTENT slots on service pages: short excerpts or links the PM adds later.
export const guideContent: Record<string, Array<{ heading: string; text: string; guide?: string }>> = {
  adu: [],
  customHomes: [],
  remodeling: [],
  commercial: [],
};

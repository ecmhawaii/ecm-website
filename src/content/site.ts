// ALL visible website text lives in this file.
// When the approved copy is ready, replace the strings here and nothing else.
// Rules (see CLAUDE.md): no em dashes or en dashes, only claims Jesse has confirmed,
// business name / phone / license identical everywhere (use the `business` values below).

export const business = {
  name: 'Elite Construction Management',
  city: 'Kapolei, Hawaii',
  phoneDisplay: '(808) 987-5782',
  phoneHref: 'tel:+18089875782',
  license: 'Hawaii contractor license BC-37929',
  siteUrl: 'https://ecmhawaii.com',
};

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Request an Estimate', href: '/start-your-project' },
];

export const ui = {
  skipLink: 'Skip to main content',
  callButton: `Call ${business.phoneDisplay}`,
  estimateButton: 'Request an Estimate',
  mainNavLabel: 'Main',
  footerNavLabel: 'Footer',
  footerSubcontractors: 'Subcontractors',
  photoComing: 'Photo coming',
  requiredNote: 'Fields marked * are required.',
  selectPlaceholder: 'Choose one',
  submit: 'Send',
  honeypotLabel: 'Leave this field empty',
};

export const home = {
  title: 'Elite Construction Management | Hawaii General Contractor',
  description:
    'Kapolei general contractor for custom homes, ADUs, remodels and commercial tenant improvements. Call (808) 987-5782 or request an estimate online.',
  h1: 'General contractor for homes and businesses in Hawaii',
  intro:
    'Elite Construction Management is a licensed Hawaii general contractor based in Kapolei. We build new homes, ADUs and additions, remodels and commercial tenant improvements, and we run the job from first walkthrough to final inspection.',
  proof: ['Hawaii license BC-37929, Class B General Building.', 'Licensed and insured.'],
  servicesHeading: 'What we build',
  serviceCards: [
    'Custom homes and new construction',
    'ADUs and additions',
    'Remodels',
    'Commercial tenant improvements',
  ],
  howHeading: 'How it works',
  steps: [
    { title: 'Tell us about your project.', text: 'Use the estimate form or call.' },
    {
      title: 'Site visit.',
      text: 'We walk the property with you and talk through scope, budget and timing.',
    },
    { title: 'Proposal.', text: 'You get a fixed price contract with the scope written out.' },
    {
      title: 'Build.',
      text: 'Our crew and licensed subs do the work, and you get regular updates.',
    },
  ],
  closingHeading: 'Planning a project?',
  closingText:
    'Tell us what you have in mind and we will follow up to set up a site visit.',
};

export const services = {
  title: 'Services | Elite Construction Management',
  description:
    'Custom homes, ADUs, additions, remodels and commercial tenant improvements. Licensed Hawaii general contractor BC-37929.',
  h1: 'What we build',
  items: [
    {
      id: 'custom-homes',
      name: 'Custom homes and new construction',
      text: 'We build new homes from plans you bring or plans developed with your architect or designer. We manage permits, subs and inspections through to move in.',
    },
    {
      id: 'adus-additions',
      name: 'ADUs and additions',
      text: 'An ADU or addition adds space without moving. We handle the build and coordinate permits and inspections.',
    },
    {
      id: 'remodels',
      name: 'Remodels',
      text: 'Kitchens, bathrooms and whole home remodels, scoped clearly before work starts so the price is set up front.',
    },
    {
      id: 'commercial',
      name: 'Commercial tenant improvements',
      text: 'Build outs and renovations for retail, office and other commercial spaces.',
    },
  ],
  subsLine: 'Plumbing and electrical are done by licensed subcontractors.',
};

export const projects = {
  title: 'Projects | Elite Construction Management',
  description:
    'Projects by Elite Construction Management, a general contractor in Kapolei, Hawaii.',
  h1: 'Our projects',
  text: 'Project photos are coming soon. Ask us about similar projects when you request an estimate.',
  // Add cards here only with the owner's written OK (CLAUDE.md rule 5).
  // Shape: { type: 'Remodel', island: 'Oahu', summary: 'Two sentences.', photo?: '/path.jpg', photoAlt?: '...' }
  cards: [] as Array<{
    type: string;
    island: string;
    summary: string;
    photo?: string;
    photoAlt?: string;
  }>,
};

export const about = {
  title: 'About | Elite Construction Management',
  description:
    'Elite Construction Management is a licensed Hawaii general contractor in Kapolei led by Jesse Alverio.',
  h1: 'About Elite Construction Management',
  text: 'Elite Construction Management is a Hawaii general contractor based in Kapolei, led by owner Jesse Alverio. Our crews are backed by licensed subcontractors for plumbing, electrical and other trades.',
  credentialsHeading: 'Credentials',
  credentials: ['Hawaii contractor license BC-37929, Class B General Building.', 'General liability insured.'],
};

export const estimate = {
  title: 'Request an Estimate | Elite Construction Management',
  description:
    'Tell us about your project and Elite Construction Management will follow up to schedule a site visit.',
  h1: 'Request an Estimate',
  intro: 'Tell us a little about your project. We will get back to you to set up a site visit.',
  formName: 'estimate',
  fields: {
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
    address: 'Project address or area',
    projectType: 'Project type',
    budget: 'Budget range',
    start: 'When do you want to start',
    details: 'Tell us about the project',
    heard: 'How did you hear about us',
  },
  projectTypes: ['Custom home', 'ADU or addition', 'Remodel', 'Commercial', 'Other'],
  budgets: ['Under $50k', '$50k to $150k', '$150k to $500k', '$500k to $1M', 'Over $1M'],
  starts: ['Within 3 months', '3 to 6 months', '6 months or more', 'Just planning'],
  heardFrom: ['Google', 'Referral', 'Instagram', 'Other'],
};

export const subcontractors = {
  title: 'Subcontractor Signup | Elite Construction Management',
  description:
    'Licensed subcontractors and suppliers in Hawaii can send their details to work with Elite Construction Management.',
  h1: 'Work with us',
  intro:
    'We work with licensed subcontractors and suppliers in Hawaii. Send us your details and we will reach out when a project fits.',
  formName: 'subcontractor',
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

export const thankYou = {
  title: 'Thank You | Elite Construction Management',
  description: 'We received your request and will contact you to schedule a site visit.',
  h1: 'Thanks.',
  text: 'We received your request and will contact you to schedule a site visit.',
  urgentLead: 'For anything urgent, call',
};

export const notFound = {
  title: 'Page Not Found | Elite Construction Management',
  description: 'This page could not be found.',
  h1: 'Page not found',
  text: 'The page you are looking for is not here.',
  homeLink: 'Go to the home page',
};

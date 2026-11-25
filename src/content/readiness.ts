// Project readiness check at /tools/project-readiness (2026-11-25).
// ALL COPY IS NEW: confirm:false (Draft on previews, left out of production, src/lib/draft.ts).
// Runs fully in the browser and sends no answers. The step counter only gets "readiness start"
// (first answer) and "readiness finish" (result shown), with step 0.
// Rules: no prices, cost ranges, durations, permit times or ECM claims.
// Island, project type and timeline reuse the estimate form's option values exactly, so the
// "Start my estimate" link can preselect them (no personal data goes in the link).
import { estimate } from './site';

export type ReadinessOption = { label: string; points: number };
export type ReadinessQuestion = { name: string; legend: string; options: ReadinessOption[]; param?: 'type' | 'island' | 'timeline' };
export type ReadinessTier = { key: string; min: number; heading: string; text: string };

const s = estimate.steps;
const noPoints = (labels: string[]) => labels.map((label) => ({ label, points: 0 }));
const timelinePoints: Record<string, number> = { 'As soon as possible': 2, '1 to 3 months': 2, '3 to 6 months': 1, '6 months or more': 0, 'Just planning': 0 };

export const readiness = { id: 'readiness-tool', confirm: false,
  path: '/tools/project-readiness',
  title: 'Project Readiness Check | Elite Construction Management',
  description: 'Eight multiple choice questions about your Hawaii building project, with next steps for where you are. Your answers stay in your browser.',
  h1: 'Project readiness check',
  intro: 'Answer eight multiple choice questions to see where your project stands and what to do next. Your answers stay in your browser and are not sent to us.',
  noscript: 'This check needs JavaScript to show your result. You can go straight to the estimate form instead.',
  submit: 'See my result',
  missing: 'Please answer every question to see your result.',
  resultEyebrow: 'Your result',
  nextHeading: 'Next steps',
  guideLead: 'Read',
  checklistLead: 'Go through the',
  estimateButton: 'Start my estimate',
  restart: 'Change my answers',
  // Linked from the Guides page and the Guides list in the footer.
  promoHeading: 'Not sure where to start?',
  promoText: 'Take the project readiness check: eight multiple choice questions and next steps for where you are.',
  promoLink: 'Take the readiness check',
  questions: [
    { name: 'own', legend: 'Do you own the property?', options: [{ label: 'Yes', points: 2 }, { label: 'I lease it', points: 2 }, { label: 'I am buying it', points: 1 }, { label: 'Not yet', points: 0 }] },
    { name: 'island', legend: 'Which island is the project on?', param: 'island', options: noPoints(s.location.islands) },
    { name: 'type', legend: 'What kind of project is it?', param: 'type', options: noPoints(s.type.options) },
    { name: 'plans', legend: 'Do you have plans or drawings?', options: [{ label: 'Yes, finished plans', points: 2 }, { label: 'Plans are in progress', points: 1 }, { label: 'Not yet', points: 0 }] },
    { name: 'budget', legend: 'Have you set a budget?', options: [{ label: 'Yes', points: 2 }, { label: 'A rough number', points: 1 }, { label: 'Not yet', points: 0 }] },
    { name: 'financing', legend: 'How will you pay for the project?', options: [{ label: 'Cash or savings', points: 2 }, { label: 'Financing is lined up', points: 2 }, { label: 'Still looking into financing', points: 1 }, { label: 'Not sure yet', points: 0 }] },
    { name: 'timeline', legend: 'When do you want to start?', param: 'timeline', options: s.timeline.options.map((label) => ({ label, points: timelinePoints[label] ?? 0 })) },
    { name: 'permits', legend: 'Have you started on permits?', options: [{ label: 'Yes, applied or issued', points: 2 }, { label: 'Not yet', points: 0 }, { label: 'Not sure if I need one', points: 0 }] },
  ] as ReadinessQuestion[],
  // Score: sum of points (most 12). First tier whose `min` the score reaches.
  tiers: [
    { key: 'ready', min: 9, heading: 'Ready to talk to a contractor', text: 'You have the main pieces in place. A good next step is to request an estimate.' },
    { key: 'close', min: 5, heading: 'Getting close', text: 'A few pieces are still open. The guide and checklist below can help you finish them, and you can request an estimate whenever you are ready.' },
    { key: 'early', min: 0, heading: 'Early planning', text: 'You are at the start. The guide and checklist below cover what to think about first, and you can request an estimate whenever you are ready.' },
  ] as ReadinessTier[],
  // Project type -> matching guide (or page) and checklist slug.
  matchByType: {
    'Custom home': { href: '/guides/cost-to-build-a-house-in-hawaii', checklist: 'cost-to-build-a-house-in-hawaii' },
    'ADU or ohana unit': { href: '/adu-oahu', checklist: 'adu-oahu' },
    Addition: { href: '/adu-oahu', checklist: 'adu-oahu' },
    'Kitchen remodel': { href: '/guides/hiring-a-general-contractor-in-hawaii', checklist: 'hiring-a-general-contractor-in-hawaii' },
    'Bathroom remodel': { href: '/guides/bathroom-remodel-cost-honolulu', checklist: 'bathroom-remodel-cost-honolulu' },
    'Whole home remodel': { href: '/guides/hiring-a-general-contractor-in-hawaii', checklist: 'hiring-a-general-contractor-in-hawaii' },
    'Commercial build out': { href: '/guides/hiring-a-general-contractor-in-hawaii', checklist: 'hiring-a-general-contractor-in-hawaii' },
    Other: { href: '/guides/hiring-a-general-contractor-in-hawaii', checklist: 'hiring-a-general-contractor-in-hawaii' },
  } as Record<string, { href: string; checklist: string }>,
};

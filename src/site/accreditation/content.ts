import { PRODUCT_NAME } from '@/lib/product'

/**
 * Every line of copy on the accreditation page (/product/accreditation), in one
 * place, so it can be read and run through `copycheck` without the markup.
 *
 * ★ ONLY WHAT THE PRODUCT DOES TODAY (checked against the code, 2026-10-20).
 * Accreditation has four groups: press, crew, speakers and the organiser's own
 * team (`ACCREDITATION_TYPE_OPTIONS`). Forms are invite-only, by a link staff
 * copy and send; staff approve or reject; approval emails a QR badge; check-in
 * scans it. NOT built, so never said here: delegations as an accreditation
 * group, access zones, ID or document uploads, press-card checks, wallet
 * passes, badge printing, rejection emails, deadlines or quotas.
 * `accreditation.test.tsx` fails on those words.
 *
 * Search terms (docs/website/KEYWORD_RESEARCH.md): "press accreditation",
 * "media accreditation" and "event accreditation software" go in the title
 * tag, the description and an h2. The h1 stays a plain sentence.
 */

export const META = {
  title: `Event accreditation software for press, crew and speakers · ${PRODUCT_NAME}`,
  description:
    'Press and media accreditation for trade shows: send each group its own application link, approve every person, and email QR badges your desk scans at the door. Book a demo.',
} as const

export const HERO = {
  title: 'Only approved people get a badge.',
  lead: 'Press, crew, speakers and your own team apply through a link you send them. Your staff approve each person, and approved people get a QR badge by email that your desk scans at the door.',
  secondary: 'See how it works',
  photoAlt: 'A member of staff at a trade-show registration desk hands a badge to a visitor.',
} as const

export const STEPS = {
  title: 'How accreditation works',
  steps: [
    {
      key: 'link',
      title: 'Send the link',
      line: 'Each organisation gets its own link for its press, crew or speakers. You copy it and send it yourself, so nobody applies without an invitation.',
    },
    {
      key: 'apply',
      title: 'They apply',
      line: 'Everyone gives their name, email and phone. Journalists add their outlet and the days they are coming, and crew add their employer. Each person accepts your terms and privacy notice.',
    },
    {
      key: 'approve',
      title: 'You approve',
      line: 'Every application waits as pending until someone on your team approves or rejects it. Notes you add stay internal.',
    },
    {
      key: 'badge',
      title: 'Badge and door',
      line: 'Approval sends a QR badge by email. Your desk scans it or finds the person by name, and a second scan shows they are already in.',
    },
  ],
} as const

export const GROUPS = {
  title: 'Accreditation for press, crew and speakers',
  lead: 'Each group has its own form, and each person is approved on their own.',
  groups: [
    {
      key: 'press',
      title: 'Press and media',
      line: 'The form asks for the outlet and the days attending. Your press office decides who qualifies.',
    },
    {
      key: 'crew',
      title: 'Crew',
      line: 'Booth builders, technicians and suppliers, listed under the company that sent them.',
    },
    {
      key: 'speakers',
      title: 'Speakers',
      line: 'A short form and a badge, approved the same way as everyone else.',
    },
    {
      key: 'team',
      title: 'Your own team',
      line: 'Badges for the check-in desk, the back office and build-up days, from the same list.',
    },
  ],
} as const

export const RECORD = {
  title: 'Know who let whom in',
  lead: "When a question comes up on show day, the answer is on the person's record.",
  points: [
    'Who approved or rejected each person, and when.',
    'Which link they applied through, and who sent it.',
    'Who checked them in at the door, and at what time.',
    'Revoke a badge and the next scan refuses it.',
    'Turn a link off and nobody else can apply through it.',
    'One application per person per group for each show, so duplicates do not pile up.',
  ],
  previewTitle: 'Applications',
  previewAside: 'Example Expo 2027',
  photoAlt: 'An organiser with a tablet watches a busy exhibition floor from a mezzanine.',
} as const

export const FAQ = {
  title: 'Questions organisers ask',
  items: [
    {
      question: 'Can anyone apply for accreditation?',
      answer: 'No. Every form sits behind a link you send to one organisation for one group. Turn the link off and it stops working.',
    },
    {
      question: 'Do journalists need a press card?',
      answer: 'The form does not ask for one. Your press office reads each application and approves or rejects it.',
    },
    {
      question: `Does ${PRODUCT_NAME} check ID at the door?`,
      answer: 'No. The badge email asks people to bring photo ID, and your desk staff check it when they scan the badge.',
    },
    {
      question: 'What does a rejected applicant hear?',
      answer: `Nothing automatic. ${PRODUCT_NAME} sends no rejection email, so your team can reply in its own words.`,
    },
  ],
} as const

export const CLOSING = {
  title: 'See accreditation on a demo show',
  line: 'Book a demo and we will walk through the whole path, from the link you send to the scan at the door.',
} as const

import { PRODUCT_NAME } from '@/lib/product'
import { FOUNDER } from '@/site/founder'

/**
 * The About page (/about): the story behind Evemos, who builds it and how.
 * The founder and the show he ran are named here, not on the homepage
 * (Daniel, 2026-10-20). The team section waits for names and roles from
 * Daniel (docs/website/SITE_STRUCTURE.md); no invented people or offices.
 */
export const META = {
  title: `About · ${PRODUCT_NAME}`,
  description: `${PRODUCT_NAME} was built by an organiser who ran the same trade show three years in a row. The story, and how we build it.`,
} as const

export const INTRO = {
  title: 'We ran the show first.',
  lead: `Then we built the software for it. ${PRODUCT_NAME} started on the organiser's side of the desk.`,
  /** The organiser's side of the desk: a team around a printed hall plan. Nobody in it is named. */
  photoAlt: 'Four people around a table lean over a printed hall plan, one pointing at a booth, with a laptop and coffee beside it.',
} as const

export const STORY = {
  title: 'The story',
  paragraphs: [
    `${FOUNDER.name} ran ${FOUNDER.show}, ${FOUNDER.showKind}, ${FOUNDER.years}. Every edition had the same shape: booth sales in a spreadsheet, registrations in a form builder, badges in one program, check-in in another, and hundreds of emails with exhibitors about furniture, power, graphics, hotels and build-up times.`,
    `The hard part was never the show itself. It was keeping every exhibitor, sponsor, visitor, journalist and crew member in one picture while the tools kept them apart. The same jobs come up at a 60-stand regional fair as at ${FOUNDER.show}.`,
    `${PRODUCT_NAME} is the system he wanted on each of those mornings: one list of people and companies, from the first sales call to the last badge scanned, and one place where exhibitors send everything they need.`,
  ],
  /** A hall, not a person: a face beside the founder's name would read as his photo. */
  photoAlt: 'A busy trade-show hall, with visitors talking at the stands.',
} as const

export const PRINCIPLES = {
  title: 'How we build it',
  items: [
    { title: 'Made on the show floor', line: 'Every feature starts from a job an organiser does, in the words organisers use.' },
    { title: 'One record, everywhere', line: 'An exhibitor exists once, from the first call to the badge scan, so nobody types the same company twice.' },
    { title: 'A calm show day', line: 'The morning the doors open is the test for everything we build.' },
  ],
} as const

export const COMPANY = {
  title: `Who builds ${PRODUCT_NAME}`,
  line: `${PRODUCT_NAME} is built and run by Kyuro, headquartered in Zagreb, with teams in Osijek, Frankfurt and Tampa. Your data stays in the EU.`,
} as const

export const CLOSING = {
  title: 'Tell us about your show',
  line: "Send us your hall plan and exhibitor list, and we'll show your next edition in a demo.",
} as const

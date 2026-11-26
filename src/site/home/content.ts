import type { StandType } from '@/lib/floorplan/v4/types'
import { PRODUCT_NAME } from '@/lib/product'
import { OPENS_TO_ORGANISERS, STARTING_PRICE, startingPriceLine } from '@/site/offer'
import { HEADLINE, ONE_LINER } from '@/site/positioning'

/**
 * Every line of copy on Evemos's homepage (homepage v2, 2026-10-20), in one
 * place, so the copy can be read, reviewed and run through `copycheck`
 * without the markup around it. Approved draft: `docs/website/HOME_COPY_V2.md`;
 * this file is the live copy since F-069b reworded it after the small-fair
 * persona test (`docs/ux-tests/2026-10-22-marina-varazdin-fair.md`): plain
 * words, small fairs first, and the answers she was missing.
 *
 * ★ THE WHOLE PRODUCT, BUILT AND PLANNED (E-39, Daniel): the page follows an
 * organiser's year, from selling the floor to rebooking for the next edition,
 * and names the modules still being built (exhibitor portal, invoicing, email
 * marketing, badge printing, on-site hardware, lead scanning). Still never on
 * this page: a named competitor (E-28), a customer's name or numbers without
 * permission, a certification we don't hold, a price other than the starting
 * price in `src/site/offer.ts` (a placeholder until #241, E-14), or the
 * literal phrase "all-in-one platform" (brand book). `home.test.tsx` checks
 * those.
 *
 * The product name always comes from `PRODUCT_NAME`; `home.test.tsx` renders
 * the page with it swapped out and fails on a typed-in name. Demo data (names,
 * booth codes, counts) sits with the preview that draws it, but for the hall's:
 * its booths and their card rows are copy as much as data, so they sit here.
 */

/** The page's one primary action (E-13): header, hero and closing panel all say it. */
export const PRIMARY_ACTION = 'Book a demo'

export const META = {
  title: `${PRODUCT_NAME} · Trade show and exhibition management software`,
  description:
    'Booth sales, registration, exhibitor requests, badges and the check-in desk for trade show and exhibition organisers, in one system. Book a demo.',
} as const

export const HERO = {
  title: HEADLINE,
  /** Right under the title, at the second size (E-94). */
  oneLiner: ONE_LINER,
  /** No stand counts (E-87): Evemos is for small local fairs and for big shows. */
  lead: 'Booth sales, exhibitors, registration, badges and the doors on show day, in one system built by an organiser.',
  /** The first thing the small-fair test asked (#216), next to the button instead of only in the questions. */
  price: startingPriceLine(STARTING_PRICE),
  secondary: 'See how it works',
  /** What a screen reader hears instead of the looping video. */
  videoDescription:
    'A 28-second film: a hall plan fills with booths, a stand team registers on a phone, a journalist is approved, and a QR badge is scanned at the door.',
} as const

export const AUDIENCE = {
  title: 'Everyone at your show, in one list',
  groups: [
    { key: 'exhibitors', title: 'Exhibitors', line: 'Booths, stand teams, orders and every request they send you.' },
    { key: 'sponsors', title: 'Sponsors', line: 'Packages, logos, deadlines and what they paid for.' },
    { key: 'visitors', title: 'Visitors', line: 'Registration, a QR badge by email and a fast way through the door.' },
    { key: 'press', title: 'Press', line: 'Press passes through their own link, approved by your team.' },
    { key: 'crew', title: 'Crew', line: 'Stand builders and suppliers, with badges for build-up days.' },
    { key: 'team', title: 'Your team', line: 'One dashboard for sales, exhibitor requests and the doors.' },
  ],
} as const

/** The five stages of an organiser's year, in page order. `id` is each section's anchor. */
export const JOURNEY = {
  before: {
    id: 'before',
    title: 'Sell the floor and fill the hall',
    lead: `Every edition starts with sales and sign-ups. ${PRODUCT_NAME} keeps them in one list, so the exhibitor you signed in March is the same record that gets a badge in October.`,
    items: [
      { title: 'Exhibitor and sponsor sales', line: 'Every exhibitor and sponsor from first call to signed booking, with the history of past editions.' },
      { title: 'Email marketing', line: 'Campaigns to prospects, exhibitors and visitors from the same list, with opt-outs that stay opted out.' },
      { title: 'Registration forms', line: 'A form for each group, with your own questions, opened and closed with one switch.' },
      { title: 'Landing pages', line: 'A page for each event and each group, in your brand.' },
      { title: 'Prices, packages and invoices', line: 'Booths, add-ons and sponsorships on one price list. Invoices go out with the booth on them.' },
    ],
  },
  exhibitors: {
    id: 'exhibitors',
    title: 'One place for everything they ask you for',
    lead: "This is the biggest job in running an expo, and most of it happens in email. Exhibitors need to order furniture and power, book AV, get their stand design approved, send graphics to print, send in talk details, find a hotel and get to the venue. Each of those is a thread in someone's inbox.",
    items: [
      { title: 'Orders', line: 'Furniture, power, internet, AV and extra badges, ordered and paid in one place.' },
      { title: 'Stand designs', line: 'Stand plans uploaded, checked and approved before build-up.' },
      { title: 'Graphics and print', line: 'Files uploaded once, checked, and sent to print.' },
      { title: 'Talks and speakers', line: 'Talk details and speaker materials collected by the deadline.' },
      { title: 'Travel and accommodation', line: 'Hotel blocks, venue directions and arrival details.' },
      { title: 'Help', line: 'Questions reach your team as requests with an owner and a status, not as emails.' },
    ],
    note: 'Every request has a deadline and a status, so you can see who is late without asking.',
  },
  floorPlan: {
    id: 'plan',
    title: 'Allocate every booth on the plan',
    lead: 'Draw the hall, give every booth a code and assign it to an exhibitor. Reserved and sold booths show on the plan, and visitors get a public map with the exhibitor list.',
    items: [],
  },
  showDay: {
    id: 'show-day',
    title: 'A calm morning at the doors',
    lead: 'The doors open at nine. By then every badge is out, the scanners are charged and your desk knows who is coming.',
    items: [
      { title: 'Badges for everyone', line: 'Exhibitors, visitors, press, crew and your own staff get a QR badge by email, printed at the desk or kept on the phone.' },
      { title: 'Hardware at the venue', line: 'We bring the scanners and badge printers, set them up and stay for the doors.' },
      { title: 'Check-in desk', line: 'Scan a badge or find someone by name. People already inside are flagged, and two desks never count the same person twice.' },
      { title: 'Press and crew passes', line: 'Journalists and crew apply through their own link, and only people your team approves get a badge.' },
      { title: 'Live arrivals', line: 'Who is in the hall, by group, as it happens.' },
    ],
  },
  after: {
    id: 'after',
    title: "Start next year's sales",
    lead: 'The show ends on Friday. The next edition starts on Monday, with everything you learned still in one place.',
    items: [
      { title: 'Visitor contacts for exhibitors', line: "Exhibitors scan visitors' badges and leave with a list of the people they met." },
      { title: 'Show report', line: 'Registrations, arrivals and sales for the edition, ready for your sponsors.' },
      { title: 'Rebooking', line: "This year's exhibitors move into next year's pipeline with their history." },
    ],
  },
} as const

export type JourneyKey = keyof typeof JOURNEY

/** A booth of the homepage's demo hall (FloorPlanPreview): where it stands, and what its card says. */
export interface DemoBooth {
  code: string
  state: 'sold' | 'reserved' | 'free'
  /** Its place and size on the hall in metres, as the app's plan keeps a stand (the approved demo's). */
  x: number
  y: number
  w: number
  h: number
  standType: StandType
  size: string
  price: string
  exhibitor?: string
  badges?: number
  contact?: string
  /** A reserved booth is held for its exhibitor until this date. */
  heldUntil?: string
}

/**
 * The ten booths of Hall 7: invented exhibitors and people only, no organiser's
 * real data. The prices are the demo show's booth prices, not Evemos's. The
 * islands are open on all four sides; every other booth backs onto its row.
 */
export const DEMO_BOOTHS: readonly DemoBooth[] = [
  { code: 'H7-A01', state: 'sold', x: 2, y: 2, w: 9, h: 8, standType: 'island', size: '72 m² island', price: '€14,400', exhibitor: 'Northwind Tools', badges: 8, contact: 'Peter Hall' },
  { code: 'H7-A02', state: 'sold', x: 13, y: 2, w: 9, h: 8, standType: 'island', size: '72 m² island', price: '€14,400', exhibitor: 'Kestrel Robotics', badges: 6, contact: 'Sarah Lane' },
  { code: 'H7-A03', state: 'reserved', x: 24, y: 2, w: 10, h: 9, standType: 'row', size: '90 m² double', price: '€17,100', exhibitor: 'Bluefield Foods', heldUntil: '14 November' },
  { code: 'H7-A04', state: 'reserved', x: 36, y: 2, w: 9, h: 6, standType: 'row', size: '54 m² standard', price: '€9,700', exhibitor: 'Harbour Print', heldUntil: '21 November' },
  { code: 'H7-B01', state: 'sold', x: 2, y: 15, w: 6, h: 4, standType: 'row', size: '24 m²', price: '€4,200', exhibitor: 'Orbit Labs', badges: 3, contact: 'Mark Owens' },
  { code: 'H7-B02', state: 'sold', x: 8, y: 15, w: 6, h: 4, standType: 'row', size: '24 m²', price: '€4,200', exhibitor: 'Lumen Coffee', badges: 2, contact: 'Anna Reid' },
  { code: 'H7-B03', state: 'free', x: 14, y: 15, w: 6, h: 4, standType: 'row', size: '24 m² corner', price: '€4,600' },
  { code: 'H7-B04', state: 'sold', x: 22, y: 15, w: 6, h: 6, standType: 'island', size: '36 m² island', price: '€6,300', exhibitor: 'Vela Systems', badges: 4, contact: 'Emma Clarke' },
  { code: 'H7-B05', state: 'sold', x: 30, y: 15, w: 6, h: 4, standType: 'row', size: '24 m²', price: '€4,200', exhibitor: 'Granite Build', badges: 3, contact: 'Tom Fisher' },
  { code: 'H7-B06', state: 'free', x: 36, y: 15, w: 6, h: 4, standType: 'row', size: '24 m² corner', price: '€4,600' },
]

export const FLOOR_PLAN = {
  title: 'Example Expo 2027, Hall 7',
  /** Over the hall: how the floor is selling. `{sold}` and `{total}` come from the demo booths. */
  sold: (sold: number, total: number) => `${sold} of ${total} booths sold`,
  /** Under the hall: what the visitor can do, and that the data is invented. */
  caption: 'Demo data. Tap a booth to see who has it.',
  /** The switch over the hall, the approved demo's: its name for a screen reader, and its two words. */
  views: { label: 'View of the hall', flat: '2D', angled: '3D' },
  /** Hall 7's floor in metres, as the app's plan keeps a hall. */
  hall: { width: 47, depth: 33 },
  /**
   * In front of the booths, not for sale: a plot on the plan that nobody books.
   * Its "code" leads its label on the plan ("Main stage", then "400 seats", the
   * code alone on a phone); a screen reader hears "Main stage, 400 seats, not for sale".
   */
  stage: { code: 'Main stage', name: '400 seats', x: 14, y: 25, w: 20, h: 6 },
  legend: {
    sold: 'Sold',
    reserved: 'Reserved',
    free: 'Free',
  },
  card: {
    booth: 'Booth',
    exhibitor: 'Exhibitor',
    size: 'Size',
    price: 'Price',
    badges: 'Staff badges',
    contact: 'Contact',
    heldUntil: 'Held until',
    noExhibitor: 'Nobody yet',
  },
} as const

/** On every homepage picture of the app: its show, companies, people and figures are invented. */
export const DEMO_DATA = 'Demo data'

/** "Sell the floor"'s app window: its two screens, by the app's names for them (AppWindow.tsx). */
export const APP_WINDOW = { overview: 'Overview', sales: 'Sales' } as const

export const WHY = {
  title: 'Built by an expo organiser',
  /** No name and no show here (Daniel, 2026-10-20): the story lives on /about. */
  quote: `${PRODUCT_NAME} was built by an organiser who ran the same trade show three years in a row, on spreadsheets, a form builder, badge software, a separate check-in app and hundreds of emails with exhibitors.`,
  more: 'Read the story',
  photoAlt: 'An organiser with a tablet stands at a balcony rail and looks down over a busy exhibition hall.',
} as const

export const FAQ = {
  title: 'Questions organisers ask',
  /** Seven at most (F-069b). The hardware answer went: the show-day stage already says it. */
  items: [
    {
      question: 'What does it cost?',
      answer: `One yearly price based on the size of your show, with no fee per ticket. ${startingPriceLine(STARTING_PRICE) ?? "Book a demo and we'll send you a price for your show."}`,
    },
    {
      question: 'Can I sign up and try it now?',
      answer: `Not yet. Sign-up opens in ${OPENS_TO_ORGANISERS}. Until then, book a demo and send us your hall plan and exhibitor list. We'll show you your own show in ${PRODUCT_NAME} and give you a price for it. If you go ahead, we set up your account before your next edition.`,
    },
    /** True of the organiser app: `src/lib/floorplan/v4/assign.ts` refuses a stand that is not free. */
    { question: 'Can a booth be sold twice?', answer: "No. Once a booth is reserved or sold, it can't go to another company until you free it." },
    /** Daniel, 2026-10-22 (F-069 Question 2, A): exactly what is true today, no translation promised. */
    {
      question: 'Is it in Croatian?',
      answer: "Partly. The screens and the system's emails are in English. You can write your form questions and event pages in Croatian, and invoices will follow Croatian rules (eRačun).",
    },
    { question: 'We run on spreadsheets today. Can we move?', answer: 'Yes. We import your exhibitors and contacts.' },
    { question: 'Where is our data?', answer: 'In the EU.' },
    /** From the terms ("Term and ending", "Your data when the subscription ends"). Not "cancel any time": the terms don't offer it. */
    {
      question: 'Can we leave and take our data with us?',
      answer: 'Yes. Your plan runs for the period you buy and renews only if we both agree. For 30 days after it ends, you can ask us for a copy of your data as a spreadsheet file (CSV).',
    },
  ],
} as const

export const DEMO = {
  title: 'Run the whole show from one place.',
  line: `Send us your hall plan and exhibitor list, and we'll show your next edition in a demo and give you a price for it. Sign-up opens in ${OPENS_TO_ORGANISERS}.`,
  point: 'Your floor plan, set up for the call',
  /** Under the copy, beside the form (F-021c2): the address, for anyone who would rather write. */
  emailNote: 'Or email us at',
} as const

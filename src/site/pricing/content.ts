import { PRODUCT_NAME as P } from '@/lib/product'
import { OPENS_TO_ORGANISERS, STARTING_PRICE, startingPriceLine } from '@/site/offer'

/**
 * /pricing: the plan ladder from docs/WEBSITE_PLAN.md §7, each plan including
 * everything in the one before it. The prices are placeholders kept in
 * `src/site/offer.ts` (E-14 is still open, #241); nothing here types a figure.
 * The Secure plan is described by what it does, with no market named (#221).
 */
export const META = {
  title: `Pricing and plans · ${P}`,
  description: `${P} plans for trade show and exhibition organisers: priced by the size of your show, with no fee per ticket. Book a demo for a quote.`,
} as const

export const INTRO = {
  /** The page's name in the breadcrumb (structured data); not shown over the title. */
  name: 'Pricing',
  title: 'Priced by the size of your show.',
  lead: [
    'One yearly price based on how many exhibitors you host. No fee per ticket, and every plan includes the plan before it.',
    startingPriceLine(STARTING_PRICE) ?? `Until sign-up opens in ${OPENS_TO_ORGANISERS}, we price each show on its own.`,
    'Book a demo and we will send you a quote for your show.',
  ].join(' '),
} as const

export const PLANS = [
  {
    key: 'start',
    name: 'Start',
    for: 'Shows that need registration and exhibitors in one place.',
    includes: ['Registration and ticketing', 'Event websites', 'Exhibitor portal', 'Invoicing and payments', 'QR badges by email'],
  },
  {
    key: 'expo',
    name: 'Expo',
    for: 'Trade fairs that sell a floor and run the doors.',
    includes: ['Everything in Start', 'Floor plan and booths', 'Service orders', 'Badges and check-in', 'Badge scanning for exhibitors'],
    recommended: true,
  },
  {
    key: 'pro',
    name: 'Expo Pro',
    for: 'Organisers who sell the next edition all year.',
    includes: ['Everything in Expo', 'Exhibitor and sponsor sales', 'Email marketing', 'Reports for sponsors', 'Your own web address'],
  },
  {
    key: 'secure',
    name: 'Secure',
    for: 'Shows that check every person before they get a badge.',
    includes: ['Everything in Expo Pro', 'Every person approved by your team', 'A record of who approved whom', 'Show-week support included'],
  },
] as const

export const ADD_ONS = {
  title: 'Around every plan',
  items: [
    { title: 'Onboarding', line: 'We set up your first edition with you.' },
    { title: 'Moving from spreadsheets', line: 'We import your exhibitors, contacts and history.' },
    { title: 'On-site check-in', line: 'Scanners, badge printers and crew for your doors.' },
    { title: 'Show-week support', line: 'Evenings and weekend included.' },
  ],
} as const

export const FAQ = [
  { question: 'How is the price set?', answer: 'By the number of exhibitors at your show each year. Visitors and tickets don\'t change it.' },
  { question: 'Is there a fee per ticket?', answer: 'No. Ticket money goes to you.' },
  { question: 'We run one show a year. Is there a plan for that?', answer: 'Yes. Ask for a single-edition licence when you book a demo.' },
  {
    question: 'When can we start?',
    answer: `Sign-up opens in ${OPENS_TO_ORGANISERS}. Today you can book a demo, send us your hall plan and exhibitor list, see your own show in ${P} and get a price for it. If you go ahead, we set up your account before your next edition.`,
  },
] as const

/** The tag on the Expo plan. Not "most popular": there are no customers to count yet. */
export const RECOMMENDED = 'Made for trade fairs'

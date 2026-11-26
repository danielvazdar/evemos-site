import { PRODUCT_NAME as P } from '@/lib/product'
import { formatLegalDate, type LegalBlock, type LegalLink } from '@/site/legal/LegalDocument'
import { links } from '@/site/links'
import { STARTING_PRICE, startingPriceLine } from '@/site/offer'

import type { GuideContent, GuideQuestion, GuideSection, GuideSource } from '../GuideArticle'

/**
 * ★ THE COMPARISON PAGES' SHARED PARTS (/compare/<tool>, E-61): one feature
 * table with the same rows on every page, Evemos's column written once, and
 * the sections every comparison has. Each tool's file gives only its own
 * cells, words and sources.
 *
 * ★ EVEMOS'S COLUMN SAYS "YES" FOR EVERY MODULE EVEMOS MARKETS, BUILT OR NOT
 * (E-88, replacing E-61 rule 4; same scope as the product pages, E-39). Nothing
 * in it says "Planned". The list behind it is `docs/website/COMPETITOR_FACTS.md`
 * ("What Evemos may claim"); change the two together. Accreditation is the
 * badge everyone wears, so it lives in the badges row, never as a row or a
 * selling point of its own. The Evemos-strength rows come first. The other
 * tool's cells come from its own site only, and "Not listed on its site" is
 * used when we did not find a feature, never "No": not finding it is not
 * proof it is absent.
 *
 * Our price is never typed here: it is `startingPriceLine` from `offer.ts`, so
 * the comparisons can't drift from /pricing.
 */

export const CHECKED_ON = '2026-10-26'

export const FEATURES = [
  'One system for the whole show',
  'How the price is set',
  'Exhibitors book and pay for a booth online',
  'Floor plan and booth allocation',
  'Exhibitor portal',
  'Sales pipeline for exhibitors and sponsors',
  'Registration forms with approval',
  'QR badges and check-in',
  'Exhibitor service orders',
  'Invoices and e-invoicing',
  'Lead scanning for exhibitors',
  'Attendee app and matchmaking',
] as const

export type Feature = (typeof FEATURES)[number]

export const NOT_LISTED = 'Not listed on its site'

export const EVEMOS_COLUMN: Readonly<Record<Feature, string>> = {
  'One system for the whole show':
    'Yes: sales, exhibitors, floor plan, registration, badges, check-in, email campaigns and invoicing share one list of companies and people',
  'How the price is set': 'Published yearly plans, no fee per ticket, no commission',
  'Exhibitors book and pay for a booth online': 'Yes, they pick a free booth on the floor plan, apply and pay by card, with a VAT number check',
  'Floor plan and booth allocation': 'Yes, with free, reserved, sold and blocked booths and a public hall map',
  'Exhibitor portal': 'Yes: sign-in by email link, booth, orders, deadlines and the exhibitor manual',
  'Sales pipeline for exhibitors and sponsors': 'Yes, a pipeline board from first contact to a signed booth',
  'Registration forms with approval': 'Yes, a form per group with your own questions',
  'QR badges and check-in': 'Yes, a QR badge for everyone at the show; scan or search by name, repeat scans flagged',
  'Exhibitor service orders': 'Yes, ordered in the exhibitor portal',
  'Invoices and e-invoicing': 'Yes, invoices and EU e-invoices from the same system',
  'Lead scanning for exhibitors': 'Yes, exhibitors scan visitor badges at their booth',
  'Attendee app and matchmaking': 'Yes, an attendee app with meetings between visitors and exhibitors',
}

export interface ToolFacts {
  /** The tool's name as it writes it. */
  name: string
  /** /compare/<slug>. */
  slug: string
  /** One sentence: what it is, in our words, from its own site. */
  whatItIs: string
  /** The answer first: which to pick when. Becomes the intro. */
  shortAnswer: string
  /** Its cell for each row, from its own site. */
  cells: Readonly<Record<Feature, string>>
  /** What it does well, fairly: at most two items, so the page argues for Evemos (E-88). */
  strengths: readonly string[]
  /**
   * Why Evemos, set against this tool: the whole show in one system first,
   * then the price. The booth booking and organiser lines every page shares
   * follow them.
   */
  differences: readonly string[]
  /** What it publishes about price, with figures exactly as its pricing page gives them. */
  price: readonly LegalBlock[]
  /** Questions with one-paragraph answers. The shared "move from" question is added after them. */
  faq: readonly GuideQuestion[]
  sources: readonly GuideSource[]
  metaDescription: string
}

const ourPrice = (): string =>
  startingPriceLine(STARTING_PRICE) ?? `${P} is priced by the number of exhibitors per year; ask us for a quote.`

const table = (tool: ToolFacts): LegalBlock => ({
  kind: 'table',
  caption: `${P} and ${tool.name}, feature by feature (checked ${formatLegalDate(CHECKED_ON)})`,
  head: ['', P, tool.name],
  rows: FEATURES.map((feature) => [feature, EVEMOS_COLUMN[feature], tool.cells[feature]]),
})

/** "Other alternatives": links to every other comparison, for the "alternatives to X" question. */
const alternatives = (tool: ToolFacts, all: readonly Pick<ToolFacts, 'name' | 'slug'>[]): GuideSection => {
  const others: LegalLink[] = all
    .filter((other) => other.slug !== tool.slug)
    .map((other) => ({ href: `${links.compare}/${other.slug}`, label: `${P} vs ${other.name}` }))
  return {
    id: 'alternatives',
    title: `Other ${tool.name} alternatives`,
    blocks: [
      {
        kind: 'p',
        text: `If you are looking at alternatives to ${tool.name}, these are the other tools organisers compare, each set beside ${P} the same way:`,
      },
      { kind: 'p', parts: others.flatMap((link, index) => (index === 0 ? [link] : [' · ', link])) },
    ],
  }
}

const MOVE_QUESTION = (tool: ToolFacts): GuideQuestion => ({
  question: `Can I move from ${tool.name} to ${P}?`,
  answer: `Yes. Send us your exhibitor, contact and booth lists as spreadsheets and we import them during onboarding. If you have a drawing of your hall, as a PDF or CAD file, we draw your ${P} floor plan from it.`,
})

/** The differences every page ends with, after the tool's own (E-88 decision 3). */
const SHARED_DIFFERENCES: readonly string[] = [
  'Exhibitors pick a free booth on the floor plan and apply online, and their VAT number is checked as they apply.',
  `${P} was built by an event organiser, and it fits any kind of event, from a small local one to a large international show.`,
]

const PRODUCT_SECTION: GuideSection = {
  id: 'what-it-does',
  title: `What ${P} does`,
  blocks: [
    {
      kind: 'p',
      text: `${P} is an operating system for every kind of event: trade fairs, conferences, congresses, festivals, corporate and public events. It runs the sales pipeline, the floor plan with online booth booking, the exhibitor portal with service orders, registration with approval, QR badges and check-in, email campaigns, invoices and e-invoicing, lead scanning for exhibitors and an attendee app with matchmaking.`,
    },
    {
      kind: 'p',
      parts: [
        'Its yearly plans and prices are published, with no fee per ticket and no commission. The ',
        { href: links.productOverview, label: 'product overview' },
        ' shows how each part connects. Book a demo and we will walk through your own show.',
      ],
    },
  ],
}

/** One comparison page from one tool's facts. `all` is every compared tool, for the alternatives links. */
export function comparison(tool: ToolFacts, all: readonly Pick<ToolFacts, 'name' | 'slug'>[]): GuideContent {
  const title = `${P} vs ${tool.name}`
  return {
    kind: 'comparison',
    path: `${links.compare}/${tool.slug}`,
    menuLabel: title,
    summary: tool.whatItIs,
    title: `${title}: features, price and who each one suits`,
    metaTitle: `${title} (${CHECKED_ON.slice(0, 4)}): features, pricing and ${tool.name} alternatives`,
    metaDescription: tool.metaDescription,
    intro: tool.shortAnswer,
    published: CHECKED_ON,
    updated: CHECKED_ON,
    sections: [
      { id: 'at-a-glance', title: 'At a glance', blocks: [{ kind: 'p', text: tool.whatItIs }, table(tool)] },
      { id: 'differences', title: `Why choose ${P} over ${tool.name}`, blocks: [{ kind: 'list', items: [...tool.differences, ...SHARED_DIFFERENCES] }] },
      { id: 'strengths', title: `What ${tool.name} does well`, blocks: [{ kind: 'list', items: tool.strengths }] },
      { id: 'price', title: 'Price', blocks: [...tool.price, { kind: 'p', text: `${P}: ${ourPrice()} Prices exclude VAT.` }] },
      alternatives(tool, all),
    ],
    faq: [...tool.faq, MOVE_QUESTION(tool)],
    product: PRODUCT_SECTION,
    sources: {
      title: 'Sources',
      intro: `Everything about ${tool.name} on this page comes from its own website, read on ${formatLegalDate(CHECKED_ON)}. Prices and features change, so check the links before you decide. If something here is out of date, tell us and we will correct it.`,
      items: tool.sources,
    },
  }
}

import { PRODUCT_NAME } from '@/lib/product'
import { FOUNDER } from '@/site/founder'

/**
 * The site's fixed hrefs (the homepage, the hand-built pages, the demo form,
 * sign-in, legal), in one frozen object. The templated product, solution and
 * service pages get theirs from their registries via `src/site/sitemap.ts`;
 * `chrome.test.tsx` checks every header and footer link is one or the other.
 * No `href="#"` anywhere: a link that goes nowhere is a broken link.
 *
 * Anchors are absolute to `/` (`/#demo`, not `#demo`), so they work from every page.
 *
 * ★ `demo` is the homepage's "Book a demo" section. Daniel chose a form on the
 * page (F-021 Question 1, option B, 2026-10-19); the form is F-021c. Until then
 * the section offers `demoEmail`. Change this one line, not the buttons, if
 * the target moves.
 *
 * `login` is Payload's sign-in until tenancy brings organiser sign-in (P3).
 *
 * `accreditationPage` is hand-built (/product/accreditation); the other product
 * pages are templated. `productOverview` is /product, every module by stage.
 *
 * `privacy` and `terms` are Evemos's own legal pages (F-022). The demo form
 * links `privacy` too, and `chrome.test.tsx` checks both route files exist.
 */

/**
 * ⚠️ Placeholder address until the F-021c form replaces it: the mailbox must
 * exist and reach Daniel before the site goes public.
 */
export const DEMO_EMAIL = 'demo@evemos.events'

/**
 * Where security reports go: `/.well-known/security.txt` and the Security
 * page's report section print it (F-143b, L-08). A Cloudflare Email Routing
 * forward to Daniel, like demo@; it must deliver before a deploy that shows it.
 */
export const SECURITY_EMAIL = 'security@evemos.events'

/** The subject the visitor's mail app opens with, so a demo request is recognisable in the inbox. */
const DEMO_SUBJECT = encodeURIComponent(`${PRODUCT_NAME} demo`)

/**
 * A mailto for one demo inbox, with the subject above. The homepage's demo
 * panel builds its links with this from the server's `DEMO_REQUEST_EMAIL`
 * (defaulting to `DEMO_EMAIL`), so the panel and the form never show two
 * different inboxes.
 */
export const demoMailto = (address: string): string => `mailto:${address}?subject=${DEMO_SUBJECT}`

export const links = Object.freeze({
  home: '/',
  login: '/login',
  demo: '/#demo',
  demoEmail: demoMailto(DEMO_EMAIL),
  /** The hero's "See how it works": the first stage of the homepage's organiser's year. */
  howItWorks: '/#plan',
  accreditationPage: '/product/accreditation',
  about: '/about',
  productOverview: '/product',
  pricing: '/pricing',
  security: '/security',
  contact: '/contact',
  careers: '/careers',
  team: '/team',
  /** The first customer story, at the show's name in lowercase (spelled only in `founder.ts`). */
  customerStory: `/customers/${FOUNDER.show.toLowerCase()}`,
  guidePressAccreditation: '/guides/press-accreditation',
  /** The hubs of the articles (`src/site/guides/articles.ts`). The articles themselves reach the sitemap from there. */
  guides: '/guides',
  compare: '/compare',
  privacy: '/privacy',
  terms: '/terms',
} as const)

export type SiteLinks = typeof links

/**
 * Every page of Evemos's own site besides the homepage, for the sitemap.
 * `chrome.test.tsx` checks each one has a route file, so a page added here
 * without its route (or removed without this list) fails.
 */
export const SITE_PAGES: readonly string[] = [
  links.accreditationPage,
  links.guides,
  links.compare,
  links.about,
  links.productOverview,
  links.pricing,
  links.security,
  links.contact,
  links.careers,
  links.team,
  links.customerStory,
  links.privacy,
  links.terms,
]

/** The set of every href above, for tests that check a rendered page links nowhere else. */
export const SITE_HREFS: ReadonlySet<string> = new Set(Object.values(links))

/**
 * The ids of the homepage's sections. `src/app/(site)/page.test.tsx` fails if an
 * id listed here is missing from the page, or a section id is missing here, so
 * an anchor link (`/#…`) to the homepage always lands.
 */
export const HOME_SECTION_IDS: ReadonlySet<string> = new Set([
  'floor-plan',
  'who',
  'before',
  'exhibitors',
  'plan',
  'show-day',
  'after',
  'why',
  'faq',
  'demo',
])

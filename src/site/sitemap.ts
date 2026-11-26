import { ARTICLE_PATHS, articlesOf } from '@/site/guides/articles'
import { links } from '@/site/links'
import { PRODUCT_PAGES } from '@/site/pages/product'
import { SERVICE_PAGES } from '@/site/pages/services'
import { SOLUTION_PAGES } from '@/site/pages/solutions'
import { CUSTOMER_STORY, SECURITY_PAGE } from '@/site/pages/company'
import type { MarketingPageContent } from '@/site/pages/types'

/**
 * ★ THE SITE MAP: the one place that says which page sits in which menu.
 * The header's dropdowns, the phone menu, the footer and the product overview
 * all read it, so a page added here shows up everywhere at once, and a link
 * can only point at a page that exists (the menu entries are built from the
 * page registries in `src/site/pages`). Structure agreed with Daniel on
 * 2026-10-20 (`docs/website/SITE_STRUCTURE.md`), modelled on run.events.
 */

export interface MenuItem {
  label: string
  href: string
  /** One line under the label in a dropdown. */
  line: string
}

export interface MenuGroup {
  title: string
  items: readonly MenuItem[]
}

export interface Menu {
  label: string
  groups: readonly MenuGroup[]
  /** A link under the groups, to the page that explains the whole menu. */
  overview?: { label: string; href: string }
}

const fromPages = (pages: readonly MarketingPageContent[], base: string, slugs: readonly string[]): MenuItem[] =>
  slugs.map((slug) => {
    const page = pages.find((candidate) => candidate.slug === slug)
    if (!page) throw new Error(`sitemap: no ${base} page "${slug}"`)
    return { label: page.menuLabel, href: `${base}/${slug}`, line: page.menuLine }
  })

/** How many guides the Resources menu lists by name; "All guides" links the rest. */
const MENU_GUIDES = 3

const ACCREDITATION: MenuItem = {
  label: 'Accreditation',
  href: links.accreditationPage,
  line: 'Press, crew and speakers, approved before the badge.',
}

const product = (slugs: readonly string[]) => fromPages(PRODUCT_PAGES, '/product', slugs)

export const PRODUCT_MENU: Menu = {
  label: 'Product',
  groups: [
    { title: 'Before the show', items: product(['crm', 'email-marketing', 'registration', 'event-websites', 'invoicing']) },
    { title: 'Your exhibitors', items: product(['exhibitor-portal', 'service-orders', 'floor-plan']) },
    { title: 'Show day', items: [...product(['badges-check-in']), ACCREDITATION, ...product(['on-site-hardware'])] },
    { title: 'After the show', items: product(['lead-capture', 'reports']) },
  ],
  overview: { label: 'See how it all connects', href: links.productOverview },
}

export const SOLUTIONS_MENU: Menu = {
  label: 'Solutions',
  groups: [
    // Defence goes last, so a small regional or consumer fair sees its own kind of show first (#221, Daniel 2026-10-22).
    { title: 'By event type', items: fromPages(SOLUTION_PAGES, '/solutions', ['trade-fairs', 'conferences', 'associations', 'defence-security']) },
    { title: 'Partners', items: fromPages(SOLUTION_PAGES, '/solutions', ['agencies', 'venues']) },
  ],
}

export const SERVICES_MENU: Menu = {
  label: 'Services',
  groups: [
    { title: 'Before the show', items: fromPages(SERVICE_PAGES, '/services', ['onboarding', 'migration']) },
    { title: 'At the show', items: fromPages(SERVICE_PAGES, '/services', ['on-site', 'show-week-support']) },
  ],
}

export const RESOURCES_MENU: Menu = {
  label: 'Resources',
  groups: [
    {
      title: 'Guides',
      items: [
        ...articlesOf('guide').slice(0, MENU_GUIDES).map((article) => ({ label: article.menuLabel, href: article.path, line: article.summary })),
        { label: 'All guides', href: links.guides, line: 'Every guide for organisers.' },
      ],
    },
    {
      title: 'Compare',
      items: [{ label: 'How it compares', href: links.compare, line: 'Next to the tools organisers look at, sourced.' }],
    },
    {
      title: 'Customer stories',
      items: [{ label: CUSTOMER_STORY.menuLabel, href: links.customerStory, line: CUSTOMER_STORY.menuLine }],
    },
    {
      title: 'Trust',
      items: [
        { label: SECURITY_PAGE.menuLabel, href: links.security, line: SECURITY_PAGE.menuLine },
        { label: 'About', href: links.about, line: 'Built by an expo organiser.' },
        { label: 'Team', href: links.team, line: 'Who builds it, and where.' },
      ],
    },
  ],
}

/** The header's dropdowns, in order. Pricing sits after them as a plain link (`TOP_LINKS`). */
export const MENUS: readonly Menu[] = [PRODUCT_MENU, SOLUTIONS_MENU, SERVICES_MENU, RESOURCES_MENU]

/** Each menu entry's label by its href: "How it connects" links read it, so a link and its menu entry never disagree. */
export const MENU_LABELS: ReadonlyMap<string, string> = new Map(
  MENUS.flatMap((menu) => menu.groups.flatMap((group) => group.items.map((item) => [item.href, item.label] as const))),
)

/** Every templated page's path (the `[slug]` routes), for the sitemap and the "every link lands" tests. */
export const TEMPLATED_PATHS: readonly string[] = [
  ...ARTICLE_PATHS,
  ...PRODUCT_PAGES.map((page) => `/product/${page.slug}`),
  ...SOLUTION_PAGES.map((page) => `/solutions/${page.slug}`),
  ...SERVICE_PAGES.map((page) => `/services/${page.slug}`),
]

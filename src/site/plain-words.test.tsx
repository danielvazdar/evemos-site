/**
 * The words a small-fair organiser didn't understand (#220) stay off the pages
 * she reads first, and the site talks to fairs like hers before defence shows
 * (#221). From the persona test in
 * `docs/ux-tests/2026-10-22-marina-varazdin-fair.md`.
 *
 * Specialist pages keep their audience's words (/product/accreditation, the
 * press-accreditation guide, the defence page), and slugs and meta keep their
 * search terms, so this checks only the visible text of the pages below.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import HomePage from '@/app/(site)/page'
import { MAX_STANDS } from '@/lib/floorplan/v4/plan'
import { SiteFooter } from '@/site/chrome/SiteFooter'
import { SiteHeader } from '@/site/chrome/SiteHeader'
import { TEAMS } from '@/site/company'
import { OPENS_TO_ORGANISERS } from '@/site/offer'
import { CONTACT_PAGE, SECURITY_PAGE } from '@/site/pages/company'
import { MarketingPage } from '@/site/pages/MarketingPage'
import { PricingPage } from '@/site/pricing/PricingPage'
import { SOLUTIONS_MENU } from '@/site/sitemap'

/** Visible text: tags and React's `<!-- -->` separators removed, entities decoded. */
const textOf = (markup: string): string =>
  markup
    .replace(/<!-- -->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()

const PAGES = {
  homepage: textOf(renderToStaticMarkup(<HomePage />)),
  pricing: textOf(renderToStaticMarkup(<PricingPage />)),
  security: textOf(renderToStaticMarkup(<MarketingPage content={SECURITY_PAGE} />)),
  contact: textOf(renderToStaticMarkup(<MarketingPage content={CONTACT_PAGE} />)),
  header: textOf(renderToStaticMarkup(<SiteHeader />)),
  footer: textOf(renderToStaticMarkup(<SiteFooter />)),
} as const

const JARGON =
  /\bCRM\b|sales pipeline|lead capture|\bleads?\b|\bPCOs?\b|Article 28|data protection officer|rate limit|trap field|booth builds?|abstracts?|your own domain/i

describe('plain words (#220)', () => {
  it.each(Object.entries(PAGES))('%s has none of the words she did not understand', (_page, text) => {
    expect(text.match(JARGON)).toBeNull()
  })

  // The header and footer keep the one "Accreditation" menu entry: it is the search term (KEYWORD_RESEARCH).
  it.each(['homepage', 'pricing'] as const)('%s says "pass", not "accreditation"', (page) => {
    expect(PAGES[page].match(/accredit/i)).toBeNull()
  })
})

describe('small fairs first (#221)', () => {
  it.each(['homepage', 'pricing'] as const)('%s names no defence, government or North America', (page) => {
    expect(PAGES[page].match(/defen[cs]e|government|North America/i)).toBeNull()
  })

  it('lists defence last among the event types', () => {
    expect(SOLUTIONS_MENU.groups[0].items.at(-1)?.href).toBe('/solutions/defence-security')
  })

  it('the team line names no North America', () => {
    expect(TEAMS.filter((team) => /North America/i.test(team.line))).toEqual([])
  })
})

const SRC = join(process.cwd(), 'src')

/** Every site source file but the tests, with its path under src. */
const siteSources = (): Array<{ path: string; source: string }> =>
  readdirSync(join(SRC, 'site'), { recursive: true, encoding: 'utf8' })
    .filter((path) => /\.tsx?$/.test(path) && !/\.test\.tsx?$/.test(path))
    .map((path) => ({ path: join('site', path), source: readFileSync(join(SRC, 'site', path), 'utf8') }))

describe('stand counts', () => {
  it('never promise more stands than one plan holds', () => {
    const counts = siteSources().flatMap(({ path, source }) =>
      [...source.matchAll(/\d[\d,]*(?=[- ]stands?\b)|(?<=\bstands? to )\d[\d,]*/gi)].map(([figure]) => ({ path, count: Number(figure.replace(/,/g, '')) })),
    )
    expect(counts.length).toBeGreaterThan(0)
    expect(counts.filter(({ count }) => count > MAX_STANDS)).toEqual([])
  })
})

describe('the launch month (#217)', () => {
  it('is typed only in src/site/offer.ts; the homepage and pricing render it from there', () => {
    const typedIn = readdirSync(SRC, { recursive: true, encoding: 'utf8' })
      .filter((path) => /\.tsx?$/.test(path))
      .filter((path) => readFileSync(join(SRC, path), 'utf8').includes(OPENS_TO_ORGANISERS))
    expect(typedIn).toEqual([join('site', 'offer.ts')])
    expect(PAGES.homepage).toContain(OPENS_TO_ORGANISERS)
    expect(PAGES.pricing).toContain(OPENS_TO_ORGANISERS)
  })
})

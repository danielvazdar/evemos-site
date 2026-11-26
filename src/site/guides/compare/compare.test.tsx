/**
 * The comparison pages (/compare/<tool>, E-61), rendered as the visitor gets
 * them, and the rules that make naming another tool safe:
 * ★ every price figure in any article is in docs/website/COMPETITOR_FACTS.md
 *   or GUIDE_FACTS.md, the sourced facts files, so no figure reaches a page without a source;
 * ★ nothing from the private Cvent order form (docs/PRICING.md §5) appears;
 * ★ Evemos's column says "Yes" for every module it markets and never "Planned" (E-88);
 * ★ accreditation is the badge everyone wears, never a row or a selling point (E-88);
 * ★ Evemos sells plans with modules per plan (E-90): no "every module" or "no add-ons" claim;
 * ★ the other tool keeps at most two strengths, and its cells say "Not listed on its site", never "No".
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { ResolvedMetadata } from 'next'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import ComparisonPage, { generateMetadata } from '@/app/(site)/compare/[slug]/page'
import CompareHubPage from '@/app/(site)/compare/page'
import { links } from '@/site/links'
import { TEMPLATED_PATHS } from '@/site/sitemap'

import { ARTICLES } from '../articles'
import { articleStructuredData } from '../GuideArticle'
import { EVEMOS_COLUMN, FEATURES, NOT_LISTED } from './build'
import { COMPARISONS } from './tools'

vi.mock('@/lib/product', () => ({ PRODUCT_NAME: 'Stand-in Name' }))

const FACTS = ['COMPETITOR_FACTS.md', 'GUIDE_FACTS.md'].map((file) => readFileSync(join(process.cwd(), 'docs/website', file), 'utf8')).join('\n')

const slugOf = (path: string) => path.split('/').pop() ?? ''

/** What Next resolves from `(site)/opengraph-image.tsx`: the article's own `openGraph` must hand it back (F-115c). */
const SHARE_IMAGES = [{ url: 'https://example.test/opengraph-image' }]
const parent = Promise.resolve({ openGraph: { images: SHARE_IMAGES } } as unknown as ResolvedMetadata)

const render = async (path: string) => {
  const params = Promise.resolve({ slug: slugOf(path) })
  return { html: renderToStaticMarkup(await ComparisonPage({ params })), metadata: await generateMetadata({ params }, parent) }
}

const MODULES = FEATURES.filter((feature) => feature !== 'How the price is set')

/** The Evemos-strength rows lead the table, in this order (E-88 decision 6). */
const STRENGTH_ROWS = [
  'One system for the whole show',
  'How the price is set',
  'Exhibitors book and pay for a booth online',
  'Floor plan and booth allocation',
  'Exhibitor portal',
  'Sales pipeline for exhibitors and sponsors',
  'Registration forms with approval',
  'QR badges and check-in',
]

const listItems = (page: (typeof COMPARISONS)[number], id: string) => {
  const block = page.sections.find((section) => section.id === id)?.blocks[0]
  return block?.kind === 'list' ? block.items : []
}

describe('comparison pages', () => {
  it('there are six, each under /compare and in the sitemap', () => {
    expect(COMPARISONS).toHaveLength(6)
    for (const page of COMPARISONS) {
      expect(page.path.startsWith(`${links.compare}/`)).toBe(true)
      expect(TEMPLATED_PATHS).toContain(page.path)
    }
  })

  it.each(COMPARISONS.map((page) => [page.path, page] as const))('%s: one h1, the feature table, canonical at its path', async (path, page) => {
    const { html, metadata } = await render(path)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html.match(/<tr\b/g)).toHaveLength(FEATURES.length + 1)
    expect(metadata.alternates?.canonical).toBe(page.path)
    expect(metadata.openGraph?.images).toEqual(SHARE_IMAGES)
    expect(html).not.toMatch(/expono|evemos/i)
  })

  it.each(COMPARISONS.map((page) => [page.path] as const))('%s: links land on a page that exists', async (path) => {
    const { html } = await render(path)
    const internal = [...html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)/g)].map(([, href]) => href)
    const known = new Set([...TEMPLATED_PATHS, ...Object.values(links)])
    expect(internal.filter((href) => !known.has(href))).toEqual([])
  })

  it('every price figure in any article is in the sourced facts file', () => {
    const figures = new Set(
      ARTICLES.flatMap((page) => JSON.stringify(page).match(/[€$]\s?\d[\d,.]*/g) ?? []).map((figure) => figure.replace(/[.,]$/, '')),
    )
    // Our own figure comes from offer.ts, which /pricing tests; every other figure must be sourced.
    const sourced = [...figures].filter((figure) => !FACTS.includes(figure))
    expect(sourced.filter((figure) => !JSON.stringify(ARTICLES).includes(`From ${figure}`))).toEqual([])
  })

  it.each(['5,000', '6.00', '8.55', '17,000', '68,000', '9%'])('nothing from the private Cvent order form: "%s"', (figure) => {
    expect(JSON.stringify(ARTICLES)).not.toContain(figure)
  })

  it.each(MODULES)("our column says yes to '%s'", (feature) => {
    expect(EVEMOS_COLUMN[feature]).toMatch(/^Yes\b/)
  })

  it('our column never says planned, not offered or no', () => {
    for (const cell of Object.values(EVEMOS_COLUMN)) expect(cell).not.toMatch(/planned|not offered|^no\b/i)
  })

  it('the Evemos-strength rows come first', () => {
    expect(FEATURES.slice(0, STRENGTH_ROWS.length)).toEqual(STRENGTH_ROWS)
  })

  it.each(COMPARISONS.map((page) => [page.path, page] as const))('%s: no accreditation claim and nothing planned', (path, page) => {
    const text = JSON.stringify([page.intro, page.metaDescription, page.sections, page.faq, page.product])
    expect(text).not.toMatch(/accreditation/i)
    expect(text).not.toMatch(/planned|not yet|on the way/i)
  })

  it.each(COMPARISONS.map((page) => [page.path, page] as const))('%s: no one-package price claim (E-90)', (path, page) => {
    const ours = JSON.stringify([page.intro, page.metaDescription, listItems(page, 'differences'), page.faq, page.product, EVEMOS_COLUMN])
    expect(ours).not.toMatch(/every module|no add-ons?\b|one (published )?(yearly )?price\b|in the one/i)
  })

  // Daniel, 2026-11-07: Evemos runs any kind of event, not only trade shows or shows with exhibitors.
  it.each(COMPARISONS.map((page) => [page.path, page] as const))('%s: never narrows Evemos to one kind of event', (path, page) => {
    const ours = JSON.stringify([page.intro, page.metaDescription, listItems(page, 'differences'), page.product, EVEMOS_COLUMN])
    expect(ours).not.toMatch(/\bonly\b[^.]*\b(trade|fairs?|expos?|exhibitions?)\b|\b(trade shows?|exhibitions|expos) only\b|show with exhibitors|lives on its exhibitors|for trade fairs?\b|for trade fair organisers/i)
  })

  it.each(COMPARISONS.map((page) => [page.path, page] as const))('%s: at most two strengths for the other tool, and the answer opens with us', (path, page) => {
    expect(listItems(page, 'strengths').length).toBeGreaterThan(0)
    expect(listItems(page, 'strengths').length).toBeLessThanOrEqual(2)
    expect(page.intro).toMatch(/^Pick Stand-in Name\b/)
  })

  it("the other tool's cells never say a bare no", () => {
    const table = COMPARISONS.flatMap((page) => page.sections.flatMap((section) => section.blocks)).filter((block) => block.kind === 'table')
    expect(table).toHaveLength(COMPARISONS.length)
    for (const block of table) for (const row of block.rows) expect(row[2]).not.toMatch(/^no\b/i)
    expect(JSON.stringify(table)).toContain(NOT_LISTED)
  })

  it('links every source over https', () => {
    for (const page of COMPARISONS) {
      expect(page.sources.items.length).toBeGreaterThan(0)
      for (const { link } of page.sources.items) expect(link.href).toMatch(/^https:\/\//)
    }
  })

  it('ships Article, BreadcrumbList and FAQPage structured data matching the visible questions', async () => {
    const page = COMPARISONS[0]
    const { html } = await render(page.path)
    const block = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)
    expect(block).not.toBeNull()
    const data = JSON.parse(block![1]) as { '@graph': { '@type': string; mainEntity?: { name: string }[] }[] }
    expect(data).toEqual(articleStructuredData(page))
    expect(data['@graph'].map((node) => node['@type'])).toEqual(['Article', 'BreadcrumbList', 'FAQPage'])
    expect(data['@graph'][2].mainEntity?.map((question) => question.name)).toEqual(page.faq?.map((item) => item.question))
  })

  it('the hub lists every comparison', () => {
    const html = renderToStaticMarkup(<CompareHubPage />)
    for (const page of COMPARISONS) expect(html).toContain(`href="${page.path}"`)
  })
})

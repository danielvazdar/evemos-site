/**
 * Every guide (/guides/<slug>), rendered as the visitor gets it. The press
 * accreditation guide has its own test for its product claims; this one holds
 * the rules for all of them.
 *
 * ★ THE PRODUCT SECTION CLAIMS ONLY WHAT IS BUILT. A planned feature may be
 * named only in a sentence that says it is planned (the list in
 * docs/website/COMPETITOR_FACTS.md, "What Evemos may claim").
 */
import type { ResolvedMetadata } from 'next'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import GuidePage, { generateMetadata } from '@/app/(site)/guides/[slug]/page'
import GuideHubPage from '@/app/(site)/guides/page'
import { links } from '@/site/links'
import { TEMPLATED_PATHS } from '@/site/sitemap'
import tones from '@/site/ui/primitives.module.css'

import { articlesOf } from './articles'
import { articleStructuredData, type GuideSection } from './GuideArticle'

vi.mock('@/lib/product', () => ({ PRODUCT_NAME: 'Stand-in Name' }))

const GUIDES = articlesOf('guide')

/** What Next resolves from `(site)/opengraph-image.tsx`: the article's own `openGraph` must hand it back (F-115c). */
const SHARE_IMAGES = [{ url: 'https://example.test/opengraph-image' }]
const parent = Promise.resolve({ openGraph: { images: SHARE_IMAGES } } as unknown as ResolvedMetadata)

const render = async (path: string) => {
  const params = Promise.resolve({ slug: path.split('/').pop() ?? '' })
  return { html: renderToStaticMarkup(await GuidePage({ params })), metadata: await generateMetadata({ params }, parent) }
}

const sentences = (section: GuideSection): string[] =>
  section.blocks
    .flatMap((block) =>
      'text' in block ? [block.text] : 'parts' in block ? [block.parts.map((part) => (typeof part === 'string' ? part : part.label)).join('')] : [],
    )
    .flatMap((text) => text.split(/(?<=\.)\s+/))

/** The picture each guide opens with, and the pictures inside a section, by section id (F-118). */
const PICTURES: readonly (readonly [path: string, lead: string, figures: Readonly<Record<string, readonly string[]>>])[] = [
  ['/guides/how-to-organise-a-trade-fair', 'team-planning-trade-fair-hall-plan.jpg', {}],
  ['/guides/how-to-sell-exhibition-space', 'selling-exhibition-space-floor-plan.jpg', {}],
  ['/guides/trade-show-floor-plan', 'organisers-checking-hall-floor-plan.jpg', { aisles: ['exhibition-hall-layout-model.jpg'], 'stand-types': ['shell-scheme-stand-model.jpg'] }],
  ['/guides/trade-show-software-cost', 'organiser-comparing-software-costs.jpg', {}],
  ['/guides/trade-fair-vs-trade-show-vs-exhibition', 'trade-fair-hall-from-balcony.jpg', {}],
  ['/guides/press-accreditation', 'press-accreditation-desk.jpg', {}],
]

/** How a static import shows up in an `<img>`: the vitest stub's path, URL-encoded by `next/image`. */
const marker = (file: string) => `test-images%2F${file}`

/** Where the `<img>` of a file starts (a preloaded one also has a `<link rel="preload">` earlier on). */
const imgAt = (html: string, file: string) => html.search(new RegExp(`<img\\b[^>]*${marker(file).replace('.', '\\.')}`))

/** The markup of one `<section id=…>`, up to its closing tag (guide sections do not nest). */
const sectionOf = (html: string, id: string) => {
  const start = html.indexOf(`<section id="${id}"`)
  return start < 0 ? '' : html.slice(start, html.indexOf('</section>', start))
}

const PLANNED = ['card payment', 'pay for a booth', 'online booking', 'e-invoic', 'eračun', 'service order', 'lead scan', 'pipeline', 'campaign']

describe('guides', () => {
  it.each(GUIDES.map((guide) => [guide.path, guide] as const))('%s: one h1, canonical, in the sitemap, Book a demo', async (path, guide) => {
    const { html, metadata } = await render(path)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(metadata.alternates?.canonical).toBe(guide.path)
    expect(metadata.openGraph?.images).toEqual(SHARE_IMAGES)
    expect(TEMPLATED_PATHS).toContain(guide.path)
    expect(html).toContain(`href="${links.demo}"`)
    expect(html).not.toMatch(/expono|evemos/i)
  })

  it.each(GUIDES.map((guide) => [guide.path, guide] as const))('%s: internal links land, sources are https', async (path, guide) => {
    const { html } = await render(path)
    const internal = [...html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)/g)].map(([, href]) => href)
    const known = new Set([...TEMPLATED_PATHS, ...Object.values(links)])
    expect(internal.filter((href) => !known.has(href))).toEqual([])
    for (const { link } of guide.sources.items) expect(link.href).toMatch(/^https:\/\//)
  })

  it.each(GUIDES.map((guide) => [guide.path, guide] as const))('%s: the product section names planned features only as planned', (_path, guide) => {
    const offending = sentences(guide.product).filter(
      (sentence) => PLANNED.some((word) => sentence.toLowerCase().includes(word)) && !/planned/i.test(sentence),
    )
    expect(offending).toEqual([])
  })

  it.each(PICTURES)('%s: opens with %s and shows its figures in their sections', async (path, lead, figures) => {
    const { html } = await render(path)
    const firstSection = html.indexOf('<section id=')
    const leadAt = imgAt(html, lead)
    expect(leadAt).toBeGreaterThan(html.indexOf('</h1>'))
    expect(leadAt).toBeLessThan(firstSection)
    for (const [id, files] of Object.entries(figures)) {
      for (const file of files) expect(imgAt(sectionOf(html, id), file), `${id}: ${file}`).toBeGreaterThan(-1)
    }
  })

  it.each(GUIDES.map((guide) => [guide.path] as const))('%s: every picture has a real description', async (path) => {
    const { html } = await render(path)
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) expect(tag).toMatch(/\balt="[^"]{20,}"/)
  })

  // F-192e (E-131 Q4 = B): an article is long reading, so only its title is on the washes.
  it.each(GUIDES.map((guide) => [guide.path] as const))('%s: the title on the washes, the article, named by it, on a paper band', async (path) => {
    const { html } = await render(path)
    // The lead picture's preload link comes first; the page itself starts with the title band.
    expect(html.replace(/^(<link\b[^>]*>)+/, '')).toMatch(new RegExp(`^<section aria-labelledby="guide-title" class="${tones.section} ${tones.open}">`))
    const paper = html.indexOf(`<div class="${tones.section} ${tones.paper}">`)
    expect(paper).toBeGreaterThan(html.indexOf('</h1>'))
    expect(html.indexOf('<article aria-labelledby="guide-title"')).toBeGreaterThan(paper)
    expect(html.slice(0, paper)).not.toMatch(/<img\b/)
  })

  it('every guide has its picture row', () => {
    expect(PICTURES.map(([path]) => path).sort()).toEqual(GUIDES.map((guide) => guide.path).sort())
  })

  it('the hub lists every guide', () => {
    const html = renderToStaticMarkup(<GuideHubPage />)
    for (const guide of GUIDES) expect(html).toContain(`href="${guide.path}"`)
  })

  // F-192e (E-131 Q4 = B): the hub's title on the washes, its list of articles, which is reading, on a paper band.
  it('the hub has its title on the washes and the guides on a paper band, their pictures asked for at the 1280px column', () => {
    const html = renderToStaticMarkup(<GuideHubPage />)
    expect(html.startsWith(`<section aria-labelledby="hub-title" class="${tones.section} ${tones.open}">`)).toBe(true)
    const paper = html.indexOf(`<div class="${tones.section} ${tones.paper}">`)
    expect(paper).toBeGreaterThan(html.indexOf('</h1>'))
    expect(html.indexOf('<ul')).toBeGreaterThan(paper)
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) expect(tag).toContain('sizes="(min-width: 1376px) 624px, (min-width: 768px) 50vw, 100vw"')
  })
})

describe('guide structured data', () => {
  it.each(GUIDES.map((guide) => [guide.path, guide] as const))('%s names its lead picture as the Article image', (_path, guide) => {
    const article = (articleStructuredData(guide)['@graph'] as Array<Record<string, unknown>>)[0]
    expect(article.image).toMatch(/^https?:\/\/[^/]+\/test-images\/[a-z0-9-]+\.jpg$/)
  })
})

describe('guides hub pictures', () => {
  it('gives every picture an alt of 20+ characters, for search', () => {
    const html = renderToStaticMarkup(<GuideHubPage />)
    const tags = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag)
    expect(tags.length).toBeGreaterThan(0)
    for (const tag of tags) expect(tag).toMatch(/\balt="[^"]{20,}"/)
  })
})

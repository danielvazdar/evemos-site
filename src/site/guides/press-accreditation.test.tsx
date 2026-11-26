/**
 * The press accreditation guide, rendered as the visitor gets it.
 *
 * ★ THE PRODUCT SECTION CLAIMS ONLY WHAT ACCREDITATION DOES TODAY. The guide
 * itself advises on deadlines and limits per outlet (organiser practice); the
 * product section must not suggest the product enforces them, nor any other
 * feature accreditation lacks. Same list as `accreditation.test.tsx`.
 */
import type { ResolvedMetadata } from 'next'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import GuidePage, { generateMetadata } from '@/app/(site)/guides/[slug]/page'
import { links } from '@/site/links'

import { PRESS_ACCREDITATION_GUIDE as GUIDE } from './press-accreditation'

vi.mock('@/lib/product', () => ({ PRODUCT_NAME: 'Stand-in Name' }))

const params = Promise.resolve({ slug: 'press-accreditation' })
const html = renderToStaticMarkup(await GuidePage({ params }))
const parent = Promise.resolve({ openGraph: { images: [] } } as unknown as ResolvedMetadata)
const metadata = await generateMetadata({ params }, parent)
const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(([, href]) => href)

const productText = GUIDE.product.blocks
  .map((block) => ('text' in block ? block.text : 'parts' in block ? block.parts.map((p) => (typeof p === 'string' ? p : p.label)).join('') : ''))
  .join(' ')
  .toLowerCase()

describe('press accreditation guide', () => {
  it('has one h1, the guide title, and an h2 per section plus the product and sources sections', () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html.match(/<h2\b/g)).toHaveLength(GUIDE.sections.length + 2)
  })

  it('is canonical at its own path, which links.ts and the sitemap list', () => {
    expect(GUIDE.path).toBe(links.guidePressAccreditation)
    expect(metadata.alternates?.canonical).toBe(GUIDE.path)
  })

  it('ends with Book a demo and a link to the accreditation page', () => {
    expect(hrefs).toContain(links.demo)
    expect(hrefs).toContain(links.accreditationPage)
  })

  it('links every source over https', () => {
    expect(GUIDE.sources.items.length).toBeGreaterThan(0)
    for (const { link } of GUIDE.sources.items) {
      expect(link.href).toMatch(/^https:\/\//)
      expect(hrefs).toContain(link.href.replace(/&/g, '&amp;'))
    }
  })

  it.each(['deadline', 'limit', 'quota', 'zone', 'delegation', 'upload', 'wallet', 'print', 'id check'])(
    'the product section says nothing about "%s"',
    (word) => {
      expect(productText).not.toContain(word)
    },
  )

  it('never types the product name; it comes from product.ts', () => {
    expect(html).not.toMatch(/expono|evemos/i)
  })
})

/**
 * The image sitemap's list (`PAGE_IMAGES`) against what each page really
 * shows: the hand-built pages are listed by hand, so each is rendered here and
 * the two must agree. Every picture on them also carries a real alt text.
 */
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import AboutRoute from '@/app/(site)/about/page'
import HomePage from '@/app/(site)/page'
import PricingRoute from '@/app/(site)/pricing/page'
import AccreditationRoute from '@/app/(site)/product/accreditation/page'
import ProductRoute from '@/app/(site)/product/page'
import { links } from '@/site/links'
import { TEMPLATED_PATHS } from '@/site/sitemap'

import { PAGE_IMAGES } from './page-images'

const PAGES: ReadonlyArray<readonly [path: string, page: () => ReactElement]> = [
  ['/', HomePage],
  [links.productOverview, ProductRoute],
  [links.about, AboutRoute],
  [links.pricing, PricingRoute],
  [links.accreditationPage, AccreditationRoute],
]

/** The file names of the pictures in the markup (`next/image` URLs carry the encoded `src`). */
const shownImages = (html: string): string[] => [...new Set([...html.matchAll(/test-images%2F([\w.-]+)/g)].map(([, name]) => name))].sort()
const listedImages = (path: string): string[] => (PAGE_IMAGES.get(path) ?? []).map((src) => src.replace('/test-images/', '')).sort()

describe('PAGE_IMAGES (image sitemap)', () => {
  it.each(PAGES)('%s lists exactly the pictures the page shows, each with an alt of 20+ characters', (path, Page) => {
    const html = renderToStaticMarkup(<Page />)
    expect(listedImages(path)).toEqual(shownImages(html))
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) expect(tag).toMatch(/\balt="[^"]{20,}"/)
  })

  it('has an entry for every templated page and article', () => {
    for (const path of TEMPLATED_PATHS) expect(PAGE_IMAGES.has(path), path).toBe(true)
  })
})

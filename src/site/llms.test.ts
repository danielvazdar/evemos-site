import { describe, expect, it, vi } from 'vitest'

import { ARTICLE_PATHS } from '@/site/guides/articles'
import { SITE_HREFS } from '@/site/links'
import { TEMPLATED_PATHS } from '@/site/sitemap'

import { llmsText } from './llms'

vi.mock('@/lib/product', () => ({ PRODUCT_NAME: 'Stand-in Name' }))

const ORIGIN = 'https://site.example'
const text = llmsText(ORIGIN)
const paths = [...text.matchAll(/\]\((https:\/\/site\.example[^)]*)\)/g)].map(([, url]) => url.slice(ORIGIN.length))

describe('llms.txt', () => {
  it('opens with the product name and a one-paragraph summary, as llmstxt.org asks', () => {
    expect(text.split('\n')[0]).toBe('# Stand-in Name')
    expect(text.split('\n')[2]).toMatch(/^> /)
  })

  it('lists every article', () => {
    for (const path of ARTICLE_PATHS) expect(paths).toContain(path)
  })

  it('links only to pages that exist', () => {
    const known = new Set([...SITE_HREFS, ...TEMPLATED_PATHS])
    expect(paths.filter((path) => !known.has(path))).toEqual([])
  })

  it('never types the product name; it comes from product.ts', () => {
    expect(text).not.toMatch(/expono|evemos/i)
  })
})

/**
 * The accreditation page (/product/accreditation), rendered as the visitor
 * gets it: one `h1`, sections in order, every link landing, and no claim the
 * product can't back.
 *
 * ★ THE FORBIDDEN LIST IS WHAT ACCREDITATION DOES NOT DO TODAY (checked against
 * the code on 2026-10-20): delegations as an accreditation group, access zones,
 * ID or document uploads, press-card checks, wallet passes, badge printing,
 * deadlines and quotas. A buyer can hold Evemos to this page. When one of these
 * ships, take it off the list in the same change that adds the line.
 */
import type { Metadata } from 'next'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import AccreditationPage, { metadata } from '@/app/(site)/product/accreditation/page'
import home from '@/site/home/home.module.css'
import { links } from '@/site/links'
import pages from '@/site/pages/MarketingPage.module.css'
import tones from '@/site/ui/primitives.module.css'

/** With the product name swapped for a stand-in, a typed-in "Evemos" is the only way the real name could reach the page. */
vi.mock('@/lib/product', () => ({ PRODUCT_NAME: 'Stand-in Name' }))

const html = renderToStaticMarkup(<AccreditationPage />)

const text = html
  .replace(/<!-- -->/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#x27;/g, "'")
  .replace(/&amp;/g, '&')
  .replace(/\s+/g, ' ')

/** The page title as the browser shows it: this page sets an absolute title, past the layout's template. */
const titleOf = (meta: Metadata): string => {
  const { title } = meta
  if (typeof title === 'string') return title
  return title && 'absolute' in title ? title.absolute : ''
}

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id))
const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(([, href]) => href)

describe('accreditation page structure', () => {
  it('has one h1 and its sections in order', () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect([...html.matchAll(/<section\b[^>]*\baria-labelledby="([^"]+)"/g)].map(([, id]) => id)).toEqual([
      'accreditation-title',
      'steps-title',
      'groups-title',
      'record-title',
      'faq-title',
      'closing-title',
    ])
  })

  // F-192d (E-131 Q4 = B): what has a picture or cards is on the washes, in glass; the questions are calm.
  it('puts the hero, steps, groups and record on the washes, the questions on a calm band and the close on violet', () => {
    const toneOf = (id: string): string[] => new RegExp(`<section\\b[^>]*aria-labelledby="${id}"[^>]*class="([^"]+)"`).exec(html)?.[1].split(' ') ?? []
    for (const id of ['accreditation-title', 'steps-title', 'groups-title', 'record-title']) expect(toneOf(id), id).toContain(tones.open)
    expect(toneOf('faq-title').some((tone) => tone === tones.paper || tone === tones.raised)).toBe(true)
    expect(toneOf('closing-title')).toContain(tones.violet)
  })

  it('frames the hero photo in glass, makes every step and group a glass key card, and the record screen a glass window', () => {
    const hero = html.slice(0, html.indexOf('id="steps-title"'))
    expect(hero).toMatch(new RegExp(`<div class="${home.glass} ${pages.glassFrame}" data-glass=""><img\\b`))
    const cards = [...html.matchAll(new RegExp(`<li class="${home.glass} ${home.keyCard}" data-glass="">`, 'g'))]
    expect(cards).toHaveLength(8)
    const record = html.slice(html.indexOf('id="record-title"'), html.indexOf('id="faq-title"'))
    expect(record.match(/\bdata-glass=""/g)).toHaveLength(1)
  })

  it('names the four groups the product accredits, and no other', () => {
    for (const group of ['Press and media', 'Crew', 'Speakers', 'Your own team']) {
      expect(text).toContain(group)
    }
  })

  it('every link lands: a route or anchor in links.ts, or an id on this page', () => {
    const known = new Set<string>(Object.values(links))
    const lands = (href: string): boolean => known.has(href) || (href.startsWith('#') && ids.has(href.slice(1)))

    expect(hrefs.length).toBeGreaterThan(0)
    expect(hrefs.filter((href) => !lands(href))).toEqual([])
  })

  it('every "Book a demo" goes to the demo form', () => {
    const demoLinks = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)]
      .filter(([, , inner]) => inner.replace(/<[^>]+>/g, '').trim() === 'Book a demo')
      .map(([, href]) => href)

    expect(demoLinks.length).toBeGreaterThan(0)
    expect(new Set(demoLinks)).toEqual(new Set([links.demo]))
  })

  it('gives every photo alt text', () => {
    const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag)
    expect(images).toHaveLength(2)
    expect(images.filter((tag) => !/\balt="[^"]{20,}"/.test(tag))).toEqual([])
  })

  // F-192f: the column is 1280px since F-192a; a photo asked for at the old 1200px column's 560px was fetched too small.
  it('asks for both photos at half the 1280px column', () => {
    const half = '(min-width: 1376px) 624px, (min-width: 1024px) 50vw, 100vw'
    expect([...html.matchAll(/<img\b[^>]*\bsizes="([^"]*)"/g)].map(([, value]) => value)).toEqual([half, half])
  })
})

describe('accreditation page claims', () => {
  it('never calls itself AI', () => {
    expect(text).not.toMatch(/\bAI\b/)
  })

  it.each([
    'delegation',
    'zone',
    'upload',
    'wallet',
    'print',
    'deadline',
    'quota',
    'vetting',
    'all-in-one',
  ])('says nothing about "%s"', (word) => {
    expect(text.toLowerCase()).not.toMatch(new RegExp(`\\b${word.toLowerCase()}`))
  })

  it('never types the product name; it comes from product.ts', () => {
    expect(html).not.toMatch(/expono|evemos/i)
    expect(titleOf(metadata)).toContain('Stand-in Name')
  })

  it('puts the search terms in the title and description', () => {
    expect(titleOf(metadata)).toMatch(/accreditation software/i)
    expect(metadata.description).toMatch(/press and media accreditation/i)
  })
})

/**
 * The homepage as a visitor gets it: header, page and footer together, as the
 * `(site)` layout renders them (the layout itself is async, for the CSP nonce,
 * so its three parts are rendered here directly).
 *
 * ★ NO LINK GOES NOWHERE. Every href is a route that exists, a mailto, or an
 * anchor whose id is on the page; and `HOME_SECTION_IDS`, the switch that shows
 * section links in the chrome, names exactly the sections the page has.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SiteFooter } from '@/site/chrome/SiteFooter'
import { SiteHeader } from '@/site/chrome/SiteHeader'
import { DEMO_EMAIL, HOME_SECTION_IDS, links, SITE_PAGES } from '@/site/links'
import { TEMPLATED_PATHS } from '@/site/sitemap'
import primitives from '@/site/ui/primitives.module.css'

import HomePage from './page'

/** Routes the app serves outside the homepage. */
const ROUTES: ReadonlySet<string> = new Set([links.home, links.login, ...SITE_PAGES, ...TEMPLATED_PATHS])

const html = renderToStaticMarkup(
  <>
    <SiteHeader />
    <main id="main">
      <HomePage />
    </main>
    <SiteFooter />
  </>,
)

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id))
const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(([, href]) => href)

const lands = (href: string): boolean => {
  if (ROUTES.has(href) || href.startsWith('mailto:')) return true
  const anchor = /^\/?#(.+)$/.exec(href)?.[1]
  return anchor !== undefined && ids.has(anchor)
}

describe('homepage links', () => {
  it('every href is a route, a mailto, or an id on the page', () => {
    expect(hrefs.length).toBeGreaterThan(3)
    expect(hrefs.filter((href) => !lands(href))).toEqual([])
  })

  it('every switched-on section exists on the page, and every section is switched on', () => {
    const sectionIds = [...html.matchAll(/<section\b[^>]*\sid="([^"]+)"/g)].map(([, id]) => id)

    expect([...HOME_SECTION_IDS].filter((id) => !ids.has(id))).toEqual([])
    expect(sectionIds.filter((id) => !HOME_SECTION_IDS.has(id))).toEqual([])
  })

  it('"Book a demo" lands on the demo section, which offers the demo address', () => {
    expect(hrefs.filter((href) => href === links.demo).length).toBeGreaterThan(0)
    expect(html).toContain(`<a href="${links.demoEmail}">${DEMO_EMAIL}</a>`)
  })

  it('has one primary action, "Book a demo", once in the header, and one h1', () => {
    const primaryClass = `${primitives.button} ${primitives.primary}`
    const primaries = [...html.matchAll(/<a\b[^>]*\bclass="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)]
      .filter(([, className]) => className === primaryClass)
      .map(([, , inner]) => inner.replace(/<[^>]+>/g, ''))
    const header = renderToStaticMarkup(<SiteHeader />)

    // Header, hero and the closing panel: the same label every time (E-13).
    expect(primaries.length).toBeGreaterThan(1)
    expect(new Set(primaries)).toEqual(new Set(['Book a demo']))
    expect(header.match(/>Book a demo</g)).toHaveLength(1)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
  })
})

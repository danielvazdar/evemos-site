/**
 * The templated product, solution and service pages: each renders with one h1,
 * every link lands on a page that exists, slugs are unique, and none says what
 * the site must never say (E-39 keeps these bans). Each opens on the washes
 * with its picture in glass and reads on calm bands (F-192d, E-131 Q4 = B).
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import FloorPlanRoute, { metadata as floorPlanMetadata } from '@/app/(site)/product/floor-plan/page'
import ReportsRoute, { metadata as reportsMetadata } from '@/app/(site)/product/reports/page'
import { generateMetadata as productMetadata } from '@/app/(site)/product/[slug]/page'
import { formatMoney } from '@/lib/app/format'
import { APP_PAGE_PATHS } from '@/lib/app-routes'
import { links, SITE_PAGES } from '@/site/links'
import { PLAN_PRICES, planPrice, STARTING_PRICE, startingPriceLine } from '@/site/offer'
import { MENU_LABELS, PRODUCT_MENU, TEMPLATED_PATHS } from '@/site/sitemap'

import { ADD_ONS, PLANS } from '@/site/pricing/content'
import pricing from '@/site/pricing/pricing.module.css'
import { PricingPage } from '@/site/pricing/PricingPage'

import { CAREERS_PAGE, CONTACT_PAGE, CUSTOMER_STORY, SECURITY_PAGE } from './company'
import home from '@/site/home/home.module.css'
import overview from '@/site/home/OverviewPreview.module.css'
import booth from '@/site/photos/exhibition-stand-render.png'
import hallAbove from '@/site/photos/exhibition-hall-from-above.jpg'
import { PRODUCT_PREVIEWS } from '@/site/previews/ProductPreviews'
import { PAGE_IMAGES } from '@/site/seo/page-images'
import tones from '@/site/ui/primitives.module.css'

import { MarketingPage } from './MarketingPage'
import styles from './MarketingPage.module.css'
import { PRODUCT_PAGES, productPage } from './product'
import { ProductOverview } from './ProductOverview'
import { SERVICE_PAGES, servicePage } from './services'
import { SOLUTION_PAGES, solutionPage } from './solutions'
import type { MarketingPageContent } from './types'

/**
 * Product pages that draw the app itself, on routes of their own (F-192d), so
 * the `[slug]` route serving the rest loads none of the hall's or the
 * dashboard's CSS and script. Each route renders the templated page.
 */
const OWN_ROUTES: Readonly<Record<string, () => ReactElement>> = { 'floor-plan': FloorPlanRoute, reports: ReportsRoute }

const ALL = [
  ...PRODUCT_PAGES.map((page) => ['product', page] as const),
  ...SOLUTION_PAGES.map((page) => ['solutions', page] as const),
  ...SERVICE_PAGES.map((page) => ['services', page] as const),
]

const KNOWN = new Set<string>([...Object.values(links), ...SITE_PAGES, ...TEMPLATED_PATHS])
const textOf = (html: string) => html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ')
const hrefsOf = (html: string) => [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(([, href]) => href)

describe('templated pages', () => {
  it('have unique slugs per family, in lowercase words and hyphens', () => {
    for (const pages of [PRODUCT_PAGES, SOLUTION_PAGES, SERVICE_PAGES]) {
      const slugs = pages.map((page) => page.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
      expect(slugs.filter((slug) => !/^[a-z]+(-[a-z]+)*$/.test(slug))).toEqual([])
    }
  })

  it('never shadow a hand-built route: only a page with a route of its own has a route file', () => {
    for (const [family, page] of ALL) {
      const own = family === 'product' && page.slug in OWN_ROUTES
      expect(existsSync(join(process.cwd(), 'src', 'app', '(site)', family, page.slug, 'page.tsx')), `${family}/${page.slug}`).toBe(own)
    }
  })

  // F-192d: moving a page onto its own route changes nothing a visitor or a search engine reads.
  it.each(Object.keys(OWN_ROUTES))('/product/%s on its own route is the templated page, with the same metadata', async (slug) => {
    const page = productPage(slug)
    if (!page) throw new Error(`no product page ${slug}`)
    const html = renderToStaticMarkup(OWN_ROUTES[slug]())
    expect(textOf(/<h1\b[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? '').trim()).toBe(page.hero.title)
    for (const section of page.sections) expect(textOf(html), section.title).toContain(section.title)
    expect(hrefsOf(html)).toContain(links.demo)
    const own = slug === 'floor-plan' ? floorPlanMetadata : reportsMetadata
    expect(own).toEqual(await productMetadata({ params: Promise.resolve({ slug }) }))
    expect(own.alternates?.canonical).toBe(`/product/${slug}`)
  })

  it.each(ALL.map(([family, page]) => [`${family}/${page.slug}`, page] as const))('/%s renders: one h1, Book a demo, links that land', (_path, page) => {
    const html = renderToStaticMarkup(<MarketingPage content={page} />)

    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(hrefsOf(html)).toContain(links.demo)
    expect(hrefsOf(html).filter((href) => !KNOWN.has(href))).toEqual([])
    if (page.photo) expect(html).toMatch(/<img\b[^>]*\balt="[^"]{20,}"/)
  })

  it.each(['all-in-one platform', 'AI-powered', 'revolutionary', 'seamless', 'streamline', 'world-class'])('no page says "%s"', (phrase) => {
    for (const [, page] of ALL) {
      expect(textOf(renderToStaticMarkup(<MarketingPage content={page} />)).toLowerCase()).not.toContain(phrase.toLowerCase())
    }
  })

  it('the floor-plan page says a booth cannot be sold twice (#220)', () => {
    const items = productPage('floor-plan')?.sections.flatMap((section) => section.items.map((item) => item.title))
    expect(items).toContain('No double booking')
  })

  it('labels every "How it connects" link with the menu label of the page it opens', () => {
    for (const [family, page] of ALL) {
      const html = renderToStaticMarkup(<MarketingPage content={page} />)
      const connects = textOf(html.slice(html.indexOf('id="connects"')))
      for (const href of page.connects?.hrefs ?? []) expect(connects, `${family}/${page.slug} → ${href}`).toContain(MENU_LABELS.get(href))
    }
    for (const page of PRODUCT_PAGES) expect(MENU_LABELS.get(`/product/${page.slug}`)).toBe(page.menuLabel)
  })

  it('the product overview links every product module', () => {
    const hrefs = hrefsOf(renderToStaticMarkup(<ProductOverview />))
    for (const page of PRODUCT_PAGES) expect(hrefs).toContain(`/product/${page.slug}`)
    expect(hrefs).toContain(links.accreditationPage)
  })
})

describe('company and trust pages', () => {
  it.each([
    ['security', SECURITY_PAGE],
    ['contact', CONTACT_PAGE],
    ['careers', CAREERS_PAGE],
    ['customer story', CUSTOMER_STORY],
  ] as const)('%s renders with one h1 and links that land', (_name, page) => {
    const html = renderToStaticMarkup(<MarketingPage content={page} />)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(hrefsOf(html).filter((href) => !KNOWN.has(href))).toEqual([])
  })

  it('security claims no certification', () => {
    const text = textOf(renderToStaticMarkup(<MarketingPage content={SECURITY_PAGE} />))
    expect(text).not.toMatch(/ISO ?27001|SOC ?2|certified|certification/i)
  })

  it('security claims no restore drill until one is logged (#162)', () => {
    const text = textOf(renderToStaticMarkup(<MarketingPage content={SECURITY_PAGE} />))
    expect(text).toContain('Every night, encrypted and kept off the main server.')
    expect(text).not.toMatch(/drill/i)
  })

  it('careers lists no invented roles', () => {
    const text = textOf(renderToStaticMarkup(<MarketingPage content={CAREERS_PAGE} />))
    expect(text).not.toMatch(/\b(Senior|Junior|Full-time|Part-time|Salary|Apply now)\b/i)
  })

  it('the customer story gives no numbers until the client does', () => {
    const text = textOf(renderToStaticMarkup(<MarketingPage content={CUSTOMER_STORY} />))
    expect(text.replace(/\b20\d\d\b/g, '')).not.toMatch(/\d/)
  })
})

describe('pricing', () => {
  const html = renderToStaticMarkup(<PricingPage />)
  const text = textOf(html)

  it('has one h1, four plans and Book a demo', () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(PLANS).toHaveLength(4)
    for (const plan of PLANS) expect(text).toContain(plan.name)
    expect(hrefsOf(html)).toContain(links.demo)
  })

  it('shows the coffee-meeting photo beside the intro, with an alt of 20+ characters (F-118)', () => {
    const intro = html.slice(0, html.indexOf('id="plans"'))
    expect(intro).toMatch(/<img\b[^>]*\balt="[^"]{20,}"[^>]*test-images%2Forganiser-and-exhibitor-coffee-meeting\.jpg/)
  })

  it('words a starting price, and has none without one', () => {
    expect(startingPriceLine(null)).toBeNull()
    expect(startingPriceLine({ cents: 120000, upToExhibitors: 50 })).toBe('From €1,200 a year for shows with up to 50 exhibitors.')
  })

  it('gives each plan its price from offer.ts, or "Price on request" without one (#216, #241)', () => {
    const cards = html.split(/<h3>/).slice(1, PLANS.length + 1)
    expect(cards.map((card) => card.slice(0, card.indexOf('</h3>')))).toEqual(PLANS.map((plan) => plan.name))
    PLANS.forEach((plan, i) => {
      const price = PLAN_PRICES[plan.key]
      const parts = price ? planPrice(price) : null
      expect(textOf(cards[i])).toContain(parts ? `${parts.amount} ${parts.per}` : 'Price on request')
    })
  })

  it('says the starting price in the intro, or why there is none', () => {
    const intro = textOf(html.slice(0, html.indexOf('id="plans"')))
    expect(intro).toContain(startingPriceLine(STARTING_PRICE) ?? 'we price each show on its own')
  })

  it('shows no figure that is not in offer.ts, and no popularity claim', () => {
    const allowed = Object.values(PLAN_PRICES).flatMap((price) => (price ? [formatMoney(price.cents / 100, 'EUR')] : []))
    expect([...text.matchAll(/€\s?[\d,.]+/g)].map(([figure]) => figure).filter((figure) => !allowed.includes(figure))).toEqual([])
    expect(text).not.toMatch(/\$|EUR|USD|per month|\/year/)
    expect(text).not.toMatch(/most popular|most chosen|best seller/i)
  })
})

describe('page pictures', () => {
  const base = { ...PRODUCT_PAGES[0], photo: undefined, visual: undefined, gallery: undefined }
  const shot = { src: booth, alt: 'A screenshot used only in this test, long enough.' }
  const photo = { src: hallAbove, alt: 'A photo used only in this test, long enough too.' }
  const heroOf = (html: string) => html.slice(0, html.indexOf('id="section-1"'))
  const sectionOf = (html: string, n: number) => html.slice(html.indexOf(`id="section-${n}"`), html.indexOf(`id="section-${n + 1}"`) === -1 ? undefined : html.indexOf(`id="section-${n + 1}"`))

  it('puts the visual beside the hero text and the photo beside section 1', () => {
    const html = renderToStaticMarkup(<MarketingPage content={{ ...base, visual: shot, photo }} />)
    expect(heroOf(html)).toContain('test-images%2Fexhibition-stand-render.png')
    expect(sectionOf(html, 1)).toContain('test-images%2Fexhibition-hall-from-above.jpg')
  })

  // The quality (90 for the hero) is checked on the running site: tests run without next.config's `images.qualities`.
  it('asks for the hero picture at the full container width, so screenshot text stays sharp', () => {
    const html = renderToStaticMarkup(<MarketingPage content={{ ...base, visual: shot, photo }} />)
    const heroImg = heroOf(html).match(/<img\b[^>]*>/)?.[0] ?? ''
    expect(heroImg).toContain('sizes="(min-width: 1376px) 1280px, 100vw"')
  })

  // The column is 1280px since F-192a: a picture asked for at the old 1200px column was fetched too small.
  it('asks for a section picture at half the 1280px column, and a strip photo at seven twelfths of it', () => {
    const html = renderToStaticMarkup(<MarketingPage content={{ ...base, visual: shot, photo, gallery: [photo, photo], galleryLayout: 'strip' }} />)
    expect(sectionOf(html, 1).match(/<img\b[^>]*>/)?.[0]).toContain('sizes="(min-width: 1376px) 624px, (min-width: 1024px) 50vw, 100vw"')
    const strip = html.slice(html.indexOf('aria-label="Pictures"'))
    expect(strip.match(/<img\b[^>]*>/)?.[0]).toContain('sizes="(min-width: 1376px) 740px, (min-width: 768px) 60vw, 100vw"')
  })

  it('puts a lone photo in the hero, and section 1 has no picture', () => {
    const html = renderToStaticMarkup(<MarketingPage content={{ ...base, photo }} />)
    expect(heroOf(html)).toContain('test-images%2Fexhibition-hall-from-above.jpg')
    expect(sectionOf(html, 1)).not.toContain('<img')
  })

  it('renders a video as the muted, poster-first SiteVideo with its description', () => {
    const html = renderToStaticMarkup(<MarketingPage content={{ ...base, visual: shot, photo: { video: 'a-hall-model' } }} />)
    const section = sectionOf(html, 1)
    expect(section).toMatch(/<video\b[^>]*\bmuted=""[^>]*\bpreload="none"[^>]*\bposter="\/site\/video\/exhibition-hall-scale-model.jpg"/)
    expect(section).toContain('<source src="/site/video/exhibition-hall-scale-model.mp4" type="video/mp4"/>')
    expect(section).toMatch(/<figcaption class="visually-hidden">[^<]{20,}<\/figcaption>/)
  })

  describe('gallery layouts', () => {
    // Two sections, so "after section 1" and "after the last section" are different places.
    const sections = [base.sections[0], { title: 'Second', items: [{ title: 'One', line: 'Line.' }] }]
    const lastSection = 'id="section-2"'
    const render = (galleryLayout?: MarketingPageContent['galleryLayout'], extra: Partial<MarketingPageContent> = {}) =>
      renderToStaticMarkup(<MarketingPage content={{ ...base, sections, gallery: [photo, shot], galleryLayout, ...extra }} />)
    const stripOf = (html: string) => html.slice(html.indexOf('aria-label="Pictures"'), html.indexOf('</section>', html.indexOf('aria-label="Pictures"')))
    const connectsOf = (html: string) => html.slice(html.indexOf('id="connects"'), html.indexOf('id="next-title"'))

    it('strip (the default): both photos side by side after the last section, nothing beside "Works with"', () => {
      const html = render()
      expect(html.indexOf('aria-label="Pictures"')).toBeGreaterThan(html.indexOf(lastSection))
      expect(stripOf(html)).toContain('test-images%2Fexhibition-hall-from-above.jpg')
      expect(stripOf(html)).toContain('test-images%2Fexhibition-stand-render.png')
      expect(connectsOf(html)).not.toMatch(/<img|<video/)
    })

    it('stripFlip: both photos, flipped, right after section 1', () => {
      const html = render('stripFlip')
      expect(html.indexOf('aria-label="Pictures"')).toBeGreaterThan(html.indexOf('id="section-1"'))
      expect(html.indexOf('aria-label="Pictures"')).toBeLessThan(html.indexOf('id="section-2"'))
      expect(stripOf(html)).toMatch(/galleryRowFlip/)
    })

    it('banner: the first photo edge to edge after section 1, the second beside "Works with"', () => {
      const html = render('banner')
      expect(html.indexOf('aria-label="Pictures"')).toBeLessThan(html.indexOf('id="section-2"'))
      expect(stripOf(html)).toContain('test-images%2Fexhibition-hall-from-above.jpg')
      expect(stripOf(html)).not.toContain('test-images%2Fexhibition-stand-render.png')
      expect(connectsOf(html)).toContain('test-images%2Fexhibition-stand-render.png')
    })

    it('beside: the first photo beside the last section, the second beside "Works with"', () => {
      const html = render('beside')
      expect(html).not.toContain('aria-label="Pictures"')
      expect(sectionOf(html, 2)).toContain('test-images%2Fexhibition-hall-from-above.jpg')
      expect(connectsOf(html)).toContain('test-images%2Fexhibition-stand-render.png')
    })

    it('falls back to the strip when the layout has no slot (no "Works with")', () => {
      for (const layout of ['banner', 'beside'] as const) {
        const html = render(layout, { connects: undefined })
        expect(stripOf(html), layout).toContain('test-images%2Fexhibition-stand-render.png')
      }
    })

    it('shows no hall clip on a page whose pictures are all photos', () => {
      for (const layout of [undefined, 'stripFlip', 'banner', 'beside'] as const) expect(render(layout), String(layout)).not.toContain('<video')
    })
  })

  it('gives each templated page its own gallery photos, and neighbours different layouts', () => {
    const pages = [...ALL.map(([, page]) => page), SECURITY_PAGE, CONTACT_PAGE, CAREERS_PAGE, CUSTOMER_STORY].filter((page) => page.gallery)
    expect(pages).toHaveLength(26)
    const files = pages.flatMap((page) => page.gallery!.map((picture) => ('src' in picture ? picture.src.src : picture.video)))
    expect(new Set(files).size).toBe(files.length)
    for (const family of ['product', 'solutions', 'services'] as const) {
      const layouts = ALL.filter(([f, page]) => f === family && page.gallery).map(([, page]) => page.galleryLayout ?? 'strip')
      layouts.slice(1).forEach((layout, i) => expect(layout, `${family} page ${i + 2}`).not.toBe(layouts[i]))
    }
  })

  it('puts a section figure beside that section only', () => {
    const sections = [base.sections[0], { title: 'Second', items: [{ title: 'One', line: 'Line.' }], figure: photo }]
    const html = renderToStaticMarkup(<MarketingPage content={{ ...base, sections }} />)
    expect(sectionOf(html, 1)).not.toContain('<img')
    expect(sectionOf(html, 2)).toContain('test-images%2Fexhibition-hall-from-above.jpg')
  })

  it('fails the render when the photo has no slot left (AC 7)', () => {
    const sections = [{ ...base.sections[0], figure: shot }]
    expect(() => renderToStaticMarkup(<MarketingPage content={{ ...base, visual: shot, photo, sections }} />)).toThrow(/has a photo with no slot/)
  })
})

/**
 * F-118's placement table, page by page (AC 2): what the hero shows (a file,
 * or `null` for a drawn preview) and the picture beside each numbered section.
 */
const PLACEMENT: ReadonlyArray<readonly [slug: string, hero: string | null, sections: Readonly<Record<number, string>>]> = [
  ['crm', 'exhibitor-list-screenshot.jpg', { 1: 'exhibitor-talking-to-visitor-at-stand.jpg' }],
  ['email-marketing', null, { 1: 'organisers-working-on-laptops.jpg' }],
  ['registration', 'visitor-registrations-screenshot.jpg', { 1: 'registration-desk-visitor-badges.jpg' }],
  ['event-websites', 'public-floor-plan-page-screenshot.jpg', { 1: 'visitor-checking-phone-at-exhibition-entrance.jpg' }],
  ['invoicing', 'exhibitor-invoices-screenshot.jpg', { 1: 'organiser-and-exhibitor-reviewing-document.jpg' }],
  ['exhibitor-portal', null, { 1: 'exhibition-stand-render.png' }],
  ['service-orders', null, { 1: 'exhibitor-stand-build-up-technician.jpg' }],
  ['floor-plan', null, { 1: 'exhibition-hall-scale-model.mp4' }],
  ['badges-check-in', 'badge-check-in-screenshot.jpg', { 1: 'qr-badges-on-lanyards.jpg', 2: 'check-in-desk-badge-scanning.jpg' }],
  ['on-site-hardware', 'badge-printer-scanner-and-lanyard.jpg', { 1: 'self-service-check-in-kiosk.jpg' }],
  ['reports', null, { 1: 'organisers-reviewing-results-after-show.jpg' }],
]

/** How a file shows up in the markup: a clip by its public path, a picture through Next's image URL. */
const markerOf = (file: string) => (file.endsWith('.mp4') ? `<source src="/site/video/${file}"` : `test-images%2F${file}`)

/** A product page as its route (`/product/[slug]/page.tsx`) renders it. */
const renderProduct = (slug: string) => {
  const page = productPage(slug)
  if (!page) throw new Error(`no product page ${slug}`)
  const Own = OWN_ROUTES[slug]
  if (Own) return renderToStaticMarkup(<Own />)
  const Preview = PRODUCT_PREVIEWS[slug]
  return renderToStaticMarkup(<MarketingPage content={page} preview={Preview ? <Preview /> : undefined} />)
}

describe('product page pictures (F-118)', () => {
  const bandOf = (html: string, n: number) => {
    const start = html.indexOf(`id="section-${n}"`)
    const next = html.indexOf('<section', start + 1)
    return html.slice(start, next === -1 ? undefined : next)
  }

  it.each(PLACEMENT)('/product/%s shows its assigned pictures', (slug, hero, sections) => {
    const html = renderProduct(slug)
    const heroBand = html.slice(0, html.indexOf('id="section-1"'))
    if (hero) expect(heroBand).toContain(markerOf(hero))
    else expect(textOf(heroBand)).toMatch(/Demo data/)
    for (const [n, file] of Object.entries(sections)) expect(bandOf(html, Number(n)), `section ${n}`).toContain(markerOf(file))
  })

  it('/product shows p-product beside the hero text and the a-hall film under them', () => {
    const html = renderToStaticMarkup(<ProductOverview />)
    const hero = html.slice(0, html.indexOf('id="stage-1"'))
    expect(hero.indexOf(markerOf('floor-manager-with-tablet-and-radio.jpg'))).toBeGreaterThan(-1)
    expect(hero.indexOf(markerOf('busy-trade-fair-hall.mp4'))).toBeGreaterThan(hero.indexOf(markerOf('floor-manager-with-tablet-and-radio.jpg')))
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) expect(tag).toMatch(/\balt="[^"]{20,}"/)
  })

  // F-192d (AC 24): the app's own hall, as on the homepage, where the editor's screenshot was.
  it('/product/floor-plan shows the hall the visitor can tap, and the screenshot is gone from the page, the repo and the sitemap', () => {
    const hero = heroBandOf(renderProduct('floor-plan'))
    expect(hero).toMatch(/<figure id="floor-plan" class="[^"]*" data-ui="" data-glass="">/)
    // The app's booth buttons, with the homepage's first booth open; flat, so the 3D pictures wait for a turn.
    expect(/<button\b[^>]*\baria-label="H7-B04,[^>]*>/.exec(hero)?.[0]).toContain('aria-pressed="true"')
    expect(hero).toContain('<button type="button" aria-pressed="true">2D</button>')
    expect(hero).toMatch(/\bdata-view="2d"/)
    expect(hero).not.toContain('<img')
    expect(existsSync(join(process.cwd(), 'src', 'site', 'photos', 'floor-plan-editor-screenshot.jpg'))).toBe(false)
    expect(PAGE_IMAGES.get('/product/floor-plan')?.filter((src) => src.includes('floor-plan-editor'))).toEqual([])
  })

  // F-192d (AC 24, AC 18): the app's own dashboard; its booths ring opens the floor plan page, and no link leads into the app.
  it('/product/reports shows the dashboard, its ring opening /product/floor-plan, and no link into the app', () => {
    const html = renderProduct('reports')
    const hero = heroBandOf(html)
    expect(hero).toMatch(new RegExp(`<div class="${home.glass} ${overview.window}" aria-hidden="true" data-ui="" data-glass="">`))
    expect(hero).toContain('href="/product/floor-plan"')
    const intoTheApp = (href: string) => APP_PAGE_PATHS.some((path) => href === path || href.startsWith(`${path}/`) || href.startsWith(`${path}?`))
    expect(hrefsOf(html).filter(intoTheApp)).toEqual([])
  })

  it('covers every product page', () => {
    expect(PLACEMENT.map(([slug]) => slug).sort()).toEqual(PRODUCT_PAGES.map((page) => page.slug).filter((slug) => slug !== 'lead-capture').sort())
  })

  it('gives every picture on every templated page an alt of 20+ characters (AC 3)', () => {
    for (const [family, page] of ALL) {
      const html = family === 'product' ? renderProduct(page.slug) : renderToStaticMarkup(<MarketingPage content={page} />)
      for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) expect(tag, `${family}/${page.slug}`).toMatch(/\balt="[^"]{20,}"/)
    }
  })
})

/** The same table for the solution, service and contact pages: the hero picture and the picture beside each numbered section. */
const PAGE_PLACEMENT: ReadonlyArray<readonly [path: string, page: MarketingPageContent | undefined, hero: string, sections: Readonly<Record<number, string>>]> = [
  ['/solutions/conferences', solutionPage('conferences'), 'conference-expo-floor-and-stage.jpg', { 1: 'conference-expo-floor.mp4' }],
  ['/solutions/associations', solutionPage('associations'), 'congress-registration-desk.jpg', {}],
  ['/solutions/venues', solutionPage('venues'), 'venue-build-up-hall-plan.jpg', {}],
  ['/solutions/defence-security', solutionPage('defence-security'), 'defence-show-accreditation-desk.jpg', {}],
  ['/services/onboarding', servicePage('onboarding'), 'organisers-reviewing-form-together.jpg', {}],
  ['/services/migration', servicePage('migration'), 'organisers-with-old-binders-and-spreadsheet.jpg', {}],
  ['/services/show-week-support', servicePage('show-week-support'), 'organiser-on-phone-during-build-up.jpg', { 1: 'exhibition-build-up-carpet-crew.jpg' }],
  ['/contact', CONTACT_PAGE, 'phone-call-outside-exhibition-centre.jpg', {}],
]

describe('solution, service and contact page pictures (F-118)', () => {
  it.each(PAGE_PLACEMENT)('%s shows its assigned pictures', (path, page, hero, sections) => {
    if (!page) throw new Error(`no page ${path}`)
    const html = renderToStaticMarkup(<MarketingPage content={page} />)
    expect(html.slice(0, html.indexOf('id="section-1"'))).toContain(markerOf(hero))
    for (const [n, file] of Object.entries(sections)) {
      const start = html.indexOf(`id="section-${n}"`)
      expect(html.slice(start, html.indexOf('<section', start + 1)), `section ${n}`).toContain(markerOf(file))
    }
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) expect(tag).toMatch(/\balt="[^"]{20,}"/)
  })
})

describe('product screens', () => {
  it('every product page has either a real screenshot or render (`visual`) or a drawn screen, never both (AC 8)', () => {
    const without = PRODUCT_PAGES.filter((page) => !page.visual).map((page) => page.slug)
    expect([...Object.keys(PRODUCT_PREVIEWS), ...Object.keys(OWN_ROUTES)].sort()).toEqual(without.sort())
  })

  it('every drawn screen is marked as demo data and hidden from screen readers', () => {
    for (const slug of Object.keys(PRODUCT_PREVIEWS)) {
      const Preview = PRODUCT_PREVIEWS[slug]
      const html = renderToStaticMarkup(<Preview />)
      expect(html, slug).toContain('aria-hidden="true"')
      expect(textOf(html), slug).toMatch(/Demo data/)
      expect(textOf(html), slug).not.toMatch(/Horvat|Kovač|Babić|Novak/)
    }
  })

  // F-192d: the hero's washes show through each screen's glass; the page frames none of them again.
  it('every drawn screen, the app’s hall and dashboard too, is one glass window, revealed whole, with no glass inside it', () => {
    for (const slug of [...Object.keys(PRODUCT_PREVIEWS), ...Object.keys(OWN_ROUTES)]) {
      const glass = [...heroBandOf(renderProduct(slug)).matchAll(/<\w+\b[^>]*\bdata-glass=""[^>]*>/g)].map(([tag]) => tag)
      expect(glass, slug).toHaveLength(1)
      expect(glass[0], slug).toMatch(new RegExp(`\\bclass="${home.glass}\\b`))
      expect(glass[0], slug).toMatch(/\bdata-ui="/)
    }
  })
})

/** One band of a page: a top-level `<section>`, by what names it, with its classes. */
interface Band {
  name: string
  classes: readonly string[]
}

/** The page's bands in order. A section inside one (an app panel in a drawn screen) is not a band. */
const bandsOf = (html: string): Band[] => {
  const bands: Band[] = []
  let depth = 0
  for (const [tag, closing] of html.matchAll(/<(\/?)section\b[^>]*>/g)) {
    if (closing) {
      depth -= 1
      continue
    }
    if (depth === 0) {
      const name = /\baria-(?:labelledby|label)="([^"]*)"/.exec(tag)?.[1] ?? ''
      bands.push({ name, classes: /\bclass="([^"]*)"/.exec(tag)?.[1].split(' ') ?? [] })
    }
    depth += 1
  }
  return bands
}

const CALM: readonly string[] = [tones.paper, tones.raised]
const isCalm = (band: Band): boolean => band.classes.some((name) => CALM.includes(name))

/** Every templated page as its route renders it, and whether its hero is a drawn screen (`PRODUCT_PREVIEWS`) rather than a picture. */
const TEMPLATED: ReadonlyArray<readonly [path: string, html: string, drawn: boolean]> = [
  ...ALL.map(([family, page]) =>
    family === 'product'
      ? ([`/product/${page.slug}`, renderProduct(page.slug), page.slug in PRODUCT_PREVIEWS || page.slug in OWN_ROUTES] as const)
      : ([`/${family}/${page.slug}`, renderToStaticMarkup(<MarketingPage content={page} />), false] as const),
  ),
  ...[SECURITY_PAGE, CONTACT_PAGE, CAREERS_PAGE, CUSTOMER_STORY].map((page) => [`/${page.slug}`, renderToStaticMarkup(<MarketingPage content={page} />), false] as const),
]

/** The hero band's markup: everything before the first section's band (a drawn screen has sections of its own). */
const heroBandOf = (html: string): string => html.slice(0, html.indexOf('<section id="section-1"'))

describe('page tones (F-192d, E-131 Q4 = B)', () => {
  it.each(TEMPLATED)('%s opens on the washes, reads on calm bands and ends on the violet close', (_path, html) => {
    const bands = bandsOf(html)
    expect(bands[0]).toMatchObject({ name: 'page-title' })
    expect(bands[0].classes).toContain(tones.open)
    expect(bands.at(-1)).toMatchObject({ name: 'next-title' })
    expect(bands.at(-1)?.classes).toContain(tones.violet)
    expect(bands.slice(1, -1).filter((band) => !isCalm(band))).toEqual([])
  })

  it.each(TEMPLATED)('%s sets its gallery on the band of the section it follows', (_path, html) => {
    const bands = bandsOf(html)
    bands.forEach((band, index) => {
      if (band.name !== 'Pictures') return
      const tone = (of: Band) => of.classes.find((name) => CALM.includes(name))
      expect(tone(band)).toBe(tone(bands[index - 1]))
    })
  })

  // /product has no long reading: its hero and every stage are on the washes, the modules as glass key cards.
  it('/product is on the washes throughout, its photo and film in glass frames and its modules glass key cards', () => {
    const html = renderToStaticMarkup(<ProductOverview />)
    expect(bandsOf(html).filter((band) => !band.classes.includes(tones.open))).toEqual([])
    const hero = html.slice(0, html.indexOf('<section id="stage-1"'))
    expect(hero.match(new RegExp(`<div class="${home.glass} ${styles.glassFrame}" data-glass="">`, 'g'))).toHaveLength(2)
    const cards = [...html.matchAll(/<li\b[^>]*>/g)].map(([tag]) => tag)
    expect(cards).toHaveLength(PRODUCT_MENU.groups.flatMap((group) => group.items).length)
    for (const card of cards) expect(card).toBe(`<li class="${home.glass} ${home.keyCard}" data-glass="">`)
  })

  it.each(TEMPLATED.filter(([, , drawn]) => !drawn))('%s frames its hero picture in glass', (_path, html) => {
    expect(heroBandOf(html)).toMatch(new RegExp(`<div class="${home.glass} ${styles.glassFrame}" data-glass=""><img\\b`))
  })
})

// F-192e (E-131 Q4 = B): /pricing is cards and a picture until its questions, so those are on the washes, in glass.
describe('pricing tones (F-192e, E-131 Q4 = B)', () => {
  const html = renderToStaticMarkup(<PricingPage />)

  it('puts the hero, the plans and the add-ons on the washes, the questions on a calm band and the close on violet', () => {
    const bands = bandsOf(html)
    expect(bands.map((band) => band.name)).toEqual(['pricing-title', 'plans-title', 'add-ons-title', 'pricing-faq-title', 'pricing-next-title'])
    for (const band of bands.slice(0, 3)) expect(band.classes, band.name).toContain(tones.open)
    expect(isCalm(bands[3])).toBe(true)
    expect(bands[4].classes).toContain(tones.violet)
  })

  it('frames the hero photo in glass', () => {
    expect(html.slice(0, html.indexOf('id="plans"'))).toMatch(new RegExp(`<div class="${home.glass} ${styles.glassFrame}" data-glass=""><img\\b`))
  })

  // The recommended plan keeps its violet fill: under the glass's white its white text would not hold.
  it('makes every plan a glass key card but the recommended one, still the one violet card, and every add-on a key card', () => {
    const plans = html.slice(html.indexOf('id="plans"'), html.indexOf('id="add-ons"'))
    const keyCard = `<li class="${home.glass} ${home.keyCard}" data-glass="">`
    expect([...plans.matchAll(/<li class="[^"]*"[^>]*>/g)].map(([tag]) => tag)).toEqual(
      PLANS.map((plan) => ('recommended' in plan ? `<li class="${pricing.recommended}">` : keyCard)),
    )
    const addOns = html.slice(html.indexOf('id="add-ons"'), html.indexOf('id="pricing-faq"'))
    expect([...addOns.matchAll(/<li\b[^>]*>/g)].map(([tag]) => tag)).toEqual(ADD_ONS.items.map(() => keyCard))
  })
})

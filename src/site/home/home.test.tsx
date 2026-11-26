/**
 * Evemos's homepage v2, rendered with `renderToStaticMarkup` as the visitor
 * gets it: the organiser's year in order, one `h1`, the launch film, the
 * clickable hall plan, every stage with its list, and none of the lines the page must never say.
 *
 * ★ E-39: the page markets the whole product, built and planned. What it must
 * still never say: a named competitor (E-28), the literal phrase "all-in-one
 * platform" (brand book), "AI", or a price other than the starting price in
 * `src/site/offer.ts` (a placeholder until #241, E-14). Demo names are English.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/(site)/page'
import { PRODUCT_NAME } from '@/lib/product'
import { FOUNDER } from '@/site/founder'
import { HOME_SECTION_IDS, links } from '@/site/links'
import { STARTING_PRICE, startingPriceLine } from '@/site/offer'
import { withoutHidden } from '@/site/testing/markup'
import primitives from '@/site/ui/primitives.module.css'

import { AUDIENCE, DEMO_BOOTHS, FAQ, FLOOR_PLAN, HERO, JOURNEY, WHY } from './content'
import { Hero } from './Hero'
import { FIRST_BOOTH } from './FloorPlanPreview'
import { HERO_VIDEO } from './HeroVideo'
import home from './home.module.css'

/** With the product name swapped for a stand-in, a typed-in "Evemos" is the only way the real name could still reach the markup. */
vi.mock('@/lib/product', () => ({ PRODUCT_NAME: 'Stand-in Name' }))

const html = renderToStaticMarkup(<HomePage />)

/** The homepage's stylesheet without its comments, so a rule in a comment proves nothing. */
const HOME_CSS = readFileSync(join(process.cwd(), 'src', 'site', 'home', 'home.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** Every `@media <query> { … }` block, whole, nested rules included (one level deep). */
const mediaBlocks = (css: string, query: string): string[] =>
  [...css.matchAll(new RegExp(`@media ${query.replace(/[()]/g, '\\$&')} \\{(?:[^{}]|\\{[^{}]*\\})*\\}`, 'g'))].map(([block]) => block)

/** The rules that apply only when motion is welcome, and the stylesheet without them. */
const MOTION_CSS = mediaBlocks(HOME_CSS, '(prefers-reduced-motion: no-preference)').join('\n')
const STILL_CSS = mediaBlocks(HOME_CSS, '(prefers-reduced-motion: no-preference)').reduce((css, block) => css.replace(block, ''), HOME_CSS)

/** Visible text: tags and React's `<!-- -->` separators removed, entities decoded, no space left before a full stop or comma. */
const textOf = (markup: string): string =>
  markup
    .replace(/<!-- -->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/ ([.,])/g, '$1')
    .trim()

const text = textOf(html)

const sectionOrder = (markup: string): string[] =>
  [...markup.matchAll(/<section\b[^>]*\baria-labelledby="([^"]+)"/g)].map(([, id]) => id)

const headings = (markup: string, level: number): string[] =>
  [...markup.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)</h${level}>`, 'g'))].map(([, inner]) => textOf(inner))

/** The one element of a tag whose opening tag matches, outer HTML. Not for nested same-name tags. */
const element = (markup: string, open: RegExp, tag: string): string => {
  const start = markup.search(open)
  if (start === -1) throw new Error(`no element matching ${open}`)
  return markup.slice(start, markup.indexOf(`</${tag}>`, start) + tag.length + 3)
}

/**
 * The page as a screen reader meets it: the demo pictures left out. The app's own dashboard in "Sell the floor"
 * (F-192c) brings its own sections and headings, hidden with the window; they are the app's, not the page's.
 */
const visible = withoutHidden(html)

/** A section's tones (`primitives.module.css` classes), by its id. */
const toneOf = (id: string): string[] => /<section\b[^>]*class="([^"]+)"/.exec(sectionById(id))?.[1].split(' ') ?? []

/** A whole `<section>` by id, up to the next of the page's sections: an app section inside a hidden picture does not end it. */
const sectionById = (id: string): string => {
  const start = html.search(new RegExp(`<section\\b[^>]*\\bid="${id}"`))
  if (start === -1) throw new Error(`no section #${id}`)
  const next = html.slice(start + 1).search(/<section\b[^>]*\bid="/)
  return html.slice(start, next === -1 ? undefined : start + 1 + next)
}

describe('homepage structure', () => {
  it("follows the organiser's year: hero, the hall plan, the other four stages, everyone, why, questions, demo", () => {
    expect(sectionOrder(visible)).toEqual([
      'hero-title',
      'plan-title',
      'before-title',
      'exhibitors-title',
      'show-day-title',
      'after-title',
      'who-title',
      'why-title',
      'faq-title',
      'demo-title',
    ])
  })

  it('has one h1, "Run the whole show." (E-94), and every other section heading is an h2', () => {
    expect(headings(html, 1)).toEqual(['Run the whole show.'])
    expect(headings(visible, 2).length).toBe(sectionOrder(visible).length - 1)
  })

  it('every section with an id is switched on in HOME_SECTION_IDS', () => {
    const ids = [...html.matchAll(/<section\b[^>]*\sid="([^"]+)"/g)].map(([, id]) => id)
    expect(ids.filter((id) => !HOME_SECTION_IDS.has(id))).toEqual([])
  })

  // Q4 = B (E-131, E-136): a section with a product picture or a card on a photo shows the washes behind its glass.
  it('puts the hall, the app window, the exhibitors’ requests and show day on the washes, as the hero', () => {
    for (const id of [JOURNEY.floorPlan.id, JOURNEY.before.id, JOURNEY.exhibitors.id, JOURNEY.showDay.id]) {
      expect(toneOf(id), id).toContain(primitives.open)
    }
  })

  // F-192c: long reading stays calm, paper and raised in turn as in the demo; the close is the violet band.
  it('sets after the show, everyone, why and the questions on calm bands in turn, and the close on violet', () => {
    const calm = [JOURNEY.after.id, 'who', 'why', 'faq'].map((id) => toneOf(id).find((tone) => tone === primitives.paper || tone === primitives.raised))
    expect(calm).toEqual([primitives.raised, primitives.paper, primitives.raised, primitives.paper])
    expect(toneOf('demo')).toContain(primitives.violet)
  })

  it('ends on "Run the whole show from one place."', () => {
    expect(headings(sectionById('demo'), 2)).toEqual(['Run the whole show from one place.'])
  })
})

describe('hero', () => {
  it('leads with the headline, the one-liner right under it, the lead, the starting price, "Book a demo" and "See how it works", with no label over the title', () => {
    expect(textOf(renderToStaticMarkup(<Hero />))).toBe(
      [
        'Run the whole show.',
        'The operating system for organisers who run the whole show.',
        'Booth sales, exhibitors, registration, badges and the doors on show day, in one system built by an organiser.',
        startingPriceLine(STARTING_PRICE),
        'Book a demo',
        'See how it works',
      ]
        .filter(Boolean)
        .join(' '),
    )
  })

  // No `autoplay` (F-192b AC 11): the browser would start it before script could ask about reduced motion; script plays it.
  it('shows the launch film in the hero: muted, looping and inline, poster first, with a description for screen readers', () => {
    const hero = element(html, /<section\b[^>]*aria-labelledby="hero-title"/, 'section')
    const video = element(hero, /<video\b/, 'video')

    expect(video).not.toMatch(/\bautoplay/i)
    expect(video).toMatch(/\bmuted=""/)
    expect(video).toMatch(/\bloop=""/)
    expect(video).toMatch(/\bplaysInline=""|\bplaysinline=""/i)
    expect(video).toContain(`poster="${HERO_VIDEO.poster}"`)
    expect(video).toContain('aria-hidden="true"')
    expect(hero).toContain(`<figcaption class="visually-hidden">`)
  })

  // F-192b AC 10: the headline's words rise one by one, and the h1 still reads as its words, with no stand-in name.
  it('draws the headline word by word, each rising in turn, its words still the heading’s text', () => {
    const title = element(html, /<h1\b/, 'h1')
    const words = [...title.matchAll(/<span class="[^"]+"><span style="--word:(\d+)">([^<]+)<\/span><\/span>/g)]

    expect(words.map(([, , word]) => word).join(' ')).toBe(HERO.title)
    expect(words.map(([, step]) => Number(step))).toEqual(HERO.title.split(' ').map((_, index) => index))
    expect(title).not.toContain('aria-label')
    expect(title).not.toContain('data-reveal')
  })

  it('rises the words by CSS alone, a stagger apart, and never with reduced motion', () => {
    expect(MOTION_CSS).toMatch(
      /\.heroWord > span \{\s*animation: word-rise var\(--ex-t-enter\) var\(--ex-out\) both;\s*animation-delay: calc\(var\(--word\) \* var\(--ex-stagger\)\);/,
    )
    expect(STILL_CSS).not.toMatch(/animation: word-rise/)
  })

  it('sits on the washes, with the film in a glass frame that its entrance does not blur (F-192b)', () => {
    const hero = element(html, /<section\b[^>]*aria-labelledby="hero-title"/, 'section')
    const film = element(hero, /<figure\b/, 'figure')

    expect(/<section\b[^>]*class="([^"]+)"/.exec(hero)?.[1].split(' ')).toContain(primitives.open)
    expect(/<figure\b[^>]*class="([^"]+)"/.exec(film)?.[1].split(' ')).toContain(home.glass)
    expect(film).toMatch(/<figure\b[^>]*\bdata-glass=""/)
  })

  // F-192b AC 11: a phone loads the 540p cut, about 1 MB, instead of the 1080p files.
  it('offers a phone the 540p cut first, then the 1080p WebM and MP4, at the film’s own size', () => {
    const video = element(element(html, /<section\b[^>]*aria-labelledby="hero-title"/, 'section'), /<video\b/, 'video')
    const sources = [...video.matchAll(/<source\b([^>]*?)\s*\/?>/g)].map(([, attributes]) => attributes.trim())

    expect(sources).toEqual([
      `src="${HERO_VIDEO.phone}" type="video/mp4" media="(max-width: 760px)"`,
      `src="${HERO_VIDEO.webm}" type="video/webm"`,
      `src="${HERO_VIDEO.mp4}" type="video/mp4"`,
    ])
    expect(video).toContain('width="1920"')
    expect(video).toContain('height="1080"')
  })

  it('serves the film from the site itself, and the files exist', () => {
    for (const path of Object.values(HERO_VIDEO)) {
      expect(path).toMatch(/^\/site\/video\//)
      expect(() => readFileSync(join(process.cwd(), 'public', path))).not.toThrow()
    }
  })

  it('says no stand counts and never "software" (E-87)', () => {
    const hero = element(html, /<section\b[^>]*aria-labelledby="hero-title"/, 'section')
    expect(HERO.lead).not.toMatch(/\d/)
    expect(text).not.toMatch(/stands to \d/i)
    expect(textOf(hero)).not.toMatch(/\bsoftware\b/i)
  })
})

describe('everyone at your show', () => {
  it('has one card per group, six of them, each titled with an h3', () => {
    const section = sectionById('who')
    expect(headings(section, 3)).toEqual(AUDIENCE.groups.map((group) => group.title))
    expect(AUDIENCE.groups).toHaveLength(6)
  })
})

describe('the five stages', () => {
  it.each(Object.values(JOURNEY).map((stage) => [stage.id, stage] as const))('#%s has its title, lead and every item, and no step number', (id, stage) => {
    const section = sectionById(id)
    const sectionText = textOf(section)

    expect(sectionText).not.toMatch(/\b0\d\b/)
    expect(headings(withoutHidden(section), 2)).toEqual([stage.title])
    for (const item of stage.items) expect(sectionText).toContain(item.title)
  })

  it('gives exhibitor communication the most room: the most items, and the requests preview', () => {
    const counts = Object.values(JOURNEY).map((stage) => stage.items.length)
    expect(JOURNEY.exhibitors.items.length).toBe(Math.max(...counts))
    expect(textOf(sectionById('exhibitors'))).toContain('Exhibitor requests')
  })

  it('carries at least six photos and clips, and every photo has alt text that describes it', () => {
    const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag)
    const videos = [...html.matchAll(/<video\b/g)]
    expect(images.length + videos.length).toBeGreaterThanOrEqual(6)
    expect(images.filter((tag) => !/\balt="[^"]{20,}"/.test(tag))).toEqual([])
  })

  // F-192f: the column is 1280px since F-192a; a photo asked for at the old 1200px column's 560 or 600px was fetched
  // too small. Each one sits beside a section's copy: the journey's, the why's and the four door photos.
  it('asks for every photo at half the 1280px column', () => {
    const sizes = [...html.matchAll(/<img\b[^>]*\bsizes="([^"]*)"/g)].map(([, value]) => value)
    expect(sizes.length).toBeGreaterThanOrEqual(6)
    expect(new Set(sizes)).toEqual(new Set(['(min-width: 1376px) 624px, (min-width: 1024px) 50vw, 100vw']))
  })
})

describe('"Sell the floor": the app window (F-192c, Q1 = A)', () => {
  const section = sectionById(JOURNEY.before.id)
  const appWindow = element(section, /<div class="[^"]*" aria-hidden="true" data-ui="" data-glass="">/, 'section')

  it('sets the copy beside a window that runs off the right edge', () => {
    expect(section).toContain(`<div class="${home.journey} ${home.journeyBleed}">`)
    expect(appWindow).toMatch(new RegExp(`^<div class="${home.glass} `))
  })

  it('opens on the app’s own dashboard, the sales board behind the Sales tab', () => {
    expect([...section.matchAll(/<span( data-picked="")?>(Overview|Sales)<\/span>/g)].map(([, picked, label]) => [label, Boolean(picked)])).toEqual([
      ['Overview', true],
      ['Sales', false],
    ])
    expect(appWindow).not.toMatch(/<button\b/)
    expect(section).toMatch(/<section class="[^"]*" aria-label="Key numbers">/)
    expect(section).toMatch(/inert="" hidden=""><ul aria-hidden="true" class="[^"]*" data-ui="">/)
    expect(textOf(section)).toContain('Demo data')
  })

  // The search risk F-192 names: the app's headings stay in the markup, hidden with the window.
  it('carries the app’s headings only inside the hidden window, and its ring opens the hall above', () => {
    expect(headings(section, 2)).toEqual([JOURNEY.before.title, 'Registrations · last 8 weeks', 'Booths taken', 'Needs you'])
    expect(headings(withoutHidden(section), 2)).toEqual([JOURNEY.before.title])
    expect([...section.matchAll(/\bhref="([^"]*)"/g)].map(([, href]) => href)).toEqual([`#${JOURNEY.floorPlan.id}`])
  })
})

describe('exhibitor requests on the build-up photo (F-192b AC 13)', () => {
  const visual = sectionById('exhibitors')
  const card = element(visual, /<div aria-hidden="true" class="[^"]*"[^>]*\bdata-glass=""/, 'ul')
  const rows = [...card.matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g)].map(([, attributes, inner]) => ({ attributes, inner }))
  /** A row's statuses: the one it shows first, and the one it ends on. */
  const statuses = (inner: string): string[] => [...inner.matchAll(/<span class="[^"]*chip[^"]*">([^<]+)<\/span>/g)].map(([, word]) => word)

  it('lies as a glass card over the build-up photo’s lower edge, hidden from screen readers', () => {
    const photo = visual.search(/<img\b[^>]*alt="During build-up, an exhibitor points/)
    expect(photo).toBeGreaterThan(-1)
    expect(visual.indexOf(card)).toBeGreaterThan(photo)
    expect(/class="([^"]+)"/.exec(card)?.[1].split(' ')).toEqual(expect.arrayContaining([home.glass, home.float, home.requests]))
    expect(STILL_CSS).toMatch(/\.requests \{[^}]*--glass-fill: var\(--site-photo-card\);[^}]*margin: calc\(-96px - var\(--evemos-space-4\)\) 0 0 auto;/)
  })

  it('has one row that turns from "In review" to "Approved", and every other row keeps its status', () => {
    const changing = rows.filter(({ attributes }) => attributes.includes('data-changes=""'))
    expect(changing).toHaveLength(1)
    expect(textOf(changing[0].inner)).toContain('Back-wall graphic')
    expect(statuses(changing[0].inner)).toEqual(['In review', 'Approved'])
    expect(rows.filter(({ attributes }) => !attributes.includes('data-changes')).map(({ inner }) => statuses(inner))).toEqual([['Paid'], ['Approved'], ['Due soon'], ['Confirmed']])
  })

  it('with motion, rows rise in turn and the status changes once, 2.6 s after the card shows, held until then', () => {
    expect(MOTION_CSS).toMatch(/:global\(\.reveal-ready\) \.requestRow \{\s*animation: request-in [^;]+;\s*animation-delay: calc\(var\(--ex-stagger\) \* 3 \+ var\(--row\) \* var\(--ex-stagger\) \/ 2\);/)
    expect(MOTION_CSS).toMatch(/:global\(\.reveal-ready\) \.statusBefore \{\s*animation: status-out var\(--ex-t-base\) var\(--ex-out\) 2\.6s backwards;/)
    expect(MOTION_CSS).toMatch(/:global\(\.reveal-ready\) \.statusAfter \{\s*animation: status-in var\(--ex-t-base\) var\(--ex-out\) 2\.6s backwards;/)
    expect(MOTION_CSS).toMatch(/:global\(\.reveal-ready\) \.requestRow\[data-changes\]::after \{\s*animation: request-flash 1\.6s ease-out 2\.6s;/)
    expect(MOTION_CSS).toMatch(/\[data-reveal\]:not\(\[data-revealed\]\) \.statusChange > \* \{\s*animation-play-state: paused;/)
    // Once: nothing on the card repeats.
    expect(MOTION_CSS).not.toMatch(/(?:request-in|status-out|status-in|request-flash)[^;]*infinite/)
  })

  it('with reduced motion, or without script, shows every row at once with its final status', () => {
    expect(STILL_CSS).toMatch(/\.statusBefore \{\s*opacity: 0;\s*\}/)
    expect(STILL_CSS).not.toMatch(/\.statusAfter \{[^}]*opacity: 0/)
    expect(STILL_CSS).not.toMatch(/animation: (?:request-in|status-out|status-in|request-flash)/)
  })
})

describe('hall plan', () => {
  const figure = element(html, /<figure\b[^>]*\bid="floor-plan"/, 'figure')
  // The app's stand buttons carry their state; the 2D / 3D switch's two buttons are not booths.
  const booths = [...figure.matchAll(/<button\b[^>]*\bdata-state="[^"]*"[^>]*>/g)].map(([tag]) => tag)

  it('is the first stage under the hero, as the #floor-plan anchor', () => {
    expect(sectionById('plan')).toContain('id="floor-plan"')
  })

  // F-192b AC 12: the app's own floor plan (HallCanvas) draws the demo hall.
  it('is drawn by the app’s floor plan: the ten booths in the three states, one open, and the stage nobody books', () => {
    expect(booths).toHaveLength(DEMO_BOOTHS.length + 1)
    expect(booths.every((tag) => /type="button"/.test(tag) && /aria-label="[^"]+"/.test(tag))).toBe(true)
    expect(booths.filter((tag) => tag.includes('aria-pressed="true"'))).toHaveLength(1)
    const states = booths.map((tag) => /data-state="([^"]+)"/.exec(tag)?.[1])
    expect(new Set(states)).toEqual(new Set(['sold', 'reserved', 'free', 'blocked']))
    expect(booths.filter((tag) => /\bdisabled=""/.test(tag))).toEqual([expect.stringContaining('aria-label="Main stage, 400 seats, not for sale"')])
  })

  it('opens in 3D in a glass window, with the 2D / 3D switch over it', () => {
    expect(/<figure\b[^>]*class="([^"]+)"/.exec(figure)?.[1].split(' ')).toContain(home.glass)
    expect(figure).toMatch(/<figure\b[^>]*\bdata-glass=""/)
    expect(figure).toContain('data-view="3d"')
    expect(figure).toMatch(new RegExp(`<div[^>]*role="group" aria-label="${FLOOR_PLAN.views.label}"`))
    expect([...figure.matchAll(/<button type="button" aria-pressed="(true|false)">([^<]+)<\/button>/g)].map(([, pressed, word]) => [word, pressed])).toEqual([
      [FLOOR_PLAN.views.flat, 'false'],
      [FLOOR_PLAN.views.angled, 'true'],
    ])
  })

  it(`opens ${FIRST_BOOTH} first, and its card is a live region with an English contact`, () => {
    expect(booths.find((tag) => tag.includes('aria-pressed="true"'))).toContain(FIRST_BOOTH)
    const card = element(figure, /<div\b[^>]*aria-live="polite"/, 'dl')
    expect(textOf(card)).toContain(`${FLOOR_PLAN.card.booth} ${FIRST_BOOTH}`)
    expect(textOf(card)).toContain('Emma Clarke')
  })

  it('says it is demo data, in a visible caption', () => {
    expect(textOf(element(figure, /<figcaption\b/, 'figcaption'))).toBe(FLOOR_PLAN.caption)
    expect(FLOOR_PLAN.caption).toMatch(/^Demo data\. /)
  })
})

describe('why and questions', () => {
  // F-192c: the photo settles from 1.08 into its frame once its block shows, only with motion welcome and script running.
  it('lets the organiser’s photo settle into its frame as it shows, and never with reduced motion', () => {
    expect(sectionById('why')).toMatch(new RegExp(`<div class="${home.whyPhoto}"><img\\b[^>]*alt="${WHY.photoAlt}"`))
    expect(MOTION_CSS).toMatch(/:global\(\.reveal-ready\) \[data-reveal\]:not\(\[data-revealed\]\) \.whyPhoto img \{\s*transform: scale\(1\.08\);/)
    expect(STILL_CSS).not.toMatch(/scale\(1\.08\)/)
  })

  it('says who built it without naming him or the show, and links to the story on /about (Daniel, 2026-10-20)', () => {
    const why = sectionById('why')
    expect(textOf(why)).not.toContain(FOUNDER.name)
    expect(textOf(why)).not.toContain(FOUNDER.show)
    expect(why).toContain(`href="${links.about}"`)
    expect(WHY.quote).toContain(PRODUCT_NAME)
  })

  it('answers every question as a definition list', () => {
    const faq = sectionById('faq')
    expect(faq.match(/<dt\b/g)).toHaveLength(FAQ.items.length)
    expect(faq.match(/<dd\b/g)).toHaveLength(FAQ.items.length)
  })

  it('answers what the small-fair test left open, in seven questions or fewer (#217, #220)', () => {
    const questions = [...sectionById('faq').matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>/g)].map(([, question]) => textOf(question))
    expect(questions).toEqual(expect.arrayContaining(['Can I sign up and try it now?', 'Can a booth be sold twice?', 'Can we leave and take our data with us?', 'Is it in Croatian?']))
    expect(questions.length).toBeLessThanOrEqual(7)
  })
})

describe('what the homepage never says', () => {
  it.each(['all-in-one platform', 'AI-powered', 'revolutionary', 'seamless', 'streamline'])('"%s"', (phrase) => {
    expect(text.toLowerCase()).not.toContain(phrase.toLowerCase())
  })

  it('names no competitor (E-28)', () => {
    expect(text).not.toMatch(/run\.events|Cvent|Swapcard|ExpoFP|Map Your Show|a2z|vFairs|Grip|Bizzabo|Eventbrite/i)
  })

  it('gives the starting price from offer.ts in the cost answer, or none, and no other figure of ours (#216)', () => {
    const line = startingPriceLine(STARTING_PRICE)
    const cost = FAQ.items.find((item) => item.question === 'What does it cost?')
    if (line) expect(cost?.answer).toContain(line)
    // The hall plan's booth prices are the demo show's, not ours: it is left out, like the hidden pictures.
    const demoPlan = element(html, /<figure\b[^>]*\bid="floor-plan"/, 'figure')
    const figures = [...textOf(withoutHidden(html.replace(demoPlan, ''))).matchAll(/€\s?\d[\d,.]*|\d[\d,.]*\s?€/g)].map(([figure]) => figure)
    expect(new Set(figures)).toEqual(new Set(line ? [line.match(/€[\d,.]+/)?.[0]] : []))
    expect(text).not.toMatch(/per year|\/year/i)
  })

  it('uses English demo names only', () => {
    expect(text).not.toMatch(/Horvat|Kovač|Babić|Novak/)
  })

  it('never types the product name; it comes from product.ts', () => {
    expect(PRODUCT_NAME).toBe('Stand-in Name')
    // The visible text; the domain (demo@evemos.events) and file names are not the product name.
    expect(text).not.toMatch(/evemos(?!\.events)/i)
    // Nor the old name, domain included (F-046a).
    expect(text).not.toMatch(/expono/i)
  })
})

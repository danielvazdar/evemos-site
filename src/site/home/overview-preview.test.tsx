// @vitest-environment happy-dom
/**
 * The dashboard on the site (F-192c AC 17–19): the app's own Overview
 * pieces drawn from the demo fixture in a glass window, hidden from screen
 * readers and inert; no link on the homepage into the app; and the pieces'
 * entrances held until the block around the window is revealed, run in a DOM
 * with the site's `RevealOnScroll`, its observer and the motion query stubbed.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import HomePage from '@/app/(site)/page'
import { APP_PAGE_PATHS } from '@/lib/app-routes'
import { RevealOnScroll } from '@/site/ui/RevealOnScroll'

import { DEMO_DATA } from './content'
import { DEMO_EVENT, DEMO_OVERVIEW } from './demo-overview'
import { OverviewPreview } from './OverviewPreview'
import styles from './OverviewPreview.module.css'

vi.mock('next/navigation', () => ({ usePathname: () => '/' }))

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const dom = (html: string): HTMLElement => {
  const host = document.createElement('div')
  host.innerHTML = html
  return host
}

const preview = dom(renderToStaticMarkup(<OverviewPreview floorPlanHref="#plan" />))
const window_ = preview.firstElementChild as HTMLElement
const dashboard = preview.querySelector(`.${styles.dashboard}`) as HTMLElement

/** Words inside a line: no break after them. Every other element ends a piece read on its own. */
const IN_LINE = new Set(['A', 'B', 'SMALL', 'STRONG', 'EM'])

/** Text as it reads, one piece after another, spaces folded: a rolling figure's own text is its value, once. */
const textOf = (element: Element): string => {
  const copy = element.cloneNode(true) as Element
  copy.querySelectorAll('*').forEach((part) => {
    if (!IN_LINE.has(part.tagName)) part.append(' ')
  })
  return (copy.textContent ?? '').replace(/\s+/g, ' ').trim()
}

/** The app piece whose heading reads `title`. */
const pieceTitled = (title: string): HTMLElement =>
  [...preview.querySelectorAll('section')].find((section) => section.querySelector('h2')?.textContent === title) as HTMLElement

describe('the dashboard window (AC 17)', () => {
  it('is a glass window hidden from screen readers, its dashboard inert, and says "Demo data"', () => {
    expect(window_.getAttribute('aria-hidden')).toBe('true')
    expect(window_.hasAttribute('data-glass')).toBe(true)
    expect(dashboard.hasAttribute('inert')).toBe(true)
    expect(dashboard.getAttribute('aria-hidden')).toBe('true')
    expect(textOf(window_)).toContain(DEMO_DATA)
    expect(textOf(window_)).toContain(`${DEMO_EVENT.name} ${DEMO_EVENT.dates}`)
  })

  it('draws the app’s four tiles from the fixture', () => {
    const tiles = [...preview.querySelectorAll('section[aria-label="Key numbers"] h3')].map((heading) => heading.parentElement as HTMLElement)
    expect(tiles.map((tile) => tile.querySelector('h3')?.textContent)).toEqual([
      'Exhibitors confirmed',
      'Visitors registered',
      'Invoiced',
      'Days until doors open',
    ])
    const [exhibitors, visitors, invoiced, days] = tiles.map(textOf)
    expect(exhibitors).toContain('131 of 156 registered')
    expect(exhibitors).toContain('+6 this week · 9 waiting for approval')
    expect(visitors).toContain('4,812')
    expect(visitors).toContain('+292 this week')
    expect(invoiced).toContain('€612k')
    expect(invoiced).toContain('€471k paid · €38k overdue')
    expect(days).toContain('151')
    expect(days).toContain('Next: Stand designs due, Mon 15 Feb')
  })

  it('draws the registrations chart, the booths ring and Needs you, each the app’s own', () => {
    const chart = pieceTitled('Registrations · last 8 weeks')
    expect(chart.querySelectorAll('svg')).toHaveLength(2)
    expect(textOf(chart)).toContain('6 this week')
    expect(textOf(chart)).toContain('292 this week')

    const ring = pieceTitled('Booths taken')
    expect(textOf(ring)).toContain('148 of 170')
    expect(textOf(ring)).toContain('131 sold · 17 reserved')

    const needs = pieceTitled('Needs you')
    expect([...needs.querySelectorAll('li b')].map((title) => title.textContent)).toEqual(DEMO_OVERVIEW.tasks.map((task) => task.title))
  })

  it('links only where it is told to: the ring to the page’s own hall', () => {
    expect([...preview.querySelectorAll('a')].map((link) => link.getAttribute('href'))).toEqual(['#plan'])
    expect(renderToStaticMarkup(<OverviewPreview floorPlanHref="/product/floor-plan" />)).toContain('href="/product/floor-plan"')
  })
})

describe('no link into the app (AC 18)', () => {
  it('no href on the homepage opens an app screen', () => {
    const hrefs = [...renderToStaticMarkup(<HomePage />).matchAll(/\bhref="([^"]*)"/g)].map(([, href]) => href)
    const intoTheApp = (href: string) => APP_PAGE_PATHS.some((path) => href === path || href.startsWith(`${path}/`) || href.startsWith(`${path}?`))
    expect(hrefs.length).toBeGreaterThan(3)
    expect(hrefs.filter(intoTheApp)).toEqual([])
  })
})

/** The stylesheet without its comments. */
const CSS = readFileSync(join(process.cwd(), 'src', 'site', 'home', 'OverviewPreview.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** The stylesheet's motion block: the rule that keeps the pieces still until script runs, and the one that holds them. */
const MOTION = /@media \(prefers-reduced-motion: no-preference\) \{((?:[^{}]|\{[^{}]*\})*)\}/.exec(CSS)?.[1] ?? ''
const STILL = /([^{}]+)\{\s*animation: none;\s*\}/.exec(MOTION)?.[1].trim() ?? ''
const HOLD = /([^{}]+)\{\s*animation-play-state: paused;\s*\}/.exec(MOTION)?.[1].trim() ?? ''

/** The hold's selector as the DOM reads it: `:global(x)` as written, the module's own classes by their built names. */
const domSelector = (selector: string): string => {
  const globals: string[] = []
  return selector
    .replace(/:global\(([^)]+)\)/g, (_, inner: string) => `@${globals.push(inner) - 1}@`)
    .replace(/\.([A-Za-z][\w-]*)/g, (_, name: string) => `.${styles[name]}`)
    .replace(/@(\d+)@/g, (_, at: string) => globals[Number(at)])
}

describe('the pieces move where they are seen (AC 19)', () => {
  type Entry = Pick<IntersectionObserverEntry, 'isIntersecting' | 'target'>
  let host: HTMLElement
  let root: Root
  let report: ((entries: Entry[]) => void) | null

  const stubMotion = (reduce: boolean) =>
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query === '(prefers-reduced-motion: reduce)' }))

  /** The window in a section's revealed block, as on the homepage, with the site's reveal running once script does. */
  const mount = (script = true) =>
    act(() => {
      root.render(
        <>
          <main>
            <section>
              <div>
                <div data-reveal="3" id="block">
                  <OverviewPreview floorPlanHref="#plan" />
                </div>
              </div>
            </section>
          </main>
          {script ? <RevealOnScroll /> : null}
        </>,
      )
    })

  const still = () => document.querySelectorAll(domSelector(STILL))
  const held = () => document.querySelectorAll(domSelector(HOLD))
  const block = () => document.getElementById('block') as HTMLElement

  beforeEach(() => {
    report = null
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: (entries: Entry[]) => void) {
          report = callback
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
    host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
  })

  afterEach(() => {
    act(() => root.unmount())
    host.remove()
    document.documentElement.classList.remove('reveal-ready')
    vi.unstubAllGlobals()
  })

  it('keeps every piece still until the reveal starts, then holds it, and only with motion welcome', () => {
    expect(STILL).toMatch(/^html:not\(:global\(\.reveal-ready\)\) \.dashboard \*$/)
    expect(HOLD).toMatch(/^:global\(\.reveal-ready\) \[data-reveal\]:not\(\[data-revealed\]\) \.dashboard \*$/)
    // Outside the motion block nothing is stopped or held: with reduced motion site.scss stops everything anyway.
    expect(CSS.replace(MOTION, '')).not.toMatch(/animation-play-state|animation: none/)
  })

  // The app's pieces play as soon as they are drawn: before script runs they would play unseen, off screen.
  it('shows every piece final before script runs, and starts none of them', () => {
    stubMotion(false)
    mount(false)
    const figures = block().querySelectorAll('[style*="--d"]')
    expect(figures.length).toBeGreaterThan(10)
    expect([...figures].every((figure) => [...still()].includes(figure))).toBe(true)
    expect(held()).toHaveLength(0)
  })

  it('holds the count-ups, the lines and the ring until the block is revealed, then lets them run', () => {
    stubMotion(false)
    mount()
    const figures = block().querySelectorAll('[style*="--d"]')
    expect(still()).toHaveLength(0)
    expect([...figures].every((figure) => [...held()].includes(figure))).toBe(true)
    expect([...held()].some((part) => part.matches('path[pathLength="1"]'))).toBe(true)
    expect([...held()].some((part) => part.matches('circle[style*="--o"]'))).toBe(true)

    act(() => report?.([{ isIntersecting: true, target: block() }]))
    expect(block().hasAttribute('data-revealed')).toBe(true)
    expect(held()).toHaveLength(0)
  })

  it('holds nothing with reduced motion: every figure and chart shows final at once', () => {
    stubMotion(true)
    mount()
    expect(document.documentElement.classList.contains('reveal-ready')).toBe(false)
    expect(held()).toHaveLength(0)
    // site.scss stops every animation then, so each piece shows its end state.
    const site = readFileSync(join(process.cwd(), 'src', 'site', 'styles', 'site.scss'), 'utf8')
    expect(site).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\*,\s*\*::before,\s*\*::after \{\s*transition: none !important;\s*animation: none !important;/)
  })
})

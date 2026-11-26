// @vitest-environment happy-dom
/**
 * The homepage's hall in a DOM (F-192b AC 12): the app's own `HallCanvas`
 * drawing the ten demo booths and the stage, opened in 3D, switched by 2D /
 * 3D, a tapped booth opening its card with the live site's rows, the legend's
 * counts, the caption, and, without script, H7-B04's card (the static markup).
 * The hall builds up only once a quarter of it is on screen. The frame's width
 * comes from a stubbed ResizeObserver, as a browser would measure it.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { DEMO_BOOTHS, FLOOR_PLAN } from './content'
import { ENTRANCE_SHARE, FIRST_BOOTH, FloorPlanPreview } from './FloorPlanPreview'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

type ObserverCallback = (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting' | 'intersectionRatio'>>) => void

class MeasuredObserver {
  constructor(private readonly report: ResizeObserverCallback) {}
  observe(target: Element) {
    this.report([{ target, contentRect: { width: 1200 } } as unknown as ResizeObserverEntry], this as unknown as ResizeObserver)
  }
  unobserve() {}
  disconnect() {}
}

let host: HTMLElement
let root: Root
let seen: { callback: ObserverCallback; options?: IntersectionObserverInit } | null

const stubMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query === '(prefers-reduced-motion: reduce)', addEventListener() {}, removeEventListener() {} }))

const mount = () =>
  act(() => {
    root.render(<FloorPlanPreview />)
  })

const onScreen = (intersectionRatio: number) =>
  act(() => {
    seen?.callback([{ isIntersecting: intersectionRatio > 0, intersectionRatio }])
  })

const stage = () => host.querySelector<HTMLElement>('[data-view]')!
const booth = (code: string) => host.querySelector<HTMLButtonElement>(`button[aria-label^="${code},"]`)!
const switchTo = (word: string) => [...host.querySelectorAll<HTMLButtonElement>('[role="group"] button')].find((button) => button.textContent === word)!
const card = () => host.querySelector<HTMLElement>('[aria-live="polite"]')!
const rowsOf = (element: Element) => [...element.querySelectorAll('dt')].map((term) => [term.textContent, term.nextElementSibling?.textContent])
const legend = () => [...host.querySelectorAll('ul li')].map((item) => item.textContent?.replace(/\s+/g, ' ').trim())

const click = (element: HTMLElement) =>
  act(() => {
    element.click()
  })

beforeEach(() => {
  vi.useFakeTimers()
  seen = null
  vi.stubGlobal('ResizeObserver', MeasuredObserver)
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
        seen = { callback, options }
      }
      observe() {}
      disconnect() {
        seen = null
      }
    },
  )
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

/** Visible text: React's `<!-- -->` separators and tags removed, spaces folded. */
const textOf = (markup: string): string =>
  markup.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

describe('the hall without script (the static markup)', () => {
  const markup = renderToStaticMarkup(<FloorPlanPreview />)

  it(`shows ${FIRST_BOOTH}'s card, in a polite live region, with the hall in 3D`, () => {
    const card = /<div\b[^>]*aria-live="polite"[^>]*>([\s\S]*?)<\/dl>/.exec(markup)?.[1] ?? ''
    expect(markup).toMatch(new RegExp(`<button\\b[^>]*aria-pressed="true"[^>]*aria-label="${FIRST_BOOTH}, Vela Systems, sold"`))
    expect(textOf(card)).toBe(`Booth ${FIRST_BOOTH} Sold Exhibitor Vela Systems Size 36 m² island Price €6,300 Staff badges 4 Contact Emma Clarke`)
    expect(markup).toContain('data-view="3d"')
    expect(markup).toMatch(/<button type="button" aria-pressed="true">3D<\/button>/)
  })

  // Held only where script runs with motion welcome: without either, the hall stands built.
  it('holds the hall out of sight, and out of a pointer’s reach, only under reveal-ready and with motion welcome (the stylesheet)', () => {
    const css = readFileSync(join(process.cwd(), 'src', 'site', 'home', 'FloorPlanPreview.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    const hidden = [...css.matchAll(/([^{}]+)\{\s*opacity: 0;[^{}]*\}/g)].map(([, selector]) => selector.trim())
    expect(hidden).toEqual([':global(.reveal-ready) .hall[data-held] [data-view]'])
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: no-preference\) \{\s*:global\(\.reveal-ready\) \.hall\[data-held\] \[data-view\] \{\s*opacity: 0;\s*pointer-events: none;\s*\}\s*:global\(\.reveal-ready\) \.hall\[data-held\] \[data-view\] \[data-raised\]::before \{\s*pointer-events: none;\s*\}\s*\}/,
    )
  })
})

// F-192b review round 1: the site's touch target, as its other buttons.
it('draws each of 2D and 3D at least 44 px tall (the stylesheet)', () => {
  const css = readFileSync(join(process.cwd(), 'src', 'site', 'ui', 'PillSwitch.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
  expect(/(?:^|\n)\.switch > :not\(\.pill\) \{([^}]*)\}/.exec(css)?.[1]).toMatch(/\bmin-height: 44px;/)
})

describe('the hall drawn by the app (F-192b AC 12)', () => {
  it('draws the ten demo booths and the stage, which takes no press', () => {
    stubMotion(false)
    mount()
    for (const { code } of DEMO_BOOTHS) expect(booth(code).disabled).toBe(false)
    expect(booth('Main stage').getAttribute('aria-label')).toBe('Main stage, 400 seats, not for sale')
    expect(booth('Main stage').disabled).toBe(true)
    expect(host.querySelectorAll('button[data-state]')).toHaveLength(DEMO_BOOTHS.length + 1)
  })

  it('keys its legend Sold 6, Reserved 2, Free 2, with no "Not for sale", and says it is demo data', () => {
    stubMotion(false)
    mount()
    expect(legend()).toEqual(['Sold 6', 'Reserved 2', 'Free 2'])
    expect(host.querySelector('figcaption')?.textContent).toBe(FLOOR_PLAN.caption)
    expect(host.textContent).toContain(FLOOR_PLAN.sold(6, 10))
  })

  it('opens in 3D, and 2D and 3D switch it', () => {
    stubMotion(false)
    mount()
    expect(stage().dataset.view).toBe('3d')
    expect(switchTo('3D').getAttribute('aria-pressed')).toBe('true')

    click(switchTo('2D'))
    expect(stage().dataset.view).toBe('2d')
    expect(switchTo('2D').getAttribute('aria-pressed')).toBe('true')
    expect(switchTo('3D').getAttribute('aria-pressed')).toBe('false')

    click(switchTo('3D'))
    expect(stage().dataset.view).toBe('3d')
  })

  it('opens a tapped booth’s card with the live site’s rows, and the next press elsewhere moves it', () => {
    stubMotion(false)
    mount()
    expect(rowsOf(card())).toEqual([
      ['Exhibitor', 'Vela Systems'],
      ['Size', '36 m² island'],
      ['Price', '€6,300'],
      ['Staff badges', '4'],
      ['Contact', 'Emma Clarke'],
    ])

    click(booth('H7-A03'))
    expect(booth('H7-A03').getAttribute('aria-pressed')).toBe('true')
    expect(card().textContent).toContain('Booth H7-A03')
    expect(card().textContent).toContain('Reserved')
    expect(rowsOf(card())).toEqual([
      ['Exhibitor', 'Bluefield Foods'],
      ['Size', '90 m² double'],
      ['Price', '€17,100'],
      ['Held until', '14 November'],
    ])

    click(booth('H7-B03'))
    expect(rowsOf(card())).toEqual([
      ['Exhibitor', 'Nobody yet'],
      ['Size', '24 m² corner'],
      ['Price', '€4,600'],
    ])
  })

  it('keeps the open booth’s card open on a second press', () => {
    stubMotion(false)
    mount()
    click(booth(FIRST_BOOTH))
    expect(booth(FIRST_BOOTH).getAttribute('aria-pressed')).toBe('true')
    expect(card().textContent).toContain(`Booth ${FIRST_BOOTH}`)
  })
})

describe('the hall builds up where it is seen', () => {
  it('holds the hall until a quarter of it is on screen, then draws it afresh, so its entrance plays then', () => {
    stubMotion(false)
    mount()
    const held = host.querySelector('[data-held]')
    expect(held).not.toBeNull()
    expect(seen?.options?.threshold).toBe(ENTRANCE_SHARE)
    const before = stage()

    onScreen(0.1)
    expect(host.querySelector('[data-held]')).not.toBeNull()
    expect(stage()).toBe(before)

    act(() => vi.advanceTimersByTime(5000))
    expect(before.hasAttribute('data-enter')).toBe(false)

    onScreen(ENTRANCE_SHARE)
    expect(host.querySelector('[data-held]')).toBeNull()
    expect(stage()).not.toBe(before)
    expect(stage().hasAttribute('data-enter')).toBe(true)
    // Once: the observer is done.
    expect(seen).toBeNull()
  })

  it('keeps the visitor’s booth and view through it', () => {
    stubMotion(false)
    mount()
    click(booth('H7-A01'))
    click(switchTo('2D'))
    onScreen(1)
    expect(booth('H7-A01').getAttribute('aria-pressed')).toBe('true')
    expect(stage().dataset.view).toBe('2d')
  })

  // F-192b review round 1: a held booth is out of sight but still in the Tab order.
  it('builds at once when a keyboard reaches a held booth, and keeps the focus on that booth', () => {
    stubMotion(false)
    mount()
    const before = booth('H7-B01')
    act(() => before.focus())

    expect(host.querySelector('[data-held]')).toBeNull()
    expect(booth('H7-B01')).not.toBe(before)
    expect(document.activeElement).toBe(booth('H7-B01'))
    expect(stage().hasAttribute('data-enter')).toBe(true)
    // Built for good: the observer is done, and moving on draws nothing again.
    expect(seen).toBeNull()
    const built = stage()
    act(() => booth('H7-B02').focus())
    expect(stage()).toBe(built)
    expect(document.activeElement).toBe(booth('H7-B02'))
  })

  it('with reduced motion never draws it again: no observer waits, and its hold does not apply there', () => {
    stubMotion(true)
    mount()
    const before = stage()
    expect(seen).toBeNull()
    act(() => vi.advanceTimersByTime(5000))
    act(() => booth('H7-B01').focus())
    expect(stage()).toBe(before)
    expect(document.activeElement).toBe(booth('H7-B01'))
  })
})

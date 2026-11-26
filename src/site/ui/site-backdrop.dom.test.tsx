// @vitest-environment happy-dom
/**
 * The site's backdrop in a DOM (F-192a AC 4): four hidden washes, the pauses
 * for scrolling and a hidden tab, and the device check after load. Frames
 * come from a stubbed `requestAnimationFrame` that fires every `frameMs` on
 * fake timers, so a frame rate is a number the test picks, as the app's
 * `backdrop.dom.test.tsx` does. The drift itself is CSS, read at the bottom.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SiteBackdrop } from './SiteBackdrop'
import { WASH_CYCLE_MS, washClock } from './wash-clock'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const html = document.documentElement
const page = { readyState: 'complete' as DocumentReadyState, hidden: false, reduced: false, frameMs: 1000 / 60 }
let host: HTMLElement
let root: Root

beforeEach(() => {
  vi.useFakeTimers()
  Object.assign(page, { readyState: 'complete', hidden: false, reduced: false, frameMs: 1000 / 60 })
  Object.defineProperty(document, 'readyState', { configurable: true, get: () => page.readyState })
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => page.hidden })
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') && page.reduced, addEventListener() {}, removeEventListener() {} }))
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    // As a browser does: no frame while the tab is hidden; a pending one fires once it is visible again.
    const fire = () => (page.hidden ? setTimeout(fire, page.frameMs) : callback(performance.now()))
    return setTimeout(fire, page.frameMs) as unknown as number
  })
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id))
  delete html.dataset.wash
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  delete html.dataset.wash
})

const mount = (clock = '0s') => act(() => root.render(<SiteBackdrop clock={clock} />))
const wait = (ms: number) => act(() => vi.advanceTimersByTime(ms))
const backdrop = () => host.querySelector('div') as HTMLDivElement
const paused = () => backdrop().hasAttribute('data-paused')
const scroll = (target: EventTarget = document) => act(() => void target.dispatchEvent(new Event('scroll')))
const setHidden = (hidden: boolean) =>
  act(() => {
    page.hidden = hidden
    document.dispatchEvent(new Event('visibilitychange'))
  })

describe('SiteBackdrop markup', () => {
  it('draws one hidden layer of four washes, and starts the drift at the clock it is given', () => {
    mount('-12.5s')
    expect(host.children).toHaveLength(1)
    expect(backdrop().className).toBe('site-backdrop')
    expect(backdrop().getAttribute('aria-hidden')).toBe('true')
    expect(backdrop().innerHTML).toBe('<i></i><i></i><i></i><i></i>')
    expect(backdrop().style.getPropertyValue('--wash-clock')).toBe('-12.5s')
  })
})

describe('the drift pauses while anything scrolls and in a hidden tab', () => {
  it('pauses on a scroll and resumes 300 ms after the last one', () => {
    mount()
    expect(paused()).toBe(false)
    scroll()
    expect(paused()).toBe(true)
    wait(200)
    scroll()
    wait(200)
    expect(paused()).toBe(true)
    wait(100)
    expect(paused()).toBe(false)
  })

  it('pauses for an inner scroll too, caught on its way down', () => {
    mount()
    const list = document.createElement('div')
    document.body.append(list)
    scroll(list)
    expect(paused()).toBe(true)
    list.remove()
  })

  it('pauses in a hidden tab and resumes when it shows again', () => {
    mount()
    setHidden(true)
    expect(paused()).toBe(true)
    setHidden(false)
    expect(paused()).toBe(false)
  })

  it('stops listening once unmounted', () => {
    mount()
    const layer = backdrop()
    act(() => root.unmount())
    document.dispatchEvent(new Event('scroll'))
    expect(layer.hasAttribute('data-paused')).toBe(false)
    root = createRoot(host)
  })
})

describe('the device check after load', () => {
  const settle = () => wait(1000 + 2000 + 200)

  it('leaves a device that keeps up moving, and gives the washes their opacity back', () => {
    mount()
    settle()
    expect(html.dataset.wash).toBeUndefined()
    expect(backdrop().style.opacity).toBe('')
  })

  it('stops the drift on a device under 45 frames a second', () => {
    page.frameMs = 1000 / 30
    mount()
    settle()
    expect(html.dataset.wash).toBe('still')
  })

  it('redraws on every counted frame while it runs', () => {
    mount()
    wait(1000 + 100)
    const seen = new Set<string>()
    for (let step = 0; step < 6; step += 1) {
      wait(page.frameMs)
      seen.add(backdrop().style.opacity)
    }
    expect([...seen].sort()).toEqual(['0.999', '1'])
  })

  it('starts 1 s after load when the page is still loading', () => {
    page.readyState = 'loading'
    page.frameMs = 1000 / 30
    mount()
    settle()
    expect(html.dataset.wash).toBeUndefined()
    act(() => void window.dispatchEvent(new Event('load')))
    settle()
    expect(html.dataset.wash).toBe('still')
  })

  it('counts only visible, unscrolled time', () => {
    page.frameMs = 1000 / 30
    mount()
    wait(1000)
    // A long scroll: nothing counted, so no verdict yet.
    for (let step = 0; step < 30; step += 1) {
      scroll()
      wait(100)
    }
    expect(html.dataset.wash).toBeUndefined()
    wait(300 + 2000 + 200)
    expect(html.dataset.wash).toBe('still')
  })

  it('runs no check with reduced motion, or once Save-Data has settled it', () => {
    page.frameMs = 1000 / 30
    page.reduced = true
    mount()
    settle()
    expect(html.dataset.wash).toBeUndefined()
    act(() => root.unmount())
    root = createRoot(host)

    page.reduced = false
    html.dataset.wash = 'still'
    mount()
    settle()
    expect(backdrop().style.opacity).toBe('')
    expect(html.dataset.wash).toBe('still')
  })
})

/** site.scss without its comments. */
const SITE = readFileSync(join(process.cwd(), 'src', 'site', 'styles', 'site.scss'), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/^\s*\/\/.*$/gm, '')

/** The declarations of the first rule in `css` whose selector list holds `selector`. */
const ruleBody = (css: string, selector: string): string =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(([, selectors]) => selectors.split(',').some((one) => one.trim() === selector))?.[2] ?? ''

/** Every `@media <query> { … }` block's body, joined, one level of nested rules deep. */
const mediaBody = (query: string): string => {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return [...SITE.matchAll(new RegExp(`@media ${escaped}\\s*\\{((?:[^{}]|\\{[^{}]*\\})*)\\}`, 'g'))].map(([, body]) => body).join('\n')
}

describe('the washes in site.scss', () => {
  const layer = ruleBody(SITE, '.site-backdrop')
  const wash = ruleBody(SITE, '.site-backdrop i')
  const nth = [1, 2, 3, 4].map((n) => ruleBody(SITE, `.site-backdrop i:nth-child(${n})`))

  it('lies fixed behind everything and takes no pointer', () => {
    expect(layer).toMatch(/position: fixed;/)
    expect(layer).toMatch(/inset: 0;/)
    expect(layer).toMatch(/z-index: -1;/)
    expect(layer).toMatch(/pointer-events: none;/)
  })

  it('draws the four washes at full strength, in the app’s wash colours, violet, soft violet, coral and yellow', () => {
    expect(wash).not.toMatch(/opacity/)
    expect(layer).not.toMatch(/opacity/)
    expect(nth.map((rule) => /--wash: var\((--ex-wash-[a-z-]+)\);/.exec(rule)?.[1])).toEqual([
      '--ex-wash-violet',
      '--ex-wash-violet-soft',
      '--ex-wash-coral',
      '--ex-wash-yellow',
    ])
  })

  /** Each wash's loop in seconds and its steps, from its rule. */
  const loops = nth.map((rule) => {
    const found = /--wash-loop: (\d+)s;[\s\S]*?--wash-steps: (\d+);/.exec(rule)
    return found ? { seconds: Number(found[1]), steps: Number(found[2]) } : undefined
  })

  it('drifts on 30, 34, 38 and 26 s loops, stepped to 8 a second (E-110)', () => {
    expect(loops.map((loop) => loop?.seconds)).toEqual([30, 34, 38, 26])
    for (const loop of loops) expect(loop && loop.steps / loop.seconds).toBe(8)
    expect(wash).toMatch(
      /animation: var\(--wash-drift\) var\(--wash-loop\) steps\(var\(--wash-steps\)\) var\(--wash-clock, 0s\) infinite alternate;/,
    )
  })

  it('moves only transform in its keyframes', () => {
    const keyframes = [...SITE.matchAll(/@keyframes (site-wash-\d)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g)]
    expect(keyframes.map(([, name]) => name)).toEqual(['site-wash-1', 'site-wash-2', 'site-wash-3', 'site-wash-4'])
    for (const [, , body] of keyframes) {
      const properties = [...body.matchAll(/([a-z-]+)\s*:/g)].map(([, property]) => property)
      expect(new Set(properties)).toEqual(new Set(['transform']))
    }
  })

  it('comes back to its start once a cycle: WASH_CYCLE_MS is the loops’ least common multiple', () => {
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const cycle = loops.map((loop) => (loop?.seconds ?? 0) * 2 * 1000).reduce((a, b) => (a * b) / gcd(a, b))
    expect(WASH_CYCLE_MS).toBe(cycle)
    expect(washClock(WASH_CYCLE_MS * 3 + 12_500)).toBe('-12.5s')
    expect(washClock(WASH_CYCLE_MS * 2)).toBe('0s')
  })

  it('stands still while paused, once the device check or Save-Data says still, and under reduced motion', () => {
    expect(ruleBody(SITE, '.site-backdrop[data-paused] i')).toMatch(/animation-play-state: paused;/)
    expect(ruleBody(SITE, "html[data-wash='still'] .site-backdrop i")).toMatch(/animation-play-state: paused;/)
    expect(ruleBody(mediaBody('(prefers-reduced-motion: reduce)'), '.site-backdrop i')).toMatch(/animation: none;/)
  })
})

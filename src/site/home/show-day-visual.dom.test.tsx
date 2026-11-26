// @vitest-environment happy-dom
/**
 * Show day in a DOM (F-192b AC 14, Q6 = A): the four door photos with their
 * live alt texts and the "Checked in today" card on them. With motion welcome
 * and on screen, the photos change and arrivals keep coming, and the one pause
 * button stops both until Play; off screen or in a hidden tab nothing changes.
 * With reduced motion nothing changes by itself and no button shows. Timers
 * are faked; the observer and the motion query are stubbed.
 */
import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ARRIVAL_MS, ARRIVALS, countsAfter, PHOTO_MS } from './ShowDayMotion'
import { DOOR_PHOTOS, ShowDayVisual } from './ShowDayVisual'
import styles from './ShowDayVisual.module.css'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

type ObserverCallback = (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void

let host: HTMLElement
let root: Root
let observer: ObserverCallback | null
let tabHidden: boolean

const stubMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query === '(prefers-reduced-motion: reduce)' }))

const mount = () =>
  act(() => {
    root.render(<ShowDayVisual />)
  })

const onScreen = (isIntersecting: boolean) =>
  act(() => {
    observer?.([{ isIntersecting }])
  })

const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

/** The alt text of the photo showing. */
const showing = () => host.querySelector('[data-on] img')?.getAttribute('alt')
/** The card's big figure, as its rolling number's own text holds it. */
const total = () => host.querySelector(`.${styles.arrivalsTotal} > span > span`)?.textContent
const button = () => host.querySelector('button')

const press = () =>
  act(() => {
    button()?.click()
  })

beforeEach(() => {
  vi.useFakeTimers()
  observer = null
  tabHidden = false
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => tabHidden })
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: ObserverCallback) {
        observer = callback
      }
      observe() {}
      disconnect() {
        observer = null
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

describe('the show-day photos and card', () => {
  const markup = renderToStaticMarkup(<ShowDayVisual />)

  it('shows the four door photos with their live alt texts, the first one showing', () => {
    const alts = [...markup.matchAll(/<img\b[^>]*\balt="([^"]+)"/g)].map(([, alt]) => alt.replace(/&#x27;/g, "'"))
    expect(alts).toEqual(DOOR_PHOTOS.map(({ alt }) => alt))
    expect(markup.match(/\bdata-on=""/g)).toHaveLength(1)
    expect(markup).toMatch(new RegExp(`<div class="[^"]+" data-on=""><img\\b[^>]*\\balt="${DOOR_PHOTOS[0].alt}"`))
  })

  it('lays the "Checked in today" card on them, hidden from screen readers, glass, with the groups and "Demo data"', () => {
    const card = /<div aria-hidden="true" class="([^"]+)" data-ui="true" data-glass="">([\s\S]*)<\/div><\/div>$/.exec(markup)
    expect(card).not.toBeNull()
    const text = card![2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
    expect(text).toContain('Checked in today')
    expect(text).toContain('Live')
    for (const { group } of ARRIVALS) expect(text).toContain(group)
    expect(text).toContain('Demo data')
  })

  it('draws no pause button without script', () => {
    expect(markup).not.toContain('<button')
  })
})

describe('with motion welcome (Q6 = A)', () => {
  it('changes the photo and adds arrivals while on screen', () => {
    stubMotion(false)
    mount()
    onScreen(true)
    expect(showing()).toBe(DOOR_PHOTOS[0].alt)
    expect(total()).toBe('1,204')

    wait(ARRIVAL_MS)
    expect(total()).toBe('1,205')
    wait(PHOTO_MS - ARRIVAL_MS)
    expect(showing()).toBe(DOOR_PHOTOS[1].alt)
    wait(PHOTO_MS * 3)
    expect(showing()).toBe(DOOR_PHOTOS[0].alt)
  })

  it('changes nothing off screen or in a hidden tab', () => {
    stubMotion(false)
    mount()
    wait(PHOTO_MS * 2)
    expect(showing()).toBe(DOOR_PHOTOS[0].alt)
    expect(total()).toBe('1,204')

    onScreen(true)
    tabHidden = true
    wait(PHOTO_MS * 2)
    expect(showing()).toBe(DOOR_PHOTOS[0].alt)
    expect(total()).toBe('1,204')
  })

  it('stops both with Pause, and goes on with Play', () => {
    stubMotion(false)
    mount()
    onScreen(true)
    expect(button()?.textContent).toBe('Pause arrivals')
    expect(host.firstElementChild?.hasAttribute('data-live')).toBe(true)

    press()
    expect(button()?.textContent).toBe('Play arrivals')
    expect(host.firstElementChild?.hasAttribute('data-live')).toBe(false)
    wait(PHOTO_MS * 2)
    expect(showing()).toBe(DOOR_PHOTOS[0].alt)
    expect(total()).toBe('1,204')

    press()
    expect(button()?.textContent).toBe('Pause arrivals')
    wait(PHOTO_MS)
    expect(showing()).toBe(DOOR_PHOTOS[1].alt)
  })

  it('never runs a bar past its track, however long the page stays open', () => {
    stubMotion(false)
    mount()
    onScreen(true)
    wait(ARRIVAL_MS * 300)
    const shares = [...host.querySelectorAll<HTMLElement>('i[style]')].map((bar) => Number(bar.style.getPropertyValue('--share')))
    expect(shares).toHaveLength(ARRIVALS.length)
    expect(shares[0]).toBe(1)
    expect(Math.max(...shares)).toBeLessThanOrEqual(1)
  })

  it('keeps the button outside the hidden card, so it can be reached and heard', () => {
    stubMotion(false)
    mount()
    expect(button()?.closest('[aria-hidden="true"]')).toBeNull()
  })
})

describe('with reduced motion', () => {
  it('changes nothing by itself and shows no button', () => {
    stubMotion(true)
    mount()
    onScreen(true)
    wait(PHOTO_MS * 4)
    expect(showing()).toBe(DOOR_PHOTOS[0].alt)
    expect(total()).toBe('1,204')
    expect(button()).toBeNull()
    expect(host.firstElementChild?.hasAttribute('data-live')).toBe(false)
  })
})

describe('arrivals', () => {
  it('add up to the figure over them, and about four in five are visitors', () => {
    expect(countsAfter(0)).toEqual(ARRIVALS.map(({ count }) => count))
    const after = countsAfter(100)
    expect(after.reduce((sum, count) => sum + count, 0)).toBe(1204 + 100)
    expect(after[0] - ARRIVALS[0].count).toBe(80)
  })
})

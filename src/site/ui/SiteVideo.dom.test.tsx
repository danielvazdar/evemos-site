// @vitest-environment happy-dom
/**
 * SiteVideo in a DOM (F-118 AC 3, 4): the markup is muted, inline, poster
 * first and never autoplays; reduced motion never plays it; it plays once
 * only when half of it is on screen; a refused `play()` leaves the poster.
 */
import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SITE_VIDEOS, SiteVideo } from './SiteVideo'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

type ObserverCallback = (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting' | 'intersectionRatio'>>) => void

let host: HTMLElement
let root: Root
let observed: { callback: ObserverCallback; options?: IntersectionObserverInit } | null
let play: ReturnType<typeof vi.fn>

const stubMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query === '(prefers-reduced-motion: reduce)' }))

const mount = () =>
  act(() => {
    root.render(<SiteVideo video="a-hall" />)
  })

const scroll = (isIntersecting: boolean, intersectionRatio: number) =>
  act(() => {
    observed?.callback([{ isIntersecting, intersectionRatio }])
  })

const video = () => host.querySelector('video') as HTMLVideoElement

beforeEach(() => {
  observed = null
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
        observed = { callback, options }
      }
      observe() {}
      // A disconnected observer reports nothing more, as in a browser.
      disconnect() {
        observed = null
      }
    },
  )
  play = vi.fn(() => Promise.resolve())
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play as unknown as HTMLMediaElement['play'])
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('SiteVideo', () => {
  it('is muted, inline, poster first, hidden from screen readers, and never autoplays or shows controls', () => {
    stubMotion(false)
    mount()
    const element = video()
    expect(element.muted).toBe(true)
    expect(element.hasAttribute('playsinline')).toBe(true)
    expect(element.getAttribute('preload')).toBe('none')
    expect(element.getAttribute('poster')).toBe(SITE_VIDEOS['a-hall'].poster)
    expect(element.getAttribute('aria-hidden')).toBe('true')
    expect(element.hasAttribute('autoplay')).toBe(false)
    expect(element.hasAttribute('controls')).toBe(false)
    expect(element.hasAttribute('loop')).toBe(false)
    expect(element.querySelector('source')?.getAttribute('src')).toBe('/site/video/busy-trade-fair-hall.mp4')
    expect(host.querySelector('figcaption.visually-hidden')?.textContent).toBe(SITE_VIDEOS['a-hall'].description)
  })

  it('never plays when reduced motion is requested', () => {
    stubMotion(true)
    mount()
    scroll(true, 1)
    expect(play).not.toHaveBeenCalled()
  })

  it('does not play while it is off screen or less than half visible', () => {
    stubMotion(false)
    mount()
    expect(observed?.options?.threshold).toBe(0.5)
    scroll(false, 0)
    scroll(true, 0.2)
    expect(play).not.toHaveBeenCalled()
  })

  it('plays once when half of it is on screen', () => {
    stubMotion(false)
    mount()
    scroll(true, 0.5)
    scroll(true, 1)
    expect(play).toHaveBeenCalledTimes(1)
  })

  it('keeps the poster and throws nothing when play() is refused', async () => {
    stubMotion(false)
    play.mockImplementation(() => Promise.reject(new DOMException('Not allowed', 'NotAllowedError')))
    mount()
    await act(async () => {
      observed?.callback([{ isIntersecting: true, intersectionRatio: 0.6 }])
    })
    expect(play).toHaveBeenCalledTimes(1)
    expect(video().getAttribute('poster')).toBe(SITE_VIDEOS['a-hall'].poster)
  })
})

// @vitest-environment happy-dom
/**
 * The hero film in a DOM (F-192b AC 11, Q6 = A): the markup never autoplays,
 * so reduced motion never sees it move; with motion welcome it plays while on
 * screen and pauses off it, and its one small button pauses it until pressed
 * again. A browser that refuses to play leaves the button offering Play.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { HERO } from './content'
import { HERO_VIDEO, HeroVideo, PHONE_FILM_MEDIA } from './HeroVideo'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

type ObserverCallback = (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void

let host: HTMLElement
let root: Root
let observer: ObserverCallback | null
let play: ReturnType<typeof vi.fn>
let pause: ReturnType<typeof vi.fn>

const stubMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query === '(prefers-reduced-motion: reduce)' }))

const mount = () =>
  act(() => {
    root.render(<HeroVideo />)
  })

const onScreen = (isIntersecting: boolean) =>
  act(() => {
    observer?.([{ isIntersecting }])
  })

const video = () => host.querySelector('video') as HTMLVideoElement
const button = () => host.querySelector('button')

const press = () =>
  act(() => {
    button()?.click()
  })

beforeEach(() => {
  observer = null
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: ObserverCallback) {
        observer = callback
      }
      observe() {}
      // A disconnected observer reports nothing more, as in a browser.
      disconnect() {
        observer = null
      }
    },
  )
  play = vi.fn(() => Promise.resolve())
  pause = vi.fn()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(play as unknown as HTMLMediaElement['play'])
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(pause as unknown as HTMLMediaElement['pause'])
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

describe('the hero film', () => {
  it('never autoplays from its markup; a phone gets the 540p cut first, poster first', () => {
    stubMotion(false)
    mount()
    const element = video()
    expect(element.hasAttribute('autoplay')).toBe(false)
    expect(element.muted).toBe(true)
    expect(element.hasAttribute('loop')).toBe(true)
    expect(element.hasAttribute('playsinline')).toBe(true)
    expect(element.getAttribute('preload')).toBe('metadata')
    expect(element.getAttribute('poster')).toBe(HERO_VIDEO.poster)
    expect([...element.querySelectorAll('source')].map((source) => [source.getAttribute('src'), source.getAttribute('media')])).toEqual([
      [HERO_VIDEO.phone, PHONE_FILM_MEDIA],
      [HERO_VIDEO.webm, null],
      [HERO_VIDEO.mp4, null],
    ])
    expect(host.querySelector('figcaption.visually-hidden')?.textContent).toBe(HERO.videoDescription)
  })

  it('with reduced motion never plays and shows no button: the poster is the still', () => {
    stubMotion(true)
    mount()
    onScreen(true)
    expect(play).not.toHaveBeenCalled()
    expect(observer).toBeNull()
    expect(button()).toBeNull()
  })

  it('plays while on screen and pauses off it', () => {
    stubMotion(false)
    mount()
    onScreen(true)
    expect(play).toHaveBeenCalledTimes(1)
    onScreen(false)
    expect(pause).toHaveBeenCalledTimes(1)
    onScreen(true)
    expect(play).toHaveBeenCalledTimes(2)
  })

  it('stops with Pause, stays stopped on screen, and starts again with Play', () => {
    stubMotion(false)
    mount()
    onScreen(true)
    expect(button()?.textContent).toBe('Pause film')

    press()
    expect(pause).toHaveBeenCalledTimes(1)
    expect(button()?.textContent).toBe('Play film')
    // Stopped by the visitor: no observer is left to start it again.
    onScreen(true)
    expect(play).toHaveBeenCalledTimes(1)

    // Played from the press itself, then kept going by the observer again.
    press()
    expect(play).toHaveBeenCalledTimes(2)
    expect(button()?.textContent).toBe('Pause film')
    onScreen(false)
    expect(pause).toHaveBeenCalledTimes(2)
  })

  it('offers Play when the browser refuses to play it, and a press plays it', async () => {
    stubMotion(false)
    play.mockImplementationOnce(() => Promise.reject(new DOMException('Not allowed', 'NotAllowedError')))
    mount()
    await act(async () => {
      observer?.([{ isIntersecting: true }])
    })
    expect(button()?.textContent).toBe('Play film')

    press()
    expect(play).toHaveBeenCalledTimes(2)
    expect(button()?.textContent).toBe('Pause film')
  })

  // F-192b review round 1: the site's touch target, as its other buttons.
  it('draws its pause button 44 px square (the stylesheet)', () => {
    const css = readFileSync(join(process.cwd(), 'src', 'site', 'home', 'home.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    const pause = /(?:^|\n)\.pause \{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(pause).toMatch(/\bwidth: 44px;/)
    expect(pause).toMatch(/\bheight: 44px;/)
  })

  it('keeps offering Pause when scrolling away cuts a play short', async () => {
    stubMotion(false)
    play.mockImplementationOnce(() => Promise.reject(new DOMException('Interrupted by pause()', 'AbortError')))
    mount()
    await act(async () => {
      observer?.([{ isIntersecting: true }])
    })
    expect(button()?.textContent).toBe('Pause film')
  })
})

'use client'

import React, { useEffect, useRef } from 'react'

import { SCROLL_SETTLE_MS, SELF_CHECK, selfCheckKeepsUp } from '@/app/(app)/_components/wash-motion'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

interface SiteBackdropProps {
  /** `washClock` (wash-clock.ts) at the server's render: the same in the HTML and on hydration. */
  clock: string
}

/**
 * The site's backdrop (DESIGN.md "Website", E-119, Q5 = A): the approved
 * demo's four soft washes, fixed behind every page, at full strength, drifting
 * by CSS (site.scss `.site-backdrop`) from where the server's clock says the
 * last page left them (`clock`). Drawn once by the site's layout; this adds
 * what the stylesheet cannot know.
 *
 * - Pauses. Any scroll, the page's or an inner one's (captured on the
 *   document), sets `data-paused` until 300 ms after the last one: a scroll
 *   already re-frosts every glass surface, so a drift step on top would cost
 *   double. A hidden tab sets it too. Written on the element, no React state,
 *   so nothing re-renders.
 * - The device check, the app's (`wash-motion.ts`). From 1 s after `load`,
 *   with motion welcome and nothing settled yet (`data-wash`, which the server
 *   sets for Save-Data), it counts frames over 2 s of visible, unscrolled
 *   time, stepping the washes' opacity between 1 and 0.999 on each so every
 *   glass surface redraws as it does while a page scrolls. Under 45 a second
 *   it sets `<html data-wash="still">` and the washes stop where they are.
 *   Nothing is stored; the next page checks again.
 *
 * No switch and no cookie: the site has no account menu.
 */
export function SiteBackdrop({ clock }: SiteBackdropProps) {
  const ref = useRef<HTMLDivElement>(null)
  const clockStyle = { '--wash-clock': clock } as React.CSSProperties

  useEffect(() => {
    const backdrop = ref.current
    if (!backdrop) return
    let scrolling = false
    let settle: ReturnType<typeof setTimeout> | undefined
    const sync = () => backdrop.toggleAttribute('data-paused', scrolling || document.hidden)
    const onScroll = () => {
      clearTimeout(settle)
      settle = setTimeout(() => {
        scrolling = false
        sync()
      }, SCROLL_SETTLE_MS)
      if (scrolling) return
      scrolling = true
      sync()
    }
    sync()
    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    document.addEventListener('visibilitychange', sync)
    return () => {
      clearTimeout(settle)
      document.removeEventListener('scroll', onScroll, { capture: true })
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  useEffect(() => {
    const backdrop = ref.current
    const html = document.documentElement
    if (!backdrop || html.dataset.wash !== undefined || window.matchMedia(REDUCED_MOTION).matches) return
    const release = () => backdrop.style.removeProperty('opacity')
    let start: ReturnType<typeof setTimeout> | undefined
    let frame = 0
    let frames = 0
    let ms = 0
    // The first interval after a pause is not counted: it spans the pause.
    let last: number | null = null
    const onVisibility = () => {
      last = null
    }
    const tick = (now: number) => {
      frame = 0
      if (backdrop.hasAttribute('data-paused') || document.hidden) {
        last = null
      } else {
        if (last !== null) {
          frames += 1
          ms += now - last
        }
        last = now
        backdrop.style.opacity = backdrop.style.opacity === '0.999' ? '1' : '0.999'
      }
      if (ms < SELF_CHECK.sampleMs) {
        frame = requestAnimationFrame(tick)
        return
      }
      release()
      if (!selfCheckKeepsUp(frames, ms)) html.dataset.wash = 'still'
    }
    const begin = () => {
      start = setTimeout(() => {
        frame = requestAnimationFrame(tick)
      }, SELF_CHECK.delayMs)
    }
    document.addEventListener('visibilitychange', onVisibility)
    if (document.readyState === 'complete') begin()
    else window.addEventListener('load', begin, { once: true })
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('load', begin)
      clearTimeout(start)
      cancelAnimationFrame(frame)
      release()
    }
  }, [])

  return (
    <div ref={ref} className="site-backdrop" aria-hidden="true" style={clockStyle}>
      <i />
      <i />
      <i />
      <i />
    </div>
  )
}

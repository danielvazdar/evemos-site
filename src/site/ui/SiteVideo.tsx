'use client'

import React, { useEffect, useRef } from 'react'

import styles from './SiteVideo.module.css'

/**
 * The short, silent hall animations on the marketing pages (F-118). Files
 * live in `public/site/video/` and are served from the site's own origin
 * (`media-src 'self'`, so the CSP needs nothing new).
 *
 * ★ POSTER FIRST, PLAYED ONCE. `preload="none"` means only the poster loads
 * until the clip is half on screen; then it plays once and holds its last
 * frame (Daniel, 2026-11-06). No `loop`, so no pause button is needed: five
 * seconds is inside WCAG 2.2.2's limit. Reduced motion never plays it, and a
 * refused `play()` (data saver, autoplay policy) leaves the poster as a still.
 * The video is decoration with a description: screen readers hear the
 * figcaption, never the video (the same pattern as `home/HeroVideo.tsx`).
 */
export const SITE_VIDEOS = {
  'a-hall': {
    mp4: '/site/video/busy-trade-fair-hall.mp4',
    poster: '/site/video/busy-trade-fair-hall.jpg',
    width: 1280,
    height: 720,
    description: 'A busy trade fair hall seen from a balcony. Visitors with lanyards walk the aisles and stop at blue and yellow stands.',
  },
  'a-hall-model': {
    mp4: '/site/video/exhibition-hall-scale-model.mp4',
    poster: '/site/video/exhibition-hall-scale-model.jpg',
    width: 1280,
    height: 720,
    description: 'A white scale model of an exhibition hall turns slowly, showing rows of blue and yellow stands with small figures in the aisles.',
  },
  'a-expo-floor': {
    mp4: '/site/video/conference-expo-floor.mp4',
    poster: '/site/video/conference-expo-floor.jpg',
    width: 1280,
    height: 720,
    description: 'Visitors talk at a stand with a coffee counter while people walk past and an audience listens to a talk on the stage behind them.',
  },
} as const

export type SiteVideoKey = keyof typeof SITE_VIDEOS

/** How much of the clip must be on screen before it plays. */
const VISIBLE_SHARE = 0.5

interface SiteVideoProps {
  video: SiteVideoKey
  /** Cropped to a 21:9 band instead of the full 16:9 frame: for a clip that runs the width of the page. */
  wide?: boolean
}

export function SiteVideo({ video, wide = false }: SiteVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const clip = SITE_VIDEOS[video]

  useEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= VISIBLE_SHARE)) return
        // Played once: the observer's job is done, and the last frame stays.
        observer.disconnect()
        element.play().catch(() => {
          // Refused (data saver, autoplay policy): the poster stays as the still.
        })
      },
      { threshold: VISIBLE_SHARE },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <figure className={styles.figure}>
      <video
        ref={ref}
        className={wide ? `${styles.video} ${styles.wide}` : styles.video}
        muted
        playsInline
        preload="none"
        poster={clip.poster}
        width={clip.width}
        height={clip.height}
        aria-hidden="true"
      >
        <source src={clip.mp4} type="video/mp4" />
      </video>
      <figcaption className="visually-hidden">{clip.description}</figcaption>
    </figure>
  )
}

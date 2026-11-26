'use client'

import React, { useEffect, useRef, useState } from 'react'

import { HERO } from './content'
import styles from './home.module.css'
import { PauseButton, type PauseLabels } from './PauseButton'

/**
 * The launch film (marketing/video/launch-v5, web cut) in the hero: muted,
 * looping, inline, with its poster as the first paint, in a glass frame on the
 * washes (F-192b). Files live in `public/site/video/` and are served from the
 * site's own origin (`media-src 'self'`). A phone's window takes the 540p cut
 * first, about 1 MB where the 1080p files are 3 to 3.5 MB. The film is
 * decoration with a description: screen readers hear `HERO.videoDescription`,
 * never the video itself.
 *
 * ★ SCRIPT PLAYS IT, AND ONLY WITH MOTION WELCOME. The markup has no
 * `autoplay`: a browser would start the film before any script could ask
 * about reduced motion. With motion welcome it plays while it is on screen and
 * pauses off it, and a small Pause button stops it until pressed again (E-131,
 * Q6 = A: it loops past WCAG 2.2.2's five seconds). With reduced motion, or
 * without script, the poster stands as a still and no button shows. A browser
 * that refuses to play (Low Power Mode, a data saver) leaves the poster and
 * the button offering Play: a press, which a browser lets play, starts it.
 */
export const HERO_VIDEO = {
  phone: '/site/video/event-management-operating-system-film-540p.mp4',
  webm: '/site/video/event-management-operating-system-film-1080p.webm',
  mp4: '/site/video/event-management-operating-system-film-1080p.mp4',
  poster: '/site/video/event-management-operating-system-film.jpg',
} as const

/** The windows that get the 540p cut: a phone's (the approved demo's query). */
export const PHONE_FILM_MEDIA = '(max-width: 760px)'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** Its pause button's names: the page has a second one, on show day. */
export const FILM_CONTROL: PauseLabels = { pause: 'Pause film', play: 'Play film' }

/** Plays the film; a refusal (`NotAllowedError`) calls `onRefused`, a play cut short by a pause is no refusal. */
const playFilm = (video: HTMLVideoElement, onRefused: () => void): void => {
  video.play().catch((error: unknown) => {
    if (error instanceof DOMException && error.name === 'NotAllowedError') onRefused()
  })
}

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)
  // Known only once script runs: the server, and a page without script, draw no button.
  const [moving, setMoving] = useState(false)
  // Stopped by the button, or by a browser that would not play it.
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!window.matchMedia(REDUCED_MOTION).matches) setMoving(true)
  }, [])

  useEffect(() => {
    const video = ref.current
    if (!video || !moving || paused) return
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) playFilm(video, () => setPaused(true))
      else video.pause()
    })
    observer.observe(video)
    return () => observer.disconnect()
  }, [moving, paused])

  // Played from the press itself, so a browser that refused to start it on its own lets it play now.
  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (paused) {
      setPaused(false)
      playFilm(video, () => setPaused(true))
    } else {
      setPaused(true)
      video.pause()
    }
  }

  return (
    <figure className={`${styles.glass} ${styles.heroFilm}`} data-glass="">
      <video
        ref={ref}
        className={styles.heroVideo}
        muted
        loop
        playsInline
        preload="metadata"
        poster={HERO_VIDEO.poster}
        width={1920}
        height={1080}
        aria-hidden="true"
      >
        <source src={HERO_VIDEO.phone} type="video/mp4" media={PHONE_FILM_MEDIA} />
        <source src={HERO_VIDEO.webm} type="video/webm" />
        <source src={HERO_VIDEO.mp4} type="video/mp4" />
      </video>
      {moving ? <PauseButton paused={paused} onToggle={toggle} labels={FILM_CONTROL} /> : null}
      <figcaption className="visually-hidden">{HERO.videoDescription}</figcaption>
    </figure>
  )
}

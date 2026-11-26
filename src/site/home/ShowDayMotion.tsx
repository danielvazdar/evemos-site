'use client'

import React, { useEffect, useRef, useState } from 'react'

import { RollingNumber } from '@/app/(app)/_components/ui/RollingNumber'
import { formatCount } from '@/lib/app/format'

import home from './home.module.css'
import { PauseButton, type PauseLabels } from './PauseButton'
import styles from './ShowDayVisual.module.css'

/**
 * What moves on show day (ShowDayVisual, F-192b, Q6 = A): the door photos it
 * is handed change slowly, like light in a room, and the "Checked in today"
 * card on them counts up once it shows and rises as visitors keep arriving.
 * Both run while on screen, in a visible tab, and stop with the one small
 * pause button (WCAG 2.2.2). With reduced motion, or without script, the first
 * photo and the card stand still, and no button shows.
 *
 * The card is a picture of the app's arrivals with invented figures, hidden
 * from screen readers like every preview; the button is a real control outside
 * it. Over a photo, so the card's words are ink (site-glass.test.ts).
 */

/** Who has come through the doors when the card first shows: invented figures. */
export const ARRIVALS = [
  { group: 'Visitors', count: 968 },
  { group: 'Exhibitors', count: 171 },
  { group: 'Press', count: 23 },
  { group: 'Crew', count: 42 },
] as const

/** Which group each next arrival joins, round and round: about four in five are visitors, as at a real door. */
const NEXT_ARRIVALS = [0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0] as const

/** A full bar: a group's bar is its count against this, and never runs past it however long the page stays open. */
const BAR_FULL = 1100

/** How long each photo stays before the next fades in, and how often someone arrives (the approved demo's). */
export const PHOTO_MS = 5600
export const ARRIVAL_MS = 3100

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** Its pause button's names: the page has a second one, on the film. It stops the photos with the arrivals. */
export const ARRIVALS_CONTROL: PauseLabels = { pause: 'Pause arrivals', play: 'Play arrivals' }

/** Each group's count once `arrived` more people have come in. */
export const countsAfter = (arrived: number): readonly number[] => {
  const rounds = Math.floor(arrived / NEXT_ARRIVALS.length)
  const rest = NEXT_ARRIVALS.slice(0, arrived % NEXT_ARRIVALS.length)
  const joining = (group: number, turns: readonly number[]) => turns.filter((next) => next === group).length
  return ARRIVALS.map(({ count }, group) => count + rounds * joining(group, NEXT_ARRIVALS) + joining(group, rest))
}

interface ShowDayMotionProps {
  /** The door photos, drawn by the server (ShowDayVisual), so no image code ships to the browser; the first shows first. */
  photos: readonly React.ReactNode[]
}

export function ShowDayMotion({ photos }: ShowDayMotionProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Known only once script runs: the server, and a page without script, draw the still card and no button.
  const [moving, setMoving] = useState(false)
  const [paused, setPaused] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [shown, setShown] = useState(0)
  const [arrived, setArrived] = useState(0)

  useEffect(() => {
    if (!window.matchMedia(REDUCED_MOTION).matches) setMoving(true)
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element || !moving) return
    const observer = new IntersectionObserver((entries) => setOnScreen(entries.some((entry) => entry.isIntersecting)))
    observer.observe(element)
    return () => observer.disconnect()
  }, [moving])

  useEffect(() => {
    if (!moving || paused || !onScreen) return
    // A hidden tab skips its turn, so nothing piles up to play at once on return.
    const turns = setInterval(() => {
      if (!document.hidden) setShown((current) => (current + 1) % photos.length)
    }, PHOTO_MS)
    const arrivals = setInterval(() => {
      if (!document.hidden) setArrived((current) => current + 1)
    }, ARRIVAL_MS)
    return () => {
      clearInterval(turns)
      clearInterval(arrivals)
    }
  }, [moving, paused, onScreen, photos.length])

  const counts = countsAfter(arrived)
  const total = counts.reduce((sum, count) => sum + count, 0)

  return (
    <div ref={ref} className={styles.showDay} data-live={moving && !paused ? '' : undefined}>
      <div className={styles.doors}>
        {photos.map((photo, index) => (
          <div key={index} className={styles.door} data-on={index === shown ? '' : undefined}>
            {photo}
          </div>
        ))}
        {moving ? (
          <PauseButton paused={paused} onToggle={() => setPaused((current) => !current)} labels={ARRIVALS_CONTROL} />
        ) : null}
      </div>
      <div aria-hidden="true" className={`${home.glass} ${home.float} ${styles.arrivals}`} data-ui data-glass="">
        <p className={styles.arrivalsHead}>
          <span>Checked in today</span>
          <span className={styles.live}>Live</span>
        </p>
        <p className={styles.arrivalsTotal}>
          <RollingNumber value={formatCount(total)} />
        </p>
        <ul className={styles.arrivalsGroups}>
          {ARRIVALS.map(({ group }, index) => (
            <li key={group}>
              <span>{group}</span>
              <span className={styles.arrivalsBar}>
                <i style={{ '--share': Math.min(1, counts[index] / BAR_FULL) } as React.CSSProperties} />
              </span>
              <b>
                <RollingNumber value={formatCount(counts[index])} />
              </b>
            </li>
          ))}
        </ul>
        <p className={styles.arrivalsNote}>Demo data</p>
      </div>
    </div>
  )
}

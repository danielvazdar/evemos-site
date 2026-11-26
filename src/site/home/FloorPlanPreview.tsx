'use client'

import React, { useEffect, useRef, useState } from 'react'

import { type CanvasBooth, HallCanvas } from '@/app/(app)/_components/ui/HallCanvas'
import type { HallView } from '@/lib/app/hall-view'
import pills from '@/site/ui/PillSwitch.module.css'

import { DEMO_BOOTHS, type DemoBooth, FLOOR_PLAN } from './content'
import styles from './FloorPlanPreview.module.css'
import home from './home.module.css'

/**
 * The homepage's hall (F-192b): the organiser app's own floor plan
 * (`HallCanvas`, E-119) drawing one demo hall the visitor can turn and tap,
 * in a glass window on the washes. Tap a booth and the card beside the hall
 * shows who has it, the size, the price and the staff badges.
 *
 * ★ A REAL CONTROL, AND THE ONLY ONE. Each booth is the app's button with
 * `aria-pressed`; the card is a polite live region, so a screen reader hears
 * the booth it moved to. Without script the page still shows H7-B04 open.
 * The stage is a plot nobody books, so it takes no press (`pickable`).
 *
 * ★ OPENS IN 3D, AND BUILDS UP WHERE IT IS SEEN. The 2D / 3D switch is the
 * app's own turn; the floor plan page opens it in 2D (`firstView`). The app's hall builds up once, when it is first drawn; the
 * server's hall is drawn long before a visitor scrolls to it, so with motion
 * welcome its stage is held out of sight (`data-held`) until a quarter of it
 * is on screen, and the canvas is drawn afresh then, so the entrance plays in
 * view. Without script, or with reduced motion, the hall stands built.
 *
 * The site owns the selection, the view and the card; the legend's counts are
 * the canvas's own, of the stands drawn. Invented exhibitors and people only.
 */

/** Open when the page loads, and when script never runs. */
export const FIRST_BOOTH = 'H7-B04'

/** How much of the hall is on screen when it starts to build up (DESIGN.md "Website"). */
export const ENTRANCE_SHARE = 0.25

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** The ten booths as the app's plan draws them, and the stage in front of them, not for sale. */
const STANDS: readonly CanvasBooth[] = [
  ...DEMO_BOOTHS.map(({ code, exhibitor, state, x, y, w, h, standType }) => ({ code, name: exhibitor ?? '', state, x, y, w, h, standType })),
  { ...FLOOR_PLAN.stage, state: 'blocked' },
]

/** Every booth takes a press; the stage does not. */
const PICKABLE: ReadonlySet<string> = new Set(DEMO_BOOTHS.map(({ code }) => code))

const SOLD = DEMO_BOOTHS.filter((booth) => booth.state === 'sold').length

const VIEWS: readonly (readonly [HallView, string])[] = [
  ['2d', FLOOR_PLAN.views.flat],
  ['3d', FLOOR_PLAN.views.angled],
]

const STATE_CLASS: Readonly<Record<DemoBooth['state'], string>> = {
  sold: styles.sold,
  reserved: styles.reserved,
  free: styles.free,
}

/** The card's rows for one booth: only what is true of its state. */
function cardRows(booth: DemoBooth): ReadonlyArray<readonly [string, string]> {
  const { card } = FLOOR_PLAN
  const rows: ReadonlyArray<readonly [string, string | undefined]> = [
    [card.exhibitor, booth.exhibitor ?? card.noExhibitor],
    [card.size, booth.size],
    [card.price, booth.price],
    [card.heldUntil, booth.heldUntil],
    [card.badges, booth.badges === undefined ? undefined : String(booth.badges)],
    [card.contact, booth.contact],
  ]
  return rows.filter((row): row is readonly [string, string] => row[1] !== undefined)
}

/**
 * False until a quarter of `ref` is on screen, then true for good; `build`
 * turns it at once. Never with reduced motion: the hall stands built from the
 * start.
 */
function useSeenOnce(ref: React.RefObject<HTMLElement | null>): readonly [seen: boolean, build: () => void] {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (seen || !element || window.matchMedia(REDUCED_MOTION).matches) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= ENTRANCE_SHARE)) return
        observer.disconnect()
        setSeen(true)
      },
      { threshold: ENTRANCE_SHARE },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, seen])
  return [seen, () => setSeen(true)]
}

interface ViewSwitchProps {
  view: HallView
  onView: (view: HallView) => void
}

/** 2D and 3D as the site's pill switch (PillSwitch.module.css), its white pill sliding to the one pressed. */
function ViewSwitch({ view, onView }: ViewSwitchProps) {
  return (
    <div className={pills.switch} role="group" aria-label={FLOOR_PLAN.views.label} data-second={view === '3d' ? '' : undefined}>
      <span className={pills.pill} aria-hidden="true" />
      {VIEWS.map(([value, word]) => (
        <button key={value} type="button" aria-pressed={view === value} onClick={() => onView(value)}>
          {word}
        </button>
      ))}
    </div>
  )
}

function BoothCard({ booth }: { booth: DemoBooth }) {
  const word = FLOOR_PLAN.legend[booth.state]
  return (
    <div className={styles.card} aria-live="polite">
      <p className={styles.cardHead}>
        <span>
          {FLOOR_PLAN.card.booth} {booth.code}
        </span>
        <span className={`${styles.cardState} ${STATE_CLASS[booth.state]}`}>{word}</span>
      </p>
      <dl className={styles.cardRows}>
        {cardRows(booth).map(([term, value]) => (
          <div key={term} className={styles.cardRow}>
            <dt>{term}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

interface FloorPlanPreviewProps {
  /**
   * The view it opens in: 3D on the homepage, below the first screen. The floor
   * plan page shows it first thing and opens it in 2D, so the 3D furniture
   * pictures (about 190 KB) load when a visitor turns it, not with the page
   * (F-192d: in 3D its lab LCP was 31 % over `main`'s, in 2D 4 %).
   */
  firstView?: HallView
}

export function FloorPlanPreview({ firstView = '3d' }: FloorPlanPreviewProps) {
  const [openCode, setOpenCode] = useState<string>(FIRST_BOOTH)
  const [view, setView] = useState<HallView>(firstView)
  const hallRef = useRef<HTMLDivElement>(null)
  const [seen, build] = useSeenOnce(hallRef)
  // The booth a keyboard reached while the hall was held, by its label (its code first): focused again once drawn.
  const refocus = useRef<string | null>(null)
  const open = DEMO_BOOTHS.find((booth) => booth.code === openCode) ?? DEMO_BOOTHS[0]
  // A second press on the open booth leaves its card open: the card always names a booth.
  const pick = (code: string | null) => {
    if (code !== null) setOpenCode(code)
  }

  /*
   * Held, the hall is out of sight but its booths are still in the Tab order
   * (a pointer can't reach them, FloorPlanPreview.module.css). The first one a
   * keyboard reaches builds the hall at once, and keeps the focus through the
   * redraw, so neither focus nor a screen reader's place drops to the page.
   */
  const onHallFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (seen || window.matchMedia(REDUCED_MOTION).matches) return
    refocus.current = event.target.getAttribute('aria-label')
    build()
  }

  useEffect(() => {
    const label = refocus.current
    if (!seen || label === null) return
    refocus.current = null
    const buttons = hallRef.current?.querySelectorAll('button') ?? []
    ;[...buttons].find((button) => button.getAttribute('aria-label') === label)?.focus()
  }, [seen])

  return (
    <figure id="floor-plan" className={`${home.glass} ${styles.window}`} data-ui="" data-glass="">
      <div className={styles.top}>
        <div>
          <p className={styles.showName}>{FLOOR_PLAN.title}</p>
          <p className={styles.soldCount}>{FLOOR_PLAN.sold(SOLD, DEMO_BOOTHS.length)}</p>
        </div>
        <ViewSwitch view={view} onView={setView} />
      </div>
      <div className={styles.body}>
        <div ref={hallRef} className={styles.hall} data-held={seen ? undefined : ''} onFocus={onHallFocus}>
          <HallCanvas
            // Drawn afresh once seen, so its one entrance plays on screen.
            key={seen ? 'seen' : 'held'}
            width={FLOOR_PLAN.hall.width}
            depth={FLOOR_PLAN.hall.depth}
            booths={STANDS}
            hasBlocked={false}
            selected={open.code}
            onSelect={pick}
            pickable={PICKABLE}
            view={view}
          />
        </div>
        <BoothCard booth={open} />
      </div>
      <figcaption className={styles.caption}>{FLOOR_PLAN.caption}</figcaption>
    </figure>
  )
}

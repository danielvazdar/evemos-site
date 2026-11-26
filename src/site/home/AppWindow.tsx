'use client'

import React, { useEffect, useRef, useState } from 'react'

import pills from '@/site/ui/PillSwitch.module.css'

import styles from './AppWindow.module.css'
import { APP_WINDOW, DEMO_DATA } from './content'
import home from './home.module.css'

/**
 * "Sell the floor"'s app window (F-192c; Daniel, Q1 = A): one glass window
 * with the app's two screens behind tabs, the dashboard first and the sales
 * board one click away, as the approved demo has them. The screens come drawn
 * from the server (`DemoDashboard`, `PipelinePreview`); this island only
 * switches between them.
 *
 * ★ A PICTURE YOU CAN CLICK, NOT A CONTROL. The window is hidden from screen
 * readers (the section's own text says what the screens do), its screens are
 * `inert`, and its two pills answer a pointer only: they are not buttons, so
 * nothing in the window takes the focus, by Tab or by a click. The hall above
 * stays the page's one real control (FloorPlanPreview).
 *
 * ★ THE MOVE IS THE APP'S PAGE CHANGE. A press moves the pill at once; the
 * view on screen fades and lifts for 120 ms, then the new one rises and
 * un-blurs. A press mid-way takes over from there. With reduced motion the
 * view changes at once.
 *
 * ★ THE FIGURES COUNT UP ONCE (Daniel, Q3 = A). The dashboard counts up and
 * draws itself when it is first seen; once it has been switched away from it
 * is `data-played`, so coming back shows it final, still. Nothing here keeps
 * time: no figure changes while it is on screen.
 */

type Screen = keyof typeof APP_WINDOW

const SCREENS: readonly Screen[] = ['overview', 'sales']

/** How long the old view fades and lifts before the new one shows: the app's page change (shell.module.css). */
export const LEAVE_MS = 120

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export interface AppWindowProps {
  /** The event chip at the window's top left. */
  chip: React.ReactNode
  /** The Overview tab, shown first: the dashboard. */
  overview: React.ReactNode
  /** The Sales tab: the sales board. */
  sales: React.ReactNode
}

export function AppWindow({ chip, overview, sales }: AppWindowProps) {
  // The pressed tab moves the pill at once; the view on screen follows it after the leave.
  const [picked, setPicked] = useState<Screen>('overview')
  const [shown, setShown] = useState<Screen>('overview')
  const [switched, setSwitched] = useState(false)
  const leave = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(leave.current), [])

  const pick = (screen: Screen) => {
    window.clearTimeout(leave.current)
    setPicked(screen)
    // Back to the view still on screen, mid-way: it stays, and stops leaving.
    if (screen === shown) return
    const swap = () => {
      setShown(screen)
      setSwitched(true)
    }
    if (window.matchMedia(REDUCED_MOTION).matches) swap()
    else leave.current = window.setTimeout(swap, LEAVE_MS)
  }

  const views: Readonly<Record<Screen, React.ReactNode>> = { overview, sales }
  return (
    <div className={`${home.glass} ${styles.window}`} aria-hidden="true" data-ui="" data-glass="">
      <div className={styles.head}>
        {chip}
        <div className={pills.switch} data-second={picked === 'sales' ? '' : undefined}>
          <span className={pills.pill} />
          {SCREENS.map((screen) => (
            <span key={screen} data-picked={picked === screen ? '' : undefined} onClick={() => pick(screen)}>
              {APP_WINDOW[screen]}
            </span>
          ))}
        </div>
        <span className={styles.tag}>{DEMO_DATA}</span>
      </div>
      {SCREENS.map((screen) => (
        <div
          key={screen}
          className={styles.view}
          inert
          hidden={shown !== screen}
          data-leaving={shown === screen && picked !== screen ? '' : undefined}
          data-view-enter={shown === screen && switched ? '' : undefined}
          data-played={screen === 'overview' && switched ? '' : undefined}
        >
          {views[screen]}
        </div>
      ))}
    </div>
  )
}

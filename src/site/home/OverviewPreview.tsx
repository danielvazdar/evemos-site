import React from 'react'

import { BoothsRing } from '@/app/(app)/overview/BoothsRing'
import { NeedsYou } from '@/app/(app)/overview/NeedsYou'
import { RegistrationsChart } from '@/app/(app)/overview/RegistrationsChart'
import { Tiles } from '@/app/(app)/overview/Tiles'

import { DEMO_DATA } from './content'
import { DEMO_EVENT, DEMO_OVERVIEW } from './demo-overview'
import home from './home.module.css'
import styles from './OverviewPreview.module.css'

/**
 * The dashboard on the site (F-192c, E-119): the organiser app's own
 * Overview pieces, `Tiles`, `RegistrationsChart`, `BoothsRing` and `NeedsYou`,
 * drawn from the demo fixture (`demo-overview.ts`), so the picture never falls
 * behind the product. Server components, as in the app: they count up, draw
 * their lines and fill the ring by CSS alone, held until the block around them
 * is revealed (OverviewPreview.module.css); with reduced motion every figure
 * and chart shows final.
 *
 * A picture, not a control: hidden from screen readers (the section's own text
 * says what the dashboard does) and `inert`, so none of its links is pressed
 * or reached by Tab. The ring's link is the page's own (`floorPlanHref`):
 * `#plan` on the homepage, never an app screen.
 */

export interface DemoDashboardProps {
  /** Where the booths ring's "Open floor plan" points: a site page or an anchor on it. */
  floorPlanHref: string
}

/** The show the dashboard is for, as the app's event switcher shows it: its tile, its name and its dates. */
export function DemoEventChip() {
  return (
    <span className={styles.chip}>
      <span className={styles.chipTile}>
        <span>{DEMO_EVENT.initials}</span>
        <span>{DEMO_EVENT.year}</span>
      </span>
      <span className={styles.chipText}>
        <span>{DEMO_EVENT.name}</span>
        <small>{DEMO_EVENT.dates}</small>
      </span>
    </span>
  )
}

/** The dashboard alone, for a window that draws its own frame (the homepage's `AppWindow`). */
export function DemoDashboard({ floorPlanHref }: DemoDashboardProps) {
  const { event, hall, trends, tasks, moreTasks } = DEMO_OVERVIEW
  return (
    <div className={styles.dashboard} aria-hidden="true" inert>
      <div className={styles.tiles}>
        <Tiles overview={DEMO_OVERVIEW} manager={false} />
      </div>
      <div className={styles.middle}>
        <RegistrationsChart trends={trends} eventId={event.id} />
        <BoothsRing hall={hall} eventId={event.id} manager={false} floorPlanHref={floorPlanHref} />
      </div>
      <div className={styles.needs}>
        <NeedsYou tasks={tasks} more={moreTasks} />
      </div>
    </div>
  )
}

/** The dashboard in a glass window of its own, the show's chip and "Demo data" over it. */
export function OverviewPreview({ floorPlanHref }: DemoDashboardProps) {
  return (
    <div className={`${home.glass} ${styles.window}`} aria-hidden="true" data-ui="" data-glass="">
      <div className={styles.head}>
        <DemoEventChip />
        <span className={styles.tag}>{DEMO_DATA}</span>
      </div>
      <DemoDashboard floorPlanHref={floorPlanHref} />
    </div>
  )
}

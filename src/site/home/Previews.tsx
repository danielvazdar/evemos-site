import React from 'react'

import { Chip, type ChipTone } from '@/site/ui/primitives'

import { DEMO_DATA } from './content'
import styles from './home.module.css'
import board from './PipelinePreview.module.css'

/**
 * Small pictures of Evemos screens beside the journey stages. DEMO DATA ONLY:
 * invented exhibitors and people with English names, and each picture says
 * "Demo data". Hidden from screen readers: the stage's own text already says
 * what the screen does. Brand tokens and the app's glass tokens only; no
 * yellow (the floor plan's selected booth is the page's highlight).
 */

interface Deal {
  exhibitor: string
  detail: string
}

interface SalesColumn {
  stage: string
  deals: readonly Deal[]
  /** The won deals, drawn in the sold booth's violet. */
  won?: true
}

/**
 * The same demo show as the hero's hall plan: the reserved and sold booths
 * there are the Reserved and Won deals here, so the two pictures add up.
 */
const PIPELINE = [
  {
    stage: 'Contacted',
    deals: [
      { exhibitor: 'Alder Furniture', detail: 'Asked for a corner booth' },
      { exhibitor: 'Pike Logistics', detail: 'Exhibited in 2025' },
      { exhibitor: 'Sundial Solar', detail: 'Call booked for Tuesday' },
    ],
  },
  {
    stage: 'Proposal sent',
    deals: [
      { exhibitor: 'Corvid Security', detail: 'H7-B03, 24 m² corner, €4,600' },
      { exhibitor: 'Meadow Dairy', detail: 'H7-B06, 24 m² corner, €4,600' },
    ],
  },
  {
    stage: 'Reserved',
    deals: [
      { exhibitor: 'Bluefield Foods', detail: 'H7-A03, held until 14 November' },
      { exhibitor: 'Harbour Print', detail: 'H7-A04, held until 21 November' },
    ],
  },
  {
    stage: 'Won',
    won: true,
    deals: [
      { exhibitor: 'Northwind Tools', detail: 'H7-A01, 8 staff badges' },
      { exhibitor: 'Vela Systems', detail: 'H7-B04, 4 staff badges' },
      { exhibitor: 'Kestrel Robotics', detail: 'H7-A02, 6 staff badges' },
    ],
  },
] as const satisfies readonly SalesColumn[]

/** Each column's first card in the board's reading order: the cards rise one after another across the columns. */
const FIRST_CARD: readonly number[] = PIPELINE.map((_, index) =>
  PIPELINE.slice(0, index).reduce((cards, column) => cards + column.deals.length, 0),
)

/**
 * Before the show: the sales board, in the app board's look (F-192c): one
 * glass column per stage, each exhibitor a white card, the won ones in
 * violet. The site draws it itself, as the app's `SalesBoard` is a working
 * screen (drag and drop, writes, record links) with no picture of itself.
 * The Sales tab of "Sell the floor"'s app window (AppWindow.tsx), which says
 * "Demo data"; hidden from screen readers and one piece (`data-ui`), as every
 * picture here.
 */
export function PipelinePreview() {
  return (
    <ul aria-hidden="true" className={board.columns} data-ui="">
      {PIPELINE.map((column, index) => (
        <li key={column.stage} className={board.column} data-won={'won' in column ? '' : undefined}>
          <p className={board.stage}>
            {column.stage} <span className={board.count}>{column.deals.length}</span>
          </p>
          <ul className={board.deals}>
            {column.deals.map((deal, k) => (
              <li key={deal.exhibitor} className={board.deal} style={{ '--card': FIRST_CARD[index] + k } as React.CSSProperties}>
                <span className={board.dealName}>{deal.exhibitor}</span>
                <span className={board.dealDetail}>{deal.detail}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}

interface Request {
  what: string
  who: string
  tone: ChipTone
  word: string
  /** The status it turns to, once, a moment after the card shows. */
  then?: { tone: ChipTone; word: string }
}

const REQUESTS = [
  { what: 'Furniture and power', who: 'Vela Systems · H7-B04', tone: 'success', word: 'Paid' },
  { what: 'Back-wall graphic, 3 × 2.5 m', who: 'Lumen Coffee · H7-B02', tone: 'info', word: 'In review', then: { tone: 'success', word: 'Approved' } },
  { what: 'Stand build plan', who: 'Kestrel Robotics · H7-A02', tone: 'success', word: 'Approved' },
  { what: 'Talk details', who: 'Orbit Labs · Emma Clarke', tone: 'warning', word: 'Due soon' },
  { what: 'Hotel, 3 nights', who: 'Northwind Tools · 2 rooms', tone: 'success', word: 'Confirmed' },
] as const satisfies readonly Request[]

/**
 * Your exhibitors: their requests in one list, each with a status, as the
 * approved demo's glass card lying over the build-up photo's lower edge
 * (F-192b). Its rows enter one after another, and once, 2.6 s after the card
 * shows, the graphic "In review" turns "Approved" and its row flashes. All of
 * it is CSS (home.module.css), held while the card waits to be revealed, so
 * this stays a server component; with reduced motion, or without script, every
 * row shows at once with its final status. On a photo, so ink only
 * (site-glass.test.ts).
 */
export function RequestsPreview() {
  return (
    <div aria-hidden="true" className={`${styles.glass} ${styles.float} ${styles.requests}`} data-ui data-glass="">
      <p className={styles.requestsHead}>
        <span className={styles.requestsTitle}>Exhibitor requests</span>
        <span>{DEMO_DATA}</span>
      </p>
      <ul className={styles.requestRows}>
        {REQUESTS.map((request, index) => (
          <li
            key={request.what}
            className={styles.requestRow}
            style={{ '--row': index } as React.CSSProperties}
            data-changes={'then' in request ? '' : undefined}
          >
            <span className={styles.requestText}>
              <span>{request.what}</span>
              <span className={styles.requestWho}>{request.who}</span>
            </span>
            {'then' in request ? (
              <span className={styles.statusChange}>
                <span className={styles.statusBefore}>
                  <Chip tone={request.tone}>{request.word}</Chip>
                </span>
                <span className={styles.statusAfter}>
                  <Chip tone={request.then.tone}>{request.then.word}</Chip>
                </span>
              </span>
            ) : (
              <Chip tone={request.tone}>{request.word}</Chip>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

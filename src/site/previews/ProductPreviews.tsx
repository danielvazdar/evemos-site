import React from 'react'

import home from '@/site/home/home.module.css'
import { RequestsPreview } from '@/site/home/Previews'
import preview from '@/site/ui/DemoPreview.module.css'
import { Chip, type ChipTone } from '@/site/ui/primitives'

import styles from './ProductPreviews.module.css'

/**
 * Small pictures of Evemos screens for the product pages that have no real
 * screenshot (a page's `visual` replaces its drawn picture, F-118), keyed by slug.
 * DEMO DATA ONLY: invented companies and people with English names, and every
 * picture says "Demo data". Hidden from screen readers: the page's own text
 * says what the screen does. Brand tokens only; booth codes in the code face.
 *
 * Each is a glass window on the hero's washes (F-192d, E-131), so the page
 * frames none of them again: glass never sits in glass. The floor plan and
 * reports pages show the app itself instead, its hall and its dashboard, each
 * from a route of its own (`src/app/(site)/product/floor-plan`, `/reports`),
 * so the route that draws these pages loads neither's CSS nor script.
 */

const DEMO = 'Demo data'

interface FrameProps {
  title: string
  children: React.ReactNode
}

/** A drawn screen's window: its title and "Demo data" over its rows. One piece (`data-ui`), revealed whole. */
function Frame({ title, children }: FrameProps) {
  return (
    <div aria-hidden="true" className={`${home.glass} ${preview.preview}`} data-ui="" data-glass="">
      <p className={preview.previewHead}>
        <span>{title}</span>
        <span className={preview.previewAside}>{DEMO}</span>
      </p>
      {children}
    </div>
  )
}

interface Row {
  main: string
  sub: string
  tone: ChipTone
  word: string
}

function Rows({ rows }: { rows: readonly Row[] }) {
  return (
    <ul className={preview.rows}>
      {rows.map((row) => (
        <li key={row.main} className={preview.row}>
          <span className={styles.rowText}>
            <span>{row.main}</span>
            <span className={preview.pointLine}>{row.sub}</span>
          </span>
          <Chip tone={row.tone}>{row.word}</Chip>
        </li>
      ))}
    </ul>
  )
}

function CampaignsPreview() {
  return (
    <Frame title="Campaigns · Example Expo 2027">
      <Rows
        rows={[
          { main: 'Stand-plan deadline reminder', sub: 'This year\'s exhibitors', tone: 'success', word: 'Sent' },
          { main: 'Early-bird booths for 2027', sub: 'Past exhibitors and prospects', tone: 'info', word: 'Scheduled' },
          { main: 'Your visitor badge is ready', sub: 'Registered visitors', tone: 'success', word: 'Sent' },
          { main: 'Press day invitation', sub: 'Accredited press', tone: 'neutral', word: 'Draft' },
        ]}
      />
    </Frame>
  )
}

function OrdersPreview() {
  return (
    <Frame title="Service orders · by booth">
      <Rows
        rows={[
          { main: 'H7-B04 · 2 tables, 6 chairs', sub: 'Vela Systems · Furniture', tone: 'success', word: 'Paid' },
          { main: 'H7-A02 · Power 3 kW', sub: 'Kestrel Robotics · Electrics', tone: 'success', word: 'Paid' },
          { main: 'H7-B02 · 55" screen', sub: 'Lumen Coffee · AV', tone: 'warning', word: 'Late fee' },
          { main: 'H7-C03 · Daily cleaning', sub: 'Delta Medical · Services', tone: 'info', word: 'Ordered' },
        ]}
      />
    </Frame>
  )
}

function LeadsPreview() {
  return (
    <Frame title="Leads · Vela Systems · H7-B04">
      <Rows
        rows={[
          { main: 'Oliver Hughes', sub: 'Granite Build · wants a demo in May', tone: 'success', word: 'Hot' },
          { main: 'Sarah Mitchell', sub: 'Harbour Print · send pricing', tone: 'info', word: 'Warm' },
          { main: 'James Walker', sub: 'Harbour Daily · press contact', tone: 'neutral', word: 'Note' },
        ]}
      />
    </Frame>
  )
}

/**
 * The exhibitor portal's screen: the homepage's requests card, glass already,
 * standing on its own across the column as the other screens do, with no photo
 * under it to overlap.
 */
function PortalPreview() {
  return (
    <div className={styles.portal}>
      <RequestsPreview />
    </div>
  )
}

/** The drawn picture for each product page without a `visual`, by slug. */
export const PRODUCT_PREVIEWS: Readonly<Record<string, () => React.ReactElement>> = {
  'email-marketing': CampaignsPreview,
  'exhibitor-portal': PortalPreview,
  'service-orders': OrdersPreview,
  'lead-capture': LeadsPreview,
}

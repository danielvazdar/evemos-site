import type { TilesOverview } from '@/app/(app)/overview/Tiles'
import type { HallSummary, Overview, Task } from '@/lib/app/overview-derive'
import { weekStarts } from '@/lib/app/overview-series'
import { shortDay } from '@/lib/app/overview-words'

/**
 * The homepage's dashboard (F-192c, E-119): the approved demo's figures for
 * its invented show, Example Expo 2027, in the shape the app's own Overview
 * pieces read (`Tiles`, `RegistrationsChart`, `BoothsRing`, `NeedsYou`), so a
 * change to that shape fails `tsc` here.
 *
 * ★ DEMO DATA ONLY: an invented show, companies and people, no organiser's
 * records, and nothing read from the database. The dates are fixed, so the
 * picture is the same on every visit: the show opens on 14 April 2027 and the
 * dashboard is read on 14 November 2026, 151 days before.
 *
 * ★ NO LINK INTO THE APP. The tasks carry no `href`, the show has its dates
 * (an undated show's tile would link to the app's settings) and people have
 * registered (an empty chart would link to its Exhibitors screen); the ring's
 * link is the page's own (`OverviewPreview`'s `floorPlanHref`).
 */

/** What the dashboard preview draws: the tiles' fields, the ring's hall and Needs you's tasks. */
export type DemoOverview = TilesOverview & Pick<Overview, 'tasks' | 'moreTasks'> & Readonly<{ hall: HallSummary }>

const TIME_ZONE = 'Europe/Zagreb'

/** The day the picture is taken: its eight weeks end here. */
const SEEN_ON = new Date('2026-11-14T10:00:00.000Z')

/** The window's event chip, written as the app's event switcher writes it (`frame-view.ts`). */
export const DEMO_EVENT = {
  name: 'Example Expo 2027',
  initials: 'EE',
  year: '’27',
  dates: '14–16 Apr 2027',
} as const

/** Two tasks without a button: nothing in the picture is pressed. */
const TASKS: readonly Task[] = [
  {
    key: 'contract',
    tone: 'danger',
    title: 'Chase Harbour Print for the signed booth contract',
    detail: 'Harbour Print · H7-A04 held until 21 Nov',
  },
  { key: 'approvals', tone: 'info', title: '9 companies wait for your approval', detail: 'Exhibitors · registered this week' },
]

export const DEMO_OVERVIEW: DemoOverview = {
  event: { id: 1, startDate: '2027-04-14T07:00:00.000Z', timeZone: TIME_ZONE },
  countdown: {
    phase: 'before',
    days: 151,
    next: { label: 'Stand designs due', date: shortDay('2027-02-15T11:00:00.000Z', TIME_ZONE) },
  },
  exhibitors: { confirmed: 131, registered: 156, thisWeek: 6, waiting: 9 },
  visitors: { registered: 4_812, thisWeek: 292 },
  money: {
    totals: [{ currency: 'EUR', invoiced: 612_000, paid: 471_000, overdue: 38_000 }],
    overdueRows: [],
    noCurrencyRows: [],
  },
  // Running totals at each week's start, then today's (the app's TREND_WEEKS + 1): the last step is this week's.
  trends: {
    weeks: weekStarts(SEEN_ON, TIME_ZONE),
    exhibitors: [97, 104, 112, 121, 128, 135, 141, 150, 156],
    visitors: [2_740, 2_950, 3_180, 3_420, 3_690, 3_990, 4_310, 4_520, 4_812],
    invoiced: {
      currency: 'EUR',
      cents: [16_000_000, 21_200_000, 26_000_000, 31_800_000, 37_700_000, 43_100_000, 48_900_000, 55_200_000, 61_200_000],
    },
  },
  // The ring reads only the counts, of every hall of the show: 148 of 170 booths taken.
  hall: { name: DEMO_EVENT.name, width: 0, depth: 0, booths: [], sold: 131, reserved: 17, total: 170, hasBlocked: false },
  tasks: TASKS,
  moreTasks: 0,
}

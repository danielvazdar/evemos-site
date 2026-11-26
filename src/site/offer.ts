import { formatMoney } from '@/lib/app/format'

/**
 * What the site says it costs and when organisers can sign up (#216, #217).
 * The homepage and /pricing both read this file, and `pricing/content.ts`
 * already imports from `home/content.ts`, so it sits on its own to keep the
 * two out of an import cycle. Every € figure and the launch month on those
 * pages come from here: `home.test.tsx` and `pages.test.tsx` fail on any other
 * figure of ours, `plain-words.test.tsx` on the month typed anywhere else.
 *
 * ★ PLACEHOLDER until the pricing deep dive (#241). Daniel (2026-10-22): show
 * placeholder prices now. Each is the "up to 50 exhibitors" column of the
 * working ladder in docs/WEBSITE_PLAN.md §7; E-14 is still open. `null` puts
 * "Price on request" back on that plan. Integer cents, like all money here.
 */

export interface StartingPrice {
  readonly cents: number
  readonly upToExhibitors: number
}

/** One placeholder per plan on /pricing, keyed like `PLANS`. */
export const PLAN_PRICES: Readonly<Record<'start' | 'expo' | 'pro' | 'secure', StartingPrice | null>> = {
  start: { cents: 120_000, upToExhibitors: 50 },
  expo: { cents: 290_000, upToExhibitors: 50 },
  pro: { cents: 450_000, upToExhibitors: 50 },
  secure: { cents: 790_000, upToExhibitors: 50 },
}

/** The smallest plan's price: the "from" figure in the pricing intro and the homepage cost answer. */
export const STARTING_PRICE: StartingPrice | null = PLAN_PRICES.start

/** When organisers can sign up (E-13). Typed once; the homepage and pricing read it. */
export const OPENS_TO_ORGANISERS = 'January 2027'

/** A plan card's price in two parts: the amount, set large, and what it buys. */
export const planPrice = (price: StartingPrice): { amount: string; per: string } => ({
  amount: formatMoney(price.cents / 100, 'EUR'),
  per: `a year, for shows with up to ${price.upToExhibitors} exhibitors`,
})

/** "From €1,200 a year for shows with up to 50 exhibitors.", or null when there is no price. For a sentence: the intro and the FAQ. */
export const startingPriceLine = (price: StartingPrice | null): string | null =>
  price ? `From ${planPrice(price).amount} a year for shows with up to ${price.upToExhibitors} exhibitors.` : null

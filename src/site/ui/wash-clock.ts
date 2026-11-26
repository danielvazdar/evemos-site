/**
 * The clock of the site's backdrop drift (F-192a): where the four washes stand
 * at a moment, so every page starts them where the last page left them and the
 * backdrop holds still across a page change instead of jumping back to its
 * start. Pure, and apart from `SiteBackdrop`: the server layout calls it, and a
 * `"use client"` module's exports are only rendered there, never called.
 */

/**
 * How long the four washes take to come back to where they started together:
 * each drifts out and back (`alternate`) over twice its loop in site.scss (30,
 * 34, 38 and 26 s), and this is the least common multiple of the four, about
 * 70 hours. `site-backdrop.dom.test.tsx` reads the loops from the stylesheet.
 */
export const WASH_CYCLE_MS = 251_940_000

/**
 * Where the drift stands at `now` (ms since the epoch), as the negative
 * `animation-delay` site.scss gives every wash (`--wash-clock`). Within one
 * cycle, so the number stays short enough for every browser to read exactly.
 */
export const washClock = (now: number): string => `${-(now % WASH_CYCLE_MS) / 1000}s`

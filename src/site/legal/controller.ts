/**
 * Who runs the site and the platform, as the privacy notice and the terms state
 * it (F-022). The ONE place these details are typed: both documents render
 * them from here (`{ kind: 'contact' }` in `LegalDocument.tsx`), and the tests
 * check no content module spells them out again.
 *
 * Kyuro is Daniel's obrt and the controller (DECISIONS "Ownership"); there is
 * no separate legal entity for the product.
 *
 * ★ A MISSING ANSWER IS A TOKEN, never a guess: `[[TODO: <what>]]`. Dev and
 * staging show the token on the page so a reviewer sees the gap; a production
 * server refuses to start while one remains (`release-guard.ts`, wired in
 * `src/instrumentation.ts`). Replace the token with the real value, nothing
 * else.
 */

/** A legal detail nobody has supplied yet. Exactly this shape, so the guard finds every one. */
export const PLACEHOLDER = /\[\[TODO:[^\]]*\]\]/

export type Controller = Readonly<{
  /** The name people know: "Kyuro". */
  tradingName: string
  /** The obrt's full registered name, as in the craft register. */
  legalName: string
  owner: string
  /** The registered address (seat), one line per entry. */
  address: readonly string[]
  country: string
  oib: string
  /** The register and the entry's number (obrtni registar, MBO). */
  register: string
  /** Where people write about their data (F-022 Question 3). */
  privacyEmail: string
  /** Everything else, demo requests included (F-021c Decision Q2). */
  generalEmail: string
}>

export const CONTROLLER: Controller = Object.freeze({
  tradingName: 'Kyuro',
  // source: Kyuro whitepaper §1 (obrtnica, upis u Obrtni registar 06.07.2026).
  legalName: 'Kyuro, obrt za promidžbu i ostale usluge, vl. Daniel Vazdar',
  owner: 'Daniel Vazdar',
  address: Object.freeze(['Zadarska 24', '31000 Osijek']),
  country: 'Croatia',
  oib: '65753088499',
  register: 'Croatian craft register (Obrtni registar), MBO 99323605',
  // E-43: mail for evemos.events, privacy@ included, is forwarded by Cloudflare Email Routing.
  privacyEmail: 'privacy@evemos.events',
  generalEmail: 'demo@evemos.events',
})

/**
 * The dotted path of every string under `value` that still holds a
 * placeholder token, e.g. `['oib', 'address.0']`. Walks plain objects, arrays
 * and strings; anything else (numbers, booleans, functions) cannot hold copy.
 *
 * One function for the boot guard and the tests, so the two cannot disagree
 * about what counts as unfinished.
 */
export function findPlaceholders(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return PLACEHOLDER.test(value) ? [path] : []
  const join = (key: string | number) => (path === '' ? String(key) : `${path}.${key}`)
  if (Array.isArray(value)) return value.flatMap((item, index) => findPlaceholders(item, join(index)))
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) => findPlaceholders(item, join(key)))
  }
  return []
}

export type Authority = Readonly<{
  name: string
  /** What it is, in English, for a reader who does not know the Croatian name. */
  description: string
  address: readonly string[]
  website: string
  email: string
}>

/**
 * Where people complain about how we handle their data (GDPR Art. 77). Every
 * detail checked on the authority's own contact page, https://azop.hr/kontakt/,
 * on 2026-10-19: its general address is azop@azop.hr.
 */
export const AUTHORITY: Authority = Object.freeze({
  name: 'Agencija za zaštitu osobnih podataka (AZOP)',
  description: 'the Croatian data protection authority',
  address: Object.freeze(['Ulica Metela Ožegovića 16', '10000 Zagreb', 'Croatia']),
  website: 'https://azop.hr',
  email: 'azop@azop.hr',
})

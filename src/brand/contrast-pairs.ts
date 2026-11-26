/**
 * Every foreground/background pairing the admin draws, with the WCAG floor it
 * has to clear. `tokens.test.ts` computes each one in BOTH themes from
 * `tokens.json`, so a replaced brand file that breaks a pairing fails CI rather
 * than a reader at a desk.
 *
 * ★ 4.5:1 for text, 3:1 for controls and indicators (WCAG 2.x 1.4.3 / 1.4.11).
 *
 * ★ What is NOT here is as deliberate as what is. `status-danger` and
 * `status-success` as text or a hairline on `surface-raised` fail in dark (2.95
 * and 3.12), and `line` as a control border fails everywhere (the brand book
 * calls it decorative). So status colours are FILLS ONLY in the admin, always
 * with their `on-*` text, and control borders use `ink-muted`. A new pairing in
 * a stylesheet gets a line here first; if it cannot pass, it cannot ship.
 */

export interface ContrastPair {
  /** Token name in `tokens.json` (no `--evemos-` prefix), or a `DERIVED_COLOURS` name. */
  fg: string
  bg: string
  min: 4.5 | 3
  /** Where the admin draws it — the reason the pair is on the list. */
  where: string
}

const TEXT = 4.5
const INDICATOR = 3

/** `color-mix(in oklab, var(--evemos-<a>) <percent>%, var(--evemos-<b>))`, both operands tokens. */
export interface Mix {
  a: string
  percent: number
  b: string
}

/**
 * A colour custom.scss derives from two tokens with `color-mix` — hovers and
 * the steps of Payload's neutral ramp. Listed here so the pairs drawn on them
 * are contrast-tested too; `tokens.test.ts` checks custom.scss declares each
 * one exactly as written here, so the two cannot drift apart.
 */
export interface DerivedColour {
  name: string
  /** The custom property custom.scss declares. */
  property: string
  light: Mix
  dark: Mix
}

const same = (mix: Mix) => ({ light: mix, dark: mix })

export const DERIVED_COLOURS: readonly DerivedColour[] = [
  {
    name: 'primary-hover',
    property: '--evemos-primary-hover',
    light: { a: 'hall-violet', percent: 82, b: 'ink' },
    dark: { a: 'hall-violet', percent: 82, b: 'paper' },
  },
  {
    name: 'danger-hover',
    property: '--evemos-danger-hover',
    light: { a: 'status-danger', percent: 82, b: 'ink' },
    dark: { a: 'status-danger', percent: 82, b: 'paper' },
  },
  {
    name: 'rail-hover',
    property: '--evemos-rail-hover',
    ...same({ a: 'on-hall-violet', percent: 14, b: 'hall-violet' }),
  },
  {
    name: 'elevation-50',
    property: '--theme-elevation-50',
    ...same({ a: 'line', percent: 33, b: 'surface-raised' }),
  },
  {
    name: 'elevation-100',
    property: '--theme-elevation-100',
    ...same({ a: 'line', percent: 67, b: 'surface-raised' }),
  },
  {
    name: 'elevation-600',
    property: '--theme-elevation-600',
    ...same({ a: 'ink', percent: 33, b: 'ink-muted' }),
  },
  {
    name: 'elevation-700',
    property: '--theme-elevation-700',
    ...same({ a: 'ink', percent: 67, b: 'ink-muted' }),
  },
]

export const CONTRAST_PAIRS: readonly ContrastPair[] = [
  // Text.
  { fg: 'ink', bg: 'paper', min: TEXT, where: 'body text on the page; blocked booth code' },
  { fg: 'ink', bg: 'surface-raised', min: TEXT, where: 'body text in panels and tables' },
  { fg: 'ink-muted', bg: 'paper', min: TEXT, where: 'secondary text on the page' },
  { fg: 'ink-muted', bg: 'surface-raised', min: TEXT, where: 'secondary text in panels, table meta' },
  { fg: 'hall-violet', bg: 'paper', min: TEXT, where: 'links on the page; the current rail item' },
  { fg: 'hall-violet', bg: 'surface-raised', min: TEXT, where: 'links in panels' },
  { fg: 'on-hall-violet', bg: 'hall-violet', min: TEXT, where: 'primary and create buttons, rail text' },
  { fg: 'on-accent', bg: 'badge-yellow', min: TEXT, where: 'the one yellow highlight' },
  { fg: 'on-accent', bg: 'violet-tint', min: TEXT, where: 'soft brand fills' },
  { fg: 'on-accent', bg: 'status-warning', min: TEXT, where: 'warning chips and notices' },
  { fg: 'on-status', bg: 'status-success', min: TEXT, where: 'success chips and notices' },
  { fg: 'on-status', bg: 'status-danger', min: TEXT, where: 'error chips and notices, delete buttons' },
  { fg: 'on-status', bg: 'status-neutral', min: TEXT, where: 'neutral chips' },
  { fg: 'on-hall-violet', bg: 'status-info', min: TEXT, where: 'info chips' },
  { fg: 'ink', bg: 'booth-free', min: TEXT, where: 'free booth code' },
  { fg: 'on-accent', bg: 'booth-reserved', min: TEXT, where: 'reserved booth code' },
  { fg: 'on-hall-violet', bg: 'booth-sold', min: TEXT, where: 'sold booth code' },
  { fg: 'on-accent', bg: 'booth-selected', min: TEXT, where: 'selected booth code' },
  { fg: 'on-hall-violet', bg: 'primary-hover', min: TEXT, where: 'primary and create buttons, hovered' },
  { fg: 'on-status', bg: 'danger-hover', min: TEXT, where: 'delete button, hovered' },
  { fg: 'on-hall-violet', bg: 'rail-hover', min: TEXT, where: 'rail link, hovered' },
  { fg: 'ink', bg: 'elevation-100', min: TEXT, where: 'station day chip, link code, hovered rows' },
  { fg: 'ink-muted', bg: 'elevation-50', min: TEXT, where: 'station hints on the station foot' },
  { fg: 'elevation-600', bg: 'elevation-50', min: TEXT, where: 'station bar captions' },
  { fg: 'elevation-600', bg: 'elevation-100', min: TEXT, where: 'match details in a hovered station match' },
  { fg: 'elevation-600', bg: 'surface-raised', min: TEXT, where: 'station notes, waited times' },
  { fg: 'elevation-700', bg: 'elevation-50', min: TEXT, where: 'neutral legal-documents note' },

  // Controls and indicators.
  { fg: 'ink-muted', bg: 'paper', min: INDICATOR, where: 'input and free-booth borders on the page' },
  { fg: 'ink-muted', bg: 'surface-raised', min: INDICATOR, where: 'input borders in panels' },
  { fg: 'hall-violet', bg: 'paper', min: INDICATOR, where: 'focus ring on the page' },
  { fg: 'hall-violet', bg: 'surface-raised', min: INDICATOR, where: 'focus ring in panels' },
  { fg: 'on-hall-violet', bg: 'hall-violet', min: INDICATOR, where: 'focus ring inside the violet rail' },
  { fg: 'ink', bg: 'paper', min: INDICATOR, where: 'selected booth border' },
  { fg: 'status-danger', bg: 'paper', min: INDICATOR, where: 'troubled-stand ring (F-020c)' },
]

const channel = (value: number): number => {
  const srgb = value / 255
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
}

/** WCAG 2.x relative luminance of a `#rrggbb` colour. */
export const relativeLuminance = (hex: string): number => {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (!match) throw new Error(`contrast: expected #rrggbb, got "${hex}"`)
  const [r, g, b] = match.slice(1).map((part) => channel(parseInt(part, 16)))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** WCAG 2.x contrast ratio between two `#rrggbb` colours, 1 to 21, order-independent. */
export const contrastRatio = (hexA: string, hexB: string): number => {
  const [light, dark] = [relativeLuminance(hexA), relativeLuminance(hexB)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

/** The 0–255 channels of a `#rrggbb` colour. */
const channelsOf = (hex: string): number[] => {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex)
  if (!match) throw new Error(`colour: expected #rrggbb, got "${hex}"`)
  return match.slice(1).map((part) => parseInt(part, 16))
}

const toLinear = (hex: string): [number, number, number] => {
  const [r, g, b] = channelsOf(hex).map(channel)
  return [r, g, b]
}

const toHex = (linear: readonly number[]): string =>
  `#${linear
    .map((value) => {
      const clamped = Math.min(1, Math.max(0, value))
      const srgb = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * clamped ** (1 / 2.4) - 0.055
      return Math.round(srgb * 255)
        .toString(16)
        .padStart(2, '0')
    })
    .join('')}`

/** Linear sRGB to OKLab (Björn Ottosson's matrices, as CSS Color 4 uses). */
const toOklab = ([r, g, b]: readonly number[]): [number, number, number] => {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

const fromOklab = ([lightness, a, b]: readonly number[]): [number, number, number] => {
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}

const weightOf = (percent: number): number => {
  if (percent < 0 || percent > 100) throw new Error(`colour: mix percentage ${percent} is outside 0 to 100`)
  return percent / 100
}

/**
 * What `color-mix(in oklab, <hexA> <percent>%, <hexB>)` renders as, to the
 * nearest `#rrggbb` (out-of-gamut channels clipped, as browsers do here).
 */
export const mixOklab = (hexA: string, percent: number, hexB: string): string => {
  const weight = weightOf(percent)
  const a = toOklab(toLinear(hexA))
  const b = toOklab(toLinear(hexB))
  return toHex(fromOklab(a.map((value, index) => value * weight + b[index] * (1 - weight))))
}

/**
 * What `color-mix(in srgb, <hexA> <percent>%, <hexB>)` renders as, to the
 * nearest `#rrggbb`: each 0–255 channel weighted as written, no linearising.
 * It is also `<hexA>` at `<percent>`% opacity painted over `<hexB>`, which is
 * how a see-through mix (`…, transparent)`) lands on what is under it.
 */
export const mixSrgb = (hexA: string, percent: number, hexB: string): string => {
  const weight = weightOf(percent)
  const b = channelsOf(hexB)
  return `#${channelsOf(hexA)
    .map((value, index) => Math.round(value * weight + b[index] * (1 - weight)).toString(16).padStart(2, '0'))
    .join('')}`
}

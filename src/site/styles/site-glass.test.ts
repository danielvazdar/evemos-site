/**
 * The site's glass (F-192a, E-119; DESIGN.md "Website"): the whites only the
 * site sets, each one tested for contrast where it is worst, and the app's
 * type, radius, pill and shadow variables, which the site now reads from the
 * app's token file.
 *
 * The site keeps the approved demo's thin glass (Daniel, Q5 = A): its whites
 * lie over four soft washes drawn at full strength (`SiteBackdrop`), not over
 * the app's ribbons, so `glass-screens.test.ts` does not cover them. This
 * models the same way: a white at its opacity over the frosted spot behind it,
 * channel by channel in sRGB, the frost's saturation and brightness included.
 * A wash is a radial gradient from its colour to clear, so its centre, the
 * colour at full strength, is its darkest spot.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { contrastRatio } from '@/brand/contrast-pairs'

import { parseBrandTokens, resolveColour } from '../../../scripts/build-brand-tokens'

type Rgb = readonly [number, number, number]

/** A stylesheet without its comments, so a declaration in a comment proves nothing. */
const cssOf = (...path: string[]): string =>
  readFileSync(join(process.cwd(), ...path), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')

const SITE = cssOf('src', 'site', 'styles', 'site.scss')
const TOKENS = cssOf('src', 'app', '(app)', '_components', 'glass-motion.css')
const SHELL = cssOf('src', 'app', '(app)', '_components', 'shell.module.css')

const BRAND = parseBrandTokens(JSON.parse(readFileSync(join(process.cwd(), 'src', 'brand', 'tokens.json'), 'utf8')))
const brand = (token: string): Rgb => {
  const hex = resolveColour(BRAND, token, 'light')
  return [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16)) as unknown as Rgb
}
const toHex = (colour: Rgb): string => `#${colour.map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`

/** `top` at `alpha` over `under`: what the browser paints, and what `color-mix(in srgb, …)` is. */
const over = (top: Rgb, alpha: number, under: Rgb): Rgb =>
  top.map((channel, at) => channel * alpha + under[at] * (1 - alpha)) as unknown as Rgb

const ratio = (background: Rgb, text: Rgb): number => contrastRatio(toHex(background), toHex(text))

/** The value of a custom property in a stylesheet's code, whitespace folded; throws when it is not there. */
const valueIn = (css: string, where: string, name: string): string => {
  const found = new RegExp(`(?:^|[\\s;{])${name}:\\s*([^;]+);`).exec(css)
  if (!found) throw new Error(`no ${name} in ${where}`)
  return found[1].replace(/\s+/g, ' ').trim()
}

/** A brand colour mixed with another or with clear: `color-mix(in srgb, var(--evemos-a) n%, var(--evemos-b) | transparent)`. */
const MIX = /^color-mix\(in srgb, var\(--evemos-([a-z-]+)\) ([\d.]+)%, (?:var\(--evemos-([a-z-]+)\)|transparent)\)$/

/** A see-through white the site sets: `surface-raised` at an opacity. Throws on any other recipe, so a new one is modelled or fails. */
const whiteOf = (name: string): number => {
  const found = MIX.exec(valueIn(SITE, 'site.scss', name))
  if (!found || found[1] !== 'surface-raised' || found[3] !== undefined) throw new Error(`site.scss: ${name} is not surface-raised over clear`)
  return Number(found[2]) / 100
}

/** An opaque mix of two brand colours from the app's tokens: the washes and the error text. */
const opaqueOf = (name: string): Rgb => {
  const found = MIX.exec(valueIn(TOKENS, 'glass-motion.css', name))
  if (!found || found[3] === undefined) throw new Error(`glass-motion.css: ${name} is not a mix of two brand colours`)
  return over(brand(found[1]), Number(found[2]) / 100, brand(found[3]))
}

/** The site's frost, `blur(…) saturate(s%) brightness(b)`: the two factors. Throws on any other recipe. */
const frost = (): { saturation: number; brightness: number } => {
  const found = /^blur\([\d.]+px\) saturate\(([\d.]+)%\) brightness\(([\d.]+)\)$/.exec(valueIn(SITE, 'site.scss', '--ex-blur'))
  if (!found) throw new Error('site.scss: --ex-blur is not blur(…px) saturate(…%) brightness(…)')
  return { saturation: Number(found[1]) / 100, brightness: Number(found[2]) }
}

const clamp = (channel: number): number => Math.min(255, Math.max(0, channel))

/**
 * CSS `saturate(s)` then `brightness(b)` on one colour: the Filter Effects matrices on the sRGB values, as browsers
 * apply filter functions, clamped to the gamut after each. The blur is not modelled: a wash is half the window wide
 * and changes over hundreds of pixels, so 22 px of blur leaves it as it is.
 */
const frosted = ([r, g, b]: Rgb): Rgb => {
  const { saturation: s, brightness } = frost()
  const saturated = [
    (0.213 + 0.787 * s) * r + (0.715 - 0.715 * s) * g + (0.072 - 0.072 * s) * b,
    (0.213 - 0.213 * s) * r + (0.715 + 0.285 * s) * g + (0.072 - 0.072 * s) * b,
    (0.213 - 0.213 * s) * r + (0.715 - 0.715 * s) * g + (0.072 + 0.928 * s) * b,
  ].map(clamp)
  return saturated.map((channel) => clamp(channel * brightness)) as unknown as Rgb
}

/** Every spot behind the site's glass: the bare paper, and each of the four washes at full strength. */
const SPOTS: readonly (readonly [string, () => Rgb])[] = [
  ['the bare paper', () => brand('paper')],
  ...['violet', 'violet-soft', 'coral', 'yellow'].map((wash) => [`the ${wash} wash`, () => opaqueOf(`--ex-wash-${wash}`)] as const),
]

const TEXT = {
  ink: () => brand('ink'),
  'ink-muted': () => brand('ink-muted'),
  'hall-violet': () => brand('hall-violet'),
  'danger text': () => opaqueOf('--ex-danger-text'),
} as const

type Text = keyof typeof TEXT

const EVERY_TEXT = Object.keys(TEXT) as Text[]

/**
 * Each white the site sets, and the text colours that sit on it. The app's three keep the demo's thin values; the
 * app's kit draws only ink and its muted grey on its lighter two (the segmented filter, quiet buttons), and the site
 * puts no text of its own on them.
 */
const WHITES: Readonly<Record<string, readonly Text[]>> = {
  '--ex-glass': ['ink', 'ink-muted'],
  '--ex-chip': ['ink', 'ink-muted'],
  '--ex-glass-strong': EVERY_TEXT,
  '--site-pill': ['ink'],
  '--site-dropdown': ['ink', 'ink-muted', 'hall-violet'],
  '--site-dropdown-unfrosted': ['ink', 'ink-muted', 'hall-violet'],
  '--site-photo-card': EVERY_TEXT,
  '--site-booth-card': EVERY_TEXT,
  '--site-dialog': EVERY_TEXT,
  '--site-pane': ['ink', 'ink-muted', 'hall-violet'],
}

/** What `white` shows over `spot`, frosted. */
const glassOver = (white: number, spot: Rgb): Rgb => over(brand('surface-raised'), white, frosted(spot))

describe('the site sets its own whites and frost (Q5 = A)', () => {
  it('lists every see-through white site.scss sets, so a new one is tested too', () => {
    const set = [...SITE.matchAll(/(--(?:ex|site)-[\w-]+):\s*color-mix\(in srgb, var\(--evemos-surface-raised\) [\d.]+%, transparent\);/g)].map(
      ([, name]) => name,
    )
    expect(set.sort()).toEqual(Object.keys(WHITES).sort())
  })

  // The demo's values, but the strong glass at 50 % (48 % in the demo): the menu bar's, which floats over anything.
  it('keeps the demo’s values: glass 34 / 50 %, chips 42 %, a 22 px frost at 200 % and 1.04', () => {
    expect([whiteOf('--ex-glass'), whiteOf('--ex-glass-strong'), whiteOf('--ex-chip')]).toEqual([0.34, 0.5, 0.42])
    expect(valueIn(SITE, 'site.scss', '--ex-blur')).toBe('blur(22px) saturate(200%) brightness(1.04)')
  })
})

describe('text on the site’s glass reads at 4.5:1 at its worst spot (AC 5)', () => {
  it.each(
    Object.entries(WHITES).flatMap(([white, texts]) =>
      texts.flatMap((text) => SPOTS.map(([where, spot]) => [text, white, where, spot] as const)),
    ),
  )('%s on %s over %s', (text, white, _where, spot) => {
    expect(ratio(glassOver(whiteOf(white), spot()), TEXT[text]())).toBeGreaterThanOrEqual(4.5)
  })

  // The model can fail: a white set too thin drops the muted grey under 4.5:1 over the violet wash.
  it('fails a white at 20 %', () => {
    const [, violetWash] = SPOTS.find(([where]) => where === 'the violet wash') ?? []
    expect(violetWash).toBeDefined()
    expect(ratio(glassOver(0.2, violetWash!()), TEXT['ink-muted']())).toBeLessThan(4.5)
  })
})

const BLACK: Rgb = [0, 0, 0]

/**
 * What the floating glass passes over as a page scrolls under it, besides the washes: the violet close, a dark
 * photo, and at worst pure black, darker than anything a page shows. Pure black is also where the frost changes
 * nothing, so it is the bound for every dark spot.
 */
const UNDER_THE_BAR: readonly (readonly [string, () => Rgb])[] = [
  ...SPOTS,
  ['the violet band', () => brand('hall-violet')],
  ['a dark photo (40, 40, 40)', () => [40, 40, 40]],
  ['pure black', () => BLACK],
]

/**
 * The glass that floats over the page, and the text on it: the menu bar (`--ex-glass-strong`) carries only ink, its
 * links and the lockup ("Book a demo" has a fill of its own), and its dropdowns carry ink, their muted lines and the
 * violet overview link.
 */
const FLOATING: Readonly<Record<string, readonly Text[]>> = {
  '--ex-glass-strong': ['ink'],
  '--site-dropdown': ['ink', 'ink-muted', 'hall-violet'],
}

describe('the menu bar and its dropdowns read over anything the page scrolls under them (F-192a review)', () => {
  it.each(
    Object.entries(FLOATING).flatMap(([white, texts]) =>
      texts.flatMap((text) => UNDER_THE_BAR.map(([where, spot]) => [text, white, where, spot] as const)),
    ),
  )('%s on %s over %s', (text, white, _where, spot) => {
    expect(ratio(glassOver(whiteOf(white), spot()), TEXT[text]())).toBeGreaterThanOrEqual(4.5)
  })

  // Why the bar's white is 50 %: at the demo's 48 % its ink fell under 4.5:1 over pure black.
  it('fails the bar at the demo’s 48 % over pure black', () => {
    expect(ratio(glassOver(0.48, BLACK), TEXT.ink())).toBeLessThan(4.5)
  })
})

/**
 * The dropdowns draw no frost in Firefox (F-192c review). At 82 % every text still held 4.5:1 there, yet a page's
 * headline read through the menu sharp and ran into its lines; at 94 % it still showed. So Chrome and Safari keep the
 * demo's 82 % glass and Firefox alone takes `--site-dropdown-unfrosted` (Daniel, 2026-11-17), checked over what lies
 * under it as it is, unfrosted, letting at most 4 % of the page through.
 */
describe('the dropdowns read over the page with no frost behind them in Firefox (F-192c review)', () => {
  it.each(
    FLOATING['--site-dropdown'].flatMap((text) => UNDER_THE_BAR.map(([where, spot]) => [text, where, spot] as const)),
  )('%s on the Firefox dropdown over %s, unfrosted', (text, _where, spot) => {
    expect(ratio(over(brand('surface-raised'), whiteOf('--site-dropdown-unfrosted'), spot()), TEXT[text]())).toBeGreaterThanOrEqual(4.5)
  })

  it('lets at most 4 % of the page through in Firefox', () => {
    expect(whiteOf('--site-dropdown-unfrosted')).toBeGreaterThanOrEqual(0.96)
  })

  it('keeps the demo’s 82 % glass where the frost draws', () => {
    expect(whiteOf('--site-dropdown')).toBe(0.82)
  })

  it('swaps in the near-opaque white for Firefox only', () => {
    const firefox = /@supports \(-moz-appearance: none\) \{\s*:root \{\s*([^}]*)\}\s*\}/.exec(SITE)
    expect(firefox?.[1].trim()).toBe('--site-dropdown: var(--site-dropdown-unfrosted);')
  })
})

/**
 * What lies on a photo or a playing film (F-192b): the homepage's small cards over the build-up and door photos
 * (`--site-photo-card`), and the pause buttons on the film and the door photos (`--site-pill`, no frost). Under each
 * card its photo runs to black even through the frost: blurred by the frost's 22 px at the photo's largest size on
 * the page, its darkest spot is (2, 4, 5) on the build-up photo and (1, 1, 1) to (3, 5, 6) on the door photos, and a
 * film's frame can be black. So pure black is their worst spot, and the bound for any photo laid under them later.
 * There muted ink on the card's 66 % reads 3.4:1 and violet 3.0:1, so these carry ink alone; their hierarchy is in
 * size and weight.
 */
const ON_PHOTOS: Readonly<Record<string, readonly Text[]>> = {
  '--site-photo-card': ['ink'],
  '--site-pill': ['ink'],
}

describe('the cards and buttons on photos read over the darkest photo (F-192b)', () => {
  it.each(Object.entries(ON_PHOTOS).flatMap(([white, texts]) => texts.map((text) => [text, white] as const)))(
    '%s on %s over pure black',
    (text, white) => {
      expect(ratio(glassOver(whiteOf(white), BLACK), TEXT[text]())).toBeGreaterThanOrEqual(4.5)
    },
  )

  // Why the cards on photos carry ink alone: their muted lines and violet would fall under 4.5:1 there.
  it.each(['ink-muted', 'hall-violet'] as const)('fails %s on the photo card over pure black', (text) => {
    expect(ratio(glassOver(whiteOf('--site-photo-card'), BLACK), TEXT[text]())).toBeLessThan(4.5)
  })
})

/**
 * The app's own pieces in the site's windows (F-192c): the dashboard's tiles and panels and the sales board's columns
 * are panes in the site's pane white with no frost of their own (OverviewPreview.module.css, PipelinePreview.module.css),
 * lying on the window's strong glass, which frosts the washes. They carry ink, muted ink, the violet of their links,
 * and the success green of a tile's "+6 this week", which no site white carried before: at the strong glass's 50 % it
 * read 4.4:1 over the violet wash, so the pane white is 60 %.
 */
const ON_PANES: readonly (readonly [string, () => Rgb])[] = [
  ...Object.entries(TEXT).filter(([name]) => name !== 'danger text'),
  ['status-success', () => brand('status-success')],
]

describe('the app’s pieces in the site’s windows read at 4.5:1 at the worst spot (F-192c)', () => {
  const pane = (white: number, spot: Rgb): Rgb => over(brand('surface-raised'), white, glassOver(whiteOf('--ex-glass-strong'), spot))

  it.each(ON_PANES.flatMap(([text, colour]) => SPOTS.map(([where, spot]) => [text, where, colour, spot] as const)))(
    '%s on a pane over %s',
    (_text, _where, colour, spot) => {
      expect(ratio(pane(whiteOf('--site-pane'), spot()), colour())).toBeGreaterThanOrEqual(4.5)
    },
  )

  // Why the pane is not the strong glass: the green fell under 4.5:1 there.
  it('fails the green on a pane of the strong glass over the violet wash', () => {
    const [, violetWash] = SPOTS.find(([where]) => where === 'the violet wash') ?? []
    expect(ratio(pane(whiteOf('--ex-glass-strong'), violetWash!()), brand('status-success'))).toBeLessThan(4.5)
  })
})

/**
 * The booking form's dialog (F-192c) lies on the violet close, an opaque band, and frosts nothing: its white over the
 * hall violet itself. It carries ink, its muted labels and hints, and the violet of a focused label.
 */
describe('the booking form’s dialog reads on the violet close (F-192c)', () => {
  it.each(['ink', 'ink-muted', 'hall-violet'] as const)('%s on the dialog over the violet band', (text) => {
    expect(ratio(over(brand('surface-raised'), whiteOf('--site-dialog'), brand('hall-violet')), TEXT[text]())).toBeGreaterThanOrEqual(4.5)
  })
})

/** The app's type, shadow, hover, pill and radius variables (F-192a AC 3): their values as `shell.module.css` held them. */
const APP_VARIABLES = {
  '--app-display': "var(--font-archivo, 'Archivo'), var(--evemos-family-display)",
  '--app-sans': "var(--font-instrument-sans, 'Instrument Sans'), var(--evemos-family-sans)",
  '--app-mono': "var(--font-jetbrains-mono, 'JetBrains Mono'), var(--evemos-family-mono)",
  '--app-shadow':
    '0 0 0 1px color-mix(in srgb, var(--evemos-ink) 4%, transparent), 0 1px 2px color-mix(in srgb, var(--evemos-ink) 4%, transparent), 0 8px 24px -12px color-mix(in srgb, var(--evemos-ink) 8%, transparent)',
  '--app-primary-hover': 'color-mix(in oklab, var(--evemos-hall-violet) 82%, var(--evemos-ink))',
  '--app-pill': '999px',
  '--app-r-lg': '20px',
  '--app-r-md': '14px',
  '--app-r-sm': '10px',
} as const

describe('the app’s type, pill and radius variables live in its token file, so the site reads them too (AC 3)', () => {
  /** The declarations of glass-motion.css's first `:root` block. */
  const root = /:root\s*\{([^}]*)\}/.exec(TOKENS)?.[1] ?? ''

  it.each(Object.entries(APP_VARIABLES))('glass-motion.css :root defines %s, unchanged', (name, value) => {
    expect(valueIn(root, 'glass-motion.css :root', name)).toBe(value)
    expect(TOKENS.split(`${name}:`)).toHaveLength(2)
  })

  it.each(Object.keys(APP_VARIABLES))('shell.module.css no longer defines %s', (name) => {
    expect(SHELL).not.toContain(`${name}:`)
  })
})

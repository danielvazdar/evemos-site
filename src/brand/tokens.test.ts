import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  buildBrandTokenCss,
  parseBrandTokens,
  resolveColour,
  THEMES,
  type Theme,
} from '../../scripts/build-brand-tokens'
import { CONTRAST_PAIRS, contrastRatio, DERIVED_COLOURS, mixOklab, mixSrgb, type Mix } from './contrast-pairs'

/**
 * The brand file, its generated stylesheet and the contrast floor (F-020a).
 *
 * Everything reads `tokens.json` from disk, so replacing the brand book's file
 * retests the drift, the references and every contrast pair automatically.
 */

const SOURCE = join(process.cwd(), 'src', 'brand', 'tokens.json')
const GENERATED = join(process.cwd(), 'src', 'app', '(payload)', '_brand-tokens.generated.scss')
const CUSTOM_SCSS = join(process.cwd(), 'src', 'app', '(payload)', 'custom.scss')

const readJson = (): unknown => JSON.parse(readFileSync(SOURCE, 'utf8'))

interface ColourTokenJson {
  name: string
  value: unknown
}

/** The real brand file with its colour list rewritten — a fresh object, the original untouched. */
const withColours = (rewrite: (tokens: ColourTokenJson[]) => ColourTokenJson[]): unknown => {
  const json = readJson() as { color: { tokens: ColourTokenJson[] } }
  return { ...json, color: { ...json.color, tokens: rewrite(json.color.tokens) } }
}

/** The body of one block of the generated stylesheet, top-level or inside an at-rule, up to its own closing brace. */
const block = (css: string, selector: string): string => {
  const start = css.indexOf(`${selector} {`)
  if (start === -1) throw new Error(`no ${selector} block`)
  let depth = 0
  for (let at = css.indexOf('{', start); at < css.length; at++) {
    if (css[at] === '{') depth++
    if (css[at] === '}' && --depth === 0) return css.slice(start, at)
  }
  throw new Error(`unclosed ${selector} block`)
}

const DARK = "html[data-theme='dark']"
/** "Same as my device" on a device set to dark (F-159a). */
const DEVICE = "html[data-theme='device']"

describe('generated brand tokens', () => {
  it('the committed stylesheet matches tokens.json — run `npx tsx scripts/build-brand-tokens.ts`', () => {
    expect(readFileSync(GENERATED, 'utf8')).toBe(buildBrandTokenCss(readJson()))
  })

  it('defines every colour token in both themes, references as var()', () => {
    const css = readFileSync(GENERATED, 'utf8')
    const tokens = parseBrandTokens(readJson())
    for (const selector of [':root', DARK, DEVICE]) {
      const body = block(css, selector)
      for (const token of tokens.color.tokens) {
        const expected =
          typeof token.value === 'string'
            ? `var(--evemos-${token.value.slice(1, -1)})`
            : expect.stringMatching(/^#[0-9a-f]{6}$/)
        const declared = new RegExp(`--evemos-${token.name}: ([^;]+);`).exec(body)?.[1]
        expect({ token: token.name, selector, value: declared }).toEqual({
          token: token.name,
          selector,
          value: expected,
        })
      }
    }
  })

  // F-159a: the organiser app's dark blocks, screen only, so paper prints light.
  it('puts the dark block and the device block under @media screen, and nowhere else', () => {
    const css = readFileSync(GENERATED, 'utf8')
    expect(css).toContain(`@media screen {\n  ${DARK} {`)
    expect(css).toContain(`@media screen and (prefers-color-scheme: dark) {\n  ${DEVICE} {`)
    expect(css.split('data-theme=')).toHaveLength(3)
  })

  it('gives the device block exactly the dark values', () => {
    const css = readFileSync(GENERATED, 'utf8')
    const tokens = parseBrandTokens(readJson())
    const declarations = (selector: string) => block(css, selector).split('\n').filter((line) => line.trim().startsWith('--'))
    expect(declarations(DEVICE)).toEqual(declarations(DARK))
    for (const token of tokens.color.tokens.filter((one) => typeof one.value !== 'string')) {
      expect(block(css, DEVICE)).toContain(`--evemos-${token.name}: ${resolveColour(tokens, token.name, 'dark')};`)
    }
  })

  // F-159a: what stays light in either theme (the first-run preview) reads these.
  it('emits a light copy of every colour token on :root, which no dark block re-values', () => {
    const css = readFileSync(GENERATED, 'utf8')
    const tokens = parseBrandTokens(readJson())
    const root = block(css, ':root')
    for (const token of tokens.color.tokens) {
      const expected =
        typeof token.value === 'string'
          ? `var(--evemos-light-${token.value.slice(1, -1)})`
          : resolveColour(tokens, token.name, 'light')
      expect(root).toContain(`--evemos-light-${token.name}: ${expected};`)
    }
    for (const selector of [DARK, DEVICE]) expect(block(css, selector)).not.toContain('--evemos-light-')
  })

  it('throws when a token would write over a light copy', () => {
    const json = withColours((tokens) => [...tokens, { name: 'light-ink', value: { light: '#000000', dark: '#ffffff' } }])
    expect(() => buildBrandTokenCss(json)).toThrow(/duplicate name light-ink/)
  })

  it('a reference follows its target, so booth-sold is hall-violet in both themes', () => {
    const tokens = parseBrandTokens(readJson())
    for (const theme of THEMES) {
      expect(resolveColour(tokens, 'booth-sold', theme)).toBe(resolveColour(tokens, 'hall-violet', theme))
    }
  })

  it('emits spacing, radius, families and type styles', () => {
    const root = block(readFileSync(GENERATED, 'utf8'), ':root')
    for (const name of ['space-1', 'space-2', 'space-4', 'space-8', 'radius-sm', 'radius-md', 'radius-lg']) {
      expect(root).toContain(`--evemos-${name}:`)
    }
    for (const family of ['display', 'sans', 'mono']) expect(root).toContain(`--evemos-family-${family}:`)
    for (const style of ['display', 'headline', 'title', 'body', 'body-strong', 'label', 'code']) {
      for (const part of ['size', 'line', 'weight', 'tracking']) {
        expect(root).toContain(`--evemos-type-${style}-${part}:`)
      }
    }
  })
})

describe('brand file validation', () => {
  it('throws on an unknown reference', () => {
    const json = withColours((tokens) => [...tokens, { name: 'booth-ghost', value: '{no-such-token}' }])
    expect(() => buildBrandTokenCss(json)).toThrow(/unknown colour token "no-such-token"/)
  })

  it('throws on a reference cycle', () => {
    const json = withColours((tokens) => [
      ...tokens,
      { name: 'loop-a', value: '{loop-b}' },
      { name: 'loop-b', value: '{loop-a}' },
    ])
    expect(() => buildBrandTokenCss(json)).toThrow(/reference cycle/)
  })

  it('throws on a duplicate name', () => {
    const json = withColours((tokens) => [...tokens, { name: 'ink', value: { light: '#000000', dark: '#ffffff' } }])
    expect(() => buildBrandTokenCss(json)).toThrow(/duplicate name ink/)
  })

  it('throws on a missing theme value', () => {
    const json = withColours((tokens) =>
      tokens.map((token) => (token.name === 'paper' ? { name: 'paper', value: { light: '#F6F7FB' } } : token)),
    )
    expect(() => buildBrandTokenCss(json)).toThrow(/invalid tokens\.json[\s\S]*dark/)
  })

  it('throws on a value that is not a 6-digit hex', () => {
    const json = withColours((tokens) =>
      tokens.map((token) => (token.name === 'ink' ? { name: 'ink', value: { light: 'black', dark: '#fff' } } : token)),
    )
    expect(() => buildBrandTokenCss(json)).toThrow(/6-digit hex/)
  })
})

describe('contrast', () => {
  const tokens = parseBrandTokens(readJson())
  const known = new Set(tokens.color.tokens.map((token) => token.name))
  const derived = new Map(DERIVED_COLOURS.map((colour) => [colour.name, colour]))

  /** A token's hex, or a derived colour's `color-mix` computed from its tokens. */
  const resolve = (name: string, theme: Theme): string => {
    const colour = derived.get(name)
    if (!colour) return resolveColour(tokens, name, theme)
    const { a, percent, b } = colour[theme]
    return mixOklab(resolveColour(tokens, a, theme), percent, resolveColour(tokens, b, theme))
  }

  const declaration = (property: string, { a, percent, b }: Mix) =>
    `${property}: color-mix(in oklab, var(--evemos-${a}) ${percent}%, var(--evemos-${b}));`

  it('every pair names a token in tokens.json or a derived colour', () => {
    const unknown = CONTRAST_PAIRS.flatMap((pair) => [pair.fg, pair.bg]).filter(
      (name) => !known.has(name) && !derived.has(name),
    )
    expect(unknown).toEqual([])
  })

  it('every derived colour mixes tokens and is declared in custom.scss exactly as listed', () => {
    const scss = readFileSync(CUSTOM_SCSS, 'utf8')
    const operands = DERIVED_COLOURS.flatMap((colour) => THEMES.flatMap((theme) => [colour[theme].a, colour[theme].b]))
    expect(operands.filter((name) => !known.has(name))).toEqual([])
    const missing = DERIVED_COLOURS.flatMap((colour) =>
      [...new Set(THEMES.map((theme) => declaration(colour.property, colour[theme])))].filter(
        (text) => !scss.includes(text),
      ),
    )
    expect(missing).toEqual([])
  })

  it.each(THEMES)('every pair clears its floor in the %s theme', (theme) => {
    const failures = CONTRAST_PAIRS.map((pair) => ({
      pair: `${pair.fg} on ${pair.bg} (${pair.where})`,
      ratio: contrastRatio(resolve(pair.fg, theme), resolve(pair.bg, theme)),
      min: pair.min,
    }))
      .filter(({ ratio, min }) => ratio < min)
      .map(({ pair, ratio, min }) => `${pair}: ${ratio.toFixed(2)} < ${min}`)
    expect(failures).toEqual([])
  })

  it('mixes in OKLab as color-mix does', () => {
    expect(mixOklab('#4a2ff0', 100, '#10131c')).toBe('#4a2ff0')
    expect(mixOklab('#4a2ff0', 0, '#10131c')).toBe('#10131c')
    // OKLab's midpoint between black and white is L 0.5, which is #636363 in sRGB.
    expect(mixOklab('#000000', 50, '#ffffff')).toBe('#636363')
    expect(() => mixOklab('#000000', 101, '#ffffff')).toThrow(/outside/)
  })

  it('mixes in sRGB as color-mix does', () => {
    expect(mixSrgb('#4a2ff0', 100, '#10131c')).toBe('#4a2ff0')
    expect(mixSrgb('#4a2ff0', 0, '#10131c')).toBe('#10131c')
    expect(mixSrgb('#000000', 50, '#ffffff')).toBe('#808080')
    expect(() => mixSrgb('#000000', -1, '#ffffff')).toThrow(/outside/)
  })

  it('computes WCAG ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5)
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5)
    expect(contrastRatio('#4a2ff0', '#4a2ff0')).toBe(1)
    // The brand book's own figure: white on hall-violet, 7.1:1.
    expect(contrastRatio('#ffffff', '#4a2ff0')).toBeCloseTo(7.1, 1)
  })
})

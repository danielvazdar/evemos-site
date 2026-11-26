/**
 * The site's building blocks (F-021a). Rendered with `renderToStaticMarkup`, as
 * the organiser Header test does; none of them holds a hook, so no DOM is
 * needed. F-192a: pill buttons that press like the app's, the `open` and
 * `violet` tones, and the demo's column.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ArrowRight, CalendarDays } from 'lucide-react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import styles from './primitives.module.css'
import {
  Button,
  ButtonLink,
  ButtonRow,
  Chip,
  CHIP_TONES,
  Container,
  Section,
  SectionHeading,
  SiteIcon,
} from './primitives'

/** The opening tag of the first element matching `tag`, attributes included. */
const openingTag = (html: string, tag: string): string => html.match(new RegExp(`<${tag}\\b[^>]*>`))?.[0] ?? ''

describe('ButtonLink', () => {
  it('is an <a> to the href, with the label as its text and the icon hidden', () => {
    const html = renderToStaticMarkup(
      <ButtonLink href="/#demo" variant="primary" icon={CalendarDays}>
        Book a demo
      </ButtonLink>,
    )

    expect(html.startsWith('<a ')).toBe(true)
    expect(openingTag(html, 'a')).toContain('href="/#demo"')
    expect(html).toContain('<span>Book a demo</span>')
    expect(openingTag(html, 'svg')).toContain('aria-hidden="true"')
    expect(html).not.toContain('<button')
  })

  it('draws no icon when given none', () => {
    const html = renderToStaticMarkup(
      <ButtonLink href="/#floor-plan" variant="secondary">
        See the floor plan
      </ButtonLink>,
    )

    expect(html).not.toContain('<svg')
  })

  it.each(['primary', 'secondary'] as const)('gives the %s variant its own class', (variant) => {
    const html = renderToStaticMarkup(
      <ButtonLink href="/" variant={variant}>
        Go
      </ButtonLink>,
    )

    expect(openingTag(html, 'a')).toContain(`class="${styles.button} ${styles[variant]}"`)
  })
})

describe('Button and ButtonRow', () => {
  it('Button is a type="button" with the ButtonLink look', () => {
    const html = renderToStaticMarkup(
      <Button variant="primary" onClick={() => undefined}>
        Try again
      </Button>,
    )

    expect(html).toBe(`<button type="button" class="${styles.button} ${styles.primary}">Try again</button>`)
  })

  it('ButtonRow wraps its buttons', () => {
    const html = renderToStaticMarkup(
      <ButtonRow>
        <ButtonLink href="/" variant="secondary">
          Home
        </ButtonLink>
      </ButtonRow>,
    )

    expect(html.startsWith(`<div class="${styles.buttonRow}"><a `)).toBe(true)
  })
})

describe('Chip', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(CHIP_TONES)('maps the %s tone to its class and shows the word', (tone) => {
    const html = renderToStaticMarkup(<Chip tone={tone}>Confirmed</Chip>)

    expect(html).toBe(`<span class="${styles.chip} ${styles[`chip-${tone}`]}">Confirmed</span>`)
  })

  it('gives every tone a different class, each one styled in the stylesheet', () => {
    const css = readFileSync(join(process.cwd(), 'src', 'site', 'ui', 'primitives.module.css'), 'utf8')
    const classes = CHIP_TONES.map((tone) => styles[`chip-${tone}`])

    expect(new Set(classes).size).toBe(CHIP_TONES.length)
    for (const tone of CHIP_TONES) expect(css).toMatch(new RegExp(`\\.chip-${tone}\\s*\\{`))
  })

  it.each(['', '   '])('draws nothing for the empty word %j, and says so in development', (word) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    expect(renderToStaticMarkup(<Chip tone="success">{word}</Chip>)).toBe('')
    expect(warn).toHaveBeenCalledOnce()
  })
})

describe('SectionHeading', () => {
  it.each([
    [1, 'h1'],
    [2, 'h2'],
  ] as const)('level %i renders an %s carrying the id', (level, tag) => {
    const html = renderToStaticMarkup(<SectionHeading id="who-title" title="Everyone in your hall" level={level} />)

    expect(html).toContain(`<${tag} id="who-title">Everyone in your hall</${tag}>`)
    expect(html.match(/<h[1-6]\b/g)).toEqual([`<${tag}`])
  })

  it('shows the lead only when given, and never a label over the title', () => {
    const bare = renderToStaticMarkup(<SectionHeading id="a" title="Title" level={2} />)
    const full = renderToStaticMarkup(<SectionHeading id="a" title="Title" lead="One line under it." level={2} />)

    expect(bare).not.toContain('<p')
    expect(full).toMatch(/^<div[^>]*><h2/)
    expect(full).toContain(`<p class="${styles.lead}">One line under it.</p>`)
  })

  it('wires up with a Section through aria-labelledby', () => {
    const html = renderToStaticMarkup(
      <Section id="who" tone="raised" labelledBy="who-title">
        <SectionHeading id="who-title" title="Everyone in your hall" level={2} />
      </Section>,
    )

    expect(openingTag(html, 'section')).toBe(
      `<section id="who" aria-labelledby="who-title" class="${styles.section} ${styles.raised}">`,
    )
    expect(html).toContain('id="who-title"')
    expect(html).toContain(`<div class="${styles.container}">`)
  })
})

describe('SiteIcon', () => {
  it('draws a 1.5px stroke in the text colour, hidden from screen readers', () => {
    const svg = openingTag(renderToStaticMarkup(<SiteIcon icon={ArrowRight} />), 'svg')

    expect(svg).toContain('stroke-width="1.5"')
    expect(svg).toContain('stroke="currentColor"')
    expect(svg).toContain('aria-hidden="true"')
    expect(svg).toContain('width="20"')
  })

  it('takes the 16px size', () => {
    expect(openingTag(renderToStaticMarkup(<SiteIcon icon={ArrowRight} size={16} />), 'svg')).toContain('width="16"')
  })
})

/** primitives.module.css without its comments. */
const CSS = readFileSync(join(process.cwd(), 'src', 'site', 'ui', 'primitives.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')

/** The declarations of the first rule in `css` whose selector list holds `selector`. */
const ruleIn = (css: string, selector: string): string =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(([, selectors]) => selectors.split(',').some((one) => one.trim() === selector))?.[2] ?? ''

/** Every `@media <query> { … }` block's body, joined, one level of nested rules deep. */
const mediaIn = (query: string): string =>
  [...CSS.matchAll(/@media ([^{]+)\{((?:[^{}]|\{[^{}]*\})*)\}/g)]
    .filter(([, prelude]) => prelude.trim() === query)
    .map(([, , body]) => body)
    .join('\n')

describe('buttons are pills that press like the app’s (F-192a AC 8, Q2 = A)', () => {
  const button = ruleIn(CSS, '.button')

  it('rounds both ends with the app’s pill, and springs back from a press over --ex-t-base', () => {
    expect(button).toMatch(/border-radius: var\(--app-pill\);/)
    expect(button).toMatch(/transform var\(--ex-t-base\) var\(--ex-spring\)/)
  })

  it('presses down to .96 in --ex-t-press', () => {
    const pressed = ruleIn(CSS, '.button:active')
    expect(pressed).toMatch(/transform: scale\(0\.96\);/)
    expect(pressed).toMatch(/transition-duration: var\(--ex-t-press\);/)
  })

  it('lifts and darkens with a glow only for a pointer that hovers', () => {
    const hover = mediaIn('(hover: hover)')
    expect(ruleIn(hover, '.button:hover')).toMatch(/transform: translateY\(-1px\);/)
    expect(ruleIn(hover, '.primary:hover')).toMatch(/background: var\(--app-primary-hover\);/)
    expect(ruleIn(hover, '.primary:hover')).toMatch(/box-shadow: var\(--site-glow\);/)
    expect(ruleIn(CSS.replace(/@media[^{]+\{(?:[^{}]|\{[^{}]*\})*\}/g, ''), '.button:hover')).toBe('')
  })

  it('neither lifts nor shrinks with reduced motion', () => {
    expect(ruleIn(mediaIn('(prefers-reduced-motion: reduce)'), '.button:active')).toMatch(/transform: none;/)
    expect(ruleIn(mediaIn('(prefers-reduced-motion: reduce)'), '.button:hover')).toMatch(/transform: none;/)
  })
})

describe('Section tones (F-192a AC 8)', () => {
  it.each(['paper', 'raised', 'open', 'violet'] as const)('takes the %s tone as its class', (tone) => {
    const html = renderToStaticMarkup(
      <Section tone={tone} labelledBy="t">
        <SectionHeading id="t" title="Title" level={2} />
      </Section>,
    )
    expect(openingTag(html, 'section')).toBe(`<section aria-labelledby="t" class="${styles.section} ${styles[tone]}">`)
    expect(styles[tone]).toBeTruthy()
  })

  it('open lets the backdrop show; violet is hall violet in its own text colour, links and lead included', () => {
    expect(ruleIn(CSS, '.open')).toMatch(/background: transparent;/)
    expect(ruleIn(CSS, '.violet')).toMatch(/background: var\(--evemos-hall-violet\);/)
    expect(ruleIn(CSS, '.violet')).toMatch(/color: var\(--evemos-on-hall-violet\);/)
    expect(ruleIn(CSS, '.violet a:not(.button)')).toMatch(/color: inherit;/)
    expect(ruleIn(CSS, '.violet .lead')).toMatch(/color: inherit;/)
  })
})

describe('Container (F-192a)', () => {
  it('wraps its children', () => {
    expect(renderToStaticMarkup(<Container>Body</Container>)).toBe(`<div class="${styles.container}">Body</div>`)
  })

  it('is the demo’s column: 1280px at most, with a 16 to 48px gutter', () => {
    const column = ruleIn(CSS, '.container')
    expect(column).toMatch(/--gutter: clamp\(16px, 3\.4vw, 48px\);/)
    expect(column).toMatch(/width: min\(1280px, 100% - 2 \* var\(--gutter\)\);/)
    expect(column).toMatch(/margin-inline: auto;/)
  })
})

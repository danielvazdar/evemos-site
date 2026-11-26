/**
 * The site header and footer (F-021a): every link goes where `links.ts` says,
 * the header has one "Book a demo", the phone menu holds the same nav, and
 * nothing links to `#`. Rendered with `renderToStaticMarkup`, as the organiser
 * Header test does. F-069a (#222): the phone menu's order, the footer's
 * duplicates and the smooth-scroll rule. F-192a: the floating glass bar, its
 * menus' placing and closing motion, and the page change.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { PRODUCT_NAME } from '@/lib/product'
import { importSpecifiers, RESOLVE_AS, resolveSpecifier } from '@/lib/testing/source-scan'
import { links, SITE_HREFS, SITE_PAGES } from '@/site/links'
import { OFFICE_LINE } from '@/site/company'
import { ONE_LINER } from '@/site/positioning'
import { MENUS, TEMPLATED_PATHS } from '@/site/sitemap'

import { panelLeft } from './DropdownNav'
import { closeMenu, exitMs, isClosing, keepOpen } from './menu-close'
import { isCloseClick, isCloseKey, isLinkClick } from './PhoneMenu'
import { COMPANY_LINKS, FOOTER_COLUMNS, SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

/**
 * The product name comes from `src/lib/product.ts` and nowhere else (AC 14).
 * With it swapped for a stand-in, a typed-in "Evemos" is the only way the real
 * name could still reach the markup.
 */
vi.mock('@/lib/product', () => ({ PRODUCT_NAME: 'Stand-in Name' }))

interface Anchor {
  href: string
  text: string
  ariaLabel?: string
}

/** Every anchor in the markup, with its visible text (tags and React's `<!-- -->` separators removed). */
const anchors = (html: string): Anchor[] =>
  [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map(([, attrs, inner]) => ({
    href: /\bhref="([^"]*)"/.exec(attrs)?.[1] ?? '',
    text: textOf(inner),
    ariaLabel: /\baria-label="([^"]*)"/.exec(attrs)?.[1],
  }))

const textOf = (html: string): string =>
  html
    .replace(/<!-- -->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/** The inner HTML of the first element whose opening tag matches. */
const inner = (html: string, open: RegExp, tag: string): string => {
  const start = html.search(open)
  if (start === -1) throw new Error(`no element matching ${open}`)
  const from = html.indexOf('>', start) + 1
  const end = html.indexOf(`</${tag}>`, from)
  return html.slice(from, end)
}

const pairs = (list: Anchor[]) => list.map(({ text, href }) => [text, href])

/** Every page a header or footer link may point at: the routes in links.ts plus the templated pages. */
const KNOWN: ReadonlySet<string> = new Set([...SITE_HREFS, ...TEMPLATED_PATHS])

/** True when the path is a page this app serves: a static route file or a templated page. */
const isPage = (href: string): boolean =>
  TEMPLATED_PATHS.includes(href) ||
  href === links.home ||
  existsSync(join(process.cwd(), 'src', 'app', '(site)', ...href.slice(1).split('/'), 'page.tsx'))

describe('SiteHeader', () => {
  const html = renderToStaticMarkup(<SiteHeader />)
  const all = anchors(html)

  it('links the lockup home, named after the product', () => {
    const lockup = all.filter((a) => a.ariaLabel === PRODUCT_NAME)

    expect(lockup.map((a) => a.href)).toEqual([links.home])
    expect(lockup[0].text).toBe(PRODUCT_NAME)
  })

  it('has "Log in" to the sign-in page and exactly one "Book a demo"', () => {
    expect(all.filter((a) => a.text === 'Log in').every((a) => a.href === links.login)).toBe(true)
    expect(all.filter((a) => a.text === 'Book a demo').map((a) => a.href)).toEqual([links.demo])
  })

  it('has a dropdown per site-map menu, in order: Product, Solutions, Services, Resources', () => {
    const bar = inner(html, /<nav aria-label="Main"/, 'nav')
    const buttons = [...bar.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/g)].map(([, text]) => textOf(text))

    expect(buttons).toEqual(MENUS.map((menu) => menu.label))
    expect(MENUS.map((menu) => menu.label)).toEqual(['Product', 'Solutions', 'Services', 'Resources'])
  })

  it('puts every page of every menu in the bar and in the phone menu', () => {
    const menu = inner(html, /<details\b[^>]*class="[^"]*menu[^"]*"/, 'details')
    const hrefs = new Set(anchors(html).map((a) => a.href))
    const menuHrefs = new Set(anchors(menu).map((a) => a.href))

    for (const item of MENUS.flatMap((m) => m.groups.flatMap((g) => g.items))) {
      expect(hrefs.has(item.href), item.href).toBe(true)
      expect(menuHrefs.has(item.href), item.href).toBe(true)
    }
  })

  it('phone menu starts with Pricing and Log in, before the menus (#222)', () => {
    const menu = inner(html, /<details\b[^>]*class="[^"]*menu[^"]*"/, 'details')

    expect(pairs(anchors(menu).slice(0, 2))).toEqual([
      ['Pricing', links.pricing],
      ['Log in', links.login],
    ])
    // Its own block, ruled off from the first menu like the menus are from each other.
    const quick = inner(menu, /<ul\b[^>]*class="[^"]*menuQuick[^"]*"/, 'ul')
    expect(pairs(anchors(quick))).toEqual([
      ['Pricing', links.pricing],
      ['Log in', links.login],
    ])
  })

  it('has no inline script or handler: the menus work without JavaScript and under the nonce CSP', () => {
    expect(html).not.toMatch(/<script|\son[a-z]+=/i)
  })

  it('every href is a known page or route, each one exists, and none is "#"', () => {
    expect(all.filter((a) => !KNOWN.has(a.href))).toEqual([])
    expect([...new Set(all.map((a) => a.href))].filter((href) => href.startsWith('/') && !href.startsWith('/#') && href !== links.login && !isPage(href))).toEqual([])
    expect(html).not.toMatch(/href="#/)
  })
})

describe('SiteFooter', () => {
  const html = renderToStaticMarkup(<SiteFooter />)
  const all = anchors(html)

  it('shows the one-liner, Book a demo and the current year with the product name', () => {
    const text = textOf(html)

    expect(text).toContain(ONE_LINER)
    expect(all.filter((a) => a.text === 'Book a demo').map((a) => a.href)).toEqual([links.demo])
    expect(text).toContain(`© ${new Date().getFullYear()} Kyuro. ${PRODUCT_NAME} is built and run by Kyuro, Croatia.`)
  })

  it('has a column per menu, then Company', () => {
    const columns = [...html.matchAll(/<nav aria-label="([^"]+)"/g)].map(([, label]) => label)
    expect(columns).toEqual([...MENUS.map((menu) => menu.label), 'Company', 'Legal'])
    expect(FOOTER_COLUMNS.at(-1)?.items).toEqual(COMPANY_LINKS)
  })

  it('lists every href once: About and Team only under Company (#222)', () => {
    const hrefs = all.map((a) => a.href)

    expect(hrefs.filter((href, index) => hrefs.indexOf(href) !== index)).toEqual([])
    const company = inner(html, /<nav aria-label="Company"/, 'nav')
    expect(anchors(company).map((a) => a.href)).toEqual(expect.arrayContaining([links.about, links.team]))
  })

  it('every page in SITE_PAGES (the sitemap list) has a route file', () => {
    for (const path of SITE_PAGES) {
      expect(existsSync(join(process.cwd(), 'src', 'app', '(site)', ...path.slice(1).split('/'), 'page.tsx')), path).toBe(true)
    }
  })

  it('keeps the copyright line, the offices and the Legal nav together in one strip (F-192a)', () => {
    const strip = /<div class="[^"]+"><p>©[\s\S]*?<\/nav><\/div>/.exec(html)?.[0] ?? ''
    expect(strip).toContain('is built and run by Kyuro, Croatia.')
    expect(strip).toContain(OFFICE_LINE)
    expect(strip).toContain('aria-label="Legal"')
  })

  it('has a Legal nav under the copyright line with Privacy and Terms from links.ts', () => {
    const legal = inner(html, /<nav aria-label="Legal"/, 'nav')

    expect(pairs(anchors(legal))).toEqual([
      ['Privacy', links.privacy],
      ['Terms', links.terms],
    ])
    expect(html.indexOf('aria-label="Legal"')).toBeGreaterThan(html.indexOf('is built and run by Kyuro'))
  })

  it("the legal links point at pages that exist, so the demo form's privacy link lands too", () => {
    expect(links.privacy).toBe('/privacy')
    expect(links.terms).toBe('/terms')
    for (const route of ['privacy', 'terms']) {
      expect(existsSync(join(process.cwd(), 'src', 'app', '(site)', route, 'page.tsx'))).toBe(true)
    }
  })

  it('every href is a known page or route, each one exists, and none is "#"', () => {
    expect(all.filter((a) => !KNOWN.has(a.href))).toEqual([])
    expect([...new Set(all.map((a) => a.href))].filter((href) => href.startsWith('/') && !href.startsWith('/#') && !isPage(href))).toEqual([])
    expect(html).not.toMatch(/href="#/)
  })
})

describe('site.scss smooth scrolling (#222)', () => {
  const scss = readFileSync(join(process.cwd(), 'src', 'site', 'styles', 'site.scss'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    '',
  )

  it('is smooth only under html:focus-within, inside the no-preference query, so load and Back jump straight', () => {
    const rules = [...scss.matchAll(/([^{};]+)\{[^{}]*scroll-behavior:\s*smooth/g)].map(([, selector]) => selector.trim())
    expect(rules).toEqual(['html:focus-within'])

    // The query's body, one level of nested rules deep.
    const query = /@media \(prefers-reduced-motion: no-preference\)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/.exec(scss)?.[1] ?? ''
    expect(query).toMatch(/html:focus-within\s*\{\s*scroll-behavior:\s*smooth;/)
  })
})

/** A stylesheet's code without its comments. */
const codeOf = (...path: string[]): string =>
  readFileSync(join(process.cwd(), ...path), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')

/** Every `@media <query> { … }` block's body in `css`, joined, one level of nested rules deep. */
const mediaBodies = (css: string, query: string): string =>
  [...css.matchAll(/@media ([^{]+)\{((?:[^{}]|\{[^{}]*\})*)\}/g)]
    .filter(([, prelude]) => prelude.trim() === query)
    .map(([, , body]) => body)
    .join('\n')

describe('the page change (F-192a AC 7)', () => {
  const scss = codeOf('src', 'site', 'styles', 'site.scss')

  it('is the browser’s cross-document view transition, only when motion is welcome', () => {
    const anywhere = [...scss.matchAll(/@view-transition\s*\{([^}]*)\}/g)]
    expect(anywhere.map(([, body]) => body.trim())).toEqual(['navigation: auto;'])
    expect(mediaBodies(scss, '(prefers-reduced-motion: no-preference)')).toMatch(/@view-transition\s*\{\s*navigation: auto;\s*\}/)
    expect(mediaBodies(scss, '(prefers-reduced-motion: reduce)')).not.toMatch(/view-transition/)
  })

  it('crossfades the whole page over --ex-t-fast on --ex-out, old and new alike', () => {
    const rule = /::view-transition-group\(root\),\s*::view-transition-old\(root\),\s*::view-transition-new\(root\)\s*\{([^}]*)\}/.exec(
      mediaBodies(scss, '(prefers-reduced-motion: no-preference)'),
    )?.[1]
    expect(rule).toMatch(/animation-duration: var\(--ex-t-fast\);/)
    expect(rule).toMatch(/animation-timing-function: var\(--ex-out\);/)
    const times = [...scss.matchAll(/::view-transition[^{]*\{([^}]*)\}/g)].flatMap(([, body]) =>
      [...body.matchAll(/animation-(?:duration|delay):\s*([^;]+);/g)].map(([, value]) => value.trim()),
    )
    expect(times.length).toBeGreaterThan(0)
    for (const time of times) expect(time).toMatch(/^var\(--ex-[a-z-]+\)$/)
  })

  // A named element is pictured without the frost behind it and stays a backdrop root, so the bar's glass and its
  // menus' would stop frosting; a named backdrop disappears under the page's picture (site.scss, checked in Chrome).
  it('names no element in any site stylesheet, so the bar, its menus and the backdrop keep their glass', () => {
    const sheets = [join('src', 'site'), join('src', 'app', '(site)')].flatMap((dir) =>
      (readdirSync(join(process.cwd(), dir), { recursive: true }) as string[])
        .filter((path) => /\.s?css$/.test(path))
        .map((path) => relative(process.cwd(), join(process.cwd(), dir, path))),
    )
    expect(sheets).toEqual(expect.arrayContaining([join('src', 'site', 'styles', 'site.scss'), join('src', 'site', 'chrome', 'chrome.module.css')]))
    expect(sheets.length).toBeGreaterThan(10)
    expect(sheets.filter((sheet) => /view-transition-name/.test(codeOf(sheet)))).toEqual([])
  })
})

describe('the floating glass bar (F-192a)', () => {
  const css = codeOf('src', 'site', 'chrome', 'chrome.module.css')
  const topLevel = css.replace(/@[a-z-]+[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, '')
  /** Every top-level declaration for `selector`, from each rule whose selector list holds it, in order. */
  const rule = (selector: string): string =>
    [...topLevel.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, selectors]) => selectors.split(',').some((one) => one.trim() === selector))
      .map(([, , body]) => body)
      .join('\n')

  it('floats the bar in a header that keeps its place and lets clicks through around it', () => {
    expect(rule('.header')).toMatch(/position: sticky;/)
    expect(rule('.header')).toMatch(/padding-top: var\(--site-bar-top\);/)
    expect(rule('.header')).toMatch(/pointer-events: none;/)
    expect(rule('.bar')).toMatch(/height: var\(--site-bar-height\);/)
    expect(rule('.bar')).toMatch(/pointer-events: auto;/)
  })

  it('frosts the bar and its menus on a layer behind them, never on the bar itself', () => {
    for (const glass of ['.bar::before', '.dropdownPanel::before']) {
      expect(rule(glass), glass).toMatch(/backdrop-filter: var\(--ex-blur\);/)
      expect(rule(glass), glass).toMatch(/z-index: -1;/)
    }
    expect(rule('.bar')).not.toMatch(/filter/)
    expect(rule('.dropdownPanel::before')).toMatch(/background: var\(--ex-sheen\), var\(--site-dropdown\);/)
    expect(rule('.bar::before')).toMatch(/background: var\(--ex-sheen\), var\(--ex-glass-strong\);/)
    expect(mediaBodies(css, '(prefers-reduced-transparency: reduce)')).toMatch(
      /\.bar::before,\s*\.dropdownPanel::before\s*\{\s*background: var\(--ex-solid\);\s*-webkit-backdrop-filter: none;\s*backdrop-filter: none;/,
    )
  })

  it('grows a menu from its button over --ex-t-base and shrinks it back over --ex-t-fast', () => {
    expect(rule('.dropdownPanel')).toMatch(/transform-origin: var\(--menu-origin, 40px\) 0;/)
    expect(rule('.dropdownPanel')).toMatch(/animation: [\w-]+ var\(--ex-t-base\) var\(--ex-out\);/)
    expect(rule('.dropdown[data-closing] > .dropdownPanel')).toMatch(/animation: [\w-]+ var\(--ex-t-fast\) var\(--ex-out\) forwards;/)
  })

  // F-192c review: an opacity on the card cut its frost (Chromium) and let the page read through it half-faded.
  it('moves the menu card only, its glass there almost at once and its lines fading in on it', () => {
    const keyframes = (name: string): string => new RegExp(`@keyframes ${name} \\{((?:[^{}]|\\{[^{}]*\\})*)\\}`).exec(css)?.[1] ?? ''
    const cardMoves = [/animation: ([\w-]+) var\(--ex-t-base\)/.exec(rule('.dropdownPanel'))?.[1], /animation: ([\w-]+) var\(--ex-t-fast\)/.exec(rule('.dropdown[data-closing] > .dropdownPanel'))?.[1]]
    for (const name of cardMoves) {
      expect(keyframes(name ?? ''), name).toMatch(/transform:/)
      expect(keyframes(name ?? ''), name).not.toMatch(/opacity/)
    }
    expect(rule('.dropdownPanel::before')).toMatch(/animation: [\w-]+ var\(--ex-t-press\) var\(--ex-out\);/)
    expect(rule('.dropdownPanel > *')).toMatch(/animation: [\w-]+ var\(--ex-t-base\) var\(--ex-out\);/)
  })

  // F-192a review: a hover a tap sets would stay on a touch screen.
  it('keeps every hover rule to pointers that hover', () => {
    expect(topLevel).not.toMatch(/:hover/)
    expect(mediaBodies(css, '(hover: hover)').match(/:hover/g)?.length).toBeGreaterThanOrEqual(4)
  })

  it('slides the hover pill with the spring and widens it with the ease', () => {
    expect(rule('.hoverPill')).toMatch(/transform var\(--ex-t-slow\) var\(--ex-spring\)/)
    expect(rule('.hoverPill')).toMatch(/width var\(--ex-t-base\) var\(--ex-out\)/)
    expect(rule('.hoverPill')).toMatch(/opacity: 0;/)
  })

  it('draws the pill as an empty, hidden span beside the bar’s list, so the list holds only items', () => {
    const html = renderToStaticMarkup(<SiteHeader />)
    const bar = inner(html, /<nav aria-label="Main"/, 'nav')
    expect(bar).toMatch(/^<span class="[^"]+" aria-hidden="true"><\/span><ul /)
  })
})

describe('placing a dropdown under its button', () => {
  it.each([
    ['under its button, 12px left of it', 300, 600, 1200, 288],
    ['kept off the bar’s left end', 10, 600, 1200, 8],
    ['kept off the bar’s right end', 900, 600, 1200, 592],
    ['wider than the bar: at its left end', 500, 1300, 1200, 8],
  ])('%s', (_name, buttonLeft, panelWidth, barWidth, expected) => {
    expect(panelLeft(buttonLeft, panelWidth, barWidth)).toBe(expected)
  })
})

describe('closing a menu with its motion', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  /** A `<details>` as `menu-close.ts` handles it: open, and its attributes. */
  const details = () => {
    const attributes = new Set<string>()
    return {
      open: true,
      setAttribute: (name: string) => void attributes.add(name),
      removeAttribute: (name: string) => void attributes.delete(name),
      hasAttribute: (name: string) => attributes.has(name),
    } as unknown as HTMLDetailsElement
  }

  it.each([
    ['280ms', false, 280],
    ['0.65s', false, 650],
    [' 450ms ', false, 450],
    ['650ms', true, 0],
    ['', false, 0],
    ['fast', false, 0],
  ])('reads %j (reduced motion %s) as %i ms', (value, reduced, expected) => {
    expect(exitMs(value, reduced)).toBe(expected)
  })

  it('plays the exit, then closes; a second close while it runs changes nothing', () => {
    vi.useFakeTimers()
    const menu = details()
    closeMenu(menu, 280)
    expect([menu.open, menu.hasAttribute('data-closing'), isClosing(menu)]).toEqual([true, true, true])
    vi.advanceTimersByTime(200)
    closeMenu(menu, 280)
    vi.advanceTimersByTime(80)
    expect([menu.open, menu.hasAttribute('data-closing'), isClosing(menu)]).toEqual([false, false, false])
  })

  it('closes at once without a motion', () => {
    const menu = details()
    closeMenu(menu, 0)
    expect([menu.open, menu.hasAttribute('data-closing')]).toEqual([false, false])
  })

  it('keeps a closing menu open when asked', () => {
    vi.useFakeTimers()
    const menu = details()
    closeMenu(menu, 280)
    keepOpen(menu)
    vi.advanceTimersByTime(1000)
    expect([menu.open, menu.hasAttribute('data-closing'), isClosing(menu)]).toEqual([true, false, false])
  })
})

describe('PhoneMenu helpers', () => {
  const element = (insideLink: boolean) => ({
    closest: (selector: string) => (insideLink && selector === 'a[href]' ? {} : null),
  })

  it('a click on a link, or inside one, closes the menu; anything else does not', () => {
    expect(isLinkClick(element(true) as unknown as EventTarget)).toBe(true)
    expect(isLinkClick(element(false) as unknown as EventTarget)).toBe(false)
    expect(isLinkClick({} as EventTarget)).toBe(false)
    expect(isLinkClick(null)).toBe(false)
  })

  it('Escape closes an open menu only', () => {
    expect(isCloseKey('Escape', true)).toBe(true)
    expect(isCloseKey('Escape', false)).toBe(false)
    expect(isCloseKey('Enter', true)).toBe(false)
  })

  it('a click on the sheet’s close button or its dim, or inside them, closes the sheet; anything else does not', () => {
    const at = (match: boolean) => ({ closest: (selector: string) => (match && selector === '[data-menu-close]' ? {} : null) })
    expect(isCloseClick(at(true) as unknown as EventTarget)).toBe(true)
    expect(isCloseClick(at(false) as unknown as EventTarget)).toBe(false)
    expect(isCloseClick(null)).toBe(false)
  })

  // F-192a review: the app's account menu (`UserMenuDetails.tsx`) takes `isCloseKey` from this file, so a stylesheet
  // anywhere under it would carry the site's chrome into every app page.
  it('loads no stylesheet, however deep, so the app can import from it', () => {
    const isFile = (file: string) => statSync(join(process.cwd(), file), { throwIfNoEntry: false })?.isFile() ?? false
    const loaded = new Set(['src/site/chrome/PhoneMenu.tsx'])
    const sheets: string[] = []
    for (const file of loaded) {
      for (const specifier of importSpecifiers(file, readFileSync(join(process.cwd(), file), 'utf8'), { values: true })) {
        if (/\.s?css$/.test(specifier)) sheets.push(`${file}: ${specifier}`)
        const target = resolveSpecifier(file, specifier)
        const next = target === undefined ? undefined : RESOLVE_AS.map((suffix) => target + suffix).find(isFile)
        if (next) loaded.add(next)
      }
    }
    expect(sheets).toEqual([])
    // The walk follows its imports: menu-close.ts is the one PhoneMenu loads today.
    expect([...loaded]).toContain('src/site/chrome/menu-close.ts')
  })
})

describe('the phone’s sheet (F-192a)', () => {
  const html = renderToStaticMarkup(<SiteHeader />)
  const menu = inner(html, /<details\b[^>]*class="[^"]*menu[^"]*"/, 'details')
  const css = codeOf('src', 'site', 'chrome', 'chrome.module.css')
  const topLevel = css.replace(/@[a-z-]+[^{]*\{(?:[^{}]|\{[^{}]*\})*\}/g, '')
  const rule = (selector: string): string =>
    [...topLevel.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter(([, selectors]) => selectors.split(',').some((one) => one.trim() === selector))
      .map(([, , body]) => body)
      .join('\n')

  it('opens with a close button, named for screen readers, and ends with the dim, which none of them hears', () => {
    expect(menu).toMatch(/<nav aria-label="Main" class="[^"]+"><button type="button" class="[^"]+" data-menu-close="true" aria-label="Close menu"><svg/)
    expect(menu).toMatch(/<\/nav><span class="[^"]+" data-menu-close="true" aria-hidden="true"><\/span>$/)
  })

  it('shows the close button and the dim only once the script has made the menu a sheet', () => {
    expect(rule('.dim')).toMatch(/display: none;/)
    expect(rule('.sheetClose')).toMatch(/display: none;/)
    expect(rule('.menu[data-sheet][open] .dim')).toMatch(/display: block;/)
    expect(rule('.menu[data-sheet] .sheetClose')).toMatch(/display: grid;/)
  })

  it('slides in from the left over a dim and back out, over --ex-t-slow, with 48px rows', () => {
    const sheet = rule('.menu[data-sheet] .menuPanel')
    expect(sheet).toMatch(/position: fixed;/)
    expect(sheet).toMatch(/left: var\(--evemos-space-2\);/)
    expect(sheet).toMatch(/animation: [\w-]+ var\(--ex-t-slow\) var\(--ex-out\);/)
    expect(rule('.menu[data-sheet][data-closing] .menuPanel')).toMatch(/animation: [\w-]+ var\(--ex-t-slow\) var\(--ex-out\) forwards;/)
    expect(rule('.menu[data-sheet][open] .dim')).toMatch(/background: var\(--site-dim\);/)
    expect(rule('.menu[data-sheet] .menuPanel .navLink')).toMatch(/min-height: 48px;/)
  })
})

describe('the product name', () => {
  it.each([
    ['header', <SiteHeader key="header" />],
    ['footer', <SiteFooter key="footer" />],
  ])('the %s never types it in', (_name, element) => {
    const html = renderToStaticMarkup(element)

    expect(PRODUCT_NAME).toBe('Stand-in Name')
    expect(html).toContain('Stand-in Name')
    expect(html).not.toContain('Evemos')
    // The old name in any case, anywhere in the markup: attributes and class names included (F-046a review, F-152a).
    expect(html).not.toMatch(/expono/i)
  })
})

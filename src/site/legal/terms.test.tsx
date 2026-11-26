/**
 * The terms at `/terms` (F-022), rendered as a visitor gets them: header,
 * page and footer. Pins the version to the amendment log, the statements a
 * Croatian business's terms must make, and the copy rules: no business detail
 * or product name typed in, no long dashes, safe links only.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import TermsPage from '@/app/(site)/terms/page'
import { PRODUCT_NAME } from '@/lib/product'
import { SiteFooter } from '@/site/chrome/SiteFooter'
import { SiteHeader } from '@/site/chrome/SiteHeader'

import { CONTROLLER } from './controller'
import { formatLegalDate, type LegalDocumentContent } from './LegalDocument'
import { PRIVACY_DOCUMENT } from './privacy-content'
import { TERMS_DOCUMENT, TERMS_VERSION } from './terms-content'

/** With the name swapped for a stand-in, a typed-in "Evemos" is the only way the real name could reach the page (AC 11). The old name must not come back either (F-046a). */
vi.mock('@/lib/product', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/product')>()),
  PRODUCT_NAME: 'Stand-in Name',
}))

const SOURCE_PATH = join(process.cwd(), 'src', 'site', 'legal', 'terms-content.ts')
const source = readFileSync(SOURCE_PATH, 'utf8')

/** The amendment log is the leading comment, before the first export (as the forked platform's version guard reads it). */
const amendmentLog = (text: string): string => text.split('export const')[0] ?? ''

const html = renderToStaticMarkup(
  <>
    <SiteHeader />
    <main id="main">
      <TermsPage />
    </main>
    <SiteFooter />
  </>,
)

const text = html
  .replace(/<!-- -->/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&quot;/g, '"')
  .replace(/&#x27;/g, "'")
  .replace(/\s+/g, ' ')
  .trim()
const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(([, href]) => href)
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id))

describe('terms: version', () => {
  it('reads the real content module (the guard must not pass on an empty string)', () => {
    expect(source.length).toBeGreaterThan(3000)
    expect(amendmentLog(source).length).toBeGreaterThan(200)
  })

  it('TERMS_VERSION is the newest date in the amendment log, and the newest history entry', () => {
    const dates = amendmentLog(source).match(/\b20\d{2}-\d{2}-\d{2}\b/g) ?? []

    expect(dates.length).toBeGreaterThan(0)
    expect(
      [...dates].sort().at(-1),
      'The terms were amended after TERMS_VERSION was last set. Bump it and add a history entry.',
    ).toBe(TERMS_VERSION)
    expect(TERMS_DOCUMENT.version).toBe(TERMS_VERSION)
    expect(TERMS_DOCUMENT.history[0].version).toBe(TERMS_VERSION)
  })

  it('the last line of the log (newest last) is TERMS_VERSION, and history[0] tells the same change (F-142a)', () => {
    const logDates = [...amendmentLog(source).matchAll(/^\/\/\s+(20\d{2}-\d{2}-\d{2})\s/gm)].map(([, day]) => day)

    expect(logDates.at(-1)).toBe(TERMS_VERSION)
    expect(logDates).toEqual([...logDates].sort())
    expect(amendmentLog(source)).toMatch(new RegExp(`${TERMS_VERSION}\\s+Data processing terms: VAT numbers`))
    expect(TERMS_DOCUMENT.history[0].summary).toContain('VIES')
    const versions = TERMS_DOCUMENT.history.map((entry) => entry.version)
    expect(versions).toEqual([...new Set(versions)].sort().reverse())
  })

  it('prints that date as "Last updated"', () => {
    expect(text).toContain(`Last updated ${formatLegalDate(TERMS_VERSION)}`)
  })
})

describe('terms: page', () => {
  it('renders inside the site chrome with one h1', () => {
    expect(html).toContain('<header')
    expect(html).toContain('<footer')
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toMatch(/<h1[^>]*>Terms<\/h1>/)
  })

  it('every contents link lands on a section of the page', () => {
    const nav = /<nav aria-labelledby="legal-contents"[\s\S]*?<\/nav>/.exec(html)?.[0] ?? ''
    const own = [...nav.matchAll(/href="([^"]*)"/g)].map(([, href]) => href)

    expect(own.length).toBe(TERMS_DOCUMENT.sections.length + 1)
    expect(own.every((href) => href.startsWith('/terms#'))).toBe(true)
    expect(own.filter((href) => !ids.has(href.slice('/terms#'.length)))).toEqual([])
  })
})

describe('terms: what they must state', () => {
  it.each([
    ['the business from CONTROLLER', CONTROLLER.legalName],
    ['the OIB from CONTROLLER', CONTROLLER.oib],
    ['the register entry from CONTROLLER', CONTROLLER.register],
    ['the website and demo scope', 'These terms cover your use of the Stand-in Name website and your requests for a demo'],
    ['the organiser scope', "They also cover an organiser's subscription to the platform"],
    ['the order form as the contract', 'The order form and these terms together are the contract.'],
    ['fees from the order form, with no price', 'The fees are those in the order form.'],
    ['invoicing under Croatian law', 'invoices in euro under Croatian law, including the fiscalisation rules'],
    ['term and renewal', 'A subscription runs for the period in the order form.'],
    ['ending for breach', 'does not put it right within 30 days of being told'],
    ['getting the data out', 'a copy of the organiser data in a common, machine-readable format'],
    ['the processor role', 'the organiser is the controller and we are its processor'],
    ['the Art. 28 terms', 'They are the contract GDPR Art. 28(3) requires'],
    ['breach notice to the organiser', 'without undue delay after we become aware of a personal data breach'],
    ['no uptime promise', 'We do not promise a level of availability.'],
    ['the liability cap', 'is limited to the fees the organiser paid us in the 12 months'],
    ['Croatian law', 'Croatian law applies to these terms'],
    ['the carve-out for intent and gross negligence', 'damage caused on purpose or through gross negligence'],
    ['the consumer protections', 'the mandatory protections of the country where you live still apply'],
  ])('%s', (_name, statement) => {
    expect(text).toContain(statement)
  })

  it('the data processing terms name VIES as a public authority, not a sub-processor (L-05)', () => {
    const VIES =
      "VAT numbers in stand applications are checked with VIES, the European Commission's VAT number check. VIES receives only the number. The Commission runs it as a public authority, so it is not one of our sub-processors."
    const dataProcessing = TERMS_DOCUMENT.sections.find((section) => section.id === 'data-processing')
    const paragraphs = (dataProcessing?.blocks ?? []).flatMap((block) => (block.kind === 'p' && 'text' in block ? [block.text] : []))

    expect(paragraphs).toContain(VIES)
    expect(text).toContain(VIES)
  })

  it('links the privacy notice and both addresses from CONTROLLER', () => {
    expect(hrefs).toContain('/privacy')
    expect(hrefs).toContain(`mailto:${CONTROLLER.generalEmail}`)
    expect(hrefs).toContain(`mailto:${CONTROLLER.privacyEmail}`)
  })

  it('states no price and no uptime figure (E-14, voice book "Claims")', () => {
    expect(text).not.toMatch(/€|EUR ?\d|\d+([.,]\d+)? ?%/)
  })

  it('every link into the terms, from either document, lands on a section of the terms', () => {
    const termIds = new Set([...TERMS_DOCUMENT.sections, TERMS_DOCUMENT.changes].map((section) => section.id))
    const linksIn = (doc: LegalDocumentContent): string[] =>
      [...doc.sections, doc.changes]
        .flatMap((section) => section.blocks)
        .flatMap((block) => (block.kind === 'p' && 'parts' in block ? block.parts : []))
        .flatMap((part) => (typeof part === 'string' ? [] : [part.href]))
        .filter((href) => href.startsWith('/terms#'))
    const targets = [...linksIn(PRIVACY_DOCUMENT), ...linksIn(TERMS_DOCUMENT)]

    expect(targets).toContain('/terms#data-processing')
    expect(targets.filter((href) => !termIds.has(href.slice('/terms#'.length)))).toEqual([])
  })

  it('claims no registered trade mark', () => {
    expect(text).not.toMatch(/®|registered trade ?mark/i)
  })
})

describe('terms: copy rules', () => {
  it('no long dashes, in the source or on the page', () => {
    expect(source).not.toMatch(/[—–]/)
    expect(text).not.toMatch(/[—–]/)
  })

  it('the product name comes only from PRODUCT_NAME', () => {
    expect(PRODUCT_NAME).toBe('Stand-in Name')
    expect(html).not.toContain('Evemos')
    expect(source).not.toContain('Evemos')
    // The old name in any case, anywhere in the markup: attributes and class names included (F-046a review, F-152a).
    expect(html).not.toMatch(/expono/i)
    expect(text).not.toMatch(/expono/i)
    expect(source).not.toMatch(/expono/i)
  })

  it('every href is mailto, https or a site path; none is "#"', () => {
    expect(hrefs.filter((href) => !/^(mailto:|https:\/\/|\/(?!\/))/.test(href))).toEqual([])
    expect(html).not.toMatch(/href="#/)
  })

  it("the business's details are never typed into the content", () => {
    const details = [
      CONTROLLER.legalName,
      CONTROLLER.owner,
      CONTROLLER.oib,
      CONTROLLER.register,
      CONTROLLER.privacyEmail,
      CONTROLLER.generalEmail,
      ...CONTROLLER.address,
    ]

    expect(details.filter((value) => source.includes(value))).toEqual([])
  })

  it('names no service the platform does not use, and not the forked brand', () => {
    for (const pattern of [/Stripe/, /Attio/, /Brevo/, /Fillout/, /Airtable/, /Dropbox/, new RegExp(['DEF', 'CROS'].join(''), 'i')]) {
      expect(source).not.toMatch(pattern)
      // The terms themselves: the header and footer menus name the customer story (E-39).
      const documentHtml = html.slice(html.indexOf('<main'), html.indexOf('</main>'))
      expect(documentHtml.length).toBeGreaterThan(1000)
      expect(documentHtml.replace(/<[^>]+>/g, ' ')).not.toMatch(pattern)
    }
  })
})

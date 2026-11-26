/**
 * The privacy notice at `/privacy` (F-022), rendered as a visitor gets it:
 * header, page and footer. Pins what a reader could hold us to: the version
 * the demo form stamps, exactly the processors we use, the statements GDPR
 * requires, and no business detail or product name typed into the copy.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { PORTAL_ACCESS_DAYS_AFTER_SHOW, PORTAL_COOKIE, PORTAL_SESSION_SECONDS } from '@/access/portal'
import PrivacyPage from '@/app/(site)/privacy/page'
import { ROW_HEIGHT_COOKIE } from '@/lib/app/row-height'
import { STAFF_TOKEN_EXPIRATION_SECONDS } from '@/lib/auth-cookies'
import {
  PLATFORM_PRIVACY_URL,
  PLATFORM_PRIVACY_VERSION,
  PLATFORM_TERMS_URL,
  PRODUCT_NAME,
} from '@/lib/product'
import { SITE_URL } from '@/lib/site-config'
import { SSO_STATE_SECONDS } from '@/lib/sso/flow'
import { LOGIN_STEP_SECONDS } from '@/lib/two-step/login-flow'
import { SiteFooter } from '@/site/chrome/SiteFooter'
import { SiteHeader } from '@/site/chrome/SiteHeader'

import { CONTROLLER, findPlaceholders } from './controller'
import { formatLegalDate } from './LegalDocument'
import { NOTICE_COVERS, PRIVACY_DOCUMENT, PROCESSOR_NAMES, STATED_LIFETIMES } from './privacy-content'

/** With the name swapped for a stand-in, a typed-in "Evemos" is the only way the real name could reach the page (AC 11). The old name must not come back either (F-046a). */
vi.mock('@/lib/product', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/product')>()),
  PRODUCT_NAME: 'Stand-in Name',
}))

const SOURCE_PATH = join(process.cwd(), 'src', 'site', 'legal', 'privacy-content.ts')
const source = readFileSync(SOURCE_PATH, 'utf8')

const html = renderToStaticMarkup(
  <>
    <SiteHeader />
    <main id="main">
      <PrivacyPage />
    </main>
    <SiteFooter />
  </>,
)

const textOf = (markup: string): string =>
  markup
    .replace(/<!-- -->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

const text = textOf(html)
/** The notice itself, without the header and footer menus (which name the customer story, E-39). */
const documentText = textOf(html.slice(html.indexOf('<main'), html.indexOf('</main>')))
const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(([, href]) => href)
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id))

/** The row headers of the table whose scroll region carries this name. */
const rowHeads = (caption: string): string[] => {
  const start = html.indexOf(`aria-label="${caption}"`)
  if (start === -1) throw new Error(`no table named ${caption}`)
  const table = html.slice(start, html.indexOf('</table>', start))
  return [...table.matchAll(/<th scope="row">([\s\S]*?)<\/th>/g)].map(([, cell]) => textOf(cell))
}

/** One row of that table as rendered, its cells keyed by their column heading (`data-label`). */
const rowCells = (caption: string, rowHead: string): Record<string, string> => {
  const start = html.indexOf(`aria-label="${caption}"`)
  if (start === -1) throw new Error(`no table named ${caption}`)
  const table = html.slice(start, html.indexOf('</table>', start))
  const row = [...table.matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
    .map(([, cells]) => cells)
    .find((cells) => textOf(/<th scope="row">([\s\S]*?)<\/th>/.exec(cells)?.[1] ?? '') === rowHead)
  if (!row) throw new Error(`no row ${rowHead} in ${caption}`)
  return Object.fromEntries([...row.matchAll(/<td data-label="([^"]*)">([\s\S]*?)<\/td>/g)].map(([, label, cell]) => [label, textOf(cell)]))
}

/**
 * Services the notice must never name: none is used (no Stripe, no Attio until
 * #88), or they belonged to the platform this was forked from. The forked
 * brand is spelt in halves so this file passes `brand-leftovers.test.ts`.
 */
const FORBIDDEN = [
  /Stripe/,
  /Attio/,
  /Brevo/,
  /Fillout/,
  /Airtable/,
  /\bMake\b/,
  /Dropbox/,
  /Google Analytics/,
  new RegExp(['DEF', 'CROS'].join(''), 'i'),
]

describe('privacy notice: version', () => {
  it('reads the real content module (a renamed file must not pass on nothing)', () => {
    expect(source.length).toBeGreaterThan(5000)
  })

  it('the document, its newest history entry and the printed date are PLATFORM_PRIVACY_VERSION', () => {
    expect(PRIVACY_DOCUMENT.version).toBe(PLATFORM_PRIVACY_VERSION)
    expect(PRIVACY_DOCUMENT.history[0].version).toBe(PLATFORM_PRIVACY_VERSION)
    expect(text).toContain(`Last updated ${formatLegalDate(PLATFORM_PRIVACY_VERSION)}`)
  })

  // F-159b: 2026-11-19 was live when the theme came, so it has an entry of its own.
  it('the newest entry names the setting F-159b added: light or dark in the staff app', () => {
    expect(PRIVACY_DOCUMENT.history[0].summary).toBe('Added the setting that remembers light or dark in the staff app.')
  })

  // F-213b: the notes from our calls get a version of their own, after F-191d's (spec F-213b Design).
  it('the 2026-11-19 entry names what F-213b added: the notes from our calls with you', () => {
    expect(PRIVACY_DOCUMENT.history.find((entry) => entry.version === '2026-11-19')?.summary).toBe(
      'Added the notes we may keep from our calls with you: your role, the kinds of events you run, how many a year and how you heard about us.',
    )
  })

  // F-191d: 2026-11-14 was live when Google sign-in came, so it has an entry of its own.
  it('the 2026-11-15 entry names what F-191d added: the Google account ID on a staff account, and the cookies of a Google sign-in', () => {
    expect(PRIVACY_DOCUMENT.history.find((entry) => entry.version === '2026-11-15')?.summary).toBe(
      'Added signing in to the staff app with Google: your staff account now records the ID of the Google account you sign in with, and the staff sign-in cookies carry a Google sign-in too.',
    )
  })

  // F-172d: 2026-11-13 was live when the mention emails switch came, so it has an entry of its own. F-124 joins it:
  // neither was deployed when the row height came, so one version names both. F-172f joins it too, still undeployed:
  // the same switch covers the email for a task given to you.
  it('the 2026-11-14 entry names the settings F-172d, F-172f and F-124 added: an email when you are mentioned or given a task (and that email in Resend\'s row), and the row height', () => {
    expect(PRIVACY_DOCUMENT.history.find((entry) => entry.version === '2026-11-14')?.summary).toBe(
      "Added the setting in the staff app for an email when you are mentioned in a team note or given a task in one, and named that email in Resend's row. Staff app settings now also remember the row height you chose for lists.",
    )
  })

  // F-172b joins F-171's entry: neither was deployed when the team notes came, so one version names both.
  it('the 2026-11-13 entry names the setting F-171 added, the sidebar open or collapsed, and the team notes F-172b added', () => {
    expect(PRIVACY_DOCUMENT.history.find((entry) => entry.version === '2026-11-13')?.summary).toBe(
      "Added the setting that remembers whether you keep the sidebar in the staff app open or collapsed, and explained that an organiser's team can keep internal notes on people, companies, registrations and sales prospects.",
    )
  })

  it('the 2026-11-12 entry names the settings F-163b, F-162a and F-165 added: the lists’ columns, the floor plan’s view and background motion', () => {
    expect(PRIVACY_DOCUMENT.history.find((entry) => entry.version === '2026-11-12')?.summary).toBe(
      'Added the settings that remember which columns your lists show, whether the floor plan opens in 2D or 3D, and background motion in the staff app.',
    )
  })

  it('the 2026-11-08 entry names the three changes of F-142a: VIES, the Access sign-in email and the Resend region', () => {
    const summary = PRIVACY_DOCUMENT.history.find((entry) => entry.version === '2026-11-08')?.summary ?? ''

    expect(summary).toContain('VIES')
    expect(summary).toContain('Cloudflare Access and the email address our own staff sign in with')
    expect(summary).toContain('EU region (Ireland)')
  })

  it('history is newest first, one entry per version, so a new entry without a bump of the constant fails above', () => {
    const versions = PRIVACY_DOCUMENT.history.map((entry) => entry.version)

    // A repeated date is two "Versions of this document" rows for one version: join the undeployed entry instead.
    expect(versions).toEqual([...new Set(versions)].sort().reverse())
  })

  it('imports the constant and types no date of its own; only past history entries keep theirs', () => {
    const typed = [...source.matchAll(/['"`](20\d{2}-\d{2}-\d{2})['"`]/g)].map(([, day]) => day)

    expect(source).toMatch(/import \{[^}]*\bPLATFORM_PRIVACY_VERSION\b[^}]*\} from '@\/lib\/product'/)
    expect(typed).toEqual(PRIVACY_DOCUMENT.history.slice(1).map((entry) => entry.version))
  })

  it('the platform privacy and terms URLs are on the site host, which names no domain of its own (E-43)', () => {
    expect(PLATFORM_PRIVACY_URL).toBe(`${SITE_URL}/privacy`)
    expect(PLATFORM_TERMS_URL).toBe(`${SITE_URL}/terms`)
  })
})

describe('privacy notice: page', () => {
  it('renders inside the site chrome with one h1', () => {
    expect(html).toContain('<header')
    expect(html).toContain('<footer')
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toMatch(/<h1[^>]*>Privacy notice<\/h1>/)
  })

  it('every contents link lands on a section of the page', () => {
    const nav = /<nav aria-labelledby="legal-contents"[\s\S]*?<\/nav>/.exec(html)?.[0] ?? ''
    const own = [...nav.matchAll(/href="([^"]*)"/g)].map(([, href]) => href)

    expect(own.length).toBe(PRIVACY_DOCUMENT.sections.length + 1)
    expect(own.every((href) => href.startsWith('/privacy#'))).toBe(true)
    expect(own.filter((href) => !ids.has(href.slice('/privacy#'.length)))).toEqual([])
  })
})

describe('privacy notice: processors', () => {
  it('names exactly Hostinger, Cloudflare, Resend and the inbox provider', () => {
    const rows = rowHeads('Our processors')

    expect(rows).toEqual([...PROCESSOR_NAMES])
    expect(rows.slice(0, 3)).toEqual(['Hostinger (HOSTINGER operations, UAB)', 'Cloudflare, Inc.', 'Resend, Inc.'])
    expect(rows).toHaveLength(4)
  })

  it('names VIES among those who receive data, what it gets, and that it is not a processor (L-05)', () => {
    expect(text).toContain("we check the number with VIES, the European Commission's VAT number check. VIES receives only the number.")
    expect(text).toContain('so it is not one of our processors and is not in the table above.')
    expect(rowHeads('Our processors').filter((row) => /VIES|European Commission/.test(row))).toEqual([])
  })

  it('the Cloudflare row covers Cloudflare Access and the email our own staff sign in with (L-06)', () => {
    const cloudflare = rowCells('Our processors', 'Cloudflare, Inc.')

    expect(cloudflare['What they do for us']).toContain('Cloudflare Access, the sign-in check in front of the pages only our own staff use.')
    expect(cloudflare.Data).toContain('For our own staff, the email address they sign in with.')
  })

  // F-172d: the mention email goes through Resend too, and the notice says so; F-172f: and its task version.
  it('the Resend row names the email you get when you are mentioned in a team note or given a task in one', () => {
    expect(rowCells('Our processors', 'Resend, Inc.')['What they do for us']).toBe(
      'Sends the emails the website and the platform send, including the email you get when you are mentioned in a team note or given a task in one.',
    )
  })

  it('the Resend row says it sends from its EU region and keeps the safeguard of a US company (G-07)', () => {
    const resend = rowCells('Our processors', 'Resend, Inc.')

    expect(resend.Where).toBe('United States company, sending from its EU region (Ireland)')
    expect(resend['Safeguard for transfers']).toBe('Standard Contractual Clauses')
    expect(text).toContain('Cloudflare and Resend are companies in the United States, so data they process may leave the EU.')
  })

  it.each(FORBIDDEN.map((pattern) => [String(pattern), pattern]))('never mentions %s', (_name, pattern) => {
    expect(source).not.toMatch(pattern)
    expect(documentText.length).toBeGreaterThan(1000)
    expect(documentText).not.toMatch(pattern)
  })

  it('says no analytics run, which the boot guard holds true', () => {
    expect(NOTICE_COVERS).toEqual({ analytics: false, r2Uploads: false })
    expect(text).toContain('we run no analytics on this website')
  })
})

describe('privacy notice: what it must state', () => {
  it.each([
    ['the business from CONTROLLER', CONTROLLER.legalName],
    ['the OIB from CONTROLLER', CONTROLLER.oib],
    ['the pre-contract basis', 'Art. 6(1)(b)'],
    ['the legitimate-interest basis', 'Art. 6(1)(f)'],
    ['the legal-duty basis for invoices', 'Art. 6(1)(c)'],
    ['the demo request review', 'Reviewed 24 months after the request'],
    ['the processor role for event data', "We are the organiser's processor."],
    ['the reply period', 'We reply within 1 month.'],
    ['the extension rule', 'up to 2 more months'],
    ['the authority', 'Agencija za zaštitu osobnih podataka (AZOP)'],
    ['no cookies of our own on the website', 'Cookies on the Stand-in Name website'],
    ['the exhibitor portal in what the notice covers', 'event pages and an exhibitor portal on Stand-in Name'],
    ['who gets the exhibitor portal', 'confirmed exhibitors, co-exhibitors and sponsors access to an exhibitor portal'],
    ['what the portal holds', 'who gave you access, when you last signed in, and your sign-in session'],
    ['when portal access ends', "Portal access ends at the latest 30 days after the show's last day."],
    ['the portal controller', 'The organiser is the controller of this data too'],
    ['held demo requests get nothing sent (#313)', 'we hold it for review and send neither'],
    ['no DPO, truthfully', 'We have not appointed a data protection officer'],
    ['the breach rule', 'within 72 hours'],
  ])('%s', (_name, statement) => {
    expect(text).toContain(statement)
  })

  // F-172b: the team's notes on the organiser's records, where they never show, and what goes with an erased person.
  it("says, with the organiser's data, that its team keeps internal notes and where they never show", () => {
    const section = PRIVACY_DOCUMENT.sections.find((one) => one.id === 'event-pages')
    const lines = (section?.blocks ?? []).flatMap((block) => (block.kind === 'p' && 'text' in block ? [block.text] : []))
    const notes = lines.findIndex((line) => line.includes('internal notes'))

    expect(lines[notes]).toBe(
      "The organiser's team can also keep internal notes on people, companies, registrations and sales prospects. These notes never show on event pages, in the exhibitor portal or in exports, and when a person's data is erased, the notes on them and on their sales prospects are deleted too.",
    )
    // After the processor's paragraph, so "To see, correct or delete that data" covers the notes too.
    expect(lines[notes + 1]).toBe('To see, correct or delete that data, write to the organiser first. If you write to us, we pass your request to the organiser.')
    expect(text).toContain('The organiser\'s team can also keep internal notes on people, companies, registrations and sales prospects.')
  })

  // F-172d: the account menu's "Email me when I'm mentioned" is stored on the login; F-172f: it covers task emails too.
  // F-191d: the Google account ID a login is linked to (login-links), and what Google learns from a sign-in.
  it('the staff sign-in accounts row names the setting for mention and task emails, and the Google account ID', () => {
    expect(rowCells('Personal data we hold', 'Staff sign-in accounts').Data).toBe(
      'Name, email address, a hashed password, your sign-in session, whether you want an email when you are mentioned in a team note or given a task in one, and, if you sign in with Google, the account ID of your Google sign-in. When you sign in with Google, Google tells us your email address and that account ID, and knows you signed in to Stand-in Name.',
    )
    expect(source).toContain('src/collections/LoginLinks.ts')
  })

  // F-213b: what our staff note about an organiser's manager (organisers.aboutYou), after the staff accounts.
  it('the notes from our calls have their own row: what, why and how long, and only our staff see them', () => {
    const rows = rowHeads('Personal data we hold')

    expect(rows[rows.indexOf('Staff sign-in accounts') + 1]).toBe('Notes from our calls with you')
    expect(rowCells('Personal data we hold', 'Notes from our calls with you')).toEqual({
      Data: 'If you tell us on a demo call or while we set up your account: your role, the kinds of events you run, how many a year, and how you heard about Stand-in Name. Only Stand-in Name staff see them.',
      'Why we may (lawful basis)': 'Our legitimate interest in knowing who uses Stand-in Name and how they find us, so we can improve it (Art. 6(1)(f)).',
      'How long': "Until your organisation's account is deleted. Ask us and we delete them sooner.",
    })
    expect(source).toContain('src/collections/platform/Organisers.ts `aboutYou`')
  })

  it('the cookie table says we set none on the website, and nowhere else', () => {
    expect(text).toContain('Cookies on the Stand-in Name website The Stand-in Name website We set none.')
    expect(text.match(/We set none\./g)).toHaveLength(1)
  })

  it('the cookie table has a row for every cookie and storage entry the platform sets', () => {
    expect(rowHeads('Cookies and browser storage')).toEqual([
      'Cookies on the Stand-in Name website',
      'Cloudflare security cookies',
      `Exhibitor portal sign-in (${PORTAL_COOKIE})`,
      'Staff sign-in cookies',
      'Staff app settings',
      'Analytics',
    ])
    expect(text).toContain(
      'Keep you signed in, 2 hours at a time, and carry your sign-in through the login code step (10 minutes) and through a Google sign-in (10 minutes).',
    )
  })

  it('the staff app settings row names light or dark, kept only once someone picks one in the account menu', () => {
    // F-163b: the columns a list shows; F-162a: the floor plan view; F-165: background motion; F-171: the sidebar; F-124: the row height; F-159b: the theme.
    expect(rowCells('Cookies and browser storage', 'Staff app settings')).toEqual({
      Where: 'The staff app',
      Why: 'Remember which organiser you are working on, whether the floor plan opens in 2D or 3D, which notifications you have seen, which columns your lists show, the row height you chose for lists, whether you keep the sidebar open or collapsed, the language if you pick one in your account settings, background motion if you change it in the account menu, and light or dark if you pick one there.',
      'Your choice': 'Needed for features you use, so no consent is needed.',
    })
    expect(text).not.toContain('the language you pick')
    // The row's source names the row height's and the theme's cookies, as it names the other settings'.
    expect(source).toContain(`ROW_HEIGHT_COOKIE ('${ROW_HEIGHT_COOKIE}', 1 year,`)
    // By name: a site file imports nothing from the app (site-imports.test.ts); theme.test.ts pins the name.
    expect(source).toMatch(/theme\.ts THEME_COOKIE\s*\/\/ \('evemos_app_theme', 1 year,/)
    // The light-only database admin still stores no theme of its own.
    expect(source).not.toContain('No display theme cookie')
    expect(source).toContain("Payload's own 'payload-theme' is never written")
  })

  it('no longer offers a stored cookie choice, since the banner shows only with analytics', () => {
    expect(text).not.toContain('Your cookie choice')
    expect(text).not.toContain('remember your cookie choice')
  })

  it('states each lifetime as the constant that sets it', () => {
    expect(STATED_LIFETIMES).toEqual({
      portalAccessDays: PORTAL_ACCESS_DAYS_AFTER_SHOW,
      portalSessionDays: PORTAL_SESSION_SECONDS / (24 * 60 * 60),
      staffSignInHours: STAFF_TOKEN_EXPIRATION_SECONDS / (60 * 60),
      loginStepMinutes: LOGIN_STEP_SECONDS / 60,
      ssoMinutes: SSO_STATE_SECONDS / 60,
    })
  })

  it('rights are used through CONTROLLER.privacyEmail, linked', () => {
    expect(html).toContain(`<a href="mailto:${CONTROLLER.privacyEmail}">${CONTROLLER.privacyEmail}</a>`)
    expect(text).toMatch(/Email privacy@\S+ \. Say which right/)
  })

  it('links AZOP at azop.hr', () => {
    expect(hrefs).toContain('https://azop.hr')
  })
})

describe('privacy notice: copy rules', () => {
  it('no long dashes, in the source or on the page', () => {
    expect(source).not.toMatch(/[—–]/)
    expect(text).not.toMatch(/[—–]/)
  })

  it('the product name comes only from PRODUCT_NAME', () => {
    expect(PRODUCT_NAME).toBe('Stand-in Name')
    expect(text).toContain('Stand-in Name')
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
    expect(html).not.toContain('dangerouslySetInnerHTML')
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

  it('the only placeholders are the answers still awaited, so a new gap cannot slip in unnoticed', () => {
    // The inbox provider's name, location and safeguard (Question 4).
    // Filling one shrinks the list; delete its line here when it is filled.
    const awaited = [
      'sections.4.blocks.1.rows.3.0',
      'sections.4.blocks.1.rows.3.3',
      'sections.4.blocks.1.rows.3.4',
    ]

    expect(awaited).toEqual(expect.arrayContaining(findPlaceholders(PRIVACY_DOCUMENT)))
  })
})

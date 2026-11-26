/**
 * The legal document renderer (F-022): one h1, a contents list that lands on
 * the sections, accessible tables that scroll in their own box, the contact
 * block from `CONTROLLER` only, and no link that is not mailto, https or a
 * site path. Rendered with `renderToStaticMarkup`, as the chrome tests are.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import tones from '@/site/ui/primitives.module.css'

import { formatLegalDate, LegalDocument, type LegalDocumentContent, safeHref } from './LegalDocument'

/** Stand-in details: the contact block must show exactly these, from the module, never typed in. */
vi.mock('./controller', () => ({
  CONTROLLER: {
    tradingName: 'Stand-in Trading',
    legalName: 'Stand-in Legal Name',
    owner: 'Stand-in Owner',
    address: ['1 Stand-in Street', '10000 Stand-in Town'],
    country: 'Stand-in Country',
    oib: '00000000001',
    register: 'Stand-in Register 123',
    privacyEmail: 'privacy@stand-in.example',
    generalEmail: 'hello@stand-in.example',
  },
  AUTHORITY: {
    name: 'Stand-in Authority',
    description: 'the stand-in authority',
    address: ['2 Authority Road'],
    website: 'https://authority.example',
    email: 'mail@authority.example',
  },
}))

const content = (overrides: Partial<LegalDocumentContent> = {}): LegalDocumentContent => ({
  path: '/fixture',
  title: 'Fixture document',
  intro: 'What this fixture is for.',
  version: '2026-10-19',
  sections: [
    { id: 'who', title: 'Who we are', blocks: [{ kind: 'contact' }] },
    {
      id: 'data',
      title: 'Data',
      blocks: [
        { kind: 'p', text: 'A plain paragraph.' },
        { kind: 'p', parts: ['Write to ', { href: 'mailto:a@b.example', label: 'a@b.example' }, '.'] },
        { kind: 'list', items: ['One', 'Two'] },
        { kind: 'table', caption: 'What we hold', head: ['What', 'Why'], rows: [['Name', 'To reply']] },
      ],
    },
    { id: 'complaints', title: 'Complaints', blocks: [{ kind: 'authority' }] },
  ],
  changes: { id: 'changes', title: 'Changes', blocks: [{ kind: 'p', text: 'We post changes here.' }] },
  history: [{ version: '2026-10-19', summary: 'First version.' }],
  ...overrides,
})

const render = (doc: LegalDocumentContent = content()) => renderToStaticMarkup(<LegalDocument content={doc} />)

const textOf = (html: string): string =>
  html
    .replace(/<!-- -->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

describe('LegalDocument', () => {
  const html = render()

  it('has exactly one h1, the title, and a "Last updated" line in the voice book date style', () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toMatch(/<h1[^>]*>Fixture document<\/h1>/)
    expect(textOf(html)).toContain('Last updated 19 October 2026')
  })

  // F-192e (E-131 Q4 = B): a document is long reading, so only its title is on the washes.
  it('puts the title, intro and date on the washes, and the document, named by the title, on a paper band', () => {
    const head = /<section aria-labelledby="legal-title" class="([^"]+)">([\s\S]*?)<\/section>/.exec(html)
    expect(head?.[1]).toBe(`${tones.section} ${tones.open}`)
    expect(textOf(head?.[2] ?? '')).toBe('Fixture document What this fixture is for. Last updated 19 October 2026')
    expect(html).toMatch(new RegExp(`<div class="${tones.section} ${tones.paper}"><div class="[^"]+"><article aria-labelledby="legal-title"`))
    expect(html.indexOf('<nav')).toBeGreaterThan(html.indexOf('<article'))
  })

  // Muted ink reads 3.3:1 at the violet wash's centre, ink 7.7:1 (DESIGN.md "Website").
  it('sets the intro and date on the washes in the full ink, not the muted grey', () => {
    const css = readFileSync(join(process.cwd(), 'src/site/legal/LegalDocument.module.css'), 'utf8')
    expect(/\.head p \{\s*color: var\(--evemos-ink\);\s*\}/.test(css)).toBe(true)
  })

  it('lays the contents and the tables white on the paper', () => {
    const css = readFileSync(join(process.cwd(), 'src/site/legal/LegalDocument.module.css'), 'utf8')
    for (const box of ['contents', 'tableWrap']) {
      expect(new RegExp(`\\.${box} \\{[^}]*background: var\\(--evemos-surface-raised\\)`).test(css), box).toBe(true)
    }
  })

  it('the contents list links to every section id on the page, the changes section last', () => {
    const nav = /<nav aria-labelledby="legal-contents"[\s\S]*?<\/nav>/.exec(html)?.[0] ?? ''
    const targets = [...nav.matchAll(/href="\/fixture#([^"]+)"/g)].map(([, id]) => id)
    const sectionIds = [...html.matchAll(/<section id="([^"]+)"/g)].map(([, id]) => id)

    expect(targets).toEqual(['who', 'data', 'complaints', 'changes'])
    expect(sectionIds).toEqual(targets)
  })

  it('numbers the section headings, each labelling its section', () => {
    expect(html).toContain('<section id="data" aria-labelledby="data-heading"')
    expect(html).toMatch(/<h2 id="data-heading"[^>]*>2\. Data<\/h2>/)
  })

  it('a table has a caption and column headers, inside a focusable region named after it', () => {
    expect(html).toMatch(
      /<div[^>]*role="region" aria-label="What we hold" tabindex="0"><table[^>]*><caption[^>]*>What we hold<\/caption>/,
    )
    expect(html).toContain('<th scope="col">What</th>')
    expect(html).toContain('<th scope="row">Name</th>')
  })

  it('every data cell carries its column header, for the stacked phone layout', () => {
    expect(html).toContain('<td data-label="Why">To reply</td>')
  })

  it('on a phone the table stacks as cards labelled by data-label, instead of scrolling sideways', () => {
    const css = readFileSync(join(process.cwd(), 'src/site/legal/LegalDocument.module.css'), 'utf8')
    const phone = /@media \(max-width: 37\.5rem\) \{([\s\S]*?)\n\}/.exec(css)?.[1] ?? ''

    expect(phone).toMatch(/\.table \{\s*min-width: 0;/)
    expect(phone).toContain('content: attr(data-label)')
  })

  it('renders the history as the last table, dates formatted', () => {
    expect(html).toContain('aria-label="Versions of this document"')
    expect(textOf(html)).toContain('19 October 2026 First version.')
  })

  it('the contact block shows every detail from CONTROLLER, emails as mailto links', () => {
    const text = textOf(html)

    for (const value of [
      'Stand-in Legal Name',
      'Stand-in Trading',
      'Stand-in Owner',
      '1 Stand-in Street',
      '10000 Stand-in Town',
      'Stand-in Country',
      '00000000001',
      'Stand-in Register 123',
    ]) {
      expect(text).toContain(value)
    }
    expect(html).toContain('<a href="mailto:privacy@stand-in.example">privacy@stand-in.example</a>')
    expect(html).toContain('<a href="mailto:hello@stand-in.example">hello@stand-in.example</a>')
  })

  it('the authority block shows AUTHORITY', () => {
    expect(textOf(html)).toContain('Stand-in Authority')
    expect(html).toContain('<a href="https://authority.example">authority.example</a>')
    expect(html).toContain('<a href="mailto:mail@authority.example">mail@authority.example</a>')
  })

  it('a paragraph with parts renders its link inline', () => {
    expect(html).toContain('<p>Write to <a href="mailto:a@b.example">a@b.example</a>.</p>')
  })

  it('has no inline style, script or raw HTML', () => {
    expect(html).not.toMatch(/<script|\sstyle="|\son[a-z]+=/i)
  })

  it('every href is mailto, https or a site path, and none is "#"', () => {
    const hrefs = [...html.matchAll(/\shref="([^"]*)"/g)].map(([, href]) => href)

    expect(hrefs.length).toBeGreaterThan(5)
    expect(hrefs.filter((href) => !/^(mailto:|https:\/\/|\/[^/])/.test(href))).toEqual([])
  })
})

describe('unsafe links are refused: rendering throws', () => {
  it.each(['javascript:alert(1)', 'http://example.com', '//evil.example', '#', 'data:text/html,x'])('%s', (href) => {
    const doc = content({
      sections: [{ id: 'x', title: 'X', blocks: [{ kind: 'p', parts: [{ href, label: 'link' }] }] }],
    })

    expect(() => render(doc)).toThrow(/refused/)
  })

  it.each(['mailto:a@b.example', 'https://example.com', '/privacy'])('%s is allowed', (href) => {
    expect(safeHref(href)).toBe(href)
  })
})

describe('formatLegalDate', () => {
  it('formats in en-GB, in UTC', () => {
    expect(formatLegalDate('2026-01-01')).toBe('1 January 2026')
  })

  it('refuses a version that is not an ISO day', () => {
    expect(() => formatLegalDate('19 October 2026')).toThrow(/ISO day/)
  })
})

import React from 'react'

// The site's band, by another name here: `Section` is a document's own numbered section.
import { Container, Section as Band, SectionHeading } from '@/site/ui/primitives'
import tones from '@/site/ui/primitives.module.css'

import { AUTHORITY, CONTROLLER } from './controller'
import styles from './LegalDocument.module.css'

/**
 * The one renderer for Evemos's own legal documents (F-022): the privacy
 * notice and the terms.
 *
 * ★ TYPED CONTENT, NO HTML. Every line is a plain string in a content module
 * (`privacy-content.ts`, `terms-content.ts`), so nothing is parsed, there is no
 * `dangerouslySetInnerHTML` under the nonce CSP, and `copycheck` reads the copy
 * as it is. A link is a `{ href, label }` part, and only `mailto:`, `https:`
 * and site paths are accepted: anything else THROWS while rendering, because a
 * bad href is a mistake in our own source and must fail the tests, not reach
 * a page.
 *
 * The business details are never typed into a document: the `contact` and
 * `authority` blocks render `CONTROLLER` and `AUTHORITY` (`controller.ts`).
 *
 * The page is a `ReadingPage`: its title on the washes, the document on paper.
 *
 * Server component, no client JavaScript, no inline style.
 */

export type LegalLink = Readonly<{ href: string; label: string }>

export type LegalBlock =
  | Readonly<{ kind: 'p'; text: string }>
  | Readonly<{ kind: 'p'; parts: readonly (string | LegalLink)[] }>
  | Readonly<{ kind: 'list'; items: readonly string[] }>
  | Readonly<{ kind: 'table'; caption: string; head: readonly string[]; rows: readonly (readonly string[])[] }>
  | Readonly<{ kind: 'contact' }>
  | Readonly<{ kind: 'authority' }>

export type LegalSection = Readonly<{
  /** The anchor the contents list links to. Lowercase words and hyphens. */
  id: string
  title: string
  blocks: readonly LegalBlock[]
}>

export type LegalHistoryEntry = Readonly<{ version: string; summary: string }>

export type LegalDocumentContent = Readonly<{
  /** The page's own path, for the contents links (`/privacy#rights`) and the canonical URL. */
  path: string
  title: string
  intro: string
  /** ISO day of this version, e.g. `2026-10-19`. Printed as "Last updated …". */
  version: string
  sections: readonly LegalSection[]
  /** The last section: how the document changes. The `history` table is drawn under its blocks. */
  changes: LegalSection
  /** Newest first. `history[0].version` is `version` (each document's test holds it). */
  history: readonly LegalHistoryEntry[]
}>

const SAFE_HREF = /^(mailto:|https:\/\/|\/(?!\/))/

/** The href, or a throw: see the header. `//host` is a protocol-relative URL, not a site path. */
export function safeHref(href: string): string {
  if (!SAFE_HREF.test(href)) {
    throw new Error(`Legal documents link only to mailto:, https: or a site path; refused "${href}".`)
  }
  return href
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

/** "2026-10-19" → "19 October 2026", the voice book's date style. UTC, so no server time zone shifts the day. */
export function formatLegalDate(version: string): string {
  if (!ISO_DAY.test(version)) throw new Error(`A legal document version is an ISO day; got "${version}".`)
  return DATE_FORMAT.format(new Date(`${version}T00:00:00Z`))
}

function Link({ href, label }: LegalLink) {
  return <a href={safeHref(href)}>{label}</a>
}

function ContactBlock() {
  const rows: [string, React.ReactNode][] = [
    ['Business', CONTROLLER.legalName],
    ['Trading as', CONTROLLER.tradingName],
    ['Owner', CONTROLLER.owner],
    [
      'Registered address',
      [...CONTROLLER.address, CONTROLLER.country].map((line) => (
        <span key={line} className={styles.line}>
          {line}
        </span>
      )),
    ],
    ['OIB', CONTROLLER.oib],
    ['Register', CONTROLLER.register],
    ['Privacy questions', <Link key="privacy" href={`mailto:${CONTROLLER.privacyEmail}`} label={CONTROLLER.privacyEmail} />],
    ['Other questions', <Link key="general" href={`mailto:${CONTROLLER.generalEmail}`} label={CONTROLLER.generalEmail} />],
  ]
  return (
    <dl className={styles.details}>
      {rows.map(([term, detail]) => (
        <div key={term} className={styles.detailRow}>
          <dt>{term}</dt>
          <dd>{detail}</dd>
        </div>
      ))}
    </dl>
  )
}

function AuthorityBlock() {
  return (
    <address className={styles.authority}>
      <span className={styles.line}>
        <strong>{AUTHORITY.name}</strong>, {AUTHORITY.description}
      </span>
      {AUTHORITY.address.map((line) => (
        <span key={line} className={styles.line}>
          {line}
        </span>
      ))}
      <span className={styles.line}>
        Website: <Link href={AUTHORITY.website} label={AUTHORITY.website.replace(/^https:\/\//, '')} />
      </span>
      <span className={styles.line}>
        Email: <Link href={`mailto:${AUTHORITY.email}`} label={AUTHORITY.email} />
      </span>
    </address>
  )
}

function Table({ caption, head, rows }: { caption: string; head: readonly string[]; rows: readonly (readonly string[])[] }) {
  return (
    // Scrolls sideways inside its own box on a mid-width screen, so the page never does; on a
    // phone each row stacks as a card, every cell labelled by its `data-label` column header.
    // Focusable, so a keyboard can scroll it too; named after its caption.
    <div className={styles.tableWrap} role="region" aria-label={caption} tabIndex={0}>
      <table className={styles.table}>
        <caption className={styles.caption}>{caption}</caption>
        <thead>
          <tr>
            {head.map((cell) => (
              <th key={cell} scope="col">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join('|')}>
              {row.map((cell, index) =>
                index === 0 ? (
                  <th key={index} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={index} data-label={head[index]}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/**
 * One block of a document. Exported for the guides (`src/site/guides`), which
 * are articles in the same typed-blocks shape and reuse this renderer, so a
 * link in a guide goes through `safeHref` too.
 */
export function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case 'p':
      if ('text' in block) return <p>{block.text}</p>
      return (
        <p>
          {block.parts.map((part, index) =>
            typeof part === 'string' ? (
              <React.Fragment key={index}>{part}</React.Fragment>
            ) : (
              <Link key={index} href={part.href} label={part.label} />
            ),
          )}
        </p>
      )
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'table':
      return <Table caption={block.caption} head={block.head} rows={block.rows} />
    case 'contact':
      return <ContactBlock />
    case 'authority':
      return <AuthorityBlock />
  }
}

function Section({ section, number, children }: { section: LegalSection; number: number; children?: React.ReactNode }) {
  const headingId = `${section.id}-heading`
  return (
    <section id={section.id} aria-labelledby={headingId} className={styles.section}>
      <h2 id={headingId} className={styles.sectionTitle}>
        {number}. {section.title}
      </h2>
      {section.blocks.map((block, index) => (
        <Block key={index} block={block} />
      ))}
      {children}
    </section>
  )
}

interface ReadingPageProps {
  /** The h1's id: it names the title band, and the article under it. */
  titleId: string
  title: string
  intro: string
  /** The date line under the intro ("Last updated …"); a hub has none. */
  dated?: string
  /** The reading itself, on the paper band. */
  children: React.ReactNode
}

/**
 * A page of reading in the site's look (F-192e, E-131 Q4 = B): the legal
 * documents, the guides and comparisons, and their hubs. The title, intro and
 * date sit on the washes (`open`), all in the full ink: muted text falls
 * under 4.5:1 over the violet wash. The reading follows on a paper band, its
 * contents box and tables on white.
 *
 * The paper band is a plain block, and the article sits inside it, named by
 * the h1 above: the entrance (`RevealOnScroll`) moves an article's blocks one
 * by one, so a band inside the article, or an article as a section's block,
 * would rise as one.
 */
export function ReadingPage({ titleId, title, intro, dated, children }: ReadingPageProps) {
  return (
    <>
      <Band tone="open" labelledBy={titleId}>
        <div className={styles.head}>
          <SectionHeading id={titleId} level={1} title={title} lead={intro} />
          {dated ? <p>{dated}</p> : null}
        </div>
      </Band>
      <div className={`${tones.section} ${tones.paper}`}>
        <Container>{children}</Container>
      </div>
    </>
  )
}

interface LegalDocumentProps {
  content: LegalDocumentContent
}

export function LegalDocument({ content }: LegalDocumentProps) {
  const sections = [...content.sections, content.changes]
  return (
    <ReadingPage titleId="legal-title" title={content.title} intro={content.intro} dated={`Last updated ${formatLegalDate(content.version)}`}>
      <article aria-labelledby="legal-title" className={styles.document}>
        <nav aria-labelledby="legal-contents" className={styles.contents}>
          <h2 id="legal-contents" className={styles.contentsTitle}>
            Contents
          </h2>
          <ol className={styles.contentsList}>
            {sections.map((section) => (
              <li key={section.id}>
                <a href={safeHref(`${content.path}#${section.id}`)}>{section.title}</a>
              </li>
            ))}
          </ol>
        </nav>
        {content.sections.map((section, index) => (
          <Section key={section.id} section={section} number={index + 1} />
        ))}
        <Section section={content.changes} number={sections.length}>
          <Table
            caption="Versions of this document"
            head={['Date', 'What changed']}
            rows={content.history.map((entry) => [formatLegalDate(entry.version), entry.summary])}
          />
        </Section>
      </article>
    </ReadingPage>
  )
}

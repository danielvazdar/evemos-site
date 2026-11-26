import React from 'react'

import { PRODUCT_NAME } from '@/lib/product'
import { OFFICE_LINE } from '@/site/company'
import { links } from '@/site/links'
import { ONE_LINER } from '@/site/positioning'
import { MENUS } from '@/site/sitemap'
import { ButtonLink, Container } from '@/site/ui/primitives'

import styles from './chrome.module.css'
import { Lockup } from './Lockup'
import type { NavItem } from './SiteHeader'

/**
 * The footer on every Evemos page: the lockup, the one-liner and Book a demo,
 * then a column per menu of the site map (Product, Solutions, Services,
 * Resources) and Company, and under them one strip with the copyright line,
 * the offices and the legal links (the demo's look, E-119).
 *
 * ★ ONLY LINKS THAT LAND SOMEWHERE: the columns are built from
 * `src/site/sitemap.ts`, whose items come from the page registries, so a
 * footer link is always a page that exists.
 *
 * The year is read at render, and every site page renders per request (the CSP
 * nonce), so it is never a year stale.
 */

export const COMPANY_LINKS: readonly NavItem[] = [
  { label: 'About', href: links.about },
  { label: 'Team', href: links.team },
  { label: 'Pricing', href: links.pricing },
  { label: 'Careers', href: links.careers },
  { label: 'Contact', href: links.contact },
]

export const LEGAL_LINKS: readonly NavItem[] = [
  { label: 'Privacy', href: links.privacy },
  { label: 'Terms', href: links.terms },
]

const COMPANY_HREFS: ReadonlySet<string> = new Set(COMPANY_LINKS.map((item) => item.href))

/**
 * Each menu as a footer column: its pages in menu order, then its overview
 * page. A page Company already lists (About and Team sit in Resources too) is
 * left out, so every footer link appears once (#222).
 */
export const FOOTER_COLUMNS: ReadonlyArray<{ title: string; items: readonly NavItem[] }> = [
  ...MENUS.map((menu) => ({
    title: menu.label,
    items: [
      ...menu.groups.flatMap((group) => group.items.map(({ label, href }) => ({ label, href }))),
      ...(menu.overview ? [menu.overview] : []),
    ].filter((item) => !COMPANY_HREFS.has(item.href)),
  })),
  { title: 'Company', items: COMPANY_LINKS },
]

function Column({ title, items }: { title: string; items: readonly NavItem[] }) {
  return (
    <nav aria-label={title}>
      <h2 className={styles.footerHeading}>{title}</h2>
      <ul className={styles.footerList}>
        {items.map((item) => (
          <li key={item.href + item.label}>
            <a href={item.href} className={styles.footerLink}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <Lockup />
            <p className={styles.footerLine}>{ONE_LINER}</p>
            <div>
              <ButtonLink href={links.demo} variant="primary">
                Book a demo
              </ButtonLink>
            </div>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <Column key={column.title} title={column.title} items={column.items} />
          ))}
        </div>
        <div className={styles.footerBase}>
          <p>
            © {year} Kyuro. {PRODUCT_NAME} is built and run by Kyuro, Croatia.
          </p>
          <p>{OFFICE_LINE}</p>
          <nav aria-label="Legal">
            <ul className={styles.legalList}>
              {LEGAL_LINKS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={styles.footerLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  )
}

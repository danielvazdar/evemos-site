import { ChevronDown, Menu, X } from 'lucide-react'
import React from 'react'

import { links } from '@/site/links'
import { MENUS, type Menu as SiteMenu } from '@/site/sitemap'
import { ButtonLink, Container, SiteIcon } from '@/site/ui/primitives'

import styles from './chrome.module.css'
import { DropdownNav } from './DropdownNav'
import { Lockup } from './Lockup'
import { PhoneMenu } from './PhoneMenu'

/**
 * The header on every Evemos page (F-021a): the lockup, the main nav, "Log in"
 * and the page's one primary action, "Book a demo" (E-13), on a glass bar that
 * floats over the page as it scrolls (E-119; DESIGN.md "Website").
 *
 * ★ THE PHONE MENU NEEDS NO JAVASCRIPT. Below 1024px the nav moves into a
 * `<details>`/`<summary>`, which the browser opens and closes itself, so there
 * is no script it depends on. Once JavaScript has loaded, `PhoneMenu` makes it
 * a sheet from the left with its own close button. "Book a demo" stays in
 * the bar at every width rather than in the menu, so the header has exactly one.
 *
 * ★ THE MENUS COME FROM THE SITE MAP (`src/site/sitemap.ts`): Product,
 * Solutions, Services and Resources as dropdowns, each grouped like run.events'
 * menus, every item a page that exists. Pricing follows as a plain link (`TOP_LINKS`).
 *
 * The two navs are never exposed together: the bar's is `display: none` below
 * 1024px, and the whole menu is `display: none` from 1024px up.
 */

export interface NavItem {
  label: string
  href: string
}

/** Plain links: after the dropdowns in the bar, before them in the phone menu. */
export const TOP_LINKS: readonly NavItem[] = [{ label: 'Pricing', href: links.pricing }]

const LOG_IN: NavItem = { label: 'Log in', href: links.login }

function Dropdown({ menu }: { menu: SiteMenu }) {
  return (
    <li>
      <details className={styles.dropdown}>
        <summary className={`${styles.navLink} ${styles.dropdownButton}`}>
          {menu.label}
          <SiteIcon icon={ChevronDown} size={16} />
        </summary>
        <div className={styles.dropdownPanel}>
          <div className={styles.dropdownGroups}>
            {menu.groups.map((group) => (
              <div key={group.title}>
                <p className={styles.groupTitle}>{group.title}</p>
                <ul className={styles.groupList}>
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={styles.dropItem}>
                        <span className={styles.dropLabel}>{item.label}</span>
                        <span className={styles.dropLine}>{item.line}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {menu.overview ? (
            <a href={menu.overview.href} className={styles.dropOverview}>
              {menu.overview.label}
            </a>
          ) : null}
        </div>
      </details>
    </li>
  )
}

/**
 * The phone menu's content: the plain links and Log in first, then each menu
 * as a heading over its pages. Pricing and Log in are what a visitor opens the
 * menu for, and below the menus they sat under four screens of pages (#222).
 */
function PhoneNav() {
  return (
    <nav aria-label="Main" className={styles.menuPanel}>
      {/* The sheet's way out (PhoneMenu); hidden without script, where "Menu" still closes the menu. */}
      <button type="button" className={styles.sheetClose} data-menu-close aria-label="Close menu">
        <SiteIcon icon={X} size={20} />
      </button>
      <ul className={`${styles.menuList} ${styles.menuQuick}`}>
        {[...TOP_LINKS, LOG_IN].map((item) => (
          <li key={item.label}>
            <a href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {MENUS.map((menu) => (
        <div key={menu.label} className={styles.menuSection}>
          <p className={styles.groupTitle}>{menu.label}</p>
          <ul className={styles.menuList}>
            {[...menu.groups.flatMap((group) => group.items), ...(menu.overview ? [menu.overview] : [])].map((item) => (
              <li key={item.href}>
                <a href={item.href} className={styles.navLink}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.bar}>
          <Lockup />
          <nav aria-label="Main" className={styles.nav}>
            <DropdownNav className={styles.navList}>
              {MENUS.map((menu) => (
                <Dropdown key={menu.label} menu={menu} />
              ))}
              {TOP_LINKS.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={styles.navLink}>
                    {item.label}
                  </a>
                </li>
              ))}
            </DropdownNav>
          </nav>
          <div className={styles.actions}>
            <a href={LOG_IN.href} className={`${styles.navLink} ${styles.login}`}>
              {LOG_IN.label}
            </a>
            <ButtonLink href={links.demo} variant="primary">
              Book a demo
            </ButtonLink>
            <PhoneMenu className={styles.menu}>
              <summary className={styles.menuButton}>
                <SiteIcon icon={Menu} size={20} />
                <span className={styles.menuLabel}>Menu</span>
              </summary>
              <PhoneNav />
              {/* The sheet's dim (PhoneMenu): a tap on it closes the sheet; shown only once the script has made one. */}
              <span className={styles.dim} data-menu-close aria-hidden="true" />
            </PhoneMenu>
          </div>
        </div>
      </Container>
    </header>
  )
}

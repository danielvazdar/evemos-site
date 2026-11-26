'use client'

import React, { useEffect, useRef } from 'react'

import styles from './chrome.module.css'
import { closeMenu, isClosing, keepOpen, menuExitMs } from './menu-close'

/**
 * The bar's dropdown menus: a list whose menus are `<details>` elements, with
 * a few things a script adds on top (DESIGN.md "Website", E-119).
 *
 * ★ PROGRESSIVE ENHANCEMENT, like `PhoneMenu`. Without JavaScript each
 * `<details>` opens and closes itself, its panel grows in at the bar's left
 * edge (CSS), and every link works. Once hydrated, this:
 * - keeps one menu open at a time, and closes it on Escape (returning focus to
 *   its button), a click outside, its button again, or a tapped link; the
 *   first three shrink it back into its button (`menu-close.ts`);
 * - places an opening panel under its button, inside the bar's edges, and
 *   grows it from the button (`--menu-origin`);
 * - slides a white pill along the bar's links under the pointer or the focus,
 *   back to the open menu's button when the pointer leaves, or away.
 * Listeners are React's or attached in an effect: no inline handler, so the
 * nonce CSP holds.
 */

interface DropdownNavProps {
  className: string
  children: React.ReactNode
}

/** The open menus in the list. */
const openMenus = (root: HTMLElement): HTMLDetailsElement[] => [...root.querySelectorAll<HTMLDetailsElement>('details[open]')]

/** The room kept between an open panel and the bar's ends, px. */
const BAR_EDGE = 8
/** How far left of its button a panel starts, px: its padding, so its first column lines up under the button. */
const PANEL_LEAD = 12

/** Where a panel `panelWidth` wide starts, in the bar's coordinates: under its button, inside the bar's ends. */
export const panelLeft = (buttonLeft: number, panelWidth: number, barWidth: number): number =>
  Math.max(BAR_EDGE, Math.min(buttonLeft - PANEL_LEAD, barWidth - panelWidth - BAR_EDGE))

export function DropdownNav({ className, children }: DropdownNavProps) {
  const list = useRef<HTMLUListElement>(null)
  const pill = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = list.current
    const marker = pill.current
    if (!root || !marker) return
    const close = (details: HTMLDetailsElement) => closeMenu(details, menuExitMs(details, '--ex-t-fast'))
    const closeOthers = (keep: Element | null) => openMenus(root).filter((details) => details !== keep).forEach(close)

    const place = (details: HTMLDetailsElement) => {
      const button = details.querySelector('summary')
      const panel = button?.nextElementSibling
      const bar = panel instanceof HTMLElement ? panel.offsetParent : null
      if (!button || !(panel instanceof HTMLElement) || !bar) return
      const barBox = bar.getBoundingClientRect()
      const buttonBox = button.getBoundingClientRect()
      const left = panelLeft(buttonBox.left - barBox.left, panel.offsetWidth, barBox.width)
      panel.style.left = `${left}px`
      panel.style.setProperty('--menu-origin', `${buttonBox.left - barBox.left + buttonBox.width / 2 - left}px`)
    }

    // The pill appears where it is needed without sliding there (`data-jump`), then slides between links.
    const pillTo = (link: Element | null) => {
      if (!link) {
        delete marker.dataset.shown
        return
      }
      const origin = (marker.offsetParent ?? root).getBoundingClientRect()
      const box = link.getBoundingClientRect()
      const appearing = marker.dataset.shown === undefined
      if (appearing) marker.dataset.jump = ''
      marker.style.width = `${box.width}px`
      marker.style.transform = `translate(${box.left - origin.left}px, ${box.top - origin.top}px)`
      marker.dataset.shown = ''
      if (appearing) requestAnimationFrame(() => delete marker.dataset.jump)
    }
    const linkOf = (target: EventTarget | null): Element | null => {
      const link = target instanceof Element ? target.closest(`.${styles.navLink}`) : null
      return link && root.contains(link) ? link : null
    }
    const restPill = () => pillTo(openMenus(root).find((details) => !isClosing(details))?.querySelector('summary') ?? null)
    const onPointerOver = (event: PointerEvent) => {
      const link = linkOf(event.target)
      if (link) pillTo(link)
    }
    const onFocusIn = (event: FocusEvent) => pillTo(linkOf(event.target))
    const onFocusOut = (event: FocusEvent) => {
      if (!root.contains(event.relatedTarget as Node | null)) restPill()
    }

    // `toggle` does not bubble, so listen in the capture phase.
    const onToggle = (event: Event) => {
      const details = event.target as HTMLDetailsElement
      if (!details.open) return
      closeOthers(details)
      place(details)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      const open = openMenus(root)
      const focused = open.find((details) => details.contains(document.activeElement))
      open.forEach(close)
      restPill()
      focused?.querySelector('summary')?.focus()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (root.contains(event.target as Node)) return
      closeOthers(null)
      restPill()
    }
    root.addEventListener('toggle', onToggle, true)
    root.addEventListener('pointerover', onPointerOver)
    root.addEventListener('pointerleave', restPill)
    root.addEventListener('focusin', onFocusIn)
    root.addEventListener('focusout', onFocusOut)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      root.removeEventListener('toggle', onToggle, true)
      root.removeEventListener('pointerover', onPointerOver)
      root.removeEventListener('pointerleave', restPill)
      root.removeEventListener('focusin', onFocusIn)
      root.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  // A tapped link closes every menu at once: the page is leaving, or an in-page jump should not land under a menu.
  // A menu's own button closes it with its exit, and a second press while it goes keeps it open.
  const onClick = (event: React.MouseEvent<HTMLUListElement>) => {
    const target = event.target as Element
    if (target.closest?.('a[href]')) {
      openMenus(event.currentTarget).forEach((details) => (details.open = false))
      return
    }
    const details = target.closest?.('summary')?.parentElement as HTMLDetailsElement | null | undefined
    if (!details?.open) return
    event.preventDefault()
    if (isClosing(details)) keepOpen(details)
    else closeMenu(details, menuExitMs(details, '--ex-t-fast'))
  }

  return (
    <>
      <span ref={pill} className={styles.hoverPill} aria-hidden="true" />
      <ul ref={list} className={className} onClick={onClick}>
        {children}
      </ul>
    </>
  )
}

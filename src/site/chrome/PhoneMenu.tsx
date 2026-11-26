'use client'

import React, { useEffect, useRef } from 'react'

import { closeMenu, isClosing, menuExitMs } from './menu-close'

/**
 * The phone menu's `<details>`, which a script turns into a sheet.
 *
 * ★ PROGRESSIVE ENHANCEMENT. Without JavaScript the browser opens and closes
 * the `<details>` itself, and the menu opens in place under the bar; the server
 * markup is exactly that. Once hydrated, `data-sheet` makes it the demo's sheet
 * (DESIGN.md "Website", E-119): it slides in from the left over a dim and its
 * close button takes the focus. "Menu", under the dim, is `inert` while the
 * sheet is open, so Shift+Tab cannot land on it. The sheet slides back out
 * (`menu-close.ts`) on its close button, a tap on the dim, Escape (focus
 * returns to "Menu"), or the focus leaving it. A tapped link closes it at
 * once: an in-page anchor would otherwise leave the sheet over the section it
 * jumped to. The dim is the header's (`data-menu-close`).
 *
 * The handlers are React's own listeners, attached by the bundle Next stamps
 * with the CSP nonce: no inline `on…` attribute, so the strict policy holds.
 * No stylesheet here: the app's account menu takes `isCloseKey` from this file,
 * and should not load the site's chrome with it.
 */

interface PhoneMenuProps {
  className: string
  children: React.ReactNode
}

/** `target` or an ancestor matches `selector`. Duck-typed rather than `instanceof Element`, so it also runs where there is no DOM (the tests). */
const isWithin = (target: EventTarget | null, selector: string): boolean => {
  const closest = (target as Partial<Pick<Element, 'closest'>> | null)?.closest
  return typeof closest === 'function' && closest.call(target, selector) !== null
}

/** True when a click inside the menu landed on a link, or anything inside one. */
export const isLinkClick = (target: EventTarget | null): boolean => isWithin(target, 'a[href]')

/** True when a click inside the menu asks to close it: the sheet's close button or its dim (`data-menu-close`). */
export const isCloseClick = (target: EventTarget | null): boolean => isWithin(target, '[data-menu-close]')

/** True when the key should close an open menu. */
export const isCloseKey = (key: string, open: boolean): boolean => open && key === 'Escape'

/** Slides the sheet out, letting "Menu" go first so the focus can return to it. */
export function closeSheet(details: HTMLDetailsElement, returnFocus: boolean): void {
  const menuButton = details.querySelector('summary')
  menuButton?.removeAttribute('inert')
  closeMenu(details, menuExitMs(details, '--ex-t-slow'))
  if (returnFocus) menuButton?.focus()
}

export function PhoneMenu({ className, children }: PhoneMenuProps) {
  const menu = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const details = menu.current
    if (!details) return
    details.setAttribute('data-sheet', '')
    const onToggle = () => {
      details.querySelector('summary')?.toggleAttribute('inert', details.open)
      if (details.open) details.querySelector<HTMLElement>('button[data-menu-close]')?.focus()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isCloseKey(event.key, details.open) || isClosing(details)) return
      closeSheet(details, details.contains(document.activeElement))
    }
    // Tabbing past the sheet's last link would land on the page under the dim, so the sheet goes with the focus.
    const onFocusOut = (event: FocusEvent) => {
      if (details.open && event.relatedTarget instanceof Node && !details.contains(event.relatedTarget)) closeSheet(details, false)
    }
    details.addEventListener('toggle', onToggle)
    details.addEventListener('focusout', onFocusOut)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      details.removeAttribute('data-sheet')
      details.querySelector('summary')?.removeAttribute('inert')
      details.removeEventListener('toggle', onToggle)
      details.removeEventListener('focusout', onFocusOut)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const onClick = (event: React.MouseEvent<HTMLDetailsElement>) => {
    const details = event.currentTarget
    if (isLinkClick(event.target)) {
      details.open = false
      return
    }
    if (isCloseClick(event.target)) closeSheet(details, true)
  }

  return (
    <details ref={menu} className={className} onClick={onClick}>
      {children}
    </details>
  )
}

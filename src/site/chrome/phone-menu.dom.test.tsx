// @vitest-environment happy-dom
/**
 * The phone's sheet in a DOM (F-192a, review round 1): once hydrated the menu
 * is a sheet, "Menu" under its dim is inert while it is open, so Shift+Tab
 * cannot land on a covered control, and every way out lets "Menu" go again,
 * returning the focus to it where the person was in the sheet. Without CSS the
 * exit motion reads as no time, so a close is at once here; the motion itself
 * is `menu-close.ts`'s (chrome.test.tsx).
 */
import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { PhoneMenu } from './PhoneMenu'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let host: HTMLElement
let root: Root

beforeEach(() => {
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
  act(() =>
    root.render(
      <PhoneMenu className="menu">
        <summary>Menu</summary>
        <nav aria-label="Main">
          <button type="button" data-menu-close aria-label="Close menu" />
          <a href="/pricing">Pricing</a>
        </nav>
        <span className="dim" data-menu-close aria-hidden="true" />
      </PhoneMenu>,
    ),
  )
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
})

const details = () => host.querySelector('details') as HTMLDetailsElement
const menuButton = () => host.querySelector('summary') as HTMLElement
const closeButton = () => host.querySelector('button') as HTMLButtonElement

/** Sets `open` and tells the menu, as the browser's `toggle` would. */
const setOpen = (open: boolean) =>
  act(() => {
    details().open = open
    details().dispatchEvent(new Event('toggle'))
  })

describe('the phone sheet', () => {
  it('is a sheet once hydrated', () => {
    expect(details().hasAttribute('data-sheet')).toBe(true)
  })

  it('makes "Menu" inert while open, and gives the focus to the close button', () => {
    setOpen(true)
    expect(menuButton().hasAttribute('inert')).toBe(true)
    expect(document.activeElement).toBe(closeButton())
  })

  it.each([
    ['its close button', () => act(() => closeButton().click())],
    ['its dim', () => act(() => (host.querySelector('.dim') as HTMLElement).click())],
    ['Escape', () => act(() => void document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })))],
  ])('closes on %s, lets "Menu" go and returns the focus to it', (_way, close) => {
    setOpen(true)
    close()
    expect(details().open).toBe(false)
    expect(menuButton().hasAttribute('inert')).toBe(false)
    expect(document.activeElement).toBe(menuButton())
  })

  it('closes when the focus leaves it, without pulling the focus back', () => {
    const outside = document.createElement('a')
    outside.href = '/'
    document.body.append(outside)
    setOpen(true)
    act(() => outside.focus())
    expect(details().open).toBe(false)
    expect(menuButton().hasAttribute('inert')).toBe(false)
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })

  it('lets "Menu" go when a link closes it at once', () => {
    setOpen(true)
    act(() => (host.querySelector('a') as HTMLAnchorElement).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })))
    setOpen(false)
    expect(menuButton().hasAttribute('inert')).toBe(false)
  })
})

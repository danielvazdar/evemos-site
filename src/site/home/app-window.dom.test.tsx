// @vitest-environment happy-dom
/**
 * "Sell the floor"'s app window in a DOM (F-192c AC 20, 21; Q1 = A, Q3 = A):
 * the dashboard first and the sales board behind a Sales tab, switched with a
 * pointer, the old view leaving for LEAVE_MS before the new one shows, at once
 * with reduced motion. Nothing in the window takes the focus (its screens are
 * inert, its pills are not buttons), and nothing keeps time: the dashboard's figures stay final, and come back final. Timers
 * are faked and the motion query stubbed.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import React, { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AppWindow, LEAVE_MS } from './AppWindow'
import styles from './AppWindow.module.css'
import { APP_WINDOW, DEMO_DATA } from './content'
import { DemoDashboard, DemoEventChip } from './OverviewPreview'
import { PipelinePreview } from './Previews'
import pills from '@/site/ui/PillSwitch.module.css'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const appWindow = (
  <AppWindow chip={<DemoEventChip />} overview={<DemoDashboard floorPlanHref="#plan" />} sales={<PipelinePreview />} />
)

let host: HTMLElement
let root: Root

const stubMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query === '(prefers-reduced-motion: reduce)' }))

const mount = () =>
  act(() => {
    root.render(appWindow)
  })

const views = () => [...host.querySelectorAll(`.${styles.view}`)] as HTMLElement[]
const overview = () => views()[0]
const sales = () => views()[1]
const tab = (label: string) =>
  [...host.querySelectorAll(`.${pills.switch} > :not(.${pills.pill})`)].find((pill) => pill.textContent === label) as HTMLElement
const picked = (label: string) => tab(label).hasAttribute('data-picked')

const press = (label: string) =>
  act(() => {
    tab(label).click()
  })

const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

/** The visitors' figure, as its rolling number's own text holds it. */
const visitors = () =>
  [...host.querySelectorAll('h3')].find((heading) => heading.textContent === 'Visitors registered')?.parentElement?.querySelector('p span span')
    ?.textContent

beforeEach(() => {
  vi.useFakeTimers()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('the window as the server sends it', () => {
  const markup = renderToStaticMarkup(appWindow)

  it('is glass, hidden from screen readers, and says "Demo data"', () => {
    expect(markup).toMatch(/^<div class="[^"]+" aria-hidden="true" data-ui="" data-glass="">/)
    expect(markup).toContain(`>${DEMO_DATA}<`)
  })

  it('shows the dashboard first, the sales board behind its tab', () => {
    const tabs = [...markup.matchAll(/<span( data-picked="")?>(Overview|Sales)<\/span>/g)].map(([, pickedNow, label]) => [label, Boolean(pickedNow)])
    expect(tabs).toEqual([
      [APP_WINDOW.overview, true],
      [APP_WINDOW.sales, false],
    ])
    const shownViews = [...markup.matchAll(new RegExp(`<div class="${styles.view}" inert=""( hidden="")?`, 'g'))].map(([, hidden]) => !hidden)
    expect(shownViews).toEqual([true, false])
  })
})

describe('switching with a pointer (AC 20, Q1 = A)', () => {
  it('lets nothing in it take the focus: its screens are inert and its pills are not buttons', () => {
    stubMotion(false)
    mount()
    const focusable = [...host.querySelectorAll('a[href], button, input, select, textarea, [tabindex]')].filter(
      (control) => control.closest('[inert]') === null,
    )
    expect(host.querySelectorAll('a[href]').length).toBeGreaterThan(0)
    expect(focusable).toEqual([])
    expect(views().every((view) => view.hasAttribute('inert'))).toBe(true)
    // Plain spans with no tabindex: a browser focuses neither by Tab nor by a click.
    for (const label of [APP_WINDOW.overview, APP_WINDOW.sales]) {
      expect(tab(label).tagName).toBe('SPAN')
      expect(tab(label).hasAttribute('tabindex')).toBe(false)
    }
  })

  it('moves the pill at once, lets the dashboard leave, then shows the board', () => {
    stubMotion(false)
    mount()
    press(APP_WINDOW.sales)
    expect(picked(APP_WINDOW.sales)).toBe(true)
    expect(picked(APP_WINDOW.overview)).toBe(false)
    expect(tab(APP_WINDOW.sales).parentElement?.hasAttribute('data-second')).toBe(true)
    expect(overview().hidden).toBe(false)
    expect(overview().hasAttribute('data-leaving')).toBe(true)
    expect(sales().hidden).toBe(true)

    wait(LEAVE_MS)
    expect(overview().hidden).toBe(true)
    expect(sales().hidden).toBe(false)
    expect(sales().hasAttribute('data-view-enter')).toBe(true)
    expect(sales().querySelectorAll('li li')).toHaveLength(10)
  })

  it('goes back to the dashboard the same way, and a press back mid-way keeps the view on screen', () => {
    stubMotion(false)
    mount()
    press(APP_WINDOW.sales)
    press(APP_WINDOW.overview)
    expect(overview().hasAttribute('data-leaving')).toBe(false)
    wait(LEAVE_MS * 4)
    expect(overview().hidden).toBe(false)
    expect(sales().hidden).toBe(true)

    press(APP_WINDOW.sales)
    wait(LEAVE_MS)
    press(APP_WINDOW.overview)
    wait(LEAVE_MS)
    expect(overview().hidden).toBe(false)
    expect(overview().hasAttribute('data-view-enter')).toBe(true)
    expect(tab(APP_WINDOW.sales).parentElement?.hasAttribute('data-second')).toBe(false)
  })

  it('changes the view at once with reduced motion', () => {
    stubMotion(true)
    mount()
    press(APP_WINDOW.sales)
    expect(sales().hidden).toBe(false)
    expect(overview().hidden).toBe(true)
  })

  it('leaves for as long in the stylesheet as in the script', () => {
    const css = readFileSync(join(process.cwd(), 'src', 'site', 'home', 'AppWindow.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    const leaving = /\.view\[data-leaving\] \{([^}]*)\}/.exec(css)?.[1] ?? ''
    expect(leaving).toContain(`opacity ${LEAVE_MS}ms ease-in`)
    expect(leaving).toContain(`transform ${LEAVE_MS}ms ease-in`)
  })
})

describe('the figures count up once, then stay still (AC 21, Q3 = A)', () => {
  it('keeps no time: on screen, nothing changes', () => {
    stubMotion(false)
    mount()
    expect(visitors()).toBe('4,812')
    expect(vi.getTimerCount()).toBe(0)
    wait(60_000)
    expect(visitors()).toBe('4,812')
  })

  it('shows the dashboard final when it comes back, its entrances played', () => {
    stubMotion(false)
    mount()
    expect(overview().hasAttribute('data-played')).toBe(false)
    press(APP_WINDOW.sales)
    wait(LEAVE_MS)
    press(APP_WINDOW.overview)
    wait(LEAVE_MS)
    expect(overview().hasAttribute('data-played')).toBe(true)
    expect(visitors()).toBe('4,812')
    expect(vi.getTimerCount()).toBe(0)
    // A played view's pieces draw no entrance again: every animation in it is off.
    const css = readFileSync(join(process.cwd(), 'src', 'site', 'home', 'AppWindow.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    expect(/\.view\[data-played\] \* \{\s*animation: none;\s*\}/.test(css)).toBe(true)
  })
})

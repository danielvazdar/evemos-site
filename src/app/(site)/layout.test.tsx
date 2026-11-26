/**
 * Evemos's own site answers on the root host only (F-025f). An organiser's
 * subdomain is white-labelled (E-36), so it must never render Evemos's
 * marketing, terms or privacy notice; an unknown host renders nothing.
 * F-192a: the backdrop behind every page, and Save-Data holding it still.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { SiteBackdrop } from '@/site/ui/SiteBackdrop'
import { WASH_CYCLE_MS } from '@/site/ui/wash-clock'

const request = vi.hoisted(() => ({ host: '', saveData: null as string | null }))

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ host: request.host, ...(request.saveData === null ? {} : { 'save-data': request.saveData }) }),
}))
vi.mock('next/server', () => ({ connection: async () => undefined }))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))
// The chrome and styles are not the subject; `page.test.tsx` renders them.
vi.mock('@/admin/fonts', () => ({ adminFontVariables: '' }))
vi.mock('@/site/chrome/SiteHeader', () => ({ SiteHeader: () => null }))
vi.mock('@/site/chrome/SiteFooter', () => ({ SiteFooter: () => null }))
vi.mock('@/site/styles/site.scss', () => ({}))

const { default: SiteLayout } = await import('./layout')

// SITE_URL is http://localhost:3000 in tests.
describe('(site) layout by host', () => {
  beforeEach(() => {
    request.host = ''
  })

  it.each(['localhost:3000', 'www.localhost:3000'])('renders on the root host %s', async (host) => {
    request.host = host
    await expect(SiteLayout({ children: null })).resolves.toBeTruthy()
  })

  it.each([
    ["an organiser's subdomain", 'acme.localhost:3000'],
    ['a reserved subdomain', 'admin.localhost:3000'],
    ['another domain', 'evil.example'],
  ])('is a 404 on %s', async (_label, host) => {
    request.host = host
    await expect(SiteLayout({ children: null })).rejects.toThrow('NEXT_NOT_FOUND')
  })
})

type Element = React.ReactElement<{ children?: React.ReactNode; 'data-wash'?: string; clock?: string }>

/** The layout's `<html>` for the root host, and the elements in its `<body>`. */
const renderRoot = async () => {
  request.host = 'localhost:3000'
  const html = (await SiteLayout({ children: null })) as Element
  const body = html.props.children as Element
  return { html, inBody: React.Children.toArray(body.props.children) as Element[] }
}

describe('(site) layout: the backdrop (F-192a AC 4)', () => {
  beforeEach(() => {
    request.saveData = null
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('draws the backdrop once, right after the skip link, on the server’s clock', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(WASH_CYCLE_MS * 5 + 4_250)
    const { inBody } = await renderRoot()
    const backdrops = inBody.filter((element) => element.type === SiteBackdrop)
    expect(backdrops).toHaveLength(1)
    expect(inBody.indexOf(backdrops[0])).toBe(1)
    expect(backdrops[0].props.clock).toBe('-4.25s')
  })

  it.each([
    ['on', 'still'],
    [' On ', 'still'],
    ['off', undefined],
    [null, undefined],
  ])('with Save-Data %j, <html data-wash> is %j', async (saveData, wash) => {
    request.saveData = saveData
    const { html } = await renderRoot()
    expect(html.props['data-wash']).toBe(wash)
  })
})

/** Each `localFont` call in a font module, by its constant's name, and whether Next preloads its file. */
const preloads = (file: string): Record<string, boolean> =>
  Object.fromEntries(
    [...readFileSync(join(process.cwd(), file), 'utf8').matchAll(/^(?:export )?const (\w+) = localFont\(\{([\s\S]*?)^\}\)/gm)].map(
      ([, name, options]) => [name, !/^\s*preload: false,$/m.test(options)],
    ),
  )

describe('(site) layout: the fonts it preloads (F-192f)', () => {
  // Every site page's first screen paints the display face and the body face; JetBrains Mono shows on two pages'
  // first screens only, never their main text, so it loads when a page draws it. The app shares this module.
  it('preloads Archivo and Instrument Sans, and not JetBrains Mono', () => {
    expect(preloads('src/admin/fonts.ts')).toEqual({ archivo: true, instrumentSans: true, jetbrainsMono: false })
  })
})

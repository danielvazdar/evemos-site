/**
 * security.txt (F-143b, L-08): the builder's fields, the page its Policy names,
 * and the route's hosts. The route's own folder starts with a dot, which test
 * globs may skip, so its test lives here and imports it by path.
 */
import { describe, expect, it, vi } from 'vitest'

import { links, SECURITY_EMAIL } from '@/site/links'
import { SECURITY_PAGE } from '@/site/pages/company'

import { securityTxt } from './security-txt'

const request = vi.hoisted(() => ({ host: '' }))
vi.mock('next/headers', () => ({ headers: async () => new Headers({ host: request.host }) }))

const { GET } = await import('@/app/.well-known/security.txt/route')

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

/** The values of every `name:` line. */
const fieldsOf = (text: string, name: string): string[] =>
  text
    .split('\n')
    .filter((line) => line.startsWith(`${name}: `))
    .map((line) => line.slice(name.length + 2))

describe('securityTxt', () => {
  const text = securityTxt(new Date('2026-11-08T15:00:00.000Z'))

  // SITE_URL is http://localhost:3000 in tests; production bakes https://evemos.events.
  it.each([
    ['Contact', `mailto:${SECURITY_EMAIL}`],
    ['Expires', '2027-05-07T00:00:00.000Z'],
    ['Policy', 'http://localhost:3000/security'],
    ['Preferred-Languages', 'en'],
  ])('has exactly one %s: %s', (name, value) => {
    expect(fieldsOf(text, name)).toEqual([value])
  })

  it('has those four lines and nothing else, each ending in LF', () => {
    expect(text).not.toContain('\r')
    expect(text.endsWith('\n')).toBe(true)
    expect(text.split('\n').slice(0, -1).map((line) => line.split(': ')[0])).toEqual([
      'Contact',
      'Expires',
      'Policy',
      'Preferred-Languages',
    ])
  })

  it('points Policy at the Security page, whose report section gives the same address', () => {
    expect(`/${SECURITY_PAGE.slug}`).toBe(links.security)
    const report = SECURITY_PAGE.sections.at(-1)
    expect(report?.items.filter((item) => item.line.includes(SECURITY_EMAIL))).toHaveLength(1)
  })

  it('expires in the future and less than a year ahead, today', () => {
    const [expires] = fieldsOf(securityTxt(), 'Expires')
    const ahead = Date.parse(expires) - Date.now()
    expect(ahead).toBeGreaterThan(0)
    expect(ahead).toBeLessThan(YEAR_MS)
  })
})

describe('GET /.well-known/security.txt', () => {
  it.each([
    ['the root host', 'localhost:3000'],
    ['the app host', 'app.localhost:3000'],
  ])('answers 200 in plain text on %s', async (_label, host) => {
    request.host = host
    const response = await GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8')
    expect(response.headers.get('cache-control')).toBe('public, max-age=86400')
    expect(fieldsOf(await response.text(), 'Contact')).toEqual([`mailto:${SECURITY_EMAIL}`])
  })

  it.each([
    ["an organiser's host", 'acme.localhost:3000'],
    ['a host no organiser could hold', 'admin.localhost:3000'],
    ['another domain', 'security.example'],
  ])('answers 404 on %s', async (_label, host) => {
    request.host = host
    const response = await GET()
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not found')
  })
})

/**
 * The site's error page (F-021a): a heading, a "Try again" button and a way
 * home, built from the site's own blocks, centred on the washes (F-192e).
 * Rendered with `renderToStaticMarkup`; the effect that logs the error does
 * not run in a server render, so nothing is printed here.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { links } from '@/site/links'
import tones from '@/site/ui/primitives.module.css'

import SiteError from './error'
import styles from './error.module.css'

describe('site error page', () => {
  const html = renderToStaticMarkup(<SiteError error={new Error('boom')} reset={() => undefined} />)

  it('says what happened in the one h1', () => {
    expect(html.match(/<h1\b[^>]*>([^<]*)<\/h1>/g)).toEqual(['<h1 id="error-title">This page didn&#x27;t load</h1>'])
  })

  it('offers a real "Try again" button and a link home', () => {
    expect(html).toMatch(/<button type="button"[^>]*>Try again<\/button>/)
    expect(html).toMatch(new RegExp(`<a href="${links.home}"[^>]*><span>Go to the homepage</span></a>`))
  })

  it('never shows the error message itself', () => {
    expect(html).not.toContain('boom')
  })

  it('stands its message, heading and buttons together, on the washes', () => {
    expect(html.startsWith(`<section aria-labelledby="error-title" class="${tones.section} ${tones.open}">`)).toBe(true)
    const message = html.slice(html.indexOf(`<div class="${styles.message}">`))
    expect(message).toMatch(/^<div class="[^"]+"><div class="[^"]+"><h1 id="error-title"/)
    expect(message).toContain('Try again')
  })
})

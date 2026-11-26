/**
 * /about: the story with the founder and the show he ran (the homepage no
 * longer names them), one h1, and only links that land. Both pages open on
 * the washes and read on calm bands (F-192e, E-131 Q4 = B).
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import AboutRoute, { metadata } from '@/app/(site)/about/page'
import ContactRoute from '@/app/(site)/contact/page'
import TeamRoute from '@/app/(site)/team/page'
import { OFFICES, TEAMS } from '@/site/company'
import { FOUNDER } from '@/site/founder'
import home from '@/site/home/home.module.css'
import { links } from '@/site/links'
import pages from '@/site/pages/MarketingPage.module.css'
import tones from '@/site/ui/primitives.module.css'

/** Each top-level band's tone, by what names it (the sections here do not nest). */
const tonesOf = (html: string): [name: string, tone: string | undefined][] =>
  [...html.matchAll(/<section\b[^>]*aria-(?:labelledby|label)="([^"]+)"[^>]*class="([^"]+)"/g)].map(([, name, classes]) => [
    name,
    [tones.open, tones.paper, tones.raised, tones.violet].find((tone) => classes.split(' ').includes(tone)),
  ])

/** The glass frame round a hero's photo or film. */
const GLASS_FRAME = `<div class="${home.glass} ${pages.glassFrame}" data-glass="">`

const html = renderToStaticMarkup(<AboutRoute />)
const text = html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/\s+/g, ' ')

describe('about page', () => {
  it('has one h1', () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1)
  })

  it('tells the story with the founder and the show he ran', () => {
    expect(text).toContain(FOUNDER.name)
    expect(text).toContain(FOUNDER.show)
  })

  it('invents no people and no street address: city-level offices only', () => {
    expect(text).not.toMatch(/\b(CEO|CTO|Head of|Office:|Street|Ulica)\b/)
  })

  it('links only to the team page and the demo form, and is canonical at /about', () => {
    const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(([, href]) => href)
    expect(new Set(hrefs)).toEqual(new Set([links.team, links.demo]))
    expect(metadata.alternates?.canonical).toBe(links.about)
  })

  it('gives its photo alt text', () => {
    expect(html).toMatch(/<img\b[^>]*\balt="[^"]{20,}"/)
  })

  it('opens on the washes, reads on alternating calm bands and ends on the violet close', () => {
    expect(tonesOf(html)).toEqual([
      ['about-title', tones.open],
      ['story-title', tones.raised],
      ['principles-title', tones.paper],
      ['company-title', tones.raised],
      ['offices-title', tones.paper],
      ['about-closing-title', tones.violet],
    ])
  })

  it('frames the hero photo in glass, and lets the story photo settle into its frame as the homepage\'s why photo does', () => {
    expect(html.slice(0, html.indexOf('id="story"'))).toContain(`${GLASS_FRAME}<img`)
    expect(html.slice(html.indexOf('id="story"'), html.indexOf('id="principles"'))).toContain(`<div class="${home.whyPhoto}"><img`)
  })
})

describe('team page', () => {
  const team = renderToStaticMarkup(<TeamRoute />)
  const teamText = team.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')

  it('has one h1, names only the founder, and lists every team and office', () => {
    expect(team.match(/<h1\b/g)).toHaveLength(1)
    expect(teamText).toContain(FOUNDER.name)
    for (const t of TEAMS) expect(teamText).toContain(t.name)
    for (const office of OFFICES) expect(teamText).toContain(office.city)
  })

  it('shows no portraits: no invented faces', () => {
    expect(team).not.toMatch(/<img\b/)
  })

  it('puts the hero and the founder on the washes, the teams and offices on calm bands, and ends on the violet close', () => {
    expect(tonesOf(team)).toEqual([
      ['team-title', tones.open],
      ['founder-title', tones.open],
      ['teams-title', tones.raised],
      ['offices-title', tones.paper],
      ['team-next-title', tones.violet],
    ])
  })

  it('frames the hall film in glass and makes the founder a glass key card', () => {
    expect(team.slice(0, team.indexOf('id="founder"'))).toContain(`${GLASS_FRAME}<figure`)
    expect(team.slice(team.indexOf('id="founder"'), team.indexOf('id="teams"'))).toContain(`<div class="${home.glass} ${home.keyCard}" data-glass=""><h3`)
  })
})

// The offices are the contact page's own band; the violet close still ends the page (F-192e).
describe('contact page', () => {
  it('shows where we are on the next calm band, before the violet close', () => {
    const bands = tonesOf(renderToStaticMarkup(<ContactRoute />))
    expect(bands.slice(-3)).toEqual([
      ['Pictures', tones.raised],
      ['offices-title', tones.paper],
      ['next-title', tones.violet],
    ])
  })
})

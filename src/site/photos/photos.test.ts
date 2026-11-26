/**
 * Guards for the site's pictures and clips: web-sized (F-118 AC 1: a raw 4-5 MB
 * PNG from the marketing folder must never land in the repo), and named for
 * what they show, so the file name works for search (Daniel, 2026-11-07:
 * "basic SEO on every image").
 *
 * How a picture gets here (one-off, no committed script; the source of each
 * file is listed in `~/PROJECT/EVEMOS/marketing/assets/README.md`):
 * - Name: lowercase words joined by hyphens that say what the picture shows
 *   (`conference-badges-with-qr-codes.jpg`), never a code (`p-crm`, `img-01`).
 * - Photos and renders (2816×1584 PNG):
 *   `sharp(in).resize({ width: 1600 }).jpeg({ quality: 80, mozjpeg: true })` → 1600×900.
 * - App screenshots: today's app, taken from a local run on the demo seed
 *   (`scripts/seed.ts`) in a 1600×900 window, JPEG at quality 85, so the text
 *   stays sharp (F-192d). Only demo data may show.
 * Next's optimiser serves them as WebP; `next/image` keeps their box (no layout shift).
 * Clips in `public/site/video/` are the 1280×720 web cuts from `animations/web/`.
 */
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

const KB = 1024
const PHOTOS = join(process.cwd(), 'src', 'site', 'photos')
const VIDEOS = join(process.cwd(), 'public', 'site', 'video')

/** Files that predate the rule, each with the reason it may stay. */
const ALLOWED_LARGE: Readonly<Record<string, string>> = {
  'exhibition-stand-render.png': 'the exhibitor-portal stand render, committed before the size rule (F-118)',
}

/** Lowercase words and hyphens, at least two words, and no letter-code prefix such as `p-`, `s-` or `t1b-`. */
const DESCRIPTIVE = /^(?![a-z]\d*-)[a-z0-9]+(?:-[a-z0-9]+)+\.[a-z0-9]+$/
/** Names that say nothing about the picture. */
const GENERIC = /^(img|image|photo|picture|pic|dsc|pexels|screenshot|untitled|final)\b|\b(copy|final|v\d+)\b/

/** The screenshots of the organiser app on the product pages. */
const APP_SCREENSHOTS = [
  'exhibitor-list-screenshot.jpg',
  'visitor-registrations-screenshot.jpg',
  'exhibitor-invoices-screenshot.jpg',
  'badge-check-in-screenshot.jpg',
] as const

const sizes = (dir: string) => readdirSync(dir).map((name) => ({ name, bytes: statSync(join(dir, name)).size }))

describe('site pictures and clips stay web-sized', () => {
  it('every picture in src/site/photos is at most 400 KB, bar the allowlist', () => {
    const over = sizes(PHOTOS).filter(({ name, bytes }) => bytes > 400 * KB && !ALLOWED_LARGE[name])
    expect(over).toEqual([])
  })

  it('no new PNG: pictures are converted to JPEG first', () => {
    const pngs = readdirSync(PHOTOS).filter((name) => name.endsWith('.png') && !ALLOWED_LARGE[name])
    expect(pngs).toEqual([])
  })

  it('every picture and clip is named for what it shows', () => {
    const files = [...readdirSync(PHOTOS), ...readdirSync(VIDEOS)].filter((name) => /\.(jpe?g|png|webp|avif|mp4|webm)$/.test(name))
    expect(files.filter((name) => !DESCRIPTIVE.test(name) || GENERIC.test(name))).toEqual([])
  })

  // F-192d: retaken from today's app, so a stale capture at another size is caught (AC 25).
  it.each(APP_SCREENSHOTS)('the app screenshot %s is a 1600×900 JPEG', async (name) => {
    expect(await sharp(join(PHOTOS, name)).metadata()).toMatchObject({ format: 'jpeg', width: 1600, height: 900 })
  })

  it('every clip in public/site/video is at most 4 MB', () => {
    expect(sizes(VIDEOS).filter(({ bytes }) => bytes > 4 * KB * KB)).toEqual([])
  })
})

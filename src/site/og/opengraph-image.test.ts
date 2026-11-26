/**
 * The share card (F-115c): the size and type social sites read from the meta
 * tags, an alt text that names the product, and a real 1200x630 PNG out of
 * `ImageResponse`. Whether every page's `<head>` carries the tags is checked
 * against a built server (the PR's curl check); what keeps it that way is the
 * `openGraph` scan at the bottom.
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import Image, { alt, contentType, size } from '@/app/(site)/opengraph-image'
import { PRODUCT_NAME } from '@/lib/product'

/** Width and height from a PNG's IHDR chunk: the 8-byte signature, then length, "IHDR", width, height. */
const pngSize = (bytes: Buffer) => ({
  signature: bytes.subarray(1, 4).toString('ascii'),
  chunk: bytes.subarray(12, 16).toString('ascii'),
  width: bytes.readUInt32BE(16),
  height: bytes.readUInt32BE(20),
})

describe('share card', () => {
  it('declares the large-card size, PNG and an alt that names the product', () => {
    expect(size).toEqual({ width: 1200, height: 630 })
    expect(contentType).toBe('image/png')
    expect(alt).toContain(PRODUCT_NAME)
  })

  // `admin-styles.test.ts` allowlists the card for its style={{}} colours, which
  // skips every rule there. So the rest are held here: no colour literal,
  // gradient or shadow, and no colour key given a string (a named colour such
  // as 'white'). Every colour is one of the `colour()` constants from tokens.json.
  it('types no colour: every colour comes from tokens.json', () => {
    const source = readFileSync(join(process.cwd(), 'src/app/(site)/opengraph-image.tsx'), 'utf8')
    expect(source).not.toMatch(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?)\(|gradient\(|drop-shadow\(|\b(?:boxShadow|textShadow)\s*:/i)
    expect(source).not.toMatch(/\b(?:color|background\w*|fill|stroke|border\w*|outline\w*)\s*[:=]\s*['"`]/)
  })

  it('renders a 1200x630 PNG', async () => {
    const response = await Image()
    expect(response.headers.get('content-type')).toBe('image/png')
    const png = pngSize(Buffer.from(await response.arrayBuffer()))
    expect(png).toEqual({ signature: 'PNG', chunk: 'IHDR', width: 1200, height: 630 })
  }, 30_000)
})

/**
 * ★ A page's own `openGraph` replaces the layout's whole object, and with it the
 * card: /about, the guides and the compare pages lost it that way. The tags
 * Next fills in by itself (og:title and og:description from the page's title
 * and description) need no `openGraph` at all. So only these two may set one:
 * the homepage, which sits in the image's own segment and keeps it, and the
 * articles, which hand the card back in (`articleMetadata`).
 */
const OPEN_GRAPH_ALLOWED = ['src/app/(site)/page.tsx', 'src/site/guides/GuideArticle.tsx']

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })

describe('the share card reaches every page', () => {
  it('no other site page sets an openGraph object that would drop it', () => {
    const files = ['src/app/(site)', 'src/site'].flatMap(sourceFiles)
    expect(files.length).toBeGreaterThan(20)
    const setting = files.filter((file) => /\bopenGraph\s*:/.test(readFileSync(file, 'utf8')))
    expect(setting.sort()).toEqual([...OPEN_GRAPH_ALLOWED].sort())
  })
})

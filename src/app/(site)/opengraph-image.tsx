import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

import { AISLE, BARS } from '@/admin/Mark'
import tokens from '@/brand/tokens.json'
import { PRODUCT_NAME } from '@/lib/product'
import { ONE_LINER } from '@/site/positioning'

/**
 * The share card (F-115c): the one picture LinkedIn, Slack, WhatsApp and X show
 * above a link to any page of the marketing site. Next's file convention adds
 * `og:image` to every page under `(site)`, and with `twitter.card =
 * 'summary_large_image'` (layout.tsx) X shows it full width.
 *
 * ★ The violet card (Daniel, 2026-11-05): `hall-violet` field, the Aisle E in
 * `on-hall-violet` with its `badge-yellow` aisle, the lowercase wordmark and the
 * one-liner. Colours are the tokens' light values and the mark is `Mark.tsx`'s
 * geometry, so a rebrand is still one `tokens.json`. No photo, no claim the site
 * does not already make.
 *
 * ★ STATIC: no request APIs, so `next build` renders it once. Satori reads
 * neither woff2 nor variable fonts, hence the one static Archivo instance
 * (width 125, weight 800, the brand's display face) committed beside its OFL.
 */
export const alt = `${PRODUCT_NAME}: ${ONE_LINER}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** A token's light value. Throws at build time if the brand file loses one, rather than drawing a blank card. */
const colour = (name: string): string => {
  const value = tokens.color.tokens.find((token) => token.name === name)?.value
  if (typeof value !== 'object') throw new Error(`tokens.json has no light colour "${name}"`)
  return value.light
}

const VIOLET = colour('hall-violet')
const ON_VIOLET = colour('on-hall-violet')
const YELLOW = colour('badge-yellow')

/**
 * ★ SQUARE-SAFE: WhatsApp and some others crop the card to its centre square
 * (630 wide, x 285 to 915). The lockup and the line are centred and kept
 * narrower than that, so the crop still reads "evemos" with the whole mark.
 */
const SAFE_WIDTH = 560

/** The wordmark's size; the mark is the same height and sits 9/48 of it away (the brand book's lockup). */
const WORDMARK_PX = 92

/** The corner floor plan, `FloorplanPattern`'s look at a whisper: booth widths in tiles, a wider aisle after row 2. */
const PLAN_ROWS: readonly (readonly (1 | 2)[])[] = [
  [1, 2, 1, 1, 2, 1],
  [2, 1, 1, 2, 1, 1],
  [1, 1, 2, 1, 1, 2],
  [1, 2, 1, 1, 1, 2],
]
const TILE = 40
const BOOTH_GAP = 8
const PLAN_AISLE = 24

function FloorPlanCorner() {
  return (
    <div style={{ position: 'absolute', right: -TILE, bottom: -TILE / 2, display: 'flex', flexDirection: 'column', opacity: 0.14 }}>
      {PLAN_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: BOOTH_GAP, marginTop: rowIndex === 0 ? 0 : rowIndex === 2 ? PLAN_AISLE : BOOTH_GAP }}>
          {row.map((span, boothIndex) => (
            <div
              key={boothIndex}
              style={{ width: span * TILE + (span - 1) * BOOTH_GAP, height: TILE, borderRadius: 4, background: ON_VIOLET }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default async function Image() {
  const archivo = await readFile(join(process.cwd(), 'src/site/og/Archivo-ExpandedExtraBold.ttf'))
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          background: VIOLET,
          color: ON_VIOLET,
          fontFamily: 'Archivo',
        }}
      >
        <FloorPlanCorner />
        <div style={{ display: 'flex', alignItems: 'center', gap: (WORDMARK_PX * 9) / 48 }}>
          <svg viewBox="0 0 48 48" width={WORDMARK_PX} height={WORDMARK_PX}>
            {BARS.map((bar) => (
              <rect key={`${bar.x}-${bar.y}`} rx={2} fill={ON_VIOLET} {...bar} />
            ))}
            <rect rx={2} fill={YELLOW} {...AISLE} />
          </svg>
          <div style={{ fontSize: WORDMARK_PX, lineHeight: 1, letterSpacing: '-0.02em' }}>{PRODUCT_NAME.toLowerCase()}</div>
        </div>
        <div
          style={{ marginTop: 44, maxWidth: SAFE_WIDTH, fontSize: 30, lineHeight: 1.3, letterSpacing: '-0.01em', textAlign: 'center' }}
        >
          {ONE_LINER}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Archivo', data: archivo, style: 'normal', weight: 800 }],
    },
  )
}

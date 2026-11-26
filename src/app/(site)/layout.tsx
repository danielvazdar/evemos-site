import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import React from 'react'

import { adminFontVariables } from '@/admin/fonts'
import { saveDataOn, washOnLoad } from '@/app/(app)/_components/wash-motion'
import { isRootHost } from '@/lib/organiser-host'
import { PRODUCT_NAME } from '@/lib/product'
import { SITE_URL } from '@/lib/site-config'
import { SiteFooter } from '@/site/chrome/SiteFooter'
import { SiteHeader } from '@/site/chrome/SiteHeader'
import { RevealOnScroll } from '@/site/ui/RevealOnScroll'
import { SiteBackdrop } from '@/site/ui/SiteBackdrop'
import { washClock } from '@/site/ui/wash-clock'
import '@/site/styles/site.scss'

/**
 * Root layout for Evemos's OWN pages (F-021): the homepage now, product,
 * pricing and the rest later.
 *
 * ★ A SECOND ROOT LAYOUT, not a nested one. `(frontend)/layout.tsx` stays the
 * root of the organiser pages, and global CSS imported by one root layout never
 * loads under the other. So Evemos's tokens and fonts (`site.scss`) reach only
 * these pages, and an organiser's event page keeps wearing the organiser's
 * brand. `src/admin/admin-styles.test.ts` keeps the two groups from importing
 * each other.
 *
 * The fonts are the admin's module (`adminFontVariables`): the same three
 * self-hosted faces, so a second `next/font` call does not ship them twice.
 * Light theme only: no `data-theme` is set, so the generated dark block never
 * applies.
 *
 * The backdrop (`SiteBackdrop`, E-119) is drawn here once, behind every page.
 * Under `Save-Data: on`, `<html data-wash="still">` holds its washes still from
 * the first byte, as the app's layout does (`wash-motion.ts`); the site has no
 * Background motion switch, so it asks as the app does with none picked.
 */
export const metadata: Metadata = {
  title: {
    default: PRODUCT_NAME,
    template: '%s',
  },
  metadataBase: new URL(SITE_URL),
  // The share card is `opengraph-image.tsx` beside this file; Next copies it to
  // `twitter:image`, and this makes X show it full width instead of a thumbnail.
  twitter: { card: 'summary_large_image' },
}

interface SiteLayoutProps {
  children: React.ReactNode
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  // Every page renders per request, for the same reason as `(frontend)/layout.tsx`:
  // Next stamps its inline scripts with the nonce from this request's CSP
  // (src/proxy.ts), and a page built ahead of time has no request, so its
  // scripts would carry no nonce and be blocked.
  await connection()
  // ★ Evemos's own site lives on the root host only (F-025f). An organiser's
  // subdomain is white-labelled (E-36): it must never show Evemos's marketing,
  // terms or privacy notice, and an unknown subdomain shows nothing.
  const head = await headers()
  if (!isRootHost(head.get('host'))) notFound()
  return (
    <html lang="en" className={adminFontVariables} data-wash={washOnLoad('off', saveDataOn(head.get('save-data')))}>
      <body>
        {/* First focusable element on every page, so a keyboard skips the header in one key. */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {/* The washes every page's glass sits over, started where the last page left them. */}
        <SiteBackdrop clock={washClock(Date.now())} />
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <RevealOnScroll />
      </body>
    </html>
  )
}

/**
 * Single source of truth for the public site URL. Used by Payload config,
 * sitemap.ts, robots.ts, seo.ts. Eliminates the previous 3-way duplication.
 *
 * Lives in `src/lib/` (not `src/app/(frontend)/_lib/`) so it can be imported
 * by both Payload-side and Next-app code without crossing route-group bounds.
 *
 * ⚠️ Stays throw-free and import-free: it reaches the browser bundle (via
 * `org-links.ts`), where `NODE_ENV` is `production` and a throw would break the
 * admin. Validation lives in `server-env.ts`, which refuses a missing or
 * non-https address at server start in staging and production — so the dev
 * fallback below can only ever be used in development.
 */

/** The address used when none is set — local development only. */
export const DEV_SITE_URL = 'http://localhost:3000'

/**
 * Exactly what the build baked in. `process.env.NEXT_PUBLIC_SITE_URL` must be
 * read literally here for Next to inline it; `server-env.ts` validates this
 * value and compares it with the runtime one.
 */
export const BAKED_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? ''

export const SITE_URL = BAKED_SITE_URL || DEV_SITE_URL

/**
 * The staff app's address: `app.` in front of the site host, scheme and port
 * kept (`https://app.evemos.events`, `http://app.localhost:3000` in dev). The
 * admin, Payload's API and the staff cookie live there and nowhere else (E-42).
 * Derived, not configured, so the image build and the server need no second
 * address. An unparsable `siteUrl` falls back to the dev address instead of
 * throwing (see the note at the top); `server-env.ts` refuses one at boot.
 */
export function appUrlFor(siteUrl: string): string {
  try {
    const url = new URL(siteUrl)
    return `${url.protocol}//app.${url.host}`
  } catch {
    return 'http://app.localhost:3000'
  }
}

export const APP_URL = appUrlFor(SITE_URL)

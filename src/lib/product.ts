import { SITE_URL } from './site-config'

/**
 * The product's own name — the one place it is spelled. Organiser-facing pages
 * show the organiser's and event's names; this appears only where the platform
 * speaks for itself ("Powered by …", system emails, the admin title).
 */
export const PRODUCT_NAME = 'Evemos'

/**
 * How Evemos staff sign what they send an organiser's team, an invite or a
 * support answer (#490, #572): the team, never a person.
 */
export const PLATFORM_TEAM_INVITER = `The ${PRODUCT_NAME} team`

/**
 * Evemos's OWN privacy notice — for what the platform itself does on every
 * page (the cookie banner's analytics), as opposed to the organiser's
 * documents each event's forms link to. The page is `src/app/(site)/privacy`,
 * its words `src/site/legal/privacy-content.ts` (F-022). On the site's own
 * host, so it follows the baked `SITE_URL` instead of naming a domain (E-43).
 */
export const PLATFORM_PRIVACY_URL = `${SITE_URL}/privacy`

/**
 * Evemos's own terms: the website, demo requests and organisers' subscriptions
 * (`src/site/legal/terms-content.ts`, F-022). For later emails and the admin.
 */
export const PLATFORM_TERMS_URL = `${SITE_URL}/terms`

/**
 * Version date of Evemos's own privacy notice — stamped onto every demo
 * request (`demo-requests.privacyNotice`), so a row says which notice the
 * person ticked the box against. Same shape as an event's `privacyVersion`.
 *
 * ★ The notice's "Last updated" date IS this constant (`privacy-content.ts`
 * imports it). Change the notice → add a history entry with the new date →
 * set this to that date; the demo form's stamp follows. Rows keep the old one.
 * `privacy.test.tsx` fails if the newest history entry and this differ.
 */
export const PLATFORM_PRIVACY_VERSION = '2026-11-24'

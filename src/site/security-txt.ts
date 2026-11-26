import { SITE_URL } from '@/lib/site-config'
import { links, SECURITY_EMAIL } from '@/site/links'

/**
 * ★ /.well-known/security.txt (RFC 9116, F-143b, audit L-08): who to tell about
 * a security hole. Served by `src/app/.well-known/security.txt/route.ts`.
 *
 * `Expires` rolls forward on its own: midnight UTC of today plus
 * `SECURITY_TXT_EXPIRES_DAYS`, so it is always under the year ahead RFC 9116
 * recommends and never needs a manual bump. Because it never goes stale, the
 * date cannot warn that the mailbox stopped working: send a test mail to
 * `SECURITY_EMAIL` before a deploy that changes it.
 *
 * `Policy` is the Security page, whose last section says how to report.
 * `Preferred-Languages` is English only, like every page (E-12). Unsigned, and
 * without the Canonical, Encryption, Acknowledgments and Hiring fields (F-143
 * leaves them out).
 */

/** How far ahead `Expires` is, in days. */
const SECURITY_TXT_EXPIRES_DAYS = 180

const DAY_MS = 24 * 60 * 60 * 1000

export function securityTxt(now: Date = new Date()): string {
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const expires = new Date(midnight + SECURITY_TXT_EXPIRES_DAYS * DAY_MS).toISOString()
  return [
    `Contact: mailto:${SECURITY_EMAIL}`,
    `Expires: ${expires}`,
    `Policy: ${SITE_URL}${links.security}`,
    'Preferred-Languages: en',
  ]
    .map((line) => `${line}\n`)
    .join('')
}

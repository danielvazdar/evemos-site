import { cspOrigins } from '@/lib/csp'
import type { ServerMode } from '@/lib/server-env'
import { readR2Env } from '@/lib/storage'

import { CONTROLLER, findPlaceholders } from './controller'
import { NOTICE_COVERS, PRIVACY_DOCUMENT } from './privacy-content'
import { TERMS_DOCUMENT } from './terms-content'

/**
 * The legal release guard (F-022): a public server must not run with a privacy
 * notice or terms that are unfinished or untrue.
 *
 * ★ Two checks, both about what the published documents say:
 *  - a `[[TODO: …]]` placeholder is left in the controller details or in a
 *    document (a notice without the business's name and OIB is no notice);
 *  - the server is configured to send data to a service the notice does not
 *    name: Umami analytics (`NEXT_PUBLIC_UMAMI_SCRIPT_URL`) or Cloudflare R2
 *    uploads (the `R2_*` set). Both are runtime switches, so only a check at
 *    boot sees them.
 *
 * `production` → errors (`src/instrumentation.ts` exits 1), `staging` →
 * warnings, `development` and `build` → nothing. A unit test cannot hold this
 * line: one that failed while placeholders remain would turn CI red for every
 * unrelated PR until the answers arrive.
 *
 * Pure: env and mode are passed in, as in `parseServerEnv`, and the documents
 * are a parameter so tests can pass clean and unfinished fixtures.
 */

/** What the privacy notice names beyond the fixed processors; the guard refuses a server doing more. */
export type NoticeCovers = Readonly<{ analytics: boolean; r2Uploads: boolean }>

export type LegalSource = Readonly<{
  /** How the message names it. */
  label: string
  /** Prefix of every path in the message, e.g. `controller.oib`. */
  name: string
  /** The file the fix goes in. */
  file: string
  value: unknown
}>

export type LegalSources = Readonly<{
  documents: readonly LegalSource[]
  covers: NoticeCovers
}>

export type LegalReleaseProblems = { errors: string[]; warnings: string[] }

export const LEGAL_SOURCES: LegalSources = Object.freeze({
  documents: Object.freeze([
    {
      label: 'Legal details (shown on /privacy and /terms)',
      name: 'controller',
      file: 'src/site/legal/controller.ts',
      value: CONTROLLER,
    },
    {
      label: 'Privacy notice',
      name: 'privacy',
      file: 'src/site/legal/privacy-content.ts',
      value: PRIVACY_DOCUMENT,
    },
    {
      label: 'Terms',
      name: 'terms',
      file: 'src/site/legal/terms-content.ts',
      value: TERMS_DOCUMENT,
    },
  ]),
  covers: NOTICE_COVERS,
})

const placeholderProblems = (documents: readonly LegalSource[]): string[] =>
  documents.flatMap(({ label, name, file, value }) =>
    findPlaceholders(value, name).map(
      (path) => `${label}: ${path} is still a placeholder. Fill it in ${file}.`,
    ),
  )

const undisclosed = (service: string): string =>
  `The server is configured for ${service} but the privacy notice does not name it. ` +
  'Update src/site/legal/privacy-content.ts (and bump PLATFORM_PRIVACY_VERSION) first.'

/**
 * `readR2Env` throws on a half-set R2 config. That throw is left to propagate:
 * `storage.ts` already treats it as a boot failure, and swallowing it here
 * would hide the more dangerous problem behind this one.
 */
const serviceProblems = (env: NodeJS.ProcessEnv, covers: NoticeCovers): string[] => {
  // The same reading as the CSP: a malformed URL loads no script, so it configures nothing.
  const umami = cspOrigins({ NEXT_PUBLIC_UMAMI_SCRIPT_URL: env.NEXT_PUBLIC_UMAMI_SCRIPT_URL }).umami
  return [
    ...(umami && !covers.analytics ? [undisclosed('Umami analytics (NEXT_PUBLIC_UMAMI_SCRIPT_URL)')] : []),
    ...(readR2Env(env) && !covers.r2Uploads ? [undisclosed('Cloudflare R2 uploads (R2_*)')] : []),
  ]
}

export function legalReleaseProblems(
  env: NodeJS.ProcessEnv,
  mode: ServerMode,
  sources: LegalSources = LEGAL_SOURCES,
): LegalReleaseProblems {
  if (mode === 'development' || mode === 'build') return { errors: [], warnings: [] }
  const problems = [...placeholderProblems(sources.documents), ...serviceProblems(env, sources.covers)]
  return mode === 'production' ? { errors: problems, warnings: [] } : { errors: [], warnings: problems }
}

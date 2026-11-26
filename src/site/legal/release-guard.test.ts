/**
 * The legal release guard (F-022): production refuses to start while a legal
 * detail is a placeholder, or while the server sends data to a service the
 * privacy notice does not name. Staging only warns. The documents are passed
 * in as fixtures, so CI stays green while the real placeholders wait for
 * Daniel's answers.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { findPlaceholders, PLACEHOLDER } from './controller'
import { LEGAL_SOURCES, legalReleaseProblems, type LegalSources } from './release-guard'

const env = (vars: Record<string, string> = {}) => vars as unknown as NodeJS.ProcessEnv

const R2 = {
  R2_ACCOUNT_ID: 'account',
  R2_ACCESS_KEY_ID: 'key-id',
  R2_SECRET_ACCESS_KEY: 'secret-value',
  R2_BUCKET_MEDIA: 'media',
  R2_PUBLIC_URL: 'https://assets.example.com',
}
const UMAMI = { NEXT_PUBLIC_UMAMI_SCRIPT_URL: 'https://stats.example.com/script.js' }

const clean = (covers = { analytics: false, r2Uploads: false }): LegalSources => ({
  documents: [{ label: 'Clean', name: 'clean', file: 'clean.ts', value: { title: 'Done', list: ['a', 'b'] } }],
  covers,
})

const unfinished: LegalSources = {
  documents: [
    { label: 'Details', name: 'controller', file: 'controller.ts', value: { oib: '[[TODO: OIB]]', name: 'Kyuro' } },
    {
      label: 'Privacy notice',
      name: 'privacy',
      file: 'privacy-content.ts',
      value: { sections: [{ rows: [['Logs', '[[TODO: server log retention]]']] }] },
    },
  ],
  covers: { analytics: false, r2Uploads: false },
}

describe('findPlaceholders', () => {
  it('finds every token in nested objects, arrays and strings, by dotted path', () => {
    const fixture = {
      name: 'Kyuro',
      oib: '[[TODO: OIB]]',
      address: ['Street 1', 'before [[TODO: town]] after'],
      deep: { table: { rows: [['ok', '[[TODO: cell]]']] }, count: 3, flag: true, none: null },
    }

    expect(findPlaceholders(fixture)).toEqual(['oib', 'address.1', 'deep.table.rows.0.1'])
    expect(findPlaceholders(fixture, 'controller')).toContain('controller.oib')
  })

  it('a bare string is its own path', () => {
    expect(findPlaceholders('[[TODO: x]]', 'title')).toEqual(['title'])
  })

  it('returns nothing for finished content, look-alikes included', () => {
    expect(findPlaceholders({ a: 'Done', b: ['[TODO: single brackets]', 'TODO'], c: { d: 1 } })).toEqual([])
  })

  it('PLACEHOLDER matches the token shape only', () => {
    expect(PLACEHOLDER.test('[[TODO: OIB]]')).toBe(true)
    expect(PLACEHOLDER.test('[[ TODO OIB ]]')).toBe(false)
  })
})

describe('legalReleaseProblems: placeholders', () => {
  const expected = [
    'Details: controller.oib is still a placeholder. Fill it in controller.ts.',
    'Privacy notice: privacy.sections.0.rows.0.1 is still a placeholder. Fill it in privacy-content.ts.',
  ]

  it('production: one error per placeholder, naming its path and file', () => {
    expect(legalReleaseProblems(env(), 'production', unfinished)).toEqual({ errors: expected, warnings: [] })
  })

  it('staging: the same items as warnings', () => {
    expect(legalReleaseProblems(env(), 'staging', unfinished)).toEqual({ errors: [], warnings: expected })
  })

  it.each(['development', 'build'] as const)('%s: nothing', (mode) => {
    expect(legalReleaseProblems(env({ ...UMAMI, ...R2 }), mode, unfinished)).toEqual({ errors: [], warnings: [] })
  })

  it('finished documents and a plain server: nothing in any mode', () => {
    expect(legalReleaseProblems(env(), 'production', clean())).toEqual({ errors: [], warnings: [] })
    expect(legalReleaseProblems(env(), 'staging', clean())).toEqual({ errors: [], warnings: [] })
  })
})

describe('legalReleaseProblems: services the notice does not name', () => {
  it('Umami configured while the notice does not cover analytics → error', () => {
    const { errors } = legalReleaseProblems(env(UMAMI), 'production', clean())

    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('Umami analytics')
    expect(errors[0]).toContain('PLATFORM_PRIVACY_VERSION')
  })

  it('a full R2 config while the notice does not cover uploads → error', () => {
    const { errors } = legalReleaseProblems(env(R2), 'production', clean())

    expect(errors).toHaveLength(1)
    expect(errors[0]).toContain('Cloudflare R2 uploads')
  })

  it('staging warns about the same', () => {
    expect(legalReleaseProblems(env({ ...UMAMI, ...R2 }), 'staging', clean()).warnings).toHaveLength(2)
  })

  it('once the notice covers them, both are allowed', () => {
    expect(
      legalReleaseProblems(env({ ...UMAMI, ...R2 }), 'production', clean({ analytics: true, r2Uploads: true })),
    ).toEqual({ errors: [], warnings: [] })
  })

  it('a malformed Umami URL configures nothing, so it is no problem here', () => {
    expect(legalReleaseProblems(env({ NEXT_PUBLIC_UMAMI_SCRIPT_URL: 'not a url' }), 'production', clean()).errors).toEqual([])
  })

  it('a half R2 config throws, as storage.ts treats it: a boot failure', () => {
    expect(() => legalReleaseProblems(env({ R2_ACCOUNT_ID: 'account' }), 'production', clean())).toThrow(
      /partially configured/,
    )
  })
})

describe('the real sources', () => {
  it('include the controller details and both documents, and the notice covers no extra service', () => {
    expect(LEGAL_SOURCES.documents.map((d) => d.name)).toEqual(['controller', 'privacy', 'terms'])
    expect(LEGAL_SOURCES.covers).toEqual({ analytics: false, r2Uploads: false })
  })
})

describe('wiring', () => {
  const source = (path: string) => readFileSync(join(process.cwd(), 'src', path), 'utf8')

  it('instrumentation.ts runs the guard after parseServerEnv and exits 1 on errors', () => {
    const code = source('instrumentation.ts')
    const parsed = code.indexOf('parseServerEnv(process.env')
    const guarded = code.indexOf('legalReleaseProblems(process.env, serverEnv.mode)')

    expect(parsed).toBeGreaterThan(-1)
    expect(guarded).toBeGreaterThan(parsed)
    expect(code.slice(guarded)).toMatch(/legal\.errors\.length > 0[\s\S]*process\.exit\(1\)/)
  })

  it('payload.config.ts does not call it: copy must not block migrate or seed', () => {
    expect(source('payload.config.ts')).not.toContain('legalReleaseProblems')
  })
})

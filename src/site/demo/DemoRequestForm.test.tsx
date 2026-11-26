/**
 * The "Book a demo" form (F-021c2). The repo has no DOM test environment, so
 * the markup is rendered statically for each state, and the state and submit
 * rules are driven directly through `demo-form-state.ts`, with
 * `submitPublicForm` reading replies from a fake `fetch`.
 *
 * ★ THE FORM AND THE ENDPOINT CANNOT DRIFT. The body the form posts has exactly
 * the keys `demoRequestSchema` accepts (it is strict: an extra key is a 400),
 * and a filled-in form parses.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DEMO_SHOW_SIZES } from '@/collections/platform/DemoRequests'
import { submitPublicForm } from '@/forms/submit-form'
import { DEMO_FIELD_MESSAGES, demoRequestSchema } from '@/lib/demo-request-intake'
import { DemoCta } from '@/site/home/DemoCta'
import { DEMO_EMAIL, demoMailto, links } from '@/site/links'
import { withoutHidden } from '@/site/testing/markup'

import { DEMO_FORM } from './content'
import {
  createDemoSubmit,
  DEMO_ENDPOINT,
  demoFormReducer,
  initialDemoFormState,
  toDemoPayload,
  type DemoFormAction,
  type DemoFormState,
} from './demo-form-state'
import { DemoRequestFormView, type DemoRequestFormViewProps } from './DemoRequestForm'
import styles from './DemoRequestForm.module.css'

afterEach(() => {
  vi.unstubAllEnvs()
})

const SITE_KEY = 'test-site-key'

const view = (state: DemoFormState, overrides: Partial<DemoRequestFormViewProps> = {}): string =>
  renderToStaticMarkup(
    <DemoRequestFormView
      state={state}
      dispatch={() => {}}
      onSubmit={() => {}}
      siteKey={SITE_KEY}
      fallbackEmail="demo@expo.example"
      showSizes={DEMO_SHOW_SIZES}
      labelledBy="demo-title"
      hydrated
      {...overrides}
    />,
  )

const reduce = (actions: DemoFormAction[], from: DemoFormState = initialDemoFormState): DemoFormState =>
  actions.reduce(demoFormReducer, from)

const FILLED = reduce([
  { type: 'edit', field: 'fullName', value: 'Ana Horvat' },
  { type: 'edit', field: 'email', value: 'ana@expo.example' },
  { type: 'edit', field: 'company', value: 'Example Expo' },
  { type: 'edit', field: 'showSize', value: '50-150' },
  { type: 'edit-privacy', value: true },
  { type: 'token', token: 'turnstile-token' },
])

/** A fake `fetch` answering with one status and JSON body, counting calls. */
const replying = (status: number, body: unknown, headers: Record<string, string> = {}) => {
  const fetchImpl = vi.fn(
    async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } }),
  )
  const post = (payload: unknown) => submitPublicForm(DEMO_ENDPOINT, payload, { fetchImpl })
  return { fetchImpl, post }
}

/** Run one submit from `state` and return where the reducer ends up. */
const submitFrom = async (state: DemoFormState, post: Parameters<typeof createDemoSubmit>[0]) => {
  let current = state
  await createDemoSubmit(post)(current, (action) => {
    current = demoFormReducer(current, action)
  })
  return current
}

/** The opening tag of the element with this id. */
const tagWithId = (html: string, id: string): string => new RegExp(`<[a-z]+\\b[^>]*\\bid="${id}"[^>]*>`).exec(html)?.[0] ?? ''

/** The submit button, whole. */
const button = (html: string): string => /<button type="submit"[\s\S]*?<\/button>/.exec(html)?.[0] ?? ''

/** What a screen reader reads of some markup: its text without the parts hidden from it. */
const spoken = (markup: string): string => withoutHidden(markup).replace(/<[^>]+>/g, '').trim()

describe('the form on the homepage', () => {
  const homepageDemo = () => {
    vi.stubEnv('TURNSTILE_SITE_KEY', SITE_KEY)
    vi.stubEnv('DEMO_REQUEST_EMAIL', 'demo@expo.example')
    return renderToStaticMarkup(<DemoCta />)
  }

  it('posts to /api/book-demo, named by the section heading', () => {
    const form = /<form\b[^>]*>/.exec(homepageDemo())?.[0] ?? ''

    expect(form).toContain(`action="${DEMO_ENDPOINT}"`)
    expect(DEMO_ENDPOINT).toBe('/api/book-demo')
    expect(form).toContain('method="post"')
    expect(form).toContain('aria-labelledby="demo-title"')
  })

  it('asks for the fields in the spec order, each labelled', () => {
    const html = homepageDemo()
    const order = [...html.matchAll(/<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"/g)].map(([, name]) => name)

    expect(order).toEqual([
      'fullName',
      'email',
      'company',
      'showName',
      'showSize',
      'showWhen',
      'message',
      'acceptPrivacy',
      'website_url',
    ])
    for (const name of order) expect(html).toContain(`for="demo-${name}"`)
  })

  it('marks name, email, company, show size and the privacy box required, and the rest optional', () => {
    const html = homepageDemo()
    const required = (name: string) => /\brequired=""/.test(tagWithId(html, `demo-${name}`))

    expect(['fullName', 'email', 'company', 'showSize', 'acceptPrivacy'].filter((name) => !required(name))).toEqual([])
    expect(['showName', 'showWhen', 'message'].filter(required)).toEqual([])
    expect(html.match(/> \(optional\)</g)).toHaveLength(3)
  })

  it('gives the email, name and company fields their autocomplete, and email its type', () => {
    const html = homepageDemo()

    expect(tagWithId(html, 'demo-email')).toMatch(/type="email"/)
    expect(tagWithId(html, 'demo-email')).toMatch(/autoComplete="email"/)
    expect(tagWithId(html, 'demo-fullName')).toMatch(/autoComplete="name"/)
    expect(tagWithId(html, 'demo-company')).toMatch(/autoComplete="organization"/)
    expect(tagWithId(html, 'demo-email')).toMatch(/aria-describedby="demo-email-hint"/)
  })

  it('offers the collection\'s size buckets after an empty "Choose one"', () => {
    const select = /<select\b[^>]*id="demo-showSize"[\s\S]*?<\/select>/.exec(homepageDemo())?.[0] ?? ''
    const options = [...select.matchAll(/<option value="([^"]*)"[^>]*>([^<]*)<\/option>/g)].map(([, value, label]) => [value, label])

    expect(options).toEqual([['', 'Choose one'], ...DEMO_SHOW_SIZES.map(({ value, label }) => [value, label])])
  })

  it('links the privacy box to /privacy, a route that exists, in a new tab', () => {
    const html = homepageDemo()

    expect(html).toContain(`<a href="${links.privacy}" target="_blank" rel="noopener noreferrer">`)
    expect(html).not.toContain('href="#"')
  })

  it('hides the honeypot off screen, from assistive tech and from the tab order', () => {
    const honeypot = /<div class="[^"]*" aria-hidden="true"><label for="demo-website_url">[\s\S]*?<\/div>/.exec(homepageDemo())?.[0]

    expect(honeypot).toBeDefined()
    expect(tagWithId(honeypot ?? '', 'demo-website_url')).toMatch(/\btabindex="-1"/)
  })

  it('carries a Turnstile container', () => {
    expect(homepageDemo()).toMatch(/data-captcha="turnstile"/)
  })

  it('has one "Book a demo" in the section, and it is the submit button', () => {
    const html = homepageDemo()
    const controls = [...html.matchAll(/<(a|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)].filter(([, , , inner]) =>
      inner.replace(/<[^>]+>/g, '').includes('Book a demo'),
    )

    expect(controls).toHaveLength(1)
    expect(controls[0][1]).toBe('button')
    expect(controls[0][2]).toMatch(/type="submit"/)
  })

  it('keeps the button disabled in the server markup, and says why under noscript', () => {
    const html = homepageDemo()

    expect(html).toMatch(/<button type="submit"[^>]*disabled=""/)
    expect(html).toMatch(/<noscript>[\s\S]*This form needs JavaScript\.[\s\S]*demo@expo\.example[\s\S]*<\/noscript>/)
  })
})

describe('what the form posts', () => {
  it('sends exactly the keys the endpoint accepts', () => {
    expect(Object.keys(toDemoPayload(FILLED)).sort()).toEqual(Object.keys(demoRequestSchema.shape).sort())
  })

  it('sends a filled-in form the endpoint parses', () => {
    expect(demoRequestSchema.safeParse(toDemoPayload(FILLED)).success).toBe(true)
  })

  it('posts nothing without a Turnstile token, and asks the person to wait', async () => {
    const { fetchImpl, post } = replying(201, { success: true })
    const state = await submitFrom(reduce([{ type: 'token', token: null }], FILLED), post)

    expect(fetchImpl).not.toHaveBeenCalled()
    expect(state.waitingForCheck).toBe(true)
    expect(view(state)).toContain(`role="alert">${DEMO_FORM.waitForCheck.replace(/'/g, '&#x27;')}</p>`)
  })

  it('posts once when pressed twice while the first is pending, and again after it settles', async () => {
    const { fetchImpl, post } = replying(201, { success: true })
    const submit = createDemoSubmit(post)
    const dispatch = () => {}

    await Promise.all([submit(FILLED, dispatch), submit(FILLED, dispatch)])
    expect(fetchImpl).toHaveBeenCalledTimes(1)

    await submit(FILLED, dispatch)
    expect(fetchImpl).toHaveBeenCalledTimes(2)
  })
})

describe('replies', () => {
  it('replaces the form with a status panel on success', async () => {
    const state = await submitFrom(FILLED, replying(201, { success: true, message: 'Saved.' }).post)
    const html = view(state)

    expect(html).toMatch(/^<div class="[^"]*" role="status" tabindex="-1"><h3>Request sent<\/h3>/)
    expect(html).toContain(DEMO_FORM.success.body.replace(/'/g, '&#x27;'))
    expect(html).not.toContain('<form')
    expect(state.resetSignal).toBe(0)
  })

  it('marks the fields a 400 names, with their messages, and a summary alert', async () => {
    const { post } = replying(400, {
      error: 'Some details are missing or invalid.',
      fields: [
        { field: 'email', message: DEMO_FIELD_MESSAGES.email },
        { field: 'company', message: 'Enter your company.' },
      ],
    })
    const html = view(await submitFrom(FILLED, post))

    expect(tagWithId(html, 'demo-email')).toMatch(/aria-invalid="true"/)
    expect(tagWithId(html, 'demo-email')).toMatch(/aria-describedby="demo-email-error demo-email-hint"/)
    expect(tagWithId(html, 'demo-company')).toMatch(/aria-invalid="true"/)
    expect(tagWithId(html, 'demo-fullName')).not.toMatch(/aria-invalid/)
    expect(html).toContain(`id="demo-email-error">${DEMO_FIELD_MESSAGES.email}</p>`)
    expect(html).toContain('id="demo-company-error">Enter your company.</p>')
    expect(html).toMatch(/role="alert">Some details are missing or invalid\.<\/p>/)
  })

  it('clears only the edited field\'s error', async () => {
    const { post } = replying(400, {
      fields: [
        { field: 'email', message: DEMO_FIELD_MESSAGES.email },
        { field: 'company', message: 'Enter your company.' },
      ],
    })
    const state = reduce([{ type: 'edit', field: 'email', value: 'ana@show.example' }], await submitFrom(FILLED, post))
    const html = view(state)

    expect(tagWithId(html, 'demo-email')).not.toMatch(/aria-invalid/)
    expect(tagWithId(html, 'demo-company')).toMatch(/aria-invalid="true"/)
  })

  it.each([
    ['a 400 with fields', replying(400, { fields: [{ field: 'email', message: 'x' }] }).post],
    ['a refused captcha', replying(400, { error: 'We could not accept this submission.' }).post],
    ['a rate limit', replying(429, { error: 'Too many submissions.' }, { 'Retry-After': '120' }).post],
    ['a server error', replying(500, { error: 'We could not record this right now.' }).post],
    ['a dropped connection', () => submitPublicForm(DEMO_ENDPOINT, {}, { fetchImpl: () => Promise.reject(new TypeError('offline')) })],
  ])('burns the Turnstile token after %s', async (_name, post) => {
    const state = await submitFrom(FILLED, post)

    expect(state.resetSignal).toBe(1)
    expect(state.token).toBeNull()
    expect(state.pending).toBe(false)
  })

  it('says how long to wait after a rate limit, in its own words', async () => {
    const state = await submitFrom(FILLED, replying(429, { error: 'Too many submissions.' }, { 'Retry-After': '61' }).post)

    expect(view(state)).toContain(
      'role="alert">Too many requests from this connection. You can try again in about 2 minutes.</p>',
    )

    const shortWait = await submitFrom(FILLED, replying(429, { error: 'Too many submissions.' }, { 'Retry-After': '30' }).post)
    expect(view(shortWait)).toContain('about 1 minute.</p>')
  })

  it('offers the inbox after a server error', async () => {
    const state = await submitFrom(FILLED, replying(500, { error: 'We could not record this right now.' }).post)

    expect(view(state)).toContain(
      `role="alert">We could not record this right now. You can also email us at <a href="${demoMailto('demo@expo.example')}">`,
    )
  })

  it('never shows the organiser forms\' wording for a 404', async () => {
    const html = view(await submitFrom(FILLED, replying(404, {}).post))

    expect(html).not.toContain('This link is no longer valid')
    expect(html).toContain(DEMO_FORM.unexpected)
  })

  // F-192c: the label stays in place but clear, a ring spins over it, and the button is read as "Sending…" alone.
  it('shows "Sending…" on a disabled button while pending', () => {
    const sending = button(view(reduce([{ type: 'submit-start' }], FILLED)))

    expect(sending).toMatch(/^<button type="submit"[^>]*\bdisabled=""[^>]*\bdata-work="busy"[^>]*>/)
    expect(sending).toMatch(new RegExp(`<span class="${styles.submitLabel}" aria-hidden="true"><span>Book a demo</span>`))
    expect(sending).toMatch(new RegExp(`<span class="${styles.spinner}" aria-hidden="true"></span>`))
    expect(spoken(sending)).toBe(DEMO_FORM.sending)
  })
})

describe('the send button and the fields, in the app’s style (F-192c AC 22)', () => {
  it('shows a tick once sent, the form still in place, locked, and read as "Request sent"', async () => {
    const state = await submitFrom(FILLED, replying(201, { success: true }).post)
    const html = view(state, { ticking: true })
    const sent = button(html)

    expect(html).toContain('<form')
    expect(html).not.toContain('role="alert"')
    expect(sent).toMatch(/\bdisabled=""/)
    expect(sent).toMatch(/\bdata-work="done"/)
    expect(sent).toMatch(new RegExp(`<span class="${styles.tick}"><svg`))
    expect(spoken(sent)).toBe(DEMO_FORM.success.title)
  })

  it('is "Book a demo" and its arrow when idle, with neither ring nor tick', () => {
    const idle = button(view(FILLED))

    expect(idle).not.toMatch(/data-work=/)
    expect(idle).not.toContain(styles.spinner)
    expect(idle).not.toContain(styles.tick)
    expect(spoken(idle)).toBe(DEMO_FORM.submit)
  })

  it('shakes each field the server names, and only those', async () => {
    const { post } = replying(400, {
      fields: [
        { field: 'email', message: DEMO_FIELD_MESSAGES.email },
        { field: 'acceptPrivacy', message: 'Tick the box.' },
      ],
    })
    const html = view(await submitFrom(FILLED, post))
    const shaking = [...html.matchAll(new RegExp(`<div class="[^"]*\\b${styles.shake}\\b[^"]*"[^>]*>\\s*<(?:input|select|textarea)\\b[^>]*\\bid="([^"]+)"`, 'g'))].map(([, id]) => id)

    expect(shaking).toEqual(['demo-email', 'demo-acceptPrivacy'])
    expect(view(FILLED)).not.toContain(styles.shake)
  })

  it('puts each label after its field, which an empty field shows inside it, and keeps an example field’s label up', () => {
    const html = view(FILLED)

    for (const name of ['fullName', 'email', 'company', 'showName', 'message']) {
      expect(html).toMatch(new RegExp(`id="demo-${name}"[^>]*placeholder=" "[^>]*/?>(?:</textarea>)?<label class="${styles.label}" for="demo-${name}">`))
    }
    expect(html).toMatch(new RegExp(`<div class="${styles.field}" data-float=""><input [^>]*id="demo-showWhen"[^>]*placeholder="${DEMO_FORM.showWhenPlaceholder}"`))
    expect(html).toMatch(new RegExp(`<div class="${styles.field}" data-float=""><select [^>]*id="demo-showSize"`))
  })
})

describe('without a Turnstile site key', () => {
  it('says the form is unavailable, offers the inbox, and collects nothing', () => {
    const html = view(initialDemoFormState, { siteKey: null })

    expect(html).toMatch(/role="status"><p>The form isn&#x27;t available right now\.<\/p>/)
    expect(html).toContain(`<a href="${demoMailto('demo@expo.example')}">demo@expo.example</a>`)
    expect(html).not.toMatch(/<(form|input|select|textarea)\b/)
  })

  it('shows one inbox in the panel: the server setting, else DEMO_EMAIL', () => {
    vi.stubEnv('TURNSTILE_SITE_KEY', '')
    vi.stubEnv('DEMO_REQUEST_EMAIL', 'demo@expo.example')
    const configured = renderToStaticMarkup(<DemoCta />)
    vi.stubEnv('DEMO_REQUEST_EMAIL', '')
    const fallback = renderToStaticMarkup(<DemoCta />)
    const addresses = (html: string) => new Set([...html.matchAll(/href="mailto:([^"?]+)/g)].map(([, address]) => address))

    expect(addresses(configured)).toEqual(new Set(['demo@expo.example']))
    expect(addresses(fallback)).toEqual(new Set([DEMO_EMAIL]))
  })

  it('is what the homepage shows when the key is unset', () => {
    vi.stubEnv('TURNSTILE_SITE_KEY', '')

    expect(renderToStaticMarkup(<DemoCta />)).not.toMatch(/<form\b/)
  })
})

describe('the copy', () => {
  const file = 'src/site/demo/content.ts'
  const source = readFileSync(join(process.cwd(), file), 'utf8')
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true)
  const strings: string[] = []
  const visit = (node: ts.Node) => {
    if (ts.isStringLiteralLike(node) || ts.isTemplateLiteralToken(node) || ts.isTemplateHead(node)) {
      strings.push(node.getText(sourceFile))
    }
    node.forEachChild(visit)
  }
  visit(sourceFile)

  it('never types in the product name', () => {
    expect(strings.length).toBeGreaterThan(10)
    expect(strings.filter((value) => /evemos|expono/i.test(value))).toEqual([])
  })

  /** F-021 Decision Q2. The rate limit's wait is the only time named, and it is the server's. */
  it('states no demo length and no reply time', () => {
    expect(strings.filter((value) => /working day|hours?\b|\d+[- ]minute|within/i.test(value))).toEqual([])
    expect(strings.filter((value) => /minute/i.test(value))).toEqual(["'minute'", "'minutes'"])
  })
})

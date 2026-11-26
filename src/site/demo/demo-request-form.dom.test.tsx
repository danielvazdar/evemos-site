// @vitest-environment happy-dom
/**
 * The booking form's send in a DOM (F-192c AC 22): a press that goes through
 * shows the ring, then the tick on the button for TICK_MS, and only then does
 * "Request sent" take the form's place and the focus; with reduced motion the
 * panel comes at once. A refusal puts the focus on the field it names, else on
 * its line. Turnstile hands over a token at once and the post is a
 * stub, so nothing leaves the test; timers are faked.
 */
import React, { act, useEffect, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { SubmitResult } from '@/forms/submit-form'

import { DEMO_FORM } from './content'
import { DemoRequestForm, TICK_MS } from './DemoRequestForm'

const reply = vi.hoisted(() => ({ resolve: null as ((result: SubmitResult) => void) | null }))

vi.mock('@/forms/submit-form', () => ({
  submitPublicForm: () =>
    new Promise<SubmitResult>((resolve) => {
      reply.resolve = resolve
    }),
}))

// The form hands a new `onToken` every render: the stub reads the newest and calls it once, as the real widget does.
vi.mock('@/forms/TurnstileWidget', () => ({
  TurnstileWidget: ({ onToken }: { onToken: (token: string | null) => void }) => {
    const latest = useRef(onToken)
    latest.current = onToken
    useEffect(() => latest.current('turnstile-token'), [])
    return null
  },
}))

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

let host: HTMLElement
let root: Root

const stubMotion = (reduce: boolean) =>
  vi.stubGlobal('matchMedia', (query: string) => ({ matches: reduce && query === '(prefers-reduced-motion: reduce)' }))

const mount = () =>
  act(() => {
    root.render(<DemoRequestForm siteKey="test-site-key" fallbackEmail="demo@expo.example" showSizes={[]} labelledBy="demo-title" />)
  })

const send = () =>
  act(() => {
    host.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  })

const answer = (result: SubmitResult) =>
  act(async () => {
    reply.resolve?.(result)
  })

const wait = (ms: number) =>
  act(() => {
    vi.advanceTimersByTime(ms)
  })

const work = () => host.querySelector('button[type="submit"]')?.getAttribute('data-work') ?? null
const panel = () => host.querySelector('[role="status"]')

beforeEach(() => {
  vi.useFakeTimers()
  reply.resolve = null
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.unmount())
  host.remove()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('sending (F-192c AC 22)', () => {
  it('spins while sending, ticks once sent, then shows "Request sent" and moves focus to it', async () => {
    stubMotion(false)
    mount()
    send()
    expect(work()).toBe('busy')

    await answer({ state: 'success', message: DEMO_FORM.success.body })
    expect(work()).toBe('done')
    expect(host.querySelector('form')).not.toBeNull()
    expect(panel()).toBeNull()

    wait(TICK_MS - 1)
    expect(panel()).toBeNull()
    wait(1)
    expect(host.querySelector('form')).toBeNull()
    expect(panel()?.textContent).toContain(DEMO_FORM.success.title)
    expect(document.activeElement).toBe(panel())
  })

  it('shows "Request sent" at once with reduced motion', async () => {
    stubMotion(true)
    mount()
    send()
    await answer({ state: 'success', message: DEMO_FORM.success.body })
    expect(panel()?.textContent).toContain(DEMO_FORM.success.title)
    expect(document.activeElement).toBe(panel())
  })

  it('goes back to "Book a demo" at once after a refusal, with no tick, and the focus on what went wrong', async () => {
    stubMotion(false)
    mount()
    send()
    await answer({ state: 'error', message: 'We could not record this right now.' })
    expect(work()).toBeNull()
    const alert = host.querySelector('[role="alert"]')
    expect(alert?.textContent).toContain('We could not record this right now.')
    // The button was locked while sending, so the focus it had would be lost: the line takes it.
    expect(document.activeElement).toBe(alert)
    wait(TICK_MS)
    expect(panel()).toBeNull()
  })

  it('puts the focus on the first field a refusal names, not on its line', async () => {
    stubMotion(false)
    mount()
    send()
    await answer({ state: 'invalid', message: 'Some details are missing or invalid.', fieldErrors: { company: 'Enter your company.' } })
    expect(document.activeElement?.id).toBe('demo-company')
  })
})

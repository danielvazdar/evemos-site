'use client'

import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import React, { useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react'

import { submitPublicForm, type SubmitResult } from '@/forms/submit-form'
import { TurnstileWidget } from '@/forms/TurnstileWidget'
import { demoMailto, links } from '@/site/links'
import primitives from '@/site/ui/primitives.module.css'
import { SiteIcon } from '@/site/ui/primitives'

import { DEMO_FORM } from './content'
import {
  createDemoSubmit,
  DEMO_ENDPOINT,
  DEMO_FIELDS,
  demoFormReducer,
  fieldErrorsOf,
  initialDemoFormState,
  type DemoField,
  type DemoFormAction,
  type DemoFormState,
  type DemoTextField,
  type PostDemoRequest,
} from './demo-form-state'
import styles from './DemoRequestForm.module.css'

/**
 * The "Book a demo" form on Evemos's homepage (F-021c2), posting to
 * `/api/book-demo`.
 *
 * ★ NOT A `PublicForm`. That one is styled by the organiser pages' CSS and
 * driven by an organiser's field specs, and the site may not import from
 * `(frontend)` anyway. What it got right is copied, and the reasons sit with
 * the copies: the off-screen honeypot hidden from assistive tech and the tab
 * order, Turnstile reset after every failure, one post per press, and marking
 * both required and "(optional)" (`demo-form-state.ts`, `Marker` below).
 *
 * The field errors are the server's own sentences, shown under their field;
 * the browser's `required` checks catch the empty ones before a request.
 *
 * ★ IN THE APP'S STYLE (F-192c): a white dialog on the violet close, labels
 * that float inside their fields, a field the server names shakes once, and
 * the send button works as the app's: a ring while sending, then a tick that
 * holds for `TICK_MS` before "Request sent" takes the form's place. Screen
 * readers hear "Sending…" and then the panel, as before.
 */

export interface DemoShowSizeOption {
  value: string
  label: string
}

export interface DemoRequestFormProps {
  /** Null when Turnstile is not configured: the server would refuse every post, so the form is not shown. */
  siteKey: string | null
  /** Where to write instead, offered when the form cannot help. The same inbox the panel shows. */
  fallbackEmail: string
  /** The size buckets, from the collection (passed in: the collection is server code). */
  showSizes: readonly DemoShowSizeOption[]
  /** The id of the heading that names the form. */
  labelledBy: string
}

/** How long the tick holds before "Request sent" replaces the form: the app's button doing work (work.tsx). */
export const TICK_MS = 800

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

const post: PostDemoRequest = (payload) =>
  submitPublicForm(DEMO_ENDPOINT, payload, { successMessage: DEMO_FORM.success.body })

/** False in the server's markup, true once React runs in the browser. No effect, no extra render. */
const noSubscribe = () => () => {}
const useHydrated = (): boolean =>
  useSyncExternalStore(
    noSubscribe,
    () => true,
    () => false,
  )

export function DemoRequestForm({ siteKey, fallbackEmail, showSizes, labelledBy }: DemoRequestFormProps) {
  const [state, dispatch] = useReducer(demoFormReducer, initialDemoFormState)
  const [submit] = useState(() => createDemoSubmit(post))
  const hydrated = useHydrated()
  const successRef = useRef<HTMLDivElement | null>(null)
  const failureRef = useRef<HTMLParagraphElement | null>(null)
  // The tick has held its time: "Request sent" may take the form's place.
  const [ticked, setTicked] = useState(false)
  const sent = state.result?.state === 'success'

  // Once per reply, not per keystroke: editing a field rewrites `result`
  // (its error is cleared), and that must not pull focus back.
  useEffect(() => {
    const result = state.result
    if (!result) return
    if (result.state === 'success') {
      // With reduced motion the panel comes at once; the tick is a moving part.
      if (window.matchMedia(REDUCED_MOTION).matches) {
        setTicked(true)
        return
      }
      const timer = window.setTimeout(() => setTicked(true), TICK_MS)
      return () => window.clearTimeout(timer)
    }
    if (result.state === 'invalid') {
      const first = DEMO_FIELDS.find((field) => field in result.fieldErrors)
      if (first) {
        document.getElementById(fieldId(first))?.focus()
        return
      }
    }
    // Nothing to fix in a field: the line saying what went wrong takes the focus the locked button lost.
    failureRef.current?.focus()
    // `replies` alone is the trigger; `result` is read from the render that bumped it.
  }, [state.replies])

  // The form, and the button that had focus, are gone: put focus on what replaced them.
  useEffect(() => {
    if (sent && ticked) successRef.current?.focus()
  }, [sent, ticked])

  return (
    <div className={styles.dialog}>
      <DemoRequestFormView
        state={state}
        dispatch={dispatch}
        onSubmit={() => void submit(state, dispatch)}
        siteKey={siteKey}
        fallbackEmail={fallbackEmail}
        showSizes={showSizes}
        labelledBy={labelledBy}
        hydrated={hydrated}
        ticking={sent && !ticked}
        successRef={successRef}
        failureRef={failureRef}
      />
    </div>
  )
}

export interface DemoRequestFormViewProps extends DemoRequestFormProps {
  state: DemoFormState
  dispatch: (action: DemoFormAction) => void
  onSubmit: () => void
  /** The button stays disabled in the server's markup: without JavaScript there is nothing to post with. */
  hydrated: boolean
  /** Sent, and the button's tick still holding: the form stays, with the tick on its button, before the panel. */
  ticking?: boolean
  successRef?: React.Ref<HTMLDivElement>
  /** The failed reply's line, which takes the focus when no field is named (the send button was locked). */
  failureRef?: React.Ref<HTMLParagraphElement>
}

/** The markup for one state. Exported for the tests, which render each state statically. */
export function DemoRequestFormView({
  state,
  dispatch,
  onSubmit,
  siteKey,
  fallbackEmail,
  showSizes,
  labelledBy,
  hydrated,
  ticking = false,
  successRef,
  failureRef,
}: DemoRequestFormViewProps) {
  if (state.result?.state === 'success' && !ticking) {
    return (
      <div className={styles.done} role="status" ref={successRef} tabIndex={-1}>
        <h3>{DEMO_FORM.success.title}</h3>
        <p>{DEMO_FORM.success.body}</p>
      </div>
    )
  }

  if (!siteKey) {
    return (
      <div className={styles.unavailable} role="status">
        <p>{DEMO_FORM.unavailable}</p>
        <EmailLine lead={DEMO_FORM.unavailableEmail} email={fallbackEmail} />
      </div>
    )
  }

  const errors = fieldErrorsOf(state)
  const text = (field: DemoTextField) => ({
    value: state.values[field],
    error: errors[field],
    onChange: (value: string) => dispatch({ type: 'edit', field, value }),
  })

  return (
    <form
      className={styles.form}
      action={DEMO_ENDPOINT}
      method="post"
      aria-labelledby={labelledBy}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <noscript>
        <p className={styles.notice}>
          {DEMO_FORM.noscript}
          {' '}
          <EmailLine lead={DEMO_FORM.noscriptEmail} email={fallbackEmail} inline />
        </p>
      </noscript>

      <TextRow field="fullName" label={DEMO_FORM.fields.fullName} required autoComplete="name" {...text('fullName')} />
      <TextRow
        field="email"
        label={DEMO_FORM.fields.email}
        required
        type="email"
        autoComplete="email"
        hint={DEMO_FORM.emailHint}
        {...text('email')}
      />
      <TextRow
        field="company"
        label={DEMO_FORM.fields.company}
        required
        autoComplete="organization"
        {...text('company')}
      />
      <TextRow field="showName" label={DEMO_FORM.fields.showName} {...text('showName')} />
      <SelectRow label={DEMO_FORM.fields.showSize} options={showSizes} {...text('showSize')} />
      <TextRow
        field="showWhen"
        label={DEMO_FORM.fields.showWhen}
        placeholder={DEMO_FORM.showWhenPlaceholder}
        {...text('showWhen')}
      />
      <TextRow field="message" label={DEMO_FORM.fields.message} multiline {...text('message')} />
      <PrivacyRow
        checked={state.values.acceptPrivacy}
        error={errors.acceptPrivacy}
        onChange={(value) => dispatch({ type: 'edit-privacy', value })}
      />

      {/*
        Honeypot. Off-screen rather than `display: none`, because some bots
        skip what is not rendered and this one is meant to be filled in. Hidden
        from assistive tech and out of the tab order, so nobody using a
        keyboard or a screen reader trips it and has their request discarded.
      */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="demo-website_url">{DEMO_FORM.honeypot}</label>
        <input
          id="demo-website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.honeypot}
          onChange={(event) => dispatch({ type: 'honeypot', value: event.target.value })}
        />
      </div>

      {/* Below the last field, so the challenge is solved by the time the person reaches the button. */}
      <div data-captcha="turnstile">
        <TurnstileWidget
          siteKey={siteKey}
          theme="light"
          fitWidth
          resetSignal={state.resetSignal}
          onToken={(token) => dispatch({ type: 'token', token })}
        />
      </div>

      {state.waitingForCheck ? (
        <p className={styles.alert} role="alert">
          {DEMO_FORM.waitForCheck}
        </p>
      ) : null}
      {state.result && state.result.state !== 'success' ? (
        <FailureLine result={state.result} fallbackEmail={fallbackEmail} lineRef={failureRef} />
      ) : null}

      <SendButton hydrated={hydrated} pending={state.pending} ticking={ticking} />
    </form>
  )
}

/**
 * The submit as the app's button doing work: "Book a demo" and its arrow,
 * then, kept in place but clear, a ring while sending and a tick once sent.
 * What a screen reader hears follows it: "Sending…", then "Request sent".
 * Locked while sending and through the tick: one press, one request.
 */
function SendButton({ hydrated, pending, ticking }: { hydrated: boolean; pending: boolean; ticking: boolean }) {
  const work = pending ? 'busy' : ticking ? 'done' : undefined
  return (
    <button
      type="submit"
      className={`${primitives.button} ${primitives.primary} ${styles.submit}`}
      disabled={!hydrated || work !== undefined}
      data-work={work}
    >
      <span className={styles.submitLabel} aria-hidden={work ? true : undefined}>
        <span>{DEMO_FORM.submit}</span>
        <SiteIcon icon={ArrowRight} size={20} />
      </span>
      {work === 'busy' ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span className="visually-hidden">{DEMO_FORM.sending}</span>
        </>
      ) : null}
      {work === 'done' ? (
        <>
          <span className={styles.tick}>
            <SiteIcon icon={Check} size={20} />
          </span>
          <span className="visually-hidden">{DEMO_FORM.success.title}</span>
        </>
      ) : null}
    </button>
  )
}

/** The class names given, the ones that apply. */
const classes = (...names: Array<string | false | undefined>): string => names.filter(Boolean).join(' ')

/** `demo-` in front of every id: the homepage has ids of its own, and they must not collide. */
const fieldId = (field: DemoField): string => `demo-${field}`
const errorId = (field: DemoField): string => `demo-${field}-error`

/**
 * ★ Marks BOTH states, as `PublicForm` does. With only the required fields
 * marked, the browser's one-field-at-a-time prompts make the whole form read
 * as compulsory; "(optional)" said out loud removes the guessing.
 */
function Marker({ required }: { required: boolean }) {
  return required ? (
    <span aria-hidden="true"> *</span>
  ) : (
    <span className={styles.optional}> {DEMO_FORM.optional}</span>
  )
}

function FieldError({ field, error }: { field: DemoField; error?: string }) {
  return error ? (
    <p className={styles.fieldError} id={errorId(field)}>
      {error}
    </p>
  ) : null
}

const describedBy = (...ids: Array<string | false | undefined>): string | undefined =>
  ids.filter(Boolean).join(' ') || undefined

interface RowProps {
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
}

interface TextRowProps extends RowProps {
  field: DemoTextField
  required?: boolean
  type?: 'text' | 'email'
  autoComplete?: string
  placeholder?: string
  hint?: string
  multiline?: boolean
}

function TextRow({
  field,
  label,
  value,
  error,
  onChange,
  required = false,
  type = 'text',
  autoComplete,
  placeholder,
  hint,
  multiline = false,
}: TextRowProps) {
  const hintId = hint ? `${fieldId(field)}-hint` : undefined
  const shared = {
    id: fieldId(field),
    name: field,
    className: styles.input,
    required,
    // A blank placeholder tells the CSS when the field is empty (`:placeholder-shown`), so its label can sit inside it.
    placeholder: placeholder ?? ' ',
    value,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy(error && errorId(field), hintId),
  }
  return (
    <div className={styles.row}>
      {/* A field with an example in it keeps its label up, over the example. */}
      <div className={classes(styles.field, multiline && styles.multiline, error && styles.shake)} data-float={placeholder ? '' : undefined}>
        {multiline ? (
          // The server's limits, so a long message is stopped while typing, not refused after.
          <textarea {...shared} rows={4} maxLength={2_000} onChange={(event) => onChange(event.target.value)} />
        ) : (
          <input
            {...shared}
            type={type}
            maxLength={200}
            autoComplete={autoComplete}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
        <label className={styles.label} htmlFor={fieldId(field)}>
          {label}
          <Marker required={required} />
        </label>
      </div>
      {hint ? (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      ) : null}
      <FieldError field={field} error={error} />
    </div>
  )
}

interface SelectRowProps extends RowProps {
  options: readonly DemoShowSizeOption[]
}

function SelectRow({ label, options, value, error, onChange }: SelectRowProps) {
  return (
    <div className={styles.row}>
      {/* Its own chevron: the native arrow sits flush to the edge and ignores padding. Its label stays up: a select always shows a choice. */}
      <div className={classes(styles.field, error && styles.shake)} data-float="">
        <select
          id={fieldId('showSize')}
          name="showSize"
          className={styles.input}
          required
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(error && errorId('showSize'))}
          onChange={(event) => onChange(event.target.value)}
        >
          {/* The empty first option keeps "not answered" reachable; without it the select answers for them. */}
          <option value="">{DEMO_FORM.showSizeChoose}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className={styles.label} htmlFor={fieldId('showSize')}>
          {label}
          <Marker required />
        </label>
        <span className={styles.chevron}>
          <SiteIcon icon={ChevronDown} size={20} />
        </span>
      </div>
      <FieldError field="showSize" error={error} />
    </div>
  )
}

interface PrivacyRowProps {
  checked: boolean
  error?: string
  onChange: (value: boolean) => void
}

/** The notice opens in a new tab, so reading it does not lose what was typed here. */
function PrivacyRow({ checked, error, onChange }: PrivacyRowProps) {
  return (
    <div className={classes(styles.checkboxRow, error && styles.shake)}>
      <input
        id={fieldId('acceptPrivacy')}
        name="acceptPrivacy"
        type="checkbox"
        className={styles.checkbox}
        required
        checked={checked}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(error && errorId('acceptPrivacy'))}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={fieldId('acceptPrivacy')}>
        {DEMO_FORM.privacy.before}
        <a href={links.privacy} target="_blank" rel="noopener noreferrer">
          {DEMO_FORM.privacy.link}
          <span className="visually-hidden"> {DEMO_FORM.privacy.newTab}</span>
        </a>
        {DEMO_FORM.privacy.after}
        <Marker required />
      </label>
      <FieldError field="acceptPrivacy" error={error} />
    </div>
  )
}

function EmailLine({ lead, email, inline = false }: { lead: string; email: string; inline?: boolean }) {
  const content = (
    <>
      {lead} <a href={demoMailto(email)}>{email}</a>.
    </>
  )
  return inline ? content : <p className={styles.email}>{content}</p>
}

interface FailureLineProps {
  result: SubmitResult
  fallbackEmail: string
  lineRef?: React.Ref<HTMLParagraphElement>
}

/** What a failed reply says, in one `role="alert"` line, which can take the focus. Success never reaches here. */
function FailureLine({ result, fallbackEmail, lineRef }: FailureLineProps) {
  const line = (() => {
    switch (result.state) {
      case 'rate-limited':
        return result.retryAfterSeconds
          ? DEMO_FORM.rateLimited(Math.ceil(result.retryAfterSeconds / 60))
          : result.message
      case 'gone':
      case 'stale':
        return DEMO_FORM.unexpected
      default:
        return result.message
    }
  })()
  const offerEmail = result.state === 'error' || result.state === 'gone' || result.state === 'stale'
  return (
    <p className={styles.alert} tabIndex={-1} ref={lineRef} role="alert">
      {line}
      {offerEmail ? (
        <>
          {' '}
          <EmailLine lead={DEMO_FORM.alsoEmail} email={fallbackEmail} inline />
        </>
      ) : null}
    </p>
  )
}

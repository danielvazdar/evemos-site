import type { SubmitResult } from '@/forms/submit-form'

import { DEMO_FORM } from './content'

/**
 * The demo form's state and its one submit path, as plain functions, so the
 * rules that matter can be tested without a browser (the repo has no DOM test
 * environment; `DemoRequestForm.test.tsx` renders markup statically).
 *
 * ★ What is copied from `PublicForm` (organiser forms) on purpose, because it
 * was hard-won there: burn the Turnstile token after EVERY failure (a token is
 * single-use, so a retry with the old one is refused for a reason nothing on
 * screen explains), and refuse the impatient second press so one person's
 * click is one request.
 */

/** Where the form posts (`src/app/api/book-demo/route.ts`). */
export const DEMO_ENDPOINT = '/api/book-demo'

/** The text fields, in the order the form shows them. Focus goes to the first one with an error. */
export const DEMO_TEXT_FIELDS = ['fullName', 'email', 'company', 'showName', 'showSize', 'showWhen', 'message'] as const

export type DemoTextField = (typeof DEMO_TEXT_FIELDS)[number]

/** Every field the person fills in, by the name the endpoint reads. */
export const DEMO_FIELDS = [...DEMO_TEXT_FIELDS, 'acceptPrivacy'] as const

export type DemoField = (typeof DEMO_FIELDS)[number]

export type DemoValues = Readonly<Record<DemoTextField, string> & { acceptPrivacy: boolean }>

export interface DemoFormState {
  values: DemoValues
  /** The off-screen trap field. Only a bot fills it. */
  honeypot: string
  /** Turnstile's token, or null while there is none (not solved yet, expired, or burned). */
  token: string | null
  /** Incremented to make `TurnstileWidget` issue a fresh challenge. */
  resetSignal: number
  pending: boolean
  /** The last reply, until the person sends again. */
  result: SubmitResult | null
  /** Replies so far. Effects that run once per reply key on this, not on `result`, which edits rewrite. */
  replies: number
  /** Submit was pressed before Turnstile had a token: nothing was posted. */
  waitingForCheck: boolean
}

export const initialDemoFormState: DemoFormState = {
  values: {
    fullName: '',
    email: '',
    company: '',
    showName: '',
    showSize: '',
    showWhen: '',
    message: '',
    acceptPrivacy: false,
  },
  honeypot: '',
  token: null,
  resetSignal: 0,
  pending: false,
  result: null,
  replies: 0,
  waitingForCheck: false,
}

export type DemoFormAction =
  | { type: 'edit'; field: DemoTextField; value: string }
  | { type: 'edit-privacy'; value: boolean }
  | { type: 'honeypot'; value: string }
  | { type: 'token'; token: string | null }
  | { type: 'waiting-for-check' }
  | { type: 'submit-start' }
  | { type: 'submit-done'; result: SubmitResult }

/** The field errors of the last reply, by field name. Empty unless it was a 400 with fields. */
export const fieldErrorsOf = (state: DemoFormState): Readonly<Record<string, string>> =>
  state.result?.state === 'invalid' ? state.result.fieldErrors : {}

/**
 * Editing a field clears that field's error and only that one: the message
 * was about the old value, and the others still stand until the next reply.
 */
const withoutFieldError = (result: SubmitResult | null, field: DemoField): SubmitResult | null => {
  if (result?.state !== 'invalid' || !(field in result.fieldErrors)) return result
  const { [field]: _cleared, ...rest } = result.fieldErrors
  return { ...result, fieldErrors: rest }
}

export function demoFormReducer(state: DemoFormState, action: DemoFormAction): DemoFormState {
  switch (action.type) {
    case 'edit':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
        result: withoutFieldError(state.result, action.field),
      }
    case 'edit-privacy':
      return {
        ...state,
        values: { ...state.values, acceptPrivacy: action.value },
        result: withoutFieldError(state.result, 'acceptPrivacy'),
      }
    case 'honeypot':
      return { ...state, honeypot: action.value }
    case 'token':
      // A token arriving answers the "wait for the security check" line.
      return { ...state, token: action.token, waitingForCheck: action.token ? false : state.waitingForCheck }
    case 'waiting-for-check':
      return { ...state, waitingForCheck: true }
    case 'submit-start':
      return { ...state, pending: true, result: null, waitingForCheck: false }
    case 'submit-done':
      return {
        ...state,
        pending: false,
        result: action.result,
        replies: state.replies + 1,
        // ★ Every failure burns the token that went with it. The widget's
        // reset also reports null, so the old token is never sent twice.
        resetSignal: action.result.state === 'success' ? state.resetSignal : state.resetSignal + 1,
        token: action.result.state === 'success' ? state.token : null,
      }
  }
}

/**
 * The body `/api/book-demo` accepts, and nothing else: its schema is strict,
 * so an extra key would be a 400. Empty optional text is sent as `''`, which
 * the server reads as "not given".
 */
export const toDemoPayload = (state: DemoFormState) => ({
  ...state.values,
  captchaToken: state.token ?? undefined,
  website_url: state.honeypot,
})

export type DemoPayload = ReturnType<typeof toDemoPayload>

export type PostDemoRequest = (payload: DemoPayload) => Promise<SubmitResult>

export type DemoSubmit = (state: DemoFormState, dispatch: (action: DemoFormAction) => void) => Promise<void>

/** Shown if `post` throws. `submitPublicForm` never does; this keeps the button from spinning forever if that changes. */
const UNEXPECTED: SubmitResult = { state: 'error', message: DEMO_FORM.unexpected }

/**
 * One submit function per form. The in-flight flag lives here, not in React
 * state: a double click lands two presses before React re-renders, and both
 * would read `pending: false`. Here the second press sees the first one's flag
 * and posts nothing.
 */
export function createDemoSubmit(post: PostDemoRequest): DemoSubmit {
  let inFlight = false
  return async (state, dispatch) => {
    if (inFlight) return
    // No token, no post: the server would refuse it, and the refusal would
    // read as "rejected" for a check that simply had not finished yet.
    if (!state.token) {
      dispatch({ type: 'waiting-for-check' })
      return
    }
    inFlight = true
    dispatch({ type: 'submit-start' })
    try {
      dispatch({ type: 'submit-done', result: await post(toDemoPayload(state)) })
    } catch (error: unknown) {
      console.error('[demo-form] submit threw', error)
      dispatch({ type: 'submit-done', result: UNEXPECTED })
    } finally {
      inFlight = false
    }
  }
}

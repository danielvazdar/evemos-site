import { PRODUCT_NAME } from '@/lib/product'
import { PRIMARY_ACTION } from '@/site/home/content'

/**
 * Every line of the "Book a demo" form (F-021c2), in one place, so it can be
 * read and run through `copycheck` without the markup around it.
 *
 * ★ NO DEMO LENGTH AND NO REPLY TIME (F-021 Decision Q2). The only time this
 * file mentions is the rate limit's wait, which is the server's, not a promise.
 *
 * The field errors are not here: the server writes them
 * (`DEMO_FIELD_MESSAGES` in `src/lib/demo-request-intake.ts`) and the form
 * shows what it was sent, so the two cannot drift apart. The size buckets are
 * not here either: they come from the collection, through `DemoCta`.
 */

export const DEMO_FORM = {
  fields: {
    fullName: 'Your name',
    email: 'Email',
    company: 'Company',
    showName: 'Your show',
    showSize: 'Exhibitors per show',
    showWhen: 'When is the next one?',
    message: 'Anything we should know?',
  },
  /**
   * Under the email field, before anyone types. Small organisers run their show
   * from Gmail, and the old refusal turned them away (#219), so say it's fine first.
   */
  emailHint: 'Gmail and other personal addresses are fine.',
  /** The empty first option, which keeps "not answered" reachable. */
  showSizeChoose: 'Choose one',
  showWhenPlaceholder: 'May 2027',
  optional: '(optional)',
  /** The privacy checkbox, around its link to `/privacy`. */
  privacy: {
    before: 'I have read ',
    link: `how ${PRODUCT_NAME} uses these details`,
    after: '.',
    /** Read by screen readers after the link text: the notice opens in a new tab so the form keeps what was typed. */
    newTab: '(opens in a new tab)',
  },
  honeypot: 'Leave this field empty',
  /** The page's one primary label (E-13), on the submit button too. */
  submit: PRIMARY_ACTION,
  sending: 'Sending…',
  waitForCheck: `Please wait a moment for the security check, then press ${PRIMARY_ACTION} again.`,
  /**
   * After a 429 that said how long. Replaces the server's line, which ends in
   * "try again shortly" and would read oddly next to a number.
   */
  rateLimited: (minutes: number): string =>
    `Too many requests from this connection. You can try again in about ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`,
  /** After a server error, when an address is configured. */
  alsoEmail: 'You can also email us at',
  /**
   * For replies this endpoint never sends (404, 409) but `submitPublicForm`
   * can read: its wording for those is about invitation links and changed
   * documents, which this form has neither of.
   */
  unexpected: 'We could not send your request. Please try again in a moment.',
  success: {
    title: 'Request sent',
    /** True in every case: a suppressed address gets no acknowledgement, so nothing here promises one. */
    body: "Thanks. We'll email you to find a time.",
  },
  unavailable: "The form isn't available right now.",
  unavailableEmail: 'Email us at',
  noscript: 'This form needs JavaScript.',
  noscriptEmail: 'You can also email us at',
} as const

/**
 * The product's own privacy notice (F-022), rendered at `/privacy` by
 * `LegalDocument`. Kyuro is the controller for the website, demo requests,
 * email sent to us and staff sign-in accounts; for attendee and exhibitor
 * portal data on organisers' event sites it is the organiser's processor
 * (section 4).
 *
 * ★ EVERY CLAIM IS SOURCED. Each factual line carries a `// source:` comment
 * naming the file or decision that makes it true today, so a reviewer can
 * check it and an edit elsewhere shows which sentence it breaks. A sentence
 * without a source is either law (cited by article) or a promise about our
 * own conduct.
 *
 * ★ CHANGING THIS NOTICE: edit the text, add a `history` entry at the top with
 * the new date, and set `PLATFORM_PRIVACY_VERSION` (`src/lib/product.ts`) to
 * that date. The version below IS that constant, never a typed date, so the
 * page and every demo request's stamp move together; `privacy.test.tsx` fails
 * if the newest history entry and the constant differ. Change the processor
 * table here, in `docs/GDPR.md` and the version together.
 *
 * The business's details are never typed here: `{ kind: 'contact' }` and the
 * emails come from `CONTROLLER` (`controller.ts`). The product name only ever
 * comes from `PRODUCT_NAME`. `[[TODO: …]]` marks an answer still missing; a
 * production server will not start while one remains (`release-guard.ts`).
 */
import { RETENTION_MONTHS } from '@/lib/contact-intake'
import { PLATFORM_PRIVACY_VERSION, PRODUCT_NAME } from '@/lib/product'

import { CONTROLLER } from './controller'
import type { LegalDocumentContent, LegalLink } from './LegalDocument'
import type { NoticeCovers } from './release-guard'

/**
 * What this notice names beyond the fixed processors. The boot guard refuses a
 * production server configured for Umami or R2 uploads while these are false,
 * so the "no analytics" line below cannot quietly become untrue. Turn one on
 * only in the same change that adds the service to the notice.
 */
export const NOTICE_COVERS: NoticeCovers = Object.freeze({ analytics: false, r2Uploads: false })

const P = PRODUCT_NAME
const US = CONTROLLER.tradingName

/** E-43. The name comes from PRODUCT_NAME like every other mention, so the test's stand-in name shows here too. */
const RENAME_SUMMARY = `The product is now called ${P}, and our email addresses are on evemos.events. Nothing else changed.`

/**
 * Lifetimes the notice states. Typed rather than imported: the boot guard loads
 * this file, and importing the portal and login modules would pull their
 * dependencies into server start. `privacy.test.tsx` holds each one equal to
 * the constant that sets it (PORTAL_ACCESS_DAYS_AFTER_SHOW, PORTAL_SESSION_SECONDS,
 * STAFF_TOKEN_EXPIRATION_SECONDS, LOGIN_STEP_SECONDS, SSO_STATE_SECONDS).
 */
export const STATED_LIFETIMES = Object.freeze({
  portalAccessDays: 30,
  portalSessionDays: 7,
  staffSignInHours: 2,
  loginStepMinutes: 10,
  ssoMinutes: 10,
})
const L = STATED_LIFETIMES

const privacyMail: LegalLink = { href: `mailto:${CONTROLLER.privacyEmail}`, label: CONTROLLER.privacyEmail }

/** The first column of the processors table: `privacy.test.tsx` holds it to exactly these. */
export const PROCESSOR_NAMES = [
  'Hostinger (HOSTINGER operations, UAB)',
  'Cloudflare, Inc.',
  'Resend, Inc.',
  // Daniel 2026-10-21: Email Routing forwards to Kyuro's Google Workspace inbox (hello@kyuro.tech).
  'Google Cloud EMEA Limited (Google Workspace)',
] as const

export const PRIVACY_DOCUMENT: LegalDocumentContent = {
  path: '/privacy',
  title: 'Privacy notice',
  intro: `How ${US} handles personal data on the ${P} website and in the platform: what we collect, why, how long we keep it, and how to use your rights.`,
  version: PLATFORM_PRIVACY_VERSION,
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      blocks: [
        // source: DECISIONS.md "Ownership": a product built and owned by Kyuro, no separate entity.
        { kind: 'p', text: `${P} is a product built and run by ${US}. In this notice, "we" and "us" mean ${US}, the business below.` },
        { kind: 'contact' },
        {
          kind: 'p',
          // source: none appointed (spec F-022 Assumptions); GDPR Art. 37 lists when one is required.
          parts: [
            'We have not appointed a data protection officer, as the law does not require one for the processing we do (GDPR Art. 37). Write to ',
            privacyMail,
            ' about anything in this notice.',
          ],
        },
      ],
    },
    {
      id: 'what-this-covers',
      title: 'What this notice covers',
      blocks: [
        {
          kind: 'p',
          text: `This notice covers the ${P} website, requests for a demo, email you send us, and the staff accounts people use to sign in to ${P}.`,
        },
        // source: src/app/(frontend) serves organisers' event pages and the exhibitor portal
        // (src/access/portal.ts) from this platform.
        { kind: 'p', text: `Organisers also run event pages and an exhibitor portal on ${P}. For the data you give there, see section 4.` },
      ],
    },
    {
      id: 'what-we-collect',
      title: 'What we collect, why, and for how long',
      blocks: [
        { kind: 'p', text: 'For each kind of personal data we hold, the table shows the law that lets us hold it and when we delete it.' },
        {
          kind: 'table',
          caption: 'Personal data we hold',
          head: ['What', 'Data', 'Why we may (lawful basis)', 'How long'],
          rows: [
            [
              // source: src/collections/platform/DemoRequests.ts fields (fullName … message,
              // privacyAcknowledgedAt, privacyNotice), lawfulBasis 'pre-contract', and
              // retentionReviewAt = request + RETENTION_MONTHS (src/lib/demo-request-intake.ts).
              'Demo requests',
              'Your name, work email, company, show name, show size, when your show is, your message if you write one, the date you sent the request and the version of this notice you saw.',
              'To take the steps you asked for before a possible contract: arranging and giving the demo (GDPR Art. 6(1)(b)).',
              `Reviewed ${RETENTION_MONTHS} months after the request, then deleted unless we are still talking or a contract followed.`,
            ],
            [
              // source: src/lib/email/demo-request.ts sends the acknowledgement to the person and the
              // notification to DEMO_REQUEST_EMAIL, both through Resend (src/payload.config.ts adapter).
              // Held: likelySpam (src/lib/demo-spam.ts, a pitch phrase or a free-mail address) sends
              // neither ('held', F-082, E-62); "Not spam" sends nothing late.
              'Emails about your demo request',
              'Your name, your email address and the details of your request. Our email service (Resend) sends you an acknowledgement and tells our own inbox about the request. If a request reads like a sales pitch or comes from a free email address such as Gmail, we hold it for review and send neither.',
              'The same as your request (Art. 6(1)(b)).',
              'As for the demo request.',
            ],
            [
              // source: F-022 Assumptions: 24 months, matching the review used for demo requests.
              'Email you send us',
              'Your email address, your name and what you write.',
              'Our legitimate interest in answering you (Art. 6(1)(f)).',
              `${RETENTION_MONTHS} months after the conversation ends.`,
            ],
            [
              // source: src/collections/crm/Suppression.ts, append-only (C3); the demo intake
              // checks it before replying (suppressedAtIntake, src/lib/email/demo-request.ts).
              'Do-not-contact list',
              'Your email address and the reason. If you ask us never to contact you again, we keep the address on this list so that we keep to it.',
              'Our legitimate interest, and our duty to respect your objection (Art. 6(1)(f) and Art. 21).',
              'For as long as the list exists. Deleting your address from it would let it be contacted again.',
            ],
            [
              // source: src/collections/Users.ts (name, email, Payload auth: hashed password, sessions;
              // mentionEmails, set by the login itself from the account menu's switch, MentionEmailsSwitch.tsx, F-172d;
              // the same switch covers the email for a task given to you, F-172f).
              // src/collections/LoginLinks.ts: the provider and its account ID (`subject`, Google's `sub`) only,
              // linked at the first Google sign-in (src/lib/sso/links.ts, F-191c/d; linking from the account page is F-191e);
              // Google sees the sign-in itself.
              // Staff only: portal members are not Payload users (src/collections/portal/PortalMembers.ts).
              'Staff sign-in accounts',
              `Name, email address, a hashed password, your sign-in session, whether you want an email when you are mentioned in a team note or given a task in one, and, if you sign in with Google, the account ID of your Google sign-in. When you sign in with Google, Google tells us your email address and that account ID, and knows you signed in to ${P}.`,
              'Needed to provide the account (Art. 6(1)(b)).',
              'While the account exists.',
            ],
            [
              // source: src/collections/platform/Organisers.ts `aboutYou` (four optional selects on the organiser's
              // row, so they go with it; field access read, create and update: isPlatformAdmin, so the organiser's own
              // team never reads them); src/app/api/backoffice/organisers/route.ts (isPlatformAdminUser, 404 for
              // anyone else; reads and writes as the user); F-213 (our staff note them from the demo call).
              'Notes from our calls with you',
              `If you tell us on a demo call or while we set up your account: your role, the kinds of events you run, how many a year, and how you heard about ${P}. Only ${P} staff see them.`,
              `Our legitimate interest in knowing who uses ${P} and how they find us, so we can improve it (Art. 6(1)(f)).`,
              "Until your organisation's account is deleted. Ask us and we delete them sooner.",
            ],
            [
              // source: src/lib/rate-limit.ts (clientIp, per-IP limits), Turnstile on the demo form
              // (src/app/api/book-demo/route.ts, D-19), Cloudflare in front of the server (E-26).
              'Security',
              'Your IP address and request details, such as the page and the time, seen by our network provider and our server. We use them for rate limits and to stop automated form spam.',
              'Our legitimate interest in keeping the service safe (Art. 6(1)(f)).',
              // 14 days, proposed 2026-10-21 (Daniel to confirm); set the nginx and Docker log rotation on the server to match.
              '14 days',
            ],
            [
              // source: terms-content.ts "Fees, invoices and payment"; Croatian accounting and tax law
              // sets the period, so no number is stated here.
              'Contracts and invoices, for organisers who subscribe',
              "The organiser's contact and billing details, the order form and the invoices.",
              'To perform the contract (Art. 6(1)(b)) and to meet our duties under Croatian accounting and tax law (Art. 6(1)(c)).',
              'As long as Croatian accounting and tax law requires.',
            ],
          ],
        },
        // source: no field in DemoRequests.ts asks for special-category data (Art. 9).
        {
          kind: 'p',
          text: 'We do not ask for special categories of data, such as health or religious beliefs. Please do not put any in the message field.',
        },
      ],
    },
    {
      id: 'event-pages',
      title: `Event pages run on ${P}`,
      blocks: [
        {
          kind: 'p',
          // source: F-001: every event form links the organiser's own privacy policy (src/fields/legal-docs.ts).
          text: "When you register for an event, send an enquiry or apply for accreditation on an organiser's event page, the organiser decides what is collected and why. The organiser is the controller of that data, and its own privacy policy is linked on every form.",
        },
        {
          kind: 'p',
          // source: terms-content.ts "Data processing terms" (the Art. 28 annex organisers agree to).
          parts: [
            "We are the organiser's processor. We store and process that data only on the organiser's instructions and do not use it for our own purposes. The ",
            { href: '/terms#data-processing', label: 'data processing terms' },
            ' in our terms for organisers set this out (GDPR Art. 28).',
          ],
        },
        {
          kind: 'p',
          // source: src/collections/Notes.ts (read: isStaff, the organiser's own team; a note hangs on a contact,
          // an organisation, a registration or a lead); src/lib/notes/staff-only.test.ts (no event page, portal,
          // public route, export or email code reads notes, and no record joins them); src/lib/retention/erase.ts
          // step 6 (the notes on the person and on their leads are deleted with them, F-172a).
          text: "The organiser's team can also keep internal notes on people, companies, registrations and sales prospects. These notes never show on event pages, in the exhibitor portal or in exports, and when a person's data is erased, the notes on them and on their sales prospects are deleted too.",
        },
        {
          kind: 'p',
          text: 'To see, correct or delete that data, write to the organiser first. If you write to us, we pass your request to the organiser.',
        },
        {
          kind: 'p',
          // source: src/access/portal.ts PORTAL_CATEGORIES (exhibitor, co_exhibitor, sponsor),
          // portalRegistrationOpen (confirmed only); src/lib/portal/sign-in.ts (one-time emailed link, E-31);
          // src/collections/portal/PortalMembers.ts (staff give access).
          text: "Organisers can also give people at their confirmed exhibitors, co-exhibitors and sponsors access to an exhibitor portal on the event's site. You sign in with a one-time link sent to your email.",
        },
        {
          kind: 'p',
          // source: src/collections/portal/PortalMembers.ts (contact → name and email, registration,
          // invitedBy, lastSignInAt, token hashes), PortalSessions.ts (member, tokenHash, expiresAt);
          // src/access/portal.ts hashToken (SHA-256, only the hash is stored).
          text: "For the portal we hold your name and email from the organiser's contact record, the exhibitor registration you belong to, who gave you access, when you last signed in, and your sign-in session. Sign-in links and sessions are stored only in scrambled (hashed) form.",
        },
        {
          kind: 'p',
          // source: src/access/portal.ts PORTAL_ACCESS_DAYS_AFTER_SHOW (30) and PORTAL_SESSION_SECONDS (7 days,
          // never extended). "At the latest": revoking the member or the registration no longer being
          // confirmed ends it sooner (portalRegistrationOpen, PortalMembers.ts revokedAt).
          text: `Portal access ends at the latest ${L.portalAccessDays} days after the show's last day. A sign-in lasts at most ${L.portalSessionDays} days. The organiser is the controller of this data too, and we are its processor, as above.`,
        },
      ],
    },
    {
      id: 'who-receives',
      title: 'Who receives your data',
      blocks: [
        {
          kind: 'p',
          text: 'We do not sell or rent personal data. These companies process it on our behalf, to run the website and the platform:',
        },
        {
          kind: 'table',
          caption: 'Our processors',
          head: ['Provider', 'What they do for us', 'Data', 'Where', 'Safeguard for transfers'],
          rows: [
            [
              // source: E-26 (demo phase on Kyuro's KVM1 at Hostinger), E-02 and E-03 (own Hostinger VPS, EU).
              PROCESSOR_NAMES[0],
              'Runs the server that hosts the website, the platform and its database.',
              'Everything in sections 3 and 4.',
              'EU',
              'None needed: the data stays in the EU.',
            ],
            [
              // source: E-26 (behind Cloudflare), src/lib/csp.ts TURNSTILE, E-29 (Email Routing for
              // demo@ and privacy@). Cloudflare is certified under the Data Privacy Framework.
              // Access: E-45, narrowed by E-48 to the pages only Kyuro's own staff use (CLOUDFLARE_ACCESS_PATHS,
              // src/lib/cloudflare-access-paths.test.ts); its sign-in sees the email the person signs in with.
              PROCESSOR_NAMES[1],
              'DNS, network and attack protection, the Turnstile check on our forms, forwarding the email you send to our addresses, and Cloudflare Access, the sign-in check in front of the pages only our own staff use.',
              'IP address and request details. For forwarded email, the message and its addresses. For our own staff, the email address they sign in with.',
              'United States company, global network',
              'EU-US Data Privacy Framework and Standard Contractual Clauses',
            ],
            [
              // source: src/payload.config.ts (Resend email adapter), src/lib/email/* (the mention and task
              // email: mention-email.ts, F-172c, F-172f). Where: the Resend team's sending region is eu-west-1, Ireland
              // (audit 2026-11-08 G-07); the company is still in the US, so the safeguard and the transfers
              // section stay.
              PROCESSOR_NAMES[2],
              'Sends the emails the website and the platform send, including the email you get when you are mentioned in a team note or given a task in one.',
              'Name, email address and what the email says.',
              'United States company, sending from its EU region (Ireland)',
              'Standard Contractual Clauses',
            ],
            [
              // source: E-29 + Daniel 2026-10-21 (Google Workspace). Google is certified under the Data Privacy Framework.
              PROCESSOR_NAMES[3],
              'Holds the inbox where we read the email you send us, after Cloudflare forwards it.',
              'Your email address, your name and your message.',
              'Ireland-based company, global data centres',
              'EU-US Data Privacy Framework and Standard Contractual Clauses',
            ],
          ],
        },
        // source: E-29 + F-022 Decision (Cloudflare Email Routing forwards demo@ and privacy@).
        {
          kind: 'p',
          text: `Mail to our addresses on the ${P} domain is received by Cloudflare Email Routing and forwarded to ${US}'s own inbox.`,
        },
        {
          kind: 'p',
          // source: src/lib/vies/check.ts (one GET per number: country code and number only; back come
          // valid, and the trader's name and address when the member state discloses them), called by
          // src/app/api/apply/price and src/app/api/apply/submit (F-105d). Not a processor: the Commission
          // runs VIES as a public authority, not on our instructions (spec F-142 Assumptions), so
          // PROCESSOR_NAMES stays at four.
          text: "When a business applies for a stand with a VAT number, we check the number with VIES, the European Commission's VAT number check. VIES receives only the number. It tells us whether the number is valid and, where it can, the business's registered name and address. The Commission runs VIES itself, as a public authority, so it is not one of our processors and is not in the table above.",
        },
        {
          kind: 'p',
          text: 'We may have to disclose data to a court, the tax authority or the police when Croatian or EU law requires it.',
        },
        // source: NOTICE_COVERS.analytics = false, enforced at boot by release-guard.ts; the site
        // layout loads no analytics (src/app/(site)/layout.tsx).
        { kind: 'p', text: 'Not used: we run no analytics on this website, no advertising pixels and no third-party trackers.' },
      ],
    },
    {
      id: 'transfers',
      title: 'Transfers outside the EU',
      blocks: [
        { kind: 'p', text: 'Cloudflare and Resend are companies in the United States, so data they process may leave the EU.' },
        {
          kind: 'p',
          text: 'Cloudflare is certified under the EU-US Data Privacy Framework, which the European Commission has found gives adequate protection. Its data processing terms also include the Standard Contractual Clauses.',
        },
        { kind: 'p', text: "Resend's data processing terms include the Standard Contractual Clauses approved by the European Commission." },
        { kind: 'p', parts: ['Write to ', privacyMail, ' for a copy of the safeguards.'] },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and similar storage',
      blocks: [
        {
          kind: 'table',
          caption: 'Cookies and browser storage',
          // Not listed: Payload's own short-lived working storage in the staff app (localStorage
          // _payloadClipboard for copy and paste, the tab session sync key; sessionStorage for a pending
          // toast and the forgot-password form). Each holds only what the screen in use needs, stays in the
          // browser, and is strictly necessary for the feature being used, so it needs no row or consent.
          head: ['What', 'Where', 'Why', 'Your choice'],
          rows: [
            // source: src/app/(site)/layout.tsx sets no cookie and loads no script that does.
            [`Cookies on the ${P} website`, `The ${P} website`, 'We set none.', 'Nothing to choose.'],
            ['Cloudflare security cookies', 'Any page', 'Cloudflare may set them to tell people from bots and to block attacks.', 'Strictly necessary, so no consent is needed.'],
            // source: src/access/portal.ts PORTAL_COOKIE ('portal_session'), portalCookieOptions
            // (maxAge PORTAL_SESSION_SECONDS); set by src/app/api/portal/sign-in/route.ts.
            [
              'Exhibitor portal sign-in (portal_session)',
              "The exhibitor portal on an event's site, after you sign in",
              `Keeps you signed in for at most ${L.portalSessionDays} days.`,
              'Strictly necessary.',
            ],
            // source: src/lib/auth-cookies.ts STAFF_TOKEN_EXPIRATION_SECONDS ('payload-token', 2 hours);
            // src/lib/two-step/login-flow.ts loginStepSetCookie, LOGIN_STEP_SECONDS ('payload-login-step', 10 minutes);
            // src/lib/sso/flow.ts SSO_STATE_SECONDS ('__Host-payload-sso-state', 10 minutes) and
            // src/lib/sso/handoff.ts SSO_HANDOFF_SECONDS ('__Host-payload-sso-handoff', 2 minutes, within them), F-191d.
            [
              'Staff sign-in cookies',
              'The staff app, after you sign in',
              `Keep you signed in, ${L.staffSignInHours} hours at a time, and carry your sign-in through the login code step (${L.loginStepMinutes} minutes) and through a Google sign-in (${L.ssoMinutes} minutes).`,
              'Strictly necessary.',
            ],
            // source: src/admin/staff-page.ts ORGANISER_SELECTOR_COOKIE ('payload-tenant', 1 year);
            // src/lib/app/notifications-derive.ts SEEN_COOKIE ('evemos_app_seen', set by
            // src/app/api/app-notifications/route.ts); @payloadcms/next layouts/Root switchLanguageServerAction
            // ('payload-lng', 1 year, set when someone picks a language in Account settings);
            // src/lib/app/hall-view.ts HALL_VIEW_COOKIE ('evemos_app_hall_view', 1 year, set by the Floor
            // plan's 2D / 3D switch); src/app/(app)/_components/ui/list-columns.ts COLUMNS_COOKIE
            // ('evemos_app_columns', 1 year, written by ColumnsMenu only when someone changes a list's columns;
            // column names only); src/app/(app)/_components/wash-motion.ts WASH_MOTION_COOKIE ('evemos_app_wash_motion',
            // 1 year, written by WashMotionSwitch only when someone flips Background motion; the self-check's result
            // and the Save-Data header are never stored); src/app/(app)/_components/sidebar-state.ts SIDEBAR_COOKIE
            // ('evemos_app_sidebar', 1 year, written by the frame only when someone opens or collapses the sidebar;
            // `open` or `folded` only); src/lib/app/row-height.ts ROW_HEIGHT_COOKIE ('evemos_row_height', 1 year,
            // written in the browser by RowHeightSwitch); src/app/(app)/_components/theme.ts THEME_COOKIE
            // ('evemos_app_theme', 1 year, written by ThemeChoice only when someone picks Light or Dark; `light` or
            // `dark` only), F-159b. Payload's own 'payload-theme' is never written: payload.config.ts sets
            // admin.theme 'light', and Payload writes it only when theme is 'all'. Add it here if 'all' is restored.
            [
              'Staff app settings',
              'The staff app',
              'Remember which organiser you are working on, whether the floor plan opens in 2D or 3D, which notifications you have seen, which columns your lists show, the row height you chose for lists, whether you keep the sidebar open or collapsed, the language if you pick one in your account settings, background motion if you change it in the account menu, and light or dark if you pick one there.',
              'Needed for features you use, so no consent is needed.',
            ],
            // source: NOTICE_COVERS.analytics = false (release-guard.ts); the event-page banner and its
            // browser storage entry render only when Umami is configured (SiteAnalytics.tsx).
            ['Analytics', 'Nowhere', 'None run today.', 'Nothing to choose.'],
          ],
        },
        { kind: 'p', text: 'If we add analytics, we will update this notice first and ask for your consent where the law requires it.' },
      ],
    },
    {
      id: 'rights',
      title: 'Your rights',
      blocks: [
        {
          kind: 'list',
          items: [
            'Access: you can ask for a copy of the data we hold about you (Art. 15).',
            'Correction: you can ask us to correct data that is wrong (Art. 16).',
            'Erasure: you can ask us to delete your data (Art. 17).',
            'Restriction: you can ask us to stop using your data while a question about it is settled (Art. 18).',
            'Portability: you can ask for the data you gave us in a common, machine-readable format (Art. 20).',
            'Objection: you can object to processing based on our legitimate interest. An objection to direct marketing always stands (Art. 21).',
            'Withdrawing consent: where we rely on your consent, you can withdraw it at any time (Art. 7(3)). Today we rely on consent for nothing.',
            'Automated decisions: you have the right not to be subject to a decision made only by automated means (Art. 22). We make none.',
          ],
        },
        {
          kind: 'p',
          text: 'If you ask us to delete your data and never to contact you again, we keep only your email address, on the do-not-contact list (section 3).',
        },
      ],
    },
    {
      id: 'using-your-rights',
      title: 'How to use your rights',
      blocks: [
        {
          kind: 'p',
          parts: [
            'Email ',
            privacyMail,
            '. Say which right you want to use and the email address we hold for you. We may ask you to confirm that the address is yours.',
          ],
        },
        {
          kind: 'p',
          text: 'We reply within 1 month. For a complex request we may take up to 2 more months, and if so we tell you why within the first month (Art. 12(3)).',
        },
        { kind: 'p', text: 'Using your rights is free, unless a request is clearly unfounded or excessive (Art. 12(5)).' },
      ],
    },
    {
      id: 'complaints',
      title: 'Complaints',
      blocks: [
        { kind: 'p', text: 'You can complain to the Croatian data protection authority:' },
        { kind: 'authority' },
        { kind: 'p', text: 'You can also complain in the EU country where you live or work, or where you think the problem happened (Art. 77).' },
      ],
    },
    {
      id: 'security',
      title: 'How we protect data',
      blocks: [
        {
          kind: 'list',
          items: [
            // source: src/lib/server-env.ts checkSiteUrl (production refuses a non-https site address).
            'Every page is served over HTTPS.',
            // source: Payload auth on src/collections/Users.ts stores a salted hash, never the password.
            'Passwords are stored only as hashes, never as the password itself.',
            // source: src/collections/Users.ts maxLoginAttempts 5, lockTime 600000 ms.
            'After 5 failed sign-in attempts, the account is locked for 10 minutes.',
            // source: src/collections/platform/DemoRequests.ts access isPlatformAdmin.
            `Only ${US} staff can read demo requests.`,
            // source: D-19, src/access/api-routes.test.ts (rate limit, captcha and honeypot on public forms).
            'Our public forms check for automated submissions and limit how often they can be sent.',
            // source: E-03, E-26 (Hostinger, EU).
            'Our server and database are in the EU.',
          ],
        },
      ],
    },
    {
      id: 'breaches',
      title: 'If something goes wrong',
      blocks: [
        {
          kind: 'p',
          text: 'If a personal data breach happens, we report it to AZOP within 72 hours of finding out, where the law requires it (Art. 33). If it is likely to put your rights at high risk, we also tell you directly (Art. 34).',
        },
      ],
    },
    {
      id: 'children',
      title: 'Children',
      blocks: [
        {
          kind: 'p',
          text: 'This website and our demo form are not aimed at anyone under 16. If we learn that a child sent us their data, we delete it.',
        },
      ],
    },
  ],
  changes: {
    id: 'changes',
    title: 'Changes to this notice',
    blocks: [
      {
        kind: 'p',
        // source: src/lib/demo-request-intake.ts DEMO_PRIVACY_NOTICE (privacy:<version> on every row).
        text: 'When we change this notice, we post the new version on this page with its date and list the change below. Every demo request records the version its sender saw.',
      },
    ],
  },
  history: [
    { version: PLATFORM_PRIVACY_VERSION, summary: 'Added the setting that remembers light or dark in the staff app.' },
    {
      version: '2026-11-19',
      summary:
        'Added the notes we may keep from our calls with you: your role, the kinds of events you run, how many a year and how you heard about us.',
    },
    {
      version: '2026-11-15',
      summary:
        'Added signing in to the staff app with Google: your staff account now records the ID of the Google account you sign in with, and the staff sign-in cookies carry a Google sign-in too.',
    },
    {
      version: '2026-11-14',
      summary:
        "Added the setting in the staff app for an email when you are mentioned in a team note or given a task in one, and named that email in Resend's row. Staff app settings now also remember the row height you chose for lists.",
    },
    {
      version: '2026-11-13',
      summary:
        "Added the setting that remembers whether you keep the sidebar in the staff app open or collapsed, and explained that an organiser's team can keep internal notes on people, companies, registrations and sales prospects.",
    },
    {
      version: '2026-11-12',
      summary:
        'Added the settings that remember which columns your lists show, whether the floor plan opens in 2D or 3D, and background motion in the staff app.',
    },
    {
      version: '2026-11-08',
      summary:
        "Added VIES, the European Commission's check of the VAT numbers in stand applications. Cloudflare's row now names Cloudflare Access and the email address our own staff sign in with, and Resend's row says it sends our email from its EU region (Ireland).",
    },
    { version: '2026-11-05', summary: 'Made clear that choosing a language in the staff app is optional.' },
    {
      version: '2026-11-02',
      summary:
        'Added the exhibitor portal and every cookie the platform sets, and explained that demo requests that look like spam are held for review.',
    },
    { version: '2026-10-21', summary: RENAME_SUMMARY },
    { version: '2026-10-19', summary: 'First version.' },
  ],
}

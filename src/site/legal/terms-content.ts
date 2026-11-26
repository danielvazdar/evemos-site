// The product's own terms (F-022), rendered at `/terms` by `LegalDocument`.
//
// Amendment log. Newest LAST. Every change to the text gets a dated line here
// and a `history` entry, and TERMS_VERSION is set to the same date;
// `terms.test.tsx` reads this comment and fails until all three agree.
//   2026-10-19  First version: website use, demo requests, organiser
//               subscriptions and the data processing terms (Art. 28).
//   2026-10-21  New product name, contact addresses on evemos.events (E-43).
//               Nothing else changed.
//   2026-11-08  Data processing terms: VAT numbers in stand applications are
//               checked with VIES, which is not a sub-processor (F-142a, L-05).
//               New DPA acceptances record this date; earlier ones stand.
//
// The business's details are never typed here: `{ kind: 'contact' }` and the
// emails come from CONTROLLER (`controller.ts`), the product name only from
// PRODUCT_NAME. Not legal advice: a Croatian lawyer should read these terms
// before the first organiser signs (spec F-022 Risks).
//
// No prices anywhere: pricing is not set (E-14), so fees are "as in the order
// form". No uptime figure (voice book "Claims"). Accounts are set up by us,
// as there is no self sign-up yet (E-13).
import { PRODUCT_NAME } from '@/lib/product'

import { CONTROLLER } from './controller'
import type { LegalDocumentContent, LegalLink } from './LegalDocument'

/** The date of these terms. Equals the newest line of the amendment log above and `history[0]`. */
export const TERMS_VERSION = '2026-11-08'

const P = PRODUCT_NAME
const US = CONTROLLER.tradingName

/** E-43. The name comes from PRODUCT_NAME like every other mention, so the test's stand-in name shows here too. */
const RENAME_SUMMARY = `The product is now called ${P}, and our email addresses are on evemos.events. Nothing else changed.`

const generalMail: LegalLink = { href: `mailto:${CONTROLLER.generalEmail}`, label: CONTROLLER.generalEmail }
const privacyMail: LegalLink = { href: `mailto:${CONTROLLER.privacyEmail}`, label: CONTROLLER.privacyEmail }
const privacyNotice: LegalLink = { href: '/privacy', label: 'privacy notice' }
const dataProcessing: LegalLink = { href: '/terms#data-processing', label: 'Data processing terms' }

export const TERMS_DOCUMENT: LegalDocumentContent = {
  path: '/terms',
  title: 'Terms',
  intro: `The rules for using the ${P} website, asking us for a demo, and subscribing to ${P} as an organiser.`,
  version: TERMS_VERSION,
  sections: [
    {
      id: 'who-we-are',
      title: 'Who we are',
      blocks: [
        { kind: 'p', text: `These terms are between you and ${US}, the business below. ${P} is a product built and run by ${US}.` },
        { kind: 'contact' },
        { kind: 'p', text: 'These are the business details Croatian e-commerce law requires a business website to show.' },
      ],
    },
    {
      id: 'what-these-cover',
      title: 'What these terms cover',
      blocks: [
        { kind: 'p', text: `These terms cover your use of the ${P} website and your requests for a demo.` },
        {
          kind: 'p',
          text: "They also cover an organiser's subscription to the platform, together with the order form the organiser signs. The sections from \"Subscriptions and order forms\" to \"Your data when the subscription ends\", and the data processing terms, apply to organisers only.",
        },
        {
          kind: 'p',
          text: "People who register for an organiser's event, or send it an enquiry, are covered by that organiser's own terms, linked on its forms.",
        },
        { kind: 'p', parts: ['How we handle personal data is set out in our ', privacyNotice, '.'] },
      ],
    },
    {
      id: 'words-we-use',
      title: 'Words we use',
      blocks: [
        {
          kind: 'list',
          items: [
            `"We", "us" and "${US}": the business in section 1.`,
            '"You": whoever uses the website. In the sections for organisers, "you" is the organiser.',
            `"Organiser": a business or organisation that subscribes to ${P} to run its events.`,
            `"Platform": ${P} as a service: the admin, the event pages and the emails it sends.`,
            '"Order form": the document that names the organiser, what it subscribes to, the period and the fees, accepted in writing by both sides.',
            '"Users": the people the organiser lets sign in to its account.',
            "\"Organiser data\": everything the organiser and its users put into the platform, and everything people give on the organiser's event pages, personal data included.",
          ],
        },
      ],
    },
    {
      id: 'using-the-website',
      title: 'Using the website',
      blocks: [
        { kind: 'p', text: 'Use the website lawfully. In particular:' },
        {
          kind: 'list',
          items: [
            'Do not try to get into parts of the website or the platform you have no access to.',
            'Do not test their security without our written permission.',
            'Do not overload them or send automated form submissions.',
            'Do not copy the content of the website in bulk.',
          ],
        },
      ],
    },
    {
      id: 'what-the-website-tells-you',
      title: 'What the website tells you',
      blocks: [
        { kind: 'p', text: `The website describes ${P} as it is today, and the product may change.` },
        { kind: 'p', text: 'Nothing on the website is an offer to make a contract. Prices, if the website shows any, bind us only once they are agreed in writing.' },
      ],
    },
    {
      id: 'demo-requests',
      title: 'Demo requests',
      blocks: [
        { kind: 'p', text: 'A demo is free and puts no obligation on either side. We may decline a request.' },
        { kind: 'p', parts: ['We use the details you send us as our ', privacyNotice, ' describes.'] },
      ],
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions and order forms',
      blocks: [
        {
          kind: 'p',
          text: 'An organiser uses the platform under a subscription. Each subscription starts with an order form that names what the organiser subscribes to, the period and the fees. The order form and these terms together are the contract.',
        },
        {
          kind: 'p',
          text: "If the order form and these terms disagree, the order form applies to that subscription. Terms printed on an organiser's purchase order do not apply.",
        },
        { kind: 'p', text: 'The platform is for businesses and organisations. By signing an order form, you confirm that you act for one.' },
      ],
    },
    {
      id: 'accounts',
      title: 'Accounts and users',
      blocks: [
        {
          kind: 'p',
          text: "We set up the organiser's account. The organiser decides who its users are and is responsible for what they do in the account.",
        },
        {
          kind: 'p',
          text: 'Each user signs in with their own account. Keep sign-in details secret, and tell us at once if you think someone else has used them.',
        },
      ],
    },
    {
      id: 'fees',
      title: 'Fees, invoices and payment',
      blocks: [
        { kind: 'p', text: 'The fees are those in the order form.' },
        {
          kind: 'p',
          text: `${US} invoices in euro under Croatian law, including the fiscalisation rules that apply to it. The order form and the invoice show whether VAT is added, and at what rate.`,
        },
        {
          kind: 'p',
          text: 'Unless the order form says otherwise, we invoice each subscription period in advance, and an invoice is due by the date printed on it. Pay by bank transfer to the account on the invoice.',
        },
        {
          kind: 'p',
          text: 'If an invoice is paid late, we may charge statutory default interest under Croatian law, and we may suspend the account as "Suspension" describes.',
        },
        { kind: 'p', text: 'Fees already paid are not refunded, except where these terms say so.' },
      ],
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      blocks: [
        { kind: 'p', text: 'The organiser and its users must use the platform lawfully. In particular:' },
        {
          kind: 'list',
          items: [
            'Do not put unlawful content into the platform, or content you have no right to use.',
            'Do not use the platform to email people you have no lawful basis to contact.',
            "Do not try to reach data that is not yours, including another organiser's.",
            "Do not test the platform's security without our written permission, overload it or upload malicious code.",
            'Do not resell the platform or give anyone outside your organisation access to it, except your users.',
            'Do not copy the platform to build a competing product.',
          ],
        },
        {
          kind: 'p',
          text: 'You are responsible for the content you and your users put into the platform, and for having a lawful basis for the personal data you collect with it.',
        },
      ],
    },
    {
      id: 'organiser-data',
      title: 'Organiser data and our role',
      blocks: [
        {
          kind: 'p',
          text: 'Organiser data belongs to the organiser. We use it only to provide the platform to the organiser, never for our own purposes.',
        },
        {
          kind: 'p',
          parts: [
            'For the personal data in it, the organiser is the controller and we are its processor. The ',
            dataProcessing,
            ' below are the agreement GDPR Art. 28 requires, and they are part of every subscription.',
          ],
        },
      ],
    },
    {
      id: 'service-and-support',
      title: 'Service and support',
      blocks: [
        { kind: 'p', text: 'We host, run and update the platform, and fix the faults we find or you report.' },
        {
          kind: 'p',
          text: 'We do not promise a level of availability. We plan maintenance for quiet times where we can, and tell organisers in advance about planned work that will interrupt the service.',
        },
        { kind: 'p', text: 'Support is by email, at the address in the order form, on Croatian working days.' },
        { kind: 'p', text: 'We may change the platform over time, but not in a way that removes what your order form names during the period it covers.' },
      ],
    },
    {
      id: 'suspension',
      title: 'Suspension',
      blocks: [
        { kind: 'p', text: 'We may suspend an account, in whole or in part, when:' },
        {
          kind: 'list',
          items: [
            'an invoice is more than 14 days overdue and still unpaid 7 days after we have warned you in writing;',
            'the account is used against "Acceptable use"; or',
            'suspension is needed to stop a security threat or to obey the law.',
          ],
        },
        {
          kind: 'p',
          text: 'We suspend only as much as the problem needs, tell you why, and restore access once it is solved. Your data is kept while an account is suspended.',
        },
      ],
    },
    {
      id: 'term-and-ending',
      title: 'Term and ending',
      blocks: [
        { kind: 'p', text: 'A subscription runs for the period in the order form. It renews only if both sides agree in writing.' },
        {
          kind: 'p',
          text: 'Either side may end a subscription early by written notice if the other seriously breaks these terms and does not put it right within 30 days of being told.',
        },
        {
          kind: 'p',
          text: 'If a subscription ends early because we broke these terms, we refund the fees paid for the rest of the period. Otherwise fees already paid are not refunded.',
        },
      ],
    },
    {
      id: 'data-at-the-end',
      title: 'Your data when the subscription ends',
      blocks: [
        {
          kind: 'p',
          text: 'For 30 days after a subscription ends, you can ask us for a copy of the organiser data in a common, machine-readable format, such as CSV.',
        },
        {
          kind: 'p',
          text: 'After those 30 days we delete the organiser data within a further 30 days, unless the law requires us to keep part of it. We keep that part only as long as the law requires.',
        },
        { kind: 'p', parts: ['Our own records of the subscription, such as the order form and the invoices, are kept as our ', privacyNotice, ' says.'] },
      ],
    },
    {
      id: 'our-content',
      title: 'Our content and name',
      blocks: [
        // source: docs/IP_PROTECTION_PLAN.md: the trade mark is not registered yet, so no "®".
        { kind: 'p', text: `The website's text and design, the ${P} name and its logo belong to ${US}.` },
        {
          kind: 'p',
          text: 'You may link to the website. Copying its content in bulk, or using the name or logo in a way that suggests we endorse you, needs our written permission.',
        },
      ],
    },
    {
      id: 'links',
      title: 'Links to other websites',
      blocks: [
        { kind: 'p', text: 'The website may link to other websites. We do not control them and are not responsible for what they contain.' },
      ],
    },
    {
      id: 'liability',
      title: 'Liability',
      blocks: [
        { kind: 'p', text: 'We provide the website as it is. We do not promise that it is always available or free of errors.' },
        { kind: 'p', text: 'We provide the platform to organisers with reasonable skill and care.' },
        {
          kind: 'p',
          text: 'As far as the law allows, we are not liable for indirect or consequential loss, or for loss of profit or revenue.',
        },
        {
          kind: 'p',
          text: 'Our total liability to an organiser, for all claims arising in any 12 months, is limited to the fees the organiser paid us in the 12 months before the first of those claims arose.',
        },
        {
          kind: 'p',
          text: 'Nothing in these terms limits liability for damage caused on purpose or through gross negligence, or for anything else the law does not let us limit.',
        },
      ],
    },
    {
      id: 'law-and-courts',
      title: 'Law and courts',
      blocks: [
        { kind: 'p', text: 'Croatian law applies to these terms and to any dispute about them.' },
        { kind: 'p', text: `Disputes go to the competent court for ${US}'s registered seat (section 1).` },
        {
          kind: 'p',
          text: 'If you are a consumer, the mandatory protections of the country where you live still apply, and you may also go to the courts there where the law allows.',
        },
      ],
    },
    {
      id: 'language',
      title: 'Language',
      blocks: [{ kind: 'p', text: 'These terms exist in English only.' }],
    },
    {
      id: 'contact',
      title: 'Contact',
      blocks: [{ kind: 'p', parts: ['Write to ', generalMail, '. For questions about your personal data, write to ', privacyMail, '.'] }],
    },
    {
      id: 'data-processing',
      title: 'Data processing terms',
      blocks: [
        {
          kind: 'p',
          text: 'These terms apply when we process personal data for an organiser as its processor. They are the contract GDPR Art. 28(3) requires, and they are part of every subscription.',
        },
        {
          kind: 'table',
          caption: 'What we process for the organiser',
          head: ['Item', 'Details'],
          rows: [
            [
              // source: src/collections (Registrations, Accreditations, Badges, Exhibitors, InvoiceFiles, Contacts).
              'Subject and purpose',
              `Providing ${P} to the organiser: registrations, enquiries, accreditation, badges, check-in, exhibitors, invoices and the organiser's contacts.`,
            ],
            ['Duration', 'The subscription, then the period in "Your data when the subscription ends".'],
            [
              'Kinds of personal data',
              'Names, contact details, job titles and organisations, registration and accreditation answers, badge and check-in records, invoice details, and anything else the organiser chooses to collect.',
            ],
            ['People concerned', "The organiser's exhibitors, visitors, sponsors, press, speakers, crew, staff and other contacts."],
            [
              'What we do with it',
              "Store it, show it to the organiser's users, send the emails the organiser sets up, and produce badges and documents.",
            ],
          ],
        },
        { kind: 'p', text: 'For that data, we:' },
        {
          kind: 'list',
          items: [
            "process it only on the organiser's documented instructions: these terms, the order form and the organiser's use of the platform. If we think an instruction breaks data protection law, we tell the organiser;",
            `make sure everyone at ${US} who can see it is bound to keep it confidential;`,
            'protect it with appropriate technical and organisational measures (Art. 32), such as those our privacy notice describes;',
            'help the organiser, as far as we reasonably can, to answer people who use their rights and to meet its duties under Art. 32 to 36;',
            'tell the organiser without undue delay after we become aware of a personal data breach affecting it;',
            'return and then delete it at the end of the subscription, as "Your data when the subscription ends" describes; and',
            'give the organiser the information it needs to show these terms are kept, and allow audits by the organiser or an auditor it appoints, on reasonable notice.',
          ],
        },
        {
          kind: 'p',
          parts: [
            'The organiser gives us general permission to use sub-processors. Today they are the providers that run the platform, listed in our ',
            privacyNotice,
            ' under "Who receives your data".',
          ],
        },
        {
          kind: 'p',
          text: 'We tell organisers before we add or replace a sub-processor, and an organiser may object. If we cannot meet the objection, the organiser may end the subscription and get back the fees paid for the rest of the period. Every sub-processor is bound by the same data protection duties as we are, and we remain responsible for it.',
        },
        {
          kind: 'p',
          // source: src/lib/vies/check.ts (the number only), called by src/app/api/apply/price and
          // src/app/api/apply/submit (F-105d); privacy-content.ts "Who receives your data" says the same.
          // Not a sub-processor: the Commission runs VIES as a public authority (spec F-142 Assumptions).
          text: "VAT numbers in stand applications are checked with VIES, the European Commission's VAT number check. VIES receives only the number. The Commission runs it as a public authority, so it is not one of our sub-processors.",
        },
        { kind: 'p', text: 'Data leaves the EU only with a safeguard GDPR accepts, as our privacy notice describes.' },
      ],
    },
  ],
  changes: {
    id: 'changes',
    title: 'Changes to these terms',
    blocks: [
      { kind: 'p', text: 'When we change these terms, we post the new version on this page with its date and list the change below.' },
      {
        kind: 'p',
        text: 'For an organiser, a change applies from its next subscription period, unless the organiser agrees to it sooner or the law requires it sooner.',
      },
    ],
  },
  history: [
    {
      version: TERMS_VERSION,
      summary:
        "The data processing terms now say that VAT numbers in stand applications are checked with VIES, the European Commission's VAT number check, which is not a sub-processor.",
    },
    { version: '2026-10-21', summary: RENAME_SUMMARY },
    { version: '2026-10-19', summary: 'First version.' },
  ],
}

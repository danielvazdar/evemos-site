import { PRODUCT_NAME as P } from '@/lib/product'

import type { GuideContent } from '../GuideArticle'
import { comparison, NOT_LISTED, type ToolFacts } from './build'

/**
 * The tools Evemos is compared with (/compare/<slug>, E-61), in menu order.
 * Every fact here is in `docs/website/COMPETITOR_FACTS.md` with its source,
 * read on `CHECKED_ON`; a fact that is not there does not go here.
 */

const CVENT: ToolFacts = {
  name: 'Cvent',
  slug: 'cvent',
  whatItIs:
    'Cvent is a large US event management suite for registration, event marketing, venues, hotels and event apps, with trade show tools for exhibitor management, check-in and lead capture.',
  shortAnswer: `Pick ${P} if you run events of any kind and want one operating system for all of it: booth sales, the exhibitor portal, the floor plan, registration, badges, check-in and invoicing, with published yearly prices, no fee per ticket and no commission. Cvent suits large companies that also want venue sourcing and hotel blocks from one big vendor.`,
  cells: {
    'One system for the whole show': 'A suite of products; floor plan diagrams are a separate product',
    'Registration forms with approval': 'Yes',
    'QR badges and check-in': 'Yes',
    'Floor plan and booth allocation': 'Booth assignment in exhibitor management; floor plan diagrams are a separate product',
    'Exhibitors book and pay for a booth online': NOT_LISTED,
    'Exhibitor portal': 'Yes, with exhibitor tasks and booth staff registration',
    'Exhibitor service orders': NOT_LISTED,
    'Invoices and e-invoicing': NOT_LISTED,
    'Lead scanning for exhibitors': 'Yes, LeadCapture and iCapture',
    'Sales pipeline for exhibitors and sponsors': NOT_LISTED,
    'Attendee app and matchmaking': 'Yes, event app, attendee hub and appointments',
    'How the price is set': 'Not published; by quote',
  },
  strengths: [
    'Size and reach: Cvent reports more than 34,000 customers, and it covers venues, hotels and event marketing as well as the event itself.',
    'Exhibitors can scan leads at the stand with its lead capture apps, LeadCapture and iCapture.',
  ],
  differences: [
    `${P} is one operating system for the whole show: booth sales, exhibitors, the floor plan, registration, badges, check-in and invoicing share one list of companies and people. On Cvent's site, floor plan diagrams are a separate product from exhibitor management.`,
    'Published yearly prices by plan, with no fee per ticket and no commission. Cvent does not publish prices for its event platform, so you get a quote.',
  ],
  price: [
    {
      kind: 'p',
      text: 'Cvent does not publish prices for its event management platform. The price comes from a quote by its sales team.',
    },
  ],
  faq: [
    {
      question: 'How much does Cvent cost?',
      answer:
        'Cvent does not publish prices for its event platform, so you get a quote. Ask for the full cost over the whole contract: any fee per registration, the contract length and how renewal works. Then you can set it beside a tool with a yearly price.',
    },
    {
      question: 'Does Cvent have a floor plan for trade shows?',
      answer: `Cvent's exhibitor management assigns booths, and floor plan diagrams are a separate Cvent product. In ${P}, the floor plan editor and the public hall map are part of the one package.`,
    },
  ],
  sources: [
    { link: { href: 'https://www.cvent.com/', label: 'Cvent home page' }, note: 'what Cvent is, customer count, products' },
    {
      link: { href: 'https://www.cvent.com/en/event-marketing-management/trade-show-solutions', label: 'Cvent trade show solutions' },
      note: 'check-in, badges, lead capture',
    },
    {
      link: { href: 'https://www.cvent.com/en/event-marketing-management/exhibitor-management', label: 'Cvent exhibitor management' },
      note: 'exhibitor tasks, booth assignment, appointments',
    },
  ],
  metaDescription: `${P} vs Cvent: one operating system for booth sales, floor plan, registration and check-in at a published yearly price, next to Cvent's quoted suite.`,
}

const RUN_EVENTS: ToolFacts = {
  name: 'run.events',
  slug: 'run-events',
  whatItIs:
    'run.events is an event platform from Germany and Estonia for conferences, associations and expo organisers, with registration, check-in, an events CRM, an exhibitor portal and a mobile app, sold in yearly plans.',
  shortAnswer: `Pick ${P} if you want one operating system for any kind of event, with the floor plan, online booth booking, the exhibitor portal and the sales pipeline built in, and no fee per ticket or commission. run.events suits organisers who mostly run conferences and need abstract and agenda management.`,
  cells: {
    'One system for the whole show': 'One platform, with modules added by plan',
    'Registration forms with approval': 'Yes, in Audience Management',
    'QR badges and check-in': 'Yes, with a badge designer, kiosks and access control',
    'Floor plan and booth allocation': 'Expo hall and booth set-up, on the Professional plan and up',
    'Exhibitors book and pay for a booth online': 'Booth selection by exhibitors, on the Professional plan and up',
    'Exhibitor portal': 'Yes, self-service, with changes approved by the organiser',
    'Exhibitor service orders': NOT_LISTED,
    'Invoices and e-invoicing': 'Invoicing included in Audience Management',
    'Lead scanning for exhibitors': 'Yes, in the Events CRM',
    'Sales pipeline for exhibitors and sponsors': 'Yes, the Events CRM, on the Advanced plan and up',
    'Attendee app and matchmaking': 'Yes, a branded app; matchmaking is an add-on',
    'How the price is set': 'Yearly fee by plan, up to 500 exhibitors, plus a one-time onboarding fee',
  },
  strengths: [
    'It covers conferences too, with abstract and agenda management.',
    'Its prices are public, with unlimited events and users in each plan, and it says it is hosted in the EU.',
  ],
  differences: [
    `${P} starts from the exhibitors: the floor plan, booth sales, the exhibitor portal and the sales pipeline sit in the same operating system as registration, badges, check-in and invoicing.`,
  ],
  price: [
    {
      kind: 'p',
      text: 'run.events publishes net yearly prices for its Expo & Fair plans, for up to 500 exhibitors: Essentials €4,300 (registration, mobile app, check-in and badges), Advanced €5,700 (adds the events CRM), Professional €8,500 (adds expo and booth management) and Enterprise €9,900 (adds event marketing). A one-time onboarding fee of €990 applies.',
    },
  ],
  faq: [
    {
      question: 'How much does run.events cost for a trade fair?',
      answer:
        'Its Expo & Fair plans run from €4,300 to €9,900 a year, net, for up to 500 exhibitors, plus a one-time onboarding fee of €990. Expo and booth management starts on the Professional plan at €8,500 a year.',
    },
    {
      question: 'Does run.events have a floor plan for trade fairs?',
      answer: `Yes. Expo hall and booth set-up, with booth selection by exhibitors, comes with its Professional plan at €8,500 a year and up; the Essentials and Advanced plans do not include it. In ${P}, the floor plan comes with the Expo plan and every plan above it.`,
    },
  ],
  sources: [
    { link: { href: 'https://run.events/', label: 'run.events home page' }, note: 'what it is, EU hosting, the companies behind it' },
    { link: { href: 'https://run.events/product', label: 'run.events products' }, note: 'modules, exhibitor portal, CRM, invoicing' },
    { link: { href: 'https://run.events/pricing', label: 'run.events pricing' }, note: 'Expo & Fair plans, onboarding fee' },
  ],
  metaDescription: `${P} vs run.events for event organisers: floor plan, online booth booking, exhibitor portal and CRM in one operating system, next to run.events plans.`,
}

const EXPOFP: ToolFacts = {
  name: 'ExpoFP',
  slug: 'expofp',
  whatItIs:
    'ExpoFP is a floor plan tool for trade shows and expos: you draw the hall in the browser, exhibitors reserve and pay for booths on the map, and visitors find stands without an app.',
  shortAnswer: `Pick ${P} if you want the floor plan and online booth booking in the same operating system as the exhibitor portal, registration, badges, check-in and invoicing, so the hall plan and the exhibitor list are one list instead of two. ExpoFP suits a show that only needs a floor plan and already has tools for the rest.`,
  cells: {
    'One system for the whole show': 'Floor plan and booth sales; registration, badges and check-in not listed on its site',
    'Registration forms with approval': NOT_LISTED,
    'QR badges and check-in': NOT_LISTED,
    'Floor plan and booth allocation': 'Yes, edited in the browser',
    'Exhibitors book and pay for a booth online': 'Yes, on the map (not on the Light plan)',
    'Exhibitor portal': 'Exhibitor profiles, edited through an auto-login link',
    'Exhibitor service orders': NOT_LISTED,
    'Invoices and e-invoicing': NOT_LISTED,
    'Lead scanning for exhibitors': NOT_LISTED,
    'Sales pipeline for exhibitors and sponsors': NOT_LISTED,
    'Attendee app and matchmaking': 'A visitor map in the browser, no app download',
    'How the price is set': 'Monthly subscription, or a one-time fee per event',
  },
  strengths: [
    'Its prices are public and start at $149 a month, which suits a single show with a simple hall.',
    'On the Standard and Pro plans, its team builds and maintains the map for you.',
  ],
  differences: [
    'Registration, badges, check-in, the exhibitor portal and invoicing are in the same operating system as the floor plan, so nobody keeps an exhibitor list and a hall plan in step by hand. We did not find registration, badges or check-in on the ExpoFP site.',
  ],
  price: [
    {
      kind: 'p',
      text: 'ExpoFP publishes its prices in dollars. DIY costs $149 a month and can be cancelled at any time. Light is $990 once, with 1 month of hosting and no booth reservation. Standard is $1,500 once, with 6 months of hosting. Pro is $2,100 once, with 12 months of hosting, for up to 1,000 booths.',
    },
  ],
  faq: [
    {
      question: 'Does ExpoFP do registration and check-in?',
      answer:
        'ExpoFP describes itself as a floor plan and booth sales platform, and we found no registration, badge or check-in module on its site. Ask ExpoFP directly if you need them.',
    },
    {
      question: `Is ${P} an alternative to ExpoFP?`,
      answer: `Yes. ${P} has the floor plan and online booth booking too, with registration, badges, check-in, the exhibitor portal and invoicing in the same operating system. If a floor plan is all you need, ExpoFP is a focused choice.`,
    },
  ],
  sources: [
    { link: { href: 'https://expofp.com/', label: 'ExpoFP home page' }, note: 'what it is, booth sales, exhibitor profiles, visitor map' },
    { link: { href: 'https://expofp.com/trade-show-floor-plan-software', label: 'ExpoFP floor plan software' }, note: 'the editor and booth reservations' },
    { link: { href: 'https://expofp.com/pricing', label: 'ExpoFP pricing' }, note: 'plans, hosting periods, booth limits' },
  ],
  metaDescription: `${P} vs ExpoFP: online booth booking and the floor plan in one operating system with registration, check-in and invoicing. Features and prices.`,
}

const PROFAIRS: ToolFacts = {
  name: 'profairs',
  slug: 'profairs',
  whatItIs:
    'profairs is German software for trade fair organisers, with exhibitor management, an exhibitor area with a service shop, an acquisition CRM and an optional hall plan with booth booking. Tickets and invoices run in connected tools.',
  shortAnswer: `Pick ${P} if you want registration, badges, check-in and invoicing in the same operating system as the floor plan, booth booking and the exhibitor portal, with published yearly prices, no fee per ticket and no commission. profairs suits German-speaking organisers who already use pretix or TICKETINO for tickets and Lexware or a similar tool for invoices.`,
  cells: {
    'One system for the whole show': 'Tickets, check-in and invoices run in connected tools',
    'Registration forms with approval': 'Through pretix or TICKETINO; voucher codes in profairs',
    'QR badges and check-in': 'Through pretix or TICKETINO',
    'Floor plan and booth allocation': 'Interactive hall plan, a paid option',
    'Exhibitors book and pay for a booth online': 'Booth booking in the exhibitor account, a paid option',
    'Exhibitor portal': 'Yes, an exhibitor area with deadlines',
    'Exhibitor service orders': 'Yes, a shop with orders for service providers',
    'Invoices and e-invoicing': 'Draft invoices sent to Lexware Office, Billomat, Bexio or Fastbill',
    'Lead scanning for exhibitors': 'Through PretixLEAD',
    'Sales pipeline for exhibitors and sponsors': 'Yes, an acquisition CRM, with HubSpot integration',
    'Attendee app and matchmaking': NOT_LISTED,
    'How the price is set': 'Setup fee plus a yearly fee by fairs and exhibitors; hall plan and booth booking extra',
  },
  strengths: [
    'Its exhibitor area has a service shop with orders for service providers, and a deadline dashboard.',
    'It connects to tools German organisers already use: pretix, TICKETINO, Lexware Office and HubSpot.',
  ],
  differences: [
    `Registration, badges, check-in and invoicing are part of ${P}, so there is no second or third system to keep in step with the exhibitor list. profairs hands tickets and check-in to pretix or TICKETINO, and invoices to tools such as Lexware Office.`,
  ],
  price: [
    {
      kind: 'p',
      text: 'profairs publishes its prices, excluding VAT. Startup is €990 to set up and €1,980 a year for 1 fair and up to 100 exhibitors a year; the interactive hall plan adds €480 a year and booth booking €900. Regular is €1,490 to set up and €3,960 a year for up to 3 fairs and 300 exhibitors; the hall plan adds €720 and booth booking €1,440. Larger organisers get a quote.',
    },
    {
      kind: 'p',
      text: "Contracts run for at least one year and renew each year unless cancelled with three months' notice.",
    },
  ],
  faq: [
    {
      question: 'How much does profairs cost with a hall plan and booth booking?',
      answer:
        'On the Startup plan, the hall plan and booth booking take the yearly fee from €1,980 to €3,360, plus €990 to set up. On Regular it comes to €6,120 a year plus €1,490 to set up. All excluding VAT.',
    },
    {
      question: 'Does profairs do ticketing and check-in?',
      answer: `profairs connects to pretix and TICKETINO for tickets, check-in and badge printing, and passes voucher codes to them. In ${P}, registration, badges and check-in are built in.`,
    },
  ],
  sources: [
    { link: { href: 'https://www.profairs.de', label: 'profairs home page' }, note: 'modules, hall plan, CRM, service shop' },
    { link: { href: 'https://www.profairs.de/de/features/', label: 'profairs features' }, note: 'ticketing, check-in, invoicing and lead integrations' },
    { link: { href: 'https://www.profairs.de/de/preise/tarife/', label: 'profairs rates' }, note: 'plans, setup fees, add-ons, contract term' },
    { link: { href: 'https://www.profairs.de/de/ueber-uns/', label: 'About profairs' }, note: 'customers and team' },
  ],
  metaDescription: `${P} vs profairs for event organisers: what is built in, what runs in other tools, and the full yearly price with a hall plan.`,
}

const SWAPCARD: ToolFacts = {
  name: 'Swapcard',
  slug: 'swapcard',
  whatItIs:
    'Swapcard is an event platform built around its event app and AI matchmaking, with an exhibitor portal and lead capture for trade shows, and links to more than 26 registration tools.',
  shortAnswer: `Pick ${P} if you want the operations behind the show in one operating system: booth sales from the floor plan, the exhibitor portal, registration, badges, check-in and invoicing, with published yearly prices, no fee per ticket and no commission. Swapcard suits shows whose main product is attendee meetings and hosted buyers.`,
  cells: {
    'One system for the whole show': 'One platform; floor plan, lead capture and the branded app are add-ons',
    'Registration forms with approval': 'Registration in Swapcard, or through one of 26+ registration tools',
    'QR badges and check-in': 'Access control is an add-on',
    'Floor plan and booth allocation': 'Interactive floor plan, an add-on on the higher plans',
    'Exhibitors book and pay for a booth online': 'Booth selection and sponsorship packages',
    'Exhibitor portal': 'Yes',
    'Exhibitor service orders': NOT_LISTED,
    'Invoices and e-invoicing': 'Exhibitor invoicing mentioned on its exhibitor portal page',
    'Lead scanning for exhibitors': 'Yes, QR and NFC, offline, with CRM export; an add-on',
    'Sales pipeline for exhibitors and sponsors': NOT_LISTED,
    'Attendee app and matchmaking': 'Yes: branded app (add-on), AI matchmaking, hosted-buyer meetings',
    'How the price is set': 'Plans by attendees per year; no amounts on its pricing page',
  },
  strengths: [
    'The attendee side: a branded app, AI matchmaking and hosted-buyer meetings.',
    'Lead capture for exhibitors that works offline and exports to Salesforce, HubSpot and Marketo.',
  ],
  differences: [
    `Registration, badges, check-in, the floor plan, booth sales and invoicing all run in ${P}. Swapcard links to more than 26 registration tools.`,
    'Published yearly prices by plan, with no fee per ticket and no commission. Swapcard sizes its plans by attendees and shows no amounts on its pricing page.',
  ],
  price: [
    {
      kind: 'p',
      text: "Swapcard's pricing page lists Starter, Professional and Enterprise plans, sized by attendees per year, and shows no amounts. The interactive floor plan, lead capture and the branded app are add-ons that raise the price.",
    },
  ],
  faq: [
    {
      question: 'Is Swapcard a trade show tool or an event app?',
      answer:
        'Both. It calls itself trade show and exhibition management software, and its strongest parts are the event app, matchmaking and lead capture. Registration can run in Swapcard or in one of the 26+ registration tools it links to.',
    },
  ],
  sources: [
    { link: { href: 'https://www.swapcard.com/', label: 'Swapcard home page' }, note: 'what it is' },
    {
      link: { href: 'https://www.swapcard.com/solutions/trade-show-management-software', label: 'Swapcard for trade shows' },
      note: 'exhibitor tools, registration integrations, booth selection',
    },
    { link: { href: 'https://www.swapcard.com/features/exhibitor-center', label: 'Swapcard exhibitor center' }, note: 'lead capture' },
    { link: { href: 'https://www.swapcard.com/pricing', label: 'Swapcard pricing' }, note: 'plans and add-ons' },
    {
      link: {
        href: 'https://help-attendees.swapcard.com/en/articles/8185435-how-does-swapcard-handle-your-data-under-gdpr',
        label: 'Swapcard help: data under GDPR',
      },
      note: 'EU data centres',
    },
  ],
  metaDescription: `${P} vs Swapcard: booth sales, floor plan, registration and check-in in one operating system with published prices, next to an event app with matchmaking.`,
}

const EXPOPLATFORM: ToolFacts = {
  name: 'ExpoPlatform',
  slug: 'expoplatform',
  whatItIs:
    'ExpoPlatform is a UK platform for exhibition organisers, with registration, badges, exhibitor dashboards, an interactive floor plan, lead intelligence for exhibitors, AI matchmaking and a mobile app.',
  shortAnswer: `Pick ${P} if you want the whole show in one operating system, from booth sales and the exhibitor portal to registration, badges, check-in and invoicing, with published yearly prices, no fee per ticket and no commission. ExpoPlatform suits large international shows built around hosted-buyer meetings.`,
  cells: {
    'One system for the whole show': 'One platform; more than one hall and the exhibitor manual are add-ons',
    'Registration forms with approval': 'Yes, multi-step forms with conditional questions',
    'QR badges and check-in': 'Badge design and printing',
    'Floor plan and booth allocation': 'Interactive floor plan; more than one hall is an add-on',
    'Exhibitors book and pay for a booth online': NOT_LISTED,
    'Exhibitor portal': 'Exhibitor dashboards; the exhibitor manual is an add-on',
    'Exhibitor service orders': NOT_LISTED,
    'Invoices and e-invoicing': NOT_LISTED,
    'Lead scanning for exhibitors': 'Yes, lead intelligence with an exhibitor ROI dashboard',
    'Sales pipeline for exhibitors and sponsors': 'Connects to your own CRM',
    'Attendee app and matchmaking': 'Yes: mobile app, AI matchmaking, hosted-buyer programme',
    'How the price is set': 'By quote, by exhibitors, visitors and modules',
  },
  strengths: [
    'Meetings: AI matchmaking, a hosted-buyer programme, speed networking and round tables.',
    'Exhibitors get lead intelligence and a dashboard of what the show brought them.',
  ],
  differences: [
    `Booth sales, the exhibitor portal, the floor plan, registration, badges, check-in and invoicing are one operating system in ${P}. We did not find online booth booking or invoicing on the ExpoPlatform site.`,
    'Published yearly prices by plan, with no fee per ticket and no commission. ExpoPlatform prices its exhibition platform by quote.',
  ],
  price: [
    {
      kind: 'p',
      text: 'ExpoPlatform does not publish prices for its exhibition platform. Its pricing page says costs depend on the number of exhibitors and visitors and on the modules and support you choose. The one published price is a free networking plan for up to 30 participants.',
    },
  ],
  faq: [
    {
      question: 'How much does ExpoPlatform cost?',
      answer:
        'ExpoPlatform gives prices by quote, based on your exhibitors, visitors and the modules you pick. Several halls on the floor plan, the exhibitor manual and the hosted-buyer programme are add-ons, so include them when you ask for the quote.',
    },
  ],
  sources: [
    { link: { href: 'https://expoplatform.com', label: 'ExpoPlatform home page' }, note: 'what it is, mobile app, ISO 27001 badge' },
    { link: { href: 'https://expoplatform.com/exhibition/', label: 'ExpoPlatform for exhibitions' }, note: 'floor plan, lead intelligence, matchmaking, customers' },
    { link: { href: 'https://expoplatform.com/online-registration/', label: 'ExpoPlatform registration' }, note: 'forms and badges' },
    { link: { href: 'https://expoplatform.com/pricing/', label: 'ExpoPlatform pricing' }, note: 'quote basis and add-ons' },
  ],
  metaDescription: `${P} vs ExpoPlatform: booth sales, floor plan, exhibitor portal and check-in in one operating system at a published price, next to a quoted platform.`,
}

const TOOLS: readonly ToolFacts[] = [CVENT, RUN_EVENTS, EXPOFP, PROFAIRS, SWAPCARD, EXPOPLATFORM]

export const COMPARISONS: readonly GuideContent[] = TOOLS.map((tool) => comparison(tool, TOOLS))

import { PRODUCT_NAME as P } from '@/lib/product'
import { links } from '@/site/links'
import costPhoto from '@/site/photos/organiser-comparing-software-costs.jpg'

import type { GuideContent } from './GuideArticle'

/**
 * Guide: what trade show software costs (content plan #10,
 * docs/website/KEYWORD_RESEARCH.md: "event management software pricing / cost").
 *
 * ★ EVERY FIGURE IS SOURCED. The prices are the vendors' own published ones,
 * the same as on the comparison pages, from docs/website/COMPETITOR_FACTS.md;
 * `compare.test.tsx` fails on a figure that is not in that file. No private
 * figures (E-61 rule 2). Our own price is on /pricing, linked, not repeated.
 */
export const SOFTWARE_COST_GUIDE: GuideContent = {
  kind: 'guide',
  path: '/guides/trade-show-software-cost',
  menuLabel: 'What trade show software costs',
  summary: 'Published prices side by side, and the costs that come on top.',
  title: 'What trade show software costs: published prices and the costs on top',
  metaTitle: `What trade show software costs in 2026: published prices compared · ${P}`,
  metaDescription:
    'Trade show and exhibition software prices from the vendors that publish them, how each one charges, and the setup fees, add-ons and contract terms that change the total.',
  intro:
    'For a trade show with up to a few hundred exhibitors, the tools that publish their prices charge from €1,980 to €9,900 a year before setup fees, and a floor-plan-only tool from $149 a month. The big platforms give prices by quote. What changes the total most is how a tool charges: by exhibitors, by attendees, by event or per ticket, and what it sells as an add-on.',
  image: {
    src: costPhoto,
    alt: 'An organiser at her desk compares two printed documents, with a calculator, a laptop and a coffee in front of her.',
  },
  published: '2026-10-26',
  updated: '2026-10-26',
  sections: [
    {
      id: 'how-tools-charge',
      title: 'How trade show software is priced',
      blocks: [
        { kind: 'p', text: 'Five models cover almost every tool. Work out which one a tool uses before you compare figures, because the same show can cost very different amounts under each.' },
        {
          kind: 'list',
          items: [
            'A yearly fee by exhibitors. You pay for the number of exhibitors a year, with a cap on shows or none. Good when visitor numbers swing from year to year.',
            'A fee by attendees. You pay for the number of people registered. It grows with your show, so check the price at your best year, not your average one.',
            'A monthly subscription or a fee per event. Common for single-purpose tools, such as a floor plan you only need for a few months.',
            'A fee per ticket sold. A percentage or a fixed amount on each paid ticket, sometimes on top of a licence. Ask whether it applies to free registrations too.',
            'A quote. The price depends on your show and what you choose, and you learn it from sales. Ask for the total over the whole contract.',
          ],
        },
      ],
    },
    {
      id: 'published-prices',
      title: 'Published prices, side by side',
      blocks: [
        {
          kind: 'p',
          text: 'These are the prices vendors publish on their own sites, read on 26 October 2026. Vendors change prices, so check each link before you decide.',
        },
        {
          kind: 'table',
          caption: 'Published prices of trade show software (excluding VAT, read 26 October 2026)',
          head: ['Tool', 'How it charges', 'Published price', 'What it covers'],
          rows: [
            ['profairs', 'Setup fee plus a yearly fee, by fairs and exhibitors', 'Startup: €990 setup, €1,980 a year. Regular: €1,490 setup, €3,960 a year', 'Exhibitor management, service shop, CRM. Hall plan and booth booking cost extra'],
            ['run.events', 'Yearly fee by plan, up to 500 exhibitors', 'Expo & Fair plans from €4,300 to €9,900 a year, plus €990 onboarding', 'Registration, check-in and app from the first plan; booth management from €8,500'],
            ['ExpoFP', 'Monthly, or once per event (in dollars)', 'DIY $149 a month; Light $990, Standard $1,500, Pro $2,100 once', 'Floor plan and booth sales only'],
            ['Swapcard', 'Plans by attendees per year', 'No amounts shown on its pricing page', 'Event app, matchmaking, exhibitor tools; floor plan and lead capture are add-ons'],
            ['ExpoPlatform', 'Quote', 'Not published', 'Registration, badges, floor plan, matchmaking, app'],
            ['Cvent', 'Quote', 'Not published', 'Registration, check-in, exhibitor management, lead capture, app'],
          ],
        },
        {
          kind: 'p',
          parts: [
            'Each tool has its own comparison page with the details and the sources: ',
            { href: '/compare/profairs', label: 'profairs' },
            ', ',
            { href: '/compare/run-events', label: 'run.events' },
            ', ',
            { href: '/compare/expofp', label: 'ExpoFP' },
            ', ',
            { href: '/compare/swapcard', label: 'Swapcard' },
            ', ',
            { href: '/compare/expoplatform', label: 'ExpoPlatform' },
            ' and ',
            { href: '/compare/cvent', label: 'Cvent' },
            '.',
          ],
        },
      ],
    },
    {
      id: 'costs-on-top',
      title: 'The costs that come on top',
      blocks: [
        { kind: 'p', text: 'The yearly figure is rarely the whole bill. These are the lines that change it most:' },
        {
          kind: 'list',
          items: [
            'Setup and onboarding. profairs charges €990 or €1,490 to set up; run.events charges €990 once. Ask what the fee covers: importing your exhibitors, drawing your hall, training.',
            'Modules sold separately. On profairs, the hall plan and booth booking take the Startup plan from €1,980 to €3,360 a year. On Swapcard, the floor plan and lead capture are add-ons. On ExpoPlatform, a floor plan with more than one hall is an add-on.',
            'Hardware on the day. Badge printers, scanners and the desk set-up are usually rented or bought separately from the software.',
            'Card payment fees. When exhibitors and visitors pay online, the payment provider takes a fee per payment, on top of anything the software charges.',
            'Your own time. A tool that leaves registration, invoices or check-in to other systems means someone keeps the lists in step by hand.',
          ],
        },
      ],
    },
    {
      id: 'contract',
      title: 'Read the contract terms before the price',
      blocks: [
        {
          kind: 'p',
          text: "A cheap first year can cost more over three years. profairs, for example, publishes a minimum term of one year that renews each year unless you cancel with three months' notice. That is fair, as long as you put the date in your calendar. Ask every vendor the same things:",
        },
        {
          kind: 'list',
          items: [
            'How long is the minimum term, and how and when do I cancel?',
            'How much can the price rise at renewal?',
            'Is there a fee per ticket or per registration, and does it apply to free registrations?',
            'Must payments go through your payment provider, and do you hold back any of the money?',
            'What does the price cover if my show grows, or if I run one more edition a year?',
            'Can I export all my data, including past editions, when I leave?',
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: 'How much does trade show software cost for a small organiser?',
      answer:
        'Among the tools that publish prices, one fair with up to 100 exhibitors starts at €1,980 a year plus €990 setup on profairs, and €4,300 a year plus €990 onboarding on run.events. A floor plan on its own costs from $149 a month on ExpoFP. Prices exclude VAT.',
    },
    {
      question: 'Why do some event platforms not publish their prices?',
      answer:
        'Platforms that sell to large organisers price each deal by the number of attendees, the modules and the contract length, so they give a quote. Ask for the full cost over the whole contract, with any per-registration fees, so you can compare it with a yearly price.',
    },
    {
      question: 'Is it cheaper to use several small tools than one platform?',
      answer:
        'Sometimes, on the invoice. Count the setup fee of each tool and the hours your team spends copying exhibitors, booths and payments between them. Those hours are the cost that never shows up on a price list.',
    },
  ],
  product: {
    id: 'product',
    title: `What ${P} costs`,
    blocks: [
      {
        kind: 'p',
        text: `${P} charges one yearly price by the number of exhibitors, with every module included: registration, accreditation, badges and check-in, the floor plan and the exhibitor portal. There is no fee per ticket and no cap on the number of shows.`,
      },
      {
        kind: 'p',
        parts: ['The figures are on the ', { href: links.pricing, label: 'pricing page' }, '. Book a demo and we will price your own show.'],
      },
    ],
  },
  sources: {
    title: 'Sources',
    intro: "Every price comes from the vendor's own pricing page, read on 26 October 2026.",
    items: [
      { link: { href: 'https://www.profairs.de/de/preise/tarife/', label: 'profairs rates' }, note: 'plans, setup fees, add-ons, contract term' },
      { link: { href: 'https://run.events/pricing', label: 'run.events pricing' }, note: 'Expo & Fair plans and onboarding fee' },
      { link: { href: 'https://expofp.com/pricing', label: 'ExpoFP pricing' }, note: 'plans and hosting periods' },
      { link: { href: 'https://www.swapcard.com/pricing', label: 'Swapcard pricing' }, note: 'plans and add-ons' },
      { link: { href: 'https://expoplatform.com/pricing/', label: 'ExpoPlatform pricing' }, note: 'quote basis and add-ons' },
    ],
  },
}

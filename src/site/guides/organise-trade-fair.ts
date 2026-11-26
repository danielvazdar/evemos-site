import { PRODUCT_NAME as P } from '@/lib/product'
import { links } from '@/site/links'
import organisePhoto from '@/site/photos/team-planning-trade-fair-hall-plan.jpg'

import type { GuideContent } from './GuideArticle'

/**
 * Guide: how to organise a trade fair (content plan #4,
 * docs/website/KEYWORD_RESEARCH.md: "how to organise a trade fair", "how to
 * plan a trade show"). The hub of the guides: each step links to the guide
 * that goes deeper. Facts from docs/website/GUIDE_FACTS.md.
 *
 * ★ NO LEAD-TIME FIGURE. We found no authoritative source for "start N months
 * ahead", so the page orders the steps and names the venue as the first one,
 * without a number.
 */
export const ORGANISE_TRADE_FAIR_GUIDE: GuideContent = {
  kind: 'guide',
  path: '/guides/how-to-organise-a-trade-fair',
  menuLabel: 'How to organise a trade fair',
  summary: 'The steps in order, from the venue to counting visitors honestly.',
  title: 'How to organise a trade fair: the steps in order',
  metaTitle: `How to organise a trade fair or trade show, step by step · ${P}`,
  metaDescription:
    'The steps of organising a trade fair in the order organisers take them: audience, venue, terms, price list, exhibitor sales, exhibitor manual, visitors and press, show days and the figures afterwards.',
  intro:
    'Organising a trade fair comes down to nine steps, in this order: decide who the fair is for, book the venue, write the terms of participation, publish the price list, sell the space, send exhibitors their manual, register visitors and press, run the show days, and count the results the same way every year. The venue comes first, because the hall decides your dates, your floor plan and your prices.',
  image: {
    src: organisePhoto,
    alt: 'Four organisers lean over a printed hall plan on a table with sticky notes, coffee cups and a laptop, one pointing at a booth.',
  },
  published: '2026-10-26',
  updated: '2026-10-26',
  sections: [
    {
      id: 'audience',
      title: '1. Decide who the fair is for',
      blocks: [
        {
          kind: 'p',
          parts: [
            'Write one sentence: which industry, which buyers, trade only or open to the public. Exhibitors book on who will walk past their stand, so this sentence sells the fair. German law, for example, defines a Messe as a fair that sells mostly to the trade, with the public allowed only on single days. ',
            { href: '/guides/trade-fair-vs-trade-show-vs-exhibition', label: 'Trade fair, trade show or exhibition' },
            ' explains the terms.',
          ],
        },
      ],
    },
    {
      id: 'venue',
      title: '2. Book the venue and read its rules',
      blocks: [
        {
          kind: 'p',
          parts: [
            'Ask the venue for free dates, the price, the drawing of the empty hall and its technical guidelines. The guidelines set aisle widths, stand heights and exits, and they shape how many square metres you can sell. ',
            { href: '/guides/trade-show-floor-plan', label: 'How to plan a trade show floor plan' },
            ' covers the rules to check.',
          ],
        },
      ],
    },
    {
      id: 'terms',
      title: '3. Write the terms of participation',
      blocks: [
        {
          kind: 'p',
          text: 'Before you sell anything, write the terms every exhibitor accepts when they apply: when the contract starts, whether you may refuse an applicant, payment dates, what a cancellation costs and which technical rules apply. Large fairs bind exhibitors to their terms and technical guidelines on registration, and the contract starts only when the organiser admits them.',
        },
      ],
    },
    {
      id: 'price-list',
      title: '4. Publish the price list',
      blocks: [
        {
          kind: 'p',
          parts: [
            'Price per square metre by stand type, the fees every exhibitor pays on top, an early-booking deadline and the late fee. ',
            { href: '/guides/how-to-sell-exhibition-space', label: 'How to sell exhibition space' },
            ' has real price lists to compare against.',
          ],
        },
      ],
    },
    {
      id: 'sell',
      title: '5. Sell the space',
      blocks: [
        {
          kind: 'p',
          text: 'Offer last year\'s exhibitors their booth first, with a date to confirm by. Then work through your list of companies in the industry, the trade press and the associations. Keep one list of every booth and every company you talk to, so two people never sell the same booth.',
        },
      ],
    },
    {
      id: 'exhibitor-manual',
      title: '6. Send exhibitors their manual',
      blocks: [
        {
          kind: 'p',
          text: 'The exhibitor manual tells exhibitors everything between booking and the show: build-up and dismantling times, deliveries, technical rules, services they can order, badges for their stand team and every deadline. Send it with the confirmation, keep it in one place online, and chase missing items before the deadlines, not after.',
        },
      ],
    },
    {
      id: 'visitors-and-press',
      title: '7. Register visitors and press',
      blocks: [
        {
          kind: 'p',
          parts: [
            'Open visitor registration with a form for each group, so trade visitors, the public, sponsors and delegations each answer only their own questions. Journalists apply for press accreditation, and you approve them before they get a badge. ',
            { href: links.guidePressAccreditation, label: 'Press accreditation for trade shows' },
            ' explains who qualifies and what to ask for.',
          ],
        },
      ],
    },
    {
      id: 'show-days',
      title: '8. Run the show days',
      blocks: [
        {
          kind: 'p',
          text: 'Send badges before the show, so most people arrive with a QR code on their phone. At the door, scan the badge, or find the person by name when the phone is dead. Plan a separate desk or lane for exhibitors and press during build-up and on the first morning, when queues are longest.',
        },
      ],
    },
    {
      id: 'figures',
      title: '9. Count the results the same way every year',
      blocks: [
        {
          kind: 'p',
          text: 'Exhibitors rebook on figures: how many visitors came, from where and from which industries. Count unique people, not scans, and use the same method every year. In Germany, FKM audits and certifies exhibitor and visitor figures for the fairs that take part, which is the standard to aim for even if your fair is not audited.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'What is the first step in organising a trade fair?',
      answer:
        'Decide who the fair is for, then book the venue. The hall decides your dates, how many square metres you can sell and what the floor plan looks like, so nothing else can be priced before it.',
    },
    {
      question: 'What is an exhibitor manual?',
      answer:
        'The document that tells exhibitors everything between booking and the show: build-up and dismantling times, deliveries, technical rules, services to order, badges for the stand team and every deadline. At large fairs, the technical rules in it are part of the exhibitor\'s contract.',
    },
    {
      question: 'What is FKM?',
      answer:
        'FKM, the Gesellschaft zur Freiwilligen Kontrolle von Messe- und Ausstellungszahlen, is the German body that audits and certifies the exhibitor and visitor figures of trade fairs, so exhibitors can trust and compare them.',
    },
  ],
  product: {
    id: 'product',
    title: `Running the fair with ${P}`,
    blocks: [
      {
        kind: 'p',
        text: `${P} covers the organiser's side of steps 5 to 8 today: the floor plan with booth allocation, the exhibitor portal with each exhibitor's booth, purchases, deadlines and manual, registration forms with approval for each group, press and crew accreditation, QR badges by email and check-in at the door.`,
      },
      {
        kind: 'p',
        parts: ['See the ', { href: links.productOverview, label: 'product overview' }, ', or book a demo and we will walk through your fair.'],
      },
    ],
  },
  sources: {
    title: 'Sources',
    intro: 'Read on 26 October 2026.',
    items: [
      { link: { href: 'https://www.gesetze-im-internet.de/gewo/__64.html', label: 'Gewerbeordnung, section 64' }, note: 'the legal definition of a Messe' },
      {
        link: {
          href: 'https://medteclive.com/media/raw/d8e893080c81b600834a1555f1a9467b22e56eb0b44b18f2bfd5dec10b440283/Allgemeine-Teilnahmebedingungen-Messe%20M%C3%BCnchen%20GmbH.pdf',
          label: 'Messe München general terms of participation',
        },
        note: 'registration, admission and the contract',
      },
      { link: { href: 'https://www.fkm.de', label: 'FKM' }, note: 'audited exhibitor and visitor figures' },
      { link: { href: 'https://www.auma.de/messelexikon/', label: 'AUMA trade fair glossary' }, note: 'terms and FKM' },
    ],
  },
}

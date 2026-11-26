import { PRODUCT_NAME as P } from '@/lib/product'
import sellSpacePhoto from '@/site/photos/selling-exhibition-space-floor-plan.jpg'

import type { GuideContent } from './GuideArticle'

/**
 * Guide: how to sell exhibition space (content plan #3,
 * docs/website/KEYWORD_RESEARCH.md: "how to sell exhibition space").
 *
 * ★ THE PRICES AND TERMS ARE REAL ONES, from published price lists and
 * terms (docs/website/GUIDE_FACTS.md). The product section claims only what
 * the floor plan does today: booth codes, booth states, assignment by the
 * organiser's team. Online booking by exhibitors is planned and says so.
 */
export const SELL_EXHIBITION_SPACE_GUIDE: GuideContent = {
  kind: 'guide',
  path: '/guides/how-to-sell-exhibition-space',
  menuLabel: 'How to sell exhibition space',
  summary: 'Pricing by the square metre, the fees on top, deadlines and cancellation terms.',
  title: 'How to sell exhibition space: prices, deadlines and terms that hold',
  metaTitle: `How to sell exhibition space: stand prices, deadlines and terms · ${P}`,
  metaDescription:
    'How trade fair organisers price stands by the square metre and by open sides, which fees to add, how early-booking deadlines work and what to write in the cancellation terms.',
  intro:
    'Exhibition space is sold by the square metre, with a higher price for stands that are open on more sides, a set of fees every exhibitor pays on top, a cheaper price for early bookings and written terms that say when the contract starts and what a cancellation costs. Publish all of it before the first sales call, so every exhibitor gets the same answer.',
  image: {
    src: sellSpacePhoto,
    alt: 'Two people at a stand counter mark up a floor plan with a pen while visitors walk down the aisle behind them.',
  },
  published: '2026-10-26',
  updated: '2026-10-26',
  sections: [
    {
      id: 'price-per-square-metre',
      title: 'Price the space per square metre, by open sides',
      blocks: [
        {
          kind: 'p',
          text: 'A stand open to the aisle on more sides gets more passers-by, so it costs more per square metre and usually has a larger minimum size. Bau Messe NRW 2027 in Dortmund publishes a clear example, for space only, without walls:',
        },
        {
          kind: 'table',
          caption: 'Stand prices at Bau Messe NRW 2027, per m², excluding VAT',
          head: ['Stand type', 'Open sides', 'Price per m²', 'Minimum size'],
          rows: [
            ['Row stand', '1', '€130', '12 m²'],
            ['Corner stand', '2', '€135', '15 m²'],
            ['Head stand', '3', '€140', '24 m²'],
            ['Island stand', '4', '€145', '36 m²'],
          ],
        },
        {
          kind: 'p',
          text: 'Outdoor space at the same fair costs €80 per m². If you also sell shell scheme stands with walls, carpet and a fascia board, price them as a separate line per m², so an exhibitor can compare space only with a stand ready to use.',
        },
      ],
    },
    {
      id: 'fees',
      title: 'List the fees every exhibitor pays on top',
      blocks: [
        {
          kind: 'p',
          text: 'Fairs add fixed fees to the space. Put them on the price list, not in the small print, because exhibitors compare totals.',
        },
        {
          kind: 'list',
          items: [
            'A media or marketing package: the catalogue entry and the online exhibitor list. Bau Messe NRW charges a €295 media flat fee.',
            'A fee per co-exhibitor, a second company sharing the stand: €295 at Bau Messe NRW, €275 at the Leipzig Book Fair.',
            'Levies per square metre. The Leipzig Book Fair adds an AUMA levy of €0.60 per m².',
          ],
        },
      ],
    },
    {
      id: 'deadlines',
      title: 'Reward early bookings with a deadline',
      blocks: [
        {
          kind: 'p',
          text: 'Early bookings tell you early whether the hall will fill. The Leipzig Book Fair 2027 sells space in two windows: an early price, 10% below the base price, until 18 August 2026, and the base price until the registration deadline on 1 November 2026. An own-build stand costs €258 per m² early and €287 per m² after. Registrations after the deadline pay a late fee of €325 or €600, depending on the stand size, and are accepted only on request.',
        },
        {
          kind: 'p',
          text: 'Whatever dates you pick, print them on the price list and the application form, and keep them. A deadline you extend once stops working the next year.',
        },
      ],
    },
    {
      id: 'application-and-contract',
      title: 'Say when the contract starts',
      blocks: [
        {
          kind: 'p',
          text: 'Large fairs sell space through an application, not a checkout. The exhibitor applies, the organiser decides, and the contract exists only once the organiser confirms. Messe München puts it in its terms: the contract forms with admission by the organiser, and nobody has a legal right to be admitted. By registering, the exhibitor accepts the terms of participation and the technical guidelines.',
        },
        {
          kind: 'p',
          text: 'This lets you place competitors apart, keep the mix of exhibitors you promised visitors, and refuse a company that did not pay last year. Write the rule into your own terms before you open sales.',
        },
      ],
    },
    {
      id: 'cancellations',
      title: 'Put a price on cancelling',
      blocks: [
        {
          kind: 'p',
          text: 'Space cancelled late is hard to sell again, so the terms should make a late cancellation cost the exhibitor, not you. Two published examples:',
        },
        {
          kind: 'list',
          items: [
            'Leipzig Book Fair: €220 for a stand up to 6 m² or €460 from 8 m² if the exhibitor cancels before admission; after admission, 100% of the stand rent. Making a stand smaller after admission also costs the full rent of the area given up.',
            'Messe München: an exhibitor who withdraws without the right to owes the full price, minus the costs the organiser saved and any money from letting the space to someone else.',
          ],
        },
      ],
    },
    {
      id: 'one-list',
      title: 'Keep one list of every booth',
      blocks: [
        {
          kind: 'p',
          text: 'Double bookings happen when two people sell from two copies of the plan. Give every booth a code that appears on the plan, the contract, the invoice and the badge, and mark each booth free, reserved or sold in one place that everyone selling reads. Offer last year\'s exhibitors their booth first, with a date by which they must confirm, then open the rest.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'How much should I charge per square metre for a stand?',
      answer:
        'Start from what fairs of your size and region charge and what your hall costs you per square metre. For reference, Bau Messe NRW 2027 charges €130 to €145 per m² for space only, depending on open sides, and the Leipzig Book Fair charges €258 to €287 per m² for own-build space.',
    },
    {
      question: 'Should corner stands cost more?',
      answer:
        'The fairs we looked at do: each extra open side faces more visitors, so it costs more per square metre. At Bau Messe NRW 2027 a row stand costs €130 per m² and a corner stand €135, with larger minimum sizes as the open sides go up.',
    },
    {
      question: 'What happens if an exhibitor cancels?',
      answer:
        'Whatever your terms say. Published terms charge a fixed fee before admission and up to the full stand rent after it. Write the fee and the dates into the terms the exhibitor accepts when applying.',
    },
  ],
  product: {
    id: 'product',
    title: `Selling booths with ${P}`,
    blocks: [
      {
        kind: 'p',
        text: `In ${P} you draw the hall on the floor plan and give every booth a code. Your team assigns each booth to an exhibitor and marks it free, reserved, sold or blocked, and visitors see the same plan on the public hall map with the exhibitor list. Exhibitors sign in to their portal with a link by email and see their booth, what they bought and their deadlines.`,
      },
      {
        kind: 'p',
        parts: [
          'Online booking, where exhibitors pick and pay for a booth themselves, is planned. See the ',
          { href: '/product/floor-plan', label: 'floor plan page' },
          ', or book a demo and we will draw your own hall.',
        ],
      },
    ],
  },
  sources: {
    title: 'Sources',
    intro: 'The prices and terms are the organisers\' own published ones, read on 26 October 2026.',
    items: [
      {
        link: { href: 'https://irp.cdn-website.com/759ea86c/files/uploaded/Ausstellerformular_Bau-Messe-NRW-2027.pdf', label: 'Bau Messe NRW 2027 exhibitor form' },
        note: 'prices per m² by stand type, co-exhibitor and media fees',
      },
      {
        link: { href: 'https://www.leipziger-buchmesse.de/files/buchmesse/media/pdfs-dokumente/lbm-aktuell/lbm27-preisliste.pdf', label: 'Leipzig Book Fair 2027 price list' },
        note: 'early and base prices, fees, late booking and cancellation charges',
      },
      {
        link: {
          href: 'https://medteclive.com/media/raw/d8e893080c81b600834a1555f1a9467b22e56eb0b44b18f2bfd5dec10b440283/Allgemeine-Teilnahmebedingungen-Messe%20M%C3%BCnchen%20GmbH.pdf',
          label: 'Messe München general terms of participation',
        },
        note: 'admission, contract, withdrawal',
      },
    ],
  },
}

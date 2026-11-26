import { PRODUCT_NAME as P } from '@/lib/product'
import leadPhoto from '@/site/photos/organisers-checking-hall-floor-plan.jpg'
import hallModel from '@/site/photos/exhibition-hall-layout-model.jpg'
import shellBooth from '@/site/photos/shell-scheme-stand-model.jpg'

import type { GuideContent } from './GuideArticle'

/**
 * Guide: planning a trade show floor plan (content plan #5,
 * docs/website/KEYWORD_RESEARCH.md: "how to design a floor plan for an
 * event", "trade show floor plan").
 *
 * ★ THE SAFETY FIGURES ARE QUOTED WITH THEIR SOURCE AND SCOPE: the 3 m aisle
 * is Bavaria's assembly-venue regulation, the stand rules are two German
 * venues' technical guidelines (docs/website/GUIDE_FACTS.md). The page tells
 * the reader to check their own venue's rules and never presents one region's
 * figure as a general law.
 */
export const FLOOR_PLAN_GUIDE: GuideContent = {
  kind: 'guide',
  path: '/guides/trade-show-floor-plan',
  menuLabel: 'Planning a trade show floor plan',
  summary: 'Aisles, stand types, heights and exits, with the rules venues publish.',
  title: 'How to plan a trade show floor plan: aisles, stands and the rules to check',
  metaTitle: `How to plan a trade show floor plan: aisles, stand types and safety rules · ${P}`,
  metaDescription:
    'How to lay out an exhibition hall: start from the venue\'s technical rules, plan the aisles and escape routes, then the stand types, sizes and heights. With real figures from German venue rules.',
  intro:
    'Plan a trade show floor in this order: the venue\'s technical guidelines and the fire authority\'s rules first, then the aisles and escape routes, then the stands. Aisle widths, the distance to an exit and stand heights are set by regulation and by the venue, not by taste. In Bavaria, for example, hall aisles must be at least 3 m wide and no point may be more than 20 m from an aisle.',
  image: {
    src: leadPhoto,
    alt: 'Two organisers in an empty exhibition hall check a printed floor plan, with aisles taped on the floor and a stand frame going up behind them.',
  },
  published: '2026-10-26',
  updated: '2026-10-26',
  sections: [
    {
      id: 'start-with-the-rules',
      title: 'Start with the venue\'s technical guidelines',
      blocks: [
        {
          kind: 'p',
          text: 'Every exhibition venue publishes technical guidelines: aisle widths, stand heights, exits, fire safety, rigging and two-storey stands. Ask for them, and for the drawing of the empty hall with columns, doors, fire exits, hydrants and floor loads, before you draw a single stand. These rules usually become part of the exhibitor\'s contract, so your plan must follow them too.',
        },
        {
          kind: 'p',
          text: 'Building and fire rules also differ by country, and in Germany by federal state. The figures below come from Bavaria and from two German venues. Use them to know what to ask, then check your own venue\'s numbers.',
        },
      ],
    },
    {
      id: 'aisles',
      title: 'Plan the aisles and escape routes first',
      blocks: [
        {
          kind: 'p',
          text: 'Aisles carry visitors past stands and carry everyone out in an emergency. The Bavarian assembly-venue regulation sets these limits for exhibition halls:',
        },
        {
          kind: 'table',
          caption: 'Aisle rules for exhibition halls in the Bavarian Versammlungsstättenverordnung, section 7',
          head: ['Rule', 'Limit'],
          rows: [
            ['Clear width of hall aisles and their exits', 'at least 3 m'],
            ['Depth of the stand area between aisles', 'at most 30 m'],
            ['Distance from any point of the stand area to an aisle', 'at most 20 m'],
            ['Clear width of any part of an escape route', 'at least 1.20 m'],
          ],
        },
        {
          kind: 'figure',
          src: hallModel,
          alt: 'A model of a hall seen from above: rows of stands on a grid, with straight aisles between them and visitors walking through.',
        },
        {
          kind: 'p',
          text: 'Keep aisles straight and leading to opposite exits, keep them clear of furniture and signs, and leave the fire doors, hydrants and first aid points free. Draw them before the stands, so the stands fill what is left.',
        },
      ],
    },
    {
      id: 'stand-types',
      title: 'Choose the stand types',
      blocks: [
        {
          kind: 'p',
          text: 'Stands are named by how many sides face an aisle. More open sides mean more visitors and a higher price per square metre.',
        },
        {
          kind: 'list',
          items: [
            'Row stand: one side open, in a row of stands. The cheapest and the most common.',
            'Corner stand: two sides open, at the end of a row.',
            'Head stand: three sides open, at the end of a block of stands.',
            'Island stand: open on all four sides, for larger exhibitors who build their own stand.',
          ],
        },
        {
          kind: 'p',
          text: 'Shell scheme stands, with walls, carpet and a name board supplied by the organiser, are laid out on a grid of equal modules. Mark on the plan which booths are shell scheme and which are space only, because they are sold and built differently.',
        },
        {
          kind: 'figure',
          src: shellBooth,
          alt: 'A model of a shell scheme stand: an aluminium frame with white wall panels, a coloured back wall, a spotlight, a counter and two stools.',
        },
      ],
    },
    {
      id: 'heights-and-exits',
      title: 'Set heights, open fronts and exits for large stands',
      blocks: [
        {
          kind: 'p',
          text: 'Venues limit how high and how closed a stand can be, so the hall stays readable and safe. From the technical guidelines Messe Frankfurt published for ACHEMA, and from Koelnmesse:',
        },
        {
          kind: 'list',
          items: [
            'Stands up to 30 m² may be at most 4.00 m high; higher builds need approval, up to 8.00 m depending on the hall (ACHEMA).',
            'The front facing the aisles should ideally be 70% open (ACHEMA).',
            'A stand up to 100 m² needs one exit at least 0.90 m wide; above 100 m² or 100 people, two exits opposite each other (ACHEMA).',
            'No point of a stand more than 20 m from a hall aisle (ACHEMA and Koelnmesse).',
            'Walls facing a neighbouring stand must be neutral above 2.5 m, so they do not advertise into the next stand (Koelnmesse).',
            'Two-storey stands need at least 2.30 m clear height inside, and the organiser may refuse them (ACHEMA).',
          ],
        },
      ],
    },
    {
      id: 'make-it-work',
      title: 'Make the plan work for selling',
      blocks: [
        {
          kind: 'list',
          items: [
            'Give every booth a code, such as H7-B04, and use the same code on the plan, the contract, the invoice and the badge.',
            'Put the draws where visitors must walk past other stands: catering, stages and the largest exhibitors at the back, not by the entrance.',
            'Keep one plan that everyone sells from, with each booth marked free, reserved or sold.',
            'Publish a visitor version with the exhibitor list, so people can find a stand by name.',
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: 'How wide should aisles be at a trade show?',
      answer:
        'Check your venue\'s technical guidelines and your local regulation. In Bavaria, the assembly-venue regulation requires hall aisles of at least 3 m, with no point of the stand area more than 20 m from an aisle. Every part of an escape route must be at least 1.20 m wide.',
    },
    {
      question: 'What are the types of trade show stands?',
      answer:
        'Row stands are open on one side, corner stands on two, head stands on three and island stands on all four. More open sides face more visitors and usually cost more per square metre.',
    },
    {
      question: 'How high can a trade show stand be?',
      answer:
        'It depends on the venue and the hall. At ACHEMA in Frankfurt, stands up to 30 m² may be 4.00 m high, and higher builds up to 8.00 m need the organiser\'s approval.',
    },
  ],
  product: {
    id: 'product',
    title: `Drawing the floor plan in ${P}`,
    blocks: [
      {
        kind: 'p',
        text: `${P}'s floor plan editor lets you place, move, resize and rotate stands, give each booth a code and mark it free, reserved, sold or blocked. Your team assigns booths to exhibitors on the same plan, and visitors see it as a public hall map with the exhibitor list. If you have a drawing of your hall as a PDF or CAD file, we draw the plan from it.`,
      },
      {
        kind: 'p',
        parts: ['See the ', { href: '/product/floor-plan', label: 'floor plan page' }, ', or book a demo with your hall drawing.'],
      },
    ],
  },
  sources: {
    title: 'Sources',
    intro: 'Read on 26 October 2026. Rules change and differ by region and venue, so check the current version for your own hall.',
    items: [
      {
        link: { href: 'https://www.gesetze-bayern.de/Content/Rtf/BayVStaettV-7?all=False', label: 'Bavarian Versammlungsstättenverordnung, section 7' },
        note: 'aisle widths, stand area depth, escape routes',
      },
      {
        link: { href: 'https://www.achema.de/fileadmin/user_upload/Content/_Storage/PDF/ACHEMA2024/technische_richtlinien_DE.pdf', label: 'ACHEMA technical guidelines (Messe Frankfurt)' },
        note: 'stand heights, open fronts, exits, two-storey stands',
      },
      {
        link: { href: 'https://koelncongress.de/wp-content/uploads/2023/12/Technische-Richtlinien-09_2023_GB_screen.pdf', label: 'Koelnmesse technical guidelines' },
        note: 'walls to neighbours, distance to an aisle',
      },
      {
        link: { href: 'https://irp.cdn-website.com/759ea86c/files/uploaded/Ausstellerformular_Bau-Messe-NRW-2027.pdf', label: 'Bau Messe NRW 2027 exhibitor form' },
        note: 'stand types by open sides',
      },
    ],
  },
}

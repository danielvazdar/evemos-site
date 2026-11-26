import { PRODUCT_NAME as P } from '@/lib/product'
import fairVsShowPhoto from '@/site/photos/trade-fair-hall-from-balcony.jpg'

import type { GuideContent } from './GuideArticle'

/**
 * Guide: trade fair, trade show, exhibition or expo (content plan #9,
 * docs/website/KEYWORD_RESEARCH.md: "trade fair vs trade show", "trade fair
 * vs exhibition"). Definitions from German law, AUMA and UFI
 * (docs/website/GUIDE_FACTS.md). Dictionaries blocked our reader, so the page
 * quotes none.
 */
export const TRADE_FAIR_VS_TRADE_SHOW_GUIDE: GuideContent = {
  kind: 'guide',
  path: '/guides/trade-fair-vs-trade-show-vs-exhibition',
  menuLabel: 'Trade fair, trade show or exhibition?',
  summary: 'What each word means, where the difference matters, and which to use.',
  title: 'Trade fair, trade show, exhibition or expo: what is the difference?',
  metaTitle: `Trade fair vs trade show vs exhibition vs expo: the difference · ${P}`,
  metaDescription:
    'Trade fair, trade show, exhibition and expo mostly mean the same thing in English. Where the difference matters, such as German law, and which word to use for your event.',
  intro:
    'In everyday English, trade fair, trade show, exhibition and expo mean the same kind of event: many companies showing their products and services in one place for a few days. Americans mostly say trade show; in Europe, trade fair and exhibition are just as common. The difference only matters where a law or a contract defines the words, as German law does.',
  image: {
    src: fairVsShowPhoto,
    alt: 'A busy exhibition hall seen from a balcony: rows of stands, visitors with lanyards in the aisles and banners under the roof.',
  },
  published: '2026-10-26',
  updated: '2026-10-26',
  sections: [
    {
      id: 'same-thing',
      title: 'In everyday use, they mean the same thing',
      blocks: [
        {
          kind: 'p',
          text: 'UFI, the global association of the exhibition industry, traces "exhibition" back to 1649 and the Latin "expositio", meaning displaying or putting on a show, and says plainly that in everyday speech the words are used in the same way.',
        },
        {
          kind: 'list',
          items: [
            'Trade show: what most people say in the United States.',
            'Trade fair: common in the UK and the rest of Europe, and the literal translation of the German "Messe" and the Croatian "sajam".',
            'Exhibition: the broader word. It covers trade events and public ones, and the industry calls itself the exhibition industry.',
            'Expo: short for exposition. Used in event names, often for shows open to the public as well as trade visitors.',
          ],
        },
      ],
    },
    {
      id: 'trade-or-public',
      title: 'The difference that matters: who the visitors are',
      blocks: [
        {
          kind: 'p',
          text: 'The useful split is between events for the trade and events for the public. A trade event is for buyers, resellers and professionals; a public event sells tickets to anyone. Many shows mix the two, with trade-only days followed by public days. Say which one yours is, in its name or right under it, because exhibitors decide whether to book on who will walk past their stand.',
        },
      ],
    },
    {
      id: 'germany',
      title: 'Where the law defines the words: Germany',
      blocks: [
        {
          kind: 'p',
          text: 'German trade law, the Gewerbeordnung, defines both terms. Under section 64, a Messe is a time-limited event, usually repeated at regular intervals, where many exhibitors show the main range of one or more industries and sell mostly by sample to resellers, business users and large buyers. The organiser may let end consumers buy on single days, to a limited extent.',
        },
        {
          kind: 'p',
          text: 'Under section 65, an Ausstellung is a time-limited event where many exhibitors show a representative range of one or more industries or regions, and sell it or inform the public about it to promote sales. AUMA, the association of the German trade fair industry, notes that in practice public shows and Ausstellungen are also called Messen.',
        },
        {
          kind: 'table',
          caption: 'Messe and Ausstellung in German trade law (Gewerbeordnung, sections 64 and 65)',
          head: ['', 'Messe (trade fair)', 'Ausstellung (exhibition)'],
          rows: [
            ['What is shown', 'The main range of one or more industries', 'A representative range of one or more industries or regions'],
            ['Who buys', 'Mostly resellers, business users and large buyers, by sample', 'Sales or information for the public'],
            ['Repeats', 'Usually at regular intervals', 'Not required'],
          ],
        },
      ],
    },
    {
      id: 'which-word',
      title: 'Which word to use for your event',
      blocks: [
        {
          kind: 'list',
          items: [
            'Use the word your exhibitors and visitors search for. In Europe, trade fair and exhibition; for American visitors, trade show.',
            'Add "trade" or "B2B" when the show is for professionals only, so the public does not buy tickets for the wrong event.',
            'Use expo in the name if you like the sound of it, but put "trade fair" or "exhibition" in the page title too: "expo" alone is also the name of software tools and world fairs, and search engines mix them up.',
            'Use the same word on your website, your exhibitor contracts and your badges, so nobody wonders whether two words mean two events.',
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is a trade fair the same as a trade show?',
      answer:
        'Yes. Both mean an event where many companies show their products and services to buyers for a few days. Americans mostly say trade show, while trade fair is just as common in Europe.',
    },
    {
      question: 'What is the difference between a trade fair and an exhibition?',
      answer:
        'In everyday English, very little: exhibition is the broader word and can mean a public show as well as a trade one. German law draws a line: a Messe sells mostly to the trade by sample, an Ausstellung shows a representative range to inform or sell to the public.',
    },
    {
      question: 'What does expo mean?',
      answer:
        'Expo is short for exposition, an older word for an exhibition. Today it appears mostly in event names, for trade shows and for public shows alike.',
    },
  ],
  product: {
    id: 'product',
    title: `${P} for trade fairs, trade shows and exhibitions`,
    blocks: [
      {
        kind: 'p',
        text: `Whatever you call your event, ${P} runs the organiser's side of it: registration forms with approval for each group, press and crew accreditation, QR badges by email, check-in at the door, the floor plan with booth allocation and the exhibitor portal. Book a demo and we will set it up for your show.`,
      },
    ],
  },
  sources: {
    title: 'Sources',
    intro: 'Read on 26 October 2026.',
    items: [
      { link: { href: 'https://www.gesetze-im-internet.de/gewo/__64.html', label: 'Gewerbeordnung, section 64' }, note: 'the legal definition of a Messe' },
      { link: { href: 'https://www.gesetze-im-internet.de/gewo/__65.html', label: 'Gewerbeordnung, section 65' }, note: 'the legal definition of an Ausstellung' },
      { link: { href: 'https://www.auma.de/messelexikon/', label: 'AUMA trade fair glossary' }, note: 'how the terms are used in practice' },
      { link: { href: 'https://www.ufi.org/archive/ufi-online-course/UFI_education.pdf', label: 'UFI education course' }, note: 'the origin of "exhibition" and everyday use' },
    ],
  },
}

import { PRODUCT_NAME } from '@/lib/product'
import pressPhoto from '@/site/photos/press-accreditation-desk.jpg'

import type { GuideContent } from './GuideArticle'

/**
 * Guide: press accreditation for trade shows (content plan #2,
 * docs/website/KEYWORD_RESEARCH.md: "press accreditation" and "media
 * accreditation" are the biggest terms we found in Europe). Draft and notes:
 * docs/website/guides/press-accreditation.md.
 *
 * ★ THE ADVICE IS SOURCED. The rules about proof, freelancers and creators are
 * what large German trade-fair organisers publish; `sources` lists them, read
 * on `updated`. Shown on the page (Daniel, 2026-10-20).
 *
 * ★ THE PRODUCT SECTION CLAIMS ONLY WHAT ACCREDITATION DOES TODAY: an invite
 * link per organisation, the form's fields (name, contact, outlet, days),
 * approve or reject, a QR badge by email, check-in, the record. The guide's
 * advice on deadlines and limits per outlet is for the organiser; the product
 * has neither, and the product section doesn't say it does.
 */
export const PRESS_ACCREDITATION_GUIDE: GuideContent = {
  kind: 'guide',
  path: '/guides/press-accreditation',
  menuLabel: 'Press accreditation for trade shows',
  summary: 'Who qualifies, the proof to ask for, and what to check at the press desk.',
  title: 'Press accreditation for trade shows: who qualifies and what to ask for',
  metaTitle: `Press accreditation for trade shows: who qualifies and what to ask for · ${PRODUCT_NAME}`,
  metaDescription:
    'How trade-show organisers decide who gets a press badge: the proof to ask for, rules for freelancers and creators, and what to check at the desk.',
  intro:
    "Press accreditation is a free badge for people who will report on your show. Journalists apply before the show, your press office checks that they really work in the media, and the approved ones collect a press badge at the door. It keeps the press centre for people who will write about your exhibitors, and it keeps free entry from becoming a back door for visitors who don't want to buy a ticket.",
  image: {
    src: pressPhoto,
    alt: 'At the press desk a staff member hands a badge on a lanyard to a journalist with a camera bag while another waits behind him.',
  },
  published: '2026-10-20',
  updated: '2026-10-20',
  sections: [
    {
      id: 'who-qualifies',
      title: 'Decide who qualifies before you open applications',
      blocks: [
        {
          kind: 'p',
          text: 'Write the rule down first. Every application is easier to judge against a sentence you agreed on in advance than against a feeling on the day. Most trade shows accept these groups:',
        },
        {
          kind: 'list',
          items: [
            'Staff journalists at newspapers, magazines, broadcasters, news agencies and trade publications.',
            'Freelance journalists with an assignment from an outlet for your show.',
            'Photographers and camera crews sent by an outlet.',
            'Online creators whose channel covers your industry, if you want them. Decide this one separately, because the proof is different.',
          ],
        },
        {
          kind: 'p',
          text: "Say no to people who only post privately on social media, to marketing and PR staff of exhibitors (they get exhibitor badges instead), and to anyone who can't show recent work. Large organisers also state plainly that nobody has a right to accreditation. Put that on your press page too.",
        },
      ],
    },
    {
      id: 'proof',
      title: 'What proof to ask for',
      blocks: [
        {
          kind: 'p',
          text: 'A press card on its own is rarely enough. The large German trade-fair organisers, who run some of the busiest press centres in Europe, ask for at least one of these:',
        },
        {
          kind: 'table',
          caption: 'Proof of journalistic work that trade fairs accept',
          head: ['Proof', 'What it shows', 'Usual rule'],
          rows: [
            [
              'Letter of assignment',
              'An editor sent this person to your show',
              "On the outlet's letterhead, signed by an editor, naming your show and this year's dates",
            ],
            ['Bylined articles', 'The person publishes under their own name', '1 or 2 articles from the last 6 months'],
            ['Masthead or imprint', "The person is on the outlet's staff", "A current issue or the outlet's website imprint"],
            ['Picture credits', 'For photographers', 'Published photos credited to them, last 6 months'],
            ['Valid press card', "Membership of a journalists' association", 'Accepted with one of the above, not alone'],
          ],
        },
        {
          kind: 'p',
          text: 'Ask for one proof and accept any of them. Asking for all of them turns your press office into a filing department and puts off the reporters you want most.',
        },
      ],
    },
    {
      id: 'freelancers',
      title: 'Freelancers',
      blocks: [
        {
          kind: 'p',
          text: 'Freelancers are often your best coverage, and also where most bad applications come from. The common rule: the assignment letter must come from the outlet, not from the freelancer. A freelancer who writes their own letter, or who sends a letter from another freelancer, is turned down at several large fairs. Without an assignment, 2 or 3 recent bylined articles on your industry are a fair substitute.',
        },
      ],
    },
    {
      id: 'creators',
      title: 'Online creators and bloggers',
      blocks: [
        {
          kind: 'p',
          text: 'If you accept creators, set the bar in numbers so you can explain a refusal. Rules published by large organisers include:',
        },
        {
          kind: 'list',
          items: [
            'the channel has existed for at least 6 months and posts regularly;',
            "it covers the show's industry, not lifestyle in general;",
            'it has a named publisher or imprint;',
            'it reaches a stated minimum audience, for example 1,000 visitors a month for a blog.',
          ],
        },
        {
          kind: 'p',
          text: 'Some organisers also limit how many people one channel can bring. Write your own numbers, put them on the press page and keep them the same for everyone.',
        },
      ],
    },
    {
      id: 'deadlines',
      title: 'Deadlines and numbers',
      blocks: [
        {
          kind: 'p',
          text: "Close applications a few days before the show, so your press office isn't judging applications while setting up the press centre. If space is short, set a limit per outlet (for example 2 people, or 3 for a camera crew) and say so on the press page.",
        },
      ],
    },
    {
      id: 'at-the-desk',
      title: 'At the desk',
      blocks: [
        {
          kind: 'list',
          items: [
            'Ask for photo ID when the badge is handed over or scanned. The name on the ID must match the badge.',
            'Print "Press" clearly on the badge, so exhibitors know who they are talking to.',
            "Keep a short list of approved outlets at the desk for the journalist whose email didn't arrive.",
          ],
        },
      ],
    },
    {
      id: 'saying-no',
      title: 'When you say no',
      blocks: [
        {
          kind: 'p',
          text: 'Reply. A journalist who hears nothing will ask again on the day, at the desk, in front of a queue. 1 or 2 plain sentences are enough: what was missing, and whether they can apply again with it. For example: "We couldn\'t see recent work published under your name. If you send a link to an article from the last 6 months, we\'ll look again."',
        },
      ],
    },
    {
      id: 'checklist',
      title: 'A checklist for your press page',
      blocks: [
        {
          kind: 'list',
          items: [
            'Who qualifies, in 1 or 2 sentences.',
            'The proof you accept, and that one is enough.',
            'Your rule for freelancers and for creators.',
            'The closing date and any limit per outlet.',
            'What to bring on the day (photo ID).',
            'Where the press centre is and when it opens.',
            'A contact at your press office.',
            'That nobody has a right to accreditation.',
          ],
        },
      ],
    },
  ],
  product: {
    id: 'in-the-product',
    title: `How this works in ${PRODUCT_NAME}`,
    blocks: [
      {
        kind: 'p',
        text: `In ${PRODUCT_NAME}, each outlet gets its own application link, which you send yourself, so nobody applies without an invitation. Journalists give their name, contact details, outlet and the days they are coming. Your press office approves or rejects each person, approved journalists get a QR badge by email, and your desk scans it at the door. The record shows who approved each person and who checked them in.`,
      },
      {
        kind: 'p',
        parts: ['More on the ', { href: '/product/accreditation', label: 'accreditation page' }, '.'],
      },
    ],
  },
  sources: {
    title: 'Sources',
    intro: "The rules above come from trade-fair organisers' published press guidelines, read on 20 October 2026. Each fair's own page has the current version.",
    items: [
      {
        link: {
          href: 'https://go.dmexco.com/hubfs/General/2025/Accreditation_Guidelines_%20DMEXCO2025.pdf',
          label: 'Koelnmesse, DMEXCO 2025 accreditation guidelines',
        },
        note: 'a press card alone is generally not sufficient',
      },
      {
        link: {
          href: 'https://www.messe-stuttgart.de/r-t/en/journalists/accreditation/accreditation-guidelines',
          label: 'Messe Stuttgart accreditation guidelines',
        },
        note: 'a written order from an editorial team, naming the current fair',
      },
      {
        link: {
          href: 'https://transportlogistic.de/en/trade-fair/press/accreditation-press-center/',
          label: 'Messe München, transport logistic press accreditation',
        },
        note: 'proof may be checked even with a press pass; bylines, imprints and picture credits from the last 6 months',
      },
      {
        link: { href: 'https://ipm-essen.de/press/accreditation', label: 'Messe Essen, IPM press accreditation' },
        note: 'no accreditation on a commission from a freelancer or for private social accounts; criteria for creators; no automatic right',
      },
      {
        link: { href: 'https://dmea.de/en/press/media-registration', label: 'Messe Berlin, DMEA media registration' },
        note: 'blogs at least 6 months old with regular posts and at least 1,000 visitors a month',
      },
      {
        link: { href: 'https://www.gastmesse.at/en/press/accredtitation/', label: 'Gast (Salzburg) press accreditation' },
        note: 'no accreditation on an assignment from a freelance journalist',
      },
    ],
  },
}

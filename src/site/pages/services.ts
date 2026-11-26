import { PRODUCT_NAME as P } from '@/lib/product'
import badgeHandoff from '@/site/photos/registration-desk-badge-handoff.jpg'
import buildUp from '@/site/photos/exhibition-build-up-carpet-crew.jpg'
import migration from '@/site/photos/organisers-with-old-binders-and-spreadsheet.jpg'
import onboarding from '@/site/photos/organisers-reviewing-form-together.jpg'
import support from '@/site/photos/organiser-on-phone-during-build-up.jpg'

import sOnboarding1 from '@/site/photos/colleagues-working-through-laptop.jpg'
import sOnboarding2 from '@/site/photos/software-training-session.jpg'
import sMigration1 from '@/site/photos/office-ring-binder-archive.jpg'
import sMigration2 from '@/site/photos/reading-printed-spreadsheet.jpg'
import sOnsite1 from '@/site/photos/event-staff-welcoming-guests.jpg'
import sOnsite2 from '@/site/photos/event-sound-desk-technician.jpg'
import sSupport1 from '@/site/photos/support-agent-helping-caller.jpg'
import sSupport2 from '@/site/photos/support-agent-with-headset.jpg'
import type { MarketingPageContent } from './types'

/** The service pages (/services/<slug>): what we do for organisers around the software. Whole offer (E-39). */

const product = (slug: string) => `/product/${slug}`

export const SERVICE_PAGES: readonly MarketingPageContent[] = [
  {
    slug: 'onboarding',
    menuLabel: 'Onboarding and setup',
    menuLine: 'We set up your first edition with you.',
    photo: { src: onboarding, alt: 'Two organisers at a table go through a printed form together, with a laptop and a coffee beside them.' },
    meta: { title: `Onboarding and setup for event organisers · ${P}`, description: 'We set up your first edition with you: forms, price list, floor plan, emails and your team\'s accounts.' },
    hero: { title: 'Your first edition, set up with you.', lead: 'Forms, price list, floor plan, emails and your team\'s accounts, set up together, so your first show runs on a system you already know.' },
    gallery: [{ src: sOnboarding1, alt: 'Two colleagues work through a laptop together, one pointing at the screen.' }, { src: sOnboarding2, alt: 'A trainer walks a team through software on a large screen in a bright meeting room.' }],
    galleryLayout: 'stripFlip',
    sections: [
      {
        title: 'What we set up',
        items: [
          { title: 'Your event and pages', line: 'Your brand, your address and a page per group.' },
          { title: 'Forms and prices', line: 'Registration forms, your questions and your price list.' },
          { title: 'Your hall', line: 'Your floor plan drawn, with every booth coded.' },
          { title: 'Emails', line: 'Confirmations, badges and reminders in your words.' },
          { title: 'Your team', line: 'Accounts for everyone, and a session to walk through the system.' },
        ],
      },
    ],
  },
  {
    slug: 'migration',
    menuLabel: 'Moving from spreadsheets',
    menuLine: 'We import your exhibitors, contacts and history.',
    photo: { src: migration, alt: 'Two organisers share a laugh at a desk beside a stack of old binders and a printed spreadsheet.' },
    meta: { title: `Move your event from spreadsheets · ${P}`, description: 'We import your exhibitors, contacts and past editions from spreadsheets and other tools, so you start with your history.' },
    hero: { title: 'Bring your spreadsheets. Leave with one system.', lead: 'We import your exhibitors, contacts and past editions from spreadsheets and the tools you use today, so you start with your history.' },
    gallery: [{ src: sMigration1, alt: 'A woman pulls a ring binder from a wall of old files.' }, { src: sMigration2, alt: 'Someone reads down a printed spreadsheet, close up on the page.' }],
    galleryLayout: 'beside',
    sections: [
      {
        title: 'What we move',
        items: [
          { title: 'Exhibitors and sponsors', line: 'Companies, contacts and what they bought in past editions.' },
          { title: 'Contacts and consent', line: 'Your mailing lists, with who agreed to what and who opted out.' },
          { title: 'Your floor plan', line: 'From a PDF or a drawing to a plan with every booth coded.' },
          { title: 'Duplicates cleaned', line: 'The same company entered three ways becomes one record.' },
        ],
      },
    ],
  },
  {
    slug: 'on-site',
    menuLabel: 'On-site check-in',
    menuLine: 'Hardware, set-up and crew for your doors.',
    photo: { src: badgeHandoff, alt: 'A member of staff at a trade-show registration desk hands a badge to a visitor.' },
    meta: { title: `On-site check-in service and hardware rental · ${P}`, description: 'Scanners, badge printers and crew for your entrances, set up and tested before the doors open.' },
    hero: { title: 'Your doors, run with you.', lead: 'We bring the scanners and badge printers, set up the desk, test it with real badges and stay for the morning rush.' },
    gallery: [{ src: sOnsite1, alt: 'Event staff welcome guests as they arrive in a conference room.' }, { src: sOnsite2, alt: 'A technician runs the sound desk at an outdoor event at dusk, the crowd in front of him.' }],
    galleryLayout: 'strip',
    sections: [
      {
        title: 'What it includes',
        items: [
          { title: 'Hardware rental', line: 'Scanners, badge printers, cards and lanyards for the show.' },
          { title: 'Set-up and test', line: 'Everything working the day before the doors open.' },
          { title: 'Crew at the desk', line: 'Our people with yours, for the first morning or the whole show.' },
          { title: 'Collected after', line: 'We take it all away when the show closes.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [product('badges-check-in'), product('on-site-hardware')] },
  },
  {
    slug: 'show-week-support',
    menuLabel: 'Show-week support',
    menuLine: 'Someone who answers, evenings and weekend included.',
    photo: { src: support, alt: 'During build-up, an organiser on the phone takes notes on a clipboard in an aisle while exhibitors unpack their stands.' },
    meta: { title: `Show-week support for event organisers · ${P}`, description: 'Support for the week of your show, evenings and weekend included, from people who know your set-up.' },
    hero: { title: 'Someone who answers in show week.', lead: 'Shows don\'t keep office hours. In the week of your show you get support in the evenings and at the weekend, from people who know your set-up.' },
    gallery: [{ src: sSupport1, alt: 'A support agent with a headset helps a caller while a colleague looks over her shoulder.' }, { src: sSupport2, alt: 'A support agent with a headset types at her desk.' }],
    galleryLayout: 'banner',
    sections: [
      {
        title: 'What it includes',
        items: [
          { title: 'Evenings and weekend', line: 'Support from build-up to the last day, outside office hours.' },
          { title: 'People who know your show', line: 'The team who set up your edition answers your questions.' },
          { title: 'A direct line', line: 'A phone number and a chat for show week, not a ticket queue.' },
        ],
        figure: { src: buildUp, alt: 'Crew lay carpet in an aisle during build-up while two people check a list on a clipboard beside a stand.' },
      },
    ],
  },
]

export const servicePage = (slug: string): MarketingPageContent | undefined =>
  SERVICE_PAGES.find((page) => page.slug === slug)

import { PRODUCT_NAME as P } from '@/lib/product'
import hallAbove from '@/site/photos/exhibition-hall-from-above.jpg'
import hallBusy from '@/site/photos/busy-trade-show-hall.jpg'
import associations from '@/site/photos/congress-registration-desk.jpg'
import defence from '@/site/photos/defence-show-accreditation-desk.jpg'
import venues from '@/site/photos/venue-build-up-hall-plan.jpg'
import conference from '@/site/photos/conference-expo-floor-and-stage.jpg'

import sTradefairs1 from '@/site/photos/modern-exhibition-hall-stands.jpg'
import sTradefairs2 from '@/site/photos/exhibition-centre-entrance-visitors.jpg'
import sConferences1 from '@/site/photos/conference-panel-speaker.jpg'
import sConferences2 from '@/site/photos/conference-audience.jpg'
import sDefence1 from '@/site/photos/event-entrance-metal-detectors.jpg'
import sDefence2 from '@/site/photos/event-security-officer.jpg'
import sAssociations1 from '@/site/photos/congress-lecture-hall-audience.jpg'
import sAssociations2 from '@/site/photos/congress-hall-dome.jpg'
import sAgencies1 from '@/site/photos/agency-team-planning-floor-plan.jpg'
import sAgencies2 from '@/site/photos/event-planners-checklist.jpg'
import sVenues1 from '@/site/photos/convention-centre-aerial-view.jpg'
import sVenues2 from '@/site/photos/empty-exhibition-hall.jpg'
import type { MarketingPageContent } from './types'

/** The solution pages (/solutions/<slug>): by event type, and for partners. Whole product, built and planned (E-39). */

const product = (slug: string) => `/product/${slug}`

export const SOLUTION_PAGES: readonly MarketingPageContent[] = [
  {
    slug: 'trade-fairs',
    menuLabel: 'Trade fairs and expos',
    menuLine: 'Small fairs and big shows, on one hall plan and one list.',
    photo: { src: hallAbove, alt: 'A busy exhibition hall seen from above, with booths, aisles and visitors.' },
    meta: { title: `Trade fair and expo management software · ${P}`, description: 'Booth sales, the exhibitor portal, registration, badges and on-site check-in for trade fair and expo organisers, in one system.' },
    hero: { title: 'For organisers who sell the floor.', lead: 'From a 40-stand regional fair to a 300-stand expo, a trade fair lives on booth sales and exhibitors. Everything else (visitors, press, crew, the doors) depends on getting those right.' },
    gallery: [{ src: sTradefairs1, alt: 'A modern exhibition hall with rows of white stands and visitors, seen from the gallery above.' }, { src: sTradefairs2, alt: 'Visitors stream up the steps to the entrance of a large exhibition centre on a sunny day.' }],
    galleryLayout: 'strip',
    sections: [
      {
        title: 'The jobs a trade fair runs on',
        items: [
          { title: 'Sell the floor', line: 'Exhibitor and sponsor sales in one list, and a floor plan that shows what is left.' },
          { title: 'Look after exhibitors', line: 'Orders, stand designs, graphics, hotels and questions in one portal.' },
          { title: 'Fill the hall', line: 'Visitor registration, campaigns and a landing page per audience.' },
          { title: 'Run the doors', line: 'QR badges for everyone, our scanners and printers, a desk built for queues.' },
          { title: 'Prove the value', line: 'Visitor contacts for exhibitors and a report for sponsors.' },
          { title: 'Rebook', line: 'Next year\'s sales start with this year\'s exhibitors and their history.' },
          { title: 'Regional and consumer fairs', line: 'Home and garden shows, wedding fairs and regional trade fairs run on the same jobs as a national expo.' },
        ],
      },
    ],
    connects: { title: 'Start with', hrefs: [product('exhibitor-portal'), product('floor-plan'), product('badges-check-in')] },
  },
  {
    slug: 'conferences',
    menuLabel: 'Conferences with an expo floor',
    menuLine: 'Delegates, speakers, sponsors and the stands around them.',
    photo: { src: conference, alt: 'People talk at a stand with a coffee counter on a conference floor, while an audience listens to a panel on the stage behind them.' },
    meta: { title: `Conference software with exhibition and sponsor management · ${P}`, description: 'Delegate registration, speakers and abstracts, sponsors and the exhibition floor of a conference, in one system.' },
    hero: { title: 'For conferences with an exhibition around them.', lead: 'Delegates, speakers and sponsors in one list, and the stands in the foyer handled like a small trade fair.' },
    gallery: [{ src: sConferences1, alt: 'A speaker with a microphone talks from the stage while three panellists listen.' }, { src: sConferences2, alt: 'Delegates laugh during a talk in a full conference audience.' }],
    galleryLayout: 'banner',
    sections: [
      {
        title: 'What it covers',
        items: [
          { title: 'Delegate registration', line: 'Paid and free tickets, packages and one-click approval.' },
          { title: 'Speakers and abstracts', line: 'Talk details and speaker materials collected by the deadline.' },
          { title: 'Sponsors', line: 'Packages, logos and deliverables, tracked per sponsor.' },
          { title: 'The exhibition', line: 'Stands on the plan and exhibitor orders through the portal.' },
          { title: 'Badges and check-in', line: 'One badge per person, scanned at the door.' },
        ],
        figure: { video: 'a-expo-floor' },
      },
    ],
    connects: { title: 'Start with', hrefs: [product('registration'), product('exhibitor-portal'), product('badges-check-in')] },
  },
  {
    slug: 'defence-security',
    menuLabel: 'Defence and security shows',
    menuLine: 'Accreditation and approval before anyone gets a badge.',
    photo: { src: defence, alt: 'At an accreditation desk, an officer in uniform checks a visitor\'s papers while a colleague looks him up on a laptop.' },
    meta: { title: `Software for defence and security exhibitions · ${P}`, description: 'Accreditation for press, crew and delegations, approval before every badge, and a record of who let whom in, for defence and security shows.' },
    hero: { title: 'For shows where every badge is a decision.', lead: 'Defence and security shows need to know who is in the hall. Everyone applies, your team approves, and only approved people get a badge.' },
    gallery: [{ src: sDefence1, alt: 'A security officer watches visitors pass through metal detectors at an event entrance.' }, { src: sDefence2, alt: 'A security officer in a black shirt watches the floor at an indoor event.' }],
    galleryLayout: 'stripFlip',
    sections: [
      {
        title: 'What it covers',
        items: [
          { title: 'Accreditation', line: 'Press, crew, speakers and delegations apply through their own link.' },
          { title: 'Approval before the badge', line: 'Nobody gets a badge until someone on your team approves them.' },
          { title: 'A record of every decision', line: 'Who approved whom, who sent the link and who checked them in.' },
          { title: 'Revoke at once', line: 'A revoked badge stops working at the next scan.' },
          { title: 'Data in the EU', line: 'Your attendees\' data stays in the European Union.' },
        ],
      },
    ],
    connects: { title: 'Start with', hrefs: ['/product/accreditation', product('badges-check-in')] },
  },
  {
    slug: 'associations',
    menuLabel: 'Association congresses',
    menuLine: 'Members, delegates and the industry partners who sponsor them.',
    photo: { src: associations, alt: 'At a congress registration desk in a glass foyer, a delegate shakes hands with a member of staff as others arrive.' },
    meta: { title: `Congress software for associations · ${P}`, description: 'Member and delegate registration, sponsors and the industry exhibition of an association congress, in one system.' },
    hero: { title: 'For associations with a yearly congress.', lead: 'Members register, partners sponsor and exhibit, and the same people come back next year. Keep them in one list across editions.' },
    gallery: [{ src: sAssociations1, alt: 'A speaker walks the floor of a lecture hall in front of a full congress audience.' }, { src: sAssociations2, alt: 'A grand congress hall with a glass dome and rows of seats.' }],
    galleryLayout: 'beside',
    sections: [
      {
        title: 'What it covers',
        items: [
          { title: 'Member and delegate registration', line: 'Different forms and prices for members, non-members and guests.' },
          { title: 'Industry partners', line: 'Sponsorship packages and exhibition stands in one place.' },
          { title: 'Abstracts', line: 'Talk proposals and speaker materials collected by the deadline.' },
          { title: 'Year after year', line: 'Every member and partner keeps their history across editions.' },
        ],
      },
    ],
    connects: { title: 'Start with', hrefs: [product('registration'), product('crm')] },
  },
  {
    slug: 'agencies',
    menuLabel: 'Event agencies',
    menuLine: 'Run your clients\' shows on one system, in their brand.',
    photo: { src: hallBusy, alt: 'A busy trade-show hall, with visitors talking at the stands.' },
    meta: { title: `Event software for agencies and PCOs · ${P}`, description: 'Run your clients\' expos and congresses on one system, each in the client\'s brand, with partner terms for agencies.' },
    hero: { title: 'For agencies running clients\' shows.', lead: 'Run every client\'s show on one system, each in the client\'s brand, and keep your team\'s way of working from one event to the next.' },
    gallery: [{ src: sAgencies1, alt: 'An agency team leans over a floor plan on a table with tablets and phones.' }, { src: sAgencies2, alt: 'Two event planners go through a checklist in a conference room set up for the day.' }],
    galleryLayout: 'strip',
    sections: [
      {
        title: 'What partners get',
        items: [
          { title: 'Your clients\' brands', line: 'Each event on the client\'s address, with their logo and colours.' },
          { title: 'One team account', line: 'Your staff work across every client event they are assigned to.' },
          { title: 'Partner terms', line: 'A margin on every licence you sell, with published terms.' },
          { title: 'We bring the hardware', line: 'Scanners and printers for your clients\' show days.' },
        ],
      },
    ],
    closing: { title: 'Talk to us about partnering', line: 'Book a call and tell us about the shows you run for your clients.' },
  },
  {
    slug: 'venues',
    menuLabel: 'Venues',
    menuLine: 'Offer organisers a system that already knows your halls.',
    photo: { src: venues, alt: 'Two people with lanyards walk through an exhibition hall during build-up, reading a printed hall plan.' },
    meta: { title: `Event software for exhibition venues · ${P}`, description: 'Offer the organisers who rent your halls a system with your floor plans, services catalogue and check-in hardware already set up.' },
    hero: { title: 'For venues that rent their halls.', lead: 'Your halls, your services and your hardware, set up once, and offered to every organiser who books with you.' },
    gallery: [{ src: sVenues1, alt: 'A convention centre seen from the air, with the city and the river behind it.' }, { src: sVenues2, alt: 'An empty exhibition hall with a polished floor and glass walls, ready for its next show.' }],
    galleryLayout: 'banner',
    sections: [
      {
        title: 'What venues get',
        items: [
          { title: 'Your halls on the plan', line: 'Hall drawings set up once and reused by every organiser.' },
          { title: 'Your services catalogue', line: 'Power, furniture and AV that exhibitors order straight from you.' },
          { title: 'Check-in hardware', line: 'Scanners and printers that stay at the venue between shows.' },
        ],
      },
    ],
    closing: { title: 'Talk to us about your venue', line: 'Book a call and tell us about your halls and the shows you host.' },
  },
]

export const solutionPage = (slug: string): MarketingPageContent | undefined =>
  SOLUTION_PAGES.find((page) => page.slug === slug)

import { PRODUCT_NAME as P } from '@/lib/product'
import { FOUNDER } from '@/site/founder'
import { DEMO_EMAIL, SECURITY_EMAIL } from '@/site/links'
import hallAbove from '@/site/photos/exhibition-hall-from-above.jpg'
import reports from '@/site/photos/organisers-reviewing-results-after-show.jpg'
import badges from '@/site/photos/qr-badges-on-lanyards.jpg'
import contact from '@/site/photos/phone-call-outside-exhibition-centre.jpg'

import sSecurity1 from '@/site/photos/data-centre-server-racks.jpg'
import sSecurity2 from '@/site/photos/server-rack-cabling.jpg'
import sContact1 from '@/site/photos/woman-on-phone-call.jpg'
import sContact2 from '@/site/photos/man-taking-notes-on-phone-call.jpg'
import sCareers1 from '@/site/photos/software-team-at-screen.jpg'
import sCareers2 from '@/site/photos/small-team-loft-office.jpg'
import sCustomer1 from '@/site/photos/event-security-yellow-vest.jpg'
import sCustomer2 from '@/site/photos/security-staff-at-doorway.jpg'
import type { MarketingPageContent } from './types'

/**
 * The company and trust pages that use the shared template: Security, Contact,
 * Careers and the first customer story. Static routes, one file each.
 *
 * ★ FACTS ONLY. Security says what the platform does today and claims no
 * certification (E-39 keeps that ban). Careers lists no invented roles
 * (Daniel: open application). The customer story says what ran on the platform
 * Evemos grew from, with no numbers until the client gives them.
 */

export const SECURITY_PAGE: MarketingPageContent = {
  slug: 'security',
  menuLabel: 'Security and trust',
  menuLine: 'Where your data lives and how we look after it.',
  meta: { title: `Security and data protection · ${P}`, description: `Where ${P} keeps your data, how it is backed up, and how consent and opt-outs are recorded.` },
  hero: { title: 'Your attendees\' data, looked after.', lead: 'Organisers trust us with the names, emails and badges of everyone at their show. This is how we look after them.' },
  gallery: [{ src: sSecurity1, alt: 'A row of server racks in a quiet, clean data centre.' }, { src: sSecurity2, alt: 'Server racks and their cabling, seen close up.' }],
  galleryLayout: 'stripFlip',
  photo: { src: badges, alt: 'Five QR badges on violet and yellow lanyards, fanned out on a table before the doors open.' },
  sections: [
    {
      title: 'Where your data lives',
      items: [
        { title: 'In the EU', line: 'Your data is stored and processed in the European Union.' },
        // No test restore is logged yet (#162): say the backups are tested once RESTORE.md records one.
        { title: 'Nightly encrypted backups', line: 'Every night, encrypted and kept off the main server.' },
        { title: 'Your organisation only', line: 'Each organiser sees only their own events, people and companies.' },
      ],
    },
    {
      title: 'Consent and privacy',
      items: [
        { title: 'Consent you can prove', line: 'Every form records the exact terms and privacy notice the person accepted, with the version.' },
        { title: 'Opt-outs that hold', line: 'An unsubscribe is permanent and enforced by the database, in every campaign and edition.' },
        { title: 'A data protection agreement', line: 'Our terms include the data protection agreement the GDPR asks for.' },
      ],
    },
    {
      title: 'Protecting your forms',
      items: [
        { title: 'Spam protection', line: 'Public forms block bots and spam on their own.' },
        { title: 'Revocable badges', line: 'A revoked badge stops working at the next scan.' },
        { title: 'A record of decisions', line: 'Who approved each person and who checked them in, kept on the record.' },
      ],
    },
    // security.txt's Policy (F-143b): no reply time, no bounty and no legal promise.
    {
      title: 'Found a security problem?',
      items: [
        { title: 'Write to us', line: `Email ${SECURITY_EMAIL} with what you found and the steps to see it again.` },
        { title: 'Test on your own account', line: 'Use only accounts and data that are your own.' },
        { title: 'We reply', line: 'We read every report and reply to it.' },
      ],
    },
  ],
  closing: { title: 'Questions about data protection?', line: 'Book a call and we will answer your questions, or your lawyer\'s.' },
}

export const CONTACT_PAGE: MarketingPageContent = {
  slug: 'contact',
  menuLabel: 'Contact',
  menuLine: 'Talk to us about your show.',
  photo: { src: contact, alt: 'A man with a lanyard takes a phone call outside the entrance of an exhibition centre as visitors walk in.' },
  meta: { title: `Contact · ${P}`, description: `Book a demo, ask about partnering, or write to the ${P} team.` },
  hero: { title: 'Talk to us about your show.', lead: `The fastest way is a demo: send us your hall plan and exhibitor list, and we'll show your next edition in ${P}.` },
  gallery: [{ src: sContact1, alt: 'A woman smiles as she talks on her phone in a bright office.' }, { src: sContact2, alt: 'A man takes notes at his laptop during a phone call.' }],
  galleryLayout: 'beside',
  sections: [
    {
      title: 'How to reach us',
      items: [
        { title: 'Book a demo', line: 'Tell us about your show and pick a time. We reply to every request.' },
        { title: 'Email', line: `Write to ${DEMO_EMAIL} about anything else.` },
        { title: 'Partnerships', line: 'Event agencies and venues: book a call and tell us about the shows you run.' },
      ],
    },
  ],
}

export const CAREERS_PAGE: MarketingPageContent = {
  slug: 'careers',
  menuLabel: 'Careers',
  menuLine: 'Build software for the people who run the show.',
  meta: { title: `Careers · ${P}`, description: `Work on ${P}, software for expo and trade-fair organisers. Open applications welcome.` },
  hero: { title: 'Build software for the people who run the show.', lead: `${P} is a small team. We don't list open roles yet, but we read every application.` },
  gallery: [{ src: sCareers1, alt: 'Four colleagues crowd round a screen as one points out a detail.' }, { src: sCareers2, alt: 'A small team works at a long table in a bright loft office, laptops and papers in front of them.' }],
  galleryLayout: 'strip',
  photo: { src: reports, alt: 'Three people work at a laptop at a table in an exhibition hall at dusk, after the visitors have gone.' },
  sections: [
    {
      title: 'Who we would like to hear from',
      items: [
        { title: 'People from the show floor', line: 'You have organised, sold or run an expo, a congress or a trade fair.' },
        { title: 'People who build software', line: 'You write the code, design the screens or keep the servers running.' },
        { title: 'People who sell to organisers', line: 'You know the organisers in your country and what keeps them up at night.' },
      ],
    },
  ],
  closing: { title: 'Write to us', line: `Send a few lines about yourself and the shows or software you have worked on to ${DEMO_EMAIL}.` },
}

export const CUSTOMER_STORY: MarketingPageContent = {
  slug: FOUNDER.show.toLowerCase(),
  menuLabel: `${FOUNDER.show}`,
  menuLine: 'The show the platform was first built for.',
  photo: { src: hallAbove, alt: 'A busy exhibition hall seen from above, with booths, aisles and visitors.' },
  meta: { title: `${FOUNDER.show}: the show ${P} was first built for · ${P}`, description: `How ${FOUNDER.show}, ${FOUNDER.showKind}, ran its registrations, accreditation, floor plan and badges on the platform ${P} grew from.` },
  hero: { title: `${FOUNDER.show}: the show it was first built for.`, lead: `${FOUNDER.show} is ${FOUNDER.showKind}. Its registrations, accreditation, floor plan and badges ran on the platform ${P} grew from.` },
  gallery: [{ src: sCustomer1, alt: 'A security officer in a yellow vest watches visitors arrive at an outdoor event.' }, { src: sCustomer2, alt: 'Two security staff in suits stand watch at a doorway, in black and white.' }],
  galleryLayout: 'banner',
  sections: [
    {
      title: 'What the show needed',
      items: [
        { title: 'Exhibitors and visitors', line: 'Registration forms for each group, approved by the organiser\'s team.' },
        { title: 'Press and delegations', line: 'Accreditation through invitation links, with approval before every badge.' },
        { title: 'A hall plan visitors could use', line: 'A public floor plan with the exhibitor list.' },
        { title: 'Badges without a print queue', line: 'QR badges by email for everyone approved, digital first.' },
      ],
    },
    {
      title: 'What came out of it',
      items: [
        { title: 'One list', line: 'Every exhibitor, visitor and journalist in one place, instead of a spreadsheet per team.' },
        { title: 'A platform for other organisers', line: `What worked for ${FOUNDER.show} became ${P}, built for any organiser who runs a show.` },
      ],
    },
  ],
}

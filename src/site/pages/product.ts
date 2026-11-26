import { PRODUCT_NAME as P } from '@/lib/product'
import booth from '@/site/photos/exhibition-stand-render.png'
import shotPublicFloorPlan from '@/site/photos/public-floor-plan-page-screenshot.jpg'
import shotExhibitors from '@/site/photos/exhibitor-list-screenshot.jpg'
import shotVisitors from '@/site/photos/visitor-registrations-screenshot.jpg'
import shotCheckInDesk from '@/site/photos/badge-check-in-screenshot.jpg'
import shotInvoices from '@/site/photos/exhibitor-invoices-screenshot.jpg'
import hallBusy from '@/site/photos/busy-trade-show-hall.jpg'
import crm from '@/site/photos/exhibitor-talking-to-visitor-at-stand.jpg'
import email from '@/site/photos/organisers-working-on-laptops.jpg'
import hardware from '@/site/photos/check-in-desk-badge-scanning.jpg'
import invoicing from '@/site/photos/organiser-and-exhibitor-reviewing-document.jpg'
import registration from '@/site/photos/registration-desk-visitor-badges.jpg'
import reports from '@/site/photos/organisers-reviewing-results-after-show.jpg'
import serviceOrders from '@/site/photos/exhibitor-stand-build-up-technician.jpg'
import websites from '@/site/photos/visitor-checking-phone-at-exhibition-entrance.jpg'
import badges from '@/site/photos/qr-badges-on-lanyards.jpg'
import checkinKiosk from '@/site/photos/self-service-check-in-kiosk.jpg'
import kit from '@/site/photos/badge-printer-scanner-and-lanyard.jpg'

import sCrm1 from '@/site/photos/trade-fair-handshake-deal.jpg'
import sCrm2 from '@/site/photos/sales-handshake-showroom-office.jpg'
import sEmail1 from '@/site/photos/writing-email-on-laptop.jpg'
import sEmail2 from '@/site/photos/reading-email-on-phone.jpg'
import sRegistration1 from '@/site/photos/registration-table-setup.jpg'
import sRegistration2 from '@/site/photos/visitor-signing-registration-form.jpg'
import sWebsites1 from '@/site/photos/designing-event-website.jpg'
import sWebsites2 from '@/site/photos/browsing-event-website-on-laptop.jpg'
import sInvoicing1 from '@/site/photos/filling-in-invoice.jpg'
import sInvoicing2 from '@/site/photos/card-payment-terminal.jpg'
import sPortal1 from '@/site/photos/exhibitors-at-their-stands.jpg'
import sPortal2 from '@/site/photos/exhibitor-setting-up-stand-during-build-up.jpg'
import sOrders1 from '@/site/photos/event-chairs-set-out.jpg'
import sOrders2 from '@/site/photos/event-sound-equipment.jpg'
import sFloorplan1 from '@/site/photos/pointing-at-printed-floor-plan.jpg'
import sFloorplan2 from '@/site/photos/floor-plan-on-whiteboard.jpg'
import sBadges1 from '@/site/photos/conference-badges-with-qr-codes.jpg'
import sBadges2 from '@/site/photos/delegates-wearing-badges.jpg'
import sHardware1 from '@/site/photos/portable-badge-printer.jpg'
import sHardware2 from '@/site/photos/qr-code-scanner.jpg'
import sLeads1 from '@/site/photos/scanning-qr-code-with-phone.jpg'
import sLeads2 from '@/site/photos/exhibitor-scanning-visitor-badge-qr-code.jpg'
import sReports1 from '@/site/photos/reviewing-sales-chart.jpg'
import sReports2 from '@/site/photos/comparing-printed-reports.jpg'
import type { MarketingPageContent } from './types'

/**
 * The product pages (/product/<slug>), one per module, grouped by the stage of
 * the organiser's year they belong to. Markets the whole product, built and
 * planned (E-39). Accreditation has its own hand-built page and is listed in
 * the menus from `sitemap.ts`, not here.
 *
 * Pictures: `visual` is a real app screenshot (demo data, said in its alt) or
 * a render beside the hero; pages without one keep their drawn preview
 * (`ProductPreviews.tsx`), and the floor plan and reports pages show the app's
 * own hall and dashboard there (F-192d). `photo` then sits beside the first
 * section.
 */

const href = (slug: string) => `/product/${slug}`

export const PRODUCT_PAGES: readonly MarketingPageContent[] = [
  {
    slug: 'crm',
    menuLabel: 'Exhibitor and sponsor sales',
    menuLine: 'Every exhibitor and sponsor from first call to signed booking.',
    visual: { src: shotExhibitors, alt: `The ${P} exhibitors screen with demo data: 44 companies with their booth, main contact, readiness and balance.` },
    photo: { src: crm, alt: 'An exhibitor at a stand counter talks with a visitor while the trade fair crowd walks past.' },
    meta: { title: `Event CRM and sales pipeline for exhibitors and sponsors · ${P}`, description: 'Track every exhibitor and sponsor from first call to signed booking, with the history of past editions. Built for trade show organisers.' },
    hero: { title: 'Sell your next edition from one list.', lead: 'Every exhibitor and sponsor you talk to, from the first call to the signed booking, with what they bought last year and who you spoke to.' },
    gallery: [{ src: sCrm1, alt: 'Two men shake hands on a deal beside red tractors on show at an outdoor trade fair.' }, { src: sCrm2, alt: 'Two visitors shake hands with a sales manager across his desk in a showroom office.' }],
    galleryLayout: 'strip',
    sections: [
      {
        title: 'What it does',
        items: [
          { title: 'Pipeline by edition', line: 'Contacted, proposal sent, won: every deal for this edition on one board, by stage.' },
          { title: 'Companies and people', line: 'One record per company and per person, across every edition they took part in.' },
          { title: 'History that stays', line: 'Booth size, sponsorship and invoices from past editions, on the company record.' },
          { title: 'Enquiries become leads', line: 'A form on your event page lands as a lead in the pipeline, with nothing retyped.' },
          { title: 'Duplicates caught early', line: 'A company that already exists is found as you type, before it becomes two records.' },
          { title: 'Lead to registration', line: 'A won deal becomes the exhibitor registration with one click.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('email-marketing'), href('registration'), href('invoicing')] },
  },
  {
    slug: 'email-marketing',
    menuLabel: 'Email marketing',
    menuLine: 'Campaigns to prospects, exhibitors and visitors from one list.',
    photo: { src: email, alt: 'Three organisers work on laptops at a table by the hall window, one of them on the phone.' },
    meta: { title: `Email marketing for trade shows and exhibitions · ${P}`, description: 'Send campaigns to prospects, exhibitors and visitors from the same list you sell and register from, with opt-outs that stay opted out.' },
    hero: { title: 'Email from the list you already have.', lead: 'Campaigns to prospects, exhibitors and visitors come from the same records you sell and register from, so nobody exports a spreadsheet to send a newsletter.' },
    gallery: [{ src: sEmail1, alt: 'Someone types an email on a laptop at a desk with a phone, glasses and a cup of tea.' }, { src: sEmail2, alt: 'A woman smiles as she reads a message on her phone, her laptop open beside her.' }],
    galleryLayout: 'banner',
    sections: [
      {
        title: 'What it does',
        items: [
          { title: 'Campaigns by group', line: 'Prospects, this year\'s exhibitors, past visitors or press: pick the group, write the email, send.' },
          { title: 'Automated emails', line: 'Confirmations, badges, reminders and deadlines go out on their own when something happens.' },
          { title: 'Opt-outs that hold', line: 'Someone who unsubscribes stays unsubscribed, in every campaign and every edition.' },
          { title: 'Your brand', line: 'Emails go out with your event\'s name, logo and reply-to address.' },
          { title: 'Consent on record', line: 'Every sign-up records which terms and privacy notice the person agreed to.' },
          { title: 'Results', line: 'Opens, clicks and bounces per campaign, next to the people who received it.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('crm'), href('event-websites'), href('registration')] },
  },
  {
    slug: 'registration',
    menuLabel: 'Registration and ticketing',
    menuLine: 'Forms for every group, approved in one click.',
    visual: { src: shotVisitors, alt: `The ${P} visitors screen with demo data: 529 people on the event, with exhibitor staff waiting for approval at the top.` },
    photo: { src: registration, alt: 'Staff at a registration desk by the hall entrance hand visitors their badges while a colleague checks a tablet.' },
    meta: { title: `Event registration software for exhibitors and visitors · ${P}`, description: 'Registration forms for exhibitors, visitors, sponsors and delegations, with your own questions, one-click approval and QR badges by email.' },
    hero: { title: 'A form for every group at your show.', lead: 'Exhibitors, visitors, sponsors and delegations each get their own form with your questions. Approve a registration and everyone on it gets a badge.' },
    gallery: [{ src: sRegistration1, alt: 'Three women of the organising team get the registration table ready, badges and lanyards laid out.' }, { src: sRegistration2, alt: 'A visitor signs a registration form at a dark desk, close up on her hand and pen.' }],
    galleryLayout: 'stripFlip',
    sections: [
      {
        title: 'What it does',
        items: [
          { title: 'Forms per group', line: 'Your own questions in six field types, on top of the core fields every form needs.' },
          { title: 'One switch', line: 'Draft, open or closed, per form. Registration opens when the event does.' },
          { title: 'A guide to the right form', line: 'Visitors answer a question or two and land on the form meant for them.' },
          { title: 'One-click approval', line: 'Approve a registration and every person on it gets a QR badge by email.' },
          { title: 'Tickets and packages', line: 'Paid tickets and exhibitor packages, priced per edition, with discounts on their own line.' },
          { title: 'Consent you can prove', line: 'Every submission records the exact terms and privacy notice the person accepted.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('event-websites'), href('badges-check-in'), href('invoicing')] },
  },
  {
    slug: 'event-websites',
    menuLabel: 'Event websites',
    menuLine: 'A landing page for every event and group, in your brand.',
    visual: { src: shotPublicFloorPlan, alt: `A public floor plan page made with ${P}, with demo data: each booth shows its exhibitor or says it is available, with its size.` },
    photo: { src: websites, alt: 'A visitor with a lanyard checks his phone, coffee in hand, as he walks into the exhibition centre.' },
    meta: { title: `Event landing pages and websites for organisers · ${P}`, description: 'A landing page for every event and every group, in your brand, on your own address, with registration built in.' },
    hero: { title: 'A page for every event, in your brand.', lead: 'Each event gets its own pages on your own address: one for exhibitors, one for visitors, one for press, each with its registration form built in.' },
    gallery: [{ src: sWebsites1, alt: "Two screens on a designer's desk show a web page being laid out." }, { src: sWebsites2, alt: 'A woman browses a website on a laptop at a table by the window.' }],
    galleryLayout: 'beside',
    sections: [
      {
        title: 'What it does',
        items: [
          { title: 'Your address', line: 'Pages live on your organiser address, or on your own web address, such as register.yourfair.com.' },
          { title: 'Your look', line: 'Your logo, colours and photos. Visitors see your event, not ours.' },
          { title: 'Pages per group', line: 'Exhibitors, visitors, sponsors and press each land on the page written for them.' },
          { title: 'Forms built in', line: 'Registration, enquiry and accreditation forms sit on the page, with spam protection.' },
          { title: 'Public floor plan', line: 'An interactive hall map with the exhibitor list, updated as booths are allocated.' },
          { title: 'Search-friendly', line: 'Each page carries the event details search engines read.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('registration'), href('floor-plan'), href('email-marketing')] },
  },
  {
    slug: 'invoicing',
    menuLabel: 'Invoicing and payments',
    menuLine: 'Price lists, packages, invoices and who has paid.',
    visual: { src: shotInvoices, alt: `The ${P} invoices screen with demo data: totals invoiced, paid, outstanding and overdue, and ten exhibitor invoices with their status.` },
    photo: { src: invoicing, alt: 'An organiser goes through a document with an exhibitor at a small table on the stand.' },
    meta: { title: `Invoicing and payments for exhibitors and sponsors · ${P}`, description: 'Price lists, packages and every exhibitor invoice next to its booth, with who has paid, who is late and when each invoice is due, for trade show organisers.' },
    hero: { title: 'Every invoice next to its booth.', lead: 'Booths, add-ons, sponsorships and tickets on one price list. You make the invoice in your own invoicing software and record it on the registration it belongs to, so the booth, the invoice and the payment sit together.' },
    gallery: [{ src: sInvoicing1, alt: 'Someone fills in an invoice on a clipboard with a blue pen.' }, { src: sInvoicing2, alt: 'A hand holds a card to a payment terminal on an orange table.' }],
    galleryLayout: 'strip',
    sections: [
      {
        title: 'What it does',
        items: [
          { title: 'One price list', line: 'Booths, add-ons, sponsorships and tickets, priced per edition, in euro or dollars.' },
          { title: 'Packages', line: 'A package fills in the lines it includes, and every line stays editable.' },
          { title: 'Your invoices, recorded', line: 'Make the invoice in your own software, then add its number, date and PDF to the exhibitor’s registration.' },
          { title: 'Paid at a glance', line: 'Who has paid, who is late and who still owes, with who marked it and when. Due dates show on your dashboard calendar.' },
          { title: 'Card payments: coming', line: 'Exhibitors and visitors will pay by card online. Until then, you mark each payment when it reaches your account.' },
          { title: 'E-invoicing: coming', line: 'EU e-invoice formats, including eRačun and Fiskalizacija for Croatia. Until then, your own invoicing software handles them.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('crm'), href('service-orders'), href('reports')] },
  },
  {
    slug: 'exhibitor-portal',
    menuLabel: 'Exhibitor portal',
    menuLine: 'One place for everything exhibitors send you.',
    photo: { src: booth, alt: 'An exhibition stand with violet walls, a reception counter and a meeting area.' },
    meta: { title: `Exhibitor portal for trade shows and exhibitions · ${P}`, description: 'One place for exhibitors to order services, upload booth plans and graphics, hand in abstracts, book hotels and ask for help, with a deadline and a status on every request.' },
    hero: { title: 'Exhibitor requests, out of your inbox.', lead: 'Everything your exhibitors ask you for. Orders, stand designs, graphics, talk details, hotels and questions arrive in one portal, each with a deadline, an owner and a status.' },
    gallery: [{ src: sPortal1, alt: 'Exhibitors work at the tables of their stands in an exhibition hall lit by stand lights.' }, { src: sPortal2, alt: 'During build-up, an exhibitor sets out samples and brochures on his stand counter while a colleague hangs the stand graphic.' }],
    galleryLayout: 'banner',
    sections: [
      {
        title: "An exhibitor's year, start to finish",
        items: [
          { title: 'Sell', line: 'They pick a booth on the floor plan and book it.' },
          { title: 'Onboard', line: 'A sign-in link by email, then they register their stand team.' },
          { title: 'Build-up', line: 'Stand design approved, and furniture, power and AV delivered to their booth.' },
          { title: 'Show day', line: "Their team's badges are scanned at the door." },
          { title: 'Invoice', line: 'One invoice with the booth and every order on it.' },
          { title: 'Rebook', line: "Next year's sales start with them and their history." },
        ],
      },
      {
        title: 'What exhibitors do in the portal',
        lead: 'They sign in with a one-time link by email. No password to forget.',
        items: [
          { title: 'Order services', line: 'Furniture, power, internet, AV and extra badges, ordered and paid in one place.' },
          { title: 'Get the stand design approved', line: 'Upload the stand plan, see your comments, upload the next version.' },
          { title: 'Send graphics to print', line: 'Upload files once, see them checked, and know when they are printed.' },
          { title: 'Send talk details', line: 'Talk descriptions and speaker materials, collected by the deadline.' },
          { title: 'Travel and accommodation', line: 'Hotel blocks, venue directions, delivery times and arrival details.' },
          { title: 'Register the stand team', line: 'Names for every person on the stand, ready for their badges.' },
        ],
      },
      {
        title: 'What your team sees',
        items: [
          { title: 'Requests, not emails', line: 'Every question becomes a request with an owner and a status.' },
          { title: 'Deadlines that chase themselves', line: 'Reminders go out before a deadline, and late orders get the late fee you set.' },
          { title: 'Who is late', line: 'One list of missing plans, unpaid orders and open questions, by exhibitor.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('service-orders'), href('floor-plan'), href('invoicing')] },
  },
  {
    slug: 'service-orders',
    menuLabel: 'Service orders',
    menuLine: 'Furniture, power, AV and extras, ordered and paid online.',
    photo: { src: serviceOrders, alt: 'During build-up, an exhibitor points at the screen on the stand wall while a technician waits nearby.' },
    meta: { title: `Exhibitor service orders: furniture, power, AV · ${P}`, description: 'A catalogue of exhibitor services with prices and deadlines: furniture, power, internet, AV, cleaning and extra badges, ordered and paid online.' },
    hero: { title: 'A services shop for your exhibitors.', lead: 'Furniture, power, internet, AV and extras, with prices and deadlines. Orders arrive paid and sorted by booth, ready for your suppliers.' },
    gallery: [{ src: sOrders1, alt: 'Blue chairs set out on a parquet floor, ready for an event.' }, { src: sOrders2, alt: 'A technician works at a sound desk with wireless microphones in a case beside him.' }],
    galleryLayout: 'stripFlip',
    sections: [
      {
        title: 'What it does',
        items: [
          { title: 'Your catalogue', line: 'Your services, your prices, your photos, per edition.' },
          { title: 'Deadlines and late fees', line: 'Early prices before a date, a late fee after it, applied on their own.' },
          { title: 'Paid when ordered', line: 'Card payment at checkout, or an invoice for exhibitors who need one.' },
          { title: 'Orders by booth', line: 'Every order carries the booth code, so the build-up crew knows where it goes.' },
          { title: 'Supplier lists', line: 'One list per supplier: what to deliver to which booth, and when.' },
          { title: 'Changes on record', line: 'A changed or cancelled order keeps its history.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('exhibitor-portal'), href('invoicing'), href('floor-plan')] },
  },
  {
    slug: 'floor-plan',
    menuLabel: 'Floor plan and booths',
    menuLine: 'Draw the hall and allocate every booth.',
    photo: { video: 'a-hall-model' },
    meta: { title: `Trade show floor plan and booth allocation software · ${P}`, description: 'Draw the hall, give every booth a code and allocate it to an exhibitor, with reserved and sold booths on the plan and a public map for visitors.' },
    hero: { title: 'Allocate every booth on the plan.', lead: 'Draw the hall, give every booth a code and assign it to an exhibitor. The plan, the sales list and the visitor map always agree.' },
    gallery: [{ src: sFloorplan1, alt: 'Two people point at details on a printed floor plan spread across a table.' }, { src: sFloorplan2, alt: 'A floor plan held to a whiteboard by two red magnets.' }],
    galleryLayout: 'beside',
    sections: [
      {
        title: 'What it does',
        items: [
          { title: 'Drag-and-drop editor', line: 'Move, resize and rotate stands on a one-metre grid, with a warning when two overlap.' },
          { title: 'One code per booth', line: 'H7-B04 on the plan, on the invoice and on the exhibitor\'s badge.' },
          { title: 'Booth states', line: 'Free, reserved, sold and blocked, readable in colour and in black and white.' },
          { title: 'No double booking', line: 'A reserved or sold booth can\'t go to another company until you free it.' },
          { title: 'Safe with two editors', line: 'Two people can work on the plan without overwriting each other.' },
          { title: 'Public map', line: 'Visitors see the hall with the exhibitor list and find a stand by name.' },
          { title: 'Sell from the plan', line: 'Pick a free booth, attach it to the deal and send the invoice.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('crm'), href('exhibitor-portal'), href('event-websites')] },
  },
  {
    slug: 'badges-check-in',
    menuLabel: 'Badges and check-in',
    menuLine: 'QR badges for everyone and a desk built for queues.',
    visual: { src: shotCheckInDesk, alt: `The ${P} check-in desk with demo data: a scanned badge shows the exhibitor's name and company above a Check in button.` },
    photo: { src: badges, alt: 'Five white badges with QR codes on blue and yellow lanyards, each with a coloured strip for a different group.' },
    meta: { title: `Event badges and check-in app for trade shows · ${P}`, description: 'QR badges by email for exhibitors, visitors, press, crew and staff, printed on site or kept on the phone, and a check-in desk built for queues.' },
    hero: { title: 'A check-in desk built for the queue.', lead: 'Everyone at your show gets a QR badge by email. At the door your desk scans it, or finds the person by name when the phone is dead.' },
    gallery: [{ src: sBadges1, alt: 'Two conference badges with QR codes lie on printed programmes beside a pen and a notebook.' }, { src: sBadges2, alt: 'Two delegates with badges on lanyards talk between sessions in a conference room.' }],
    galleryLayout: 'strip',
    sections: [
      {
        title: 'Badges',
        items: [
          { title: 'One badge per person', line: 'Exhibitors, visitors, press, crew and your own staff, one badge each per edition.' },
          { title: 'By email', line: 'A QR code and a link to the badge page, sent the moment someone is approved.' },
          { title: 'Printed on site', line: 'Badges printed at the desk on our printers, or kept on the phone.' },
          { title: 'Resend in one click', line: 'Lost the email? Your desk sends it again.' },
          { title: 'Revoke at once', line: 'A revoked badge stops working at the next scan.' },
        ],
      },
      {
        title: 'Check-in',
        figure: { src: hardware, alt: 'At the check-in desk, a staff member scans a visitor\'s QR badge while a new badge prints beside her.' },
        items: [
          { title: 'Scan or search', line: 'A barcode scanner, a phone, or a name search for the visitor without a phone.' },
          { title: 'Look before you let in', line: 'A scan shows who it is; one key records the arrival.' },
          { title: 'Already inside', line: 'A badge that was already scanned is flagged, and two desks never count one person twice.' },
          { title: 'Live arrivals', line: 'Who is in the hall, by group, as it happens.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('on-site-hardware'), '/product/accreditation', href('lead-capture')] },
  },
  {
    slug: 'on-site-hardware',
    menuLabel: 'On-site hardware',
    menuLine: 'Scanners and badge printers, set up at your venue.',
    visual: { src: kit, alt: 'A badge on a violet lanyard, a handheld QR scanner and a compact badge printer laid out side by side.' },
    photo: { src: checkinKiosk, alt: 'A white self-service check-in stand with a screen on a blue column, a card slot in its base and a stack of badge cards.' },
    meta: { title: `Badge printers and scanners for trade shows · ${P}`, description: 'We bring the scanners and badge printers to your venue, set them up and stay for the doors.' },
    hero: { title: 'We bring the hardware.', lead: 'Scanners, badge printers and the check-in desk set-up, delivered to your venue, tested before the doors open and taken away after the show.' },
    gallery: [{ src: sHardware1, alt: 'A small badge printer prints beside a phone that shows its settings.' }, { src: sHardware2, alt: 'A handheld scanner reads the QR code on a phone held across a counter.' }],
    galleryLayout: 'banner',
    sections: [
      {
        title: 'What we bring',
        items: [
          { title: 'Scanners', line: 'Handheld QR scanners for the entrances, ready to plug in.' },
          { title: 'Badge printers', line: 'Printers for badges on demand at the desk, with the cards and lanyards.' },
          { title: 'The desk set-up', line: 'Laptops or tablets with the check-in desk open and signed in.' },
          { title: 'Crew for the doors', line: 'Our people at your desk for the first morning, or for the whole show.' },
          { title: 'A test run', line: 'Every scanner and printer tested with real badges before the doors open.' },
          { title: 'Collected after', line: 'We take everything away when the show closes.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('badges-check-in'), '/services/on-site'] },
  },
  {
    slug: 'lead-capture',
    menuLabel: 'Badge scanning for exhibitors',
    menuLine: 'Exhibitors scan visitors\' badges and keep their contacts.',
    photo: { src: hallBusy, alt: 'A busy trade-show hall, with visitors talking at the stands.' },
    meta: { title: `Lead retrieval app for exhibitors · ${P}`, description: 'Exhibitors scan visitors\' badges with their phone, add a note and leave the show with their leads.' },
    hero: { title: 'Exhibitors leave with their leads.', lead: 'Stand staff scan a visitor\'s badge with their phone, add a note, and download the list after the show. No scanners to rent.' },
    gallery: [{ src: sLeads1, alt: 'A woman scans a QR code on a screen with her phone.' }, { src: sLeads2, alt: 'An exhibitor scans the QR code on a visitor badge with his phone while two visitors talk to him at his stand.' }],
    galleryLayout: 'stripFlip',
    sections: [
      {
        title: 'What it does',
        items: [
          { title: 'Scan with a phone', line: 'The stand team uses their own phones. No hardware to rent.' },
          { title: 'Notes and ratings', line: 'A note and a rating on each lead, while the conversation is fresh.' },
          { title: 'Consent on record', line: 'Visitors agree to share their details when they register.' },
          { title: 'Export after the show', line: 'A spreadsheet of every lead, ready for the exhibitor\'s own CRM.' },
          { title: 'A reason to rebook', line: 'Exhibitors see what the show brought them, in numbers.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('badges-check-in'), href('reports'), href('crm')] },
  },
  {
    slug: 'reports',
    menuLabel: 'Reports',
    menuLine: 'Registrations, arrivals and sales for every edition.',
    photo: { src: reports, alt: 'Three organisers talk over a laptop and coffee in an office with a window onto the hall.' },
    meta: { title: `Trade show reports for organisers and sponsors · ${P}`, description: 'Registrations, arrivals and sales for every edition, side by side with the last one, ready for your sponsors and your team.' },
    hero: { title: 'Know how the edition went.', lead: 'Registrations, arrivals and sales for the edition, side by side with the last one, ready for your sponsors and your own planning.' },
    gallery: [{ src: sReports1, alt: 'Two colleagues point at a sales chart on a flip chart during a review.' }, { src: sReports2, alt: 'Two people compare bar charts on printed reports at a wooden table.' }],
    galleryLayout: 'beside',
    sections: [
      {
        title: 'What it shows',
        items: [
          { title: 'Registrations', line: 'By group, by day and by source, against the last edition.' },
          { title: 'Arrivals', line: 'Who came, when, and through which entrance.' },
          { title: 'Sales', line: 'Booths, packages and sponsorships sold, and what is still unpaid.' },
          { title: 'For sponsors', line: 'The numbers a sponsor asks for, in a report you can send.' },
          { title: 'Rebooking', line: 'This year\'s exhibitors move into next year\'s pipeline with their history.' },
        ],
      },
    ],
    connects: { title: 'Works with', hrefs: [href('crm'), href('lead-capture'), href('invoicing')] },
  },
]

export const productPage = (slug: string): MarketingPageContent | undefined =>
  PRODUCT_PAGES.find((page) => page.slug === slug)

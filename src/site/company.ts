import { PRODUCT_NAME } from '@/lib/product'

/**
 * The company facts the About, Team and Contact pages and the footer share.
 *
 * ★ OFFICES are Daniel's (2026-10-20): HQ in Zagreb, offices in Osijek,
 * Frankfurt and Tampa. City only, no street address (his call).
 *
 * ★ NO INVENTED PEOPLE. Daniel asked for invented team members; the site
 * shows the team by function instead, with no names or faces, until real
 * people join (a made-up person on a company page is a claim a buyer can check
 * and catch). The founder is the only named person.
 */
export const OFFICES = [
  { city: 'Zagreb', country: 'Croatia', note: 'Headquarters' },
  { city: 'Osijek', country: 'Croatia' },
  { city: 'Frankfurt', country: 'Germany' },
  { city: 'Tampa, FL', country: 'United States' },
] as const

export const TEAMS = [
  { name: 'Product and engineering', line: `Builds ${PRODUCT_NAME}: the platform, the exhibitor portal and the check-in desk.` },
  { name: 'Customer success', line: 'Sets up your edition with you and answers in show week.' },
  { name: 'On-site operations', line: 'Brings the scanners and printers and runs the doors with your team.' },
  { name: 'Sales and partnerships', line: 'Works with organisers, agencies and venues.' },
] as const

/** "Zagreb · Osijek · Frankfurt · Tampa, FL", for the footer. */
export const OFFICE_LINE = OFFICES.map((office) => office.city).join(' · ')

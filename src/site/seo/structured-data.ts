import siteIcon from '@/app/(site)/icon.png'
import { PRODUCT_NAME } from '@/lib/product'
import { SITE_URL } from '@/lib/site-config'
import { FOUNDER } from '@/site/founder'
import { META as HOME_META } from '@/site/home/content'
import { CONTROLLER } from '@/site/legal/controller'
import { links } from '@/site/links'
import { INTRO as PRICING_INTRO } from '@/site/pricing/content'

/**
 * The JSON-LD graphs of the site's own pages (F-115d), in the shape the guides
 * use (`articleStructuredData`): `@context` plus one `@graph`, rendered with
 * `src/site/ui/JsonLd`. Search and AI answer engines read who makes Evemos and
 * what it is from here.
 *
 * ★ ONLY WHAT THE PAGE CAN BACK UP. No `aggregateRating` or `review` (there are
 * none), no `sameAs` (no social profiles to point at), and no `offers` on the
 * pricing page while its prices are placeholders (#241, F-115 Question 2): a
 * price Google shows in search is hard to take back. `structured-data.test.ts`
 * scans for all four.
 */

type Node = Record<string, unknown>

const ORGANISATION_ID = `${SITE_URL}/#organization`

/** The organisation as the guides name it: author and publisher of every article. */
export const organisationRef = (): Node => ({ '@type': 'Organization', name: PRODUCT_NAME, url: SITE_URL })

const graph = (nodes: readonly Node[]): Node => ({ '@context': 'https://schema.org', '@graph': nodes })

/** The product itself, published by the homepage's organisation node. */
const softwareApplication = (url: string): Node => ({
  '@type': 'SoftwareApplication',
  name: PRODUCT_NAME,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: HOME_META.description,
  url,
  publisher: { '@id': ORGANISATION_ID },
})

/** `/`: who makes Evemos (Organization) and what it is (SoftwareApplication). */
export function homeStructuredData(): Node {
  return graph([
    {
      '@type': 'Organization',
      '@id': ORGANISATION_ID,
      name: PRODUCT_NAME,
      url: SITE_URL,
      // The site's 512px icon as a static import, not its file route: Next
      // serves `(site)/icon.png` under a route-group suffix (`/icon-<hash>.png`),
      // so `/icon.png` is a 404. The import is a content-hashed `/_next/static`
      // URL that answers 200 and moves only when the icon itself changes.
      logo: `${SITE_URL}${siteIcon.src}`,
      email: CONTROLLER.generalEmail,
      founder: { '@type': 'Person', name: FOUNDER.name },
    },
    softwareApplication(SITE_URL),
  ])
}

/** `/pricing`: the breadcrumb (Evemos → Pricing) and the product, without offers until #241. */
export function pricingStructuredData(): Node {
  const url = `${SITE_URL}${links.pricing}`
  return graph([
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: PRODUCT_NAME, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: PRICING_INTRO.name, item: url },
      ],
    },
    softwareApplication(url),
  ])
}

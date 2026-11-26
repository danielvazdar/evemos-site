import type { Metadata } from 'next'

import { OverviewPreview } from '@/site/home/OverviewPreview'
import { MarketingPage } from '@/site/pages/MarketingPage'
import { productPage } from '@/site/pages/product'
import { pageMetadata, pageOr404 } from '@/site/pages/route'

/**
 * /product/reports: the templated page from `src/site/pages/product.ts` with
 * the app's own dashboard in its hero (F-192d), from the homepage's demo
 * fixture, on a route of its own: a route loads the CSS of everything it
 * imports, so the other product pages (`[slug]`) load none of the dashboard's.
 * Its booths ring opens the floor plan page, never the app's Floor plan.
 */
const page = productPage('reports')

export const metadata: Metadata = pageMetadata(page, '/product')

export default function ReportsPage() {
  return <MarketingPage content={pageOr404(page)} preview={<OverviewPreview floorPlanHref="/product/floor-plan" />} />
}

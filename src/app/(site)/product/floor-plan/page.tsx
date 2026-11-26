import type { Metadata } from 'next'

import { FloorPlanPreview } from '@/site/home/FloorPlanPreview'
import { MarketingPage } from '@/site/pages/MarketingPage'
import { productPage } from '@/site/pages/product'
import { pageMetadata, pageOr404 } from '@/site/pages/route'

/**
 * /product/floor-plan: the templated page from `src/site/pages/product.ts`
 * with the app's own hall in its hero (F-192d), on a route of its own: a route
 * loads the CSS and script of everything it imports, so the other product
 * pages (`[slug]`) load none of the hall's. It opens in 2D here, so its 3D
 * furniture pictures load when a visitor turns it, not with the page.
 */
const page = productPage('floor-plan')

export const metadata: Metadata = pageMetadata(page, '/product')

export default function FloorPlanPage() {
  return <MarketingPage content={pageOr404(page)} preview={<FloorPlanPreview firstView="2d" />} />
}

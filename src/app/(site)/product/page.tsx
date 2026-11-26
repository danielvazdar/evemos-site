import type { Metadata } from 'next'

import { PRODUCT_NAME } from '@/lib/product'
import { links } from '@/site/links'
import { OVERVIEW, ProductOverview } from '@/site/pages/ProductOverview'

/** /product: every module, stage by stage (the Product menu as a page). */
export const metadata: Metadata = {
  title: { absolute: `${OVERVIEW.title} · ${PRODUCT_NAME}` },
  description: OVERVIEW.description,
  alternates: { canonical: links.productOverview },
}

export default function Page() {
  return <ProductOverview />
}

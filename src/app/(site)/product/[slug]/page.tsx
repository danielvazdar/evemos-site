import type { Metadata } from 'next'

import { MarketingPage } from '@/site/pages/MarketingPage'
import { productPage } from '@/site/pages/product'
import { pageMetadata, pageOr404, type SlugProps } from '@/site/pages/route'
import { PRODUCT_PREVIEWS } from '@/site/previews/ProductPreviews'

/**
 * /product/<slug>: one page per module, from `src/site/pages/product.ts`.
 * /product/accreditation is its own static route and wins over this one, and
 * so are /product/floor-plan and /product/reports, which draw the app itself
 * (F-192d): this route loads none of their CSS or script.
 */
export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const { slug } = await params
  return pageMetadata(productPage(slug), '/product')
}

export default async function ProductPage({ params }: SlugProps) {
  const { slug } = await params
  const content = pageOr404(productPage(slug))
  // A drawn screen only for pages without a real screenshot or render (`visual`); pages.test keeps the two apart.
  const Preview = PRODUCT_PREVIEWS[slug]
  return <MarketingPage content={content} preview={Preview ? <Preview /> : undefined} />
}

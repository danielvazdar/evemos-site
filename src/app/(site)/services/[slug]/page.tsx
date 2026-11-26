import type { Metadata } from 'next'

import { MarketingPage } from '@/site/pages/MarketingPage'
import { pageMetadata, pageOr404, type SlugProps } from '@/site/pages/route'
import { servicePage } from '@/site/pages/services'

/** /services/<slug>: what we do around the software, from `src/site/pages/services.ts`. */
export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const { slug } = await params
  return pageMetadata(servicePage(slug), '/services')
}

export default async function ServicePage({ params }: SlugProps) {
  const { slug } = await params
  return <MarketingPage content={pageOr404(servicePage(slug))} />
}

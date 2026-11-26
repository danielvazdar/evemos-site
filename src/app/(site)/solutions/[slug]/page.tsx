import type { Metadata } from 'next'

import { MarketingPage } from '@/site/pages/MarketingPage'
import { pageMetadata, pageOr404, type SlugProps } from '@/site/pages/route'
import { solutionPage } from '@/site/pages/solutions'

/** /solutions/<slug>: by event type and for partners, from `src/site/pages/solutions.ts`. */
export async function generateMetadata({ params }: SlugProps): Promise<Metadata> {
  const { slug } = await params
  return pageMetadata(solutionPage(slug), '/solutions')
}

export default async function SolutionPage({ params }: SlugProps) {
  const { slug } = await params
  return <MarketingPage content={pageOr404(solutionPage(slug))} />
}

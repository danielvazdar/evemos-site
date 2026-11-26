import type { Metadata, ResolvingMetadata } from 'next'

import { articleOr404 } from '@/site/guides/articles'
import { articleMetadata, GuideArticle } from '@/site/guides/GuideArticle'
import type { SlugProps } from '@/site/pages/route'

/** /compare/<slug>: Evemos beside a named tool (E-61): the words live in `src/site/guides/`, registered in `articles.ts`. */
export async function generateMetadata({ params }: SlugProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params
  return articleMetadata(articleOr404('comparison', slug), (await parent).openGraph?.images)
}

export default async function ComparisonPage({ params }: SlugProps) {
  const { slug } = await params
  return <GuideArticle content={articleOr404('comparison', slug)} />
}

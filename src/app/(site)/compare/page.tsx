import { ArticleHub, hubMetadata } from '@/site/guides/ArticleHub'

/** /compare: every comparison in `src/site/guides/articles.ts`. */
export const metadata = hubMetadata('comparison')

export default function ComparisonHubPage() {
  return <ArticleHub kind="comparison" />
}

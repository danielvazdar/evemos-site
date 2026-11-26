import { ArticleHub, hubMetadata } from '@/site/guides/ArticleHub'

/** /guides: every guide in `src/site/guides/articles.ts`. */
export const metadata = hubMetadata('guide')

export default function GuideHubPage() {
  return <ArticleHub kind="guide" />
}

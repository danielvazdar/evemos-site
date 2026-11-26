import { notFound } from 'next/navigation'

import { COMPARISONS } from './compare/tools'
import type { ArticleKind, GuideContent } from './GuideArticle'
import { FLOOR_PLAN_GUIDE } from './floor-plan'
import { ORGANISE_TRADE_FAIR_GUIDE } from './organise-trade-fair'
import { PRESS_ACCREDITATION_GUIDE } from './press-accreditation'
import { SELL_EXHIBITION_SPACE_GUIDE } from './sell-exhibition-space'
import { SOFTWARE_COST_GUIDE } from './software-cost'
import { TRADE_FAIR_VS_TRADE_SHOW_GUIDE } from './trade-fair-vs-trade-show'

/**
 * ★ EVERY ARTICLE, in one registry: the guides (/guides/<slug>) and the
 * comparisons (/compare/<slug>). The two `[slug]` routes, the hub pages, the
 * sitemap and llms.txt all read this list, so an article added here is live,
 * listed and crawlable at once. In menu order within each kind.
 */
export const ARTICLES: readonly GuideContent[] = [
  ORGANISE_TRADE_FAIR_GUIDE,
  SELL_EXHIBITION_SPACE_GUIDE,
  FLOOR_PLAN_GUIDE,
  SOFTWARE_COST_GUIDE,
  TRADE_FAIR_VS_TRADE_SHOW_GUIDE,
  PRESS_ACCREDITATION_GUIDE,
  ...COMPARISONS,
]

export const articlesOf = (kind: ArticleKind): readonly GuideContent[] => ARTICLES.filter((article) => article.kind === kind)

/** The article at `<hub>/<slug>`, or a 404. */
export function articleOr404(kind: ArticleKind, slug: string): GuideContent {
  const article = ARTICLES.find((candidate) => candidate.kind === kind && candidate.path.endsWith(`/${slug}`))
  if (!article) notFound()
  return article
}

/** Every article's path, for the sitemap and the "every link lands" tests. */
export const ARTICLE_PATHS: readonly string[] = ARTICLES.map((article) => article.path)

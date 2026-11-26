import { PRODUCT_NAME as P } from '@/lib/product'
import { articlesOf } from '@/site/guides/articles'
import { ARTICLE_KINDS } from '@/site/guides/GuideArticle'
import { HUB_COPY } from '@/site/guides/ArticleHub'
import { links } from '@/site/links'
import { PRODUCT_PAGES } from '@/site/pages/product'
import { SOLUTION_PAGES } from '@/site/pages/solutions'
import { ONE_LINER } from '@/site/positioning'

/**
 * ★ /llms.txt (llmstxt.org): a plain map of the site for AI answer engines,
 * so ChatGPT, Claude or Perplexity can find the page that answers a question
 * without crawling the menus. Built from the same registries as the sitemap,
 * so a new page or article shows up here without anyone editing this file.
 *
 * The summary claims only what is built (the list in
 * docs/website/COMPETITOR_FACTS.md, "What Evemos may claim"). The product
 * pages are listed by their own descriptions.
 */

const line = (origin: string, title: string, path: string, description: string): string =>
  `- [${title}](${origin}${path}): ${description}`

const SUMMARY = `${P} is software for organisers of trade shows and exhibitions. ${ONE_LINER} Built today: registration forms with approval, QR badges by email, check-in by scan or name search, press and crew accreditation, a floor plan editor with booth allocation and a public hall map, and an exhibitor portal. One yearly price by number of exhibitors, with every module included and no fee per ticket. English, for organisers in Europe.`

export function llmsText(origin: string): string {
  const product = PRODUCT_PAGES.map((page) => line(origin, page.menuLabel, `/product/${page.slug}`, page.meta.description))
  const solutions = SOLUTION_PAGES.map((page) => line(origin, page.menuLabel, `/solutions/${page.slug}`, page.meta.description))
  const articles = (kind: 'guide' | 'comparison') =>
    articlesOf(kind).map((article) => line(origin, article.title, article.path, article.metaDescription))
  return [
    `# ${P}`,
    '',
    `> ${SUMMARY}`,
    '',
    '## Start here',
    line(origin, 'Home', links.home, ONE_LINER),
    line(origin, 'Product overview', links.productOverview, "Every module, by stage of the organiser's year."),
    line(origin, 'Accreditation', links.accreditationPage, 'Press, crew and speakers, approved before the badge.'),
    line(origin, 'Pricing', links.pricing, 'What it costs and what is included.'),
    line(origin, 'Security', links.security, 'Where the data is kept, backups, consent and opt-outs.'),
    '',
    `## ${ARTICLE_KINDS.comparison.hubName}`,
    line(origin, HUB_COPY.comparison.title, links.compare, HUB_COPY.comparison.metaDescription),
    ...articles('comparison'),
    '',
    `## ${ARTICLE_KINDS.guide.hubName}`,
    line(origin, HUB_COPY.guide.title, links.guides, HUB_COPY.guide.metaDescription),
    ...articles('guide'),
    '',
    '## Product',
    ...product,
    '',
    '## Solutions',
    ...solutions,
    '',
  ].join('\n')
}

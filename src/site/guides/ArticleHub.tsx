import type { Metadata } from 'next'
import Image from 'next/image'

import { PRODUCT_NAME } from '@/lib/product'
import { ReadingPage } from '@/site/legal/LegalDocument'

import { articlesOf } from './articles'
import { ARTICLE_KINDS, type ArticleKind } from './GuideArticle'
import styles from './GuideArticle.module.css'

/**
 * A hub page (/guides, /compare): every article of one kind, newest first,
 * with its lead picture and its one-line summary. Crawlers and answer engines find the articles
 * from here; a visitor picks one. A `ReadingPage`, as the articles are: the
 * title on the washes, the list on paper (F-192e). Server component.
 */

interface HubCopy {
  title: string
  lead: string
  metaDescription: string
}

export const HUB_COPY: Readonly<Record<ArticleKind, HubCopy>> = {
  guide: {
    title: 'Guides for trade show organisers',
    lead: 'Practical answers for people who run exhibitions and trade fairs: what to ask for, what to decide first and what to check on the day.',
    metaDescription: 'Free, practical guides for trade show and exhibition organisers: exhibitors, floor plans, booth sales and badges.',
  },
  comparison: {
    title: `How ${PRODUCT_NAME} compares`,
    lead: `${PRODUCT_NAME} next to the tools event organisers look at: what each one does, what it costs and why organisers choose one operating system for the whole show. Every fact about another tool comes from its own website, with the date we checked.`,
    metaDescription: `${PRODUCT_NAME} compared with other event platforms: features, pricing and why organisers run the whole show on one operating system. Facts about each tool come from its own site.`,
  },
}

export function hubMetadata(kind: ArticleKind): Metadata {
  const copy = HUB_COPY[kind]
  const title = `${copy.title} · ${PRODUCT_NAME}`
  return {
    title: { absolute: title },
    description: copy.metaDescription,
    alternates: { canonical: ARTICLE_KINDS[kind].hub },
  }
}

/** Two to a row from 768px, each half the 1280px column less the 32px gap between them (`.hubList`). */
const PICTURE_SIZES = '(min-width: 1376px) 624px, (min-width: 768px) 50vw, 100vw'

interface ArticleHubProps {
  kind: ArticleKind
}

export function ArticleHub({ kind }: ArticleHubProps) {
  const copy = HUB_COPY[kind]
  return (
    <ReadingPage titleId="hub-title" title={copy.title} intro={copy.lead}>
      <ul className={styles.hubList}>
        {articlesOf(kind).map((article) => (
          <li key={article.path}>
            {/* The picture link is hidden from screen readers (the title link says the same); its alt stays for search. */}
            {article.image ? (
              <a href={article.path} tabIndex={-1} aria-hidden="true">
                <Image src={article.image.src} alt={article.image.alt} className={styles.hubPicture} sizes={PICTURE_SIZES} />
              </a>
            ) : null}
            <a href={article.path} className={styles.hubLink}>
              {article.title}
            </a>
            <p className={styles.hubLine}>{article.summary}</p>
          </li>
        ))}
      </ul>
    </ReadingPage>
  )
}

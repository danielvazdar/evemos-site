import { CalendarDays } from 'lucide-react'
import type { Metadata, ResolvedMetadata } from 'next'
import Image, { type StaticImageData } from 'next/image'
import React from 'react'

import { PRODUCT_NAME } from '@/lib/product'
import { SITE_URL } from '@/lib/site-config'
import { PRIMARY_ACTION } from '@/site/home/content'
import { Block, formatLegalDate, type LegalBlock, type LegalLink, ReadingPage, safeHref } from '@/site/legal/LegalDocument'
import legal from '@/site/legal/LegalDocument.module.css'
import { links } from '@/site/links'
import { organisationRef } from '@/site/seo/structured-data'
import { JsonLd } from '@/site/ui/JsonLd'
import { ButtonLink, ButtonRow } from '@/site/ui/primitives'

import styles from './GuideArticle.module.css'

/**
 * The one renderer for Evemos's articles: guides (/guides/<slug>), free
 * articles that answer an organiser's search (content plan,
 * docs/website/KEYWORD_RESEARCH.md), and comparisons (/compare/<slug>), which
 * set Evemos beside a named tool (E-61). Both end with the product section
 * and "Book a demo".
 *
 * ★ WRITTEN TO BE QUOTED. Answer engines (ChatGPT, Perplexity, Google's AI
 * answers) lift a page's direct answers, so every article opens with the
 * answer (`intro`), can carry questions with one-paragraph answers (`faq`),
 * and ships the same content as structured data: Article, FAQPage and
 * BreadcrumbList (`articleStructuredData`).
 *
 * Same typed-blocks shape as the legal documents, rendered by the same `Block`,
 * so there is no HTML in the content, every link goes through `safeHref`, and
 * `copycheck` reads the copy as it is. The same `ReadingPage` too: the title on
 * the washes, the article on paper, its lead picture at the top of the
 * article, so a guide draws no glass and loads none of the template pages'
 * script. Server component, no client JavaScript.
 */

/** A picture: a photo or render from `src/site/photos/`, with the scene described in `alt`. */
export type GuidePicture = Readonly<{ src: StaticImageData; alt: string }>

/** The legal documents' blocks, plus a picture inside a section (the guides' own kind). */
export type GuideBlock = LegalBlock | Readonly<{ kind: 'figure' } & GuidePicture>

export type GuideSection = Readonly<{
  /** The anchor of the section. Lowercase words and hyphens. */
  id: string
  title: string
  blocks: readonly GuideBlock[]
}>

export type GuideSource = Readonly<{ link: LegalLink; note: string }>

export type GuideQuestion = Readonly<{ question: string; answer: string }>

export type ArticleKind = 'guide' | 'comparison'

/** What each kind is called on the page and in the breadcrumbs, and the hub it sits under. */
export const ARTICLE_KINDS: Readonly<Record<ArticleKind, { hub: string; hubName: string }>> = {
  guide: { hub: '/guides', hubName: 'Guides' },
  comparison: { hub: '/compare', hubName: 'Comparisons' },
}

export type GuideContent = Readonly<{
  kind: ArticleKind
  /** The page's own path, also its canonical URL: `<hub>/<slug>`. */
  path: string
  /** The short name in the Resources menu. */
  menuLabel: string
  /** The line under the title on the hub page and in the Resources menu. */
  summary: string
  /** The `h1`. */
  title: string
  /** The search-result title, with the product name. */
  metaTitle: string
  metaDescription: string
  intro: string
  /** The lead picture, between the heading and the first section. */
  image?: GuidePicture
  /** ISO day the article first went up. */
  published: string
  /** ISO day of this version, printed as "Updated …". */
  updated: string
  sections: readonly GuideSection[]
  /** Questions people ask about the topic, each answered in one paragraph. Shown before the product section. */
  faq?: readonly GuideQuestion[]
  /** The closing section about the product: the only place a guide sells. */
  product: GuideSection
  /** Where the advice comes from: published rules, read on `updated`. */
  sources: Readonly<{ title: string; intro: string; items: readonly GuideSource[] }>
}>

/**
 * A picture at the reading column's width, keeping its 16:9 box from the
 * import (no layout shift). Only the lead picture is preloaded: the in-text
 * ones are below the fold and load lazily.
 */
function Picture({ picture, preload = false }: { picture: GuidePicture; preload?: boolean }) {
  return <Image src={picture.src} alt={picture.alt} className={styles.picture} sizes="(min-width: 800px) 720px, 100vw" preload={preload} />
}

function Section({ section, children }: { section: GuideSection; children?: React.ReactNode }) {
  const headingId = `${section.id}-heading`
  return (
    <section id={section.id} aria-labelledby={headingId} className={legal.section}>
      <h2 id={headingId} className={styles.sectionTitle}>
        {section.title}
      </h2>
      {section.blocks.map((block, index) =>
        block.kind === 'figure' ? <Picture key={index} picture={block} /> : <Block key={index} block={block} />,
      )}
      {children}
    </section>
  )
}

function Questions({ faq }: { faq: readonly GuideQuestion[] }) {
  return (
    <section id="questions" aria-labelledby="questions-heading" className={legal.section}>
      <h2 id="questions-heading" className={styles.sectionTitle}>
        Questions organisers ask
      </h2>
      {faq.map((item) => (
        <div key={item.question} className={styles.question}>
          <h3 className={styles.questionTitle}>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </section>
  )
}

/**
 * The page's `<head>` fields, from the content. Each article route exports this.
 *
 * ★ `shareImages` is the parent's resolved `og:image`, the site's share card
 * (`(site)/opengraph-image.tsx`, F-115c). An article's own `openGraph` (it is
 * an `article`, with dates) replaces the layout's whole object, image
 * included, so the route hands the card back in. Its URL is Next's hashed one.
 */
export function articleMetadata(
  content: GuideContent,
  shareImages: NonNullable<ResolvedMetadata['openGraph']>['images'],
): Metadata {
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: { canonical: content.path },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: 'article',
      publishedTime: content.published,
      modifiedTime: content.updated,
      images: shareImages,
    },
  }
}

/** Article, FAQPage (when the article has questions) and BreadcrumbList, as one JSON-LD graph. */
export function articleStructuredData(content: GuideContent): Record<string, unknown> {
  const url = `${SITE_URL}${content.path}`
  const kind = ARTICLE_KINDS[content.kind]
  const organisation = organisationRef()
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      headline: content.title,
      description: content.metaDescription,
      datePublished: content.published,
      dateModified: content.updated,
      inLanguage: 'en',
      // The lead picture, so search results can show it with the article.
      ...(content.image ? { image: `${SITE_URL}${content.image.src.src}` } : {}),
      mainEntityOfPage: url,
      author: organisation,
      publisher: organisation,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: PRODUCT_NAME, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: kind.hubName, item: `${SITE_URL}${kind.hub}` },
        { '@type': 'ListItem', position: 3, name: content.title, item: url },
      ],
    },
  ]
  const faq = content.faq?.length
    ? [
        {
          '@type': 'FAQPage',
          mainEntity: content.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        },
      ]
    : []
  return { '@context': 'https://schema.org', '@graph': [...graph, ...faq] }
}

interface GuideArticleProps {
  content: GuideContent
}

export function GuideArticle({ content }: GuideArticleProps) {
  const { sources } = content
  return (
    <ReadingPage titleId="guide-title" title={content.title} intro={content.intro} dated={`Updated ${formatLegalDate(content.updated)}`}>
      <JsonLd data={articleStructuredData(content)} />
      <article aria-labelledby="guide-title" className={legal.document}>
        {content.image ? <Picture picture={content.image} preload /> : null}
        {content.sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
        {content.faq?.length ? <Questions faq={content.faq} /> : null}
        <div className={styles.product}>
          <Section section={content.product}>
            <ButtonRow>
              <ButtonLink href={links.demo} variant="primary" icon={CalendarDays}>
                {PRIMARY_ACTION}
              </ButtonLink>
            </ButtonRow>
          </Section>
        </div>
        <section id="sources" aria-labelledby="sources-heading" className={legal.section}>
          <h2 id="sources-heading" className={styles.sourcesTitle}>
            {sources.title}
          </h2>
          <p className={styles.sourcesIntro}>{sources.intro}</p>
          <ul className={styles.sources}>
            {sources.items.map((item) => (
              <li key={item.link.href}>
                <a href={safeHref(item.link.href)} rel="noopener">
                  {item.link.label}
                </a>
                : {item.note}
              </li>
            ))}
          </ul>
        </section>
      </article>
    </ReadingPage>
  )
}

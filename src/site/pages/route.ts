import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { MarketingPageContent } from './types'

/**
 * Shared plumbing for the `[slug]` routes of the templated families
 * (/product, /solutions, /services): metadata from the page's content, and a
 * 404 for a slug that has no page.
 */
export interface SlugProps {
  params: Promise<{ slug: string }>
}

export function pageMetadata(page: MarketingPageContent | undefined, base: string): Metadata {
  if (!page) return {}
  return {
    title: { absolute: page.meta.title },
    description: page.meta.description,
    alternates: { canonical: `${base}/${page.slug}` },
  }
}

export function pageOr404(page: MarketingPageContent | undefined): MarketingPageContent {
  if (!page) notFound()
  return page
}

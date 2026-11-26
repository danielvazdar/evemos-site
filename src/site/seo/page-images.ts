import type { StaticImageData } from 'next/image'

import { ARTICLES } from '@/site/guides/articles'
import { links } from '@/site/links'
import { CAREERS_PAGE, CONTACT_PAGE, CUSTOMER_STORY, SECURITY_PAGE } from '@/site/pages/company'
import { PRODUCT_PAGES } from '@/site/pages/product'
import { OVERVIEW } from '@/site/pages/ProductOverview'
import { SERVICE_PAGES } from '@/site/pages/services'
import { SOLUTION_PAGES } from '@/site/pages/solutions'
import type { MarketingPageContent, Visual } from '@/site/pages/types'
import busyHall from '@/site/photos/busy-trade-show-hall.jpg'
import badgeScanning from '@/site/photos/check-in-desk-badge-scanning.jpg'
import standBuildUp from '@/site/photos/exhibitor-stand-build-up-technician.jpg'
import coffeeMeeting from '@/site/photos/organiser-and-exhibitor-coffee-meeting.jpg'
import organiserOverHall from '@/site/photos/organiser-overlooking-exhibition-hall.jpg'
import badgeHandoff from '@/site/photos/registration-desk-badge-handoff.jpg'
import visitorBadges from '@/site/photos/registration-desk-visitor-badges.jpg'
import planningTeam from '@/site/photos/team-planning-trade-fair-hall-plan.jpg'
import entrancePhone from '@/site/photos/visitor-checking-phone-at-exhibition-entrance.jpg'

/**
 * Every picture on each page of the marketing site, for the image sitemap
 * (`src/app/sitemap.ts`): search engines find and index pictures through it,
 * by the descriptive file name and the alt text on the page.
 *
 * The templated pages and the articles are read from their content, so a new
 * picture there is listed by itself. The hand-built pages are listed here by
 * hand; `page-images.test.tsx` renders each one and fails when this list and
 * the page disagree.
 */
const HAND_BUILT: ReadonlyArray<readonly [path: string, images: readonly StaticImageData[]]> = [
  // The homepage's show day changes between its four door photos (ShowDayVisual); all four are on the page.
  ['/', [standBuildUp, badgeHandoff, badgeScanning, visitorBadges, entrancePhone, organiserOverHall]],
  [links.productOverview, [OVERVIEW.photo.src]],
  [links.about, [planningTeam, busyHall]],
  [links.pricing, [coffeeMeeting]],
  [links.accreditationPage, [badgeHandoff, organiserOverHall]],
]

const COMPANY_PATHS: ReadonlyArray<readonly [path: string, page: MarketingPageContent]> = [
  [links.security, SECURITY_PAGE],
  [links.contact, CONTACT_PAGE],
  [links.careers, CAREERS_PAGE],
  [links.customerStory, CUSTOMER_STORY],
]

/** The photos and renders of a templated page; clips have no image to list. */
const imagesOf = (page: MarketingPageContent): StaticImageData[] => {
  const visuals: ReadonlyArray<Visual | undefined> = [page.visual, page.photo, ...page.sections.map((section) => section.figure), ...(page.gallery ?? [])]
  return visuals.flatMap((visual) => (visual && 'src' in visual ? [visual.src] : []))
}

const unique = (images: readonly StaticImageData[]): string[] => [...new Set(images.map((image) => image.src))]

/** Page path → the `src` of every picture on it (site-relative, e.g. `/_next/static/media/…`). */
export const PAGE_IMAGES: ReadonlyMap<string, readonly string[]> = new Map([
  ...HAND_BUILT.map(([path, images]) => [path, unique(images)] as const),
  ...PRODUCT_PAGES.map((page) => [`/product/${page.slug}`, unique(imagesOf(page))] as const),
  ...SOLUTION_PAGES.map((page) => [`/solutions/${page.slug}`, unique(imagesOf(page))] as const),
  ...SERVICE_PAGES.map((page) => [`/services/${page.slug}`, unique(imagesOf(page))] as const),
  ...COMPANY_PATHS.map(([path, page]) => [path, unique(imagesOf(page))] as const),
  ...ARTICLES.map((article) => {
    const figures = article.sections.flatMap((section) => section.blocks.flatMap((block) => ('kind' in block && block.kind === 'figure' ? [block.src] : [])))
    return [article.path, unique([...(article.image ? [article.image.src] : []), ...figures])] as const
  }),
])

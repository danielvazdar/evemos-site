import type { StaticImageData } from 'next/image'

import type { SiteVideoKey } from '@/site/ui/SiteVideo'

/**
 * The shape of every templated marketing page (product, solution and service
 * pages): one content object per page, rendered by `MarketingPage`. Copy only;
 * the template owns the layout. Every page ends with Book a demo (E-13).
 */

/** A picture on a page: a photo, render or screenshot with its alt text, or one of the hall animations (`SiteVideo`). */
export type Visual = { src: StaticImageData; alt: string } | { video: SiteVideoKey }

/**
 * Where a page's two gallery photos go:
 * - `strip`: side by side after the sections, wide then narrow;
 * - `stripFlip`: side by side after the first section, narrow then wide;
 * - `banner`: the first edge to edge after the first section, the second beside "How it connects";
 * - `beside`: the first beside the last section's items, the second beside "How it connects".
 * A layout whose slot is taken falls back to `strip`.
 */
export type GalleryLayout = 'strip' | 'stripFlip' | 'banner' | 'beside'

export interface PageItem {
  title: string
  line: string
}

export interface PageSection {
  title: string
  lead?: string
  items: readonly PageItem[]
  /** A picture beside this section's items. */
  figure?: Visual
}

export interface MarketingPageContent {
  /** The last path segment: /product/<slug>. Lowercase words and hyphens. */
  slug: string
  /** How the page appears in menus and the footer. */
  menuLabel: string
  /** One line under the label in the dropdown menus. */
  menuLine: string
  meta: { title: string; description: string }
  hero: { title: string; lead: string }
  /** What sits beside the hero text: a real screenshot, a render or an animation. Takes the place of a drawn preview. */
  visual?: Visual
  /** In the hero when nothing else is there; otherwise beside the first section. */
  photo?: Visual
  sections: readonly PageSection[]
  /** Two photos of what this page is about (second design pass, #146). Where they sit is `galleryLayout`. */
  gallery?: readonly [Visual, Visual]
  /** How the gallery sits on the page. Neighbouring pages use different ones, so no two pages in a row look alike. Default `strip`. */
  galleryLayout?: GalleryLayout
  /** "How it connects": the pages this one works with. Each link takes its label from the site map (`MENU_LABELS`), so it always matches the menu. */
  connects?: { title: string; hrefs: readonly string[] }
  closing?: { title: string; line: string }
}

export type PageFamily = 'product' | 'solutions' | 'services'

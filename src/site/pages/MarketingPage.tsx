import { ArrowRight, CalendarDays } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { PRIMARY_ACTION } from '@/site/home/content'
import home from '@/site/home/home.module.css'
import { links } from '@/site/links'
import { MENU_LABELS } from '@/site/sitemap'
import { ClosingBand } from '@/site/ui/ClosingBand'
import { SiteVideo } from '@/site/ui/SiteVideo'
import {
  ButtonLink,
  ButtonRow,
  Container,
  HALF_COLUMN_SIZES,
  Section,
  SectionHeading,
  type SectionTone,
  SiteIcon,
} from '@/site/ui/primitives'
import tones from '@/site/ui/primitives.module.css'

import styles from './MarketingPage.module.css'
import type { MarketingPageContent, PageSection, Visual } from './types'

const DEFAULT_CLOSING = {
  title: 'See it on your own show',
  line: "Send us your hall plan and exhibitor list, and we'll show your next edition in a demo.",
} as const

interface MarketingPageProps {
  content: MarketingPageContent
  /**
   * A drawn picture of the product screen (demo data) for the hero, a glass window of its own; the photo then
   * moves into the first section.
   */
  preview?: React.ReactNode
  /**
   * A band of the page's own after its sections and before the violet close (the contact page's offices), handed
   * the next calm tone so the bands keep alternating: the close is always last.
   */
  beforeClose?: (tone: SectionTone) => React.ReactNode
}

type Layout = 'lead' | 'list' | 'split'

/** A "How it connects" link's label: the page's own menu label. A link to a page outside the menus is a bug, so it fails the render. */
const menuLabel = (href: string): string => {
  const label = MENU_LABELS.get(href)
  if (!label) throw new Error(`MarketingPage: ${href} is in no menu, so it has no label`)
  return label
}

/**
 * Where the page's `photo` goes: the hero when nothing else claims it,
 * otherwise beside the first section. A first section with its own figure
 * leaves the photo nowhere to go; that is a content bug, so it fails the render.
 */
const photoSlot = (content: MarketingPageContent, heroTaken: boolean): 'hero' | 'section' | null => {
  if (!content.photo) return null
  if (!heroTaken) return 'hero'
  if (content.sections[0]?.figure) throw new Error(`MarketingPage: /${content.slug} has a photo with no slot (the hero and section 1 both have a picture)`)
  return 'section'
}

/** A band of gallery photos between sections: two side by side, or one edge to edge. */
interface GalleryBand {
  /** The band follows the section with this index. */
  after: number
  kind: 'strip' | 'stripFlip' | 'banner'
  pictures: readonly Visual[]
}

/** Where a page's gallery photos land: a band, a section's figure, the picture beside "How it connects". */
interface GalleryPlacement {
  band?: GalleryBand
  figure?: { index: number; visual: Visual }
  connects?: Visual
}

/**
 * Places the gallery by the page's `galleryLayout` (see `GalleryLayout`). A
 * layout whose slot is taken (no "How it connects", a last section that already
 * has a picture) falls back to the strip after the sections.
 */
const placeGallery = (content: MarketingPageContent, sectionIsFree: (index: number) => boolean): GalleryPlacement => {
  const gallery = content.gallery
  if (!gallery) return {}
  const last = content.sections.length - 1
  const first = Math.min(0, last)
  const strip: GalleryPlacement = { band: { after: last, kind: 'strip', pictures: gallery } }
  switch (content.galleryLayout ?? 'strip') {
    case 'stripFlip':
      return { band: { after: first, kind: 'stripFlip', pictures: gallery } }
    case 'banner':
      return content.connects ? { band: { after: first, kind: 'banner', pictures: [gallery[0]] }, connects: gallery[1] } : strip
    case 'beside':
      return content.connects && sectionIsFree(last) ? { figure: { index: last, visual: gallery[0] }, connects: gallery[1] } : strip
    default:
      return strip
  }
}

/**
 * The one template for product, solution and service pages: a hero with the
 * product's screen, a render, an animation or a photo beside it, the page's sections, "how it
 * connects" links, and the violet closing band with Book a demo.
 *
 * Sections vary on purpose (the design audit of 2026-10-20 and the second
 * design pass, #146: rows of identical boxes read as generated): a section with
 * a picture is a list beside it; otherwise the first is a list with large
 * titles and later ones are plain lists. No boxes anywhere.
 *
 * The gallery's two photos show what the page is about, and sit differently
 * from page to page (`galleryLayout`; Daniel, 2026-11-07: the same strip on
 * every page read as the same two photos).
 *
 * The approved site demo's look (F-192d, E-131 Q4 = B): the hero is `open`, on
 * the washes, with its picture in a glass frame or its drawn screen a glass
 * window. Everything under it is reading, photos and links, so it sits on the
 * calm bands, a gallery on the band of the section it follows; the close is
 * the violet band.
 */
export function MarketingPage({ content, preview, beforeClose }: MarketingPageProps) {
  const closing = content.closing ?? DEFAULT_CLOSING
  // Bands after the hero alternate raised, paper, raised...; this is the tone of band number `n` (0-based).
  const toneOf = (n: number): SectionTone => (n % 2 === 0 ? 'raised' : 'paper')
  const slot = photoSlot(content, Boolean(preview ?? content.visual))
  const heroPicture = content.visual ?? (slot === 'hero' ? content.photo : undefined)
  const heroVisual =
    preview ??
    (heroPicture ? (
      <GlassFrame>
        <PageVisual visual={heroPicture} hero />
      </GlassFrame>
    ) : null)
  const ownFigureOf = (index: number): Visual | undefined => content.sections[index]?.figure ?? (index === 0 && slot === 'section' ? content.photo : undefined)
  const placement = placeGallery(content, (index) => !ownFigureOf(index))
  const figureOf = (index: number): Visual | undefined => ownFigureOf(index) ?? (placement.figure?.index === index ? placement.figure.visual : undefined)
  const layoutOf = (index: number): Layout => (figureOf(index) ? 'split' : index === 0 ? 'lead' : 'list')
  const band = placement.band

  return (
    <>
      <Section tone="open" labelledBy="page-title">
        <div className={heroVisual ? styles.heroSplit : undefined}>
          <div className={styles.hero}>
            <SectionHeading
              id="page-title"
              title={content.hero.title}
              lead={content.hero.lead}
              level={1}
            />
            <ButtonRow>
              <ButtonLink href={links.demo} variant="primary" icon={CalendarDays}>
                {PRIMARY_ACTION}
              </ButtonLink>
            </ButtonRow>
          </div>
          {heroVisual ? <div className={styles.heroVisual}>{heroVisual}</div> : null}
        </div>
      </Section>

      {content.sections.map((section, index) => {
        const figure = figureOf(index)
        return (
          <React.Fragment key={section.title}>
            <PageSectionBand
              section={section}
              id={`section-${index + 1}`}
              tone={toneOf(index)}
              layout={layoutOf(index)}
              photo={figure ? <PageVisual visual={figure} /> : null}
            />
            {band?.after === index ? <GalleryBandView band={band} tone={toneOf(index)} /> : null}
          </React.Fragment>
        )
      })}

      {content.connects ? (
        <Section id="connects" tone={toneOf(content.sections.length)} labelledBy="connects-title">
          <div className={placement.connects ? styles.connectsSplit : undefined}>
            <div>
              <SectionHeading id="connects-title" title={content.connects.title} level={2} />
              <ul className={styles.connects}>
                {content.connects.hrefs.map((href) => (
                  <li key={href}>
                    <a href={href} className={styles.connect}>
                      <span>{menuLabel(href)}</span>
                      <SiteIcon icon={ArrowRight} size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {placement.connects ? <PageVisual visual={placement.connects} /> : null}
          </div>
        </Section>
      ) : null}

      {beforeClose?.(toneOf(content.sections.length + (content.connects ? 1 : 0)))}

      <ClosingBand id="next-title" title={closing.title} line={closing.line} />
    </>
  )
}

/**
 * A picture on the washes (E-131): in the glass frame the homepage's film sits
 * in, a thin ring of glass round it. A drawn screen is a glass window of its
 * own and takes no frame, so glass never sits in glass.
 */
export function GlassFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${home.glass} ${styles.glassFrame}`} data-glass="">
      {children}
    </div>
  )
}

/**
 * The page column's width (`Container`): 1280px from a 1376px window, where its gutters reach 48px, and under
 * that nearly the window's. The widest a picture in it is drawn.
 */
const CONTAINER_SIZES = '(min-width: 1376px) 1280px, 100vw'
/** The wider photo of a gallery strip, 7/12 of the column less the 16px gap; the narrower one asks for the same. */
const STRIP_SIZES = '(min-width: 1376px) 740px, (min-width: 768px) 60vw, 100vw'

interface GalleryBandViewProps {
  band: GalleryBand
  /** The calm band of the section it follows, so the photos read as part of it. */
  tone: SectionTone
}

/** Gallery photos between two sections: a pair in the page container, or one photo edge to edge. */
function GalleryBandView({ band, tone }: GalleryBandViewProps) {
  if (band.kind === 'banner') {
    return (
      <section aria-label="Pictures" className={`${tones[tone]} ${styles.banner}`}>
        {band.pictures.map((picture, index) => (
          <PageVisual key={index} visual={picture} sizes="100vw" />
        ))}
      </section>
    )
  }
  return (
    <section aria-label="Pictures" className={`${tones[tone]} ${styles.gallery}`}>
      <Container>
        <div className={band.kind === 'stripFlip' ? `${styles.galleryRow} ${styles.galleryRowFlip}` : styles.galleryRow}>
          {band.pictures.map((picture, index) => (
            <div key={index} className={styles.galleryItem}>
              <PageVisual visual={picture} sizes={STRIP_SIZES} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

interface PageVisualProps {
  visual: Visual
  /**
   * The page's hero picture: preloaded, and drawn the full width of the page
   * container under the headline, so it asks for a full-width file at a higher
   * quality (app screenshots carry small text that blurs at the default).
   */
  hero?: boolean
  /** The `sizes` hint for `next/image`; a picture edge to edge passes `100vw`. */
  sizes?: string
}

/** Next's default quality, and the higher one for hero pictures (both listed in `images.qualities`, next.config). */
const QUALITY = 75
const HERO_QUALITY = 90

/** A page picture: a photo, render or screenshot through `next/image`, or a hall animation. */
export function PageVisual({ visual, hero = false, sizes = HALF_COLUMN_SIZES }: PageVisualProps) {
  if ('video' in visual) return <SiteVideo video={visual.video} />
  return (
    <Image
      src={visual.src}
      alt={visual.alt}
      className={home.journeyPhoto}
      sizes={hero ? CONTAINER_SIZES : sizes}
      quality={hero ? HERO_QUALITY : QUALITY}
      preload={hero}
    />
  )
}

interface PageSectionBandProps {
  section: PageSection
  id: string
  tone: SectionTone
  layout: Layout
  photo: React.ReactNode
}

function PageSectionBand({ section, id, tone, layout, photo }: PageSectionBandProps) {
  const heading = <SectionHeading id={`${id}-title`} title={section.title} lead={section.lead} level={2} />
  if (layout === 'split') {
    return (
      <Section id={id} tone={tone} labelledBy={`${id}-title`}>
        <div className={home.journey}>
          <div className={styles.splitCopy}>
            {heading}
            <ItemList items={section.items} />
          </div>
          {photo}
        </div>
      </Section>
    )
  }
  return (
    <Section id={id} tone={tone} labelledBy={`${id}-title`}>
      {heading}
      <ItemList items={section.items} wide lead={layout === 'lead'} />
    </Section>
  )
}

interface ItemListProps {
  items: PageSection['items']
  /** Three columns from 1024px instead of one. */
  wide?: boolean
  /** The first section's larger titles. */
  lead?: boolean
}

/** Items as a plain list: a title and a line each, no boxes. */
function ItemList({ items, wide = false, lead = false }: ItemListProps) {
  const className = [styles.list, wide && styles.listWide, lead && styles.listLead].filter(Boolean).join(' ')
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.title}>
          <h3 className={styles.listTitle}>{item.title}</h3>
          <p className={styles.itemLine}>{item.line}</p>
        </li>
      ))}
    </ul>
  )
}

import Image, { type StaticImageData } from 'next/image'
import React from 'react'

import { HALF_COLUMN_SIZES, Section, type SectionTone } from '@/site/ui/primitives'

import { JOURNEY, type JourneyKey } from './content'
import styles from './home.module.css'

/**
 * One stage of an organiser's year (homepage v3): a heading, a lead, the list
 * of what Evemos does there, and a picture beside it (a photo or a product
 * screen with demo data). No step number or label over the heading: the
 * heading says the stage. `flip` puts the picture on the left; `wide` puts the
 * copy across the top and the picture under it at full width; `bleed` sets
 * narrower copy beside a picture that runs off the page's right edge.
 */
interface JourneySectionProps {
  stage: JourneyKey
  tone: SectionTone
  flip?: boolean
  /** Text across the top, picture below at full width: for a picture that needs the whole column. */
  wide?: boolean
  /** From 1024px, the picture runs off the page's right edge: for a window wider than its column (the app window). */
  bleed?: boolean
  visual: React.ReactNode
}

export function JourneySection({ stage, tone, flip = false, wide = false, bleed = false, visual }: JourneySectionProps) {
  const copy = JOURNEY[stage]
  const titleId = `${copy.id}-title`
  return (
    <Section id={copy.id} tone={tone} labelledBy={titleId}>
      <div
        className={[styles.journey, flip && styles.journeyFlip, wide && styles.journeyWide, bleed && styles.journeyBleed]
          .filter(Boolean)
          .join(' ')}
      >
        <div className={styles.journeyCopy}>
          <h2 id={titleId} data-reveal="0">
            {copy.title}
          </h2>
          <p className={styles.journeyLead} data-reveal="1">
            {copy.lead}
          </p>
          {copy.items.length > 0 ? (
            <ul className={styles.journeyList} data-reveal="2">
              {copy.items.map((item) => (
                <li key={item.title}>
                  <h3 className={styles.journeyItemTitle}>{item.title}</h3>
                  <p className={styles.journeyItemLine}>{item.line}</p>
                </li>
              ))}
            </ul>
          ) : null}
          {'note' in copy ? <p className={styles.journeyNote}>{copy.note}</p> : null}
        </div>
        <div className={styles.journeyVisual} data-reveal="3">
          {visual}
        </div>
      </div>
    </Section>
  )
}

interface PhotoProps {
  src: StaticImageData
  alt: string
}

/** A photo beside a journey stage: `radius-lg`, no outline. */
export function JourneyPhoto({ src, alt }: PhotoProps) {
  return (
    <Image
      src={src}
      alt={alt}
      className={styles.journeyPhoto}
      sizes={HALF_COLUMN_SIZES}
    />
  )
}

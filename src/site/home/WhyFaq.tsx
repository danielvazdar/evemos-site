import Image from 'next/image'
import React from 'react'

import { links } from '@/site/links'
import floorSupervisor from '@/site/photos/organiser-overlooking-exhibition-hall.jpg'
import { HALF_COLUMN_SIZES, Section, SectionHeading } from '@/site/ui/primitives'

import { FAQ, WHY } from './content'
import styles from './home.module.css'

/**
 * Who built it, without names (those are on /about), beside a photo of an
 * organiser looking over her hall, which settles into its frame as the block
 * shows (F-192c, home.module.css `.whyPhoto`).
 */
export function Why() {
  return (
    <Section id="why" tone="raised" labelledBy="why-title">
      <div className={styles.why}>
        <div>
          <SectionHeading id="why-title" title={WHY.title} level={2} />
          <blockquote className={styles.whyQuote}>
            <p>{WHY.quote}</p>
          </blockquote>
          <p className={styles.whyMore}>
            <a href={links.about}>{WHY.more}</a>
          </p>
        </div>
        <div className={styles.whyPhoto}>
          <Image src={floorSupervisor} alt={WHY.photoAlt} className={styles.journeyPhoto} sizes={HALF_COLUMN_SIZES} />
        </div>
      </div>
    </Section>
  )
}

/** The questions organisers ask, as a definition list (question, answer). */
export function Faq() {
  return (
    <Section id="faq" tone="paper" labelledBy="faq-title">
      <SectionHeading id="faq-title" title={FAQ.title} level={2} />
      <dl className={styles.faq}>
        {FAQ.items.map((item) => (
          <div key={item.question} className={styles.faqItem}>
            <dt className={styles.faqQuestion}>{item.question}</dt>
            <dd className={styles.faqAnswer}>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

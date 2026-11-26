import { CalendarDays } from 'lucide-react'
import React from 'react'

import { PRIMARY_ACTION } from '@/site/home/content'
import { links } from '@/site/links'

import styles from './ClosingBand.module.css'
import { FloorplanPattern } from './FloorplanPattern'
import { ButtonLink, Container } from './primitives'
import tones from './primitives.module.css'

interface ClosingBandProps {
  /** The section's heading id, for `aria-labelledby`. */
  id: string
  title: string
  line: string
}

/**
 * The end of a page: the site's violet close (`Section`'s `violet` tone, as the
 * homepage ends, E-131), full width, with the heading, one line and Book a demo
 * on the left, and the floorplan pattern bleeding off the right edge (brand
 * book §05: "a headline may sit on a solid hall-violet area beside it"; never
 * behind the text). On phones the pattern drops below the text.
 */
export function ClosingBand({ id, title, line }: ClosingBandProps) {
  return (
    <section aria-labelledby={id} className={`${tones.violet} ${styles.band}`}>
      <Container>
        <div className={styles.copy}>
          <h2 id={id}>{title}</h2>
          <p>{line}</p>
          <div>
            <ButtonLink href={links.demo} variant="onBrand" icon={CalendarDays}>
              {PRIMARY_ACTION}
            </ButtonLink>
          </div>
        </div>
      </Container>
      <div className={styles.pattern}>
        <FloorplanPattern />
      </div>
    </section>
  )
}

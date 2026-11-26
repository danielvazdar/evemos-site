import { CalendarDays } from 'lucide-react'
import React from 'react'

import { links } from '@/site/links'
import { ButtonLink, Section } from '@/site/ui/primitives'

import { HERO, PRIMARY_ACTION } from './content'
import styles from './home.module.css'

interface HeroProps {
  /** Beside the copy from 1024px, under it on a phone: the launch film. Empty draws nothing. */
  visual?: React.ReactNode
}

/** The headline word by word: each rises from under its line in turn (home.module.css `.heroWord`). */
const HEADLINE_WORDS = HERO.title.split(' ')

/**
 * The top of the homepage (v3, 2026-11-07): "Run the whole show." as the
 * page's one `h1` (E-94) with the one-liner (E-25, E-87) right under it, then the lead, the starting price and
 * "Book a demo" on the left, and the launch film on the right, large. No label
 * over the title: who it is for is in the title itself.
 *
 * On the washes (`open`, E-131), with the film in glass (F-192b). The headline's
 * words rise one after another on first paint, by CSS alone, so nothing waits on
 * script; the `h1` keeps its words as its text, with no `aria-label` in their place.
 */
export function Hero({ visual }: HeroProps) {
  return (
    <Section tone="open" labelledBy="hero-title">
      <div className={styles.hero}>
        <h1 id="hero-title" className={styles.heroTitle}>
          {HEADLINE_WORDS.map((word, index) => (
            <React.Fragment key={index}>
              {index > 0 ? ' ' : null}
              <span className={styles.heroWord}>
                <span style={{ '--word': index } as React.CSSProperties}>{word}</span>
              </span>
            </React.Fragment>
          ))}
        </h1>
        <p className={styles.heroOneLiner} data-reveal="0">
          {HERO.oneLiner}
        </p>
        <div className={styles.heroCopy} data-reveal="1">
          <p className={styles.heroLead}>{HERO.lead}</p>
          {HERO.price ? <p className={styles.heroPrice}>{HERO.price}</p> : null}
          <div className={styles.heroActions}>
            <ButtonLink href={links.demo} variant="primary" icon={CalendarDays}>
              {PRIMARY_ACTION}
            </ButtonLink>
            <ButtonLink href={links.howItWorks} variant="secondary">
              {HERO.secondary}
            </ButtonLink>
          </div>
        </div>
        {visual ? (
          <div className={styles.heroVisual} data-reveal="2">
            {visual}
          </div>
        ) : null}
      </div>
    </Section>
  )
}

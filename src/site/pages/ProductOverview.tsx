import { ArrowRight, CalendarDays } from 'lucide-react'
import React from 'react'

import { PRODUCT_NAME } from '@/lib/product'
import { PRIMARY_ACTION } from '@/site/home/content'
import home from '@/site/home/home.module.css'
import { links } from '@/site/links'
import productPhoto from '@/site/photos/floor-manager-with-tablet-and-radio.jpg'
import { PRODUCT_MENU } from '@/site/sitemap'
import { ButtonLink, ButtonRow, Section, SectionHeading, SiteIcon } from '@/site/ui/primitives'

import { GlassFrame, PageVisual } from './MarketingPage'
import styles from './MarketingPage.module.css'

export const OVERVIEW = {
  title: `Everything in ${PRODUCT_NAME}, stage by stage`,
  description: `Every module of ${PRODUCT_NAME}, in the order an organiser uses them: before the show, your exhibitors, show day and after.`,
  lead: 'One list of people and companies runs through every module, so the exhibitor you sign in March is the record that gets a badge in October.',
  photo: { src: productPhoto, alt: 'A floor manager with a tablet talks into a radio in a busy exhibition aisle.' },
} as const

/**
 * /product: the product menu as a page. Every stage of the organiser's year
 * with a card per module, each linking to its page. Built from
 * `PRODUCT_MENU`, so the page and the menu never disagree. A photo sits beside
 * the hero text, and the hall film plays once under both, in the same band.
 *
 * On the washes throughout (F-192d, E-131 Q4 = B): the hero's photo and film
 * in the glass frame, and every stage's module cards as glass key cards. The
 * page has no long reading, so it has no calm band.
 */
export function ProductOverview() {
  return (
    <>
      <Section tone="open" labelledBy="overview-title">
        <div className={styles.heroSplit}>
          <div className={styles.hero}>
            <SectionHeading id="overview-title" title={OVERVIEW.title} lead={OVERVIEW.lead} level={1} />
            <ButtonRow>
              <ButtonLink href={links.demo} variant="primary" icon={CalendarDays}>
                {PRIMARY_ACTION}
              </ButtonLink>
            </ButtonRow>
          </div>
          <div className={styles.heroVisual}>
            <GlassFrame>
              <PageVisual visual={OVERVIEW.photo} hero />
            </GlassFrame>
          </div>
        </div>
        <div className={styles.heroFilm}>
          <GlassFrame>
            <PageVisual visual={{ video: 'a-hall' }} />
          </GlassFrame>
        </div>
      </Section>
      {PRODUCT_MENU.groups.map((group, index) => {
        const id = `stage-${index + 1}`
        return (
          <Section key={group.title} id={id} tone="open" labelledBy={`${id}-title`}>
            <SectionHeading id={`${id}-title`} title={group.title} level={2} />
            <ul className={styles.grid}>
              {group.items.map((item) => (
                <li key={item.href} className={`${home.glass} ${home.keyCard}`} data-glass="">
                  <h3 className={styles.itemTitle}>
                    <a href={item.href} className={styles.cardLink}>
                      {item.label}
                      <SiteIcon icon={ArrowRight} size={16} />
                    </a>
                  </h3>
                  <p className={styles.itemLine}>{item.line}</p>
                </li>
              ))}
            </ul>
          </Section>
        )
      })}
    </>
  )
}

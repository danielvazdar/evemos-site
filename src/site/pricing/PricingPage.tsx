import { CalendarDays, Check } from 'lucide-react'
import React from 'react'

import { PRIMARY_ACTION } from '@/site/home/content'
import home from '@/site/home/home.module.css'
import { links } from '@/site/links'
import { PLAN_PRICES, planPrice, type StartingPrice } from '@/site/offer'
import { GlassFrame, PageVisual } from '@/site/pages/MarketingPage'
import pageStyles from '@/site/pages/MarketingPage.module.css'
import type { Visual } from '@/site/pages/types'
import pricingPhoto from '@/site/photos/organiser-and-exhibitor-coffee-meeting.jpg'
import { ButtonLink, ButtonRow, Chip, Section, SectionHeading, SiteIcon } from '@/site/ui/primitives'
import { ClosingBand } from '@/site/ui/ClosingBand'

import { ADD_ONS, FAQ, INTRO, PLANS, RECOMMENDED } from './content'
import styles from './pricing.module.css'

/** Beside the intro, split like a templated page's hero (F-118). */
const PHOTO: Visual = { src: pricingPhoto, alt: 'An organiser and an exhibitor talk over coffee and open notebooks at a café table beside the busy hall.' }

/** A card on the washes in glass (E-131 Q4 = B): the strong glass, without a frost of its own on a phone. */
const KEY_CARD = `${home.glass} ${home.keyCard}`

/**
 * /pricing: four plans with what each includes and its placeholder price (`offer.ts`, #241), what comes around them, and questions.
 *
 * The approved site demo's look (F-192e, E-131 Q4 = B): the hero, the plans and
 * what comes around them are on the washes, the hero's photo in the glass frame
 * and every card a glass key card. The recommended plan stays the one card
 * filled hall violet, so it is no glass: the glass's white would wash its white
 * text out. The questions are reading, on a calm band.
 */
export function PricingPage() {
  return (
    <>
      <Section tone="open" labelledBy="pricing-title">
        <div className={pageStyles.heroSplit}>
          <div className={pageStyles.hero}>
            <SectionHeading id="pricing-title" title={INTRO.title} lead={INTRO.lead} level={1} />
            <ButtonRow>
              <ButtonLink href={links.demo} variant="primary" icon={CalendarDays}>
                {PRIMARY_ACTION}
              </ButtonLink>
            </ButtonRow>
          </div>
          <div className={pageStyles.heroVisual}>
            <GlassFrame>
              <PageVisual visual={PHOTO} hero />
            </GlassFrame>
          </div>
        </div>
      </Section>

      <Section id="plans" tone="open" labelledBy="plans-title">
        <h2 id="plans-title" className="visually-hidden">
          Plans
        </h2>
        <ul className={styles.plans}>
          {PLANS.map((plan) => (
            <li key={plan.key} className={'recommended' in plan ? styles.recommended : KEY_CARD} data-glass={'recommended' in plan ? undefined : ''}>
              <div className={styles.planTop}>
                <h3>{plan.name}</h3>
                {'recommended' in plan ? <Chip tone="muted">{RECOMMENDED}</Chip> : null}
              </div>
              <p className={styles.planFor}>{plan.for}</p>
              <ul className={styles.includes}>
                {plan.includes.map((item) => (
                  <li key={item}>
                    <SiteIcon icon={Check} size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <PlanPrice price={PLAN_PRICES[plan.key]} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="add-ons" tone="open" labelledBy="add-ons-title">
        <SectionHeading id="add-ons-title" title={ADD_ONS.title} level={2} />
        <ul className={pageStyles.grid}>
          {ADD_ONS.items.map((item) => (
            <li key={item.title} className={KEY_CARD} data-glass="">
              <h3 className={pageStyles.itemTitle}>{item.title}</h3>
              <p className={pageStyles.itemLine}>{item.line}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="pricing-faq" tone="raised" labelledBy="pricing-faq-title">
        <SectionHeading id="pricing-faq-title" title="Questions about pricing" level={2} />
        <dl className={styles.faq}>
          {FAQ.map((item) => (
            <div key={item.question} className={styles.faqItem}>
              <dt className={styles.question}>{item.question}</dt>
              <dd className={styles.answer}>{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <ClosingBand id="pricing-next-title" title="Get a quote for your show" line="Book a demo, tell us how many exhibitors you host, and we'll send you a price." />
    </>
  )
}

/** A card's price: the amount large and what it buys muted under it, or "Price on request" for a plan without one. */
function PlanPrice({ price }: { price: StartingPrice | null }) {
  if (!price) return <p className={styles.quote}>Price on request</p>
  const { amount, per } = planPrice(price)
  return (
    <p className={styles.quote}>
      <span className={styles.amount}>{amount}</span> <span className={styles.per}>{per}</span>
    </p>
  )
}

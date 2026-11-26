import { CalendarDays, HardHat, IdCard, Link2, type LucideIcon, Mic, Newspaper, ScanLine, UserCheck, Users } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { PRIMARY_ACTION } from '@/site/home/content'
import home from '@/site/home/home.module.css'
import capabilities from '@/site/ui/DemoPreview.module.css'
import { links } from '@/site/links'
import { GlassFrame } from '@/site/pages/MarketingPage'
import badgeHandoff from '@/site/photos/registration-desk-badge-handoff.jpg'
import floorSupervisor from '@/site/photos/organiser-overlooking-exhibition-hall.jpg'
import { ClosingBand } from '@/site/ui/ClosingBand'
import {
  ButtonLink,
  ButtonRow,
  Chip,
  type ChipTone,
  HALF_COLUMN_SIZES,
  Section,
  SectionHeading,
  SiteIcon,
} from '@/site/ui/primitives'

import styles from './accreditation.module.css'
import { CLOSING, FAQ, GROUPS, HERO, RECORD, STEPS } from './content'

/**
 * The sections of /product/accreditation, top to bottom. Every line comes from
 * `content.ts`; this file only lays them out with the site's primitives.
 *
 * The photos are illustrations of an expo, not of a show that ran on the
 * product, and the page says nothing about them beyond their alt text.
 *
 * The approved site demo's look (F-192d, E-131 Q4 = B): the hero, the steps,
 * the groups and the record are on the washes, the hero's photo in the glass
 * frame, the step and group cards as glass key cards and the record's screen
 * a glass window; the questions are reading, on a calm band.
 */

/** The id of the steps section, for the hero's secondary link. */
export const STEPS_ID = 'how'

type StepKey = (typeof STEPS.steps)[number]['key']
type GroupKey = (typeof GROUPS.groups)[number]['key']

/** `Record`s over every key, so a new step or group in `content.ts` without an icon fails `tsc`. */
const STEP_ICONS: Readonly<Record<StepKey, LucideIcon>> = {
  link: Link2,
  apply: IdCard,
  approve: UserCheck,
  badge: ScanLine,
}

const GROUP_ICONS: Readonly<Record<GroupKey, LucideIcon>> = {
  press: Newspaper,
  crew: HardHat,
  speakers: Mic,
  team: Users,
}

// ── Demo data: invented people and outlets only ─────────────────────────────

const APPLICATIONS = [
  { who: 'Press · James Walker', from: 'Harbour Daily', tone: 'success', word: 'Approved' },
  { who: 'Crew · Oliver Hughes', from: 'Granite Build', tone: 'warning', word: 'Pending' },
  { who: 'Speaker · Sarah Mitchell', from: 'Panel, day 1', tone: 'success', word: 'Approved' },
  { who: 'Press · Daniel Price', from: 'Rheinland Radio', tone: 'danger', word: 'Rejected' },
] as const satisfies ReadonlyArray<{ who: string; from: string; tone: ChipTone; word: string }>

// ── Sections ────────────────────────────────────────────────────────────────

export function AccreditationHero() {
  return (
    <Section tone="open" labelledBy="accreditation-title">
      <div className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 id="accreditation-title" className={styles.heroTitle}>
            {HERO.title}
          </h1>
          <p className={home.heroLead}>{HERO.lead}</p>
          <ButtonRow>
            <ButtonLink href={links.demo} variant="primary" icon={CalendarDays}>
              {PRIMARY_ACTION}
            </ButtonLink>
            <ButtonLink href={`#${STEPS_ID}`} variant="secondary">
              {HERO.secondary}
            </ButtonLink>
          </ButtonRow>
        </div>
        <GlassFrame>
          <Image
            src={badgeHandoff}
            alt={HERO.photoAlt}
            className={home.journeyPhoto}
            sizes={HALF_COLUMN_SIZES}
            preload
          />
        </GlassFrame>
      </div>
    </Section>
  )
}

export function Steps() {
  return (
    <Section id={STEPS_ID} tone="open" labelledBy="steps-title">
      <SectionHeading id="steps-title" title={STEPS.title} level={2} />
      <ol className={home.audience}>
        {STEPS.steps.map((step, index) => (
          <li key={step.key} className={`${home.glass} ${home.keyCard}`} data-glass="">
            <div className={styles.stepTop}>
              <span className={home.iconTile}>
                <SiteIcon icon={STEP_ICONS[step.key]} size={20} />
              </span>
              <span className={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</span>
            </div>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.muted}>{step.line}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function Groups() {
  return (
    <Section id="groups" tone="open" labelledBy="groups-title">
      <SectionHeading id="groups-title" title={GROUPS.title} lead={GROUPS.lead} level={2} />
      <ul className={home.audience}>
        {GROUPS.groups.map((group) => (
          <li key={group.key} className={`${home.glass} ${home.keyCard}`} data-glass="">
            <span className={home.iconTile}>
              <SiteIcon icon={GROUP_ICONS[group.key]} size={20} />
            </span>
            <h3 className={styles.cardTitle}>{group.title}</h3>
            <p className={styles.muted}>{group.line}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** The record's screen: a glass window (DemoPreview.module.css), one piece. */
function ApplicationsPreview() {
  return (
    <div aria-hidden="true" className={`${home.glass} ${capabilities.preview}`} data-ui="" data-glass="">
      <p className={capabilities.previewHead}>
        <span>{RECORD.previewTitle}</span>
        <span className={capabilities.previewAside}>{RECORD.previewAside}</span>
      </p>
      <ul className={capabilities.rows}>
        {APPLICATIONS.map((application) => (
          <li key={application.who} className={capabilities.row}>
            <span className={styles.applicant}>
              <span>{application.who}</span>
              <span className={styles.applicantFrom}>{application.from}</span>
            </span>
            <Chip tone={application.tone}>{application.word}</Chip>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Record() {
  return (
    <Section id="record" tone="open" labelledBy="record-title">
      <div className={styles.record}>
        <div>
          <SectionHeading
            id="record-title"
            title={RECORD.title}
            lead={RECORD.lead}
            level={2}
          />
          <ul className={styles.points}>
            {RECORD.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <div className={styles.recordVisual}>
          <ApplicationsPreview />
          <Image
            src={floorSupervisor}
            alt={RECORD.photoAlt}
            className={styles.photo}
            sizes={HALF_COLUMN_SIZES}
          />
        </div>
      </div>
    </Section>
  )
}

export function Faq() {
  return (
    <Section id="faq" tone="paper" labelledBy="faq-title">
      <SectionHeading id="faq-title" title={FAQ.title} level={2} />
      <dl className={styles.faq}>
        {FAQ.items.map((item) => (
          <div key={item.question} className={styles.faqItem}>
            <dt className={styles.question}>{item.question}</dt>
            <dd className={styles.muted}>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

export function Closing() {
  return <ClosingBand id="closing-title" title={CLOSING.title} line={CLOSING.line} />
}

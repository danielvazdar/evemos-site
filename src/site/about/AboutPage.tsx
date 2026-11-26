import home from '@/site/home/home.module.css'
import { links } from '@/site/links'
import { GlassFrame, PageVisual } from '@/site/pages/MarketingPage'
import pageStyles from '@/site/pages/MarketingPage.module.css'
import planning from '@/site/photos/team-planning-trade-fair-hall-plan.jpg'
import hallBusy from '@/site/photos/busy-trade-show-hall.jpg'
import { Section, SectionHeading } from '@/site/ui/primitives'
import { ClosingBand } from '@/site/ui/ClosingBand'
import { PlainList } from '@/site/ui/PlainList'

import { CLOSING, COMPANY, INTRO, PRINCIPLES, STORY } from './content'
import styles from './about.module.css'
import { Offices } from './Offices'

/**
 * /about: the story (with the founder and the show he ran), how we build
 * Evemos, who builds it, and Book a demo. Copy in `content.ts`; layouts reuse
 * the homepage's journey and card styles.
 *
 * The approved site demo's look (F-192e, E-131 Q4 = B): the hero is on the
 * washes, its photo in the glass frame. The rest is reading, on the calm
 * bands, and the story's photo settles into its frame as it shows, as the
 * homepage's why photo does.
 */
export function AboutPage() {
  return (
    <>
      <Section tone="open" labelledBy="about-title">
        <div className={pageStyles.heroSplit}>
          <div className={pageStyles.hero}>
            <SectionHeading id="about-title" title={INTRO.title} lead={INTRO.lead} level={1} />
          </div>
          <div className={pageStyles.heroVisual}>
            <GlassFrame>
              <PageVisual visual={{ src: planning, alt: INTRO.photoAlt }} hero />
            </GlassFrame>
          </div>
        </div>
      </Section>

      <Section id="story" tone="raised" labelledBy="story-title">
        <div className={home.journey}>
          <div className={home.journeyCopy}>
            <h2 id="story-title">{STORY.title}</h2>
            {STORY.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className={home.whyPhoto}>
            <PageVisual visual={{ src: hallBusy, alt: STORY.photoAlt }} />
          </div>
        </div>
      </Section>

      <Section id="principles" tone="paper" labelledBy="principles-title">
        <SectionHeading id="principles-title" title={PRINCIPLES.title} level={2} />
        <PlainList items={PRINCIPLES.items} columns={3} />
      </Section>

      <Section id="company" tone="raised" labelledBy="company-title">
        <SectionHeading id="company-title" title={COMPANY.title} lead={COMPANY.line} level={2} />
        <p className={styles.founderMore}>
          <a href={links.team}>Meet the team</a>
        </p>
      </Section>

      <Offices tone="paper" />

      <ClosingBand id="about-closing-title" title={CLOSING.title} line={CLOSING.line} />
    </>
  )
}

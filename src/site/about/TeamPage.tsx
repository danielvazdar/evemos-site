
import { PRODUCT_NAME } from '@/lib/product'
import { TEAMS } from '@/site/company'
import { FOUNDER } from '@/site/founder'
import home from '@/site/home/home.module.css'
import { links } from '@/site/links'
import { GlassFrame, PageVisual } from '@/site/pages/MarketingPage'
import pageStyles from '@/site/pages/MarketingPage.module.css'
import { Section, SectionHeading } from '@/site/ui/primitives'
import { ClosingBand } from '@/site/ui/ClosingBand'
import { PlainList } from '@/site/ui/PlainList'

import styles from './about.module.css'
import { Offices } from './Offices'

export const TEAM_META = {
  title: `Team · ${PRODUCT_NAME}`,
  description: `Who builds ${PRODUCT_NAME}: an expo organiser and the teams behind the platform, in Zagreb, Osijek, Frankfurt and Tampa.`,
} as const

/**
 * /team: the founder (the only named person, src/site/company.ts), the teams
 * by function, and the offices. No invented people.
 *
 * The approved site demo's look (F-192e, E-131 Q4 = B): the hero, with the
 * hall film in the glass frame, and the founder's card, a glass key card, are
 * on the washes; the teams and the offices are reading, on the calm bands.
 */
export function TeamPage() {
  return (
    <>
      <Section tone="open" labelledBy="team-title">
        <div className={pageStyles.heroSplit}>
          <div className={pageStyles.hero}>
            <SectionHeading
              id="team-title"
              title="The people behind the software"
              lead={`${PRODUCT_NAME} is built by people who have stood behind the registration desk, and by the engineers who make the morning at the doors calm.`}
              level={1}
            />
          </div>
          <div className={pageStyles.heroVisual}>
            <GlassFrame>
              <PageVisual visual={{ video: 'a-hall-model' }} />
            </GlassFrame>
          </div>
        </div>
      </Section>

      <Section id="founder" tone="open" labelledBy="founder-title">
        <SectionHeading id="founder-title" title="Founder" level={2} />
        <div className={`${home.glass} ${home.keyCard}`} data-glass="">
          <h3 className={styles.cardTitle}>{FOUNDER.name}</h3>
          <p className={styles.muted}>
            {`Founder. Ran ${FOUNDER.show}, ${FOUNDER.showKind}, ${FOUNDER.years} before building ${PRODUCT_NAME}.`}
          </p>
          <p className={styles.founderMore}>
            <a href={links.about}>Read the story</a>
          </p>
        </div>
      </Section>

      <Section id="teams" tone="raised" labelledBy="teams-title">
        <SectionHeading id="teams-title" title="The teams" level={2} />
        <PlainList items={TEAMS.map(({ name, line }) => ({ title: name, line }))} columns={4} />
      </Section>

      <Offices tone="paper" />

      <ClosingBand id="team-next-title" title="Work with us" line="Running a show? Book a demo and we'll show you your next edition." />
    </>
  )
}

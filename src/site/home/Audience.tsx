import React from 'react'

import { PlainList } from '@/site/ui/PlainList'
import { Section, SectionHeading } from '@/site/ui/primitives'
import { SiteVideo } from '@/site/ui/SiteVideo'

import { AUDIENCE } from './content'
import styles from './home.module.css'

/**
 * "Everyone at your show, in one list" (homepage v3): the six groups an
 * organiser deals with, under a wide clip of a show floor, as a plain list
 * (no icon cards, design audit 2026-10-20).
 */
export function Audience() {
  return (
    <Section id="who" tone="paper" labelledBy="who-title">
      <div data-reveal="0">
        <SectionHeading id="who-title" title={AUDIENCE.title} level={2} />
      </div>
      <div className={styles.whoFilm} data-reveal="1">
        <SiteVideo video="a-expo-floor" wide />
      </div>
      <div data-reveal="2">
        <PlainList items={AUDIENCE.groups.map(({ title, line }) => ({ title, line }))} columns={3} />
      </div>
    </Section>
  )
}

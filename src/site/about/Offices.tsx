import React from 'react'

import { OFFICES } from '@/site/company'
import { PlainList } from '@/site/ui/PlainList'
import { Section, type SectionTone, SectionHeading } from '@/site/ui/primitives'

interface OfficesProps {
  tone: SectionTone
}

/** Where we are: city and country only (Daniel, 2026-10-20), as a plain list. Shared by About, Team and Contact. */
export function Offices({ tone }: OfficesProps) {
  return (
    <Section id="offices" tone={tone} labelledBy="offices-title">
      <SectionHeading id="offices-title" title="Where we are" level={2} />
      <PlainList
        items={OFFICES.map((office) => ({ title: office.city, line: office.country, note: 'note' in office ? office.note : undefined }))}
        columns={4}
      />
    </Section>
  )
}

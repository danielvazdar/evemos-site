import type { Metadata } from 'next'

import { META } from '@/site/accreditation/content'
import { AccreditationHero, Closing, Faq, Groups, Record, Steps } from '@/site/accreditation/sections'
import { links } from '@/site/links'
import { FloorplanPattern } from '@/site/ui/FloorplanPattern'

/**
 * The accreditation product page: the first page of the /product family
 * (docs/WEBSITE_PLAN.md §2), first because "press accreditation" is the
 * biggest search term in Europe and no competitor targets it
 * (docs/website/KEYWORD_RESEARCH.md). Copy in `src/site/accreditation/content.ts`.
 * Static content and no database read, rendered per request like the rest of
 * `(site)` (the CSP nonce, `layout.tsx`).
 */
export const metadata: Metadata = {
  title: { absolute: META.title },
  description: META.description,
  alternates: { canonical: links.accreditationPage },
}

export default function AccreditationPage() {
  return (
    <>
      <AccreditationHero />
      <Steps />
      <Groups />
      <FloorplanPattern />
      <Record />
      <Faq />
      <Closing />
    </>
  )
}

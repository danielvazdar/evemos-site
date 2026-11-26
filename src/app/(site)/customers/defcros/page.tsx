import type { Metadata } from 'next'

import { links } from '@/site/links'
import { CUSTOMER_STORY } from '@/site/pages/company'
import { MarketingPage } from '@/site/pages/MarketingPage'

/** The first customer story (named with Daniel's OK, 2026-10-20), at `links.customerStory`. Content in `src/site/pages/company.ts`. */
export const metadata: Metadata = {
  title: { absolute: CUSTOMER_STORY.meta.title },
  description: CUSTOMER_STORY.meta.description,
  alternates: { canonical: links.customerStory },
}

export default function Page() {
  return <MarketingPage content={CUSTOMER_STORY} />
}

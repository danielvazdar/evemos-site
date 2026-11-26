import type { Metadata } from 'next'

import { links } from '@/site/links'
import { CONTACT_PAGE } from '@/site/pages/company'
import { MarketingPage } from '@/site/pages/MarketingPage'
import { Offices } from '@/site/about/Offices'

/** /contact: demo, email, partnerships, and where we are, before the close. Content in `src/site/pages/company.ts`. */
export const metadata: Metadata = {
  title: { absolute: CONTACT_PAGE.meta.title },
  description: CONTACT_PAGE.meta.description,
  alternates: { canonical: links.contact },
}

export default function Page() {
  return <MarketingPage content={CONTACT_PAGE} beforeClose={(tone) => <Offices tone={tone} />} />
}

import type { Metadata } from 'next'

import { links } from '@/site/links'
import { SECURITY_PAGE } from '@/site/pages/company'
import { MarketingPage } from '@/site/pages/MarketingPage'

/** /security: where the data lives, consent, form protection. Content in `src/site/pages/company.ts`. */
export const metadata: Metadata = {
  title: { absolute: SECURITY_PAGE.meta.title },
  description: SECURITY_PAGE.meta.description,
  alternates: { canonical: links.security },
}

export default function Page() {
  return <MarketingPage content={SECURITY_PAGE} />
}

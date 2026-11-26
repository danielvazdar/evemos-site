import type { Metadata } from 'next'

import { links } from '@/site/links'
import { CAREERS_PAGE } from '@/site/pages/company'
import { MarketingPage } from '@/site/pages/MarketingPage'

/** /careers: open applications, no invented roles. Content in `src/site/pages/company.ts`. */
export const metadata: Metadata = {
  title: { absolute: CAREERS_PAGE.meta.title },
  description: CAREERS_PAGE.meta.description,
  alternates: { canonical: links.careers },
}

export default function Page() {
  return <MarketingPage content={CAREERS_PAGE} />
}

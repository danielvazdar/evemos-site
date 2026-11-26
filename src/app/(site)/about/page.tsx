import type { Metadata } from 'next'

import { AboutPage } from '@/site/about/AboutPage'
import { META } from '@/site/about/content'
import { links } from '@/site/links'

/**
 * /about: the story behind Evemos. Static content, no database read, rendered
 * per request like the rest of `(site)` (the CSP nonce, `layout.tsx`).
 */
export const metadata: Metadata = {
  title: { absolute: META.title },
  description: META.description,
  alternates: { canonical: links.about },
}

export default function Page() {
  return <AboutPage />
}

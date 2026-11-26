import type { Metadata } from 'next'

import { PRODUCT_NAME } from '@/lib/product'
import { LegalDocument } from '@/site/legal/LegalDocument'
import { TERMS_DOCUMENT } from '@/site/legal/terms-content'

/**
 * Evemos's own terms (F-022). The words live in
 * `src/site/legal/terms-content.ts`; this page only renders them. Static
 * content and no database read, rendered per request like the rest of
 * `(site)` (the CSP nonce, `layout.tsx`).
 */
export const metadata: Metadata = {
  title: `Terms · ${PRODUCT_NAME}`,
  description: TERMS_DOCUMENT.intro,
  alternates: { canonical: TERMS_DOCUMENT.path },
}

export default function TermsPage() {
  return <LegalDocument content={TERMS_DOCUMENT} />
}

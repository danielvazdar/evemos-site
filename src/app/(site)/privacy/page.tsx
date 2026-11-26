import type { Metadata } from 'next'

import { PRODUCT_NAME } from '@/lib/product'
import { CONTROLLER } from '@/site/legal/controller'
import { LegalDocument } from '@/site/legal/LegalDocument'
import { PRIVACY_DOCUMENT } from '@/site/legal/privacy-content'

/**
 * Evemos's own privacy notice (F-022). The words live in
 * `src/site/legal/privacy-content.ts`; this page only renders them. Static
 * content and no database read, rendered per request like the rest of
 * `(site)` (the CSP nonce, `layout.tsx`).
 */
export const metadata: Metadata = {
  title: `Privacy notice · ${PRODUCT_NAME}`,
  description: `How ${CONTROLLER.tradingName} handles personal data on the ${PRODUCT_NAME} website and in the platform.`,
  alternates: { canonical: PRIVACY_DOCUMENT.path },
}

export default function PrivacyPage() {
  return <LegalDocument content={PRIVACY_DOCUMENT} />
}

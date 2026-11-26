import type { Metadata } from 'next'

import { links } from '@/site/links'
import { META } from '@/site/pricing/content'
import { PricingPage } from '@/site/pricing/PricingPage'
import { pricingStructuredData } from '@/site/seo/structured-data'
import { JsonLd } from '@/site/ui/JsonLd'

/** /pricing: plans without prices (E-14 still open). */
export const metadata: Metadata = {
  title: { absolute: META.title },
  description: META.description,
  alternates: { canonical: links.pricing },
}

export default function Page() {
  return (
    <>
      <JsonLd data={pricingStructuredData()} />
      <PricingPage />
    </>
  )
}

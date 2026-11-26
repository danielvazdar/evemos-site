import React from 'react'

import { Mark } from '@/admin/Mark'
import { PRODUCT_NAME } from '@/lib/product'
import { links } from '@/site/links'

import styles from './chrome.module.css'

/**
 * The brand lockup as a link home: the Aisle E, then the wordmark, set in type
 * as the brand book says (Archivo 800 at width 125, lowercase by CSS, so the
 * name itself still comes from `PRODUCT_NAME`). The link's name is the product
 * name; the mark is decorative beside it.
 *
 * `Mark` lives in `src/admin` for now; moving it and `fonts.ts` to `src/brand`
 * is a follow-up (F-021 Risks).
 */
export function Lockup() {
  return (
    <a href={links.home} className={styles.lockup} aria-label={PRODUCT_NAME}>
      <Mark />
      <span className={styles.wordmark}>{PRODUCT_NAME}</span>
    </a>
  )
}

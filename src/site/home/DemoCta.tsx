import { Map as MapIcon } from 'lucide-react'
import React from 'react'

import { DEMO_SHOW_SIZES } from '@/collections/platform/DemoRequests'
import { readDemoRequestEmail } from '@/lib/server-env'
import { DemoRequestForm } from '@/site/demo/DemoRequestForm'
import { DEMO_EMAIL, demoMailto } from '@/site/links'
import { Section, SiteIcon } from '@/site/ui/primitives'

import { DEMO } from './content'
import styles from './home.module.css'

/**
 * The closing panel (F-021b), `#demo`: where every "Book a demo" on the site
 * lands (`links.demo`). Since F-192c the violet band itself, the approved
 * demo's close: the copy on the left, the booking form (F-021c2) on the right
 * as a white dialog; stacked on a phone.
 *
 * The form's own submit is the panel's "Book a demo": no second button here.
 * The address under the copy stays, for a visitor who would rather write, or
 * whose browser cannot run the form.
 *
 * Read per request, like the enquiry page: the Turnstile site key (`null`
 * shows the form's "not available" state, as the server would refuse every
 * post) and the demo inbox (`DEMO_REQUEST_EMAIL`, else `DEMO_EMAIL`), used by
 * the address line here and by the form's fallback lines alike. The layout already
 * renders per request (the CSP nonce), so Next stamps the nonce on
 * Turnstile's script.
 *
 * No demo length (F-021 Question 2, option B) and no reply-time promise.
 */
export function DemoCta() {
  const siteKey = process.env.TURNSTILE_SITE_KEY?.trim() || null
  // ONE inbox for the whole panel: the server's setting, else the public address.
  const inbox = readDemoRequestEmail() ?? DEMO_EMAIL

  return (
    <Section id="demo" tone="violet" labelledBy="demo-title">
      <div className={styles.demoPanel}>
        <div className={styles.demoCopy}>
          <h2 id="demo-title">{DEMO.title}</h2>
          <p className={styles.demoLine}>{DEMO.line}</p>
          <p className={styles.demoPoint}>
            <SiteIcon icon={MapIcon} size={20} />
            <span>{DEMO.point}</span>
          </p>
          <p className={styles.demoNote}>
            {DEMO.emailNote} <a href={demoMailto(inbox)}>{inbox}</a>.
          </p>
        </div>
        <DemoRequestForm
          siteKey={siteKey}
          fallbackEmail={inbox}
          showSizes={DEMO_SHOW_SIZES}
          labelledBy="demo-title"
        />
      </div>
    </Section>
  )
}

'use client'

import { useEffect } from 'react'

import { links } from '@/site/links'
import { Button, ButtonLink, ButtonRow, Section, SectionHeading } from '@/site/ui/primitives'

import styles from './error.module.css'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Error boundary for Evemos's own pages (F-021a). It renders inside the site
 * layout, so the header and footer stay; only the page area is replaced.
 * Styled from `src/site` alone: the organiser pages' error page and its classes
 * belong to the other root layout.
 *
 * `reset()` re-attempts the render, which is enough for a passing hiccup.
 *
 * Its message stands centred on the washes (F-192e), in its own words.
 */
export default function SiteError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Surface the error for triage, as the organiser pages' boundary does.
    console.error('Site error boundary caught:', error)
  }, [error])

  return (
    <Section tone="open" labelledBy="error-title">
      <div className={styles.message}>
        <SectionHeading id="error-title" title="This page didn't load" level={1} />
        <ButtonRow>
          <Button variant="primary" onClick={reset}>
            Try again
          </Button>
          <ButtonLink href={links.home} variant="secondary">
            Go to the homepage
          </ButtonLink>
        </ButtonRow>
      </div>
    </Section>
  )
}

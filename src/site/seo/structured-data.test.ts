/**
 * The site's own JSON-LD (F-115d), as the page ships it: one block that parses
 * as JSON, the nodes the spec names, every value taken from where the site
 * keeps it, and nothing the page cannot back up (no ratings, reviews, social
 * links or prices, #241).
 */
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import siteIcon from '@/app/(site)/icon.png'
import HomePage from '@/app/(site)/page'
import PricingRoute from '@/app/(site)/pricing/page'
import { PRODUCT_NAME } from '@/lib/product'
import { SITE_URL } from '@/lib/site-config'
import { FOUNDER } from '@/site/founder'
import { META } from '@/site/home/content'
import { CONTROLLER } from '@/site/legal/controller'
import { links } from '@/site/links'

import { homeStructuredData, organisationRef, pricingStructuredData } from './structured-data'

type Graph = { '@context': string; '@graph': Record<string, unknown>[] }

const FORBIDDEN = ['aggregateRating', 'review', 'sameAs', 'offers']

/** Every key anywhere in the value, nested objects and arrays included. */
const keysOf = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.flatMap(keysOf)
    : value && typeof value === 'object'
      ? Object.entries(value).flatMap(([key, inner]) => [key, ...keysOf(inner)])
      : []

/** The page's JSON-LD blocks, each parsed back from the HTML. */
const blocksOf = (html: string): Graph[] =>
  [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map(([, json]) => JSON.parse(json) as Graph)

describe('organisationRef', () => {
  it("is the guides' organisation exactly, key order included, so their output is unchanged", () => {
    expect(JSON.stringify(organisationRef())).toBe(JSON.stringify({ '@type': 'Organization', name: PRODUCT_NAME, url: SITE_URL }))
  })
})

describe('homepage', () => {
  const blocks = blocksOf(renderToStaticMarkup(createElement(HomePage)))

  it('renders one JSON-LD block that parses back to homeStructuredData()', () => {
    expect(blocks).toEqual([homeStructuredData()])
  })

  it('has Organization and SoftwareApplication, the product published by the organisation', () => {
    const [organisation, product] = homeStructuredData()['@graph'] as Record<string, unknown>[]
    expect(organisation).toEqual({
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: PRODUCT_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}${siteIcon.src}`,
      email: CONTROLLER.generalEmail,
      founder: { '@type': 'Person', name: FOUNDER.name },
    })
    expect(product).toEqual({
      '@type': 'SoftwareApplication',
      name: PRODUCT_NAME,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: META.description,
      url: SITE_URL,
      publisher: { '@id': organisation['@id'] },
    })
  })

  it('claims no rating, review, social profile or offer', () => {
    expect(keysOf(homeStructuredData()).filter((key) => FORBIDDEN.includes(key))).toEqual([])
  })
})

describe('pricing page', () => {
  const blocks = blocksOf(renderToStaticMarkup(createElement(PricingRoute)))
  const pricingUrl = `${SITE_URL}${links.pricing}`

  it('renders one JSON-LD block that parses back to pricingStructuredData()', () => {
    expect(blocks).toEqual([pricingStructuredData()])
  })

  it('has the breadcrumb Evemos → Pricing and the product at the pricing URL', () => {
    const [breadcrumb, product] = pricingStructuredData()['@graph'] as Record<string, unknown>[]
    expect(breadcrumb).toEqual({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: PRODUCT_NAME, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Pricing', item: pricingUrl },
      ],
    })
    expect(product).toMatchObject({ '@type': 'SoftwareApplication', name: PRODUCT_NAME, url: pricingUrl, publisher: { '@id': `${SITE_URL}/#organization` } })
  })

  it('claims no rating, review or social profile, and no offer while the prices are placeholders (#241)', () => {
    expect(keysOf(pricingStructuredData()).filter((key) => FORBIDDEN.includes(key))).toEqual([])
  })
})

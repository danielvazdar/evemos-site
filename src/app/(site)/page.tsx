import type { Metadata } from 'next'

import serviceOrders from '@/site/photos/exhibitor-stand-build-up-technician.jpg'
import { AppWindow } from '@/site/home/AppWindow'
import { Audience } from '@/site/home/Audience'
import { JOURNEY, META } from '@/site/home/content'
import { DemoCta } from '@/site/home/DemoCta'
import { FloorPlanPreview } from '@/site/home/FloorPlanPreview'
import { Hero } from '@/site/home/Hero'
import { HeroVideo } from '@/site/home/HeroVideo'
import { JourneyPhoto, JourneySection } from '@/site/home/Journey'
import { DemoDashboard, DemoEventChip } from '@/site/home/OverviewPreview'
import { PipelinePreview, RequestsPreview } from '@/site/home/Previews'
import { ShowDayVisual } from '@/site/home/ShowDayVisual'
import { Faq, Why } from '@/site/home/WhyFaq'
import { homeStructuredData } from '@/site/seo/structured-data'
import { JsonLd } from '@/site/ui/JsonLd'
import { SiteVideo } from '@/site/ui/SiteVideo'

/**
 * The homepage, v3 (2026-11-07, second design pass #146): an organiser's year
 * from start to finish. Hero with the launch film, the clickable hall plan
 * right under it, the other four stages (before the show, exhibitors, show
 * day, after), everyone at the show, why us, questions, and the demo form. Copy lives in
 * `src/site/home/content.ts`. Organisers' public pages live under
 * /events/<slug> (and later on their own subdomain), never here.
 *
 * The approved site demo's look (F-192b and c, E-131 Q4 = B): every section
 * with a product picture or a card on a photo is `open`, on the washes, with
 * its picture or card in glass; long reading sits on the calm bands. "Sell the
 * floor" shows the app's own dashboard and the sales board in one app window
 * (Q1 = A), its booths ring linking to the hall above.
 *
 * Every section id here must be in `HOME_SECTION_IDS` (`src/site/links.ts`),
 * the switch that shows the header and footer links to it; `page.test.tsx`
 * checks both ways.
 */
export const metadata: Metadata = {
  title: { absolute: META.title },
  description: META.description,
  alternates: { canonical: '/' },
  openGraph: { title: META.title, description: META.description },
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData()} />
      <Hero visual={<HeroVideo />} />
      <JourneySection stage="floorPlan" tone="open" wide visual={<FloorPlanPreview />} />
      <JourneySection
        stage="before"
        tone="open"
        bleed
        visual={
          <AppWindow
            chip={<DemoEventChip />}
            overview={<DemoDashboard floorPlanHref={`#${JOURNEY.floorPlan.id}`} />}
            sales={<PipelinePreview />}
          />
        }
      />
      <JourneySection
        stage="exhibitors"
        tone="open"
        flip
        visual={
          <>
            <JourneyPhoto
              src={serviceOrders}
              alt="During build-up, an exhibitor points at the screen on the stand wall while the organiser and a technician look on."
            />
            <RequestsPreview />
          </>
        }
      />
      <JourneySection stage="showDay" tone="open" visual={<ShowDayVisual />} />
      <JourneySection
        stage="after"
        tone="raised"
        flip
        visual={<SiteVideo video="a-hall" />}
      />
      <Audience />
      <Why />
      <Faq />
      <DemoCta />
    </>
  )
}

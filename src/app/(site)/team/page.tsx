import type { Metadata } from 'next'

import { TEAM_META, TeamPage } from '@/site/about/TeamPage'
import { links } from '@/site/links'

/** /team: the founder, the teams by function and the offices. */
export const metadata: Metadata = {
  title: { absolute: TEAM_META.title },
  description: TEAM_META.description,
  alternates: { canonical: links.team },
}

export default function Page() {
  return <TeamPage />
}

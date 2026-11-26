'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * The entrance motion of every marketing page (second design pass, #146):
 * each block of a section rises into place once, the first time it scrolls
 * into view, and the items of a list follow one after another.
 *
 * What moves: anything marked `data-reveal="n"` (n = 0–4 steps of `--ex-stagger`), plus,
 * tagged here so no page has to opt in, every direct block of a section's
 * container and every item of a list inside a section. Inside a product
 * fragment (`data-ui`) nothing is tagged: the fragment moves as one piece.
 *
 * ★ CONTENT NEVER WAITS ON SCRIPT. The hidden start state only applies under
 * `html.reveal-ready`, which this component sets; without script, or with
 * reduced motion, nothing is ever hidden. The styles live in `site.scss`.
 *
 * Mounted once in the site layout; it runs again on every client-side
 * navigation (`usePathname`), so a new page's blocks are tagged too.
 */
const READY_CLASS = 'reveal-ready'
const SHOWN_ATTRIBUTE = 'data-revealed'
const MAX_STEP = 4

/**
 * The parts that arrive one by one: a section's blocks, the items of any list,
 * and the blocks of an article (the guides and comparisons).
 */
const AUTO_TARGETS = 'main section > div > *, main li, main article > *, main article section > *'

function tagTargets(root: ParentNode): Element[] {
  for (const element of root.querySelectorAll(AUTO_TARGETS)) {
    if (element.hasAttribute('data-reveal') || element.closest('[data-ui]')) continue
    const siblings = element.parentElement ? [...element.parentElement.children] : [element]
    element.setAttribute('data-reveal', String(Math.min(siblings.indexOf(element), MAX_STEP)))
  }
  return [...root.querySelectorAll('[data-reveal]:not([data-revealed])')]
}

export function RevealOnScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute(SHOWN_ATTRIBUTE, '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    for (const element of tagTargets(document)) observer.observe(element)
    root.classList.add(READY_CLASS)
    return () => observer.disconnect()
  }, [pathname])

  return null
}

/**
 * Closing a site menu with its exit motion (F-192a; DESIGN.md "Website"). The
 * bar's dropdowns and the phone's sheet are `<details>`, which the browser
 * closes at once. With script, `data-closing` first plays the exit in the
 * stylesheet (a dropdown shrinks back into its button, the sheet slides out),
 * and `open` goes once it has run. With reduced motion, or a time that cannot
 * be read, the menu closes at once.
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** A motion token's time in ms (`280ms`, `0.65s`); 0 with reduced motion, or for a value that is not a time. */
export const exitMs = (value: string, reducedMotion: boolean): number => {
  const found = /^\s*(\d+(?:\.\d+)?)(ms|s)\s*$/.exec(value)
  if (reducedMotion || !found) return 0
  return Number(found[1]) * (found[2] === 's' ? 1000 : 1)
}

/** How long `element`'s exit runs: the motion token `token` as the element reads it, and the visitor's motion setting. */
export const menuExitMs = (element: Element, token: '--ex-t-fast' | '--ex-t-slow'): number =>
  exitMs(getComputedStyle(element).getPropertyValue(token), window.matchMedia(REDUCED_MOTION).matches)

/** The close each menu has under way. */
const closing = new WeakMap<HTMLDetailsElement, ReturnType<typeof setTimeout>>()

/** Whether `details` is on its way out. */
export const isClosing = (details: HTMLDetailsElement): boolean => closing.has(details)

/** Closes `details` once its exit has run `ms`, at once for 0; a second call while it runs changes nothing. */
export function closeMenu(details: HTMLDetailsElement, ms: number): void {
  if (!details.open || closing.has(details)) return
  if (ms === 0) {
    details.open = false
    return
  }
  details.setAttribute('data-closing', '')
  closing.set(
    details,
    setTimeout(() => {
      closing.delete(details)
      details.removeAttribute('data-closing')
      details.open = false
    }, ms),
  )
}

/** Keeps a closing menu open: its exit stops and it stays. */
export function keepOpen(details: HTMLDetailsElement): void {
  clearTimeout(closing.get(details))
  closing.delete(details)
  details.removeAttribute('data-closing')
}

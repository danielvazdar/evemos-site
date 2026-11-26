import type { LucideIcon } from 'lucide-react'
import React from 'react'

import styles from './primitives.module.css'

/**
 * The building blocks of Evemos's own pages (F-021): the homepage now, and the
 * product, pricing and profile pages after it. Small, typed, no hooks, so they
 * render in server and client components alike (the error page is a client
 * component).
 *
 * ★ Every value is a brand token or the app's glass and motion token
 * (`site.scss` loads both). `src/admin/admin-styles.test.ts` enforces it: no
 * colour literal, and glass, shadows and corners only through tokens. Buttons
 * are pills and press like the app's (E-131, a written exception to the brand
 * book's squarish corners).
 */

const cx = (...names: Array<string | false | undefined>): string => names.filter(Boolean).join(' ')

interface ContainerProps {
  children: React.ReactNode
}

/** The page column: the demo's 1280px at most, with a gutter that grows with the window from 16 to 48px (E-119). */
export function Container({ children }: ContainerProps) {
  return <div className={styles.container}>{children}</div>
}

/**
 * The `sizes` of a picture beside a section's copy: half the column less the 32px gap between them, 624px from a
 * 1376px window, where the column reaches 1280px and its gutters 48px; full width under 1024px, where they stack.
 */
export const HALF_COLUMN_SIZES = '(min-width: 1376px) 624px, (min-width: 1024px) 50vw, 100vw'

/**
 * `paper` and `raised` are the calm bands, for long reading. `open` has no band,
 * so the backdrop's washes show: a page's top part and every section with a
 * product picture or a card (E-131). `violet` is the close, one field of hall
 * violet (DESIGN.md "Website").
 */
export type SectionTone = 'paper' | 'raised' | 'open' | 'violet'

interface SectionProps {
  id?: string
  tone: SectionTone
  /** The id of the heading that names this section, for `aria-labelledby`. */
  labelledBy: string
  children: React.ReactNode
}

/** A full-width band of the page, in one of the four tones, with its content in the `Container`. */
export function Section({ id, tone, labelledBy, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cx(styles.section, styles[tone])}>
      <Container>{children}</Container>
    </section>
  )
}

interface SectionHeadingProps {
  /** Goes on the heading, so a `Section` can point `labelledBy` at it. */
  id: string
  title: string
  lead?: string
  /** 1 only for the page's one `h1`, which takes the `display` style; every section heading is 2. */
  level: 1 | 2
}

export function SectionHeading({ id, title, lead, level }: SectionHeadingProps) {
  const Heading = level === 1 ? 'h1' : 'h2'
  return (
    <div className={styles.heading}>
      <Heading id={id}>{title}</Heading>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </div>
  )
}

export type IconSize = 16 | 20

interface SiteIconProps {
  icon: LucideIcon
  size?: IconSize
}

/**
 * A Lucide icon as the brand book draws them: outline, 1.5px stroke, 16 or
 * 20px, in the colour of the text around it. Always decorative: whatever it
 * stands next to carries the words, so it is hidden from screen readers.
 */
export function SiteIcon({ icon: Icon, size = 20 }: SiteIconProps) {
  return (
    <Icon
      className={styles.icon}
      size={size}
      strokeWidth={1.5}
      color="currentColor"
      aria-hidden="true"
      focusable="false"
    />
  )
}

/** `onBrand` is the primary action on a hall-violet band: paper fill, ink text. */
export type ButtonVariant = 'primary' | 'secondary' | 'onBrand'

interface ButtonLinkProps {
  href: string
  variant: ButtonVariant
  icon?: LucideIcon
  /** The visible label is the accessible name, so it is plain text. */
  children: string
}

/**
 * A link that looks like a button. Always an `<a>`: every action on the site
 * goes somewhere, and a `<button>` that only navigates is a link in disguise.
 * Primary is the `hall-violet` fill, and a page has one primary label (Book a
 * demo, E-13). A pill that answers the moment it is pressed, like the app's.
 */
export function ButtonLink({ href, variant, icon, children }: ButtonLinkProps) {
  return (
    <a href={href} className={cx(styles.button, styles[variant])}>
      <span>{children}</span>
      {icon ? <SiteIcon icon={icon} size={20} /> : null}
    </a>
  )
}

interface ButtonProps {
  variant: ButtonVariant
  onClick: () => void
  children: string
}

/** A real `<button>`, for the rare action that stays on the page (the error page's "Try again"). Same look as `ButtonLink`. */
export function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button type="button" onClick={onClick} className={cx(styles.button, styles[variant])}>
      {children}
    </button>
  )
}

interface ButtonRowProps {
  children: React.ReactNode
}

/** Buttons side by side, wrapping onto their own lines on a narrow phone. */
export function ButtonRow({ children }: ButtonRowProps) {
  return <div className={styles.buttonRow}>{children}</div>
}

/**
 * The status tones from the brand book's table, plus `muted` for a chip that
 * labels rather than reports: `paper` with `ink`.
 */
export const CHIP_TONES = ['success', 'warning', 'danger', 'info', 'neutral', 'muted'] as const

export type ChipTone = (typeof CHIP_TONES)[number]

interface ChipProps {
  tone: ChipTone
  /** Always a word: colour alone fails a colour-blind organiser and a greyscale print-out. */
  children: string
}

/**
 * A square tag in the `label` style. Each tone is a fill with its own text
 * colour, exactly the pairings `src/brand/contrast-pairs.ts` measures. Like the
 * admin's `StatusChip`, an empty word draws nothing rather than a blank block.
 */
export function Chip({ tone, children }: ChipProps) {
  if (children.trim() === '') {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Chip (${tone}) got no word; a chip never shows colour alone, so nothing was drawn.`)
    }
    return null
  }
  return <span className={cx(styles.chip, styles[`chip-${tone}`])}>{children}</span>
}

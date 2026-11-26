import { Pause, Play } from 'lucide-react'
import React from 'react'

import { SiteIcon } from '@/site/ui/primitives'

import styles from './home.module.css'

/** The button's two names, in its owner's words: what it stops, and what it starts again. */
export interface PauseLabels {
  pause: string
  play: string
}

interface PauseButtonProps {
  /** Stopped by this button, so it offers Play. */
  paused: boolean
  onToggle: () => void
  labels: PauseLabels
}

/**
 * The one small stop for a picture that moves by itself for longer than WCAG
 * 2.2.2's five seconds (E-131, Q6 = A): the hero film and the show-day card. A
 * real button, outside the pictures' `aria-hidden`, named for what it does
 * and to what ("Pause film", then "Play film"), so the page's two stops read
 * apart; the icon only draws it. Its owner shows it only once script runs with
 * motion welcome, so it never sits there doing nothing.
 */
export function PauseButton({ paused, onToggle, labels }: PauseButtonProps) {
  return (
    <button type="button" className={styles.pause} onClick={onToggle}>
      <SiteIcon icon={paused ? Play : Pause} size={20} />
      <span className="visually-hidden">{paused ? labels.play : labels.pause}</span>
    </button>
  )
}

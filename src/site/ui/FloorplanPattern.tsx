import React from 'react'

import styles from './FloorplanPattern.module.css'

/**
 * The brand book's floorplan pattern: the hall from above, `paper` booths on
 * `hall-violet`, exactly one `badge-yellow` booth and one `lanyard-coral` booth
 * (coral is allowed here because this is a marketing surface).
 *
 * Rules it follows (brand book §05): it bleeds off both edges and is never
 * boxed, never sits behind text, no outlines or shadows, and it extends by
 * repeating rows, not by scaling tiles. A wider aisle falls after every second
 * row. Pure decoration, so it is hidden from screen readers.
 */

/** Booth widths in tiles, one string per row; 2 is a double booth. Each row is drawn twice (about 3,700px at 48px tiles), so it overflows any screen. */
const ROWS: readonly (readonly (1 | 2)[])[] = [
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1],
  [1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1],
]

/** [row, booth] of the one yellow booth and the one coral booth, both inside a laptop-width view. */
const YELLOW: readonly [number, number] = [1, 6]
const CORAL: readonly [number, number] = [2, 11]

const toneOf = (row: number, booth: number): string => {
  if (row === YELLOW[0] && booth === YELLOW[1]) return styles.yellow
  if (row === CORAL[0] && booth === CORAL[1]) return styles.coral
  return styles.free
}

/** An aisle after every second row, but not after the last: the band's own padding closes it. */
const hasAisleAfter = (row: number): boolean => row % 2 === 1 && row < ROWS.length - 1

export function FloorplanPattern() {
  return (
    <div className={styles.pattern} aria-hidden="true">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className={hasAisleAfter(rowIndex) ? `${styles.row} ${styles.aisleAfter}` : styles.row}>
          {[...row, ...row].map((span, boothIndex) => (
            <span
              key={boothIndex}
              className={`${styles.booth} ${span === 2 ? styles.double : styles.single} ${toneOf(rowIndex, boothIndex)}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

import React from 'react'

import styles from './PlainList.module.css'

export interface PlainListItem {
  title: string
  line: string
  /** A small word under the title (an office's "Headquarters"). */
  note?: string
}

interface PlainListProps {
  items: readonly PlainListItem[]
  /** Columns from 1024px. Two from 640px whatever this says. */
  columns?: 2 | 3 | 4
}

/**
 * Items without boxes or icons: a violet title and a line each, separated by
 * space. The design audit (2026-10-20) found rows of identical icon cards on
 * every page; this is the quieter alternative for lists that don't need a card.
 */
export function PlainList({ items, columns = 3 }: PlainListProps) {
  return (
    <ul className={`${styles.list} ${styles[`cols${columns}`]}`}>
      {items.map((item) => (
        <li key={item.title}>
          <h3 className={styles.title}>{item.title}</h3>
          {item.note ? <p className={styles.note}>{item.note}</p> : null}
          <p className={styles.line}>{item.line}</p>
        </li>
      ))}
    </ul>
  )
}

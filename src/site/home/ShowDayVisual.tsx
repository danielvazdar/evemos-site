import Image, { type StaticImageData } from 'next/image'
import React from 'react'

import badgeScanning from '@/site/photos/check-in-desk-badge-scanning.jpg'
import badgeHandoff from '@/site/photos/registration-desk-badge-handoff.jpg'
import visitorBadges from '@/site/photos/registration-desk-visitor-badges.jpg'
import entrancePhone from '@/site/photos/visitor-checking-phone-at-exhibition-entrance.jpg'
import { HALF_COLUMN_SIZES } from '@/site/ui/primitives'

import { ShowDayMotion } from './ShowDayMotion'
import styles from './ShowDayVisual.module.css'

/**
 * Show day on the homepage (F-192b, Q6 = A): the doors in four photographs
 * with the "Checked in today" card on them. The photos are drawn here, on the
 * server, and handed to `ShowDayMotion`, which changes between them and runs
 * the card: so the page ships no image code to the browser for them. They are
 * real pictures with the alt texts they carry elsewhere on the site (page.tsx,
 * product.ts), and every one is on the page for the image sitemap
 * (page-images.ts).
 */

interface DoorPhoto {
  src: StaticImageData
  alt: string
}

export const DOOR_PHOTOS: readonly DoorPhoto[] = [
  { src: badgeHandoff, alt: 'A member of staff at a trade-show registration desk hands a badge to a visitor.' },
  { src: badgeScanning, alt: "At the check-in desk, a staff member scans a visitor's QR badge while a new badge prints beside her." },
  { src: visitorBadges, alt: 'Staff at a registration desk by the hall entrance hand visitors their badges while a colleague checks a tablet.' },
  { src: entrancePhone, alt: 'A visitor with a lanyard checks his phone, coffee in hand, as he walks into the exhibition centre.' },
]

export function ShowDayVisual() {
  return (
    <ShowDayMotion
      photos={DOOR_PHOTOS.map((door) => (
        <Image
          key={door.src.src}
          src={door.src}
          alt={door.alt}
          fill
          sizes={HALF_COLUMN_SIZES}
          className={styles.photo}
        />
      ))}
    />
  )
}

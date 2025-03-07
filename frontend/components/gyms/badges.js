import React from 'react'
import styles from './badge.module.css'

export default function Badges({ data = { features: ['重量訓練'] } }) {
  return (
    <>
      <div className={styles.badgeRow}>
        {data.features.map((feature, i) => (
          <span key={i} className={styles.badge}>
            {feature}
          </span>
        ))}
      </div>
    </>
  )
}

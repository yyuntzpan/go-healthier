import React from 'react'
import styles from '@/styles/product-list.module.css'

export default function CardList({ id, name, price, img }) {
  const firstImage = img.split(',')[0]
  return (
    <>
      <div className={styles.cardsize}>
        <img
          src={`/product-img/${firstImage}`}
          alt=""
          className={`w-100 ${styles.imagradius}`}
        />
        <div className={styles.cardbody}>
          <h6 className={styles.cardText}>{name}</h6>
          <h6 className={styles.cardText}>售價:{price}</h6>
        </div>
      </div>
    </>
  )
}
//在上面傳進img  img src="/product-img/{img}"

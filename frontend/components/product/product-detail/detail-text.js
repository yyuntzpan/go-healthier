import React from 'react'
import styles from '@/components/product/product-detail/detail-text.module.css'
// import DetailBtncard from '../button/detail-btncard'
export default function DetailText({ price, desc, name }) {
  return (
    <>
      <div
        className="col-md-12"
        style={{
          paddingLeft: '50px',
        }}
      >
        <h3 className={styles.fountText}>{name}</h3>
        <h3 className={styles.fountPrice}>NT${price}</h3>
        <h5 className={styles.fountTitle}>商品介紹｜</h5>
        <p className={styles.fountP}>{desc}</p>
        <p className={styles.fountP}></p>
      </div>
    </>
  )
}

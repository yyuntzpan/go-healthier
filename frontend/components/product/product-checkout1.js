import React from 'react'
import styles from './product-checkout1.module.css'

export default function ProductCheckout1({ currentStep }) {
  return (
    <>
      <div className={`row ${styles.progressRow}`}>
        <div className={`col-2 col-md-2  ${styles.size}`}>
          <div
            className={`${styles.test} ${
              currentStep >= 1 ? styles.active : ''
            }`}
          >
            1
          </div>
          <div className={styles.checkFount}>檢視商品</div>
        </div>
        <div className={`col-1 col-md-1 ${styles.dash} `}>--------</div>
        <div className={`col-2 col-md-2 ${styles.size} `}>
          <div
            className={`${styles.test} ${
              currentStep >= 2 ? styles.active : ''
            }`}
          >
            2
          </div>
          <div className={styles.checkFount}>選擇配送</div>
        </div>
        <div className={`col-1 col-md-1 ${styles.dash} `}>--------</div>
        <div className={`col-2 col-md-2 ${styles.size}`}>
          <div
            className={`${styles.test} ${
              currentStep >= 3 ? styles.active : ''
            }`}
          >
            3
          </div>
          <div className={styles.checkFount}>選擇付款</div>
        </div>
        <div className={`col-1 col-md- ${styles.dash} `}>--------</div>
        <div className={`col-2 col-md-2 ${styles.size}`}>
          <div
            className={`${styles.test} ${
              currentStep >= 4 ? styles.active : ''
            }`}
          >
            4
          </div>
          <div className={styles.checkFount}>完成結帳</div>
        </div>
      </div>
    </>
  )
}

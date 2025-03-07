import React from 'react'
import styles from '@/styles/product-success.module.css'
import Layout4 from '@/components/layout/layout4'
import { useEffect } from 'react'
import Link from 'next/link'

export default function ProductSuccess() {
  useEffect(() => {
    // 清空 localStorage 裡的商品
    localStorage.removeItem('shoppingCart')
  }, [])
  useEffect(() => {
    // 清空 localStorage 裡的商品
    localStorage.removeItem('store711')
  }, [])
  return (
    <div>
      <Layout4 title="付款" pageName="products">
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.success}>付款成功！</div>
            <div className={styles.reminder}>記得要取貨喔～</div>
            <div className={styles.reserveInfo}>
              <div className={styles.infoRow}>
                <div className={styles.label}></div>
                <div className={styles.details}>
                  <div className={styles.lessonInfo}>
                    <br />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.btns}>
              <Link href="/users/orders" legacyBehavior>
                <button className={styles.btnBack}>檢視訂單</button>
              </Link>
              <Link href="/product" legacyBehavior>
                <a className={styles.btnFin}>回到商城頁</a>
              </Link>
            </div>
          </div>
        </div>
      </Layout4>
    </div>
  )
}

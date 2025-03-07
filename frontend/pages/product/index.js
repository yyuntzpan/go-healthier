import React from 'react'
import Layout4 from '@/components/layout/layout4'
import Index from '@/components/joinMember'
import IndexPhoto from '@/components/product/index-photo'
import styles from './index.module.css'

export default function ProductTest() {
  return (
    <Layout4
      title="商品類別"
      pageName="products"
      height="179px"
      section="flatSection"
    >
      <main>
        <IndexPhoto />
        <div className={styles.ss}>
          <Index />
        </div>
      </main>
    </Layout4>
  )
}

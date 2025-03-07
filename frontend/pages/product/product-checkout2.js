import React from 'react'
import styles from '@/styles/product-checkout2.module.css'
import ProductCheckout1 from '@/components/product/product-checkout1'
// import Checkout2CheckBox from '@/components/product/checkbox/checkout2-checkbox'
import Checkout2Input from '@/components/product/checkout2-input/checkout2-input'
import Checkout2Btn from '@/components/product/button/checkout2-btn'
import Navbar from '@/components/common/navbar'

export default function ProductCheckout2() {
  return (
    <>
      <Navbar />
      <div className="container">
        <ProductCheckout1 currentStep={3} />
        <div className="row">
          <div className={`col-12 col-md-12 text-center ${styles.Revise}`}>
            <h2>填寫收件人資料</h2>
          </div>
        </div>
        <Checkout2Input />
        {/* <Checkout2Btn /> */}
      </div>
    </>
  )
}

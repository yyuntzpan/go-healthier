import React from 'react'
import styles from '@/styles/product-checkout3.module.css'
import { IoCard } from 'react-icons/io5'
import ProductCheckout1 from '@/components/product/product-checkout1'
import Checkout3Order from '@/components/product/checkout3-order/checkout3-order'
// import CreditCardInput from '@/components/product/credit-card/credit-card-input'
import Navbar from '@/components/common/navbar'

export default function ProductCheckout3() {
  return (
    <>
      <Navbar />
      <div className="container">
        <ProductCheckout1 currentStep={4} />
      </div>
      <div className="container">
        <div className="row">
          <Checkout3Order />
          {/* <CreditCardInput /> */}
        </div>
      </div>
    </>
  )
}

import React from 'react'
import ProductCheckout1 from '@/components/product/product-checkout1'
import ProductAccordion from '@/components/product/accordion/product-accordion'
import Navbar from '@/components/common/navbar'

export default function ProductCheckout() {
  // const [store, setStore] = useState('')
  // useEffect(() => {
  //   fetch('third party api.....')
  // })
  return (
    <>
      <Navbar />
      {/* 結帳進度 */}
      <div className="container">
        <ProductCheckout1 currentStep={2} />
        {/* 結帳進度 */}
        {/* 手風琴 */}
        <ProductAccordion />
        <div className="col-12 col-md-8  mx-auto text-center">
          {/* 手風琴 end*/}
        </div>
      </div>
    </>
  )
}

// ProductDetail.js
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout4 from '@/components/layout/layout4'
import PhotoText from '@/components/product/product-detail/photo-text'
import ProductCarousel from '@/components/product/carousel/product-carousel'
import DetailText from '@/components/product/product-detail/detail-text'
import CardDetail from '@/components/product/card-detail/card-detail'
import { useCart } from '@/hooks/product/use-cart'
import AddToCartButton from '@/pages/product/AddToCartButton'
import { Toaster } from 'react-hot-toast'
import styles from '@/components/product/product-detail/detail-text.module.css'

export default function ProductDetail() {
  const router = useRouter()
  const { product, addItem, setProduct } = useCart()
  const [photodata, setPhotoData] = useState([])

  const getProduct = async (pid) => {
    const url = `http://localhost:3001/product/api/${pid}`

    try {
      const res = await fetch(url)
      const resData = await res.json()
      if (resData.success === true) {
        if (resData.data.length > 0) {
          setProduct(resData.data[0])
          setPhotoData(resData.photodata)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      const pid = router.query.pid
      getProduct(pid)
    }
  }, [router.isReady])

  return (
    <Layout4 title="商城" pageName="products" product={product}>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 col-md-6">
            <ProductCarousel photodata={photodata} />
          </div>
          <div className="col-12 col-md-6">
            <DetailText
              price={product.Product_price}
              desc={product.Product_desc}
              name={product.Product_name}
            />

            <AddToCartButton addItem={addItem} product={product} />
          </div>
        </div>
        <PhotoText photodata={photodata} desc={product.Product_desc} />
        <div className="row text-center align-items-center d-flex">
          <div className="col-12 col-md-12">
            <h2 style={{ marginTop: '50px', marginBottom: '50px' }}>
              你可能喜歡
            </h2>
          </div>
          <div className="col-12 col-md-12 d-flex flex-wrap justify-content-center">
            <CardDetail />
          </div>
        </div>
      </div>
      <Toaster />
    </Layout4>
  )
}

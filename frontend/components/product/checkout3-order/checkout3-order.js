import React, { useEffect } from 'react'
import styles from './checkout3-order.module.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAuth } from '@/context/auth-context' // useAuth 的鉤子
import axios from 'axios'

export default function Checkout3Order() {
  const [orderDetail, setOrderDetail] = useState([
    { ProductOrders_recipient_name: '' },
  ])

  const { auth } = useAuth()
  // console.log('auth:', auth)
  // console.log(orderDetail)
  const router = useRouter()

  //處理付款
  const handlePayment = async () => {
    console.log('Order ID:', router.query.order_id)
    try {
      const amount = orderDetail.reduce(
        (acc, item) =>
          acc +
          item.OrdersDetail_product_quantity *
            item.OrdersDetail_unit_price_at_time,
        0
      )

      const response = await axios.get(
        `http://localhost:3001/product-payment?amount=${amount}&orderId=${router.query.order_id}`
      )
      if (response.data.htmlContent) {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = response.data.htmlContent
        const form = tempDiv.querySelector('form')
        if (form) {
          document.body.appendChild(form)
          form.submit()
        } else {
          console.error('找不到支付表單')
        }
      } else {
        console.error('無效的回應格式')
      }
    } catch (error) {
      console.error('發生錯誤:', error)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      fetch(
        `http://localhost:3001/product/orderdetail?order_id=${router.query.order_id}`
      )
        .then((response) => response.json())
        .then((data) => {
          // console.log(data)
          setOrderDetail(data.orderDetail || [])
          console.log(orderDetail[0])
        })
      console.log(router.query.order_id)
    }
  }, [router.isReady, router.query.order_id])

  //計算總數量
  const calcTotalQty = () => {
    let total = 0
    for (let i = 0; i < orderDetail.length; i++) {
      total += orderDetail[i].OrdersDetail_product_quantity
    }
    return total
  }

  //時間insert在DB的 productorders Table裡
  // 獲取第一張圖片
  // 確認 orderDetail 是否有數據
  // if (orderDetail.length === 0 || !orderDetail[0].Product_photo) {
  //   return <div>Loading...</div>
  // }

  // 獲取第一張圖片
  // const firstPhoto = orderDetail[0].Product_photo.split(',')[0].trim()

  return (
    <>
      <div className={`col-12 col-md-6 mt-5 ${styles.box1}`}>
        <p
          style={{
            marginTop: '20px',
            color: '#1A394A',
            fontSize: '25px',
          }}
        >
          訂單明細
        </p>
        <div
          className="d-flex"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <p style={{ fontSize: '20px' }}>
            訂購人:{orderDetail[0].ProductOrders_recipient_name}
          </p>
          <p style={{ fontSize: '20px' }}>
            下訂日期: {orderDetail[0].orderDetail_time}
          </p>
        </div>
        <div
          className="col-12 col-md-12"
          style={{
            fontSize: '20px',
            borderTop: '1px solid #1A394A',
            borderBottom: '1px solid #1A394A',
          }}
        >
          訂單編號:{orderDetail[0].orderDetail_number}
        </div>
        <div>
          <table className="table" style={{ backgroundColor: '#FFF7E9 ' }}>
            <thead>
              <tr>
                <th scope="col" style={{ backgroundColor: '#FFF7E9 ' }}>
                  {/* # */}
                </th>
                <th scope="col" style={{ backgroundColor: '#FFF7E9 ' }}>
                  商品
                </th>
                <th scope="col" style={{ backgroundColor: '#FFF7E9 ' }}>
                  價格
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetail.map((v, i) => (
                <tr key={i}>
                  <th scope="row" style={{ backgroundColor: '#FFF7E9 ' }}>
                    {i + 1}
                  </th>
                  <td style={{ backgroundColor: '#FFF7E9 ' }}>
                    {v.Product_name} x {v.OrdersDetail_product_quantity}
                  </td>
                  <td style={{ backgroundColor: '#FFF7E9 ' }}>
                    {v.OrdersDetail_unit_price_at_time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-12 col-md-12">
          <div className={`d-flex justify-content-between ${styles.subtotal}`}>
            <span style={{ fontSize: '20px' }}>總數量:</span>
            <span style={{ fontSize: '20px' }}>{calcTotalQty()}</span>
            <span style={{ fontSize: '20px' }}>總金額:</span>
            <span style={{ fontSize: '20px' }}>
              NT$
              {orderDetail.reduce(
                (acc, item) =>
                  acc +
                  item.OrdersDetail_product_quantity *
                    item.OrdersDetail_unit_price_at_time,
                0
              )}
            </span>
          </div>
        </div>
      </div>
      <div className={`col-12 col-md-6 mt-5 h6 text-center ${styles.zzz}`}>
        <p className={styles.aa}>選擇付款方式</p>
        <div>
          <select
            id=""
            name=""
            className={styles.customSelect}
            aria-label="Default select example"
            style={{
              width: '70%',
              height: '50px',
              borderRadius: '50px',
              marginTop: '30px',
              marginBottom: '20px',
            }}
          >
            <option className="text-center">請選擇</option>
            <option value="" className="text-center">
              信用卡/金融卡{' '}
            </option>
            <option value="" className="text-center">
              line Pay
            </option>
            <option value="" className="text-center">
              貨到付款
            </option>
            <option value="" className="text-center"></option>
          </select>
        </div>
        <div
          className={`con-12 col-md-12 text-center d-flex justify-content-center align-items-center`}
        >
          <button className={styles.btn} type="botton" onClick={handlePayment}>
            完成付款
          </button>
        </div>
      </div>
    </>
  )
}

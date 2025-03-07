import React from 'react'
import styles from '@/styles/product-order.module.css'
import { IoClose } from 'react-icons/io5'
import { IoAddSharp, IoRemove } from 'react-icons/io5'
import ProductCheckout1 from '@/components/product/product-checkout1'
import { useState, useEffect } from 'react'
import { Link } from 'react-ionicons'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useRouter } from 'next/router'
import Navbar from '@/components/common/navbar'
import 'animate.css'
export default function ProductOrder() {
  const router = useRouter()
  const [orderItems, setOrderItems] = useState([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedItems = localStorage.getItem('shoppingCart')
      if (savedItems) {
        setOrderItems(JSON.parse(savedItems))
      }
      // console.log(savedItems)
    }
  }, [])
  const MySwal = withReactContent(Swal)
  useEffect(() => {
    document.body.style.overflowY = 'visible'
  }, [])
  return (
    <>
      <Navbar />
      {/* 結帳進度 */}
      <div className="container">
        <ProductCheckout1 currentStep={1} />
        {/* 結帳進度 */}
        <div className="row">
          <div className={`col-12 col-md-12 text-center ${styles.Revise}`}>
            <h3>1.檢視商品</h3>
          </div>
          <table className={`table ${styles.customTable}`}>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">商品</th>
                <th scope="col">商品名稱</th>
                <th scope="col">商品特色</th>
                <th scope="col">數量</th>
                <th scope="col">價格</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody style={{ fontSize: '20px' }}>
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td style={{ width: '20%' }}>
                    <img
                      src={`/product-img/${item.Product_photo}`}
                      alt=""
                      className="w-75 "
                      style={{ height: '200px' }}
                    />
                  </td>
                  <td style={{ width: '10%' }}>{item.Product_name}</td>
                  <td>{item.Product_desc}</td>
                  <td>
                    <div className="d-flex">
                      <div className={styles.contbtn}>
                        <IoAddSharp
                          style={{ color: 'white', fontSize: '20px' }}
                          onClick={() => {
                            const newItems = [...orderItems]
                            newItems[index].qty += 1
                            setOrderItems(newItems)
                            localStorage.setItem(
                              'shoppingCart',
                              JSON.stringify(newItems)
                            )
                          }}
                        />
                      </div>
                      <div
                        className={styles.contbtn}
                        style={{ backgroundColor: 'white', width: '30px' }}
                      >
                        {item.qty}
                      </div>
                      <div className={styles.contbtn}>
                        <IoRemove
                          style={{
                            color: 'white',
                            fontSize: '20px',
                          }}
                          onClick={() => {
                            const newItems = [...orderItems]
                            if (newItems[index].qty > 1) {
                              newItems[index].qty -= 1
                              setOrderItems(newItems)
                              localStorage.setItem(
                                'shoppingCart',
                                JSON.stringify(newItems)
                              )
                            } else {
                              if (confirm('這樣會整個刪掉喔!確定嗎?')) {
                                newItems.splice(index, 1)
                                setOrderItems(newItems)
                                localStorage.setItem(
                                  'shoppingCart',
                                  JSON.stringify(newItems)
                                )
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>{item.Product_price}</td>
                  <td>
                    <IoClose
                      style={{ fontSize: '40px', cursor: 'pointer' }}
                      onClick={() => {
                        if (confirm('要刪除嗎?')) {
                          const newItems = [...orderItems]
                          newItems.splice(index, 1)
                          setOrderItems(newItems)
                          localStorage.setItem(
                            'shoppingCart',
                            JSON.stringify(newItems)
                          )
                        }
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="row px-0 mx-0">
            <div
              className={`col-12 col-md-12 d-flex justify-content-between align-items-center ${styles.count}`}
            >
              <h6 style={{ paddingTop: '10px' }}>
                小計: 總商品數{' '}
                {orderItems.reduce((acc, item) => acc + item.qty, 0)}
              </h6>
              <h6 style={{ paddingTop: '10px' }}>
                總金額: NT$
                {orderItems
                  .reduce((acc, item) => acc + item.qty * item.Product_price, 0)
                  .toLocaleString()}
              </h6>
            </div>
          </div>
        </div>
        <div className="row">
          <div className={`col6 col-md-12 text-center h5 ${styles.kkk}`}>
            <button
              className={styles.btn}
              style={{ backgroundColor: '#6C6C6C' }}
              onClick={() => router.back()}
            >
              返回
            </button>
            <button
              className={styles.btn}
              onClick={() => {
                router.push('/product/product-checkout1')
              }}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

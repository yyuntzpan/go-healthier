import React, { useEffect, useState } from 'react'
import LayoutUser from '@/components/layout/user-layout3'
import OrderRow from '@/components/users/order-row'
import styles from '@/styles/user-orders.module.css'

export default function LessonsOrders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('suan-auth') || '{}')
        const userId = authData.id

        if (!userId) {
          throw new Error('User ID not found')
        }

        const response = await fetch(
          `http://localhost:3001/users/myOrders/${userId}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          console.error('Failed to fetch orders:', data.message)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <LayoutUser title="myLessons">
      <div className={styles.userinfo_orders}>
        <div className={styles.user_title}>
          <h4>我的訂單</h4>
        </div>
        <div>
          {orders.map((order) => (
            <OrderRow
              key={order.orderDetail_number}
              orderDetail_number={order.orderDetail_number}
              orderDate={order.orderDate}
              items={order.items}
              totalQuantity={order.totalQuantity}
              totalPrice={order.totalPrice}
            />
          ))}
        </div>
      </div>
    </LayoutUser>
  )
}

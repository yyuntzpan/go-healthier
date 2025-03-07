import React, { useEffect, useState } from 'react'
import LayoutUser from '@/components/layout/user-layout3'
import ReserveCard from '@/components/users/reserveCard'
import BranchCard from '@/components/users/branchCard'
import styles from '@/styles/user-profile.module.css'
import { useAuth } from '../../../context/auth-context'
import { useRouter } from 'next/router'
import { Link } from 'react-ionicons'

export default function Profile() {
  const { auth } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // 測試用避免 localStorage rander 錯誤
    const authData = JSON.parse(localStorage.getItem('suan-auth') || '{}')
    setUserId(authData.id)
  }, [])

  useEffect(() => {
    if (!auth.token) {
      // 如果用戶未登入，導到登入頁面，並添加 returnUrl 參數
      const returnUrl = encodeURIComponent(router.asPath)
      router.push(`/users/sign_in?returnUrl=${returnUrl}`)
    } else {
      // 如果用戶已登入，獲取用戶的預約資料
      fetch(`http://localhost:3001/users/myReservations/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setReservations(data.reservations)
          } else {
            console.error('Failed to fetch reservations')
          }
        })
        .catch((error) => console.error('Error:', error))
    }
  }, [auth.token, router, userId])

  // 如果用戶沒有登入，不rander頁面內容
  if (!auth.token) {
    return null
  }

  return (
    <>
      <LayoutUser title="myProfile">
        <div className={styles.userinfo_profile}>
          <div className={styles.user_title}>
            <h4>
              {auth.nick_name ? auth.nick_name : auth.name}
              ，讓我們啟動健康的新里程吧！
            </h4>
          </div>
          <div className={styles.title_describe}>
            <p className={styles.p_font}>即將到來的場館預約</p>
          </div>
          <div className={styles.card_1}>
            {reservations.slice(0, 4).map((reservation, index) => (
              <ReserveCard key={index} reservation={reservation} />
            ))}
            <div className={styles.more}>
              <a href="../users/bookings">
                <p className={styles.p_font}>點我看課程預約</p>
              </a>
            </div>
          </div>
          <div className={styles.card_2}>
            <BranchCard branch="myLessons" href="/users/lessons_orders" />
            <BranchCard branch="myOrders" href="/users/orders" />
            <BranchCard branch="myReserves" href="/users/bookings" />
            <BranchCard branch="myFavs" href="/users/favorites" />
          </div>
        </div>
      </LayoutUser>
    </>
  )
}

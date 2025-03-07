import React, { useEffect, useState, useCallback } from 'react'
import LayoutUser from '@/components/layout/user-layout3'
import styles from '@/styles/user-bookings.module.css'
import axios from 'axios'
import { useAuth } from '@/context/auth-context'
import Loader from '@/components/loader'

export default function LessonsOrders() {
  const [allBookings, setAllBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { auth } = useAuth()
  const [selectedMonth, setSelectedMonth] = useState(8)
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableDates, setAvailableDates] = useState([])

  const fetchBookings = useCallback(async () => {
    if (!auth.id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.get(
        `http://localhost:3001/users/bookings/${auth.id}`
      )
      if (response.data.success) {
        setAllBookings(response.data.bookings)
      } else {
        throw new Error('Failed to fetch bookings')
      }
    } catch (error) {
      console.error('獲取預約失敗:', error)
      setError('無法加載預約數據。請稍後再試。')
    } finally {
      setIsLoading(false)
    }
  }, [auth.id])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  useEffect(() => {
    if (selectedMonth) {
      const datesInMonth = allBookings
        .filter((booking) => {
          const bookingDate = new Date(booking.reserve_time)
          return bookingDate.getMonth() + 1 === selectedMonth
        })
        .map((booking) => new Date(booking.reserve_time).getDate())

      // 對日期進行排序並去重
      setAvailableDates([...new Set(datesInMonth)].sort((a, b) => a - b))

      setSelectedDate(null)
      setFilteredBookings([])
    } else {
      setAvailableDates([])
      setFilteredBookings([])
    }
  }, [selectedMonth, allBookings])

  useEffect(() => {
    if (selectedMonth && selectedDate) {
      const filtered = allBookings
        .filter((booking) => {
          const bookingDate = new Date(booking.reserve_time)
          return (
            bookingDate.getMonth() + 1 === selectedMonth &&
            bookingDate.getDate() === selectedDate
          )
        })
        .sort((a, b) => new Date(a.reserve_time) - new Date(b.reserve_time))
      setFilteredBookings(filtered)
    }
  }, [selectedDate, selectedMonth, allBookings])

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    )
  if (error) return <div>錯誤: {error}</div>

  return (
    <LayoutUser title="myBookings">
      <div className={styles.userinfo_bookings}>
        <div className={styles.user_select}>
          {/* <Select options={options} /> */}
        </div>
        <div className={styles.month}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
            <div
              key={month}
              className={`${styles.num} ${
                selectedMonth === month ? styles.active : ''
              }`}
              s
              onClick={() => setSelectedMonth(month)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedMonth(month)
                }
              }}
              role="button"
              tabIndex="0"
            >
              {month}月
            </div>
          ))}
        </div>
        {selectedMonth && (
          <div className={styles.date_card}>
            {availableDates.map((date, index) => (
              <div
                key={date}
                className={`${styles.card} ${
                  selectedDate === date ? styles.active : ''
                }`}
                onClick={() => setSelectedDate(date)}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    setSelectedMonth(date)
                  }
                }}
                role="button"
                tabIndex="0"
              >
                <div className={styles.num}>{date}</div>
                <div className={styles.week}>
                  <h4>
                    星期
                    {
                      ['日', '一', '二', '三', '四', '五', '六'][
                        new Date(2024, selectedMonth - 1, date).getDay()
                      ]
                    }
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={styles.schedule}>
          {filteredBookings.length === 0 ? (
            <p></p>
          ) : (
            filteredBookings.map((booking, index) => (
              <div key={index} className={styles.schedule_item}>
                <img
                  src="/users-img/icon-notebook.svg"
                  alt=""
                  className={styles.iconImg}
                />
                <div className={styles.flex}>
                  <h5>{booking.coach_name} 教練</h5>
                  <div className={styles.time_and_gym}>
                    <h6>
                      {new Date(booking.reserve_time).toLocaleString('zh-TW', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                        hourCycle: 'h23',
                      })}
                    </h6>
                    <h6>{booking.gym_name}</h6>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </LayoutUser>
  )
}

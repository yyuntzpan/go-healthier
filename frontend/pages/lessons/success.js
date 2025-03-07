import React, { useState, useEffect } from 'react'
import styles from '@/styles/lessonCheckout-modal.module.css'
import { useRouter } from 'next/router'
import Layout4 from '@/components/layout/layout4'
import axios from 'axios'
import { useAuth } from '@/context/auth-context'

export default function Success() {
  const { auth } = useAuth()
  const router = useRouter()
  const { orderNumber, lessonId } = router.query
  const [lesson, setLesson] = useState(null)

  useEffect(() => {
    const fetchLessonDetails = async () => {
      if (lessonId) {
        try {
          // 獲取課程詳情
          const response = await axios.get(
            `http://localhost:3001/lessons/api/${lessonId}`
          )
          if (response.data.success) {
            setLesson(response.data.lesson)

            // 發出更新訂單狀態的請求
            const updateResponse = await axios.post(
              'http://localhost:3001/lessons/update-order',
              { order_id: orderNumber },
              {
                headers: {
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            )
            console.log('更新訂單狀態響應:', updateResponse.data)
          }
        } catch (error) {
          console.error('獲取課程詳情或更新訂單狀態失敗:', error)
        }
      }
    }

    fetchLessonDetails()
  }, [lessonId, orderNumber, auth.token])

  const handleReturnToLessons = () => {
    router.push('/lessons')
  }

  if (!lesson) {
    return <div>載入中...</div>
  }

  const handleToOrder = () => {
    router.push('/users/lessons_orders')
  }

  return (
    <div>
      <Layout4 title="課程付款成功" pageName="lessons">
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.success}>付款成功！</div>
            <div className={styles.reminder}>記得準時出席喔～</div>
            <div className={styles.reserveInfo}>
              {/* <div className={styles.infoRow}>
                <div className={styles.label}>訂單編號</div>
                <div className={styles.details}>
                  <div className={styles.name}>{orderNumber}</div>
                </div>
              </div> */}
              {/* 修改版 */}
              <div className={styles.infoRow}>
                <div className={styles.label}>
                  課程名稱 <br />
                  所在場館 <br />
                  課程日期
                </div>
                <div className={styles.details}>
                  <div className={styles.lessonInfo}>
                    {lesson.lesson_name} <br />
                    {lesson.gym_name} <br />
                    {lesson.lesson_date}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.total}>
              <div>小計</div>
              <div>NT${lesson.lesson_price}</div>
            </div>
            <div className={styles.btns}>
              <button className={styles.btnBack} onClick={handleToOrder}>
                檢視訂單
              </button>
              <button className={styles.btnFin} onClick={handleReturnToLessons}>
                回到課程頁
              </button>
            </div>
          </div>
        </div>
      </Layout4>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import Layout4 from '@/components/layout/layout4'
import styles from '@/styles/lessonDetail.module.css'
import { IoCart, IoHeart } from 'react-icons/io5'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import Loader from '@/components/loader'

export default function Detail() {
  const [isLiked, setIsLiked] = useState(false)
  const [lesson, setLesson] = useState(null)
  const router = useRouter()
  const { pid } = router.query
  const [isLoading, setIsLoading] = useState(true)
  const { auth } = useAuth()

  useEffect(() => {
    const fetchLesson = async () => {
      if (pid) {
        setIsLoading(true)
        try {
          const response = await axios.get(
            `http://localhost:3001/lessons/api/${pid}`
          )
          if (response.data.success) {
            setLesson(response.data.lesson)
          } else {
            console.error('API request was not successful:', response.data)
          }
        } catch (error) {
          console.error('Error fetching lesson:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchLesson()
  }, [pid])

  // const handleClick = () => {
  //   setIsClicked(!isClicked)
  // }

  const handlePurchase = async () => {
    // 如果沒有登入token就強制導入登入頁面
    if (!auth.token) {
      router.push('/users/sign_in')
    } else if (lesson) {
      try {
        // 向後端發送創建訂單請求
        const response = await axios.post(
          'http://localhost:3001/lessons/create-order',
          {
            member_id: auth.id,
            lesson_id: lesson.lesson_id,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        )

        // 如果訂單創建成功，導向結帳頁面
        if (response.data.success) {
          // 導向結帳頁面，並傳遞訂單ID
          router.push({
            pathname: '/lessons/checkout',
            query: {
              lessonId: lesson.lesson_id,
              orderId: response.data.orderId,
            },
          })
        } else {
          console.error('創建訂單失敗')
        }
      } catch (error) {
        console.error('創建訂單時發生錯誤:', error)
      }
    }
  }

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (auth.token && pid) {
        try {
          const response = await axios.get(
            `http://localhost:3001/users/check-favoriteLesson/${auth.id}/${pid}`,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          )
          setIsLiked(response.data.isFavorite)
        } catch (error) {
          console.error('Error checking favorite status:', error)
        }
      }
    }

    checkFavoriteStatus()
  }, [auth.token, auth.id, pid])

  const handleLike = async () => {
    if (!auth.token) {
      router.push('/users/sign_in')
      return
    }

    try {
      if (isLiked) {
        await axios.delete(
          'http://localhost:3001/users/remove-lesson-favorite',
          {
            data: { member_id: auth.id, lesson_id: pid },
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        )
      } else {
        await axios.post(
          'http://localhost:3001/users/add-lesson-favorite',
          { member_id: auth.id, lesson_id: pid },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        )
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error updating favorite status:', error)
    }
  }

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    )
  }

  if (!lesson) {
    return <div>No lesson found</div>
  }

  return (
    <>
      <Layout4 title="課程列表" pageName="lessons">
        <div className={styles.content}>
          <div className={styles.lessson}>
            <div className={styles.imgContainer}>
              <img src={`/${lesson?.lesson_img}`} className={styles.img} />
            </div>
            <div className={styles.lessonText}>
              <div className={styles.lessonInfo}>
                <div className={styles.lessonName}>
                  {lesson.lesson_name} NT.{lesson.lesson_price}
                </div>
                <div className={styles.lessonCoach}>
                  教練：{lesson.coach_name} 教練
                </div>
                <div className={styles.lessonGym}>地點：{lesson.gym_name}</div>
                <div className={styles.lessonDate}>
                  時間：{lesson.lesson_date}
                </div>
              </div>
              <div className={styles.desc}>
                <div className={styles.descTitle}>課程描述</div>
                <p className={styles.lessonDesc}>{lesson.lesson_desc}</p>
              </div>
              <div className={styles.btn}>
                <button className={`${styles.btnLike}`} onClick={handleLike}>
                  <span
                    className={`${styles.icon} ${
                      isLiked ? styles.clicked : ''
                    }`}
                  >
                    <IoHeart />
                  </span>
                  <span>收藏</span>
                </button>
                <button className={styles.btnReserve} onClick={handlePurchase}>
                  <IoCart /> 購買
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout4>
    </>
  )
}

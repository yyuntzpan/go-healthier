import React, { useState, useEffect } from 'react'
import LayoutUser from '@/components/layout/user-layout3'
import Select from '@/components/common/select/select'
import LessonCard from '@/components/lessons/lessonCard'
import styles from '@/styles/user-lessonsorders.module.css'
import axios from 'axios'
import { useAuth } from '@/context/auth-context'

// 測試用資料，連到資料庫後要刪掉
// import lessons from '@/data/FavLessons.json'
import options from '@/data/FakeOptions.json'

export default function LessonsOrders() {
  const [lessonOrders, setLessonOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { auth } = useAuth()

  useEffect(() => {
    const fetchLessonOrders = async () => {
      if (auth.id) {
        try {
          const response = await axios.get(
            `http://localhost:3001/lessons/user-lessons/${auth.id}`,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          )
          if (response.data.success) {
            setLessonOrders(response.data.lessons)
          }
        } catch (error) {
          console.error('Error fetching lesson orders:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchLessonOrders()
  }, [auth.id, auth.token])

  // 產出卡片的函式, 參數 data=Array.map的v
  const renderCard = (lesson) => {
    return (
      <LessonCard
        key={lesson.lesson_id}
        title={lesson.lesson_name}
        price={`NT$ ${lesson.lesson_price}`}
        gym={lesson.gym_name}
        category={lesson.categories} // 这里使用从后端获取的课程类别
        imgSrc={`/${lesson.lesson_img}`}
      />
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  return (
    <>
      <LayoutUser title="myLessons">
        <div className={styles.userinfo_lessonsorders}>
          <div className={styles.user_title}>
            <h4>我的課程</h4>
          </div>
          <div className={styles.lessons_orders_search}>
            {lessonOrders.map((lesson) => renderCard(lesson))}
          </div>
        </div>
      </LayoutUser>
    </>
  )
}

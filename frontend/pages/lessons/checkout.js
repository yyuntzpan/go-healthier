import React, { useState, useEffect } from 'react'
import styles from '@/styles/lessonCheckout.module.css'
import { useRouter } from 'next/router'
import axios from 'axios'
import Loader from '@/components/loader'
import Head from 'next/head'

export default function Checkout() {
  const [lesson, setLesson] = useState(null)
  const router = useRouter()
  const { lessonId, orderId } = router.query
  const handleReturnToLessons = () => {
    router.push('/lessons')
  }

  const handlePayment = async () => {
    try {
      const amount = parseInt(lesson.lesson_price.replace(/,/g, ''), 10)
      const response = await axios.get(
        `http://localhost:3001/payment?amount=${amount}&lessonId=${
          lesson.lesson_id
        }&lessonName=${encodeURIComponent(
          lesson.lesson_name
        )}&orderId=${orderId}`
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
    const fetchLesson = async () => {
      if (lessonId) {
        try {
          const response = await axios.get(
            `http://localhost:3001/lessons/api/${lessonId}`
          )
          if (response.data.success) {
            setLesson(response.data.lesson)
          } else {
            console.error('API request was not successful:', response.data)
          }
        } catch (error) {
          console.error('Error fetching lesson:', error)
        }
      }
    }

    fetchLesson()
  }, [lessonId])

  // const handlePayment = () => {
  //   setShowSuccessModal(true)
  // }

  // const handleCloseModal = () => {
  //   setShowSuccessModal(false)
  // }

  // const handleFailModal = () => {
  //   setShowFailModal(true)
  // }

  // const handleCloseFailModal = () => {
  //   setShowFailModal(false)
  // }

  if (!lesson) {
    return (
      <div>
        <Loader />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>檢視課程訂單</title>
      </Head>
      <div className={styles.contain}>
        <div className={styles.title}>1、檢視您的訂單</div>
        <div className={styles.check}>
          <div className={styles.imgContain}>
            <img src={`/${lesson.lesson_img}`} />
          </div>
          <div className={styles.infos}>
            <div className={styles.infoN}>{lesson.lesson_name}</div>
            <div className={styles.infoT}>時間：{lesson.lesson_date}</div>
            <div className={styles.infoT}>地點：{lesson.gym_name}</div>
          </div>
        </div>
        <div className={styles.total}>
          <div className={styles.sum}>結帳金額</div>
          <div className={styles.num}>NT.{lesson.lesson_price}</div>
        </div>
        <div className={styles.btns}>
          <button className={styles.btnBack} onClick={handleReturnToLessons}>
            回到課程頁
          </button>
          <button className={styles.btnFin} onClick={handlePayment}>
            確認結帳
          </button>
        </div>
      </div>
    </>
  )
}

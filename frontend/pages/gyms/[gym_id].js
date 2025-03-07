import React, { useEffect, useReducer, useState, useRef } from 'react'
import Layout3 from '@/components/layout/layout3'
import styles from './gym_id.module.css'
import { IoCall, IoHeart } from 'react-icons/io5'
import Badges from '@/components/gyms/badges'
import { useRouter } from 'next/router'
import GymSwiper from '@/components/gyms/gym-swiper'
import FavHeart from '@/components/gyms/favHeart'
import { useAuth } from '@/context/auth-context'

export default function GymDetail({ gymId }) {
  const router = useRouter()
  // const { auth } = useAuth()
  const [gym, setGym] = useState(null)
  const { gym_id } = router.query
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [error, setError] = useState(null)

  //收藏功能
  const [isClicked, setIsClicked] = useState(false)

  const { auth } = useAuth()

  const checkFavStatus = async () => {
    if (!auth || !gym_id) return
    try {
      const response = await fetch(
        `http://localhost:3001/gyms/check-fav/${auth.id}/${gym_id}`
      )

      if (!response.ok) {
        throw new Error('檢查收藏狀態失敗了')
      }
      const contentType = response.headers.get('Content-Type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Oh no!檢查收藏狀態失敗了，沒有正確的回應JSON格式')
      }
      const { isFavorite } = await response.json()
      setIsClicked(isFavorite)
      return
    } catch (error) {
      console.error('檢查收藏狀態失敗:', error)
    }
  }

  const toggleFavorite = async () => {
    try {
      const method = isClicked ? 'DELETE' : 'POST'
      const response = await fetch(
        `http://localhost:3001/gyms/api/favorites/${auth.id}/${gym_id}`,
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: auth.id,
            gymId: gym_id,
          }),
        }
      )
      if (response.ok) {
        setIsClicked(!isClicked)
      }
      console.log(auth.id, gym_id)
      console.log('切換收藏狀態成功:', response)
    } catch (error) {
      console.error('切換收藏狀態失敗:', error)
    }
  }

  useEffect(() => {
    console.log(gym_id)
    console.log(auth)
    if (auth) {
      checkFavStatus()
    }
  }, [gym_id, auth])

  // fetch 資料函式
  const fetchGymData = async (gymId) => {
    if (!router.isReady) return null

    const url = `http://localhost:3001/gyms/api/${gymId}`
    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data && data.processedRow && data.processedRow.length > 0) {
        return data.processedRow[0]
      } else {
        console.error('API request was not successful:', data)
        setError('無法獲取健身房數據')
        return null
      }
    } catch (error) {
      console.error('Error fetching gym data:', error)
      setError('載入數據時發生錯誤')
      return null
    }
  }

  useEffect(() => {
    if (router.isReady && gym_id) {
      fetchGymData(gym_id)
        .then((gymData) => {
          if (gymData) {
            setGym(gymData)
            //console.log(gymData)
          }
        })
        .catch((error) => {
          console.error('Error fetching gym data:', error)
          setError('載入數據時發生錯誤')
        })
    }
  }, [gym_id, router.isReady])

  if (!gym) {
    return <div>沒有找到資料</div>
  }
  const handleReservation = () => {
    router.push(`/gyms/gym-reservation?Id=${gym_id}`)
  }

  return (
    <div>
      <Layout3 title="場館細節" pageName="gyms">
        <div className={`container ${styles.container}`}>
          <div className="row">
            <div className={`col-md-6 ${styles.imgContainerPC}`}>
              <GymSwiper gym={gym} />
            </div>
            <div className="col-md-6 ps-md-5">
              <div title="title-box" className={styles.px8}>
                <h3> {gym.gym_name} </h3>
                <h6>{gym.gym_subtitle}</h6>
              </div>{' '}
              <div className={styles.imgContainer}>
                {/* 預設第一張 或 點選下方縮圖切換照片*/}
                <img
                  src={`/${gym.image_list[0]}`}
                  alt="場館內部"
                  className={styles.coverImg}
                />

                <div className={styles.imgGroup}>
                  {gym.image_list.map((image, i) => (
                    <img
                      key={i}
                      src={`/${image}`}
                      alt="場館內部"
                      className={styles.otherImg}
                    />
                  ))}
                </div>
              </div>
              <div title="information-details">
                <div className={styles.basicInfo}>
                  <h6>{gym.gym_address}</h6>
                  <h6>{gym.gym_phone}</h6>
                  <Badges />
                </div>
                <div className={styles.btn}>
                  <button
                    className={`${styles.btnLike}`}
                    onClick={toggleFavorite}
                  >
                    <span
                      className={`${styles.icon} ${styles.heart} ${
                        isClicked ? styles.clicked : ''
                      }`}
                    >
                      <IoHeart />
                    </span>
                    <span>收藏</span>
                  </button>
                  <button
                    onClick={handleReservation}
                    className={styles.btnReserve}
                  >
                    <IoCall /> 預約
                  </button>
                </div>
                <div className={styles.details}>
                  <div>
                    <h5 className={styles.h5}>場館介紹｜</h5>
                    <p>{gym.gym_info}</p>
                  </div>
                  <div>
                    <h5 className={styles.h5}>收費方式｜</h5>
                    <ul className="p-font">
                      {gym.gym_price.map((price, i) => (
                        <li key={i}>
                          {price.type}: NT${price.amount}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className={styles.h5}>場館設備｜</h5>
                    <ol className="p-font">
                      {gym.gym_equipment.map((equipment, i) => (
                        <li key={i}>{equipment}</li>
                      ))}
                    </ol>
                  </div>
                </div>{' '}
              </div>
            </div>{' '}
          </div>
        </div>
      </Layout3>
    </div>
  )
}

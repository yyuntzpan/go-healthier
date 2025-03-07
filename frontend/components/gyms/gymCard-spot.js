import React, { useEffect, useState } from 'react'
import styles from './gymCard-spot.module.css'
import { IoHeart } from 'react-icons/io5'
import { useAuth } from '@/context/auth-context'
import LoginAlert from '@/hooks/login-alert/login-alert'
import { useRouter } from 'next/router'
import Link from 'next/link'

const GymCardSpot = ({ data, variant = 'A' }) => {
  const variantStyles = {
    A: 'w-100',
    B: 'w-97 transition-all duration-300 hover-scale',
  }

  const customCSS = `
.w-97 {
  width: 97.5%;
}
.transition-all {
  transition: all 0.3s ease-in-out;
}
.hover-scale:hover {
  transform: scale(1.1);
}
`
  useEffect(() => {
    // 檢查 window 是否存在
    if (typeof window !== 'undefined') {
      const style = document.createElement('style')
      style.textContent = customCSS
      document.head.appendChild(style)
    }
  }, [])

  const [isClicked, setIsClicked] = useState(false)
  const loginAlert = LoginAlert('登入後才能收藏唷～')
  const { auth } = useAuth()
  const router = useRouter()
  const checkFavStatus = async () => {
    if (!auth || !data.id) return
    try {
      const response = await fetch(
        `http://localhost:3001/gyms/check-fav/${auth.id}/${data.id}`
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
    if (!auth.id) {
      loginAlert.fire().then((result) => {
        result.isConfirmed ? router.push('/users/sign_in') : ''
      })
    } else {
      try {
        const method = isClicked ? 'DELETE' : 'POST'
        const response = await fetch(
          `http://localhost:3001/gyms/api/favorites/${auth.id}/${data.id}`,
          {
            method: method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: auth.id,
              gymId: data.id,
            }),
          }
        )
        if (response.ok) {
          setIsClicked(!isClicked)
        }
        console.log(auth.id, data.id)
        console.log('切換收藏狀態成功:', response)
      } catch (error) {
        console.error('切換收藏狀態失敗:', error)
      }
    }
  }

  useEffect(() => {
    console.log(data)
    console.log(auth)
    if (auth) {
      checkFavStatus()
    }
  }, [data?.id || data?.gym_id, auth])

  return (
    <div className={`${styles.card} ${variantStyles[variant]}`}>
      <div className={styles.imageContainer}>
        {data.images.length > 0 && (
          <img
            src={`/${data.images[0]}`}
            alt="場館圖片"
            className={styles.image}
            loading="lazy"
          />
        )}

        <div
          className={`${styles.heart} ${isClicked ? styles.clicked : ''}`}
          onClick={toggleFavorite}
          onKeyDown={toggleFavorite}
          role="button"
          tabIndex={0}
        >
          <IoHeart />
        </div>
      </div>
      <div className={styles.textBtn}>
        <div className={styles.content}>
          <Link href={`/gyms/${data.id}`}>
            <h6 className={styles.title}>{data.name}</h6>
          </Link>
          <div className="cardInfo">
            <p className={styles.smallFont}>{data.address}</p>
            <p className={styles.smallFont}>營業時間 | {data.businessHours}</p>
            <div className={styles.badgeRow}>
              {data.features.map((feature, i) => (
                <span key={i} className={styles.badge}>
                  {feature}
                </span>
              ))}

              {/* <span className={styles.badge}>500公尺</span> */}
            </div>
          </div>
        </div>
        {/* <a href="#" className={styles.bookButton}>
          <IoCall />
          預約
        </a> */}
      </div>
    </div>
  )
}

export default GymCardSpot

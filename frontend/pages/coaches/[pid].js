import React, { useEffect, useState } from 'react'
import Layout4 from '@/components/layout/layout4'
import styles from '@/styles/coachDetail.module.css'
import { IoCall, IoHeart } from 'react-icons/io5'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'

export default function Detail() {
  const { auth } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [coach, setCoach] = useState(null)
  const router = useRouter()
  const { pid } = router.query
  const [isLoading, setIsLoading] = useState(true)

  const handleReservation = () => {
    router.push(`/coaches/reservation?coachId=${pid}`)
  }

  useEffect(() => {
    const fetchCoachAndFavoriteStatus = async () => {
      if (pid) {
        setIsLoading(true)
        try {
          const coachResponse = await axios.get(
            `http://localhost:3001/coaches/api/${pid}`
          )
          if (coachResponse.data.success) {
            setCoach(coachResponse.data.coach)
          } else {
            console.error('Coach data not found')
          }

          if (auth.token && auth.id) {
            const favoriteResponse = await axios.get(
              `http://localhost:3001/users/check-favorite/${auth.id}/${pid}`,
              {
                headers: { Authorization: `Bearer ${auth.token}` },
              }
            )
            setIsLiked(favoriteResponse.data.isFavorite)
          } else {
            setIsLiked(false)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchCoachAndFavoriteStatus()
  }, [pid, auth])

  const handleLike = async () => {
    if (!auth.token) {
      router.push('/users/sign_in')
      return
    }

    try {
      if (isLiked) {
        await axios.delete('http://localhost:3001/users/remove-favorite', {
          data: { member_id: auth.id, coach_id: pid },
          headers: { Authorization: `Bearer ${auth.token}` },
        })
      } else {
        await axios.post(
          'http://localhost:3001/users/add-favorite',
          { member_id: auth.id, coach_id: pid },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        )
      }
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Error updating favorite status:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!coach) {
    return <div>No coach found</div>
  }

  return (
    <Layout4 title="教練列表" pageName="coaches">
      <div className={styles.content}>
        <div className={styles.coach}>
          <div className={styles.imgContainer}>
            <img
              src={`/${coach?.coach_img}`}
              className={styles.img}
              alt={coach.coach_name}
            />
          </div>
          <div className={styles.coachText}>
            <div className={styles.coachInfo}>
              <div className={styles.coachName}> {coach.coach_name} 教練</div>
              <div className={styles.coachGym}>地點：{coach.gym}</div>
              <div className={styles.coachGym}>擅長技能：{coach.skills}</div>
            </div>
            <div className={styles.desc}>
              <div className={styles.descTitle}>教練描述</div>
              <p className={styles.coachDesc}>{coach.coach_info}</p>
            </div>
            <div className={styles.btn}>
              <button className={`${styles.btnLike}`} onClick={handleLike}>
                <span
                  className={`${styles.icon} ${isLiked ? styles.clicked : ''}`}
                >
                  <IoHeart />
                </span>
                <span>收藏</span>
              </button>
              <button className={styles.btnReserve} onClick={handleReservation}>
                <IoCall /> 預約
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout4>
  )
}

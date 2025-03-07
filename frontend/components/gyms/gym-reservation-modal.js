import { useRouter } from 'next/router'
import React from 'react'
import styles from './gym-reservation-modal.module.css'
import moment from 'moment'

export default function GymReservationModal({
  onClose,
  formData,
  isLoggedIn,
  gymData,
}) {
  const router = useRouter()

  const handleReturnToSearch = () => {
    onClose()
    router.push('/gyms')
  }

  const joinMember = () => {
    router.push('/users/sign_in')
  }

  const formatDate = moment(formData.reservationTime).format('YYYY年MM月DD日')
  // const formatTime = moment(formData.reservationTime)
  //   .format('hh:mm A')
  //   .replace('AM', '上午')
  //   .replace('PM', '下午')

  const formatTime = (reservationTime) => {
    const time = moment(reservationTime)
    const formattedTime = time.format('hh:mm A')
    const period = time.hour() < 12 ? '上午' : '下午'
    const timeWithoutPeriod = formattedTime
      .replace('AM', '')
      .replace('PM', '')
      .trim()

    return `${period} ${timeWithoutPeriod}`
  }

  // 假設 formData.reservationTime 是一個有效的時間格式
  const formattedTime = formatTime(formData.reservationTime)

  console.log(formattedTime) // 例如：上午 09:30 或 下午 05:45
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h4 className={styles.success}>預約成功！</h4>
        <div className={styles.reserveInfo}>
          <div className={styles.infoRow}>
            <div className={styles.label}>預約人|</div>
            <div className={styles.details}>
              <div className={styles.name}>{formData.name}</div>
              <div className={styles.contact}>
                <div>{formData.email}</div>
                <div>{formData.phone}</div>
              </div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>預約場館 |</div>
            <div className={styles.coachInfo}>
              <div>{gymData.name}</div>
              <div>{gymData.address}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>預約時間 |</div>
            <div className={styles.reserveTime}>
              <div>{formatDate}</div>
              <div>{formattedTime}</div>
            </div>
          </div>
        </div>
        <div className={styles.nice}>
          <div className={styles.niceTitle}>貼心叮嚀</div>
          <div className={styles.niceRemind}>
            請至電子信箱查看預約確認資訊，教練確認後也將由專人電話聯繫，再請您注意來電：）
            <br />
            參觀時請提早10分鐘報到，並且穿著舒服好動的衣服，攜帶水壺以及毛巾唷！
            <br />
            期待見到您｜Join us, Be a Healthier !{' '}
            {/* 如果沒有登入就顯示加入會員btn */}
            {!isLoggedIn && (
              <button className={styles.join} onClick={joinMember}>
                加入會員
              </button>
            )}
          </div>
        </div>
        <div className={styles.btns}>
          <button className={styles.btnBack} onClick={onClose}>
            取消預約
          </button>
          <button className={styles.btnFin} onClick={handleReturnToSearch}>
            繼續搜尋
          </button>
        </div>
      </div>
    </div>
  )
}

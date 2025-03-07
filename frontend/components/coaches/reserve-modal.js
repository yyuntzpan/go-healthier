import React from 'react'
import styles from '@/styles/reserveModal.module.css'
import { useRouter } from 'next/router'
import 'animate.css'

function ReserveModal({
  onClose,
  formData,
  selectedCoach,
  isLoggedIn,
  className,
}) {
  const router = useRouter()

  const handleReturnToCoaches = () => {
    onClose()
    router.push('/coaches')
  }

  const joinMember = () => {
    router.push('/users/sign_in')
  }

  const bindex = () => {
    router.push('/')
  }

  return (
    <div className={styles.modalOverlay}>
      <div
        className={`${styles.modal}`}
        style={{
          animation: 'fadeInDown 1s ease-out',
        }}
      >
        <div className={styles.success}>預約成功！</div>
        <div className={styles.reserveInfo}>
          <div className={styles.infoRow}>
            <div className={styles.label}>預 約 人 |</div>
            <div className={styles.details}>
              <div className={styles.name}>{formData.name}</div>
              <div className={styles.contact}>
                <div>{formData.email}</div>
                <div>{formData.phone}</div>
              </div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>預約教練 |</div>
            <div className={styles.coachInfo}>
              <div>{selectedCoach?.coach_name} 教練</div>
              <div>{selectedCoach?.gym}</div>
              <div>{selectedCoach?.address}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>預約時間 |</div>
            <div className={styles.reserveTime}>
              <div>
                {formData.timeSlot === '1'
                  ? '2024/08/12 13:00'
                  : formData.timeSlot === '2'
                  ? '2024/08/12 14:00'
                  : formData.timeSlot === '3'
                  ? '2024/08/19 13:00'
                  : formData.timeSlot === '4'
                  ? '2024/08/31 14:00'
                  : formData.timeSlot}
              </div>
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
          <button className={styles.btnBack} onClick={bindex}>
            回到首頁
          </button>
          <button className={styles.btnFin} onClick={handleReturnToCoaches}>
            繼續搜尋
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReserveModal

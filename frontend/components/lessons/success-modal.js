import React from 'react'
import styles from '@/styles/lessonCheckout-modal.module.css'
import { useRouter } from 'next/router'

function SuccessModal({
  orderNumber,
  lessonName,
  lessonTime,
  lessonPlace,
  totalAmount,
  onClose,
}) {
  const router = useRouter()

  const handleReturnToLessons = () => {
    onClose()
    router.push('/lessons')
  }
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.success}>付款成功！</div>
        <div className={styles.reminder}>記得準時出席喔～</div>
        <div className={styles.reserveInfo}>
          <div className={styles.infoRow}>
            <div className={styles.label}>訂單編號</div>
            <div className={styles.details}>
              <div className={styles.name}>{orderNumber}</div>
            </div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>{lessonName}</div>
            <div className={styles.details}>
              <div className={styles.lessonInfo}>
                {lessonTime} <br />
                {lessonPlace}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.total}>
          <div>小計</div>
          <div>NT${totalAmount}</div>
        </div>
        <div className={styles.btns}>
          <button className={styles.btnBack} onClick={onClose}>
            檢視訂單
          </button>
          <button className={styles.btnFin} onClick={handleReturnToLessons}>
            回到課程頁
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal

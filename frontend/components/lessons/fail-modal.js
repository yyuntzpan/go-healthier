import React from 'react'
import styles from '@/styles/lessonCheckout-modal.module.css'

function FailModal({ onClose }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.success}>付款失敗...</div>
        <div className={styles.reminder}>要不要再檢查看看呢？</div>
        <div className={styles.btns}>
          <button className={styles.btnClose} onClick={onClose}>
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  )
}

export default FailModal

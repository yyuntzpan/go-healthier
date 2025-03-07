import React from 'react'
import styles from '../../styles/UserModal.module.css'

function UserModal({ onClose, alertMessage, userMessage }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.success}>{alertMessage}</div>
        <div className={styles.reminder}>{userMessage}</div>
        <div className={styles.btns}>
          <button className={styles.btnClose} onClick={onClose}>
            關閉視窗
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserModal

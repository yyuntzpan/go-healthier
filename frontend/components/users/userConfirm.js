import React from 'react'
import styles from '../../styles/UserModal.module.css'

function UserConfirm({
  onClose,
  onConfirm,
  confirmMessage,
  userConfirmMessage,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.success}>{confirmMessage}</div>
        <div className={styles.reminderConfirm}>{userConfirmMessage}</div>
        <div className={styles.btns}>
          <button className={styles.btnClose} onClick={onConfirm}>
            確定
          </button>
          <button className={styles.btnClose2} onClick={onClose}>
            取消
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserConfirm

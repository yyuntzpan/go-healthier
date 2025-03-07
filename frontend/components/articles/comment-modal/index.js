import React from 'react'
import { useRouter } from 'next/router'
import Btn from '../buttons_test'
import styles from './comment-modal.module.css'

function CommentModal({ onClose }) {
  const router = useRouter()
  const message = {
    true: {
      title: '留言成功!',
      messsage: '想要再看其他文章嗎? 點擊下面的按鈕看更多文章或查看其他留言',
    },
    false: {
      title: '留言失敗!',
      message:
        '您最近的一則留言未能成功發佈。我們非常期待您的參與，請您再試一次。如果您在留言過程中遇到任何問題，請告訴我們。我們很樂意協助您。點擊下面的按鈕看更多文章或查看其他留言',
    },
  }

  const resultMessage = message[true] || message.true
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.success}>{resultMessage.title}</div>
        <div className={styles.reminder}>
          想要再看其他文章嗎? 點擊下面的按鈕看更多文章或查看其他留言
        </div>
        <div className={styles.btns}>
          <Btn
            size="md"
            bgColor="outline"
            onClick={() => {
              router.push('/articles')
            }}
          >
            其他文章
          </Btn>
          <Btn size="md" bgColor="midnightgreen" onClick={onClose}>
            回到留言
          </Btn>
        </div>
      </div>
    </div>
  )
}

export default CommentModal

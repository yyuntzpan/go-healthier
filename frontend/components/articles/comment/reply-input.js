import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import useSubmitComment from '@/hooks/article-comment/useSubmitComment'
import CommentModal from '../comment-modal'
import Btn from '../buttons_test'
import LoginAlert from '@/hooks/login-alert/login-alert'
import 'animate.css'
import styles from './comment-input.module.css'

export default function ReplyInput({
  showInput = false,
  main = 0,
  sub = undefined,
}) {
  const router = useRouter()
  const { auth } = useAuth()
  const [comment, setComment] = useState('')
  const [wordCount, setWordCount] = useState(50)
  const [error, setError] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [showModal, setShowModal] = useState(false)
  const maxWordCount = 50
  const submitComment = useSubmitComment(
    auth,
    comment,
    setError,
    setErrorText,
    sub,
    main,
    setShowModal
  )

  const loginalert = LoginAlert('登入後才能留言喔~')

  const handleModalClose = () => {
    setShowModal(false)
    router.reload()
  }

  const textAreaChange = (e) => {
    const str = e.target.value
    let nextComment = str
    let nextWordCount = maxWordCount - nextComment.length

    if (nextWordCount > 0) {
      setError(false)
      setErrorText('')
    }
    if (nextWordCount < 0) {
      console.log(nextWordCount)
      nextComment = str.slice(0, 50)
      nextWordCount = 0
      setError(true)
      setErrorText('字數已到上限囉~')
    }

    setComment(nextComment)
    setWordCount(nextWordCount)
  }

  const handleClick = () => {
    if (!auth.id) {
      loginalert.fire().then((result) => {
        if (result.isConfirmed) {
          router.push('/users/sign_in')
        }
      })
    }
  }

  return (
    <>
      <div style={{ display: `${showInput ? 'block' : 'none'}` }}>
        <div className={styles.userComment}>
          <textarea
            className={`${
              error && error !== 'wordCount'
                ? styles.error
                : styles.normalBorder
            }`}
            onClick={handleClick}
            onChange={textAreaChange}
            onKeyDown={submitComment}
            placeholder="輸入文字來留下你的看法..."
            value={comment}
          />
        </div>
        <div className={styles.userCommentBtn}>
          <div
            className={`${styles.errorText} ${error ? styles.showError : ''}`}
          >
            {errorText}
          </div>
          <div className={styles.wordCount}>
            剩餘字數({wordCount}/{maxWordCount})
          </div>
          <div className={styles.submitBtn}>
            <Btn
              size="sm"
              bgColor="midnightgreen"
              maxWidth="94px"
              width="100%"
              onClick={submitComment}
            >
              送出
            </Btn>
          </div>
        </div>
      </div>
      {showModal && <CommentModal onClose={handleModalClose} />}
    </>
  )
}

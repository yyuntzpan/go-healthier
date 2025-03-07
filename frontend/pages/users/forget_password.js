import React, { useState, useRef } from 'react'
import styles from '../../styles/forgot-password.module.css'
import UserSignin from '../../components/layout/user-layout1'
import MyEmailInput from '@/components/users/MyEmailInput'
import MyBtn from '@/components/users/MyBtn'
import UserModal from '../../components/users/UserModal'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')

  const [emailError, setEmailError] = useState('')
  const [showSuccessIcon, setShowSuccessIcon] = useState(false)

  const lastRequestTime = useRef(0) //上次發送驗證信的時間
  const MIN_INTERVAL = 180000 //現在設定3分鐘內不得重複發送驗證信

  const handleSubmit = async (e) => {
    e.preventDefault()

    const sendMailNow = Date.now()
    if (sendMailNow - lastRequestTime.current < MIN_INTERVAL) {
      setAlertMessage('操作太頻繁，請稍後再試')
      setUserMessage('請於3分鐘後再申請一次')
      setIsModalOpen(true)
      return
    }

    lastRequestTime.current = sendMailNow

    try {
      const response = await fetch(
        'http://localhost:3001/users/test_forget_password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      )
      const data = await response.json()
      if (response.ok) {
        setAlertMessage('更改密碼申請已成功')
        setUserMessage('請確認您的電子郵件以重設密碼')
      } else {
        setAlertMessage('更改密碼申請失敗')
        setUserMessage(data.message || '發生錯誤，請稍後再試')
      }
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error:', error)
      setAlertMessage('發生錯誤')
      setUserMessage('請稍後再試')
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <UserSignin
        title="忘記密碼"
        description="別擔心，請在下方輸入您的電子信箱以更改忘記的密碼"
      >
        <div className={styles.userContainer}>
          <form
            className={styles.userForm}
            action="/forget_password"
            method="post"
            onSubmit={handleSubmit}
            noValidate
          >
            <MyEmailInput
              email={email}
              setEmail={setEmail}
              errorMessage={emailError}
              setErrorMessage={setEmailError}
              setShowSuccessIcon={setShowSuccessIcon}
              showSuccessIcon={false}
              checkEmailExists={false} //登入頁中不需要檢查 email 是否已存在
            />
            <MyBtn buttonText="送出" />
          </form>
        </div>
      </UserSignin>
      {isModalOpen && (
        <UserModal
          onClose={() => setIsModalOpen(false)}
          alertMessage={alertMessage}
          userMessage={userMessage}
        />
      )}
    </>
  )
}

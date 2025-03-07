import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../../../styles/forgot-password.module.css'
import UserSignin from '../../../components/layout/user-layout1'
import MyPasswordInput from '@/components/users/MyPasswordInput'
import MyBtn from '@/components/users/MyBtn'
import UserModal from '../../../components/users/UserModal'

export default function ForgetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { token } = router.query
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')

  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('')

  useEffect(() => {
    if (confirmPassword !== '' && confirmPassword !== newPassword) {
      setConfirmPasswordErrorMessage('兩次輸入的密碼不一致')
    } else {
      setConfirmPasswordErrorMessage('')
    }
  }, [newPassword, confirmPassword])

  useEffect(() => {
    if (token) {
      fetch(`http://localhost:3001/users/verify_reset_token?token=${token}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Token verification failed')
          }
          return response.json()
        })
        .then((data) => {
          setMessage(data.message)
        })
        .catch((error) => {
          setError(error.message)
          setAlertMessage('重置連結已過期或無效')
          setUserMessage('請重新申請重置密碼')
          router.push('/users/forget_password')
          setIsModalOpen(true)
        })
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setAlertMessage('密碼更改失敗')
      setUserMessage('輸入的密碼不相符，請重新輸入')
      setIsModalOpen(true)
      return
    }

    try {
      const response = await fetch(
        'http://localhost:3001/users/changePassword ',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Network response was not ok')
      }

      const data = await response.json()
      setAlertMessage('密碼更改成功')
      setUserMessage('您現在可以使用新密碼登錄')
      setIsModalOpen(true)
      setTimeout(() => {
        setIsModalOpen(false)
        router.push('/users/sign_in')
      }, 3000)
    } catch (error) {
      setError(error.message)
      setAlertMessage('發生錯誤，請稍後再試')
      setUserMessage(error.message)
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <UserSignin title="更改密碼" description="請在下方輸入您的新密碼">
        <div className={styles.userContainer}>
          <form className={styles.userForm} onSubmit={handleSubmit} noValidate>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}
            >
              <div className={styles.form_group_flex}>
                <label className={styles.user_label} htmlFor="password">
                  <p className={styles.p}>輸入您的新密碼</p>
                </label>
                <MyPasswordInput
                  password={newPassword}
                  setPassword={setNewPassword}
                  id="password"
                  name="password"
                  placeholder="請輸入您新的密碼"
                  errorMessage={passwordErrorMessage}
                  setErrorMessage={setPasswordErrorMessage}
                />
              </div>
              <div className={styles.form_group_flex}>
                <label className={styles.user_label} htmlFor="passowrd">
                  <p className={styles.p}>確認新密碼</p>
                </label>
                <MyPasswordInput
                  password={confirmPassword}
                  setPassword={setConfirmPassword}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="請再次輸入您的密碼"
                  errorMessage={confirmPasswordErrorMessage}
                  setErrorMessage={setConfirmPasswordErrorMessage}
                />
              </div>
            </div>
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

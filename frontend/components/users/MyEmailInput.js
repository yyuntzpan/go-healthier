import React, { useState, useEffect } from 'react'
import styles from '../../styles/sign-in.module.css'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { z } from 'zod'

const MyEmailInput = ({
  email,
  setEmail,
  errorMessage,
  setErrorMessage,
  showSuccessIcon,
  setShowSuccessIcon,
  checkEmailExists,
  onEmailCheck, //這是一個傳送給其他元件是否需要送出檢查email是否已存在的屬性
  checkEmailIsValid, //這是一個傳送給其他元件是否要送出email是否符合格式的屬性
}) => {
  const [timer, setTimer] = useState(null)
  const [isFocused, setIsFocused] = useState(false)

  const emailSchema = z.string().email({ message: '電子信箱格式有誤' })

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    setShowSuccessIcon(false) //初始化成功icon
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (email) {
      // 當輸入框失去焦點時，開始計時
      setTimer(
        setTimeout(async () => {
          const result = emailSchema.safeParse(email)
          if (!result.success) {
            setErrorMessage(result.error.errors[0].message)
            console.log('email格式錯誤:', result.error.errors[0].message)
            if (checkEmailIsValid) {
              checkEmailIsValid(false)
            } //通知父組件email格式錯誤
            if (onEmailCheck) {
              onEmailCheck(false)
            } // 不傳給註冊表單
          } else {
            setErrorMessage('')
            // 通知父組件email格式正確
            if (checkEmailIsValid) {
              checkEmailIsValid(true)
            }
            if (checkEmailExists) {
              // 發送請求檢查 email 是否已存在
              const res = await fetch(
                `http://localhost:3001/users/cheak_email`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                }
              )
              //若是用戶輸入的mail是被註冊過的，給個模糊的錯誤提示
              const data = await res.json()
              console.log('後端回傳:', data)
              if (data.exists) {
                setErrorMessage('資料錯誤，無法使用此電子郵件')
                console.log('此信箱已存在於資料庫之中')
                if (checkEmailIsValid) {
                  checkEmailIsValid(false)
                } //通知父組件email格式錯誤
                if (onEmailCheck) {
                  onEmailCheck(true) // 傳給註冊表單
                }
              } else {
                setShowSuccessIcon(true)
                console.log('此信箱沒有存在於資料庫之中')
                if (onEmailCheck) {
                  onEmailCheck(false) // 不傳給註冊表單
                }
              }
            }
          }
        }, 100)
      )
    }
  }

  useEffect(() => {
    if (timer) {
      clearTimeout(timer)
    }

    return () => clearTimeout(timer)
  }, [email])

  const renderIcon = () => {
    if (errorMessage) {
      return <FaExclamationCircle className={styles.myiconError} />
    }
    if (showSuccessIcon && email && !errorMessage) {
      return <FaCheckCircle />
    }
    return null
  }

  return (
    <div className={styles.input_container}>
      <input
        className={`${styles.user_input} ${
          errorMessage ? styles.error_input : ''
        }`}
        type="email"
        id="email"
        name="email"
        required
        value={email}
        onChange={handleEmailChange}
        onBlur={handleBlur}
        placeholder="example@example.com"
        onFocus={() => setIsFocused(true)}
      />
      <div
        className={`${styles.myicon} ${errorMessage ? styles.myiconError : ''}`}
      >
        {renderIcon()}
      </div>
      {errorMessage && (
        <div className={styles.error_message}>
          <p className={styles.tomatoP}>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

export default MyEmailInput

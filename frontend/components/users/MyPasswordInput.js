import React, { useState, useEffect } from 'react'
import styles from '../../styles/sign-in.module.css'
import { FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa'
import { z } from 'zod'

const MyPasswordInput = ({
  password,
  setPassword,
  id,
  name,
  placeholder,
  errorMessage,
  setErrorMessage,
  type = 'password',
  disabled, //如果是第三方登入的會員就不需要編輯密碼
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [timer, setTimer] = useState(null)
  const [isFocused, setIsFocused] = useState(false)

  const passwordSchema = z.string().min(5, { message: '密碼至少要有5個字元' })

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    setErrorMessage('') // 清除之前的錯誤信息
  }

  const handleBlur = () => {
    setIsFocused(false)
    if (password) {
      setTimer(
        setTimeout(() => {
          const result = passwordSchema.safeParse(password)
          if (!result.success) {
            setErrorMessage(result.error.errors[0].message)
          } else {
            setErrorMessage('')
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
  }, [password])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const renderIcon = () => {
    if (errorMessage) {
      return <FaExclamationCircle className={styles.myiconError} />
    }
    if (password.length > 0) {
      return showPassword ? <FaEyeSlash /> : <FaEye />
    }
    return null
  }

  return (
    <div className={styles.input_container}>
      <input
        className={`${styles.user_input} ${
          errorMessage ? styles.error_input : ''
        }`}
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        required
        value={password}
        onChange={handlePasswordChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        disabled={disabled} //如果是第三方登入的會員就不需要編輯密碼
      />
      <button
        type="button"
        className={`${styles.myicon} ${styles.buttonReset} ${
          errorMessage ? styles.myiconError : ''
        }`}
        onClick={errorMessage ? null : togglePasswordVisibility}
        disabled={!!errorMessage} // 使用 disabled 屬性來控制按鈕的啟用狀態
      >
        {renderIcon()}
      </button>

      {errorMessage && (
        <div className={styles.error_message}>
          <p className={styles.tomatoP}>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

export default MyPasswordInput

import React, { useEffect, useState } from 'react'
import styles from '../../styles/sign-in.module.css'
import styles2 from '../../styles/user-sign-up.module.css'
import { z } from 'zod'
import { FaExclamationCircle } from 'react-icons/fa'

const nameSchema = z
  .string()
  .min(2, '名字至少需要2個字符')
  .max(10, '名字不能超過10個字符')

const StepTwo = ({ name, setName, setIsNameValid }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [timer, setTimer] = useState(null)
  const [isFocused, setIsFocused] = useState(false)

  const validateName = (value) => {
    const result = nameSchema.safeParse(value)
    if (!result.success) {
      setErrorMessage(result.error.errors[0].message)
      setIsNameValid(false)
    } else {
      setErrorMessage('')
      setIsNameValid(true)
    }
  }
  const handleBlur = () => {
    setIsFocused(false)
    if (name) {
      console.log('Blur event triggered, setting timeout for validation')
      setTimer(
        setTimeout(() => {
          console.log('Validating input:', name)
          validateName(name)
        }, 100)
      )
    }
  }
  //當focus input時，將錯誤訊息清除
  const handleFocus = () => {
    setIsFocused(true)
    setErrorMessage('')
  }

  useEffect(() => {
    return () => {
      if (timer) {
        console.log('Clearing timeout')
        clearTimeout(timer)
      }
    }
  }, [timer])

  const renderIcon = () => {
    if (errorMessage) {
      return <FaExclamationCircle className={styles.myiconError} />
    }
    return null
  }

  return (
    <>
      <div className={styles.form_group_flex}>
        <div className={styles.form_group}>
          <div className={styles2.flex_row}>
            <div className={styles2.inline}>
              <h6 className={`${styles.h6} ${styles2.h6}`}>必填</h6>
            </div>
            <label className={styles.label} htmlFor="name">
              <p className={`${styles.p} ${styles2.label_p}`}>如何稱呼您?</p>
            </label>
          </div>
          <div className={styles.input_container}>
            <input
              className={`${styles.user_input} ${styles2.form_group_input}`}
              type="text"
              id="name"
              name="name"
              value={name}
              placeholder="請輸入您的名字"
              onChange={(e) => setName(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
            />
            <div
              className={`${styles.myicon} ${
                errorMessage ? styles.myiconError : ''
              }`}
            >
              {renderIcon()}
            </div>
            {errorMessage && (
              <div className={styles.error_message}>
                <p className={styles.tomatoP}>{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default StepTwo

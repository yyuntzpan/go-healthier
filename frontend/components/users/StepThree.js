import React, { useState, useEffect } from 'react'
import styles from '../../styles/sign-in.module.css'
import styles2 from '../../styles/user-sign-up.module.css'
import MyPasswordInput from './MyPasswordInput'

const StepThree = ({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) => {
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('')

  useEffect(() => {
    if (confirmPassword !== '' && confirmPassword !== password) {
      setConfirmPasswordErrorMessage('兩次輸入的密碼不一致')
    } else {
      setConfirmPasswordErrorMessage('')
    }
  }, [password, confirmPassword])

  //modal的錯誤訊息
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value)
    if (value !== password) {
      setConfirmPasswordErrorMessage('兩次輸入的密碼不一致')
    } else {
      setConfirmPasswordErrorMessage('')
    }
  }

  return (
    <>
      <div className={styles.form_group_flex}>
        <div className={styles.form_group}>
          <div className={styles2.flex_row}>
            <div className={styles2.inline}>
              <h6 className={`${styles.h6} ${styles2.h6}`}>必填</h6>
            </div>
            <label className={styles.label} htmlFor="password">
              <p className={`${styles.p} ${styles2.label_p}`}>請輸入密碼</p>
            </label>
          </div>
          <div>
            <MyPasswordInput
              password={password}
              setPassword={setPassword}
              id="password"
              name="password"
              placeholder="請輸入您的密碼"
              errorMessage={passwordErrorMessage}
              setErrorMessage={setPasswordErrorMessage}
            />
          </div>
        </div>
      </div>
      <div className={styles.form_group_flex}>
        <div className={styles.form_group}>
          <div className={styles2.flex_row}>
            <div className={styles2.inline}>
              <h6 className={`${styles.h6} ${styles2.h6}`}>必填</h6>
            </div>
            <label className={styles.label} htmlFor="confirmPassword">
              <p className={`${styles.p} ${styles2.label_p}`}>再確認一次密碼</p>
            </label>
          </div>
          <div>
            <MyPasswordInput
              password={confirmPassword}
              setPassword={handleConfirmPasswordChange}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="請再次輸入您的密碼"
              errorMessage={confirmPasswordErrorMessage}
              setErrorMessage={setConfirmPasswordErrorMessage}
            />
          </div>
        </div>
      </div>
    </>
  )
}
export default StepThree

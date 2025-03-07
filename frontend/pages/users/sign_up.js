import React, { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/sign-in.module.css'
import styles2 from '../../styles/user-sign-up.module.css'
import UserSignup from '@/components/layout/user-layout2'
import StepOne from '../../components/users/StepOne'
import StepTwo from '../../components/users/StepTwo'
import StepThree from '../../components/users/StepThree'
import MyBtn from '@/components/users/MyBtn'
import UserModal from '../../components/users/UserModal'

export default function SignUp() {
  const router = useRouter()
  const [step, setStep] = useState(1) //當前表單的步驟，預設為第一步
  const [currentStep, setCurrentStep] = useState(1) //當前圈圈步驟，預設為第一步

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')

  const [isEmailExists, setIsEmailExists] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isNameValid, setIsNameValid] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    //email驗證
    if (isEmailExists) {
      setAlertMessage('資料錯誤')
      setUserMessage('請檢查電子信箱')
      setIsModalOpen(true)
      console.log('此信箱已存在於資料庫之中')
      return
    }
    // Password 驗證
    if (password !== confirmPassword) {
      setAlertMessage('資料錯誤')
      setUserMessage('兩次輸入的密碼不一致')
      setIsModalOpen(true)
      console.log('輸入的密碼不相符')
      return
    }

    if (!password || !confirmPassword) {
      setAlertMessage('資料錯誤')
      setUserMessage('請輸入密碼')
      setIsModalOpen(true)
      console.log('輸入密碼以及確認密碼是必須的')
      return
    }

    console.log('送出', name, email, password)

    const res = await fetch('http://localhost:3001/users/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // 要傳遞的資料
      body: JSON.stringify({ name, email, password }),
    })

    const result = await res.json()
    if (result.success) {
      setAlertMessage('註冊成功')
      setUserMessage('歡迎加入我們，請登入您的帳戶')
      setIsModalOpen(true)
      setTimeout(() => {
        setIsModalOpen(false)
        router.push('sign_in') // 跳到登入頁面
      }, 3000)
    } else {
      setAlertMessage('註冊失敗')
      setUserMessage('請檢查您的電子郵件和密碼')
      setIsModalOpen(true)
    }
  }

  const handleNextStep = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (!email) {
        setAlertMessage('資料錯誤')
        setUserMessage('請輸入電子信箱')
        setIsModalOpen(true)
      } else if (!isEmailValid) {
        setAlertMessage('資料錯誤')
        setUserMessage('請檢查電子信箱格式')
        setIsModalOpen(true)
      } else if (isEmailExists) {
        setAlertMessage('資料錯誤')
        setUserMessage('請檢查電子信箱')
        setIsModalOpen(true)
        console.log('信箱已存在')
      } else {
        setCurrentStep(currentStep + 1)
        setStep(step + 1)
      }
    } else if (step === 2 && !name) {
      setAlertMessage('資料錯誤')
      setUserMessage('請輸入名字')
      setIsModalOpen(true)
      console.log('姓名未填')
    } else {
      setCurrentStep(currentStep + 1)
      setStep(step + 1)
    }
  }

  const handlePrevStep = (e) => {
    e.preventDefault()
    setCurrentStep(currentStep - 1)
    setStep(step - 1)
  }

  const handleEmailCheck = (exists) => {
    console.log('檢查email是否存於資料庫:', exists)
    setIsEmailExists(exists)
  }

  return (
    <UserSignup
      title="建立一個帳戶"
      description="運動是保持健康的關鍵，請填寫以下資訊以創建您的帳號，加入我們，讓健康和活力成為生活常態！"
      currentStep={currentStep} //目前的狀態
    >
      <form className={styles2.form} onSubmit={handleSubmit} noValidate>
        {step === 1 && (
          <StepOne
            email={email}
            setEmail={setEmail}
            checkEmailExists={true}
            onEmailCheck={handleEmailCheck}
            setIsEmailValid={setIsEmailValid}
          />
        )}
        {step === 2 && (
          <StepTwo
            name={name}
            setName={setName}
            setIsNameValid={setIsNameValid}
          />
        )}
        {step === 3 && (
          <StepThree
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
          />
        )}

        <div className={styles2.form_group_row}>
          {step === 1 ? (
            <button
              className={styles2.btn_md_back}
              type="button"
              onClick={() => {
                router.push('/')
              }}
            >
              <h6 className={styles.h6}>回首頁</h6>
            </button>
          ) : (
            <button
              className={styles2.btn_md_back}
              type="button"
              onClick={handlePrevStep}
            >
              <h6 className={styles.h6}>上一步</h6>
            </button>
          )}
          {step < 3 ? (
            <button
              className={styles.btn_md}
              type="button"
              onClick={handleNextStep}
            >
              <h6 className={styles.h6}>下一步</h6>
            </button>
          ) : (
            <MyBtn buttonText="送出" />
          )}
        </div>
      </form>
      {isModalOpen && (
        <UserModal
          onClose={() => setIsModalOpen(false)}
          alertMessage={alertMessage}
          userMessage={userMessage}
        />
      )}
    </UserSignup>
  )
}

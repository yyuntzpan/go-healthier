import React, { useState } from 'react'
import styles from '../../styles/sign-in.module.css'
import { FaAngleRight } from 'react-icons/fa'
import UserSignin from '../../components/layout/user-layout1'
import MyEmailInput from '@/components/users/MyEmailInput'
import MyPasswordInput from '@/components/users/MyPasswordInput'
import MyBtn from '@/components/users/MyBtn'
import MyCheckBox from '@/components/users/MyCheckBox'
import Link from 'next/link'
import { useAuth } from '../../context/auth-context'
import { useRouter } from 'next/router'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../configs/firebase'
import UserModal from '../../components/users/UserModal'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [showSuccessIcon, setShowSuccessIcon] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const router = useRouter()
  const { login, googleLogin } = useAuth()

  // Google 登入
  const handleGoogleLogin = async (e) => {
    e.preventDefault()
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const success = await googleLogin({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
      })

      if (success) {
        setAlertMessage('Google 登入成功')
        setUserMessage('讓我們一起開始健康的旅程吧!')
        setIsModalOpen(true)
        setTimeout(() => {
          setIsModalOpen(false)
          // 獲取 returnUrl 參數
          const returnUrl = new URLSearchParams(location.search).get(
            'returnUrl'
          ) // 如果有 returnUrl，則跳轉到該 URL，否則跳轉到首頁
          if (returnUrl) {
            router.push(returnUrl)
          } else {
            console.log(returnUrl)
            router.push('/')
          }
        }, 1000)
      } else {
        setAlertMessage('Google 登入失敗')
        setUserMessage('請稍後再試')
        setIsModalOpen(true)
      }
    } catch (error) {
      console.error('Error during Google sign in:', error)
      setAlertMessage('Google 登入失敗')
      setUserMessage('發生錯誤，請稍後再試')
      setIsModalOpen(true)
    }
  }
  //一般登入
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('') // 清除之前的錯誤信息
    //一般的登入
    if (emailError === '' && passwordError === '') {
      try {
        const success = await login(email, password)
        if (success) {
          setAlertMessage('登入成功')
          setUserMessage('讓我們一起開始健康的旅程吧!')
          setIsModalOpen(true)
          setTimeout(() => {
            setIsModalOpen(false)
            // 獲取 returnUrl 參數
            const returnUrl = new URLSearchParams(location.search).get(
              'returnUrl'
            ) // 如果有 returnUrl，則跳轉到該 URL，否則跳轉到首頁
            if (returnUrl) {
              router.push(returnUrl)
            } else {
              console.log(returnUrl)
              router.push('/')
            }
          }, 3000)
        } else {
          setAlertMessage('登入失敗')
          setUserMessage('請檢查您的電子郵件和密碼')
          setIsModalOpen(true)
        }
      } catch (error) {
        console.error('登入過程中發生錯誤:', error)
        setError('登入過程中發生錯誤，請稍後再試')
      }
    }
  }

  return (
    <>
      <UserSignin
        title="登入"
        description="請輸入您的電子信箱及密碼進行登入，也可以選擇其他帳號登入"
      >
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.form_group}>
            <div className={styles.form_group_flex}>
              <label className={styles.user_label} htmlFor="email">
                <p className={styles.p}>電子信箱</p>
              </label>
              <MyEmailInput
                email={email}
                setEmail={setEmail}
                errorMessage={emailError}
                setErrorMessage={setEmailError}
                setShowSuccessIcon={setShowSuccessIcon}
                showSuccessIcon={false}
                checkEmailExists={false} //登入頁中不需要檢查 email 是否已存在
              />
            </div>
          </div>
          <div className={styles.form_group}>
            <label className={styles.user_label} htmlFor="password">
              <p className={styles.p}>密碼</p>
            </label>
            <div className={styles.form_group_flex}>
              <MyPasswordInput
                password={password}
                setPassword={setPassword}
                errorMessage={passwordError}
                setErrorMessage={setPasswordError}
              />
            </div>
          </div>

          <div className={styles.flex}>
            <div className={styles.form_check}>
              <MyCheckBox />
            </div>

            <MyBtn buttonText="立即登入" />
          </div>
        </form>

        <div className={styles.forget_password}>
          {/* <Link className={styles.a} href="forget_password"> */}
          {/* 測試版 */}
          <Link className={styles.a} href="forget_password">
            <FaAngleRight />
            <span className={styles.p}>我忘記密碼了</span>
          </Link>
        </div>

        <Link className={styles.a} href="sign_up">
          <FaAngleRight />
          <span className={styles.p}>還不是會員?那快點加入我們開始運動吧</span>
        </Link>

        <div className={styles.warp2}>
          <div className={styles.third_party_login}>
            <a className={styles.a} href="#" onClick={handleGoogleLogin}>
              <div className={styles.icon_wrapper}>
                <img src="/users-img/Logo-google-icon.svg" alt="google icon" />
              </div>
              <div className={styles.text_wrapper}>
                <p className={styles.p} style={{ width: '184px' }}>
                  以Google帳號登入
                </p>
              </div>
            </a>
          </div>
          {/* <div className={styles.third_party_login}>
            <a className={styles.a} href="#">
              <div className={styles.icon_wrapper}>
                <img src="/users-img/Facebook_icon.svg" alt="facebook icon" />
              </div>
              <div className={styles.text_wrapper}>
                <p className={styles.p}>以Facebook帳號登入</p>
              </div>
            </a>
          </div> */}
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

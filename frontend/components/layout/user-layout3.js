// 會員中心的基本布局
import React, { useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Breadcrumb from '../common/breadcrumb'
import Navbar from '../common/navbar'
import Footer from '../common/footer'
import BackToTop from '../common/buttons/back-to-top'
import styles from '@/styles/user-layout3.module.css'
import { FaUser } from 'react-icons/fa6'
import { useAuth } from '../../context/auth-context'

export default function LayoutUser({ children, title = 'myProfile' }) {
  const { auth, setAuth } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const fileInput = useRef(null)

  const titleMap = {
    myProfile: '我的檔案',
    myLessons: '我的課程',
    myOrders: '歷史訂單',
    myBookings: '我的預約',
    myFavs: '我的收藏',
  }

  const titleResult = titleMap[title] || '會員中心'
  const defaultAvatar = 'http://localhost:3001/users/'

  const handAvatarClick = () => {
    // fileInput.current.click()
    if (fileInput.current) {
      fileInput.current.click()
    }
  }

  const handFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)

    const formData = new FormData()
    formData.append('avatar', file)
    formData.append('member_id', auth.id)
    try {
      const response = await fetch('http://localhost:3001/avatar-upload', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setAuth((prev) => {
        const newAuth = { ...prev, avatar: data.avatar }
        localStorage.setItem('suan-auth', JSON.stringify(newAuth)) // 更新 localStorage
        return newAuth
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
    } finally {
      setIsUploading(false)
    }
  }
  return (
    <>
      <Head>
        <title>{titleResult}</title>
      </Head>
      <Navbar />
      <div className={styles.layout}>
        <nav className={styles.bread} aria-label="breadcrumb">
          <Breadcrumb pageName="users" />
        </nav>
        <div className={styles.warp}>
          <div className={styles.menu}>
            <div className={styles.user}>
              {/* <img src="/users-img/user_avator.png" alt="" /> */}
              <div
                className={`${styles.memberAvatarContainer}`}
                onClick={handAvatarClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handAvatarClick()
                  }
                }}
                role="button"
                tabIndex={0}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={`${defaultAvatar}${auth.avatar}`}
                  className={`${styles.memberAvatar} ${
                    isUploading ? styles.uploading : ''
                  }`}
                  alt="avatar" // 提供替代文字描述圖片
                />
              </div>

              <input
                type="file"
                ref={fileInput}
                style={{ display: 'none' }}
                onChange={handFileChange}
                accept="image/*"
              />
              <h5 className={styles.h5_font}>
                {auth.nick_name ? auth.nick_name : auth.name}
              </h5>
            </div>
            <nav className={styles.user_sidebar}>
              <Link className={styles.inline_link} href="/users/profile">
                <FaUser />
                <p className={styles.p_font}>主頁</p>
              </Link>
              <Link className={styles.inline_link} href="/users/profile/edit">
                <FaUser />
                <p className={styles.p_font}>檔案</p>
              </Link>
              <Link className={styles.inline_link} href="/users/bookings">
                <FaUser />
                <p className={styles.p_font}>預約</p>
              </Link>
              <Link className={styles.inline_link} href="/users/lessons_orders">
                <FaUser />
                <p className={styles.p_font}>課程</p>
              </Link>
              <Link className={styles.inline_link} href="/users/orders">
                <FaUser />
                <p className={styles.p_font}>訂單</p>
              </Link>
              <Link className={styles.inline_link} href="/users/favorites">
                <FaUser />
                <p className={styles.p_font}>收藏</p>
              </Link>
            </nav>
          </div>
          <div className={`${styles.userinfo}`}>{children}</div>
        </div>
      </div>
      <Footer />
      <BackToTop />
    </>
  )
}

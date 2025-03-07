import React, { useEffect, useState } from 'react'
import Layout4 from '@/components/layout/layout4'
import styles from '@/styles/coachReservation.module.css'
import CoachCard from '@/components/coaches/coachCard'
import ReserveModal from '@/components/coaches/reserve-modal'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useAuth } from '@/context/auth-context'
import 'animate.css'

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    timeSlot: '',
  })
  const [selectedCoach, setSelectedCoach] = useState(null)
  const [errors, setErrors] = useState({})
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const { auth } = useAuth()

  useEffect(() => {
    const fetchCoach = async () => {
      const { coachId } = router.query
      if (coachId) {
        try {
          const response = await axios.get(
            `http://localhost:3001/coaches/api/${coachId}`
          )
          if (response.data.success) {
            setSelectedCoach(response.data.coach)
          }
        } catch (error) {
          console.error('Error fetching coach:', error)
        }
      }
    }
    fetchCoach()
  }, [router.query])

  // 欄位填寫錯誤時滾動
  useEffect(() => {
    const errorKeys = Object.keys(errors)
    if (errorKeys.length > 0) {
      const firstErrorKey = errorKeys[0]
      const errorElement = document.getElementById(firstErrorKey)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [errors])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    // 只在該欄位的輸入有效時才清除錯誤
    if (validateField(name, value)) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // 新增這個函數來驗證單個欄位
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() !== ''
      case 'phone':
        return /^09\d{8}$/.test(value)
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case 'timeSlot':
        return value !== ''
      default:
        return true
    }
  }

  // 表單驗證
  const validateForm = () => {
    // 創建newErrors來儲存錯誤訊息
    const newErrors = {}
    // 去除首尾空格後檢查是否為空
    if (!formData.name.trim()) newErrors.name = '請填寫姓名'
    if (!formData.phone.trim()) {
      newErrors.phone = '請填寫電話'
    } else if (!/^09\d{8}$/.test(formData.phone)) {
      newErrors.phone = '電話格式錯誤'
    }
    if (!formData.email.trim()) {
      newErrors.email = '請填寫信箱'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '信箱格式錯誤'
    }
    // 檢查是否有選擇時段
    if (!formData.timeSlot) newErrors.timeSlot = '請選擇時段'
    // 重新設定錯誤訊息
    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }))
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // 如果表單驗證失敗，直接返回
    if (!validateForm()) return
    try {
      // 根據選擇的時間段獲取正確的日期時間字符串
      const timeSlotMap = {
        1: '2024-08-12T13:00:00+08:00',
        2: '2024-08-12T14:00:00+08:00',
        3: '2024-08-19T13:00:00+08:00',
        4: '2024-08-31T14:00:00+08:00',
      }
      const reserveTime = timeSlotMap[formData.timeSlot] || formData.timeSlot

      console.log('Sending data:', {
        reserve_name: formData.name,
        reserve_phone: formData.phone,
        reserve_email: formData.email,
        reserve_time: reserveTime,
        coach_id: selectedCoach.coach_id,
      })

      const response = await axios.post(
        'http://localhost:3001/users/add/coachReserve',
        {
          reserve_name: formData.name,
          reserve_phone: formData.phone,
          reserve_email: formData.email,
          reserve_time: reserveTime,
          coach_id: selectedCoach.coach_id,
        }
      )

      if (response.data.success) {
        setShowModal(true)
      } else {
        console.error('預約提交失敗:', response.data.message)
      }
    } catch (error) {
      console.error(
        '預約提交失敗:',
        error.response ? error.response.data : error.message
      )
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleMemberDataCheckbox = (e) => {
    if (e.target.checked) {
      if (!auth.token) {
        router.push('/users/sign_in')
      } else {
        setFormData((prevData) => ({
          ...prevData,
          name: auth.name,
          phone: auth.mobile, // 使用 mobile 或 phone，取決於您在後端返回的字段名
          email: auth.email,
        }))
      }
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        timeSlot: '',
      })
    }
  }

  return (
    <>
      <Layout4 title="教練預約" pageName="coaches">
        <div className={styles.content}>
          <div className={styles.reserveForm}>
            <div className={styles.formHead}>
              <p className={styles.formTitle}>預約人資訊 ｜</p>
              <div className={styles.checkboxes}>
                <input
                  type="checkbox"
                  id="member"
                  name="member"
                  className={styles.checkbox}
                  onChange={handleMemberDataCheckbox}
                />
                <label htmlFor="member">同會員資料</label>
              </div>
            </div>
            <div className={styles.formContainer}>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formLabel}>姓名</div>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? styles.errorInput : ''}
                  />
                  {errors.name && (
                    <div className={styles.errorMsg}>{errors.name}</div>
                  )}
                </div>

                <div className={styles.formLabel}>手機</div>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? styles.errorInput : ''}
                  />
                  {errors.phone && (
                    <div className={styles.errorMsg}>{errors.phone}</div>
                  )}
                </div>

                <div className={styles.formLabel}>聯絡信箱</div>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? styles.errorInput : ''}
                  />
                  {errors.email && (
                    <div className={styles.errorMsg}>{errors.email}</div>
                  )}
                </div>

                <div className={styles.formLabel}>選擇時段</div>
                <div className={styles.inputWrapper}>
                  <select
                    className={`${styles.timeSelect} ${
                      errors.timeSlot ? styles.errorInput : ''
                    }`}
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                  >
                    <option value="">請選擇時段</option>
                    <option value="1">2024/08/12 13:00</option>
                    <option value="2">2024/08/12 14:00</option>
                    <option value="3">2024/08/19 13:00</option>
                    <option value="4">2024/08/19 14:00</option>
                  </select>
                  {errors.timeSlot && (
                    <div className={styles.errorMsg}>{errors.timeSlot}</div>
                  )}
                </div>

                <div className={styles.formLabel}>預約教練</div>
                <div className={styles.cardContainer}>
                  <div className={styles.resCoach}>
                    {selectedCoach && (
                      <CoachCard
                        name={selectedCoach.coach_name}
                        skill={selectedCoach.skills}
                        imgSrc={`/${selectedCoach.coach_img}`}
                      />
                    )}
                  </div>
                </div>

                <div className={styles.btnContainer}>
                  <button className={styles.btnSend}>送出預約</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout4>
      {showModal && (
        <ReserveModal
          onClose={handleCloseModal}
          formData={formData}
          selectedCoach={selectedCoach}
          isLoggedIn={!!auth.token} //確認是否已登入
        />
      )}
    </>
  )
}

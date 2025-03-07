import { useEffect, useState, useRef } from 'react'
import Layout3 from '@/components/layout/layout3'
import styles from './gym-reservation.module.css'
import AutofillCheckbox from '@/components/gyms/auto-fill-checkbox'
import FormField from '@/components/common/form-field/form-field'
import GymCardSpot from '@/components/gyms/gymCard-spot'
import GymReservationModal from '@/components/gyms/gym-reservation-modal'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import GymDatePicker from '@/components/gyms/date-picker'
import 'react-datepicker/dist/react-datepicker.css'
import { setHours, setMinutes } from 'date-fns'
import DatePicker from 'react-datepicker'
import axios from 'axios'

// 假資料
// const gymData = {
//   id: 1,
//   name: '原力覺醒健身房',
//   subtitle: '友善的設備，專業的教練',
//   address: '台北市中正區杭州南路二段308號',
//   businessHours: '上午9:00 - 下午11:00',
//   features: ['重量訓練', '有氧運動', '瑜伽課程'],
//   distance: 500,
//   images: [
//     '/gym1.jpg',
//     '/gym1.jpg',
//     '/gym1.jpg',
//     '/gym1.jpg',
//     '/gym1.jpg',
//     '/gym1.jpg',
//   ],
//   phoneNumber: '02-1234-5678',
//   information:
//     '力量源練身館座落於北投市中心，是一間專業健身、體能訓練所在於其中一個的活化空間場館。我們科技力光合有機研發耳機系統，令大家在選擇的時候品質無需擔心。更新科技化新式健身器材設施讓您操作時更為輕鬆......',
//   price: [
//     '月卡會員: NT$ 1,900/月',
//     '季卡會員: NT$ 4,000/月 (每月約1,333)',
//     '半年卡會員: NT$ 6,000/月 (每月約1,167)',
//     '單次體驗: NT$ 300/次',
//   ],
//   equipment: [
//     '有氧運動區：配備多部跑步機、橢圓機、單車等',
//     '團體課教室：舉辦各種團體有氧課程',
//     '個人訓練區：可進行一對一的個人訓練',
//     '更衣室和淋浴設施：提供舒適的更衣和盥洗空間',
//   ],
// }
// const memberData = {
//   name: '張三',
//   email: 'zhangsan@example.com',
//   phone: '0912345678',
//   // ... 其他會員資料
// }

export default function GymReservation() {
  const formRef = useRef(null)
  const initializeDate = () => {
    const date = new Date() // 當前時間
    date.setDate(date.getDate() + 1) // +1 天
    date.setHours(9, 0, 0, 0) // 設定為早上 9:00
    return date
  }

  const [startDate, setStartDate] = useState(null)

  const router = useRouter()
  const { auth } = useAuth()
  const isLoggedIn = !auth.id ? false : true
  const [gymData, setGymData] = useState({
    id: 0,
    name: '',
    images: [],
    address: '',
    businessHours: '',
    features: [],
  })

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    reservationTime: null,
    gym_id: gymData.id,
    memberId: '',

    // ... 其他欄位
  })

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    reservationTime: '',
    gymId: gymData.id,
    memberId: auth.memberId,
  })

  // const isFormValid = () => {
  //   return Object.values(errors).every((error) => error === '')
  // }

  const handleDateChange = (date) => {
    setStartDate(date)
    setFormData((prevData) => ({
      ...prevData,
      reservationTime: date,

      // reservationTime: '111',
    }))
  }

  // fetch 資料函式
  const fetchGymData = async (gymId) => {
    if (!router.isReady) return null

    const url = `http://localhost:3001/gyms/api/${gymId}`
    try {
      const response = await fetch(url)
      const data = await response.json()
      //測試
      console.log('gymId', gymId)

      if (data && data.processedRow && data.processedRow.length > 0) {
        //測試
        console.log('Processed data:', data.processedRow[0])
        setGymData({
          id: data.processedRow[0].gym_id,
          name: data.processedRow[0].gym_name,
          images: data.processedRow[0].images,
          address: data.processedRow[0].gym_address,
          businessHours: data.processedRow[0].business_hours,
          features: data.processedRow[0].feature_list,
        })
        //測試
        setFormData((prevData) => ({
          ...prevData,
          gym_id: data.processedRow[0].gym_id,
        }))
      } else {
        console.error('API request was not successful:', data)
        setErrors('無法獲取健身房數據')
        return null
      }
    } catch (error) {
      console.error('Error fetching gym data:', error)
      setErrors('載入數據時發生錯誤')
      return null
    }
  }

  const handleAutofill = (isChecked) => {
    if (isChecked) {
      if (!auth.token) {
        router.push('/users/sign_in')
      } else {
        setFormData((pervData) => ({
          ...pervData,
          memberId: auth.id,
          name: auth.name || '',
          phone: auth.mobile || '', // 使用 mobile 或 phone，取決於您在後端返回的字段名
          email: auth.email || '',
          gym_id: gymData.id,
        }))
      }
    } else {
      setFormData((pervData) => ({
        ...pervData,
        name: '',
        phone: '',
        email: '',
      }))
    }
  }

  const [showModal, setShowModal] = useState(false)
  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'name':
        if (!value.trim()) error = '請填寫聯絡人姓名'
        break
      case 'phone':
        if (!value.trim()) error = '請填寫聯絡電話'
        else if (!/^\d{10}$/.test(value)) error = '請輸入有效的10位電話號碼'
        break
      case 'email':
        if (!value.trim()) error = '請填寫電子郵件'
        else if (!/\S+@\S+\.\S+/.test(value)) error = '請輸入有效的電子郵件地址'
        break
      case 'reservationTime':
        if (!value) error = '請選擇預約時間'
        break
      default:
        break
    }
    return error
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(gymData.id)
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      gym_id: gymData.id,
    }))

    // 即時驗證

    const error = validateField(name, value)
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    //測試
    const dataToSubmit = {
      ...formData,
      gym_id: gymData.id,
    }

    //全面驗證
    const newErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key])
      console.log('key', key, 'error', error)
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })

    setErrors(newErrors)

    if (!isValid) {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }

    // 測試 gym_id 是否存在
    if (formData.gym_id === 0 || formData.gym_id === undefined) {
      console.log('無效的 gym_id')
      return
    }

    try {
      // console.log(isValid)

      // 測試formData
      console.log('表單提交', formData)

      //表單提交邏輯
      console.log(gymData)
      console.log('表單提交', formData)

      // const response = await axios.post(
      //   'http://localhost:3001/gyms/add/reservation',
      //   formData
      // )
      //測試
      const response = await axios.post(
        'http://localhost:3001/gyms/add/reservation',
        dataToSubmit
      )
      setShowModal(true)
      if (response.success) {
        console.log(response.success)
      } else {
        // 預約沒有成功，show再試一次的modal => setOtherModal(true)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  // useEffect(() => {
  //   if (router.isReady) {
  //     const { Id } = router.query
  //     // console.log(Id)

  //     fetchGymData(Id)
  //     // console.log(gymData)
  //   }
  // }, [router.isReady])

  //測試版
  useEffect(() => {
    if (router.isReady) {
      const { Id } = router.query
      fetchGymData(Id)
      setFormData((prevData) => ({ ...prevData, gym_id: Id }))
    }
  }, [router.isReady])
  return (
    <div>
      <Layout3 title="預約場館" pageName="gyms2">
        <div className={styles.container}>
          <div>
            <form className={styles.form} onSubmit={handleSubmit} ref={formRef}>
              <div className={styles.formTitle}>
                <h4 className="">預約人資訊｜</h4>
                <AutofillCheckbox onAutofill={handleAutofill} />
              </div>
              <div className={styles.inputsContainer}>
                <FormField
                  label="姓名"
                  name="name"
                  id="name"
                  placeholder="請輸入您的姓名"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                />

                <FormField
                  label="手機"
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="請輸入您的手機號碼"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={errors.phone}
                />

                <FormField
                  label="聯絡信箱"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="請輸入您的聯絡信箱"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                />
              </div>
              <h4 className="">預約場館｜</h4>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {gymData ? (
                  <GymCardSpot data={gymData} style={{ margin: 'auto' }} />
                ) : (
                  <div>Loading...</div>
                )}
              </div>
              <div className={styles.inputsContainerGap0}>
                <GymDatePicker
                  setStartDate={setStartDate}
                  startDate={startDate}
                  initializeDate={initializeDate}
                  handleDateChange={handleDateChange}
                />
                <button type="submit" className={styles.button}>
                  預約
                </button>
              </div>
            </form>
          </div>
        </div>
      </Layout3>
      {showModal && (
        <GymReservationModal
          onClose={handleCloseModal}
          formData={formData}
          gymData={gymData}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  )
}

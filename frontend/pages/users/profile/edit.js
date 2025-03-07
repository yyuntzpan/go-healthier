import React, { useState, useEffect } from 'react'
import LayoutUser from '@/components/layout/user-layout3'
import styles from '../../../styles/user-edit.module.css'
import { useAuth } from '../../../context/auth-context'
import { useRouter } from 'next/router'
import UserModal from '../../../components/users/UserModal'
import UserConfirm from '@/components/users/userConfirm'
import MyPasswordInput from '@/components/users/MyPasswordInput'
import { z } from 'zod'
import MyTextInput from '@/components/users/MyTextInput'

export default function Edit() {
  const router = useRouter()
  const { auth, setAuth, logout } = useAuth()
  const [city, setCity] = useState([])
  const [districts, setDistricts] = useState([])
  const [selectedCity, setSelectedCity] = useState(auth.city || 0)
  const [selectedDistrict, setSelectedDistrict] = useState(auth.district || 0)

  const [name, setName] = useState(auth.name || '')
  const [nickName, setNickName] = useState(auth.nick_name || '')
  const [mobile, setMobile] = useState(auth.mobile || '')
  const [address, setAddress] = useState(auth.address || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [originalUserData, setOriginalUserData] = useState({}) // 保存原始資料
  const [errorMessage, setErrorMessage] = useState('')
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState('')
  const [userConfirmMessage, setUserConfirmMessage] = useState('')

  const [nameError, setNameError] = useState('')
  const [nickNameError, setNickNameError] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [addressError, setAddressError] = useState('')

  // Zod schemas
  const nameSchema = z
    .string()
    .min(1, '姓名不能為空白')
    .min(2, '姓名至少要有2個字')
    .max(10, '姓名不能超過10個字')
    .trim()
  const nickNameSchema = z.string().max(10, '暱稱不能超過10個字')
  const mobileSchema = z.string().regex(/^09\d{8}$/, '手機號碼格式不正確')
  const addressSchema = z.string().refine(
    (value) => {
      const cityName = city.find((c) => c.code_id === selectedCity)?.code_desc
      const districtName = districts.find(
        (d) => d.code_id === selectedDistrict
      )?.code_desc

      // 檢查是否選擇了縣市和行政區
      const isLocationSelected = selectedCity !== 0 && selectedDistrict !== 0

      // 如果選擇了位置，地址不能為空，且不能包含已選擇的縣市或行政區
      if (isLocationSelected) {
        return (
          value.trim() !== '' &&
          !value.includes(cityName) &&
          !value.includes(districtName)
        )
      }

      // 如果沒有選擇位置，則出現錯誤訊息
      return false
    },
    {
      message: '地址格式不正確',
    }
  )

  console.log('auth.id:', auth.id)

  // 當auth被更新時保存原先的資料
  useEffect(() => {
    // 保存原始資料
    setOriginalUserData({
      name: auth.name || '',
      nick_name: auth.nick_name || '',
      mobile: auth.mobile || '',
      address: auth.address || '',
      city: auth.city || 0,
      district: auth.district || 0,
    })
    // 更新的資料
    setName(auth.name || '')
    setNickName(auth.nick_name || '')
    setMobile(auth.mobile || '')
    setAddress(auth.address || '')
    setSelectedCity(auth.city || 0)
    setSelectedDistrict(auth.district || 0)
  }, [auth])

  //判斷是不是使用第三方登入進來的會員
  const isGoogleUser = Boolean(auth.google_uid)
  console.log('isGoogleUser:', isGoogleUser)

  useEffect(() => {
    // Fetch city data
    const fetchCity = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/users/selectWhere/city'
        )
        const data = await response.json()
        setCity(data)
      } catch (error) {
        console.error('Error fetching city:', error)
      }
    }

    fetchCity()
  }, [])

  // Fetch district data when city changes
  useEffect(() => {
    const fetchDistrict = async () => {
      if (selectedCity !== 0) {
        try {
          const response = await fetch(
            `http://localhost:3001/users/selectWhere/district/${selectedCity}`
          )
          const data = await response.json()
          setDistricts(data)
        } catch (error) {
          console.error('Error fetching district:', error)
        }
      } else {
        setDistricts([])
      }
    }

    fetchDistrict()
  }, [selectedCity])

  const handleCityChange = (e) => {
    const newCityId = parseInt(e.target.value)
    setSelectedCity(newCityId)
    setSelectedDistrict(0)
    setAddress('')

    if (newCityId === 0) {
      setAddressError('請選擇縣市')
    } else {
      setAddressError('') // 清空錯誤訊息，等待用戶重新選擇行政區
    }
  }

  const handleDistrictChange = (e) => {
    const newDistrictId = parseInt(e.target.value)
    setSelectedDistrict(newDistrictId)
    setAddress('')

    if (newDistrictId === 0) {
      setAddressError('請選擇行政區')
    } else {
      setAddressError('請輸入詳細地址')
    }
  }

  useEffect(() => {
    // 只有當用戶開始填寫表單（選擇了縣市或行政區，或輸入了地址）時，才顯示錯誤訊息
    if (selectedCity !== 0 || selectedDistrict !== 0 || address.trim() !== '') {
      if (selectedCity === 0) {
        setAddressError('請選擇縣市')
      } else if (selectedDistrict === 0) {
        setAddressError('請選擇行政區')
      } else if (address.trim() === '') {
        setAddressError('請輸入詳細地址')
      } else {
        setAddressError('')
      }
    } else {
      setAddressError('') // 如果用戶沒有開始填寫，保持錯誤訊息為空
    }
  }, [selectedCity, selectedDistrict, address])

  // 檢查是否有資料更新
  const isDataChanged = () => {
    return (
      name !== originalUserData.name ||
      nickName !== originalUserData.nick_name ||
      mobile !== originalUserData.mobile ||
      address !== originalUserData.address ||
      selectedCity !== originalUserData.city ||
      selectedDistrict !== originalUserData.district ||
      password !== '' || // 如果輸入了新密碼，視為有更新
      confirmPassword !== ''
    )
  }
  // 檢查確認密碼是否一致
  useEffect(() => {
    if (confirmPassword !== '' && confirmPassword !== password) {
      setConfirmPasswordErrorMessage('兩次輸入的密碼不一致')
    } else {
      setConfirmPasswordErrorMessage('')
    }
  }, [password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 檢查是否有資料更新
    if (!isDataChanged()) {
      setAlertMessage('尚無資料更新')
      setUserMessage('沒有資料異動')
      setIsModalOpen(true)
      setTimeout(() => {
        setIsModalOpen(false)
      }, 1000)
      // 回到頂部
      window.scrollTo(0, 0)
      return
    }
    // 檢查密碼是否一致
    if (password !== confirmPassword) {
      setErrorMessage('密碼不一致')
      setAlertMessage('輸入錯誤')
      setUserMessage('兩次輸入的密碼並不一致')
      setIsModalOpen(true)
      setTimeout(() => {
        setIsModalOpen(false)
      }, 1000)
      return
    }

    const updateProfile = {
      id: auth.id,
      name,
      nick_name: nickName,
      mobile,
      address,
      city: selectedCity,
      district: selectedDistrict,
    }

    // 只有在有輸入密碼時才包含密碼欄位
    if (password) {
      updateProfile.password = password
    }

    try {
      if (!auth.id) {
        throw new Error('User ID is not defined')
      }

      const updateResponse = await fetch(
        `http://localhost:3001/users/updateProfile/${auth.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateProfile),
        }
      )

      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`)
      }

      const updatedData = await updateResponse.json()
      console.log('後端返回的數據:', updatedData)

      if (updatedData.message === '個人資料更新成功') {
        console.log('更新前的 auth:', auth)
        // 更新的auth 叫 updateAuth
        const updatedAuth = {
          ...auth,
          name: name,
          nick_name: nickName,
          mobile: mobile,
          address: address,
          city: selectedCity,
          district: selectedDistrict,
          password: password || auth.password,
        }
        console.log('更新後的 auth:', updatedAuth)

        //拿updateAuth來更新auth context
        if (typeof setAuth === 'function') {
          setAuth(updatedAuth)
        }
        // 更新 localStorage
        localStorage.setItem('suan-auth', JSON.stringify(updatedAuth))
        console.log(
          'localStorage 更新後:',
          JSON.parse(localStorage.getItem('suan-auth'))
        )

        if (updatedData.isPasswordChange) {
          setAlertMessage('密碼已更新')
          setUserMessage('請重新登入')
          setIsModalOpen(true)
          setTimeout(() => {
            setIsModalOpen(false)
            logout() // 確保你有定義這個函數
            router.push('/users/sign_in') // 確保你有導入 router
          }, 2000)
        } else {
          setAlertMessage('更新成功')
          setUserMessage('個人資料已成功更新')
          setIsModalOpen(true)
          setTimeout(() => {
            setIsModalOpen(false)
          }, 1000)
          // 回到頂部
          window.scrollTo(0, 0)
        }
      } else {
        throw new Error('更新失敗')
      }
    } catch (error) {
      console.error('發生錯誤:', error.message)
      setAlertMessage('發生錯誤')
      setUserMessage('無法更新您的資料，請稍後再試')
      setIsModalOpen(true)
      setTimeout(() => {
        setIsModalOpen(false)
      }, 1000)
      window.scrollTo(0, 0)
    }
  }

  const handleCancel = (e) => {
    e.preventDefault()
    //資料沒有變化時
    if (!isDataChanged()) {
      setAlertMessage('尚無資料更新')
      setUserMessage('沒有資料異動')
      setIsModalOpen(true)
      setTimeout(() => {
        setIsModalOpen(false)
      }, 1000)
      window.scrollTo(0, 0)
      return
    }
    //有輸入但最後按下取消時，先確認是否取消
    //設定userConfirm modal
    setConfirmMessage('確定嗎?')
    setUserConfirmMessage('您的變更尚未儲存，確定要取消嗎？')
    setIsCancelModalOpen(true)
  }
  //確認是否要取消更新
  const confirmCancel = () => {
    // 重置表單數據
    setName(originalUserData.name)
    setNickName(originalUserData.nick_name)
    setMobile(originalUserData.mobile)
    setAddress(originalUserData.address)
    setSelectedCity(originalUserData.city)
    setSelectedDistrict(originalUserData.district)
    setPassword('')
    setConfirmPassword('')
    setErrorMessage('')
    setConfirmPasswordErrorMessage('')
    setIsCancelModalOpen(false)

    // 回到頂部
    window.scrollTo(0, 0)
  }

  return (
    <>
      <LayoutUser title="myProfile">
        <div className={styles.userinfo_edit}>
          <div className={styles.user_title}>
            <h4>我的檔案</h4>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.user_details}>
              {/* Personal Information */}
              <div className={styles.information}>
                <h5>個人資料</h5>
                <MyTextInput
                  id="name"
                  name="name"
                  label="姓名:"
                  value={name}
                  onChange={setName}
                  schema={nameSchema}
                  errorMessage={nameError}
                  setErrorMessage={setNameError}
                />
                <MyTextInput
                  id="nickname"
                  name="nickname"
                  label="暱稱:"
                  value={nickName}
                  onChange={setNickName}
                  schema={nickNameSchema}
                  errorMessage={nickNameError}
                  setErrorMessage={setNickNameError}
                />
                <MyTextInput
                  id="mobile"
                  name="mobile"
                  label="手機:"
                  placeholder="格式為0912345678"
                  value={mobile}
                  onChange={setMobile}
                  schema={mobileSchema}
                  errorMessage={mobileError}
                  setErrorMessage={setMobileError}
                />
              </div>

              {/* Address */}
              <div className={styles.address}>
                <h5>地址</h5>
                <div className={styles.form_group}>
                  <label htmlFor="city">
                    <p>縣市:</p>
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={selectedCity}
                    onChange={handleCityChange}
                  >
                    <option value="0">--請選擇--</option>
                    {city.map((c) => (
                      <option key={c.code_id} value={c.code_id}>
                        {c.code_desc}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.form_group}>
                  <label htmlFor="district">
                    <p>行政區:</p>
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                  >
                    <option value="0">--請選擇--</option>
                    {districts.map((d) => (
                      <option key={d.code_id} value={d.code_id}>
                        {d.code_desc}
                      </option>
                    ))}
                  </select>
                </div>
                <MyTextInput
                  id="address"
                  name="address"
                  label="地址:"
                  value={address}
                  onChange={(value) => {
                    setAddress(value)
                    // 當用戶開始輸入地址時，檢查是否已選擇縣市和行政區
                    if (selectedCity === 0 || selectedDistrict === 0) {
                      setAddressError('請先選擇縣市和行政區')
                    } else if (value.trim() === '') {
                      setAddressError('地址不能為空白')
                    } else {
                      setAddressError('')
                    }
                  }}
                  schema={addressSchema}
                  errorMessage={addressError}
                  setErrorMessage={setAddressError}
                  style={{ width: '300px' }}
                />
              </div>

              {/* Change Password */}
              <div className={styles.change_password}>
                <h5>更改密碼</h5>
                <div className={styles.flex}>
                  <div className={styles.form_groupMb}>
                    <label htmlFor="password">
                      <p>密碼:</p>
                    </label>
                    <MyPasswordInput
                      password={password}
                      setPassword={setPassword}
                      id="new_password"
                      name="password"
                      placeholder="請輸入新密碼"
                      errorMessage={errorMessage}
                      setErrorMessage={setErrorMessage}
                      disabled={isGoogleUser} //如果是第三方登入的會員就不能改密碼
                    />
                  </div>
                  <div
                    className={styles.form_groupMb}
                    style={{ width: '350px' }}
                  >
                    <label htmlFor="confirm_password">
                      <p>請再輸入一次密碼:</p>
                    </label>
                    <MyPasswordInput
                      password={confirmPassword}
                      setPassword={setConfirmPassword}
                      id="confirm_password"
                      name="confirm_password"
                      placeholder="請再次輸入新密碼"
                      errorMessage={confirmPasswordErrorMessage}
                      setErrorMessage={setConfirmPasswordErrorMessage}
                      disabled={isGoogleUser} //如果是第三方登入的會員就不能改密碼
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.edit_btn}>
              <a href="#" className={styles.btn_md} onClick={handleCancel}>
                <div className={styles.h6_font}>取消更新</div>
              </a>
              <button type="submit" className={styles.btn_md} formNoValidate>
                <div className={styles.h6_font}>資料更新</div>
              </button>
            </div>
          </form>
        </div>
      </LayoutUser>
      {isModalOpen && (
        <UserModal
          onClose={() => setIsModalOpen(false)}
          alertMessage={alertMessage}
          userMessage={userMessage}
        />
      )}
      {isCancelModalOpen && (
        <UserConfirm
          onClose={() => setIsCancelModalOpen(false)}
          onConfirm={confirmCancel}
          confirmMessage={confirmMessage}
          userConfirmMessage={userConfirmMessage}
        />
      )}
    </>
  )
}

import React, { useEffect, useState } from 'react'
import Layout4 from '@/components/layout/layout4'
import styles from '@/styles/coach.module.css'
import { IoSearch } from 'react-icons/io5'
import CoachList from '@/components/coaches/coachList'
import axios from 'axios'
import CheckboxList from '@/components/lessons/checkboxList'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/router'
import debounce from 'lodash/debounce'

export default function Index() {
  const { auth } = useAuth()
  const router = useRouter()
  const [allCoaches, setAllCoaches] = useState([])
  const [filteredCoaches, setFilteredCoaches] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [favorites, setFavorites] = useState([])

  const handleCategoryChange = (code_desc, isChecked) => {
    setSelectedCategories((prev) => {
      const newSelectedCategories = isChecked
        ? [...prev, code_desc]
        : prev.filter((cat) => cat !== code_desc)

      return newSelectedCategories
    })
  }

  const fetchCoaches = debounce(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/coaches/api`, {
        params: {
          code_desc: selectedCategories.join('-'),
          keyword: searchKeyword,
        },
      })
      console.log('API response:', response.data)
      if (response.data.success) {
        setAllCoaches(response.data.rows)
        setFilteredCoaches(response.data.rows)
      }
    } catch (error) {
      console.error('Error fetching coaches:', error)
    }
  }, 300) // 300ms 延遲

  const fetchFavorites = async () => {
    if (auth.token) {
      try {
        const response = await axios.get(
          `http://localhost:3001/users/favorites/${auth.id}`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
          }
        )
        if (response.data.success) {
          setFavorites(response.data.favorites.map((coach) => coach.coach_id))
        }
      } catch (error) {
        console.error('Error fetching favorites:', error)
      }
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchCoaches()
  }

  useEffect(() => {
    fetchCoaches()
    fetchFavorites()
  }, [selectedCategories, auth.token]) // 增加 auth.token 的依賴

  const handleFavoriteToggle = async (coachId) => {
    if (!auth.token) {
      router.push('/users/sign_in')
      return
    }

    try {
      if (favorites.includes(coachId)) {
        await axios.delete('http://localhost:3001/users/remove-favorite', {
          data: { member_id: auth.id, coach_id: coachId },
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        setFavorites(favorites.filter((id) => id !== coachId))
      } else {
        await axios.post(
          'http://localhost:3001/users/add-favorite',
          { member_id: auth.id, coach_id: coachId },
          { headers: { Authorization: `Bearer ${auth.token}` } }
        )
        setFavorites([...favorites, coachId])
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <Layout4 title="教練列表" pageName="coaches">
      <div className={styles.content}>
        <div className={styles.search}>
          <div className={styles.searchIcon}>
            <IoSearch />
          </div>
          <input
            type="text"
            name="search_input"
            className={styles.search_input}
            placeholder="請輸入教練姓名搜尋..."
            value={searchKeyword}
            onChange={handleSearchInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSearchSubmit(e)
              }
            }}
          />
        </div>
        <div className={styles.filter}>
          <p className={styles.select}>請選擇類別 ｜</p>
          <div className={styles.checkboxWrapper}>
            <CheckboxList
              checked={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
        </div>
        <div className={styles.result}>
          <p className={styles.result_title}>篩選結果</p>
          <div className={styles.coachCards}>
            <CoachList
              coaches={filteredCoaches}
              favorites={favorites}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </div>
        </div>
      </div>
    </Layout4>
  )
}

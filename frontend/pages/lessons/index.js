import React, { useState, useEffect } from 'react'
import Layout4 from '@/components/layout/layout4'
import CardCarousel from '@/components/swiperCarousel/cardCarousel'
import CheckboxList from '@/components/lessons/checkboxList'
import styles from '@/styles/lesson.module.css'
import { IoSearch } from 'react-icons/io5'
import LessonCard from '@/components/lessons/lessonCard'
import LessonList from '@/components/lessons/lessonList'
import axios from 'axios'
import Link from 'next/link'

export default function Index({ lessons }) {
  const [allLessons, setAllLessons] = useState([])
  const [hotLessons, setHotLessons] = useState([])
  const [filteredLessons, setFilteredLessons] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')

  const renderLessonCard = (data) => {
    return (
      <Link href={`/lessons/${data.lesson_id}`}>
        <LessonCard
          title={data.lesson_name}
          price={`NT$ ${data.lesson_price}`}
          gym={data.gym_name}
          category={data.categories}
          imgSrc={data.lesson_img || '/defaultImg.png'}
        />
      </Link>
    )
  }

  const handleCategoryChange = (code_desc, isChecked) => {
    setSelectedCategories((prev) => {
      const newSelectedCategories = isChecked
        ? [...prev, code_desc]
        : prev.filter((cat) => cat !== code_desc)

      return newSelectedCategories
    })
  }

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/lessons/api`, {
        params: {
          code_desc: selectedCategories.join('-'),
          keyword: searchKeyword,
        },
      })
      console.log('API response:', response.data)
      if (response.data.success) {
        setAllLessons(response.data.rows)
        setFilteredLessons(response.data.rows)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    }
  }

  const handleSearchInputChange = (e) => {
    setSearchKeyword(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchLessons()
  }

  useEffect(() => {
    fetchLessons()
  }, [selectedCategories]) // 只在選擇的類別變更時重新獲取數據

  useEffect(() => {
    const fetchHotLessons = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/lessons/api/hotLessons'
        )
        if (response.data.success) {
          setHotLessons(response.data.hotLessons)
        }
      } catch (error) {
        console.error('Error fetching hot lessons:', error)
      }
    }

    fetchHotLessons()
  }, [])

  return (
    <>
      <Layout4 title="課程列表" pageName="lessons">
        <div className={styles.content}>
          <section className={`${styles.popular}`}>
            <div className="row px-0 mx-0 g-0">
              <div className="col-md-3 d-flex justify-content-md-end justify-content-center align-items-center">
                <h3 className="my-0">熱門課程</h3>
              </div>
              <div className="col-md-9 ps-3 py-5 overflow-hidden">
                <CardCarousel
                  cardMaxWidth="270px"
                  data={hotLessons}
                  renderItem={renderLessonCard}
                />
              </div>
            </div>
          </section>
          <div className={styles.search}>
            <div className={styles.searchIcon}>
              <IoSearch />
            </div>
            <input
              type="text"
              name="search_input"
              className={styles.search_input}
              placeholder="請輸入關鍵字搜尋..."
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
            <LessonList lessons={filteredLessons} />
          </div>
        </div>
      </Layout4>
    </>
  )
}

import React, { useEffect, useRef, useState } from 'react'
import Layout3 from '@/components/layout/layout3'
import styles from './gyms.module.css'
import SearchBar from '@/components/common/searchbar/searchbar'
import Switch from '@/components/common/switch/switch'
import MapErea from '@/components/gyms/map-erea'
import GymFilters from './gymfilter'
import ResultCards from '@/components/gyms/gymCard'
import { useRouter } from 'next/router'
import Layout4 from '@/components/layout/layout4'

export default function Gyms() {
  const router = useRouter()
  const [gymsData, setGymsData] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [boo, setBoo] = useState(true) //switch 的state
  const [isComposing, setIsComposing] = useState(false)

  const searchBarRef = useRef(null)

  const handleClick = () => {
    const yOffset = -50 // 50px offset above the target
    const element = searchBarRef.current
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset

    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const handleCompositionChange = (composing) => {
    setIsComposing(composing)
  }
  //用fetch請後端搜尋資料的函式
  const fetchGymsData = () => {
    //const qq = new URLSearchParams(router.query)
    // console.log(qq)
    const url = `http://localhost:3001/gyms/api?keyword=${searchTerm}&features=${selectedFeatures}&friendly=${boo}`
    if (router.isReady) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setGymsData(data.processedRows)
        })
        .catch((error) => {
          console.error('Error 獲取 gymsData:', error)
        })
    }
  }

  //處理checkbox狀態改變的函式
  const handleCheckboxChange = (feature) => {
    setSelectedFeatures((prev) => {
      if (prev.includes(feature)) {
        return prev.filter((f) => f !== feature)
      } else {
        return [...prev, feature]
      }
    })
  }

  // 清除所有checkbox函式
  const clearAllCheckboxes = () => {
    setSelectedFeatures([])
  }

  const handleSearch = (e) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, gym_name: searchTerm },
    })
  }

  const handleToggleChange = () => {
    setBoo((prev) => !prev)
  }

  // 從URL取得搜尋關鍵字
  useEffect(() => {
    if (router.isReady) {
      if (!isComposing) {
        // fetch資料
        fetchGymsData()
      }
      // 更新URL--checkbox
      const newQuery = {
        ...router.query,
        features: selectedFeatures,
        friendly: boo,
      }
      const cleanQuery = Object.fromEntries(
        Object.entries(newQuery).filter(([_, value]) => value !== '')
      )

      router.push(
        {
          pathname: router.pathname,
          query: cleanQuery,
        },
        undefined,
        { scroll: false }
      )
    }
  }, [router.isReady, searchTerm, selectedFeatures, isComposing, boo])

  return (
    <Layout4 title="尋找場館" pageName="gyms">
      <div className={styles.indexContainer}>
        <div className={styles.zIndex}>
          <div className={styles.container}>
            <div title="searchbar&Switch" className={styles.searchAndSwitch}>
              <SearchBar
                className=""
                placeholder="輸入地址查詢最近場館..."
                maxWidth="789px"
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
                gymsData={gymsData}
                onCompositionChange={handleCompositionChange}
                handleSearch={handleSearch}
                handleClick={handleClick}
                ref={searchBarRef}
              />
              <div
                title="switch"
                className="d-none d-md-flex align-items-center ps-3"
              >
                <Switch isOn={boo} handleToggle={handleToggleChange} />
              </div>
            </div>
          </div>
          <GymFilters
            selectedFeatures={selectedFeatures}
            handleCheckboxChange={handleCheckboxChange}
            clearAllCheckboxes={clearAllCheckboxes}
          />
        </div>
        <div className={styles.flexRow}>
          <div className={styles.mapContainerStyle}>
            <MapErea gymsData={gymsData} searchTerm={searchTerm} />
          </div>
          <ResultCards gyms={gymsData} selectedFeatures={selectedFeatures} />
        </div>
      </div>
    </Layout4>
  )
}

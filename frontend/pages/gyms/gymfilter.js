import ResponsiveCheckboxFilter from '@/components/gyms/ResposiveCheckboxFilter'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function GymFilters({
  selectedFeatures = [],
  handleCheckboxChange,
  clearAllCheckboxes,
}) {
  const router = useRouter()
  const url = 'http://localhost:3001/gyms/features'
  const [filterOptions, setFilterOptions] = useState([])

  useEffect(() => {
    if (router.isReady) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setFilterOptions(data.features)
          }
        })
    }
  }, [router.isReady])

  const fakeFilterOptions = [
    '重量訓練',
    '瑜珈伸展',
    '紅繩核心',
    '游泳池',
    '皮拉提斯器械',
    '平衡訓練',
    '功能訓練',
  ]

  return (
    <>
      <ResponsiveCheckboxFilter
        options={filterOptions.length > 0 ? filterOptions : fakeFilterOptions}
        onChange={handleCheckboxChange}
        selectedFeatures={selectedFeatures}
        clearAllCheckboxes={clearAllCheckboxes}
      />
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import styles from './branchCard.module.css'

export default function BranchCard({ branch = 'myLessons', href }) {
  const titleMap = {
    myLessons: '我的課程',
    myOrders: '歷史訂單',
    myReserves: '我的預約',
    myFavs: '我的收藏',
    lessons: '課程',
    coaches: '教練',
    gyms: '場館',
    articles: '文章',
  }

  const iconMap = {
    myLessons: 'elderpeople.svg',
    myOrders: 'order.svg',
    myReserves: 'location_arrow.svg',
    myFavs: 'heart.svg',
    lessons: 'ojiisan.svg',
    coaches: 'macho_man.svg',
    gyms: 'building_gym.svg',
    articles: 'obaasan.svg',
  }

  const widthMap = {
    myLessons: '123px',
    myOrders: '123px',
    myReserves: '123px',
    myFavs: '123px',
    lessons: '150px',
    coaches: '150px',
    gyms: '150px',
    articles: '150px',
  }

  // 判斷要用哪個 title 跟 icon
  const titleResult = titleMap[branch] || '我的課程'
  const iconResult = iconMap[branch] || 'elderpeople.svg'
  const widthResult = widthMap[branch] || '123px'

  if (href !== undefined) {
    return (
      <Link href={href} passHref>
        <div className={`${styles.card} card`}>
          <div className={styles.card_body2}>
            <h6 className={styles.h6_font}>{`[${titleResult}]`}</h6>
            <img
              style={{ width: `${widthResult}` }}
              src={`/users-img/${iconResult}`}
              alt={`${titleResult.slice(1, -1)}圖片`}
            />
          </div>
        </div>
      </Link>
    )
  } else {
    return (
      <div className={`${styles.card} card`}>
        <div className={styles.card_body2}>
          <h6 className={styles.h6_font}>{`[${titleResult}]`}</h6>
          <img
            style={{ width: `${widthResult}` }}
            src={`/users-img/${iconResult}`}
            alt={`${titleResult.slice(1, -1)}圖片`}
          />
        </div>
      </div>
    )
  }
}

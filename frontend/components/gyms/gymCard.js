import React, { useEffect, useRef, useState } from 'react'
import styles from './gymCard.module.css'
import Link from 'next/link'
import { IoCall } from 'react-icons/io5'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const GymCard = ({ data }) => {
  const [isWideScreen, setIsWideScreen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        {isWideScreen ? (
          <Link href="/gyms/[gym_id]" as={`/gyms/${data.gym_id}`}>
            <Image
              src={data.image_list[0]}
              alt="場館照片"
              width={120}
              height={120}
              className={styles.image}
              loading="lazy"
            />
          </Link>
        ) : (
          data.image_list.map((src, i) => {
            return (
              <Image
                key={i}
                src={src}
                alt={`場館圖片${i + 1}`}
                width={150}
                height={150}
                className={styles.image}
                loading="lazy"
              />
            )
          })
        )}
      </div>
      <div className={styles.textBtn}>
        <div className={styles.content}>
          <Link href="/gyms/[gym_id]" as={`/gyms/${data.gym_id}`}>
            <h5 className={styles.title}>{data.gym_name}</h5>
          </Link>
          <div className="cardInfo">
            <p className={styles.smallFont}>{data.gym_address}</p>
            <p className={styles.smallFont}>營業時間 | {data.business_hours}</p>
            <div className={styles.badgeRow}>
              {data.feature_list.map((feature, i) => (
                <span key={i} className={styles.badge}>
                  {feature}
                </span>
              ))}

              {/* <span className={styles.badge}>500公尺</span> */}
            </div>
          </div>
        </div>
        <Link
          href="/gyms/[gym_id]/gym-reservation"
          as={`/gyms/${data.gym_id}/gym-reservation`}
          className={styles.bookButton}
        >
          <IoCall />
          預約
        </Link>
      </div>
    </div>
  )
}

const ResultCards = ({ gyms, selectedFeatures }) => {
  const filteredGyms = gyms.filter((gym) => {
    if (selectedFeatures.length === 0) {
      return true
    }
    return selectedFeatures.some((feature) =>
      gym.feature_list.includes(feature)
    )
  })
  const [isScrolled, setIsScrolled] = useState(false)
  const containerRef = useRef(null)
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current
      if (container) {
        setIsScrolled(container.scrollTop > 0)
      }
    }
    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  if (!gyms) {
    return <div>Loading...</div>
  }
  return (
    <div className={styles.resultCards}>
      {Array.isArray(filteredGyms) && filteredGyms.length > 0 ? (
        filteredGyms.map((gym, i) => <GymCard key={i} data={gym} />)
      ) : (
        <div>
          <Skeleton count={5} />
        </div>
      )}
    </div>
  )
}
export { GymCard }
export default ResultCards

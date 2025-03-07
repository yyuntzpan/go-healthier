import React, { useCallback, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import styles from './gym-swiper.module.css'

// import required modules
import { FreeMode, Navigation, Thumbs } from 'swiper/modules'

export default function GymSwiper({ gym }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const handleThumpsSwiper = useCallback((swiper) => {
    setThumbsSwiper(swiper)
  }, [])

  const memorizedImageList = useMemo(() => {
    return gym.image_list
  }, [gym.image_list])

  return (
    <>
      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className={styles.mySwiper2}
      >
        {memorizedImageList.map((image, i) => (
          <SwiperSlide key={`main-${image}`}>
            <Image
              src={`/${image}`}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              className={styles.mySwiper2}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={handleThumpsSwiper}
        spaceBetween={10}
        slidesPerView={6}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className={styles.mySwiper}
      >
        {gym.image_list.map((image, i) => (
          <SwiperSlide key={`thumb-${image}`}>
            <Image
              src={`/${image}`}
              // layout="fill"
              width={100}
              height={100}
              objectFit="cover"
              objectPosition="center"
              className={styles.thumbImg}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

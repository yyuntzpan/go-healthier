import { useRef, useEffect, useState } from 'react'
import { register } from 'swiper/element/bundle'

import { FaArrowLeftLong, FaArrowRightLong } from 'react-icons/fa6'
import styles from './card-carousel.module.css'

export default function CardCarousel({
  arrow = true,
  data = [],
  width = '100%',
  cardMaxWidth = '350px',
  cardWidth = '100%',
  gap = '20px',
  renderItem = () => {},
  children,
}) {
  const swiperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const handleNext = () => {
    if (!swiperRef.current) return
    swiperRef.current.swiper.slideNext()
  }

  const handlePrev = () => {
    if (!swiperRef.current) return
    swiperRef.current.swiper.slidePrev()
  }

  let showArrow = 'block'
  let maxWidth = 'calc(100vw - 16px)'
  let paddingLeft = 'calc(48px)'
  let freeMode = false
  let on = {}
  if (!arrow) {
    showArrow = 'none'
    maxWidth = 'calc(100vw)'
    paddingLeft = '26px'
    freeMode = true
    on = {}
  } else {
    showArrow = 'block'
    maxWidth = 'calc(100vw - 16px)'
    paddingLeft = 'calc(48px + 16px)'
    freeMode = false
    on = {
      slideChange: (swiper) => {
        setActiveIndex(swiper.activeIndex)
      },
    }
  }
  useEffect(() => {
    register()

    if (!swiperRef.current) return
    const params = {
      // centeredSlides: true,
      // centeredSlidesBounds: true,
      slidesPerView: 'auto',
      freeMode: { freeMode },
      spaceBetween: `${gap}`,
      speed: '500',
      observer: true,
      injectStyles: [
        `
      .swiper {
        overflow: visible;
      }
      `,
      ],
      on: { ...on },
    }

    Object.assign(swiperRef.current, params)
    swiperRef.current.initialize()
  }, [data])

  return (
    <>
      <div
        className={styles.swiperCarousel}
        style={{
          maxWidth: `${maxWidth}`,
          width: `${width}`,
          paddingLeft: `${paddingLeft}`,
        }}
      >
        <swiper-container init="false" ref={swiperRef}>
          {data.map((v, i) => {
            return (
              <swiper-slide
                key={i}
                style={{
                  width: `${cardWidth}`,
                  maxWidth: `${cardMaxWidth}`,
                  opacity: `${activeIndex > i ? '0' : '1'}`,
                }}
              >
                {renderItem ? (
                  renderItem(v)
                ) : (
                  <div
                    className="
                    d-flex justify-content-center align-items-center"
                    style={{
                      backgroundColor: '#bbb',
                      height: '392px',
                      width: '80vw',
                      maxWidth: '301px',
                      borderRadius: '40px',
                      boxShadow: '3px 3px 20px #000',
                    }}
                  >
                    Card {i + 1}
                  </div>
                )}
              </swiper-slide>
            )
          })}
        </swiper-container>
        {children}
        <button
          className={`${styles.navBtn} ${styles.prevBtn}`}
          style={{ display: `${showArrow}` }}
        >
          <FaArrowLeftLong className={styles.navIcon} onClick={handlePrev} />
        </button>
        <button
          className={`${styles.navBtn} ${styles.nextBtn}`}
          style={{ display: `${showArrow}` }}
        >
          <FaArrowRightLong className={styles.navIcon} onClick={handleNext} />
        </button>
      </div>
    </>
  )
}

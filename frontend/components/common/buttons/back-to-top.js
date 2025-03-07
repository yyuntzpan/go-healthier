import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaArrowUpLong } from 'react-icons/fa6'
import styles from './back-to-top.module.css'

export default function BackToTop() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // 給 BackToTop 按鈕用的
  const router = useRouter()
  const [showBtn, setShowBtn] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  // 監聽頁面滾動, 距離top>100px就顯示BacktoTop
  useEffect(() => {
    if (router.isReady) {
      const handleScroll = () => {
        if (!hasScrolled) {
          setHasScrolled(true)
        }
        if (
          window.scrollY >
          document.documentElement.scrollHeight - window.innerHeight * 2
        ) {
          setShowBtn(true)
        } else {
          setShowBtn(false)
        }
      }

      window.addEventListener('scroll', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [router.isReady, hasScrolled])

  return (
    <>
      {hasScrolled && (
        <button
          className={`${styles.backto_top} ${
            showBtn ? styles.slideUp : styles.slideDown
          }`}
          onClick={scrollToTop}
        >
          <FaArrowUpLong className={styles.backto_top_icon} />
          Top
        </button>
      )}
    </>
  )
}

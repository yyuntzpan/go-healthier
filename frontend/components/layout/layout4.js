import { useState, useEffect } from 'react'
import Navbar from '../common/navbar'
import Footer from '../common/footer'
import PageTitle from '../common/page-title'
import Head from 'next/head'
import BackToTop from '../common/buttons/back-to-top'
import styles from './layout3.module.css'

// 副標題要依照每個分支改的話可以輸入pageName
// index -> 首頁(預設)
// gyms -> 場館
// coaches -> 教練
// lessons -> 課程
// products -> 商城
// articles -> 文章
// users -> 會員

export default function Layout4({
  children,
  title = '',
  pageName = 'index',
  height = '229px',
  section = 'whiteSection',
}) {
  // 樣式設定
  const sectionMap = {
    whiteSection: 'whiteSection',
    flatSection: 'flatSection',
  }
  const sectionResult = styles[sectionMap[section]] || styles.whiteSection

  // 動畫設定
  const [slide, setSlide] = useState(0)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true)
      } else return

      const userScroll = window.scrollY
      const slideParam = -0.6
      setSlide(Math.ceil(slideParam * userScroll))
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{title ? title : ''}</title>
      </Head>
      <div className={`d-flex flex-column`}>
        <div
          style={{
            height: '340px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <Navbar position="relative" top="0" left="0" right="0" zIndex="100" />
          <div style={{ width: '100%', position: 'fixed', zIndex: '-1' }}>
            <PageTitle
              pageName={pageName}
              height={height}
              marginTop={`calc(111px + ${slide}px)`}
            />
          </div>
        </div>

        <section className={sectionResult}>{children}</section>
      </div>
      <Footer />
      <BackToTop />
    </>
  )
}

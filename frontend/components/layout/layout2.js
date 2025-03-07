import React from 'react'
import Navbar from '../common/navbar'
import Footer from '../common/footer'
import PageTitle from '../common/page-title'
import Head from 'next/head'
import BackToTop from '../common/buttons/back-to-top'

// 副標題要依照每個分支改的話可以輸入pageName
// index -> 首頁(預設)
// gyms -> 場館
// coaches -> 教練
// lessons -> 課程
// products -> 商城
// articles -> 文章
// users -> 會員

export default function Layout2({
  children,
  title = '',
  pageName = 'index',
  height = '',
}) {
  return (
    <>
      <Head>
        <title>{title ? title : ''}</title>
      </Head>
      <Navbar />
      <PageTitle pageName={pageName} height={height} />
      {children}
      <Footer />
      <BackToTop />
    </>
  )
}

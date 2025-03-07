import React from 'react'
import Navbar from '../common/navbar'
import Footer from '../common/footer'
import Head from 'next/head'
import BackToTop from '../common/buttons/back-to-top'

export default function Layout1({ children, title = '', hideLogo = false }) {
  return (
    <>
      <Head>
        <title>{title ? title : ''}</title>
      </Head>
      <Navbar hideLogo={hideLogo} />
      <div className={`d-flex flex-column`}>{children}</div>
      <Footer />
      <BackToTop />
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import { IoLogoFacebook, IoLogoInstagram } from 'react-icons/io5'
import { FaLine } from 'react-icons/fa6'
import styles from './footer.module.css'

export default function Footer() {
  return (
    <>
      <footer style={{ backgroundColor: '#fff' }}>
        {/* PC的footer */}
        <div className={styles.PC_footer}>
          <div className={styles.icon}>
            <li>
              <Link href="/">
                <IoLogoFacebook className={styles.footer_icon} />
              </Link>
            </li>
            <li>
              <Link href="/">
                <FaLine className={styles.footer_icon} />
              </Link>
            </li>
            <li>
              <Link href="/">
                <IoLogoInstagram className={styles.footer_icon} />
              </Link>
            </li>
          </div>
          <div>
            <img src="/logo-forNow-small.svg" alt="" />
            <p className={styles.copyRight}>
              Copyright &copy; 2024 All Rights Reserved.{' '}
            </p>
          </div>
        </div>

        {/* <!-- mobile的footer --> */}
        <div className={styles.mobile_footer}>
          <div className={styles.footer_info}>
            <li className={styles.footer_title}>
              <Link href="/">網站資訊</Link>
            </li>
            <div className={styles.content}>
              <li className={styles.footer_item}>
                <Link href="/">關於我們</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">聯絡我們</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">隱私政策</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">服務條款</Link>
              </li>
            </div>
            <li className={styles.footer_title}>
              <Link href="/">我想要運動</Link>
            </li>
            <div className={styles.content}>
              <li className={styles.footer_item}>
                <Link href="/">去那裡運動?</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">有那些課程?</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">教練資歷</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">運動商城</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">知識補給</Link>
              </li>
            </div>
            <li className={styles.footer_title}>
              <Link href="/">常見問題</Link>
            </li>
            <div className={styles.content}>
              <li className={styles.footer_item}>
                <Link href="/">如何預約課程?</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">哪個教練適合我?</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">怎麼買商品?</Link>
              </li>
              <li className={styles.footer_item}>
                <Link href="/">如何加入會員?</Link>
              </li>
            </div>
          </div>
          <div className={styles.mobile_footer_img}>
            <img src="/logo-forNow-mini.svg" alt="" />
          </div>
        </div>
      </footer>
    </>
  )
}

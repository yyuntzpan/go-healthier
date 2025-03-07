import React from 'react'
import Link from 'next/link'
import {
  IoPersonAdd,
  IoCart,
  IoReorderTwoOutline,
  IoCloseOutline,
  IoBarbell,
  IoWalk,
  IoBagCheck,
  IoChevronDown,
} from 'react-icons/io5'
import { PiMapPinFill, PiLightbulbFilamentFill } from 'react-icons/pi'
import { FaArrowRight, FaPersonRunning } from 'react-icons/fa6'
import styles from './layout.module.css'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useAuth } from '../../context/auth-context'
const defaultAvatar = 'http://localhost:3001/users/' // 用來做預設頭像的位置
import ShoppingCart from '../product/shoppingCart'
import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/product/use-cart'

// TODO: header logo offsets when toggle offcanvas, 可以參考kacco
// 也可以用看看 bootstrap offcanvas body scrollable
export default function Navbar({
  hideLogo = false,
  position = 'relative',
  width = '100%',
}) {
  const { auth, logout } = useAuth()
  const router = useRouter()
  const {
    product,
    item,
    increaseItem,
    decreaseItem,
    removeItem,
    calcTotalQty,
  } = useCart()
  const [hideNavLogo, setHideNavLogo] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true)
      }
      if (window.scrollY > 100) {
        setHideNavLogo(true)
      } else {
        setHideNavLogo(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [hasScrolled])

  // useEffect(() => {
  //   if (product && product.Product_name) {
  //     setItem([product])
  //   }
  // }, [product])

  // const calcTotalQty = () => {
  //   let total = 0
  //   for (let i = 0; i < item.length; i++) {
  //     total += item[i].qty
  //   }
  //   return total
  // }
  const handleSignInClick = useCallback(
    (e) => {
      e.preventDefault()
      const returnUrl = encodeURIComponent(router.asPath)
      router.push(`/users/sign_in?returnUrl=${returnUrl}`)
    },
    [router]
  )

  return (
    <>
      <header
        className={`${styles.navbarPC}`}
        style={{
          position: `${position}`,
          width: `${width}`,
        }}
      >
        <div className="logo">
          <Link href="/">
            <img src="/logo.png" alt="" className={`${styles.logoPhoto}`} />
          </Link>
        </div>
        <ul className={`${styles.list} h6-font`}>
          <li>
            <Link href="/gyms">
              <FaArrowRight className={styles.linkArrow} />
              找場館
            </Link>
          </li>
          <li>
            <Link href="/product">
              <FaArrowRight className={styles.linkArrow} />
              找商城
            </Link>
          </li>
          <li>
            <Link href="/lessons">
              <FaArrowRight className={styles.linkArrow} />
              找課程
            </Link>
          </li>
          <li>
            <Link href="/coaches">
              <FaArrowRight className={styles.linkArrow} />
              找教練
            </Link>
          </li>
          <li>
            <Link href="/articles">
              <FaArrowRight className={styles.linkArrow} />
              找知識
            </Link>
          </li>
        </ul>
        <ul className={`${styles.icons}`}>
          <div className={`${styles.cartContainer}`}>
            <ShoppingCart
            // item={item}
            // increaseItem={increaseItem}
            // decreaseItem={decreaseItem}
            // removeItem={removeItem}

            // calcTotalPrice={calcTotalPrice}
            />
            <span className={`${styles.badge}`}>{calcTotalQty()}</span>
          </div>
          {/* 若是有登入就顯示會員大頭貼，並且點擊後導向profile頁 */}
          {auth.id ? (
            <>
              <Link href="/users/profile">
                <img
                  src={`${defaultAvatar}${auth.avatar}`}
                  alt="會員頭像"
                  className={`${styles.member}`}
                />
              </Link>
              <li>
                <a href="#/" onClick={() => logout()}>
                  <FaPersonRunning className={`${styles.member}`} />
                </a>
              </li>
            </>
          ) : (
            <>
              {/* 若是沒有登入就顯示 person add 圖示，並且點擊後導向登入頁 */}
              <li>
                <Link href="/users/sign_in" onClick={handleSignInClick}>
                  <IoPersonAdd className={`${styles.member}`} />
                </Link>
              </li>
            </>
          )}
        </ul>
      </header>

      <header className={`${styles.navbarSP}`}>
        <div className="container-fluid">
          <Link href="/">
            <div
              className={`${styles.logo} row justify-content-center p-0 m-0`}
              style={
                hideLogo || hideNavLogo ? { opacity: '0' } : { opacity: '1' }
              }
            >
              <img src="/logo.png" alt="" className={`${styles.logoPhoto}`} />
            </div>
          </Link>
        </div>
        <button
          className={`${styles.navToggleBtn} navbar-toggler d-flex justify-content-center align-items-center bg-secondary`}
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#navbarMobile"
          aria-controls="navbarMobile"
          aria-label="Toggle navigation"
        >
          <IoReorderTwoOutline className={`${styles.navToggleIcon}`} />
        </button>
        <div
          className="offcanvas offcanvas-end"
          style={{
            border: '0',
            maxWidth: '50vw',
            height: '100vh',
            borderRadius: '25px 0 0 25px',
            backgroundColor: '#fff7e9',
          }}
          tabIndex="-1"
          id="navbarMobile"
          aria-labelledby="navbarMobileLabel"
        >
          <div className={`container-fluid p-3`}>
            <div
              className={`${styles.closeBtnRow} row justify-content-end p-0 m-0`}
            >
              <button
                type="button"
                className={`p-0`}
                aria-label="Close"
                data-bs-dismiss="offcanvas"
              >
                <IoCloseOutline className={`${styles.closeBtnIcon}`} />
              </button>
            </div>
            {/* 判斷是否登入 */}
            {/* 若是有登入就顯示會員大頭貼與nick_name或是name*/}
            <div className="row p-0 m-0 flex-column justify-content-between h-100">
              <ul className={`${styles.icons} col-12`}>
                <li>
                  {auth.id ? (
                    <>
                      <Link
                        className={`h3-font`}
                        href="#"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          className={`${styles.memberAvatar}`}
                          src={`${defaultAvatar}${auth.avatar}`}
                        />
                        {/* 登入的會員若沒有暱稱則顯示姓名 */}
                        <div className={styles.navbarSPLink}>
                          {' '}
                          {auth.nick_name ? auth.nick_name : auth.name}
                        </div>
                        <IoChevronDown />
                      </Link>
                      <ul className="dropdown-menu">
                        <li>
                          <Link
                            className="dropdown-item"
                            href="/users/profile/edit"
                          >
                            我的檔案
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href="/users/bookings"
                          >
                            我的預約
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href="/users/lessons_orders"
                          >
                            我的課程
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" href="/users/orders">
                            歷史訂單
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href="/users/favorites"
                          >
                            我的收藏
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="dropdown-item"
                            href="/"
                            onClick={() => logout()}
                          >
                            登出
                          </Link>
                        </li>
                      </ul>
                    </>
                  ) : (
                    <Link
                      className={`h3-font`}
                      href="/users/sign_in"
                      role="button"
                      aria-expanded="false"
                    >
                      <div className={styles.navbarSPLink}>還沒有登入哦</div>
                    </Link>
                  )}
                </li>
                <li>
                  <IoCart
                    style={{
                      height: '32px',
                      width: '32px',
                      margin: '10px 10px 10px 0',
                    }}
                  />
                  <span className={`h3-font`}>購物車</span>
                </li>
              </ul>

              <ul className={`${styles.icons} col-12`}>
                <li>
                  <Link className={`h3-font`} href="/gyms">
                    <PiMapPinFill />
                    <div className={styles.navbarSPLink}>找場館</div>
                  </Link>
                </li>
                <li>
                  <Link className={`h3-font`} href="/coaches">
                    <IoBarbell />
                    <div className={styles.navbarSPLink}>找教練</div>
                  </Link>
                </li>
                <li>
                  <Link className={`h3-font`} href="/lessons">
                    <IoWalk />
                    <div className={styles.navbarSPLink}>找課程</div>
                  </Link>
                </li>
                <li>
                  <Link className={`h3-font`} href="/product">
                    <IoBagCheck />
                    <div className={styles.navbarSPLink}>找商品</div>
                  </Link>
                </li>
                <li>
                  <Link className={`h3-font`} href="/articles">
                    <PiLightbulbFilamentFill />
                    <div className={styles.navbarSPLink}>找知識</div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

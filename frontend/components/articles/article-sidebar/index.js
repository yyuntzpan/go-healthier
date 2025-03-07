import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import useArticleFav from '@/hooks/article-fav/useArticleFav'

import {
  IoHeart,
  IoChatbubbleEllipses,
  IoShareSocialSharp,
} from 'react-icons/io5'
import styles from './article-sidebar.module.css'

export default function ArticleSidebar({
  showSidebar = true,
  // pageLoaded = false,
  fontSize = 0,
  setFontSize = () => {},
  commentRef,
  member_id,
  article_id = undefined,
  // auth = {},
}) {
  const { auth } = useAuth()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)
  const [isClicked, setIsClicked] = useState(member_id === auth.id)
  const { toggleArticleFav } = useArticleFav(
    auth,
    article_id,
    isClicked,
    setIsClicked
  )

  const handleFontSize = () => {
    if (fontSize === 2) {
      setFontSize(0)
      return
    }
    setFontSize(fontSize + 1)
  }

  const linkToClipBoard = async () => {
    const url = location.href
    window.navigator.clipboard.writeText(url)
  }

  const handleScroll = () => {
    if (commentRef.current) {
      commentRef.current.scrollIntoView({
        behaviour: 'smooth',
        block: 'start',
      })
    }
  }

  useEffect(() => {
    if (router.isReady) {
      setIsClicked(member_id === auth.id)
      setShouldRender(true)
    }
  }, [router.isReady, member_id])

  if (shouldRender === false) return null
  return (
    <>
      <div className={styles.sidebarPC}>
        <button
          className={styles.sidebarBtn}
          onClick={() => {
            handleFontSize()
          }}
        >
          <img
            className={styles.fontSizeImg}
            src="/articles-img/font-size.svg"
          />
        </button>
        <button
          className={`${styles.sidebarBtn} ${isClicked ? styles.clicked : ''}`}
          onClick={toggleArticleFav}
        >
          <IoHeart />
        </button>
        <button
          className={styles.sidebarBtn}
          onClick={() => {
            handleScroll()
          }}
        >
          <IoChatbubbleEllipses />
        </button>
        <button
          className={styles.sidebarBtn}
          onClick={() => {
            linkToClipBoard()
          }}
        >
          <IoShareSocialSharp />
        </button>
      </div>

      <div
        className={`
        ${styles.sidebarSP}
        ${showSidebar ? styles.slideUp : styles.slideDown}
        `}
      >
        <div className={styles.sidebarWrapper}>
          <button
            className={styles.sidebarBtn}
            onClick={() => {
              handleFontSize()
            }}
          >
            <img src="/articles-img/font-size-dark.svg" />
          </button>
          <button
            className={`${styles.sidebarBtn} ${
              isClicked ? styles.clicked : ''
            }`}
            onClick={toggleArticleFav}
          >
            <IoHeart />
          </button>
          <button
            className={styles.sidebarBtn}
            onClick={() => {
              handleScroll()
            }}
          >
            <IoChatbubbleEllipses />
          </button>
          <button
            className={styles.sidebarBtn}
            onClick={() => {
              linkToClipBoard()
            }}
          >
            <IoShareSocialSharp />
          </button>
        </div>
      </div>
    </>
  )
}

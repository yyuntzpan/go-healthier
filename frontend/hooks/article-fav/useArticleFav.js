import React from 'react'
import { useRouter } from 'next/router'
import LoginAlert from '../login-alert/login-alert'
import { ArticlesAddFav, ArticlesRemoveFav } from '@/configs/articles'

export default function useArticleFav(auth, idURL, isClicked, setIsClicked) {
  const router = useRouter()
  const loginalert = LoginAlert('登入後才能收藏喔~')

  const addFavArticle = async () => {
    const res = await fetch(ArticlesAddFav, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ member_id: `${auth.id}`, article_id: `${idURL}` }),
    })
    const resData = await res.json()
    if (resData.success) {
      setIsClicked(true)
    }
  }

  const removeFavArticle = async () => {
    const res = await fetch(ArticlesRemoveFav, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ member_id: `${auth.id}`, article_id: `${idURL}` }),
    })
    const resData = await res.json()
    if (resData.success) {
      setIsClicked(false)
    }
  }

  const toggleArticleFav = (e) => {
    if (!auth.id) {
      loginalert.fire().then((result) => {
        result.isConfirmed ? router.push('/users/sign_in') : ''
      })
    } else {
      if (!isClicked) {
        addFavArticle()
      } else {
        removeFavArticle()
      }
    }
  }
  return { toggleArticleFav, addFavArticle, removeFavArticle }
}

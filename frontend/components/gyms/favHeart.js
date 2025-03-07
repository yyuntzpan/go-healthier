import React, { useState, useEffect } from 'react'
import styles from './gymCard-spot.module.css'
import { useAuth } from '@/context/auth-context'
import { IoHeart } from 'react-icons/io5'

export default function FavHeart(data) {
  const [isClicked, setIsClicked] = useState(false)

  const { auth } = useAuth()

  const checkFavStatus = async () => {
    if (!auth || !data.id) return
    try {
      const response = await fetch(
        `http://localhost:3001/gyms/check-fav/${auth.id}/${data.id}`
      )

      if (!response.ok) {
        throw new Error('檢查收藏狀態失敗了')
      }
      const contentType = response.headers.get('Content-Type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Oh no!檢查收藏狀態失敗了，沒有正確的回應JSON格式')
      }
      const { isFavorite } = await response.json()
      setIsClicked(isFavorite)
      return
    } catch (error) {
      console.error('檢查收藏狀態失敗:', error)
    }
  }

  const toggleFavorite = async () => {
    try {
      const method = isClicked ? 'DELETE' : 'POST'
      const response = await fetch(
        `http://localhost:3001/gyms/api/favorites/${auth.id}/${data.id}`,
        {
          method: method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: auth.id,
            gymId: data.id,
          }),
        }
      )
      if (response.ok) {
        setIsClicked(!isClicked)
      }
      console.log(auth.id, data.id)
      console.log('切換收藏狀態成功:', response)
    } catch (error) {
      console.error('切換收藏狀態失敗:', error)
    }
  }

  useEffect(() => {
    console.log(data)
    console.log(auth)
    if (auth) {
      checkFavStatus()
    }
  }, [data.id, auth])

  return (
    <div
      className={`${styles.heart} ${isClicked ? styles.clicked : ''}`}
      onClick={toggleFavorite}
      onKeyDown={toggleFavorite}
      role="button"
      tabIndex={0}
    >
      <IoHeart />
    </div>
  )
}

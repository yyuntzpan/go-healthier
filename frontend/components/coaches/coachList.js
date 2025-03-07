import React from 'react'
import CoachCard from './coachCard'
import styles from '@/styles/coach.module.css'
import Link from 'next/link'
import Loader from '../loader'

const CoachList = ({ coaches, favorites = [], onFavoriteToggle }) => {
  const handleFavoriteToggle = (coachId) => {
    if (typeof onFavoriteToggle === 'function') {
      onFavoriteToggle(coachId)
    } else {
      console.error('onFavoriteToggle is not a function')
    }
  }

  return (
    <div className={styles.coachCards}>
      {coaches && coaches.length > 0 ? (
        coaches.map((coach) => (
          <div key={coach.coach_id} className={styles.cardWrapper}>
            <Link href={`/coaches/${coach.coach_id}`}>
              <CoachCard
                name={coach.coach_name}
                skill={coach.skills}
                imgSrc={`/${coach.coach_img}`}
                isLiked={
                  Array.isArray(favorites) && favorites.includes(coach.coach_id)
                }
                onHeartClick={() => handleFavoriteToggle(coach.coach_id)}
              />
            </Link>
          </div>
        ))
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default CoachList

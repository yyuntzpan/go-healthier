import React from 'react'
import styles from '@/styles/coachCard.module.css'
import { IoHeart } from 'react-icons/io5'

const CoachCard = ({
  name,
  skill,
  imgSrc,
  isLiked,
  onHeartClick,
  showHeart = true,
}) => {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onHeartClick) {
      onHeartClick()
    }
  }

  return (
    <div className={styles.coachCard}>
      <img src={imgSrc} alt={`${name}的照片`} className={styles.img} />
      <div className={styles.overlay}>
        <div className={styles.coach}>
          <div className={styles.coachName}>{name}</div>
          {showHeart && (
            <div
              className={`${styles.heart} ${isLiked ? styles.clicked : ''}`}
              onClick={handleClick}
              onKeyDown={handleClick}
              role="button"
              tabIndex={0}
            >
              <IoHeart />
            </div>
          )}
        </div>
        <div className={styles.coachSkill}>
          {Array.isArray(skill) ? skill.join(', ') : skill}
        </div>
      </div>
    </div>
  )
}

export default CoachCard

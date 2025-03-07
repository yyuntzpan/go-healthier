import Image from 'next/image'
import styles from '@/styles/lesson.module.css'

const LessonCard = ({ title, price, category, gym, imgSrc }) => {
  return (
    <div className={styles.lessonCard}>
      <div className={styles.imageWrapper}>
        <Image src={imgSrc} alt={title} className={styles.img} fill />
      </div>
      <div className={styles.lessonName}>
        <div className={styles.lessonTitle}>{title}</div>
        <div className={styles.lessonPrice}>{price}</div>
      </div>
      <div className={styles.lessonInfo}>
        <div>{category}</div>
        <div>{gym}</div>
      </div>
    </div>
  )
}

export default LessonCard

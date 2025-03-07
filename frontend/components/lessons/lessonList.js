import React from 'react'
import LessonCard from './lessonCard'
import styles from '@/styles/lesson.module.css'
import Link from 'next/link'
import Loader from '../loader'

const LessonList = ({ lessons }) => {
  console.log('Lessons in LessonList:', lessons)
  return (
    <div className={styles.cards}>
      {lessons.length > 0 ? (
        lessons.map((lesson) => (
          <div key={lesson.lesson_id} className={styles.cardWrapper}>
            <Link href={`/lessons/${lesson.lesson_id}`}>
              <LessonCard
                title={lesson.lesson_name}
                price={`NT$ ${lesson.lesson_price}`}
                category={lesson.categories}
                gym={lesson.gym_name}
                imgSrc={`/${lesson.lesson_img}`}
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

export default LessonList

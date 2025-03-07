import React from 'react'
import styles from './figcaption-card.module.css'

export default function FigCaption({ imgSrc = '', alt = '', caption = '' }) {
  return (
    <>
      <figure className={styles.articleImg}>
        <img src={`/articles-img/${imgSrc}`} alt={alt} />
        <figcaption className={styles.articleImgText}>{caption}</figcaption>
      </figure>
    </>
  )
}

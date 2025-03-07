import React from 'react'
import styles from '../../styles/sign-in.module.css'

export default function MyBtn({ buttonText }) {
  return (
    <div className={styles.form_group_center}>
      <button className={styles.btn_md} type="submit">
        <h6 className={styles.h6}>{buttonText}</h6>
      </button>
    </div>
  )
}

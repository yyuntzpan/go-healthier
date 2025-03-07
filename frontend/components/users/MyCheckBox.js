import React from 'react'
import styles from '../../styles/mycheckbox.module.css'
export default function MyCheckBox() {
  return (
    <div className={styles.filter}>
      <div className={styles.checkboxWrapper}>
        <div className={styles.checkboxes}>
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            className={styles.checkbox}
          />
          <label htmlFor="rememberMe">記住我</label>
        </div>
      </div>
    </div>
  )
}

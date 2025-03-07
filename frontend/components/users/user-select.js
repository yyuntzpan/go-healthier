import React from 'react'
import styles from './user-select.module.css'

export default function UserSelect({ options = [] }) {
  return (
    <>
      <select className={styles.user_select} id="" name="">
        <option value="0">下拉選擇類別</option>
        {options.map((v, i) => {
          return (
            <option key={v.id} value={v.id}>
              {v.type}
            </option>
          )
        })}
      </select>
    </>
  )
}

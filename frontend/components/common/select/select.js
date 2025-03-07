import React from 'react'
import { IoOptions } from 'react-icons/io5'
import styles from './select.module.css'
//TODO 讓搜尋元件可以傳入 placeholder, height(size), MaxWindth, backgroundColor
export default function Select({
  placeholder = '請輸入地址搜尋...',
  maxWidth = '600px',
  size = '60px',
  options = [],
  // 增加props mainColor or 設定Theme
}) {
  return (
    <div className={styles.select} style={{ maxWidth }}>
      <div
        className={styles.selectIcon}
        style={{
          width: size,
          height: size,
        }}
      >
        <IoOptions />
      </div>
      <select
        name="select_input"
        className={styles.select_input}
        style={{
          height: size,
          paddingLeft: `calc(${size} + 9px)`,
        }}
        placeholder={placeholder}
      >
        <option value="0">下拉選擇類別</option>
        {options.map((v, i) => {
          return (
            <option key={v.id} value={v.id}>
              {v.type}
            </option>
          )
        })}
      </select>
    </div>
  )
}

import { useState } from 'react'
import { IoSearch } from 'react-icons/io5'
import styles from './sidebar-search.module.css'

export default function SidebarSearch({
  showSearchbar = false,
  placeholder = '請輸入關鍵字搜尋...',
  maxWidth = '600px',
  size = '60px',
  paddingLeft = '9px',
  ...rest
}) {
  return (
    <div className={styles.search} style={{ maxWidth }}>
      <div
        className={styles.searchIcon}
        style={{
          width: size,
          height: size,
        }}
      >
        <IoSearch />
      </div>
      <input
        type="text"
        name="search_input"
        className={styles.search_input}
        style={{
          height: size,
          paddingLeft: `calc(${size} + ${paddingLeft})`,
        }}
        placeholder={placeholder}
        {...rest}
        tabIndex={showSearchbar ? 0 : -1}
      />
    </div>
  )
}

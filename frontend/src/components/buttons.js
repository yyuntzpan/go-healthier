import React from 'react'
import Link from 'next/link'
import styles from './button.module.css'

// 決定大小用的className
// const sizeMap = {
//   sm: 'sm',
//   slim: 'slim',
//   thin: 'thin',
//   thin2: 'thin2',
//   md: 'md',
//   md2: 'md2',
//   lg: 'lg',
// }

// 決定顏色用的className
// const bgColorMap = {
//   midnightgreen: 'midnightgreen',
//   yellow: 'yellow',
//   tomato: 'tomato',
//   gray50: 'gray50',
//   darkgray: 'darkgray',
//   outline: 'outline',
//   outlineLight: 'outlineLight',
// }

export default function Btn() {
  return (
    <>
      {/* React 版本 */}
      <Link
        href="/"
        className={`${styles.link} ${styles.md} ${styles.midnightgreen} rounded-pill`}
      >
        按鈕式連結
      </Link>

      <button
        className={`${styles.md} ${styles.outline} rounded-pill`}
        onClick={() => {}}
      >
        按鈕
      </button>

      {/* HTML 版本 */}
      {/* <button class="md outline rounded-pill">
        按鈕
      </button>

      <a href="#" class="link md outline rounded-pill">按鈕式連結</a> */}
    </>
  )
}

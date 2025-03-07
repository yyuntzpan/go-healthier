import React from 'react'
import Link from 'next/link'
import styles from './button.module.css'

// 總共有這些props
// size 決定大小
// bgColor 決定顏色
// btnOrLink 決定是連結按鈕 / 普通按鈕
// hrefURL 連結按鈕的URL
// shadow 要不要加預設陰影
// onClick 接收按鈕 onClick 的callback function
// ...props 其他 ex. style={{width:...}}

// 決定大小, 顏色, 按鈕功能用的參數們
const sizeMap = {
  sm: 'sm',
  slim: 'slim',
  thin: 'thin',
  thin2: 'thin2',
  md: 'md',
  md2: 'md2',
  lg: 'lg',
}

const bgColorMap = {
  midnightgreen: 'midnightgreen',
  yellow: 'yellow',
  tomato: 'tomato',
  gray50: 'gray50',
  darkgray: 'darkgray',
  outline: 'outline',
  outlineLight: 'outlineLight',
}

const btnOrLinkMap = {
  link: 'link',
  button: 'button',
}

export default function Btn({
  children,
  size = 'lg',
  width = '100%',
  maxWidth = '250px',
  bgColor = 'midnightgreen',
  btnOrLink = 'button', // 按鈕要作為 <Link> 還是普通按鈕
  hrefURL = '/', // 只有在 btnOrLink = link 的時候有作用
  shadow = false, // 決定要不要加預設陰影
  className = '', // 自定義className
  onClick = () => {},
  ...props // 直接輸入像 height:"100px" 樣式語法, 作用跟style={{ }}一樣
}) {
  // size, bgColor 偵測輸入的值 & 防呆
  const sizeClass = styles[sizeMap[size]] || styles.lg
  const bgColorClass = styles[bgColorMap[bgColor]] || styles.midnightgreen

  // btnOrLink 防呆措施, 輸入錯誤就會變回預設 'button'
  const btnOrLinkResult = btnOrLinkMap[btnOrLink] || 'button'

  const classNames = [sizeClass, bgColorClass, shadow ? shadow : '', className]
    .filter(Boolean)
    .join(' ')

  // 依照 btnOrLink 防呆結果 在button裡面塞<Link> 或塞純文字
  return (
    <>
      {btnOrLinkResult === 'link' ? (
        <Link
          className={`${classNames} ${styles.link}`}
          href={hrefURL}
          style={{ width: `${width}`, maxWidth: `${maxWidth}`, ...props }}
        >
          {children}
        </Link>
      ) : (
        <button
          className={`${classNames} ${styles.customBtn}`}
          onClick={onClick}
          {...props}
          style={{ width: `${width}`, maxWidth: `${maxWidth}`, ...props }}
        >
          {children}
        </button>
      )}
    </>
  )
}

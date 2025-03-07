import React from 'react'
import styles from './toggle-comment.module.css'

export default function ToggleComment({
  onClick = () => { },
  group = 0,
  totalGroup = 0,
  perGroup = 0,
  remain = 0,
}) {
  return (
    <>
      <div className={styles.togglePrevComment}>
        <button
          id="showMore"
          onClick={onClick}
          style={{
            display: `${group < totalGroup ? 'flex' : 'none'}`,
          }}
        >
          <span>...查看{remain > perGroup ? perGroup : remain}則留言</span>
        </button>
        <button
          id="showLess"
          onClick={onClick}
          style={{
            display: `${group >= 2 ? 'flex' : 'none'}`,
          }}
        >
          <span>隱藏留言</span>
        </button>
      </div>
    </>
  )
}

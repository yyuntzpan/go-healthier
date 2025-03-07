import React, { useRef, useEffect, useState } from 'react'
import anime from 'animejs'
import toast from 'react-hot-toast'
import styles from './test-btn.module.css'

const AddToCartButton = ({ addItem, product }) => {
  const buttonRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (active) {
      const button = buttonRef.current
      anime({
        targets: button,
        scale: [
          { value: 0.97, duration: 150, easing: 'easeOutQuad' },
          { value: 1, duration: 1200, elasticity: 600 },
        ],
        translateY: [
          { value: -10, duration: 300, easing: 'easeOutQuad' },
          { value: 0, duration: 800, elasticity: 600 },
        ],
        complete: () => setActive(false),
      })

      // 其他动画效果可以添加在这里
    }
  }, [active])

  const handleClick = (e) => {
    e.preventDefault()
    if (active) return

    setActive(true)
    addItem(product)
    toast.success(`${product.Product_name} 已成功加入購物車`)
  }

  return (
    <button
      ref={buttonRef}
      className={`${styles['add-to-cart']} ${active ? styles.active : ''}`}
      onClick={handleClick}
    >
      <span>加入購物車</span>

      <div className={styles.cart}>
        <svg viewBox="0 0 36 26">
          <path
            d="M1 2.5H6L10 18.5H25.5L28.5 7.5L7.5 7.5"
            className={styles.shape}
          />
          <path
            d="M11.5 25C12.6046 25 13.5 24.1046 13.5 23C13.5 21.8954 12.6046 21 11.5 21C10.3954 21 9.5 21.8954 9.5 23C9.5 24.1046 10.3954 25 11.5 25Z"
            className={styles.wheel}
          />
          <path
            d="M24 25C25.1046 25 26 24.1046 26 23C26 21.8954 25.1046 21 24 21C22.8954 21 22 21.8954 22 23C22 24.1046 22.8954 25 24 25Z"
            className={styles.wheel}
          />
          <path d="M14.5 13.5L16.5 15.5L21.5 10.5" className={styles.tick} />
        </svg>
      </div>
    </button>
  )
}

export default AddToCartButton

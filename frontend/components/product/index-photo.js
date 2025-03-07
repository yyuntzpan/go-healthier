import React, { useRef, useEffect } from 'react'
import anime from 'animejs'
import Link from 'next/link'
import styles from './product-index.module.css'

export default function IndexPhoto() {
  const imageRefs = useRef([])
  const textRefs = useRef([])

  useEffect(() => {
    imageRefs.current.forEach((image, index) => {
      anime({
        targets: image,
        scale: [0.8, 1],
        rotate: ['-10deg', '0deg'],
        delay: index * 200,
        duration: 1000,
        easing: 'easeOutElastic(1, 0.5)',
      })
    })

    textRefs.current.forEach((text, index) => {
      anime({
        targets: text,
        opacity: [0, 1],
        translateY: [20, 0],
        delay: index * 300,
        duration: 800,
        easing: 'easeOutQuad',
      })
    })
  }, [])

  return (
    <div
      className="container-fluid"
      style={{
        marginTop: '-50px',
      }}
    >
      <div className="row">
        {[
          {
            src: '/product-img/居家訓練.jpg',
            text: '居家訓練',
            link: '/product/productTraningList',
          },
          {
            src: '/product-img/居家訓練2.jpg',
            text: '居家訓練',
            link: '/product/productTraningList',
          },
          {
            src: '/product-img/健康食品.jpg',
            text: '健康食品',
            link: '/product/productFoodList',
          },
          {
            src: '/product-img/健康食品2.jpg',
            text: '健康食品',
            link: '/product/productFoodList',
          },
          {
            src: '/product-img/健身服飾.jpg',
            text: '健身服飾',
            link: '/product/productClothList',
          },
          {
            src: '/product-img/健身護具2.jpg',
            text: '健身護具',
            link: '/product/productProtectList',
          },
        ].map((item, index) => (
          <div key={index} className="col-12 col-md-6 position-relative p-0">
            <Link href={item.link} className="text-decoration-none">
              <img
                src={item.src}
                alt=""
                className={`w-100 ${styles.image}`}
                ref={(el) => (imageRefs.current[index] = el)}
              />
              <div
                className={styles.picturetitle}
                ref={(el) => (textRefs.current[index] = el)}
              >
                <p className="fs-2">{item.text}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

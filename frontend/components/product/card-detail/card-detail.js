import React from 'react'
import styles from './card-detail.module.css'

export default function CardDetail() {
  return (
    <>
      <div className={styles.cardsize}>
        <img
          src="/product-img/food4.jpg"
          alt=""
          className="img-fluid"
          style={{
            marginBottom: '110px',
          }}
        />
        <div className={styles.card}>
          <h6
            style={{
              paddingRight: '100px',
            }}
          >
            乳清蛋白
          </h6>
          <p>每份蛋白質含量高達....</p>
        </div>
      </div>
      <div className={styles.cardsize}>
        <img
          src="/product-img/food29.jpg"
          alt=""
          className="img-fluid"
          style={{
            marginBottom: '110px',
          }}
        />
        <div className={styles.card}>
          <h6
            style={{
              paddingRight: '100px',
            }}
          >
            保健食品
          </h6>
          <p>台大醫師建議....</p>
        </div>
      </div>
      <div className={styles.cardsize}>
        <img
          src="/product-img/food28.jpg"
          alt=""
          className="img-fluid"
          style={{
            marginBottom: '110px',
          }}
        />
        <div className={styles.card}>
          <h6
            style={{
              paddingRight: '100px',
            }}
          >
            綜合維他命
          </h6>
          <p>經研究顯示....</p>
        </div>
      </div>
    </>
  )
}

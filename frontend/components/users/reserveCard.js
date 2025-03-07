import React from 'react'
import styles from './reserveCard.module.css'
import { FaDumbbell, FaLocationDot } from 'react-icons/fa6'

export default function ReserveCard({ reservation }) {
  const date = new Date(reservation.reserve_time)
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`
  const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  const formattedTime = date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      <div className={styles.card}>
        <div className={styles.card_background}>
          <img
            className={styles.card_img}
            src={`/${reservation.gymimg}`}
            alt=""
          />
        </div>
        <div className={styles.card_body}>
          <p className={styles.num}>{formattedDate}</p>
          <p className={styles.p_font}>星期{dayOfWeek}</p>
          <div className={styles.flexbox}>
            <p className={styles.p_font}>{formattedTime}</p>
            <p className={styles.p_font}>{reservation.gym_name}</p>
          </div>
        </div>
      </div>
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import styles from './joinMember.module.css'

export default function JoinMember({ className = '' }) {
  return (
    <>
      <section className={`${className} ${styles.joinMember}`}>
        <div className="container fixed-960 py-0 px-3">
          <div className="row flex-column align-items-center p-0 m-0">
            <div
              className={`${styles.joinMemberCard} d-flex flex-column justify-content-center align-items-center bg-secondary`}
            >
              <h3>加入會員 ?</h3>
              <p>
                健康第一步，開啟活力的關鍵！加入我們，享受更進一步的服務，將喜愛的場館、教練、課程做收藏管理，快速預約，立即啟動你的活力，Be
                Healthier！
              </p>
              <div className={styles.btnPC}>
                <Link
                  href="/"
                  className={`${styles.link} ${styles.lg} ${styles.midnightgreen} rounded-pill`}
                  style={{ width: '312px' }}
                >
                  去健身
                </Link>
              </div>
              <div className={styles.btnSP}>
                <Link
                  href="/"
                  className={`${styles.link} ${styles.thin2} ${styles.midnightgreen} rounded-pill`}
                  style={{ width: '210px' }}
                >
                  去健身
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

import React from 'react'
import styles from '@/styles/MyStepProcess.module.css'

export default function MyStepProcess({ steps = [], currentStep }) {
  return (
    <div className="container  mb-5">
      <div className={styles.MyStepProcess}>
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className={`col-3 col-md-3 ${styles.size}`}>
              {/* 當 currentStep 等於 i + 1 時，就會顯示 activeStep 的樣式 */}
              <div
                className={`${styles.test} ${
                  currentStep === i + 1 ? styles.activeStep : ''
                }`}
              >
                {i + 1}
              </div>
              <div className={styles.checkFount}>{step}</div>
            </div>
            {/* 虛線數量會是步驟的數量-1 */}
            {i < steps.length - 1 && (
              <div className={`col-1 ${styles.dashContainer}`}>
                <div className={styles.dash}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

// 當 i = 0 時，第1步（i + 1 = 1）
// 當 i = 1 時，第2步（i + 1 = 2）
// 當 i = 2 時，第3步（i + 1 = 3）

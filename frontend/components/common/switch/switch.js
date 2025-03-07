import React from 'react'
import styles from './switch.module.css'

export default function Switch({ isOn, handleToggle }) {
  return (
    <><label htmlFor="switchOld" className={styles.switchText}>僅顯示友善場館</label>
      <div>
        <input
          checked={isOn}
          onChange={handleToggle}
          className={styles.switchCheckbox}
          id="switchOld"
          type="checkbox"
        />
        <label
          style={{ background: isOn && '#19394A' }}
          className={styles.switchLabel}
          htmlFor="switchOld"
        >
          {/* eslint-disable-line jsx-a11y/label-has-associated-control */}
          <span className={styles.switchButton}></span>
        </label>
      </div>
    </>
  )
}

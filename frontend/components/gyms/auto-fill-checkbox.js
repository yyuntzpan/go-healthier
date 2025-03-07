import React, { useState } from 'react'
import styles from './g-component.module.css'

const AutofillCheckbox = ({ onAutofill }) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleChange = () => {
    const newCheckedState = !isChecked
    setIsChecked(newCheckedState)
    onAutofill(newCheckedState)
  }

  return (
    <div className={styles.flexRow}>
      <input
        type="checkbox"
        id="autofill"
        checked={isChecked}
        onChange={handleChange}
        className={styles.checkbox}
      />
      <label htmlFor="autofill" className={styles.label}>
        代入會員資料
      </label>
    </div>
  )
}

export default AutofillCheckbox

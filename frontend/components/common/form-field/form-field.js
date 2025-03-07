import React from 'react'
import styles from './form-field.module.css'

export default function FormField({
  label = '欄位',
  type = 'text',
  name = '',
  id = '',
  options = [],
  placeholder = '',
  value = '',
  onChange = () => {},
  error = '',
  ref = () => {},
}) {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select name={name} id={id} className={styles.input}>
            {options.map((option, index) => (
              <option
                key={index}
                value={typeof option === 'object' ? option.value : option}
              >
                {typeof option === 'object' ? option.label : option}
              </option>
            ))}
          </select>
        )
      case 'textarea':
        return (
          <textarea name={name} id={id} className={styles.input}></textarea>
        )
      case 'text':
      case 'email':
      case 'password':
      case 'number':
      default:
        return (
          <div>
            <input
              type={type}
              name={name}
              id={id}
              className={styles.input}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              ref={ref}
            />
            <div className={styles.errorContainer}>
              {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
          </div>
        )
    }
  }
  return (
    <div>
      <div className={styles.formLabel}>{label}</div>
      {renderInput()}
    </div>
  )
}

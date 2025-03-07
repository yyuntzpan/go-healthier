import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Checkbox from './checckbox'
import styles from '@/styles/lesson.module.css'

const CheckboxList = ({ checked, onCategoryChange }) => {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/coaches/categories'
        )
        if (response.data.success) {
          setCategories(response.data.categories)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target
    onCategoryChange(value, checked)
  }

  return (
    <div className={styles.checkboxWrapper}>
      {categories.map((category, index) => (
        <div key={index} className={styles.checkboxes}>
          <input
            type="checkbox"
            id={category.code_desc}
            value={category.code_desc}
            name={category.code_desc}
            checked={checked.includes(category.code_desc)}
            className={styles.checkbox}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={category.code_desc} className={styles.checkboxLabel}>
            {category.code_desc}
          </label>
        </div>
      ))}
    </div>
  )
}

export default CheckboxList

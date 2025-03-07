import React from 'react'
import { useEffect } from 'react'
import styles from '../styles/loader2.module.css'
// import { dotSpinner } from 'ldrs'

export default function Loader2() {
  useEffect(() => {
    async function getLoader() {
      const { dotSpinner } = await import('ldrs')
      dotSpinner.register()
    }
    getLoader()
  }, [])
  // Default values shown
  return (
    <>
      <div className={styles.loader}>
        <l-dot-spinner size="40" speed="0.9" color="black"></l-dot-spinner>
      </div>
    </>
  )
}

// Default values shown

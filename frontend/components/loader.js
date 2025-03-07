import React from 'react'
import { useEffect } from 'react'
// import { dotSpinner } from 'ldrs'

export default function Loader() {
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
      <l-dot-spinner size="40" speed="0.9" color="black"></l-dot-spinner>
    </>
  )
}

// Default values shown

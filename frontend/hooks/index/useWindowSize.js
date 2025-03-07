import { useState, useEffect } from 'react'

const useWindowSize = () => {
  // 預設viewport width為undefined 讓 server 與 client 一致
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    // 下面這些只會在client跑
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      // 監聽視窗尺寸改變
      window.addEventListener('resize', handleResize)

      // 呼叫handleResize 來更改 state
      handleResize()

      // cleanup effect, 移除事件處理器
      return () => window.removeEventListener('resize', handleResize)
    }
  }, [])

  return windowSize
}

export default useWindowSize

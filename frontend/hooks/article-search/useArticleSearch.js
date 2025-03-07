import { useState } from 'react'
import { useRouter } from 'next/router'

export default function useArticleSearch(scroll = false) {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && keyword) {
      router.push(
        {
          pathname: '/articles/search',
          query: { keyword: keyword },
        },
        undefined,
        {
          scroll: scroll,
        }
      )
    }
  }

  return {
    keyword,
    setKeyword,
    handleKeyDown,
  }
}

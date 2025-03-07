import React from 'react'
import useArticleSearch from '@/hooks/article-search/useArticleSearch'
import SidebarSearch from '@/components/articles/article-sidebar/sidebar-search'
import styles from './search-section.module.css'

export default function SearchSection() {
  const { keyword, setKeyword, handleKeyDown } = useArticleSearch(true)

  return (
    <>
      <div className={`${styles.search}`}>
        <div className="container fixed-960 px-3">
          <div className="row flex-column justify-content-center align-items-center px-0 mx-0 g-0">
            <h4>找其他文章</h4>
            <SidebarSearch
              maxWidth="960px"
              placeholder="輸入關鍵字搜尋文章..."
              showSearchbar={true}
              value={`${keyword}`}
              onChange={(e) => {
                setKeyword(e.target.value)
              }}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>
    </>
  )
}

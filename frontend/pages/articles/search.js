import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useArticleSearch from '@/hooks/article-search/useArticleSearch'
import { useAuth } from '@/context/auth-context'
import { ArticlesListData } from '@/configs/articles'

import Layout4 from '@/components/layout/layout4'
import useRenderCards from '@/hooks/cards/cards'
import SidebarSearch from '@/components/articles/article-sidebar/sidebar-search'
import SearchSection from '@/components/articles/search-section'
import BS5Pagination from '@/components/product/Pagination/bs5-pagination'
import styles from './type.module.css'

export default function ArticleType() {
  const { auth } = useAuth()
  const renderCard = useRenderCards('articles')
  const [articleList, setArticleList] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const { keyword, setKeyword, handleKeyDown } = useArticleSearch()
  const router = useRouter()

  const onPageChange = (e) => {
    const pageNum = e.selected + 1
    router.push({ query: { ...router.query, page: pageNum } }, undefined, {
      scroll: false,
    })
  }

  const getList = async (url, token) => {
    let res = ''
    let resData = ''
    try {
      if (token) {
        res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        })
        resData = await res.json()
      } else {
        res = await fetch(url)
        resData = await res.json()
      }
    } catch (error) {
      console.log('database fetch data error: ', error)
    }
    if (resData.success) {
      if (resData.redirect) {
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, ...resData.redirect },
          },
          undefined,
          { shallow: true }
        )
      }
      setArticleList(resData.rows)
      setTotalPages(resData.totalPages)
    } else {
      // console.log(resData.success)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      const query = new URLSearchParams(router.query)
      const token = auth.id ? auth.token : ''
      const url = `${ArticlesListData}?${query}`
      getList(url, token)
    }
  }, [router])
  return (
    <>
      <Layout4 title="搜尋文章" pageName="articles">
        <section className={styles.padding80}>
          <div className="container-fluid p-0">
            <div className="row px-0 mx-0">
              <div
                className={`${styles.titleRow} col-12 d-flex justify-content-between align-items-center`}
              >
                <h4 className="text-primary">
                  關於“
                  {router.query.keyword ? router.query.keyword : '搜雄結果'}
                  ”的文章...
                </h4>
                <div className={styles.searchbarPC}>
                  <SidebarSearch
                    maxWidth="351px"
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
              {articleList.map((v, i) => {
                return (
                  <div
                    className={`${styles.card} col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12`}
                    key={i}
                  >
                    {renderCard(v)}
                  </div>
                )
              })}
              <div
                className={`${styles.page} col-12 d-flex justify-content-center`}
              >
                <div
                  className={`${styles.page} col-12 d-flex justify-content-center`}
                >
                  <BS5Pagination
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.searchbarSP}>
          <SearchSection />
        </section>
      </Layout4>
    </>
  )
}

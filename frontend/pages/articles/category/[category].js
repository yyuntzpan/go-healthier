import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useArticleSearch from '@/hooks/article-search/useArticleSearch'
import { ArticlesListData } from '@/configs/articles'

import useRenderCards from '@/hooks/cards/cards'
import Layout4 from '@/components/layout/layout4'
import SidebarSearch from '@/components/articles/article-sidebar/sidebar-search'
import SearchSection from '@/components/articles/search-section'
import BS5Pagination from '@/components/product/Pagination/bs5-pagination'
import styles from '../type.module.css'

export default function ArticleType() {
  const [articleList, setArticleList] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [pageCategory, setPageCategory] = useState('文章列表')
  const { keyword, setKeyword, handleKeyDown } = useArticleSearch()
  const renderCard = useRenderCards('articles')
  const router = useRouter()
  const categoryMap = {
    fitness: '體能鍛鍊',
    healthy_diet: '健康飲食',
    medical_care: '醫療保健',
    mental_wellness: '心靈健康',
    happy_learning: '熟齡學習',
  }

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
      const loginStatus = localStorage.getItem('suan-auth')
      let token = ''
      if (loginStatus) {
        token = JSON.parse(loginStatus).token
      }

      const url = `${ArticlesListData}?${query}`
      getList(url, token)
      setPageCategory(categoryMap[router.query.category])
    }
  }, [router])

  return (
    <>
      <Layout4 title={pageCategory} pageName="articles" section="whiteSection">
        <section className={styles.padding80}>
          <div className="container-fluid p-0 overflow-visible">
            <div className="row px-0 mx-0">
              <div
                className={`${styles.titleRow} col-12 d-flex justify-content-between align-items-center`}
              >
                <h4 className="text-primary">{pageCategory}</h4>
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
                <BS5Pagination
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
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

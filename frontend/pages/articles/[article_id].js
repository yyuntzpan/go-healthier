// 功能類
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/context/auth-context'
import { ArticlesEntry } from '@/configs/articles'

// 元件 + 樣式
import Layout4 from '@/components/layout/layout4'
import Btn from '@/components/articles/buttons_test'
import ArticleSidebar from '@/components/articles/article-sidebar'
import useRenderCards from '@/hooks/cards/cards'
import IndexCarousel from '@/components/swiperCarousel/indexCarousel'
import Comment from '@/components/articles/comment/comment'
import MarkdownContent from '@/components/articles/content'
import Loader from '@/components/loader'
import styles from './articleId.module.css'

export default function ArticlePage() {
  const { auth } = useAuth()
  const router = useRouter()
  const [showSidebar, setShowSidebar] = useState(false)
  const [content, setContent] = useState({})
  const [articles, setArticles] = useState([])
  const [author, setAuthor] = useState({})
  const [fontSize, setFontSize] = useState(0)
  const articleRef = useRef(null)
  const commentRef = useRef(null)

  // 顯示卡片的hook
  const renderCard = useRenderCards('articles')
  // 決定字體大小的 class map
  const fontSizeMap = {
    0: 'fontSize0',
    1: 'fontSize1',
    2: 'fontSize2',
  }

  // 後端 fetch 單篇文章資料
  const getArticle = async () => {
    const param = router.query.article_id
    try {
      // get individual article
      const res = await fetch(`${ArticlesEntry}/${param}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      })
      const resData = await res.json()
      setContent(resData.result)
      setAuthor(resData.authorInfo)
      setArticles(resData.furtherReading)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (router.isReady) {
      getArticle()
    }

    // 設定手機sidebar, 讓他可以依照視窗滑到哪就顯示或隱藏
    const options = {
      root: null,
      threshold: 0,
      rootMargin: '-650px 0px 0px 0px',
    }
    const observer = new IntersectionObserver(([entry]) => {
      setShowSidebar(entry.isIntersecting)
    }, options)
    if (articleRef.current) {
      observer.observe(articleRef.current)
    }
    return () => {
      if (articleRef.current) {
        observer.unobserve(articleRef.current)
      }
    }
  }, [router, content.member_id_fk])

  return (
    <>
      <Layout4
        title={
          JSON.stringify(content) !== '{}'
            ? `找知識 - ${content.article_title}`
            : '找知識 - 文章頁面'
        }
        pageName="articles"
      >
        {JSON.stringify(content) !== '{}' ? (
          <>
            <main ref={articleRef} className={`${styles.article} container`}>
              <aside className={styles.sidebarTrack}>
                <ArticleSidebar
                  showSidebar={showSidebar}
                  pageLoaded={router.isReady}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                  commentRef={commentRef}
                  content={content}
                  setContent={setContent}
                  member_id={content.member_id_fk}
                  article_id={router.query.article_id}
                  auth={auth}
                />
              </aside>
              <article className={styles[fontSizeMap[fontSize]]}>
                <div className="d-flex flex-column mx-0">
                  <h3 className={`${styles.articleTitle} text-primary`}>
                    {content.article_title}
                  </h3>
                  <div className={styles.articleInfo}>
                    <div className={`${styles.articleAuthor} w-md-50 w-100`}>
                      作者：{author.author_name}
                    </div>
                    <div className={`${styles.articleUpdateAt} w-md-50 w-100`}>
                      最後更新：{content.update_at}
                    </div>
                  </div>
                  <div className={`${styles.articleDesc}`}>
                    <p>編按：{content.article_desc}</p>
                  </div>
                  <div className={`${styles.articleCover} col-12`}>
                    <img src={`/articles-img/${content.article_cover}`} />
                  </div>
                </div>

                <div className={`${styles.articleContent}`}>
                  <MarkdownContent content={`${content.article_content}`} />
                </div>
              </article>
            </main>

            <section className={`${styles.author} bg-secondary`}>
              <div className="container fixed-960 p-0">
                <div className="row g-0 justify-content-md-between justify-content-center mx-0">
                  <div className={`${styles.authorImg} col-md-5 col-12`}>
                    <img src={author.author_image} />
                  </div>
                  <div className="col-md-7 col-12 ps-4">
                    <h3>關於作者 - {author.author_name}</h3>
                    <p>{author.author_desc}</p>
                    <div className="row g-0 justify-content-md-start justify-content-center">
                      <Btn
                        className={styles.authorBtnPC}
                        size="lg"
                        bgColor="midnightgreen"
                        width="100%"
                        maxWidth="312px"
                        btnOrLink="link"
                        hrefURL={
                          author.author_id
                            ? `/coaches/${author.author_id}`
                            : `${author.author_href}`
                        }
                      >
                        了解更多
                      </Btn>
                      <Btn
                        className={styles.authorBtnSP}
                        size="thin"
                        bgColor="midnightgreen"
                        width="100%"
                        maxWidth="173px"
                        btnOrLink="link"
                        hrefURL={
                          author.author_id
                            ? `/coaches/${author.author_id}`
                            : `${author.author_href}`
                        }
                      >
                        了解更多
                      </Btn>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.moreArticles}>
              <IndexCarousel
                title="延伸閱讀"
                renderItem={renderCard}
                data={articles}
                cardMaxWidth="350px"
                showBtn={false}
              />
            </section>

            <section className={styles.commentSect}>
              <div className={`${styles.comment} container`}>
                <div className={`row`}>
                  <h3 id="commentSection" ref={commentRef}>
                    看看留言
                  </h3>
                  <div>
                    <Comment />
                  </div>
                </div>
              </div>
            </section>

            <section className={`${styles.cta}`}>
              <div className="container fixed-960 py-0 px-3">
                <div className="row flex-column align-items-center p-0 m-0">
                  <div
                    className={`${styles.ctaCard} d-flex flex-column justify-content-center align-items-center bg-secondary`}
                  >
                    <h3>想要去動一動嗎?</h3>
                    <p>
                      保持活力，永不嫌晚！閱讀完文章後，立即找到附近的健身房，開始您的健身之旅吧！
                    </p>
                    <div
                      className={`${styles.ctaBtnPC} justify-content-between w-100`}
                    >
                      <Btn
                        size="lg"
                        bgColor="midnightgreen"
                        btnOrLink="link"
                        hrefURL="/articles"
                        width="100%"
                        maxWidth="270px"
                      >
                        前往地圖
                      </Btn>
                      <Btn
                        size="lg"
                        bgColor="midnightgreen"
                        btnOrLink="link"
                        hrefURL="/articles"
                        width="100%"
                        maxWidth="270px"
                      >
                        文章首頁
                      </Btn>
                    </div>
                    <div
                      className={`${styles.ctaBtnSP} justify-content-between w-100`}
                    >
                      <Btn
                        size="thin"
                        bgColor="midnightgreen"
                        btnOrLink="link"
                        hrefURL="/gyms"
                        width="100%"
                        maxWidth="100%"
                      >
                        前往地圖
                      </Btn>
                      <Btn
                        size="thin"
                        bgColor="midnightgreen"
                        btnOrLink="link"
                        hrefURL="/articles"
                        width="100%"
                        maxWidth="100%"
                      >
                        文章首頁
                      </Btn>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div className={styles.loaderBlock}>
            <Loader />
          </div>
        )}
      </Layout4>
    </>
  )
}

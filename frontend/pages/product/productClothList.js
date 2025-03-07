import React, { useEffect, useState } from 'react'
import MyProductList from '@/components/product/product-list'
import styles from '@/styles/product-list.module.css'
import Index from '@/components/joinMember'
import Layout4 from '@/components/layout/layout4'
// import Pagination from '@/components/product/Pagination/Pagination'
import BS5Pagination from '@/components/product/Pagination/bs5-pagination'
import CardList from '@/components/product/card-list/card-list'
import SideBar from '@/components/product/side-bar/side-bar'
import { useRouter } from 'next/router'
import Link from 'next/link'
export default function ProductList() {
  const router = useRouter()
  const [proTect, setProTect] = useState('')
  const [data, setData] = useState({
    //呈現資料內容要用狀態
    success: false,
    rows: [],
  })

  const [page, setPage] = useState(1) // 目前第幾頁
  const [perpage, setPerpage] = useState(10) // 每頁幾筆資料
  const [nameLike, setNameLike] = useState('') // 搜尋關鍵字
  const [search, setSearch] = useState(false)

  /*
  useEffect(() => {
    // 剛進入頁面時，依據網址 url path 解析出 query value ，給分類使用
    
    const pathname = router.pathname
    const pathParts = pathname.split('/')
    const queryValue = pathParts[pathParts.length - 1].split('?')[0]
    console.log(`query value: ${queryValue}`)
    setQuery(queryValue)
    
  }, [])
  */

  //將後端的資料塞進updateProductData的function裡，在下面再用useEffect去抓(fetch)後端的資料
  function updateProductData() {
    const pathname = router.pathname
    const pathParts = pathname.split('/')
    const query = pathParts[pathParts.length - 1].split('?')[0]
    // console.log(query, 'query')
    //URLSearchParams這是一個 Web API，用於處理 URL 的查詢字符串。它提供了一種簡單的方式來創建、修改和解析 URL 參數。

    let queryParams = ''
    console.log(search)
    if (search) {
      queryParams = new URLSearchParams({
        category: query,
        page: 1,
        keyword: nameLike,
        // type: protect, //只有Protect才有這個參數 ，後端let subCategory = req.query.type || ""; //健身護具的分類， type: protect 後端:前端
      })
      setSearch(false)
    } else {
      queryParams = new URLSearchParams({
        category: query,
        page: page,
        keyword: nameLike,
        // type: protect, //只有Protect才有這個參數 ，後端let subCategory = req.query.type || ""; //健身護具的分類， type: protect 後端:前端
      })
    }
    // console.log(`query params: ${queryParams.toString()}`)

    // const query = new URLSearchParams({ id: productId })
    // console.log(router)
    const url = `http://localhost:3001/product/api?${queryParams.toString()}`

    fetch(url)
      .then((r) => r.json())
      .then((myData) => {
        if (myData.success) {
          if (myData.redirect) {
            router.push(myData.redirect, undefined, {
              scroll: false,
            })
            setPage(1)
          } else {
            setData(myData)
          }
        }
      })
      .catch((e) => console.log(e))
  }

  //用useEffect去抓(fetch)後端的資料
  useEffect(() => {
    updateProductData()
  }, [router, page, perpage])
  return (
    <Layout4 pageName="products" title="健身服飾">
      <main className={styles.mainWithMargin}>
        <div className={styles.container}>
          <div className="row">
            <div className="col-12 col-md-3 ">
              <SideBar
                proTect={proTect}
                setProTect={setProTect}
                updateProductData={updateProductData}
              />

              <MyProductList
                nameLike={nameLike} // 將 nameLike 傳到下層給 search 使用
                setNameLike={setNameLike} // 將 setNameLike 傳到下層給 search 使用
                updateProductData={updateProductData}
              />
            </div>
            <div className="col-12 col-md-8">
              <div className="row d-flex justify-content-center">
                {data.rows.map((v, i) => {
                  return (
                    <div
                      key={v.Product_id}
                      className={`col-12 col-md-8 col-lg-4 mb-3 ${styles.move}`}
                    >
                      <Link href={`/product/${v.Product_id}`}>
                        <CardList
                          id={v.Product_id}
                          name={v.Product_name}
                          price={v.Product_price}
                          img={v.Product_photo}
                        />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
            <BS5Pagination
              forcePage={page - 1}
              onPageChange={(e) => {
                setPage(e.selected + 1)
                router.push(`?page=${e.selected + 1}`, undefined, {
                  scroll: false,
                })
              }}
              totalPages={data.totalPages}
            />
          </div>
        </div>
        <Index />
      </main>
    </Layout4>
  )
}

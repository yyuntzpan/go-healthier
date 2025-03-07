import React from 'react'

// TODO: make props and link, make use of useContext to pass variable to breadcrumb?

export default function Breadcrumb({ pageName = 'index' }) {
  const pageList = {
    index: { main: '首頁', path: '/' },
    gyms: { main: '場館', path: '/gyms' },
    coaches: { main: '教練', path: '/coaches' },
    lessons: { main: '課程', path: '/lessons' },
    products: { main: '商城', path: '/products' },
    articles: { main: '文章', path: '/articles' },
    users: { main: '會員', path: '/users/profile' },
    // 'users/profile': { main: '會員', path: '/users/profile' },
  }

  const currentPage = pageList[pageName] || pageList.index

  return (
    <>
      <div>首頁 / {currentPage.main}</div>
    </>
  )
}

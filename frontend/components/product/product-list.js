import React from 'react'
import { FaSearch } from 'react-icons/fa'
import styles from '@/components/product/product-list.module.css'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'
import InputIME from './fillter'

export default function ProductList({
  nameLike,
  setNameLike,
  updateProductData,
}) {
  function searchKeyword() {
    updateProductData()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchKeyword()
    }
  }

  return (
    <>
      <div className="wrap">
        <div className={styles.search}>
          <InputIME
            className={styles.searchBar}
            type="text"
            name="searchInput"
            id="search"
            placeholder="搜尋商品"
            value={nameLike}
            onChange={(e) => {
              setNameLike(e.target.value)
            }}
            onKeyDown={handleKeyDown}
          />
          <button className={styles.searchBtn}>
            <FaSearch
              className={styles.iconLarge}
              onClick={() => {
                searchKeyword()
              }}
            />
          </button>
        </div>
      </div>
    </>
  )
}

import React, {
  // useCallback,
  // useRef,
  // useState,
  // useForwardRef,
  forwardRef,
} from 'react'
import { IoSearch } from 'react-icons/io5'
import styles from './searchbar.module.css'

const SearchBar = forwardRef(function SearchBar(
  props,
  searchBarRef
  // handleKeyDown,
  // paddingLeft = '9px'
) {
  const {
    placeholder = '請輸入地址搜尋...',
    maxWidth = '600px',
    size = '60px',
    setSearchTerm,
    searchTerm = '',
    handleSearch,
    handleClick,
    onCompositionChange = () => {},
    paddingLeft = '9px',
    // handleKeyDown = () => {},
  } = props

  // const handleScroll = () => {
  //   if (searchBarRef.current) {
  //     searchBarRef.current.scrollIntoView({
  //       behavior: 'smooth',
  //       block: 'start',
  //     })
  //   }
  // }

  // const handleClick = () => {
  //   const yOffset = -50 // 50px offset above the target
  //   const element = searchBarRef.current
  //   const y = element.getBoundingClientRect().top + window.scrollY + yOffset

  //   window.scrollTo({ top: y, behavior: 'smooth' })
  // }

  const handleCompositionStart = () => {
    onCompositionChange(true)
  }

  const handleCompositionEnd = (e) => {
    onCompositionChange(false)
    handleSearch()
  }

  return (
    <div className={styles.search} style={{ maxWidth }}>
      <div
        className={styles.searchIcon}
        style={{
          width: size,
          height: size,
        }}
      >
        <IoSearch />
      </div>
      <input
        type="text"
        name="search_input"
        value={searchTerm}
        onClick={() => {
          handleClick()
        }}
        ref={searchBarRef}
        onChange={(e) => setSearchTerm(e.target.value)}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        // onKeyDown={handleKeyDown}
        className={styles.search_input}
        style={{
          height: size,
          paddingLeft: `calc(${size} + ${paddingLeft})`,
        }}
        placeholder={placeholder}
      />
    </div>
  )
})

export default SearchBar

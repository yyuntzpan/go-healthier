// boostrap5 sytle pagination
import ReactPaginate from 'react-paginate'
import { MdNavigateBefore, MdNavigateNext } from 'react-icons/md'
import styles from './bs5-pagination.module.css'

export default function BS5Pagination({ forcePage, onPageChange, totalPages }) {
  return (
    <div className={`col-12 col-md-12 text-center ${styles.pg}`}>
      <ReactPaginate
        forcePage={forcePage}
        // nextLabel="下一頁 >"
        nextLabel={<MdNavigateNext />}
        onPageChange={onPageChange}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        // previousLabel="< 上一頁"
        previousLabel={<MdNavigateBefore />}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
      />
    </div>
  )
}

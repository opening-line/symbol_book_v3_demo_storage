import React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid"
import styles from "./pagination.module.css"

interface PaginationProps {
  currentPage: number
  totalPages: number // totalPagesは0から始まると仮定
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = []
    const pageRange = 3 // 現在のページの前後に表示するページ数の範囲

    for (let i = 0; i <= totalPages; i++) {
      if (
        i === 0 ||
        i === totalPages ||
        (i >= currentPage - pageRange && i <= currentPage + pageRange)
      ) {
        pages.push(i)
      } else if (
        i === currentPage - pageRange - 1 ||
        i === currentPage + pageRange + 1
      ) {
        pages.push("...")
      }
    }

    // 重複した「...」を排除
    return pages.filter(
      (page, index, arr) => page !== "..." || arr[index - 1] !== "...",
    )
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeftIcon className={styles.icon} />
      </button>
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`${styles.pageButton} ${
            typeof page === "number" && page === currentPage
              ? styles.pageButtonActive
              : styles.pageButtonInactive
          }`}
          onClick={() =>
            typeof page === "number" ? onPageChange(page) : null
          }
          disabled={page === "..."}
        >
          {typeof page === "number" ? (
            page
          ) : (
            <EllipsisHorizontalIcon className={styles.ellipsisIcon} />
          )}
        </button>
      ))}
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className={styles.icon} />
      </button>
    </div>
  )
}

export default Pagination

import React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/solid"

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
    <div className='flex justify-center mt-4'>
      <button
        className='mx-1 px-3 py-1 border rounded flex items-center'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <ChevronLeftIcon className='w-5 h-5 text-blue-500' />
      </button>
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`mx-1 px-3 py-1 border rounded w-12 h-12 flex items-center justify-center ${typeof page === "number" && page === currentPage ? "bg-blue-500 text-white" : "bg-white text-blue-500"}`}
          onClick={() =>
            typeof page === "number" ? onPageChange(page) : null
          }
          disabled={page === "..."}
        >
          {typeof page === "number" ? (
            page
          ) : (
            <EllipsisHorizontalIcon className='w-5 h-5 text-blue-500' />
          )}
        </button>
      ))}
      <button
        className='mx-1 px-3 py-1 border rounded flex items-center'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon className='w-5 h-5 text-blue-500' />
      </button>
    </div>
  )
}

export default Pagination

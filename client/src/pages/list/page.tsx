import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Pagination from "../../components/pagination.tsx"
import ImageListItem from "../../components/ImageListItem.tsx"
import Container from "../../components/Container.tsx"
import Button from "../../components/Button.tsx"
import TitleSection from "../../components/TitleSection.tsx"
import styles from "./page.module.css"

const ImageGallery: React.FC = () => {
  const { page } = useParams<{ page: string }>()
  const [perPage, setPerPage] = useState<number>(10)
  const navigate = useNavigate()

  const pageIndex = useMemo(() => {
    if (page === undefined) return 0
    const toNumber = Number(page)
    if (isNaN(toNumber)) return 0
    return toNumber
  }, [page])

  useEffect(() => {}, [pageIndex, perPage])

  const handleImageClick = (id: string | number) => {
    navigate(`/detail/${id}`)
  }

  const handleNewButtonClick = () => {
    navigate("/new")
  }

  const idList = useMemo(() => {
    const start = pageIndex * perPage
    const end = start + perPage
    return Array.from({ length: end - start }, (_, index) => start + index)
  }, [pageIndex, perPage])

  const onPageChange = (page: number) => navigate(`/list/${page}`)

  const handlePerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPerPage(Number(event.target.value))
  }

  return (
    <Container>
      <TitleSection>画像一覧</TitleSection>
      <div className={styles.buttonWrapper}>
        <Button onClick={handleNewButtonClick} color='blue'>
          新規作成
        </Button>
      </div>
      <div className={styles.perPageWrapper}>
        <label htmlFor='perPage' className={styles.perPageLabel}>
          表示件数:
        </label>
        <select
          id='perPage'
          value={perPage}
          onChange={handlePerPageChange}
          className={styles.selectPerPage}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className={styles.paginationWrapper}>
        <Pagination
          onPageChange={onPageChange}
          totalPages={1000}
          currentPage={pageIndex}
        />
      </div>
      <div className={styles.gridContainer}>
        {idList.map((id) => (
          <ImageListItem key={id} fileId={id} onClick={handleImageClick} />
        ))}
      </div>
      <div>
        <Pagination
          onPageChange={onPageChange}
          totalPages={1000}
          currentPage={pageIndex}
        />
      </div>
    </Container>
  )
}

export default ImageGallery

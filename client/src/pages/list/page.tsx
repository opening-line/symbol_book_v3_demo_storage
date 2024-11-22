import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Pagination from "../../components/pagination.tsx"
import ImageListItem from "../../components/ImageListItem.tsx"
import Container from "../../components/Container.tsx"
import Button from "../../components/Button.tsx"

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

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPerPage(Number(event.target.value))
  }

  return (
    <Container>
      <h1 className='text-2xl font-bold mb-8'>画像一覧</h1>
      <div className='mb-4'>
        <Button onClick={handleNewButtonClick} color='blue'>
          新規作成
        </Button>
      </div>
      <div className='text-right mb-2'>
        <label htmlFor='perPage' className='mr-2'>
          表示件数:
        </label>
        <select
          id='perPage'
          value={perPage}
          onChange={handlePerPageChange}
          className='mt-1'
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      <div className='mb-4'>
        <Pagination
          onPageChange={onPageChange}
          totalPages={1000}
          currentPage={pageIndex}
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4'>
        {idList.map((id) => (
          <ImageListItem key={id} fileId={id} onClick={handleImageClick}/>
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

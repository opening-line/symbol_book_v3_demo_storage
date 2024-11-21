import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import Pagination from "../../components/pagination.tsx";

const ImageGallery: React.FC = () => {
  const { page } = useParams<{ page: string }>()
  const [perPage, setPerPage] = useState<number>(20)
  const navigate = useNavigate()

  const pageIndex = useMemo(() => {
    if (page === undefined) return 0
    const toNumber = Number(page)
    if (isNaN(toNumber)) return 0
    return toNumber
  }, [page])

  useEffect(() => {}, [pageIndex, perPage])

  const handleImageClick = (id: number) => {
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

  const onPageChange = (page: number) => navigate(`/list/${page}`);

  return (
    <div className='container mx-auto px-4 pt-4'>
      <h1 className='text-2xl font-bold mb-8'>画像一覧</h1>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4'
        onClick={handleNewButtonClick}
      >
        新規作成
      </button>
      <div className='grid grid-cols-3 gap-4'>
        {idList.map((id) => (
          <div
            key={id}
            className='max-w-sm rounded overflow-hidden shadow-lg cursor-pointer'
            onClick={() => handleImageClick(id)}
          >
            {/*<img className="w-full" src={image.url} alt={image.alt}/>*/}
            <div className='px-6 py-4'>
              <div className='font-bold text-xl mb-2'>{id}</div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <Pagination onPageChange={onPageChange} totalPages={1000} currentPage={pageIndex}/>
      </div>
    </div>
  )
}

export default ImageGallery

import { useParams } from "react-router-dom"
import useGetImageFromBlockchain from "../../hooks/useGetImageFromBlockchain.ts"
import { useMemo } from "react"
import mime from "mime"

const Detail = () => {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetImageFromBlockchain(id)

  const mimeType = useMemo(() => {
    if (data && data.meta && data.meta.fileName) {
      return mime.getType(data.meta.fileName)
    }

    return null
  }, [data])

  return (
    <div className='container mx-auto'>
      <h1>Detail Page</h1>
      <p>Detail ID: {id}</p>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading image</p>
      ) : (
        <>
          {data && data.payload && mimeType ? (
            <img
              src={`data:${mimeType};base64,${data.payload}`}
              alt='Preview'
            />
          ) : (
            <img src='/no_image.svg' alt='Preview' />
          )}
        </>
      )}
    </div>
  )
}

export default Detail

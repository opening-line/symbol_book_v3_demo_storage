import { useParams } from "react-router-dom"
import useGetImageFromBlockchain from "../../hooks/useGetImageFromBlockchain.ts"

const Detail = () => {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetImageFromBlockchain(id)

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
          {data && data.payload && data.mime ? (
            <img
              src={`data:${data.mime};base64,${data.payload}`}
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

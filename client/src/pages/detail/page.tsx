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
          <img src={`data:image/png;base64,${data?.payload}`} alt='Preview' />
        </>
      )}
    </div>
  )
}

export default Detail

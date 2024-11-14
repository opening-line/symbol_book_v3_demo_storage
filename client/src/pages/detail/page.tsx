import { useParams } from "react-router-dom"

const Detail = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h1>Detail Page</h1>
      <p>Detail ID: {id}</p>
    </div>
  )
}

export default Detail

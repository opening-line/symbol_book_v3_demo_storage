import React from "react"
import useGetImageFromBlockchain from "../hooks/useGetImageFromBlockchain.ts"

type ImageDisplayProps = {
  fileId: number | string
}

const ImageListItem: React.FC<ImageDisplayProps> = ({ fileId }) => {
  const { data, loading, error } = useGetImageFromBlockchain(fileId.toString())

  return (
    <div>
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

export default ImageListItem

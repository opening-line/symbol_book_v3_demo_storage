import React, {useMemo} from "react"
import useGetImageFromBlockchain from "../hooks/useGetImageFromBlockchain.ts"
import mime from 'mime';

type ImageDisplayProps = {
  fileId: number | string
}

const ImageListItem: React.FC<ImageDisplayProps> = ({ fileId }) => {
  const { data, loading, error } = useGetImageFromBlockchain(fileId.toString())

  const mimeType = useMemo(() => {
    if (data && data.meta && data.meta.fileName) {
      return mime.getType(data.meta.fileName);
    }

    return null;
  }, [data])

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading image</p>
      ) : (
        <>
          {data && data.payload && mimeType ? (
            <img src={`data:${mimeType};base64,${data.payload}`} alt='Preview' />
          ) : (
            <img src='/no_image.svg' alt='Preview' />
          )}
        </>
      )}
    </div>
  )
}

export default ImageListItem

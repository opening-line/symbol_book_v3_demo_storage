import React, { useMemo } from "react"
import { Button } from "@headlessui/react"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import useGetImageFromBlockchain from "../hooks/useGetImageFromBlockchain.ts"

type ImageDisplayProps = {
  fileId: number | string
  onClick: (id: number | string) => void
}

const ImageListItem: React.FC<ImageDisplayProps> = ({ fileId, onClick }) => {
  const { data, loading, error } = useGetImageFromBlockchain(fileId.toString())

  const disabled = useMemo(() => {
    if (loading) return true
    if (error) return true
    return !data
  }, [data, loading, error])

  const handleClick = () => {
    if (!disabled) onClick(fileId)
  }

  return (
    <div
      className={`relative w-full rounded shadow-lg ${!disabled && "cursor-pointer"}`}
      onClick={handleClick}
    >
      <div className='h-[200px] border overflow-hidden'>
        {loading ? (
          <div className='h-full flex items-center justify-center'>
            <p>
              Loading
              <EllipsisHorizontalIcon className='h-5 w-5 inline'/>
            </p>
          </div>
        ) : error ? (
          <div className='h-full flex items-center justify-center'>
            <p className='text-center'>{error}</p>
          </div>
        ) : (
          <>
            {data && data.payload && data.mime ? (
              <Button as={React.Fragment}>
                {({hover}) => (
                  <img
                    src={`data:${data.mime};base64,${data.payload}`}
                    alt='Preview'
                    className={`h-full w-full object-contain transition-transform duration-300 ${
                      hover ? "scale-110" : "scale-100"
                    }`}
                  />
                )}
              </Button>
            ) : (
              <img
                src='/no_image.svg'
                alt='Preview'
                className='h-full w-full object-contain'
              />
            )}
          </>
        )}
      </div>
      <div className='absolute top-2 left-2'>
        <div className='px-2 py-1 rounded-md bg-gray-600/80 text-white'>
          {fileId}
        </div>
      </div>
      <div className='px-6 py-4'>
        {data && data.meta && (
          <>
            <span className='inline-block'>{data.meta.fileName}</span>
            <span className='inline-block text-sm text-gray-600'>{new Date(data.meta.timestamp).toLocaleString()}</span>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageListItem

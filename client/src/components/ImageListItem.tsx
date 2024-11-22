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
      className={`w-full rounded shadow-lg overflow-hidden ${!disabled && "cursor-pointer"}`}
      onClick={handleClick}
    >
      <div className='h-[200px] border'>
        {loading ? (
          <div className='h-full flex items-center justify-center'>
            <p>
              Loading
              <EllipsisHorizontalIcon className='h-5 w-5 inline' />
            </p>
          </div>
        ) : error ? (
          <div className='h-full flex items-center justify-center'>
            <p>No Image Found</p>
          </div>
        ) : (
          <>
            {data && data.payload && data.mime ? (
              <Button as={React.Fragment}>
                {({ hover }) => (
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
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{fileId}</div>
      </div>
    </div>
  )
}

export default ImageListItem

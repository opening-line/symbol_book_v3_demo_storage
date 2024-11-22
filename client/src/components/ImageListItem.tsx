import React from "react"
import { Button } from "@headlessui/react"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import useGetImageFromBlockchain from "../hooks/useGetImageFromBlockchain.ts"

type ImageDisplayProps = {
  fileId: number | string
}

const ImageListItem: React.FC<ImageDisplayProps> = ({ fileId }) => {
  const { data, loading, error } = useGetImageFromBlockchain(fileId.toString())

  return (
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
  )
}

export default ImageListItem

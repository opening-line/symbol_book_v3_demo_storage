import React, { useMemo } from "react"
import { Button } from "@headlessui/react"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import useGetImageFromBlockchain from "../hooks/useGetImageFromBlockchain.ts"
import styles from "./ImageListItem.module.css"

type ImageDisplayProps = {
  fileId: number | string
  onClick: (id: number | string) => void
}

const ImageListItem: React.FC<ImageDisplayProps> = ({
  fileId,
  onClick,
}) => {
  const { data, loading, error } = useGetImageFromBlockchain(
    fileId.toString(),
  )

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
      className={`${styles.container} ${
        !disabled && styles.containerNotDisabled
      }`}
      onClick={handleClick}
    >
      <div className={styles.imageWrapper}>
        {loading ? (
          <div className={styles.loading}>
            <p>
              Loading
              <EllipsisHorizontalIcon className={styles.loadingIcon} />
            </p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {data && data.payload && data.mime ? (
              <Button as={React.Fragment}>
                {({ hover }) => (
                  <img
                    src={`data:${data.mime};base64,${data.payload}`}
                    alt='Preview'
                    className={`${styles.image} ${
                      hover ? styles.imageHover : styles.imageNormal
                    }`}
                  />
                )}
              </Button>
            ) : (
              <img
                src='/no_image.svg'
                alt='Preview'
                className={styles.noImage}
              />
            )}
          </>
        )}
      </div>
      <div className={styles.fileIdWrapper}>
        <div className={styles.fileIdText}>{fileId}</div>
      </div>
      <div className={styles.fileMetadata}>
        {data && data.meta && (
          <>
            <span className={styles.fileName}>{data.meta.fileName}</span>
            <span className={styles.fileTimestamp}>
              {new Date(data.meta.timestamp).toLocaleString()}
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageListItem

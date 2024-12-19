import { useParams } from "react-router-dom"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import useGetImageFromBlockchain from "../../hooks/useGetImageFromBlockchain.ts"
import Container from "../../components/Container.tsx"
import Button from "../../components/Button.tsx"
import TitleSection from "../../components/TitleSection.tsx"
import styles from "./page.module.css"

const Detail = () => {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useGetImageFromBlockchain(id)

  return (
    <Container>
      <TitleSection>画像詳細</TitleSection>

      <p className={styles.fileInfo}>
        <span className={styles.fileLabel}>ファイルID:</span>
        <span className={styles.fileValue}>{id}</span>
      </p>

      <p className={styles.fileInfo}>
        <span className={styles.fileLabel}>ファイル名:</span>
        <span className={styles.fileValue}>
          {data && data.meta && data.meta.fileName ? (
            <span>{data.meta.fileName}</span>
          ) : (
            <span>不明</span>
          )}
        </span>
      </p>

      <p className={styles.fileInfo}>
        <span className={styles.fileLabel}>アップロード日付:</span>
        <span className={styles.fileValue}>
          {data && data.meta && data.meta.timestamp ? (
            <span>{`${new Date(data.meta.timestamp).toLocaleString()}`}</span>
          ) : (
            <span>不明</span>
          )}
        </span>
      </p>

      <div className={styles.imageContainer}>
        {loading ? (
          <div className={styles.loading}>
            Loading
            <EllipsisHorizontalIcon className={styles.loadingIcon} />
          </div>
        ) : error ? (
          <div>Error loading image</div>
        ) : (
          <div className={styles.imageWrapper}>
            {data && data.payload && data.mime ? (
              <img
                src={`data:${data.mime};base64,${data.payload}`}
                className={styles.image}
                alt='Preview'
              />
            ) : (
              <img
                src='/no_image.svg'
                className={styles.noImage}
                alt='Preview'
              />
            )}
          </div>
        )}
      </div>
      <div className={styles.backButton}>
        <Button onClick={() => window.history.back()}>戻る</Button>
      </div>
    </Container>
  )
}

export default Detail

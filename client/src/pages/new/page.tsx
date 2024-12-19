import React, {
  useState,
  ChangeEvent,
  DragEvent,
  useRef,
  useCallback,
  FormEvent,
  useEffect,
} from "react"
import useUploadToBlockchain from "../../hooks/useUploadToBlockchain.ts"
import { useNavigate } from "react-router-dom"
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react"
import { ArrowPathIcon } from "@heroicons/react/24/solid"
import Container from "../../components/Container.tsx"
import Button from "../../components/Button.tsx"
import useGetLatestFileIndex from "../../hooks/useGetLatestFileIndex.ts"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import TitleSection from "../../components/TitleSection.tsx"
import { Config } from "../../utils/config.ts"
import fileToMetadata from "../../utils/fileToMetadata.ts"
import styles from "./page.module.css"

const ImageCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const {
    data: fileIndexData,
    loading: loadingFileIndex,
    error: fileIndexError,
  } = useGetLatestFileIndex()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageHex, setImageHex] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(
    null,
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { upload, uploading, result, error } = useUploadToBlockchain()

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null)
      setImageHex(null)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)

    selectedFile.arrayBuffer().then((arrayBuffer) => {
      const uint8Array = new Uint8Array(arrayBuffer)
      const hexString = Array.from(uint8Array)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("")
      setImageHex(hexString)
    })
  }, [selectedFile])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setValidationError(null)

    if (!selectedFile || !imageHex) {
      setValidationError("ファイルを選択してください")
      return
    }

    const fileIndex = fileIndexData?.nextFileIndex

    if (fileIndex === undefined || fileIndex === null) {
      setValidationError("fileIndexが見つけられませんでした")
      return
    }

    const chunks = fileToMetadata(
      selectedFile,
      imageHex,
      fileIndex,
      Date.now(),
    )

    upload(chunks).then(() => {
      setIsOpen(true)
    })
  }

  const handleDialogClose = () => {
    if (fileIndexData?.nextFileIndex) {
      const pageIndex = Math.floor(fileIndexData.nextFileIndex / 10)
      navigate(`/list/${pageIndex}`)
    } else {
      navigate("/list")
    }
  }

  return (
    <Container>
      <TitleSection>新規アップロード</TitleSection>
      {loadingFileIndex ? (
        <div className={styles.loadingContainer}>
          Loading
          <EllipsisHorizontalIcon className={styles.loadingIcon} />
        </div>
      ) : fileIndexError ? (
        <>
          <p>An Error Occurred</p>
          <code>{JSON.stringify(fileIndexError)}</code>
        </>
      ) : (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          {uploading ? (
            <div className={styles.dragDropArea}>
              <p>
                画像をドラッグ＆ドロップするか、クリックしてアップロード
              </p>
            </div>
          ) : (
            <div
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={styles.dragDropArea}
              style={{ cursor: "pointer" }}
            >
              <p>
                画像をドラッグ＆ドロップするか、クリックしてアップロード
              </p>
              <input
                type='file'
                onChange={handleInputChange}
                accept='image/*'
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>
          )}

          <div className={styles.infoContainer}>
            <h1 className={styles.infoTitle}>情報</h1>
            <div className={styles.infoText}>
              ファイル名 {selectedFile && `${selectedFile.name}`}
            </div>
            <div className={styles.infoText}>
              データサイズ {imageHex && `${imageHex.length / 2} bytes`}
            </div>
            <div className={styles.infoText}>
              内部トランザクション数{" "}
              {imageHex && (
                <>
                  <span>{`約 ${Math.ceil(imageHex.length / 2048)} 個`}</span>
                  {Math.ceil(imageHex.length / 2048) > 100 && (
                    <>
                      <br />
                      <span className={styles.internalTransactionWarning}>
                        内部トランザクション数は100までしか対応していません。続行することはできますが、エラーになる可能性があります。
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={styles.previewContainer}>
            <h1 className={styles.previewTitle}>プレビュー</h1>
            <div className={styles.previewBox}>
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt='Preview'
                  className={styles.previewImage}
                />
              )}
            </div>
          </div>

          <div className={styles.dataContainer}>
            <h1 className={styles.dataTitle}>データ</h1>
            <div className={styles.dataBox}>{imageHex}</div>
          </div>

          <div className={styles.buttonGroup}>
            <Button
              type='submit'
              disabled={!selectedFile || uploading}
              color='blue'
            >
              {uploading ? (
                <>
                  <div className={styles.uploadingContainer}>
                    <ArrowPathIcon className={styles.uploadingIcon} />
                    <span className={styles.uploadingText}>
                      Uploading...
                    </span>
                  </div>
                </>
              ) : (
                "アップロード"
              )}
            </Button>
            {validationError && (
              <p className={styles.validationError}>{validationError}</p>
            )}
          </div>
        </form>
      )}

      <div>
        <Button onClick={() => navigate("/list")}>一覧へ戻る</Button>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => {}}
        transition
        className={styles.dialog}
      >
        <DialogBackdrop className={styles.dialogBackdrop} />
        <div className={styles.dialogContainer}>
          <DialogPanel className={styles.dialogPanel}>
            {error ? (
              <>
                <DialogTitle className={styles.dialogTitleError}>
                  エラーが発生しました
                </DialogTitle>
                <Description></Description>
                <p>
                  <span>エラー内容</span>
                  <span className={styles.dialogContent}>{error}</span>
                </p>
              </>
            ) : (
              <>
                <DialogTitle className={styles.dialogTitle}>
                  トランザクション送信完了
                </DialogTitle>
                <Description></Description>
                <p>
                  <span>トランザクションハッシュ</span>
                  {result && (
                    <a
                      href={`${Config.NODE_URL}/transactionStatus/${result.hash}`}
                      target='_blank'
                      rel='noreferrer noopener'
                      className={styles.link}
                    >
                      {result.hash}
                    </a>
                  )}
                </p>
              </>
            )}

            <div>
              <Button onClick={handleDialogClose}>一覧へ戻る</Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Container>
  )
}

export default ImageCreatePage

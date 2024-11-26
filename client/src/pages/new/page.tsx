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
import {
  numberToLittleEndianHexString,
  combineLittleEndianHexNumbers,
} from "../../utils/hexUtils.ts"
import Container from "../../components/Container.tsx"
import Button from "../../components/Button.tsx"
import useGetLatestFileIndex from "../../hooks/useGetLatestFileIndex.ts"
import { EllipsisHorizontalIcon } from "@heroicons/react/24/solid"
import TitleSection from "../../components/TitleSection.tsx"

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
  let [isOpen, setIsOpen] = useState(false)

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
    if (!selectedFile || !imageHex) {
      alert("ファイルを選択してください")
      return
    }
    // アップロード処理をここに追加
    console.log("ファイルをアップロード:", selectedFile)

    const splitChunks = (hex: string, chunkSize = 2048) => {
      const chunks = []
      for (let i = 0; i < hex.length; i += chunkSize) {
        chunks.push(hex.substring(i, i + chunkSize))
      }
      return chunks
    }

    const metadataObject = {
      fileName: selectedFile.name,
      timestamp: Date.now(),
    }

    const encoder = new TextEncoder()
    const metadataHex = Array.from(
      encoder.encode(JSON.stringify(metadataObject)),
    )
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")

    const fileIndex = fileIndexData?.nextFileIndex

    if (!fileIndex) {
      throw new Error("")
    }

    const imageChunks = splitChunks(imageHex)
    const metadataChunks = splitChunks(metadataHex)
    const headerVersion = "00000000"
    const headerReserve = "00000000"
    const headerLength = numberToLittleEndianHexString(
      1 + metadataChunks.length + imageChunks.length,
    )
    const headerMetadataOffset = "01000000"
    const headerPayloadOffset = numberToLittleEndianHexString(
      metadataChunks.length + 1,
    )
    const header = `${headerVersion}${headerReserve}${headerLength}${headerMetadataOffset}${headerPayloadOffset}`
    const chunks = [header, ...metadataChunks, ...imageChunks].map(
      (chunk, index) => {
        return {
          key: combineLittleEndianHexNumbers(fileIndex, index),
          chunk,
        }
      },
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
        <div className='flex items-center justify-start'>
          Loading
          <EllipsisHorizontalIcon className='w-5 h-5' />
        </div>
      ) : fileIndexError ? (
        <>
          <p>An Error Occurred</p>
          <code>{JSON.stringify(fileIndexError)}</code>
        </>
      ) : (
        <form onSubmit={handleSubmit} className='mb-4'>
          {uploading ? (
            <div className='border-2 border-dashed border-gray-300 p-6 text-center mb-4 cursor-wait text-gray-300'>
              <p>画像をドラッグ＆ドロップするか、クリックしてアップロード</p>
            </div>
          ) : (
            <div
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className='border-2 border-dashed border-gray-400 p-6 text-center mb-4'
              style={{ cursor: "pointer" }}
            >
              <p>画像をドラッグ＆ドロップするか、クリックしてアップロード</p>
              <input
                type='file'
                onChange={handleInputChange}
                accept='image/*'
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>
          )}

          <div>
            <h1>プレビュー</h1>
            <div className='h-[200px] border'>
              {previewUrl && (
                <img src={previewUrl} alt='Preview' className='h-full' />
              )}
            </div>
          </div>

          <div className='mb-4'>
            <h1>データ</h1>
            <div className='text-wrap break-words text-xs font-mono overflow-y-auto h-80 border'>
              {imageHex}
            </div>
          </div>

          <Button
            type='submit'
            disabled={!selectedFile || uploading}
            color='blue'
          >
            {uploading ? (
              <>
                <div className='flex justify-center items-center'>
                  <ArrowPathIcon className='w-8 h-8 rotate' />
                  <span className='inline-block ml-2'>Uploading...</span>
                </div>
              </>
            ) : (
              "アップロード"
            )}
          </Button>
        </form>
      )}

      <div>
        <Button onClick={() => navigate("/list")}>一覧へ戻る</Button>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => {}}
        transition
        className='fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-300 ease-out data-[closed]:opacity-0'
      >
        <DialogBackdrop className='fixed inset-0 bg-black/30' />
        <div className='fixed inset-0 flex w-screen items-center justify-center p-4'>
          <DialogPanel className='max-w-lg space-y-4 border bg-white p-12 rounded-md'>
            {error ? (
              <>
                <DialogTitle className='font-bold text-red-500'>
                  エラーが発生しました
                </DialogTitle>
                <Description></Description>
                <p>
                  <span className='block'>エラー内容</span>
                  <span className='break-all'>{JSON.stringify(error)}</span>
                </p>
              </>
            ) : (
              <>
                <DialogTitle className='font-bold'>
                  トランザクション送信完了
                </DialogTitle>
                <Description></Description>
                <p>
                  <span className='block'>トランザクションハッシュ</span>
                  <span className='break-all'>{result && result.hash}</span>
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

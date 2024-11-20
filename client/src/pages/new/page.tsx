import React, {
  useState,
  ChangeEvent,
  DragEvent,
  useRef,
  useCallback,
  FormEvent,
  useEffect,
} from "react"
import useUploadToBlockchain from "../../hooks/uploadToBlockchain.ts"
import { useNavigate } from "react-router-dom"
import {numberToLittleEndianHexString, combineHexNumbers} from "../../utils/hexUtils.ts";

const ImageCreatePage: React.FC = () => {
  const navigate = useNavigate()

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageHex, setImageHex] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const uploadToBlockchain = useUploadToBlockchain()

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
      const chunks = [];
      for (let i = 0; i < hex.length; i += chunkSize) {
        chunks.push(hex.substring(i, i + chunkSize));
      }
      return chunks;
    };

    const metadataObject = {
      fileName: selectedFile.name,
      timestamp: Date.now()
    }

    const encoder = new TextEncoder()
    const metadataHex = Array.from(encoder.encode(JSON.stringify(metadataObject)))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")

    const fileIndex = 0

    const imageChunks = splitChunks(imageHex)
    const metadataChunks = splitChunks(metadataHex)
    const headerVersion = '0000000000000000'
    const headerReserve = '0000000000000000'
    const headerMetadataOffset = '0000000000000000'
    const headerPayloadOffset = numberToLittleEndianHexString(metadataChunks.length)
    const header = `${headerVersion}${headerReserve}${headerMetadataOffset}${headerPayloadOffset}`
    const chunks = [
      header,
      ...metadataChunks,
      ...imageChunks,
    ].map((chunk, index) => {
      return {
        key: combineHexNumbers(fileIndex, index),
        chunk,
      }
    })

    console.log(chunks)

    uploadToBlockchain(chunks)
  }

  return (
    <div className='container mx-auto px-4 pt-4'>
      <h1 className='text-2xl font-bold mb-8'>新規アップロード</h1>
      <form onSubmit={handleSubmit} className='mb-4'>
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

        <div>
          <h1>プレビュー</h1>
          {previewUrl && (
            <img src={previewUrl} alt='Preview' className='max-h-80 mx-auto' />
          )}
        </div>

        <div className='mb-4'>
          <h1>データ</h1>
          <div className='text-wrap break-words text-xs font-mono overflow-y-auto max-h-80'>
            {imageHex}
          </div>
        </div>

        <button
          type='submit'
          className={`px-4 py-2 rounded ${!selectedFile ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700 text-white"}`}
          disabled={!selectedFile}
        >
          アップロード
        </button>
      </form>

      <div>
        <button
          onClick={() => navigate("/list")}
          className='px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded'
        >
          一覧へ戻る
        </button>
      </div>
    </div>
  )
}

export default ImageCreatePage

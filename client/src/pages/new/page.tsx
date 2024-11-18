import React, {
  useState,
  ChangeEvent,
  DragEvent,
  useRef,
  useCallback,
  FormEvent,
  useEffect,
} from "react"

const ImageCreatePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageHex, setImageHex] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    if (!selectedFile) {
      alert("ファイルを選択してください")
      return
    }
    // アップロード処理をここに追加
    console.log("ファイルをアップロード:", selectedFile)
  }

  return (
    <div className='container mx-auto px-4 pt-4'>
      <h1 className='text-2xl font-bold mb-8'>新規アップロード</h1>
      <form onSubmit={handleSubmit}>
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

      <div className='mt-4'>
        <button
          onClick={() => window.history.back()}
          className='px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded'
        >
          一覧へ戻る
        </button>
      </div>
    </div>
  )
}

export default ImageCreatePage

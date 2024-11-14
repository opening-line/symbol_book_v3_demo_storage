import React, { useState, ChangeEvent, FormEvent } from "react"

const ImageUploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (file) {
      setSelectedFile(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
    <div className='image-upload-form'>
      <form onSubmit={handleSubmit}>
        <label>
          画像をアップロードしてください:
          <input type='file' onChange={handleFileChange} accept='image/*' />
        </label>
        {previewUrl && (
          <div>
            <img
              src={previewUrl}
              alt='Preview'
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        )}
        <button type='submit'>アップロード</button>
      </form>
    </div>
  )
}

export default ImageUploadForm

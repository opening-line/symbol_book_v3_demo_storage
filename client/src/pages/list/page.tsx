import React from "react"
import { useNavigate } from "react-router-dom"

interface Image {
  id: number
  url: string
  alt: string
}

const images: Image[] = [
  { id: 1, url: "https://example.com/image1.jpg", alt: "Image 1" },
  { id: 2, url: "https://example.com/image2.jpg", alt: "Image 2" },
  { id: 3, url: "https://example.com/image3.jpg", alt: "Image 3" },
  // ... other images
]

const ImageGallery: React.FC = () => {
  const navigate = useNavigate()

  const handleImageClick = (id: number) => {
    navigate(`/detail/${id}`)
  }

  const handleNewButtonClick = () => {
    navigate("/new");
  };

  return (
    <div className='container mx-auto px-4 pt-4'>
      <h1 className='text-2xl font-bold mb-8'>画像一覧</h1>
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4'
        onClick={handleNewButtonClick}
      >
        新規作成
      </button>
      <div className='grid grid-cols-3 gap-4'>
        {images.map((image) => (
          <div
            key={image.id}
            className='max-w-sm rounded overflow-hidden shadow-lg cursor-pointer'
            onClick={() => handleImageClick(image.id)}
          >
            <img className='w-full' src={image.url} alt={image.alt}/>
            <div className='px-6 py-4'>
              <div className='font-bold text-xl mb-2'>{image.alt}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageGallery

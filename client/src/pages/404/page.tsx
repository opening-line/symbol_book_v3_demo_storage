import React from "react"
import { Link } from "react-router-dom"

const NotFoundPage: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='text-center'>
        <h1 className='text-9xl font-bold text-gray-800'>404</h1>
        <p className='text-2xl mt-4'>Page Not Found</p>
        <p className='text-gray-600 mt-2'>
          申し訳ありませんが、お探しのページは見つかりませんでした。
        </p>
        <Link
          to='/'
          className='mt-6 inline-block px-4 py-2 border rounded-lg text-white bg-blue-500 hover:bg-blue-700'
        >
          ホームへ戻る
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage

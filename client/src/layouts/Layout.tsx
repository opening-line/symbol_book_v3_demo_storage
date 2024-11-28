import React from "react"
import { Outlet, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import usePrivateKeyStorage from "../hooks/usePrivateKeyStorage.ts"

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const [_, setPrivateKey] = usePrivateKeyStorage()

  const handleLogout = () => {
    setPrivateKey("")
    navigate("/")
  }

  return (
    <div>
      <header>
        <Navbar handleLogout={handleLogout} />
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  )
}

function Navbar({ handleLogout }: { handleLogout: () => void }) {
  return (
    <nav className='bg-gray-800 text-white px-4 py-2 flex items-center justify-between'>
      <div className='flex items-center space-x-6'>
        <div className='text-lg font-bold flex-shrink-0'>
          <span className='block sm:inline'>ブロックチェーン</span>
          <span className='block sm:inline'>ストレージ</span>
        </div>

        <div className='flex space-x-4'>
          <Link to='/list' className='text-sm font-medium hover:text-gray-300'>
            一覧
          </Link>
          <Link to='/new' className='text-sm font-medium hover:text-gray-300'>
            新規
          </Link>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className='bg-red-500 hover:bg-red-400 px-3 py-2 rounded-md text-sm font-medium'
      >
        ログアウト
      </button>
    </nav>
  )
}

export default Layout

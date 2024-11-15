import React from "react"
import { Outlet, Link } from "react-router-dom"
import { Menu, MenuItem } from "@headlessui/react"
import { useNavigate } from "react-router-dom"
import usePrivateKeyStorage from "../hooks/usePrivateKeyStorage.ts"

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const [_a, _b, deletePrivateKey] = usePrivateKeyStorage()

  const handleLogout = () => {
    deletePrivateKey()
    navigate("/")
  }

  return (
    <div>
      <header>
        <nav className='bg-gray-800'>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              <Menu>
                <div className='flex space-x-4'>
                  <div className='flex space-x-4'>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to='/list'
                          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${focus ? "bg-gray-700 text-white" : ""}`}
                        >
                          List
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          to='/new'
                          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${focus ? "bg-gray-700 text-white" : ""}`}
                        >
                          New
                        </Link>
                      )}
                    </MenuItem>
                  </div>
                </div>
                <div className='flex'>
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        onClick={handleLogout}
                        className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${focus ? "bg-gray-700 text-white" : ""}`}
                      >
                        ログアウト
                      </button>
                    )}
                  </MenuItem>
                </div>
              </Menu>
            </div>
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  )
}

export default Layout

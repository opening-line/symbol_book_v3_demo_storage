import React from "react"
import { Outlet, Link } from "react-router-dom"
import { Menu } from "@headlessui/react"

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        <nav className='bg-gray-800'>
          <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
              <div className='flex space-x-4'>
                <Menu>
                  <div className='flex space-x-4'>
                    <Menu.Item>
                      {({ focus }) => (
                        <Link
                          to='/list'
                          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${focus ? "bg-gray-700 text-white" : ""}`}
                        >
                          List
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ focus }) => (
                        <Link
                          to='/new'
                          className={`text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium ${focus ? "bg-gray-700 text-white" : ""}`}
                        >
                          New
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu>
              </div>
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

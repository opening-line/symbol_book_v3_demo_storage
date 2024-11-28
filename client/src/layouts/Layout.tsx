import React, { useMemo } from "react"
import { Outlet, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import usePrivateKeyStorage from "../hooks/usePrivateKeyStorage.ts"
import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey } from "symbol-sdk"
import { Config } from "../utils/config.ts"

const Layout: React.FC = () => {
  const navigate = useNavigate()
  const [privateKey, setPrivateKey] = usePrivateKeyStorage()

  const address = useMemo(() => {
    if (!privateKey) return ""
    const account = new KeyPair(new PrivateKey(privateKey))
    const facade = new SymbolFacade(Config.NETWORK)
    return facade.network.publicKeyToAddress(account.publicKey).toString()
  }, [privateKey])

  const handleLogout = () => {
    setPrivateKey("")
    navigate("/")
  }

  return (
    <div>
      <header>
        <Navbar handleLogout={handleLogout} address={address} />
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  )
}

type NavbarProps = {
  handleLogout: () => void
  address: string
}

function Navbar({ handleLogout, address }: NavbarProps) {
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

      <Menu as='div' className='relative inline-block text-left'>
        <MenuButton className='flex flex-col items-center justify-center w-10 h-10 bg-gray-700 text-white rounded-full text-xs font-bold'>
          <span>{address.slice(0, 4)}</span>
          <span>{address.slice(-4)}</span>
        </MenuButton>

        <MenuItems className='absolute right-0 mt-2 w-40 bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <div className='py-1'>
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    focus ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } block px-4 py-2 text-sm w-full text-left`}
                >
                  ログアウト
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </nav>
  )
}

export default Layout

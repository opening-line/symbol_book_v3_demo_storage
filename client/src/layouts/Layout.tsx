import React, { useMemo } from "react"
import { Outlet, Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import {
  Button,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react"
import usePrivateKeyStorage from "../hooks/usePrivateKeyStorage.ts"
import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey } from "symbol-sdk"
import { Config } from "../utils/config.ts"
import styles from "./Layout.module.css"

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
    const confirmed = window.confirm("本当にログアウトしますか？")
    if (confirmed) {
      setPrivateKey("")
      navigate("/")
    }
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
    <nav className={styles.navbar}>
      <div className={styles.navLeft}>
        <div className={styles.logo}>
          <span>ブロックチェーン</span>
          <span>ストレージ</span>
        </div>

        <div className={styles.links}>
          <Link className={styles.link} to='/list'>
            一覧
          </Link>
          <Link className={styles.link} to='/new'>
            新規
          </Link>
        </div>
      </div>

      <Menu as='div' className={styles.menuContainer}>
        <MenuButton className={styles.menuButton}>
          <span>{address.slice(0, 4)}</span>
          <span>{address.slice(-4)}</span>
        </MenuButton>

        <MenuItems className={styles.menuItems}>
          <div>
            <MenuItem>
              {({ focus }) => (
                <Button
                  as={Link}
                  to='/mypage'
                  className={`${styles.menuItem} ${
                    focus ? styles.menuItemFocus : ""
                  }`}
                >
                  マイページ
                </Button>
              )}
            </MenuItem>
            <MenuItem>
              {({ focus }) => (
                <Button
                  onClick={handleLogout}
                  className={`${styles.menuItem} ${
                    focus ? styles.menuItemFocus : ""
                  }`}
                >
                  ログアウト
                </Button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </nav>
  )
}

export default Layout

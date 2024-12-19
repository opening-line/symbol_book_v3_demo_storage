import Container from "../../components/Container.tsx"
import TitleSection from "../../components/TitleSection.tsx"
import { useNavigate } from "react-router-dom"
import usePrivateKeyStorage from "../../hooks/usePrivateKeyStorage.ts"
import { useMemo, useState } from "react"
import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey } from "symbol-sdk"
import { Config } from "../../utils/config.ts"
import Button from "../../components/Button.tsx"
import styles from "./page.module.css"

const Detail = () => {
  const navigate = useNavigate()
  const [privateKey, setPrivateKey] = usePrivateKeyStorage()
  const [isVisible, setIsVisible] = useState(false)

  const address = useMemo(() => {
    if (!privateKey) return null
    const account = new KeyPair(new PrivateKey(privateKey))
    const facade = new SymbolFacade(Config.NETWORK)
    return facade.network.publicKeyToAddress(account.publicKey).toString()
  }, [privateKey])

  const maskedKey = useMemo(() => {
    if (!privateKey) return ""
    return "*".repeat(privateKey.length)
  }, [privateKey])

  const handleLogout = () => {
    const confirmed = window.confirm("本当にログアウトしますか？")
    if (confirmed) {
      setPrivateKey("")
      navigate("/")
    }
  }

  const copyToClipboard =
    (value: string | null, text: string) => async () => {
      try {
        if (!value) {
          alert("コピーに失敗しました。")
          return
        }
        await navigator.clipboard.writeText(value)
        alert(`${text}をコピーしました！`)
      } catch (err) {
        alert("コピーに失敗しました。")
      }
    }

  return (
    <Container>
      <TitleSection>マイページ</TitleSection>

      <p className={styles.containerText}>
        <span className={styles.sectionTitle}>アドレス</span>
        <div>
          <div className={`${styles.addressRow} ${styles.sm}`}>
            <div className={`${styles.keyBox} ${styles.sm}`}>
              <span className={styles.textSmall}>{address}</span>
            </div>
            <button
              onClick={copyToClipboard(address, "アドレス")}
              className={styles.button}
            >
              コピーする
            </button>
          </div>
        </div>
      </p>

      <div className={styles.privateKeyContainer}>
        <span className={styles.sectionTitle}>秘密鍵</span>
        <div>
          <div className={`${styles.privateKeyRow} ${styles.sm}`}>
            <div className={`${styles.keyBox} ${styles.sm}`}>
              <span className={`${styles.textSmall} ${styles.monoFont}`}>
                {isVisible ? privateKey : maskedKey}
              </span>
            </div>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className={`${styles.button} ${styles.buttonBlue}`}
            >
              {isVisible ? "隠す" : "閲覧する"}
            </button>
            <button
              onClick={copyToClipboard(privateKey, "秘密鍵")}
              className={styles.button}
            >
              コピーする
            </button>
          </div>
        </div>
      </div>

      <div>
        <Button color='red' onClick={handleLogout}>
          ログアウト
        </Button>
      </div>
    </Container>
  )
}

export default Detail

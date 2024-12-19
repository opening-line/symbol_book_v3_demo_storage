import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { randomBytes } from "crypto"
import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey } from "symbol-sdk"
import usePrivateKeyStorage from "../../hooks/usePrivateKeyStorage.ts"
import { Config } from "../../utils/config.ts"
import styles from "./page.module.css"

function GenerateKeyPage() {
  const [privateKey, setPrivateKey] = useState("")
  const [address, setAddress] = useState("")
  const navigate = useNavigate()
  const [_, setStoragePrivateKey] = usePrivateKeyStorage()

  const generateNewKey = () => {
    const newPrivateKey = randomBytes(32).toString("hex").toUpperCase()
    setPrivateKey(newPrivateKey)
    const account = new KeyPair(new PrivateKey(newPrivateKey))
    const facade = new SymbolFacade(Config.NETWORK)
    setAddress(facade.network.publicKeyToAddress(account.publicKey))
  }

  useEffect(() => {
    generateNewKey()
  }, [])

  const handleNavigate = () => {
    setStoragePrivateKey(privateKey)
    navigate("/list")
  }

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className='space-y-6'></div>
        <h1 className={styles.title}>新規秘密鍵生成</h1>
        {privateKey && (
          <div className={styles.formGroup}>
            <label className={styles.label}>生成された秘密鍵</label>
            <div>
              <input
                type='text'
                value={privateKey}
                readOnly
                className={styles.input}
              />
            </div>
          </div>
        )}
        <div className={styles.formGroup}>
          <label className={styles.label}>生成されたアドレス</label>
          <div>
            <input
              type='text'
              value={address}
              readOnly
              className={styles.input}
            />
          </div>
        </div>
        <button
          onClick={handleNavigate}
          className={`${styles.button} ${styles.greenButton}`}
        >
          この鍵でログインする
        </button>
        <button
          onClick={generateNewKey}
          className={`${styles.button} ${styles.blueButton}`}
        >
          違う鍵を生成する
        </button>
        <hr className={styles.divider} />
        <button
          onClick={() => navigate("/")}
          className={`${styles.button} ${styles.redButton}`}
        >
          ログインページへ戻る
        </button>
      </div>
    </div>
  )
}

export default GenerateKeyPage

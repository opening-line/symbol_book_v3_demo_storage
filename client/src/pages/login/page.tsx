import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"
import usePrivateKeyStorage from "../../hooks/usePrivateKeyStorage.ts"
import isValidPrivateKey from "../../utils/isValidPrivateKey.ts"
import styles from "./page.module.css"

function LoginPage() {
  const [privateKey, setPrivateKey] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [storagePrivateKey, setStoragePrivateKey] = usePrivateKeyStorage()

  useEffect(() => {
    if (storagePrivateKey && isValidPrivateKey(storagePrivateKey)) {
      navigate("/list")
    }
  }, [storagePrivateKey])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidPrivateKey(privateKey)) {
      setStoragePrivateKey(privateKey)
      navigate("/list")
    } else {
      setError("秘密鍵は64文字の16進数である必要があります。")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.length <= 64 && /^[0-9a-fA-F]*$/.test(value)) {
      setPrivateKey(value)
      setError("")
    }
  }

  const handleRegisterNavigate = () => {
    navigate("/register")
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>ログイン</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>秘密鍵（16進数64文字）</label>
            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                value={privateKey}
                onChange={handleChange}
                className={styles.input}
              />
              <div
                className={styles.iconWrapper}
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeIcon className={styles.icon} />
                ) : (
                  <EyeSlashIcon className={styles.icon} />
                )}
              </div>
            </div>
            {error && <p className={styles.error}>{error}</p>}
          </div>
          <button type='submit' className={styles.submitButton}>
            ログイン
          </button>
          <hr className={styles.divider} />
          <button
            onClick={handleRegisterNavigate}
            className={styles.registerButton}
          >
            新規鍵生成
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

import Container from "../../components/Container.tsx"
import TitleSection from "../../components/TitleSection.tsx"
import { useNavigate } from "react-router-dom"
import usePrivateKeyStorage from "../../hooks/usePrivateKeyStorage.ts"
import { useMemo, useState } from "react"
import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey } from "symbol-sdk"
import { Config } from "../../utils/config.ts"
import Button from "../../components/Button.tsx"

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

  const copyToClipboard = (value: string | null, text: string) => async () => {
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

      <p className='flex flex-col mb-4'>
        <span className='text-lg font-bold'>アドレス</span>
        <div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4'>
            <div className='bg-gray-200 px-2 py-1 rounded w-full sm:w-auto max-w-full'>
              <span className='text-sm break-all'>{address}</span>
            </div>
            <button
              onClick={copyToClipboard(address, "アドレス")}
              className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'
            >
              コピーする
            </button>
          </div>
        </div>
      </p>

      <div className='flex flex-col mb-12'>
        <span className='text-lg font-bold'>秘密鍵</span>
        <div>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4'>
            <div className='bg-gray-200 px-2 py-1 rounded w-full sm:w-auto max-w-full'>
              <span className='text-sm break-all font-mono'>
                {isVisible ? privateKey : maskedKey}
              </span>
            </div>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              {isVisible ? "隠す" : "閲覧する"}
            </button>
            <button
              onClick={copyToClipboard(privateKey, "秘密鍵")}
              className='px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600'
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

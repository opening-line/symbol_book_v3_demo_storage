import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { randomBytes } from "crypto"
import { KeyPair, SymbolFacade } from "symbol-sdk/symbol"
import { PrivateKey } from "symbol-sdk"
import usePrivateKeyStorage from "../../hooks/usePrivateKeyStorage.ts"
import { Config } from "../../utils/config.ts"

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
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg'>
        <h1 className='text-2xl font-bold text-center'>新規秘密鍵生成</h1>
        {privateKey && (
          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>生成された秘密鍵</label>
            <div className='relative'>
              <input
                type='text'
                value={privateKey}
                readOnly
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
          </div>
        )}
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>生成されたアドレス</label>
          <div className='relative'>
            <input
              type='text'
              value={address}
              readOnly
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
        </div>
        <button
          onClick={handleNavigate}
          className='w-full px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400'
        >
          この鍵でログインする
        </button>
        <button
          onClick={generateNewKey}
          className='w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
        >
          違う鍵を生成する
        </button>
        <hr className='my-4 border-t-2 border-gray-300' />
        <button
          onClick={() => navigate("/")}
          className='w-full px-4 py-2 mt-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400'
        >
          ログインページへ戻る
        </button>
      </div>
    </div>
  )
}

export default GenerateKeyPage

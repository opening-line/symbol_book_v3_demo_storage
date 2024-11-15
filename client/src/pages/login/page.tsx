import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"

function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidHex(password)) {
      navigate("/list")
    } else {
      setError("秘密鍵は64文字の16進数である必要があります。")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.length <= 64 && /^[0-9a-fA-F]*$/.test(value)) {
      setPassword(value)
      setError("")
    }
  }

  const handleRegisterNavigate = () => {
    navigate("/register")
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const isValidHex = (str: string) => /^[0-9a-fA-F]{64}$/.test(str)

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg'>
        <h1 className='text-2xl font-bold text-center'>ログイン</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-2'>
              秘密鍵（16進数64文字）
            </label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handleChange}
                className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <div
                className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer'
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeIcon className='h-5 w-5 text-gray-500' />
                ) : (
                  <EyeSlashIcon className='h-5 w-5 text-gray-500' />
                )}
              </div>
            </div>
            {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
          </div>
          <button
            type='submit'
            className='w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
          >
            ログイン
          </button>
          <hr className='my-4 border-t border-gray-200' />
          <button
            onClick={handleRegisterNavigate}
            className='w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400'
          >
            新規鍵生成
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

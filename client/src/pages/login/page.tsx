import { useState } from "react"
import { useNavigate } from "react-router-dom"

function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
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
    } else {
      setError("秘密鍵は64文字の16進数である必要があります。")
    }
  }

  const isValidHex = (str: string) => /^[0-9a-fA-F]{64}$/.test(str)

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg'>
        <h1 className='text-2xl font-bold text-center'>ログイン</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700'>秘密鍵</label>
            <input
              type='password'
              value={password}
              onChange={handleChange}
              className='w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
            {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
          </div>
          <button
            type='submit'
            className='w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

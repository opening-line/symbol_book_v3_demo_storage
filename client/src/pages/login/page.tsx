import { useState } from "react"
import { useNavigate } from "react-router-dom"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ログインロジックを追加します。
    // 例: API接続や認証処理
    console.log("メール:", email)
    console.log("パスワード:", password)
    navigate("/list") // ログイン成功後にダッシュボードへリダイレクト
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg'>
        <h1 className='text-2xl font-bold text-center'>ログイン</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700'>メールアドレス</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>パスワード</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
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

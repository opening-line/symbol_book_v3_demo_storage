import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./layouts/Layout.tsx"
import NotFound from "./pages/404/page.tsx"
import Login from "./pages/login/page.tsx"
import Register from "./pages/register/page.tsx"
import New from "./pages/new/page.tsx"
import List from "./pages/list/page.tsx"
import Detail from "./pages/detail/page.tsx"
import About from "./pages/AboutPage.tsx"
import Example from "./pages/ExamplePage.tsx"
import usePrivateKeyStorage from "./hooks/usePrivateKeyStorage.ts"
import React, { useMemo } from "react"
import isValidPrivateKey from "./utils/isValidPrivateKey.ts"

const AuthRouter: React.FC = () => {
  const [privateKey] = usePrivateKeyStorage()

  const isAuthenticated = useMemo(() => {
    return privateKey ? isValidPrivateKey(privateKey) : false
  }, [privateKey])

  if (!isAuthenticated) {
    return <Navigate to='/' />
  }

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='about' element={<About />} />
        <Route path='example' element={<Example />} />
        <Route path='new' element={<New />} />
        <Route path='list' element={<Navigate to='0' />} />
        <Route path='list/:page' element={<List />} />
        <Route path='detail/:id' element={<Detail />} />
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='*' element={<AuthRouter />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

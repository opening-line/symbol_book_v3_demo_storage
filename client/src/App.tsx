import "./App.css"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import requireAuth from "./requireAuth.tsx"
import Layout from "./layouts/Layout.tsx"
import NotFound from "./pages/404/page.tsx"
import Login from "./pages/login/page.tsx"
import Register from "./pages/register/page.tsx"
import New from "./pages/new/page.tsx"
import List from "./pages/list/page.tsx"
import Detail from "./pages/detail/page.tsx"
import About from "./pages/AboutPage.tsx"
import Example from "./pages/ExamplePage.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Layout />}>
          <Route path='about' element={requireAuth(<About />)} />
          <Route path='example' element={requireAuth(<Example />)} />
          <Route path='new' element={requireAuth(<New />)} />
          <Route path='list' element={<Navigate to='0' />} />
          <Route path='list/:page' element={requireAuth(<List />)} />
          <Route path='detail/:id' element={requireAuth(<Detail />)} />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

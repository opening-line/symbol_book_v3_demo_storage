import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layouts/Layout.tsx"
import Login from "./pages/login/page.tsx"
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
        <Route path='/' element={<Layout />}>
          <Route path='about' element={<About />} />
          <Route path='example' element={<Example />} />
          <Route path='new' element={<New />} />
          <Route path='list' element={<List />} />
          <Route path='detail/:id' element={<Detail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

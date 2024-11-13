import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/IndexPage.tsx"
import About from "./pages/AboutPage.tsx"
import Example from "./pages/ExamplePage.tsx"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index />} />
        <Route path='/about' element={<About />} />
        <Route path='/example' element={<Example />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

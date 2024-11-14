import React from "react"
import { Outlet, Link } from "react-router-dom"

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to='/list'>List</Link>
            </li>
            <li>
              <Link to='/new'>New</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  )
}

export default Layout

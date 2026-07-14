import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

function Layout() {
  return (
    <>
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>HouseHive by M&O</p>
      </footer>
    </>
  )
}

export default Layout

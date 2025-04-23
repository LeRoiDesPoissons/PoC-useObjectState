import { FC } from "react"
import { NavLink, Outlet } from "react-router"

import './app.css';

export const App: FC = () => {
  return (
    <>
      <nav>
        <NavLink to="/">
          None
        </NavLink>
        <NavLink to="/person-form">
          Person form
        </NavLink>
        <NavLink to="/data-loader">
          Data loader
        </NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}

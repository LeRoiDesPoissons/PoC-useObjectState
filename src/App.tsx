import { FC } from "react"
import { NavLink, Outlet } from "react-router"

import './app.css';

export const App: FC = () => {
  return (
    <>
      <nav>
        <NavLink to="/" end>
          None
        </NavLink>
        <NavLink to="/person-form" end>
          Person form
        </NavLink>
        <NavLink to="/data-loader" end>
          Data loader
        </NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}

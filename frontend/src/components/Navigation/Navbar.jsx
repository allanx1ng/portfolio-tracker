import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

import CheckUser from "./CheckUser"
import ToggleDarkmode from "@/components/ToggleDarkmode"

const Navbar = () => {
  return (
    <>
      <div className="navbar top-0 bg-primary">
        <div className="navbar-start">
          {/* <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/portfolio">Portfolio</a>
              </li>
              <li>
                <a href="/donate">Donate</a>
              </li>
            </ul>
          </div> */}
          <a className="btn btn-ghost text-xl text-secondary" href="/">
            AppName
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-2 text-primary font-bold bg-white rounded-xl">
            <li>
              <a href="/" className="">
                Home
              </a>
            </li>
            <li>
              <a href="/portfolio" className="">
                Portfolio
              </a>
            </li>
            <li>
              <a href="/donate" className="">
                Donate
              </a>
            </li>
          </ul>
        </div>
        {/* <div className="navbar-center">
          <a className="btn">Button</a>
        </div> */}
        <div className="navbar-end">
          <CheckUser />
        </div>
      </div>
      {/* <div className="w-full mb-0 bg-primary h-1"></div> */}
    </>
  )
}

export default Navbar

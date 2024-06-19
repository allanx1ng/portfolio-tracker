import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

import CheckUser from "./CheckUser"
import ToggleDarkmode from "@/components/ToggleDarkmode"

const Navbar = () => {
  return (
    // <div className="bg-gray-800 text-white p-4 flex items-center justify-between h-24">
    //   <div className="flex-1">
    //     <span className="ml-8 font-semibold text-xl">AppName</span>
    //   </div>
    //   <div className="flex flex-1 justify-center">
    //     <a
    //       href="/"
    //       className="mx-4 font-semibold hover:underline transition duration-250 ease-in-out"
    //     >
    //       Home
    //     </a>
    //     <a
    //       href="/about"
    //       className="mx-4 font-semibold hover:underline transition duration-250 ease-in-out"
    //     >
    //       About
    //     </a>
    //     <a
    //       href="/services"
    //       className="mx-4 font-semibold hover:underline transition duration-250 ease-in-out"
    //     >
    //       Services
    //     </a>
    //     <a
    //       href="/contact"
    //       className="mx-4 font-semibold hover:underline transition duration-250 ease-in-out"
    //     >
    //       Contact
    //     </a>
    //   </div>
    //   <div className="flex-1 text-right">
    //     <div className="grid grid-cols-2 justify-center items-center">
    //       <ToggleDarkmode />
    //       <CheckUser />
    //     </div>
    //   </div>
    // </div>
    <>
      <div className="navbar bg-base-200">
        <div className="navbar-start">
          <div className="dropdown">
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
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">AppName</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="/">Home</a>
            </li>

            <li>
              <a href="/portfolio">Portfolio</a>
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
    </>
  )
}

export default Navbar

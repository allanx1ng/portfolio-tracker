"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import CheckUser from "./CheckUser"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    name: "Connections",
    href: "/test-connection",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    name: "Portfolio",
    href: "/test-connection/portfolio",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
]

const Navbar = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Floating pill navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-white/80 backdrop-blur-md border border-gray-200/60 shadow-sm rounded-2xl">
        <div className="px-5">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <a href="/" className="text-lg font-bold text-action-primary flex-shrink-0">
              AppName
            </a>

            {/* Desktop nav links */}
            <div className="hidden sm:flex items-center gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-150 ${
                      isActive
                        ? "bg-action-primaryLight text-action-primary"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                )
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <CheckUser />
              </div>

              {/* Mobile toggle */}
              <button
                type="button"
                className="sm:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="fixed top-20 left-4 right-4 z-40 bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-lg rounded-2xl sm:hidden">
          <div className="p-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-3 text-sm font-medium rounded-xl transition-colors ${
                    isActive
                      ? "bg-action-primaryLight text-action-primary"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </a>
              )
            })}
            <div className="pt-2 pb-1 px-3 border-t border-gray-100 mt-1">
              <CheckUser />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar

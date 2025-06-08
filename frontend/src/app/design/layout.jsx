"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Overview', href: '/design' },
  { name: 'Colors', href: '/design/colors' },
  { name: 'Typography', href: '/design/typography' },
  { name: 'Buttons', href: '/design/buttons' },
  { name: 'Forms', href: '/design/forms' },
  { name: 'Cards', href: '/design/cards' }
]

export default function DesignSystemLayout({ children }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">Design System</h1>
                </div>
                <nav className="ml-8 flex space-x-8">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                          isActive
                            ? 'border-b-2 border-indigo-500 text-gray-900'
                            : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

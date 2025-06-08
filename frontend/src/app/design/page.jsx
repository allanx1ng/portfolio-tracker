"use client"

import React from 'react'
import { theme } from '@/config/theme'
import Link from 'next/link'

export default function DesignSystemOverview() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Design System</h1>
          <p className="text-lg text-gray-600 mb-8">
            A comprehensive guide to our design language, components, and patterns.
            Built to ensure consistency and efficiency across our application.
          </p>
        </div>

        {/* Core Design Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Colors */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Colors</h2>
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-indigo-600" />
                <span className="text-sm text-gray-600">Primary</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-gray-200" />
                <span className="text-sm text-gray-600">Secondary</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-red-600" />
                <span className="text-sm text-gray-600">Danger</span>
              </div>
            </div>
            <Link href="/design/colors" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View color system →
            </Link>
          </div>

          {/* Typography */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Typography</h2>
            <div className="space-y-3 mb-4">
              <div className="space-y-1">
                <h4 className="text-2xl font-bold">Heading</h4>
                <p className="text-base">Body text</p>
                <p className="text-sm">Small text</p>
              </div>
            </div>
            <Link href="/design/typography" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View typography system →
            </Link>
          </div>

          {/* Components */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Components</h2>
            <div className="space-y-3 mb-4">
              <Link 
                href="/design/buttons" 
                className="block text-gray-700 hover:text-indigo-600"
              >
                Buttons
              </Link>
              <Link 
                href="/design/forms" 
                className="block text-gray-700 hover:text-indigo-600"
              >
                Forms
              </Link>
              <Link 
                href="/design/cards" 
                className="block text-gray-700 hover:text-indigo-600"
              >
                Cards
              </Link>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Usage Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">1. Consistency</h3>
              <p className="text-gray-600">
                Use components and styles consistently across your application. 
                Avoid mixing different button styles or color schemes within the same context.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">2. Accessibility</h3>
              <p className="text-gray-600">
                Ensure proper contrast ratios and provide meaningful text alternatives 
                for all interactive elements.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">3. Responsiveness</h3>
              <p className="text-gray-600">
                Components are designed to work across all screen sizes. 
                Use appropriate spacing and sizing variables.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import React from 'react'
import { Button, IconButton, LinkButton } from '@/components/ui/buttons'
import ButtonDemo from '@/components/ui/buttons/ButtonDemo'

export default function ButtonsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Button System</h1>
          <p className="mt-2 text-lg text-gray-600">
            A comprehensive collection of button components following our design system
          </p>
        </div>

        {/* Examples in Context */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Common Usage Examples</h2>
          
          {/* Form Actions Example */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Form Actions</h3>
            <div className="flex items-center gap-4">
              <Button variant="primary">Save Changes</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          {/* Dialog Actions Example */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dialog Actions</h3>
            <div className="flex items-center gap-4">
              <Button variant="danger">Delete Account</Button>
              <Button variant="ghost">Cancel</Button>
            </div>
          </div>

          {/* Toolbar Example */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Toolbar Actions</h3>
            <div className="flex items-center gap-2">
              <IconButton
                variant="ghost"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                }
                aria-label="Edit"
              />
              <IconButton
                variant="ghost"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                }
                aria-label="Delete"
              />
              <IconButton
                variant="ghost"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                }
                aria-label="Share"
              />
            </div>
          </div>

          {/* Navigation Example */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Navigation Links</h3>
            <div className="flex items-center gap-4">
              <LinkButton>View Details</LinkButton>
              <LinkButton>Learn More</LinkButton>
              <LinkButton color="blue">Documentation</LinkButton>
            </div>
          </div>

          {/* Loading States Example */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Loading States</h3>
            <div className="flex items-center gap-4">
              <Button isLoading loadingText="Saving...">Save</Button>
              <Button variant="outline" isLoading loadingText="Loading...">Load More</Button>
            </div>
          </div>
        </div>

        {/* Component Demo */}
        <div className="bg-white rounded-lg shadow-sm">
          <ButtonDemo />
        </div>
      </div>
    </div>
  )
}

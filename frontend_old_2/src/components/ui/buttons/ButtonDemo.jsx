"use client"

import React from 'react'
import { Button, IconButton, LinkButton } from '.'
import { theme } from '@/config/theme'

const ButtonDemo = () => {
  return (
    <div className="p-8 space-y-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Button Component Examples</h1>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Variants</h2>
          <div className="flex flex-wrap gap-4">
            {Object.keys(theme.components.button.variants).map((variant) => (
              <Button key={variant} variant={variant}>{variant}</Button>
            ))}
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold border-b pb-2">Sizes</h2>
          <div className="flex flex-wrap items-center gap-4">
            {Object.keys(theme.components.button.sizes).map((size) => (
              <Button key={size} size={size}>
                {size} button
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold border-b pb-2">States</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
            <Button isLoading loadingText="Saving...">Save</Button>
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold border-b pb-2">Icon Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            {Object.keys(theme.components.icon.sizes).map((size) => (
              <IconButton
                key={size}
                size={size}
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                }
              />
            ))}
            <IconButton
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              }
              isRound
            />
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold border-b pb-2">Link Buttons</h2>
          <div className="flex flex-wrap items-center gap-4">
            {Object.keys(theme.components.link.colors).map((color) => (
              <LinkButton key={color} color={color}>
                {color} link
              </LinkButton>
            ))}
            <LinkButton disabled>Disabled Link</LinkButton>
            <LinkButton underline={false}>No Underline</LinkButton>
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold border-b pb-2">With Icons</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              }
            >
              Left Icon
            </Button>
            <Button
              rightIcon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              }
            >
              Right Icon
            </Button>
          </div>
        </section>

        <section className="space-y-4 mt-8">
          <h2 className="text-xl font-semibold border-b pb-2">Full Width</h2>
          <div className="space-y-4">
            <Button isFullWidth>Full Width Button</Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ButtonDemo

'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '@/hooks'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  width?: string
  position?: 'left' | 'right'
  className?: string
  style?: React.CSSProperties
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = 'w-full sm:max-w-sm',
  position = 'right',
  className = '',
  style
}: DrawerProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const [shouldRender, setShouldRender] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  const { bgColor, textColor } = useTheme()

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      // Small delay to ensure render happens before animation
      const timer = setTimeout(() => setIsVisible(true), 10)
      document.body.style.overflow = 'hidden'
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setShouldRender(false)
        document.body.style.overflow = 'unset'
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isMounted || !shouldRender) return null

  const drawerContent = (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed top-0 ${position === 'right' ? 'right-0' : 'left-0'} h-full ${width} z-[9999] shadow-2xl flex flex-col transition-transform duration-300 ${isVisible ? 'translate-x-0' : position === 'right' ? 'translate-x-full' : '-translate-x-full'} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Drawer'}
        style={{
          backgroundColor: bgColor,
          color: textColor,
          ...style
        }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex-1 font-semibold text-lg">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-md hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
            aria-label="Close drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
        {footer && (
          <div className="p-4 border-t border-border bg-opacity-5 bg-gray-500">
            {footer}
          </div>
        )}
      </div>
    </>
  )

  return createPortal(drawerContent, document.body)
}

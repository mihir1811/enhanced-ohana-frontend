'use client'

import React from 'react'
import { CopyPlus } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'

interface CompareButtonProps {
  product: {
    id: string | number;
    name?: string;
    price: string | number;
    images: string[];
  }
  productType: 'diamond' | 'gemstone' | 'jewelry' | 'watch'
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'full'
  showText?: boolean
}

const CompareButton: React.FC<CompareButtonProps> = ({
  product,
  productType,
  className = '',
  size = 'md',
  variant = 'icon',
  showText = false
}) => {
  const { addProduct, isProductInCompare, canAddMore } = useCompare()

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (isProductInCompare(String(product.id))) {
      return // Already in compare
    }
    
    if (!canAddMore()) {
      // You can integrate with your toast/notification system here
      alert('Maximum 4 products can be compared at once')
      return
    }
    
    addProduct(product, productType)
  }

  const isInCompare = isProductInCompare(String(product.id))
  const isDisabled = !canAddMore() && !isInCompare

  // Size variations
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  // Base styles
  const baseClasses = `
    rounded-full border transition-all duration-200 
    ${sizeClasses[size]}
    ${isInCompare 
      ? 'bg-blue-500 text-white border-blue-500' 
      : 'bg-white/90 hover:bg-white border-gray-200 text-gray-700'
    }
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
    ${className}
  `

  if (variant === 'full') {
    return (
      <button
        onClick={handleCompare}
        disabled={isDisabled}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
          ${isInCompare 
            ? 'bg-blue-500 text-white border-blue-500' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
          ${className}
        `}
        title={isInCompare ? 'Added to compare' : 'Add to compare'}
      >
        <CopyPlus className={iconSizes[size]} />
        {showText && (
          <span>{isInCompare ? 'Added' : 'Compare'}</span>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleCompare}
      disabled={isDisabled}
      className={baseClasses}
      title={isInCompare ? 'Added to compare' : 'Add to compare'}
    >
      <CopyPlus className={`${iconSizes[size]} ${isInCompare ? 'text-white' : ''}`} />
    </button>
  )
}

export default CompareButton

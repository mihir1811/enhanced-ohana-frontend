'use client'

import React from 'react'
import { CopyPlus } from 'lucide-react'
import { useCompare } from '@/hooks/useCompare'

interface CompareButtonProps {
  product: {
    id: string | number;
    name?: string;
    price?: string | number;
    totalPrice?: number;
    images?: string[];
    image1?: string | null;
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
  const { addProduct, isProductInCompare, canAddMore, maxProducts } = useCompare()

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (isProductInCompare(String(product.id))) {
      return // Already in compare
    }
    
    if (!canAddMore()) {
      // You can integrate with your toast/notification system here
      alert(`Maximum ${maxProducts} products can be compared at once`)
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

  // Base styles - use CSS variables
  const baseClasses = `
    rounded-full border transition-all duration-200 
    ${sizeClasses[size]}
    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
    ${className}
  `

  const baseStyle = isInCompare 
    ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' }
    : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }

  if (variant === 'full') {
    return (
      <button
        onClick={handleCompare}
        disabled={isDisabled}
        style={isInCompare 
          ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)', borderColor: 'var(--primary)' }
          : { backgroundColor: 'var(--card)', color: 'var(--foreground)', borderColor: 'var(--border)' }
        }
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
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
      style={baseStyle}
      title={isInCompare ? 'Added to compare' : 'Add to compare'}
    >
      <CopyPlus className={iconSizes[size]} />
    </button>
  )
}

export default CompareButton

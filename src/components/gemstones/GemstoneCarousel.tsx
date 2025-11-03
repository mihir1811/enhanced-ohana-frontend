'use client'

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { MoveLeft, MoveRight } from 'lucide-react'
import { SECTION_WIDTH } from '@/lib/constants'

interface GemstoneType {
  title: string
  img: string
  alt: string
}

interface GemstoneCarouselProps {
  shapes: GemstoneType[]
  selectedShapes: string[]
  onShapeSelect: (shape: string) => void
}

export function GemstoneCarousel({ shapes, selectedShapes, onShapeSelect }: GemstoneCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const visibleItems = useMemo(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2
      if (window.innerWidth < 768) return 3
      if (window.innerWidth < 1024) return 4
      return 6
    }
    return 6
  }, [])

  const maxIndex = shapes.length - visibleItems

  const updateCurrentIndexFromScroll = useCallback(() => {
    if (!carouselRef.current) return

    const scrollLeft = carouselRef.current.scrollLeft
    const itemWidth = carouselRef.current.scrollWidth / shapes.length
    const newIndex = Math.round(scrollLeft / itemWidth)

    if (newIndex !== currentIndex) {
      setCurrentIndex(Math.max(0, Math.min(newIndex, maxIndex)))
    }
  }, [currentIndex, maxIndex, shapes.length])

  const scrollToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return

    const newIndex = Math.max(0, Math.min(index, maxIndex))
    setCurrentIndex(newIndex)

    const itemWidth = carouselRef.current.scrollWidth / shapes.length
    carouselRef.current.scrollTo({
      left: newIndex * itemWidth,
      behavior: 'smooth'
    })
  }, [maxIndex, shapes.length])

  const handlePrev = useCallback(() => {
    if (currentIndex === 0) {
      scrollToIndex(maxIndex)
    } else {
      scrollToIndex(currentIndex - 1)
    }
  }, [currentIndex, maxIndex, scrollToIndex])

  const handleNext = useCallback(() => {
    if (currentIndex >= maxIndex) {
      scrollToIndex(0)
    } else {
      scrollToIndex(currentIndex + 1)
    }
  }, [currentIndex, maxIndex, scrollToIndex])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      handleNext()
    }
    if (touchStart - touchEnd < -50) {
      handlePrev()
    }
  }

  const handleGemstoneToggle = (gemstone: string) => {
    onShapeSelect(gemstone)
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (!carousel) return

    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        updateCurrentIndexFromScroll()
      }, 50)
    }

    carousel.addEventListener('scroll', handleScroll)

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', handleScroll)
      }
      clearTimeout(scrollTimeout)
    }
  }, [updateCurrentIndexFromScroll])

  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
    }

    autoplayIntervalRef.current = setInterval(() => {
      if (currentIndex >= maxIndex) {
        scrollToIndex(0)
      } else {
        handleNext()
      }
    }, 3000)
  }, [currentIndex, maxIndex, handleNext, scrollToIndex])

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current)
      autoplayIntervalRef.current = null
    }
  }, [])

  const toggleAutoplay = useCallback(() => {
    setIsAutoPlaying(prev => !prev)
  }, [])

  useEffect(() => {
    if (isAutoPlaying) {
      startAutoplay()
    } else {
      stopAutoplay()
    }

    return () => {
      stopAutoplay()
    }
  }, [isAutoPlaying, startAutoplay, stopAutoplay])

  return (
    <div className={`relative mb-0 px-4 max-w-[${SECTION_WIDTH}px] mx-auto`}>
      <div className='flex justify-between items-center'>
        <h2 className="text-3xl font-bold text-left mb-8" style={{ color: 'var(--foreground)' }}>
          Explore Gemstone Types
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            className="bg-white dark:bg-black p-2 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-gray-900 transition-all border border-gray-200 dark:border-gray-700"
            aria-label="Previous slide"
          >
            <MoveLeft className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>

          <button
            onClick={handleNext}
            className="bg-white dark:bg-black p-2 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-gray-900 transition-all border border-gray-200 dark:border-gray-700"
            aria-label="Next slide"
          >
            <MoveRight className="w-6 h-6 text-gray-700 dark:text-white" />
          </button>
        </div>
      </div>

      <button
        onClick={toggleAutoplay}
        className="absolute right-0 bottom-0 z-10 bg-white dark:bg-black p-2 rounded-full shadow-lg hover:bg-blue-50 dark:hover:bg-gray-900 transition-all mb-2 mr-2 border border-gray-200 dark:border-gray-700"
        aria-label={isAutoPlaying ? "Pause autoplay" : "Start autoplay"}
      >
        {isAutoPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-white">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-white">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>

      {/* Carousel Container */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {shapes.map((gemstone, index) => (
          <div
            key={gemstone.title}
            className="flex-none p-2 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6 px-2 snap-start"
          >
            <div
              className={`diamond-carousel-card rounded-full h-[300px] p-3 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                selectedShapes.includes(gemstone.title) 
                  ? 'selected ring-2 ring-purple-500 dark:ring-purple-400' 
                  : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleGemstoneToggle(gemstone.title);
              }}
            >
              <div className={`relative w-25 h-25 mb-1 flex items-center justify-center hover:scale-105 transition-transform ${!selectedShapes.includes(gemstone.title) ? 'dark:invert' : ''}`}>
                <Image
                  src={gemstone.img}
                  alt={gemstone.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  priority={index < 6}
                />
              </div>
              <h3 className="text-xs font-medium pt-5 text-foreground">{gemstone.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-purple-500 dark:bg-purple-400 w-4 shadow-md'
                : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

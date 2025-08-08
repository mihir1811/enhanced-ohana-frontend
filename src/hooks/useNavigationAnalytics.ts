import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  navigationTiming: number
  searchTiming: number
  renderTiming: number
}

export const useNavigationAnalytics = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    navigationTiming: 0,
    searchTiming: 0,
    renderTiming: 0
  })

  useEffect(() => {
    // Track navigation performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          metricsRef.current.navigationTiming = entry.duration
        }
        if (entry.entryType === 'measure') {
          if (entry.name === 'search-timing') {
            metricsRef.current.searchTiming = entry.duration
          }
          if (entry.name === 'render-timing') {
            metricsRef.current.renderTiming = entry.duration
          }
        }
      })
    })

    observer.observe({ entryTypes: ['navigation', 'measure'] })

    return () => observer.disconnect()
  }, [])

  const trackSearchInteraction = (searchTerm: string) => {
    performance.mark('search-start')
    // Simulate search timing
    setTimeout(() => {
      performance.mark('search-end')
      performance.measure('search-timing', 'search-start', 'search-end')
      
      // Log analytics event (in real app, this would go to analytics service)
      console.log('Search Analytics:', {
        searchTerm,
        timestamp: new Date().toISOString(),
        timing: performance.getEntriesByName('search-timing')[0]?.duration
      })
    }, 100)
  }

  const trackNavigationClick = (href: string, label: string) => {
    // Log navigation analytics (in real app, this would go to analytics service)
    console.log('Navigation Analytics:', {
      href,
      label,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  const getMetrics = () => metricsRef.current

  return {
    trackSearchInteraction,
    trackNavigationClick,
    getMetrics
  }
}

export default useNavigationAnalytics

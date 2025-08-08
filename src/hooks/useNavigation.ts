import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface UseNavigationReturn {
  searchQuery: string
  setSearchQuery: (query: string) => void
  recentSearches: string[]
  isSearchFocused: boolean
  setIsSearchFocused: (focused: boolean) => void
  handleSearch: (query?: string) => void
  handleSearchSuggestion: (suggestion: string) => void
  clearSearch: () => void
}

export const useNavigation = (): UseNavigationReturn => {
  const [searchQuery, setSearchQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to parse recent searches:', error)
        localStorage.removeItem('recentSearches')
      }
    }
  }, [])

  const saveRecentSearch = useCallback((query: string) => {
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }, [recentSearches])

  const handleSearch = useCallback((query?: string) => {
    const searchTerm = query || searchQuery
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm.trim())
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
      setIsSearchFocused(false)
    }
  }, [searchQuery, router, saveRecentSearch])

  const handleSearchSuggestion = useCallback((suggestion: string) => {
    setSearchQuery(suggestion)
    saveRecentSearch(suggestion)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    setIsSearchFocused(false)
  }, [router, saveRecentSearch])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setIsSearchFocused(false)
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    recentSearches,
    isSearchFocused,
    setIsSearchFocused,
    handleSearch,
    handleSearchSuggestion,
    clearSearch
  }
}

export default useNavigation

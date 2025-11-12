import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import jobService from '@/services/job.service'
import useDebounce from '@/hooks/useDebounce'

interface SearchAutocompleteProps {
    value: string
    onChange: (value: string) => void
    onSearch: (e: React.FormEvent) => void
    placeholder?: string
    type?: 'keyword' | 'location' | 'all'
    className?: string
    showClearButton?: boolean
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
    value,
    onChange,
    onSearch,
    placeholder = 'Search...',
    type = 'all',
    className = '',
    showClearButton = true,
}) => {
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Apply debounce to search term to avoid excessive API calls
    const debouncedSearchTerm = useDebounce(value, 300)

    // Fetch suggestions when the debounced term changes
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (debouncedSearchTerm.length < 2) {
                setSuggestions([])
                return
            }

            setIsLoading(true)
            try {
                const results = await jobService.getSearchSuggestions(
                    debouncedSearchTerm,
                    type
                )
                setSuggestions(results)
            } catch (error) {
                console.error('Error fetching suggestions:', error)
                setSuggestions([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchSuggestions()
    }, [debouncedSearchTerm, type])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSuggestionClick = (suggestion: string) => {
        onChange(suggestion)
        setShowSuggestions(false)
        inputRef.current?.focus()
    }

    const handleClear = () => {
        onChange('')
        setSuggestions([])
        inputRef.current?.focus()
    }

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <form onSubmit={onSearch} className="flex relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>

                <Input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                        if (e.target.value.length >= 2) {
                            setShowSuggestions(true)
                        } else {
                            setShowSuggestions(false)
                        }
                    }}
                    onFocus={() =>
                        value.length >= 2 && setShowSuggestions(true)
                    }
                    placeholder={placeholder}
                    className="pl-10 pr-10 py-2 w-full rounded-md border border-input bg-background"
                />

                {showClearButton && value && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute inset-y-0 right-12 flex items-center pr-2"
                    >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                )}

                <Button
                    type="submit"
                    className="ml-2 bg-jobboard-purple hover:bg-jobboard-purple/90"
                >
                    Search
                </Button>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && value.length >= 2 && (
                <div className="absolute z-10 mt-1 w-full bg-card rounded-md shadow-lg border border-gray-200">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                            <p className="text-sm mt-1">
                                Loading suggestions...
                            </p>
                        </div>
                    ) : suggestions.length > 0 ? (
                        <ul className="max-h-60 overflow-auto py-1">
                            {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion)
                                    }
                                    className="px-4 py-2 hover:bg-accent cursor-pointer text-sm"
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No suggestions found
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default SearchAutocomplete

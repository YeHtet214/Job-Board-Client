import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number = 300): T {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cleanup function to clear the timeout if value changes before the delay
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export default useDebounce

import { useState, useEffect } from 'react'

/**
 * A custom hook that creates a debounced value from any value that might change rapidly
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 300ms)
 * @returns The debounced value that only updates after the specified delay
 */
function useDebounce<T>(value: T, delay: number = 300): T {
    // State to store the debounced value
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        // Set a timeout to update the debounced value after the specified delay
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cleanup function to clear the timeout if value changes before the delay
        // This ensures we don't update the debounced value if the input value
        // changes rapidly in succession
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay]) // Re-run the effect when value or delay changes

    return debouncedValue
}

export default useDebounce
